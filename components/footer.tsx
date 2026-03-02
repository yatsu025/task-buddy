'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/90 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground/90">Task Buddy</span>
            <span className="text-foreground/70 text-sm font-medium">© {new Date().getFullYear()}</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/help" className="text-foreground/70 hover:text-foreground transition-colors">
              Help
            </Link>
            <Link href="/profile" className="text-foreground/70 hover:text-foreground transition-colors">
              Profile
            </Link>
            <a href="mailto:support@taskbuddy.com" className="text-foreground/70 hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
        </div>
        <p className="text-center text-foreground/60 text-sm mt-4 font-medium">
          Your personal task manager — manage, track, and complete tasks efficiently.
        </p>
      </div>
    </footer>
  )
}
