// Task management utilities for Task Buddy
export interface Task {
  id: string
  userId: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string | null
  /** ISO date string (YYYY-MM-DD) */
  startDate: string | null
  /** HH:mm 24-hour format */
  startTime: string | null
  /** ISO date string (YYYY-MM-DD) */
  endDate: string | null
  /** HH:mm 24-hour format */
  endTime: string | null
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

const TASKS_KEY = 'task-buddy:tasks'

/** Normalize task from storage (backward compatibility for missing fields) */
function normalizeTask(raw: Partial<Task> & { id: string; userId: string }): Task {
  return {
    ...raw,
    id: raw.id,
    userId: raw.userId,
    title: raw.title ?? '',
    description: raw.description ?? '',
    priority: (raw.priority as Task['priority']) ?? 'medium',
    status: (raw.status as Task['status']) ?? 'pending',
    dueDate: raw.dueDate ?? null,
    startDate: raw.startDate ?? null,
    startTime: raw.startTime ?? null,
    endDate: raw.endDate ?? null,
    endTime: raw.endTime ?? null,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date()
  }
}

// Get all tasks for a user
export function getUserTasks(userId: string): Task[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(TASKS_KEY)
  const allTasks: (Partial<Task> & { id: string; userId: string })[] = data ? JSON.parse(data) : []
  return allTasks
    .filter(task => task.userId === userId)
    .map(normalizeTask)
}

// Get a single task
export function getTask(taskId: string): Task | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(TASKS_KEY)
  const allTasks: (Partial<Task> & { id: string; userId: string })[] = data ? JSON.parse(data) : []
  const found = allTasks.find(task => task.id === taskId)
  return found ? normalizeTask(found) : null
}

// Create a new task
export function createTask(
  userId: string,
  title: string,
  description: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  dueDate: string | null = null,
  tags: string[] = [],
  startDate: string | null = null,
  startTime: string | null = null,
  endDate: string | null = null,
  endTime: string | null = null
): Task {
  const task: Task = {
    id: `task_${Date.now()}`,
    userId,
    title,
    description,
    priority,
    status: 'pending',
    dueDate,
    startDate,
    startTime,
    endDate,
    endTime,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags
  }

  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(TASKS_KEY)
    const allTasks: Task[] = data ? JSON.parse(data) : []
    allTasks.push(task)
    localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks))
  }

  return task
}

// Update a task
export function updateTask(taskId: string, updates: Partial<Task>): Task | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(TASKS_KEY)
  const allTasks: (Partial<Task> & { id: string; userId: string })[] = data ? JSON.parse(data) : []
  const index = allTasks.findIndex(task => task.id === taskId)

  if (index === -1) return null

  const base = normalizeTask(allTasks[index])
  const updatedTask: Task = {
    ...base,
    ...updates,
    id: base.id,
    userId: base.userId,
    createdAt: base.createdAt,
    updatedAt: new Date()
  }

  allTasks[index] = updatedTask
  localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks))

  return updatedTask
}

// Delete a task
export function deleteTask(taskId: string): boolean {
  if (typeof window === 'undefined') return false
  const data = localStorage.getItem(TASKS_KEY)
  const allTasks: Task[] = data ? JSON.parse(data) : []
  const filteredTasks = allTasks.filter(task => task.id !== taskId)

  if (filteredTasks.length === allTasks.length) return false

  localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks))
  return true
}

// Get task statistics
export function getTaskStats(userId: string) {
  const tasks = getUserTasks(userId)
  
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
    overdue: tasks.filter(t => {
      if (t.status === 'completed' || !t.dueDate) return false
      return new Date(t.dueDate) < new Date()
    }).length
  }
}

/** Calculate task duration in minutes from start/end date+time */
export function getTaskDurationMinutes(task: Task): number | null {
  if (!task.startDate || !task.endDate) return null
  const [sYear, sMonth, sDay] = task.startDate.split('-').map(Number)
  const [eYear, eMonth, eDay] = task.endDate.split('-').map(Number)
  const startH = task.startTime ? parseInt(task.startTime.split(':')[0], 10) : 0
  const startM = task.startTime ? parseInt(task.startTime.split(':')[1], 10) : 0
  const endH = task.endTime ? parseInt(task.endTime.split(':')[0], 10) : 23
  const endM = task.endTime ? parseInt(task.endTime.split(':')[1], 10) : 59
  const startMs = new Date(sYear, sMonth - 1, sDay, startH, startM).getTime()
  const endMs = new Date(eYear, eMonth - 1, eDay, endH, endM).getTime()
  if (endMs < startMs) return null
  return Math.round((endMs - startMs) / (1000 * 60))
}

/** Format duration for display (e.g. "2h 30m" or "45m") */
export function formatTaskDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/** Format duration with days for longer spans */
export function formatTaskDurationFull(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h < 24) return m > 0 ? `${h}h ${m}m` : `${h} hours`
  const d = Math.floor(h / 24)
  const remainderH = h % 24
  const parts: string[] = []
  if (d > 0) parts.push(`${d} day${d !== 1 ? 's' : ''}`)
  if (remainderH > 0) parts.push(`${remainderH}h`)
  if (m > 0) parts.push(`${m}m`)
  return parts.join(' ') || `${minutes} minutes`
}

