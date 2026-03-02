'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { getCurrentUser, logoutUser } from '@/lib/auth'
import { useEffect, useState } from 'react'
import { ChevronDown, Menu, User, Settings, HelpCircle, LogOut, Info, Mail, BarChart3, ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Primary nav: Dashboard, Search, About (per UX requirements) */
const primaryNavLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/search', label: 'Search' },
  { href: '/about', label: 'About' },
]

/** Secondary nav for authenticated users */
const secondaryNavLinks = [
  { href: '/tasks', label: 'Tasks' },
  { href: '/analytics', label: 'Analytics' },
]

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [profileSheetOpen, setProfileSheetOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    logoutUser()
    setProfileSheetOpen(false)
    router.push('/login')
  }

  const allNavLinks = [...primaryNavLinks, ...(user ? secondaryNavLinks : [])]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-lg text-primary">Task Buddy</span>
          </Link>

          {/* Desktop nav - Dashboard, Search, About + Tasks, Analytics */}
          <nav className="hidden md:flex gap-1 items-center">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: side menu, theme toggle, profile */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Side menu - mobile: full nav + Help/About/etc. Desktop: Help, About, Settings */}
            <Sheet open={sideMenuOpen} onOpenChange={setSideMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[300px] data-[state=open]:animate-in data-[state=closed]:animate-out">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6">
                  {/* Mobile: show nav links. Desktop: nav is in header, but we keep them for consistency */}
                  {allNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSideMenuOpen(false)}
                      className={cn(
                        'px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                        pathname === link.href ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-border my-2 pt-2" />
                  <Link href="/help" onClick={() => setSideMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted">
                    <HelpCircle className="size-4 text-muted-foreground" /> Help
                  </Link>
                  <Link href="/about" onClick={() => setSideMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted">
                    <Info className="size-4 text-muted-foreground" /> Information
                  </Link>
                  <a
                    href="mailto:support@taskbuddy.com"
                    onClick={() => setSideMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <Mail className="size-4 text-muted-foreground" /> Contact
                  </a>
                  <Link href="/about" onClick={() => setSideMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted">
                    <Info className="size-4 text-muted-foreground" /> About
                  </Link>
                  <Link href="/settings" onClick={() => setSideMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted">
                    <Settings className="size-4 text-muted-foreground" /> Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <ThemeToggle />

            {user ? (
              <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:inline-flex">
                  <Button variant="ghost" size="sm" className="gap-1">
                    More
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-44">
                  <DropdownMenuItem onSelect={() => router.push('/tasks')} className="gap-2">
                    <ListChecks className="size-4 text-muted-foreground" />
                    Tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/analytics')} className="gap-2">
                    <BarChart3 className="size-4 text-muted-foreground" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => router.push('/settings')} className="gap-2">
                    <Settings className="size-4 text-muted-foreground" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/help')} className="gap-2">
                    <HelpCircle className="size-4 text-muted-foreground" />
                    Help
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet open={profileSheetOpen} onOpenChange={setProfileSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Open profile menu"
                  >
                    <Avatar className="size-8 border-2 border-border">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                        {user.name?.charAt(0).toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                  <SheetHeader>
                    <SheetTitle>Profile</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Avatar className="size-12">
                        <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
                          {user.name?.charAt(0).toUpperCase() ?? 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>

                    <nav className="flex flex-col gap-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileSheetOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <User className="size-4 text-muted-foreground" />
                        Update personal information
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setProfileSheetOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="size-4 text-muted-foreground" />
                        Settings
                      </Link>
                      <Link
                        href="/help"
                        onClick={() => setProfileSheetOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <HelpCircle className="size-4 text-muted-foreground" />
                        Contact support
                      </Link>
                    </nav>

                    <div className="mt-auto pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="size-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
