'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCurrentUser, isAuthenticated, logoutUser, getAllUsers } from '@/lib/auth'
import { getTaskStats, getUserTasks } from '@/lib/tasks'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setName(currentUser.name)
      
      const taskStats = getTaskStats(currentUser.id)
      setStats(taskStats)
    }

    setIsLoading(false)
  }, [router])

  const handleSaveName = async () => {
    if (!user || !name.trim()) return

    setIsSaving(true)

    // Update user in localStorage
    if (typeof window !== 'undefined') {
      const users = getAllUsers()
      const userIndex = users.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex].name = name
        localStorage.setItem('task-buddy:users', JSON.stringify(users))
        
        // Update current user
        const updatedUser = { ...user, name }
        localStorage.setItem('task-buddy:current-user', JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
    }

    setIsSaving(false)
    setIsEditing(false)
  }

  const handleLogout = () => {
    logoutUser()
    router.push('/login')
  }

  const handleExportData = () => {
    if (!user) return

    const tasks = getUserTasks(user.id)
    const dataToExport = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      stats,
      tasks
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `task-buddy-export-${Date.now()}.json`
    link.click()
  }

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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <Card className="p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className="max-w-xs"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSaveName} disabled={isSaving || !name.trim()}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false)
                  setName(user.name)
                }}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {!isEditing && (
            <div className="pt-6 border-t">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Total Tasks</p>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Completed</p>
                  <p className="text-2xl font-bold text-secondary">{stats.completed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-accent">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Account Information */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="text-foreground">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account ID</label>
              <p className="text-foreground text-sm font-mono">{user.id}</p>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Get updates on task changes</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme for the app</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-destructive mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Data</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleExportData}>
              Download Data
            </Button>
            <p className="text-sm text-muted-foreground">
              Export your tasks and settings as a JSON file
            </p>
          </div>
        </Card>

        <Card className="p-6 border-destructive">
          <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
            <p className="text-sm text-muted-foreground">
              Sign out of your Task Buddy account
            </p>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full" variant="outline">Back to Dashboard</Button>
          </Link>
          <Link href="/tasks" className="flex-1">
            <Button className="w-full" variant="outline">View Tasks</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
