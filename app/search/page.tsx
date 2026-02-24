'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { TaskCard } from '@/components/task-card'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCurrentUser, isAuthenticated, initializeDemoUsers } from '@/lib/auth'
import { getUserTasks, Task, initializeDemoTasks } from '@/lib/tasks'
import Link from 'next/link'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [user, setUser] = useState<any>(null)
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Task[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [filterTag, setFilterTag] = useState('')
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [tags, setTags] = useState<string[]>([])

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
      const userTasks = getUserTasks(currentUser.id)
      setAllTasks(userTasks)
      
      // Extract all unique tags
      const allTags = new Set<string>()
      userTasks.forEach(task => {
        task.tags.forEach(tag => allTags.add(tag))
      })
      setTags(Array.from(allTags))
    }

    setIsLoading(false)
  }, [router])

  // Search and filter logic
  useEffect(() => {
    let filtered = allTasks

    // Text search
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery) ||
        task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }

    // Filter by tag
    if (filterTag) {
      filtered = filtered.filter(task => task.tags.includes(filterTag))
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus)
    }

    setResults(filtered)
  }, [query, allTasks, filterTag, filterPriority, filterStatus])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleClearFilters = () => {
    setQuery('')
    setFilterTag('')
    setFilterPriority('all')
    setFilterStatus('all')
  }

  if (isLoading) {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Search Tasks</h1>
          <p className="text-muted-foreground">Find and filter your tasks</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search tasks by title, description, or tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </div>
        </form>

        {/* Filters */}
        <Card className="p-4 mb-6 bg-card">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tag Filter */}
              <div>
                <label className="text-sm font-medium block mb-2">Filter by Tag</label>
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Tags</option>
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="text-sm font-medium block mb-2">Filter by Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium block mb-2">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <Button variant="outline" onClick={handleClearFilters} className="w-full">
              Clear All Filters
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Results {results.length > 0 && `(${results.length})`}
            </h2>
            <Link href="/tasks" className="text-primary hover:underline text-sm">
              View all tasks →
            </Link>
          </div>

          {results.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                {query || filterTag || filterPriority !== 'all' || filterStatus !== 'all'
                  ? 'No tasks match your search criteria'
                  : 'No tasks yet'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
                <Link href="/tasks">
                  <Button>View All Tasks</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {results.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
