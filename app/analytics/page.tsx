'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCurrentUser, isAuthenticated, initializeDemoUsers } from '@/lib/auth'
import {
  getUserTasks,
  getTaskStats,
  Task,
  initializeDemoTasks,
  getWeeklyTaskCompletion,
  getMonthlyTaskProgress,
  getMonthlyTaskProgressDaily
} from '@/lib/tasks'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from '@/components/ui/chart'

const chartConfig = {
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-1))'
  },
  inProgress: {
    label: 'In Progress',
    color: 'hsl(var(--chart-2))'
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-3))'
  },
  low: {
    label: 'Low',
    color: 'hsl(var(--chart-4))'
  },
  medium: {
    label: 'Medium',
    color: 'hsl(var(--chart-1))'
  },
  high: {
    label: 'High',
    color: 'hsl(var(--chart-5))'
  },
  day1: { label: 'Mon', color: 'hsl(var(--chart-1))' },
  day2: { label: 'Tue', color: 'hsl(var(--chart-2))' },
  day3: { label: 'Wed', color: 'hsl(var(--chart-3))' },
  day4: { label: 'Thu', color: 'hsl(var(--chart-4))' },
  day5: { label: 'Fri', color: 'hsl(var(--chart-5))' },
  day6: { label: 'Sat', color: 'hsl(var(--chart-1) / 0.8)' },
  day7: { label: 'Sun', color: 'hsl(var(--chart-2) / 0.8)' }
} satisfies ChartConfig

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [monthView, setMonthView] = useState<'daily' | 'weekly'>('daily')

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
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Prepare data for charts
  const statusData = [
    { name: 'pending', value: stats.pending, fill: 'var(--color-pending)' },
    { name: 'inProgress', value: stats.inProgress, fill: 'var(--color-inProgress)' },
    { name: 'completed', value: stats.completed, fill: 'var(--color-completed)' }
  ]

  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, fill: 'var(--color-low)' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, fill: 'var(--color-medium)' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, fill: 'var(--color-high)' }
  ]

  // Weekly task completion - real data from user tasks
  const weeklyData = getWeeklyTaskCompletion(user.id).map((d, i) => ({
    ...d,
    fill: `var(--color-day${i + 1})`
  }))

  // Monthly progress - daily + weekly views
  const monthlyDaily = getMonthlyTaskProgressDaily(user.id)
  const monthlyWeekly = getMonthlyTaskProgress(user.id)

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your productivity and task progress</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 via-background to-background border-border shadow-sm">
            <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Completion Rate</div>
            <div className="text-4xl font-bold text-primary mt-2">{completionRate}%</div>
            <p className="text-muted-foreground text-sm mt-2">{stats.completed} of {stats.total} tasks finished</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-chart-5/10 via-background to-background border-border shadow-sm">
            <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Overdue Tasks</div>
            <div className="text-4xl font-bold text-chart-5 mt-2">{stats.overdue}</div>
            <p className="text-muted-foreground text-sm mt-2">Requires immediate attention</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-chart-2/10 via-background to-background border-border shadow-sm">
            <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Active Tasks</div>
            <div className="text-4xl font-bold text-chart-2 mt-2">{stats.inProgress}</div>
            <p className="text-muted-foreground text-sm mt-2">Currently being worked on</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <Card className="p-6 border-border flex flex-col shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground">Task Status Distribution</h3>
              <p className="text-sm text-muted-foreground mt-1">Breakdown of tasks by their current phase</p>
            </div>
            <ChartContainer config={chartConfig} className="flex-1 min-h-[300px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} className="pt-6" />
              </PieChart>
            </ChartContainer>
          </Card>

          {/* Priority Distribution */}
          <Card className="p-6 border-border flex flex-col shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground">Task Priority Distribution</h3>
              <p className="text-sm text-muted-foreground mt-1">Workload distribution across priority levels</p>
            </div>
            <ChartContainer config={chartConfig} className="flex-1 min-h-[300px]">
              <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-muted/30" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1000}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="value" position="top" fill="hsl(var(--foreground))" fontSize={14} offset={12} fontWeight={600} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </Card>

          {/* Weekly Task Completion - Bar Chart */}
          <Card className="p-6 lg:col-span-2 border-border flex flex-col shadow-sm">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground">Weekly Performance</h3>
              <p className="text-sm text-muted-foreground mt-1">Daily completion metrics for the current week</p>
            </div>
            <ChartContainer config={chartConfig} className="flex-1 min-h-[350px]">
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-muted/30" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" radius={[6, 6, 0, 0]} animationDuration={1200}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="completed" position="top" fill="hsl(var(--foreground))" fontSize={14} offset={12} fontWeight={600} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </Card>

          {/* Monthly Progress - Line Chart */}
          <Card className="p-6 lg:col-span-2 border-border flex flex-col shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Growth & Progress</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Long-term completion trends and productivity growth
                </p>
              </div>
              <Tabs value={monthView} onValueChange={(v) => setMonthView(v as any)} className="w-fit">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="daily" className="px-4">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="px-4">Weekly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ChartContainer config={chartConfig} className="flex-1 min-h-[350px]">
              <LineChart
                data={monthView === 'daily' ? monthlyDaily : monthlyWeekly}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-muted/30" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--primary))"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: 'hsl(var(--primary))',
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))'
                  }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                  animationDuration={1500}
                >
                  <LabelList dataKey="completed" position="top" fill="hsl(var(--foreground))" fontSize={14} offset={15} fontWeight={600} />
                </Line>
              </LineChart>
            </ChartContainer>
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

      <Footer />
    </div>
  )
}
