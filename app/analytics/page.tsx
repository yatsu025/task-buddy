'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCurrentUser, isAuthenticated, initializeDemoUsers } from '@/lib/auth'
import { getUserTasks, getTaskStats, Task, initializeDemoTasks } from '@/lib/tasks'
import Link from 'next/link'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts'

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
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

      const userTasks = getUserTasks(currentUser.id)
      setTasks(userTasks)
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

  // Prepare data for charts
  const statusData = [
    { name: 'Pending', value: stats.pending, fill: 'hsl(var(--chart-1))' },
    { name: 'In Progress', value: stats.inProgress, fill: 'hsl(var(--chart-2))' },
    { name: 'Completed', value: stats.completed, fill: 'hsl(var(--chart-3))' }
  ]

  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, fill: 'hsl(var(--chart-4))' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, fill: 'hsl(var(--chart-1))' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, fill: 'hsl(var(--chart-5))' }
  ]

  // Weekly data - mock data for demonstration
  const weeklyData = [
    { day: 'Mon', completed: 2 },
    { day: 'Tue', completed: 3 },
    { day: 'Wed', completed: 1 },
    { day: 'Thu', completed: 4 },
    { day: 'Fri', completed: 3 },
    { day: 'Sat', completed: 2 },
    { day: 'Sun', completed: 1 }
  ]

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your productivity and task progress</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="text-muted-foreground text-sm font-medium">Completion Rate</div>
            <div className="text-4xl font-bold text-primary mt-2">{completionRate}%</div>
            <p className="text-muted-foreground text-sm mt-2">{stats.completed} of {stats.total} tasks</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/5 to-transparent">
            <div className="text-muted-foreground text-sm font-medium">Overdue Tasks</div>
            <div className="text-4xl font-bold text-secondary mt-2">{stats.overdue}</div>
            <p className="text-muted-foreground text-sm mt-2">Tasks past due date</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/5 to-transparent">
            <div className="text-muted-foreground text-sm font-medium">Active Tasks</div>
            <div className="text-4xl font-bold text-accent mt-2">{stats.inProgress}</div>
            <p className="text-muted-foreground text-sm mt-2">Currently in progress</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Priority Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Task Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Weekly Activity */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Task Completion</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--secondary))' }}
                  name="Tasks Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Link href="/tasks" className="flex-1">
            <Button className="w-full" variant="outline">View All Tasks</Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full" variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
