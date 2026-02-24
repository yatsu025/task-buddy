// Auth utilities for Task Buddy
export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

// User storage key
const USERS_KEY = 'task-buddy:users'
const CURRENT_USER_KEY = 'task-buddy:current-user'
const TASKS_KEY = 'task-buddy:tasks'

// Get all users from localStorage
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

// Save user to localStorage
function saveUser(user: User): void {
  if (typeof window === 'undefined') return
  const users = getAllUsers()
  const index = users.findIndex(u => u.id === user.id)
  if (index === -1) {
    users.push(user)
  } else {
    users[index] = user
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Register a new user
export function registerUser(email: string, name: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers()
  if (users.some(u => u.email === email)) {
    return { success: false, error: 'Email already registered' }
  }

  const user: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    createdAt: new Date()
  }

  saveUser(user)
  
  // Store hashed password (simplified - in production use proper hashing)
  if (typeof window !== 'undefined') {
    const passwords = JSON.parse(localStorage.getItem('task-buddy:passwords') || '{}')
    passwords[user.id] = btoa(password) // Simple base64 encoding for demo
    localStorage.setItem('task-buddy:passwords', JSON.stringify(passwords))
  }

  return { success: true, user }
}

// Login user
export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers()
  const user = users.find(u => u.email === email)

  if (!user) {
    return { success: false, error: 'User not found' }
  }

  // Verify password
  if (typeof window !== 'undefined') {
    const passwords = JSON.parse(localStorage.getItem('task-buddy:passwords') || '{}')
    if (passwords[user.id] !== btoa(password)) {
      return { success: false, error: 'Invalid password' }
    }
  }

  // Set current user
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  }

  return { success: true, user }
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(CURRENT_USER_KEY)
  return data ? JSON.parse(data) : null
}

// Logout user
export function logoutUser(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CURRENT_USER_KEY)
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(CURRENT_USER_KEY)
}

// Initialize demo users
export function initializeDemoUsers(): void {
  if (typeof window === 'undefined') return
  const users = getAllUsers()
  if (users.length === 0) {
    const demoUser: User = {
      id: 'user_demo',
      email: 'demo@taskbuddy.com',
      name: 'Demo User',
      createdAt: new Date()
    }
    saveUser(demoUser)
    const passwords = { 'user_demo': btoa('demo123') }
    localStorage.setItem('task-buddy:passwords', JSON.stringify(passwords))
  }
}
