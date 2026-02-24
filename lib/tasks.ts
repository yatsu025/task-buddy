// Task management utilities for Task Buddy
export interface Task {
  id: string
  userId: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string | null
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

const TASKS_KEY = 'task-buddy:tasks'

// Get all tasks for a user
export function getUserTasks(userId: string): Task[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(TASKS_KEY)
  const allTasks: Task[] = data ? JSON.parse(data) : []
  return allTasks.filter(task => task.userId === userId)
}

// Get a single task
export function getTask(taskId: string): Task | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(TASKS_KEY)
  const allTasks: Task[] = data ? JSON.parse(data) : []
  return allTasks.find(task => task.id === taskId) || null
}

// Create a new task
export function createTask(userId: string, title: string, description: string, priority: 'low' | 'medium' | 'high' = 'medium', dueDate: string | null = null, tags: string[] = []): Task {
  const task: Task = {
    id: `task_${Date.now()}`,
    userId,
    title,
    description,
    priority,
    status: 'pending',
    dueDate,
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
  const allTasks: Task[] = data ? JSON.parse(data) : []
  const index = allTasks.findIndex(task => task.id === taskId)

  if (index === -1) return null

  const updatedTask = {
    ...allTasks[index],
    ...updates,
    id: allTasks[index].id,
    userId: allTasks[index].userId,
    createdAt: allTasks[index].createdAt,
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
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['personal', 'projects']
      }
    ]
    localStorage.setItem(TASKS_KEY, JSON.stringify(demoTasks))
  }
}
