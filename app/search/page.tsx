import { Suspense } from 'react'
import { Header } from '@/components/header'
import { SearchContent } from './search-content'

export const dynamic = 'force-dynamic'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
