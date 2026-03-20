import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { TasksContent } from './tasks-content'

export default function TasksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
        <Footer />
      </div>
    }>
      <TasksContent />
    </Suspense>
  )
}
