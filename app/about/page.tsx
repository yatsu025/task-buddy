'use client'

import { Header } from '@/components/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About Task Buddy</h1>
          <p className="text-lg text-muted-foreground">
            Your personal task management assistant designed to help you stay organized and productive
          </p>
        </div>

        {/* Mission */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-foreground leading-relaxed">
            Task Buddy was created to simplify task management and help individuals and teams stay focused on what matters most. We believe that productivity comes from clarity, and clarity comes from proper organization. Our mission is to provide a simple, intuitive, and powerful task management tool that works for everyone.
          </p>
        </Card>

        {/* Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Easy Task Management</h3>
              <p className="text-muted-foreground">Create, edit, and organize your tasks with intuitive controls and clear priorities.</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Filtering</h3>
              <p className="text-muted-foreground">Filter tasks by status, priority, and tags to find exactly what you need.</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Analytics & Insights</h3>
              <p className="text-muted-foreground">Track your productivity with beautiful charts and completion statistics.</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Search Functionality</h3>
              <p className="text-muted-foreground">Quickly find tasks by title, description, or tags with powerful search.</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Priority Levels</h3>
              <p className="text-muted-foreground">Organize your work with low, medium, and high priority levels.</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Due Dates</h3>
              <p className="text-muted-foreground">Set due dates and get alerts for overdue tasks to stay on track.</p>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Create Your Account</h3>
                <p className="text-muted-foreground">Sign up for Task Buddy in seconds with your email address.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Add Your Tasks</h3>
                <p className="text-muted-foreground">Create tasks with titles, descriptions, priorities, and due dates.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Manage & Track</h3>
                <p className="text-muted-foreground">Update task status, filter your list, and track your productivity.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">4</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Analyze Your Progress</h3>
                <p className="text-muted-foreground">View analytics and insights to understand your productivity patterns.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of users who are already managing their tasks efficiently with Task Buddy.</p>
          <Link href="/dashboard">
            <Button className="mx-auto">Go to Dashboard</Button>
          </Link>
        </Card>
      </main>
    </div>
  )
}