/** Days of week for analytics */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

/** Get weekly task completion counts (Mon–Sun) from actual task data */
export function getWeeklyTaskCompletion(userId: string): { day: string; completed: number; fill: string }[] {
  const tasks = getUserTasks(userId).filter(t => t.status === 'completed')
  const now = new Date()
  const dayOfWeek = (now.getDay() + 6) % 7 // Mon=0
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek)
  monday.setHours(0, 0, 0, 0)
  const counts = [0, 0, 0, 0, 0, 0, 0]
  const fills = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(200 90% 55%)',
    'hsl(280 70% 60%)'
  ]
  for (const t of tasks) {
    const updated = new Date(t.updatedAt)
    if (updated >= monday) {
      const diff = Math.floor((updated.getTime() - monday.getTime()) / (24 * 60 * 60 * 1000))
      if (diff >= 0 && diff < 7) counts[diff]++
    }
  }
  return DAYS.map((day, i) => ({ day, completed: counts[i], fill: fills[i] }))
}

/** Get monthly task progress (daily cumulative or weekly) for line chart */
export function getMonthlyTaskProgress(userId: string): { label: string; completed: number; week?: number }[] {
  const tasks = getUserTasks(userId).filter(t => t.status === 'completed')
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const data: { label: string; completed: number; week: number }[] = []
  for (let w = 0; w < 5; w++) {
    const weekStart = new Date(startOfMonth)
    weekStart.setDate(startOfMonth.getDate() + w * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    const count = tasks.filter(t => {
      const d = new Date(t.updatedAt)
      return d >= weekStart && d <= weekEnd
    }).length
    data.push({
      label: `Week ${w + 1}`,
      completed: count,
      week: w + 1
    })
  }
  return data
}

/** Monthly progress series by day (cumulative completions) */
export function getMonthlyTaskProgressDaily(userId: string): { day: number; label: string; completed: number; total: number }[] {
  const allTasks = getUserTasks(userId)
  const completedTasks = allTasks.filter(t => t.status === 'completed')
  const total = allTasks.length

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayDay = now.getDate()

  // Precompute day-of-month for completions in current month
  const completedDays: number[] = []
  for (const t of completedTasks) {
    const d = new Date(t.updatedAt)
    if (d.getFullYear() === year && d.getMonth() === month) {
      completedDays.push(d.getDate())
    }
  }

  const series: { day: number; label: string; completed: number; total: number }[] = []
  let cumulative = 0
  // Build histogram once then cumulative
  const dailyCounts = new Array<number>(daysInMonth + 1).fill(0)
  for (const d of completedDays) dailyCounts[d] = (dailyCounts[d] ?? 0) + 1
  for (let day = 1; day <= daysInMonth; day++) {
    if (day <= todayDay) cumulative += dailyCounts[day] ?? 0
    // Keep future days in-month flat (no projection)
    const safeCompleted = day <= todayDay ? cumulative : cumulative

    series.push({
      day,
      label: `${day}`,
      completed: safeCompleted,
      total
    })
  }
  return series
}

/** Sort tasks for dashboard: Recent (top), Completed (middle), Future (bottom) */
export function sortTasksForDashboard(tasks: Task[]): {
  recent: Task[]
  completed: Task[]
  future: Task[]
} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const completed = tasks
    .filter(t => t.status === 'completed')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const future = tasks
    .filter(t => {
      if (t.status === 'completed') return false
      const due = t.dueDate ? new Date(t.dueDate) : null
      const start = t.startDate ? new Date(t.startDate) : null
      return (due && due > today) || (start && start > today)
    })
    .sort((a, b) => {
      const aDate = a.startDate ? new Date(a.startDate) : (a.dueDate ? new Date(a.dueDate) : new Date(9999, 0))
      const bDate = b.startDate ? new Date(b.startDate) : (b.dueDate ? new Date(b.dueDate) : new Date(9999, 0))
      return aDate.getTime() - bDate.getTime()
    })

  const futureIds = new Set(future.map(f => f.id))
  const completedIds = new Set(completed.map(c => c.id))
  const recent = tasks
    .filter(t => !completedIds.has(t.id) && !futureIds.has(t.id))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return { recent, completed, future }
}

// Initialize demo tasks
export function initializeDemoTasks(): void {
  if (typeof window === 'undefined') return
  const data = localStorage.getItem(TASKS_KEY)
  if (!data) {
    const demoTasks: Task[] = [
      {
        id: 'task_1',
        userId: 'user_demo',
        title: 'Complete project proposal',
        description: 'Finish the Q1 project proposal and submit to manager',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['work', 'important']
      },
      {
        id: 'task_2',
        userId: 'user_demo',
        title: 'Review team feedback',
        description: 'Go through and respond to team feedback from last meeting',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['work', 'feedback']
      },
      {
        id: 'task_3',
        userId: 'user_demo',
        title: 'Update portfolio',
        description: 'Add recent projects to personal portfolio website',
        priority: 'low',
        status: 'pending',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['personal', 'projects']
      }
    ]
    localStorage.setItem(TASKS_KEY, JSON.stringify(demoTasks))
  }
}
