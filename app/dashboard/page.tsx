'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TaskCard } from '@/components/task-card'
import { getCurrentUser, isAuthenticated, initializeDemoUsers } from '@/lib/auth'
import { getUserTasks, getTaskStats, Task, initializeDemoTasks } from '@/lib/tasks'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
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
      setRecentTasks(tasks.slice(0, 5))
    }

    setIsLoading(false)
  }, [router])

  if (isLoading || !user || !stats) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's your task summary for today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="text-muted-foreground text-sm font-medium">Total Tasks</div>
            <div className="text-3xl font-bold text-primary mt-2">{stats.total}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-secondary/5 to-transparent">
            <div className="text-muted-foreground text-sm font-medium">Completed</div>
            <div className="text-3xl font-bold text-secondary mt-2">{stats.completed}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent/5 to-transparent">
            <div className="text-muted-foreground text-sm font-medium">In Progress</div>
            <div className="text-3xl font-bold text-accent mt-2">{stats.inProgress}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-500/5 to-transparent">
            <div className="text-muted-foreground text-sm font-medium">Pending</div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{stats.pending}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-destructive/5 to-transparent">
            <div className="text-muted-foreground text-sm font-medium">High Priority</div>
            <div className="text-3xl font-bold text-destructive mt-2">{stats.highPriority}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-500/5 to-transparent">
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
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">Recent Tasks</h2>
            <Link href="/tasks" className="text-primary hover:underline text-sm">
              View all →
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No tasks yet</p>
              <Link href="/tasks">
                <Button>Create Your First Task</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recentTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
