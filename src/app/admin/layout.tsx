'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileText, 
  Palette, 
  BarChart3, 
  Bell, 
  Plug, 
  Shield, 
  Search,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Command,
  File,
  User,
  Calendar,
  TrendingUp,
  MessageSquare,
  Trophy,
  Users2,
  Clock,
  CreditCard,
  Package,
  ShieldCheck,
  Fingerprint,
  ScrollText,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  // Main Dashboard
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: LayoutDashboard, 
    keywords: ['overview', 'stats', 'analytics'],
    category: 'main'
  },
  
  // User Management Group
  { 
    name: 'User Management', 
    href: '/admin/users', 
    icon: Users, 
    keywords: ['users', 'accounts', 'roles'],
    category: 'users'
  },
  { 
    name: 'Clans Management', 
    href: '/admin/clans', 
    icon: Users2, 
    keywords: ['clans', 'teams', 'groups'],
    category: 'users'
  },
  { 
    name: 'Clan for Hire', 
    href: '/admin/clan-for-hire', 
    icon: CreditCard, 
    keywords: ['hire', 'rental', 'services'],
    category: 'users'
  },
  { 
    name: 'Pushers', 
    href: '/admin/pushers', 
    icon: Activity, 
    keywords: ['pushers', 'players', 'services'],
    category: 'users'
  },
  
  // Tournament Management Group
  { 
    name: 'Tournaments', 
    href: '/admin/tournaments', 
    icon: Trophy, 
    keywords: ['tournaments', 'competitions', 'matches'],
    category: 'tournaments'
  },
  { 
    name: 'Scheduler', 
    href: '/admin/scheduler', 
    icon: Clock, 
    keywords: ['scheduler', 'timing', 'automation'],
    category: 'tournaments'
  },
  
  // Content & Site Management
  { 
    name: 'Content Management', 
    href: '/admin/content', 
    icon: FileText, 
    keywords: ['content', 'cms', 'articles', 'media'],
    category: 'content'
  },
  { 
    name: 'Frontend Control', 
    href: '/admin/frontend', 
    icon: Palette, 
    keywords: ['frontend', 'layout', 'design', 'theme'],
    category: 'content'
  },
  { 
    name: 'Site Settings', 
    href: '/admin/settings', 
    icon: Settings, 
    keywords: ['config', 'general', 'appearance'],
    category: 'content'
  },
  
  // Financial Management
  { 
    name: 'Payments', 
    href: '/admin/payments', 
    icon: CreditCard, 
    keywords: ['payments', 'transactions', 'billing'],
    category: 'financial'
  },
  { 
    name: 'Packages', 
    href: '/admin/packages', 
    icon: Package, 
    keywords: ['packages', 'pricing', 'subscriptions'],
    category: 'financial'
  },
  
  // Analytics & Reports
  { 
    name: 'Analytics & Reports', 
    href: '/admin/analytics', 
    icon: BarChart3, 
    keywords: ['analytics', 'reports', 'stats', 'data'],
    category: 'analytics'
  },
  { 
    name: 'Statistics', 
    href: '/admin/statistics', 
    icon: TrendingUp, 
    keywords: ['statistics', 'metrics', 'performance'],
    category: 'analytics'
  },
  
  // System & Security
  { 
    name: 'Security & Logs', 
    href: '/admin/security', 
    icon: Shield, 
    keywords: ['security', 'logs', 'audit', 'backup'],
    category: 'system'
  },
  { 
    name: 'System Logs', 
    href: '/admin/logs', 
    icon: ScrollText, 
    keywords: ['logs', 'system', 'monitoring'],
    category: 'system'
  },
  { 
    name: '2FA Management', 
    href: '/admin/2fa', 
    icon: Fingerprint, 
    keywords: ['2fa', 'authentication', 'security'],
    category: 'system'
  },
  
  // Communication
  { 
    name: 'Notifications', 
    href: '/admin/notifications', 
    icon: Bell, 
    keywords: ['notifications', 'email', 'alerts'],
    category: 'communication'
  },
  
  // Integrations
  { 
    name: 'Integrations', 
    href: '/admin/integrations', 
    icon: Plug, 
    keywords: ['integrations', 'api', 'payment', 'third-party'],
    category: 'integrations'
  }
]

interface SearchResult {
  title: string
  href: string
  type: 'page' | 'user' | 'content' | 'setting'
  icon: React.ReactNode
  description?: string
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'info' | 'success' | 'warning' | 'error'
}

