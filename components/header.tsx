'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCurrentUser, logoutUser } from '@/lib/auth'
import { useEffect, useState } from 'react'

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    logoutUser()
    router.push('/login')
  }

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center">
            <span className="font-bold text-lg text-primary">Task Buddy</span>
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition">
              Dashboard
            </Link>
            <Link href="/tasks" className="text-sm font-medium hover:text-primary transition">
              Tasks
            </Link>
            <Link href="/analytics" className="text-sm font-medium hover:text-primary transition">
              Analytics
            </Link>
            <Link href="/search" className="text-sm font-medium hover:text-primary transition">
              Search
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition">
              About
            </Link>
            <Link href="/help" className="text-sm font-medium hover:text-primary transition">
              Help
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <Link href="/profile" className="hidden sm:flex flex-col items-end hover:opacity-75 transition">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
