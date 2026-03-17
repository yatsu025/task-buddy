import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { KeyboardShortcutManager } from '@/components/keyboard-shortcut-manager'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Task Buddy - Your Personal Task Manager',
  description: 'Task Buddy: The modern productivity app to manage, track, and complete your tasks efficiently',
  generator: 'yash Srivastava',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const noop = () => {
    // no-op default functions from server layout
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="task-buddy-theme"
        >
          <KeyboardShortcutManager searchInputId="task-search-input" />
          <div
            id="searchBox"
            style={{ display: 'none' }}
            className="fixed top-24 right-4 z-50 w-[320px] rounded-lg border border-border bg-card p-3 shadow-lg"
          >
            <label htmlFor="searchBoxInput" className="sr-only">Open search</label>
            <input
              id="searchBoxInput"
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
              placeholder="Search tasks..."
            />
          </div>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