// Helper function to get category display names
function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    main: 'Main',
    users: 'User Management',
    tournaments: 'Tournaments',
    content: 'Content & Site',
    financial: 'Financial',
    analytics: 'Analytics',
    system: 'System & Security',
    communication: 'Communication',
    integrations: 'Integrations'
  }
  return categoryNames[category] || category
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New User Registration',
      message: 'John Doe has registered for the Fortnite tournament',
      time: '2 minutes ago',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'Payment of $50 received from user@example.com',
      time: '15 minutes ago',
      read: false,
      type: 'success'
    },
    {
      id: '3',
      title: 'Tournament Starting Soon',
      message: 'CS:GO Championship starts in 30 minutes',
      time: '25 minutes ago',
      read: false,
      type: 'warning'
    },
    {
      id: '4',
      title: 'System Update',
      message: 'System will be updated at 2:00 AM UTC',
      time: '1 hour ago',
      read: true,
      type: 'info'
    },
    {
      id: '5',
      title: 'Server Error',
      message: 'Database connection failed, please check logs',
      time: '3 hours ago',
      read: true,
      type: 'error'
    }
  ])
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode')
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true')
    }
  }, [])

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('adminDarkMode', darkMode.toString())
  }, [darkMode])

  // Global search functionality
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: SearchResult[] = []

    // Search navigation pages
    navigation.forEach(item => {
      if (
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      ) {
        results.push({
          title: item.name,
          href: item.href,
          type: 'page',
          icon: <item.icon className="h-4 w-4" />,
          description: `Navigate to ${item.name}`
        })
      }
    })

    // Mock search results for other content types
    if (query.toLowerCase().includes('user')) {
      results.push({
        title: 'John Doe',
        href: '/admin/users?search=john',
        type: 'user',
        icon: <User className="h-4 w-4" />,
        description: 'User account - john@example.com'
      })
    }

    if (query.toLowerCase().includes('content')) {
      results.push({
        title: 'Getting Started Guide',
        href: '/admin/content?search=guide',
        type: 'content',
        icon: <File className="h-4 w-4" />,
        description: 'Published article'
      })
    }

    if (query.toLowerCase().includes('setting')) {
      results.push({
        title: 'Email Configuration',
        href: '/admin/settings?tab=email',
        type: 'setting',
        icon: <MessageSquare className="h-4 w-4" />,
        description: 'Email settings and templates'
      })
    }

    setSearchResults(results.slice(0, 8)) // Limit to 8 results
  }

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 100)
      }
      // Escape to close search
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
        setSearchQuery('')
      }
      // Escape to close notifications
      if (e.key === 'Escape' && notificationOpen) {
        setNotificationOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen, notificationOpen])

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
      }
    }

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationOpen])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <div className="h-2 w-2 bg-green-500 rounded-full"></div>
      case 'warning':
        return <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
      case 'error':
        return <div className="h-2 w-2 bg-red-500 rounded-full"></div>
      default:
        return <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
    }
  }

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200')}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-1 overflow-y-auto">
              {Object.entries(
                navigation.reduce((groups, item) => {
                  if (!groups[item.category]) {
                    groups[item.category] = []
                  }
                  groups[item.category].push(item)
                  return groups
                }, {} as Record<string, typeof navigation>)
              ).map(([category, items], categoryIndex) => (
                <div key={category} className={categoryIndex > 0 ? 'mt-3' : ''}>
                  {/* Category Header */}
                  <div className="px-2 mb-1">
                    <h3 className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                      {getCategoryDisplayName(category)}
                    </h3>
                  </div>
                  
                  {/* Category Items */}
                  {items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors mb-0.5',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                        )}
                      >
                        <item.icon className="mr-2 h-3 w-3" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>

            {/* User section */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Administrator
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    admin@clashtournaments.com
                  </p>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-3 justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {/* Enhanced Search bar */}
                <div className="relative">
                  <div 
                    className={cn(
                      "relative flex items-center transition-all duration-200",
                      searchOpen ? "w-80 md:w-96" : "w-40 md:w-64"
                    )}
                  >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder={searchOpen ? "Search anything..." : "Search..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchOpen(true)}
                      onBlur={() => {
                        if (!searchQuery) {
                          setTimeout(() => setSearchOpen(false), 200)
                        }
                      }}
                      className={cn(
                        "pl-10 pr-10 transition-all duration-200",
                        searchOpen ? "w-full" : "w-full"
                      )}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            setSearchQuery('')
                            setSearchResults([])
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded">
                        ⌘K
                      </kbd>
                    </div>
                  </div>

                  {/* Search Results Dropdown */}
                  {searchOpen && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      <div className="p-2">
                        {searchResults.map((result, index) => (
                          <Link
                            key={index}
                            href={result.href}
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => {
                              setSearchOpen(false)
                              setSearchQuery('')
                              setSearchResults([])
                            }}
                          >
                            <div className="flex-shrink-0 text-gray-400">
                              {result.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {result.title}
                              </p>
                              {result.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {result.description}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Enhanced Dark mode toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setDarkMode(!darkMode)}
                  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {/* Notifications */}
                <div ref={notificationRef} className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    title="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>

                  {/* Notifications Dropdown */}
                  {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Notifications
                          </h3>
                          {unreadCount > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={markAllAsRead}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              Mark all as read
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No notifications
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={cn(
                                  "p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors",
                                  !notification.read && "bg-blue-50 dark:bg-blue-900/20"
                                )}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={cn(
                                      "text-sm font-medium text-gray-900 dark:text-white",
                                      !notification.read && "font-semibold"
                                    )}>
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {notification.time}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="flex-shrink-0">
                                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          href="/admin/notifications"
                          className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => setNotificationOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}