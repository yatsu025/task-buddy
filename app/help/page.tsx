'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create a new task?',
    answer: 'To create a new task, go to the Tasks page and click the "Create New Task" button. Fill in the task title, description, priority level, and due date. You can also add tags to organize your tasks. Click "Create Task" to save.'
  },
  {
    id: '2',
    question: 'Can I edit a task after creating it?',
    answer: 'Yes! Click on any task card to view its details. Once in the task detail page, click the "Edit Task" button to modify the title, description, priority, status, due date, or tags. Your changes are automatically saved.'
  },
  {
    id: '3',
    question: 'How do I filter my tasks?',
    answer: 'On the Tasks page, use the filter dropdowns to filter by Status (Pending, In Progress, Completed) and Priority (Low, Medium, High). You can also use the Search page to filter by tags, priority, and status simultaneously.'
  },
  {
    id: '4',
    question: 'What do the different task statuses mean?',
    answer: 'Pending: Task is waiting to be started. In Progress: You are currently working on this task. Completed: Task is finished. You can change a task\'s status from the task card or task detail page.'
  },
  {
    id: '5',
    question: 'How do I search for specific tasks?',
    answer: 'Go to the Search page from the main menu. Enter keywords in the search box to find tasks by title, description, or tags. You can also apply additional filters by priority, status, or specific tags.'
  },
  {
    id: '6',
    question: 'What are task tags and how do I use them?',
    answer: 'Tags are labels you can add to tasks to organize them by category. When creating a task, enter comma-separated tags (e.g., "work, important, urgent"). You can then filter or search tasks by these tags.'
  },
  {
    id: '7',
    question: 'How do I view my task analytics?',
    answer: 'Click on "Analytics" in the header to see your task statistics. You\'ll see your completion rate, charts showing task distribution by status and priority, and your weekly completion activity.'
  },
  {
    id: '8',
    question: 'Can I delete a task?',
    answer: 'Yes. Open the task detail page by clicking on a task card, then click the "Delete Task" button. You can also see delete options in the quick actions menu on task cards.'
  },
  {
    id: '9',
    question: 'How do I update my profile?',
    answer: 'Go to your Profile page by clicking on the profile link in the header. Click "Edit Profile" to update your name. You can also view your account information, preferences, and download your data.'
  },
  {
    id: '10',
    question: 'How do I export my data?',
    answer: 'Go to your Profile page and click "Download Data" in the Data section. This will export your tasks and settings as a JSON file that you can keep for backup.'
  }
]

export default function HelpPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Help & FAQ</h1>
          <p className="text-muted-foreground">Find answers to common questions about Task Buddy</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-4 hover:shadow-md transition cursor-pointer">
            <h3 className="font-semibold text-foreground mb-2">Getting Started</h3>
            <p className="text-sm text-muted-foreground">Learn how to create and manage your first task</p>
          </Card>

          <Card className="p-4 hover:shadow-md transition cursor-pointer">
            <h3 className="font-semibold text-foreground mb-2">Features</h3>
            <p className="text-sm text-muted-foreground">Explore all the features Task Buddy offers</p>
          </Card>

          <Card className="p-4 hover:shadow-md transition cursor-pointer">
            <h3 className="font-semibold text-foreground mb-2">Analytics</h3>
            <p className="text-sm text-muted-foreground">Understand your productivity metrics and charts</p>
          </Card>

          <Card className="p-4 hover:shadow-md transition cursor-pointer">
            <h3 className="font-semibold text-foreground mb-2">Account</h3>
            <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <Card
                key={faq.id}
                className="p-4 cursor-pointer hover:shadow-sm transition"
                onClick={() => toggleExpanded(faq.id)}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                  <span className="text-primary text-xl flex-shrink-0 mt-0.5">
                    {expandedId === faq.id ? '−' : '+'}
                  </span>
                </div>
                {expandedId === faq.id && (
                  <p className="text-muted-foreground mt-3 text-sm">{faq.answer}</p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Still need help?</h2>
          <p className="text-muted-foreground mb-4">
            If you can't find the answer you're looking for, please don't hesitate to reach out.
          </p>
          <Button variant="outline">Contact Support</Button>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          <Link href="/about" className="flex-1">
            <Button className="w-full" variant="outline">About Task Buddy</Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full" variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
