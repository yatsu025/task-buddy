'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TaskCard } from '@/components/task-card'
import { getCurrentUser, isAuthenticated, initializeDemoUsers } from '@/lib/auth'
import { getUserTasks, getTaskStats, Task, initializeDemoTasks, sortTasksForDashboard } from '@/lib/tasks'
import { CheckCircle2, Clock, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [taskSections, setTaskSections] = useState<{ recent: Task[]; completed: Task[]; future: Task[] }>({
    recent: [],
    completed: [],
    future: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    initializeDemoUsers()
    initializeDemoTasks()

    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      const taskStats = getTaskStats(currentUser.id)
      setStats(taskStats)

      const tasks = getUserTasks(currentUser.id)
      setTaskSections(sortTasksForDashboard(tasks))
    }

    setIsLoading(false)
  }, [router])

  if (isLoading || !user || !stats) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here&apos;s your task summary for today</p>
        </div>
        <div className="mb-6 max-w-md">
          <label htmlFor="task-search-input" className="sr-only">Search tasks</label>
          <input
            id="task-search-input"
            type="search"
            placeholder="Search your tasks..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-border">
            <div className="text-muted-foreground text-sm font-medium">Total Tasks</div>
            <div className="text-3xl font-bold text-primary mt-2">{stats.total}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-secondary/5 to-transparent border-border">
            <div className="text-muted-foreground text-sm font-medium">Completed</div>
            <div className="text-3xl font-bold text-secondary mt-2">{stats.completed}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent/5 to-transparent border-border">
            <div className="text-muted-foreground text-sm font-medium">In Progress</div>
            <div className="text-3xl font-bold text-accent mt-2">{stats.inProgress}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-500/5 to-transparent border-border">
            <div className="text-muted-foreground text-sm font-medium">Pending</div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{stats.pending}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-destructive/5 to-transparent border-border">
            <div className="text-muted-foreground text-sm font-medium">High Priority</div>
            <div className="text-3xl font-bold text-destructive mt-2">{stats.highPriority}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-500/5 to-transparent border-border">
            <div className="text-muted-foreground text-sm font-medium">Overdue</div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{stats.overdue}</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Link href="/tasks" className="flex-1">
            <Button className="w-full" variant="outline">View All Tasks</Button>
          </Link>
          <Link href="/analytics" className="flex-1">
            <Button className="w-full" variant="outline">View Analytics</Button>
          </Link>
        </div>

        {/* Recent Tasks */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Clock className="size-6 text-primary" />
              Recent Tasks
            </h2>
            <Link href="/tasks" className="text-primary hover:underline text-sm">
              View all →
            </Link>
          </div>
          <Card className="p-4 border-primary/20 bg-primary/5">
            {taskSections.recent.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No recent tasks</p>
            ) : (
              <div className="grid gap-4">
                {taskSections.recent.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Completed Tasks */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="size-6 text-secondary" />
              Completed Tasks
            </h2>
            <Link href="/tasks" className="text-primary hover:underline text-sm">
              View all →
            </Link>
          </div>
          <Card className="p-4 border-border">
            {taskSections.completed.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No completed tasks yet</p>
            ) : (
              <div className="grid gap-4">
                {taskSections.completed.map(task => (
                  <TaskCard key={task.id} task={task} variant="completed" />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Future / Upcoming Tasks */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="size-6 text-accent" />
              Upcoming Tasks
            </h2>
            <Link href="/tasks" className="text-primary hover:underline text-sm">
              View all →
            </Link>
          </div>
          <Card className="p-4 border-accent/20 bg-accent/5">
            {taskSections.future.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No upcoming tasks</p>
            ) : (
              <div className="grid gap-4">
                {taskSections.future.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
