'use client'

import { Task, updateTask, deleteTask } from '@/lib/tasks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface TaskCardProps {
  task: Task
  onUpdate?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const handleStatusChange = (newStatus: Task['status']) => {
    const updated = updateTask(task.id, { status: newStatus })
    if (updated && onUpdate) {
      onUpdate(updated)
    }
  }

  const handleDelete = () => {
    if (deleteTask(task.id) && onDelete) {
      onDelete(task.id)
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
  const daysUntilDue = task.dueDate ? Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }

  const statusColors = {
    'pending': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'in-progress': 'bg-primary/10 text-primary dark:bg-primary/20',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }

  return (
    <Card className="p-4 hover:shadow-md transition">
      <Link href={`/tasks/${task.id}`}>
        <div className="cursor-pointer">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-foreground line-clamp-2">{task.title}</h3>
            <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
        </div>
      </Link>

      <div className="flex flex-wrap gap-2 mb-3">
        {task.tags.map(tag => (
          <span key={tag} className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs font-medium px-2 py-1 rounded cursor-pointer ${statusColors[task.status]}`}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {task.dueDate && (
            <span className={`text-xs font-medium ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
              {isOverdue ? '⚠️ Overdue' : daysUntilDue !== null && daysUntilDue <= 3 ? `${daysUntilDue}d left` : new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          Delete
        </Button>
      </div>
    </Card>
  )
}
