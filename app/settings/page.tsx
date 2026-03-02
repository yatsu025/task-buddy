'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { getCurrentUser, isAuthenticated } from '@/lib/auth'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
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

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and account</p>
        </div>

        <Card className="p-6 mb-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Appearance</h3>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div>
              <p className="font-medium text-foreground">Dark / Light Mode</p>
              <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        <Card className="p-6 mb-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your profile, personal information, and account settings.
          </p>
          <Link href="/profile">
            <Button variant="outline">Go to Profile</Button>
          </Link>
        </Card>

        <div className="flex gap-4">
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full" variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
