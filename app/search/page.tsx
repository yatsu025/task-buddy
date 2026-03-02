import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchContent } from './search-content'

export const dynamic = 'force-dynamic'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
