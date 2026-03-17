'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

type KeyboardShortcutManagerProps = {
  openNewTaskModal?: () => void
  onCreateTask?: () => void
  searchInputId?: string
}

const isTypingElement = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) return false
  const tagName = target.tagName.toLowerCase()
  return tagName === 'input' || tagName === 'textarea'
}

export function KeyboardShortcutManager({
  openNewTaskModal,
  onCreateTask,
  searchInputId = 'task-search-input',
}: KeyboardShortcutManagerProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return

      const key = event.key.toLowerCase()
      const typing = isTypingElement(event.target)

      if (typing && key !== 's' && key !== '/') return

      if (key === 's' || key === '/') {
        event.preventDefault()
        const input = document.getElementById(searchInputId) as HTMLInputElement | null
        if (input) {
          input.focus()
          input.select()
        }
        return
      }

      if (typing) return

      if (key === 'n') {
        event.preventDefault()
        if (openNewTaskModal) {
          openNewTaskModal()
          return
        }
        if (onCreateTask) {
          onCreateTask()
          return
        }
        router.push('/tasks?newTask=1')
        return
      }

      if (key === 'd') {
        event.preventDefault()
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [openNewTaskModal, onCreateTask, resolvedTheme, setTheme, router, searchInputId])

  return null
}
