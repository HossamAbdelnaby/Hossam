'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  FileText, 
  Eye, 
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  AlertCircle,
  Trophy,
  Users2,
  CreditCard,
  Package,
  Shield,
  Bell,
  Zap,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Download,
  RefreshCw,
  Filter,
  Settings,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'

const stats = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12.5%',
    changeType: 'positive',
    icon: Users,
    description: 'Active registered users',
    href: '/admin/users'
  },
  {
    title: 'Tournaments',
    value: '48',
    change: '+8.2%',
    changeType: 'positive',
    icon: Trophy,
    description: 'Active tournaments',
    href: '/admin/tournaments'
  },
  {
    title: 'Total Revenue',
    value: '$12,345',
    change: '+5.4%',
    changeType: 'positive',
    icon: DollarSign,
    description: 'Monthly revenue',
    href: '/admin/payments'
  },
  {
    title: 'Active Clans',
    value: '156',
    change: '+15.3%',
    changeType: 'positive',
    icon: Users2,
    description: 'Registered clans',
    href: '/admin/clans'
  }
]

const categoryStats = [
  {
    title: 'User Management',
    icon: Users,
    stats: [
      { label: 'Total Users', value: '2,543', change: '+12.5%' },
      { label: 'Active Clans', value: '156', change: '+15.3%' },
      { label: 'Pushers', value: '89', change: '+5.2%' },
      { label: 'New Today', value: '23', change: '+8.1%' }
    ],
    href: '/admin/users',
    color: 'blue'
  },
  {
    title: 'Tournaments',
    icon: Trophy,
    stats: [
      { label: 'Active', value: '12', change: '+2' },
      { label: 'Completed', value: '36', change: '+4' },
      { label: 'Total Prize Pool', value: '$8,500', change: '+12.3%' },
      { label: 'Participants', value: '1,234', change: '+18.7%' }
    ],
    href: '/admin/tournaments',
    color: 'yellow'
  },
  {
    title: 'Financial',
    icon: CreditCard,
    stats: [
      { label: 'Revenue', value: '$12,345', change: '+5.4%' },
      { label: 'Transactions', value: '847', change: '+9.8%' },
      { label: 'Packages Sold', value: '124', change: '+14.2%' },
      { label: 'Pending', value: '$2,340', change: '-3.1%' }
    ],
    href: '/admin/payments',
    color: 'green'
  },
  {
    title: 'System',
    icon: Shield,
    stats: [
      { label: 'Uptime', value: '99.9%', change: 'Stable' },
      { label: 'API Calls', value: '45.2K', change: '+23.1%' },
      { label: 'Storage Used', value: '78%', change: '+2.3%' },
      { label: 'Errors', value: '3', change: '-45.2%' }
    ],
    href: '/admin/security',
    color: 'purple'
  }
]

const recentActivity = [
  {
    id: 1,
    user: 'John Doe',
    action: 'Registered for tournament',
    target: 'Fortnite Championship',
    time: '2 minutes ago',
    type: 'tournament',
    icon: Trophy
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'Created new clan',
    target: 'Elite Squad',
    time: '15 minutes ago',
    type: 'clan',
    icon: Users2
  },
  {
    id: 3,
    user: 'System',
    action: 'Payment received',
    target: '$50 from user@example.com',
    time: '1 hour ago',
    type: 'payment',
    icon: CreditCard
  },
  {
    id: 4,
    user: 'Admin',
    action: 'Updated tournament',
    target: 'CS:GO Championship',
    time: '2 hours ago',
    type: 'tournament',
    icon: Trophy
  },
  {
    id: 5,
    user: 'Mike Johnson',
    action: 'Purchased package',
    target: 'Premium Graphics',
    time: '3 hours ago',
    type: 'payment',
    icon: Package
  }
]

const systemHealth = [
  { name: 'Server CPU', value: 45, status: 'good' },
  { name: 'Memory Usage', value: 62, status: 'good' },
  { name: 'Disk Space', value: 78, status: 'warning' },
  { name: 'Database', value: 23, status: 'good' },
  { name: 'API Response', value: 120, status: 'good', unit: 'ms' }
]

const quickActions = [
  {
    title: 'Create Tournament',
    description: 'Set up a new tournament',
    icon: Trophy,
    href: '/admin/tournaments',
    color: 'yellow'
  },
  {
    title: 'Add User',
    description: 'Create new user account',
    icon: Users,
    href: '/admin/users',
    color: 'blue'
  },
  {
    title: 'View Payments',
    description: 'Check transactions',
    icon: CreditCard,
    href: '/admin/payments',
    color: 'green'
  },
  {
    title: 'System Status',
    description: 'Monitor system health',
    icon: Shield,
    href: '/admin/security',
    color: 'purple'
  }
]

export default function Dashboard() {
  const [activityMenuOpen, setActivityMenuOpen] = useState(false)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [activityFilter, setActivityFilter] = useState('all')
  const [activityTimeRange, setActivityTimeRange] = useState('24h')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    autoRefresh: 30,
    retentionPeriod: 90,
    emailNotifications: true,
    realTimeUpdates: true,
    maxActivities: 1000
  })
  const [exportOptions, setExportOptions] = useState({
    includeDetails: true,
    includeTimestamp: true,
    includeUserInfo: false
  })

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: activityFilter,
        timeRange: activityTimeRange,
        limit: '50'
      })
      
      const response = await fetch(`/api/admin/activity?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setActivities(data.data)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/activity/settings')
      const data = await response.json()
      
      if (data.success) {
        setSettings({
          autoRefresh: parseInt(data.data.autoRefresh),
          retentionPeriod: parseInt(data.data.retentionPeriod),
          emailNotifications: data.data.emailNotifications === 'true',
          realTimeUpdates: data.data.realTimeUpdates === 'true',
          maxActivities: parseInt(data.data.maxActivities)
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  // Initialize data
  useEffect(() => {
    fetchActivities()
    fetchSettings()
  }, [activityFilter, activityTimeRange])

  // Auto-refresh
  useEffect(() => {
    if (settings.realTimeUpdates && settings.autoRefresh > 0) {
      const interval = setInterval(() => {
        fetchActivities()
      }, settings.autoRefresh * 1000)
      
      return () => clearInterval(interval)
    }
  }, [settings.realTimeUpdates, settings.autoRefresh, activityFilter, activityTimeRange])

  const handleRefreshActivity = async () => {
    setIsRefreshing(true)
    await fetchActivities()
    setIsRefreshing(false)
  }

  const handleExportActivity = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      const params = new URLSearchParams({
        format,
        type: activityFilter,
        timeRange: activityTimeRange,
        includeDetails: exportOptions.includeDetails.toString(),
        includeTimestamp: exportOptions.includeTimestamp.toString(),
        includeUserInfo: exportOptions.includeUserInfo.toString()
      })
      
      const response = await fetch(`/api/admin/activity/export?${params}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `activity-log-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting activities:', error)
    }
  }

  const handleClearActivity = async () => {
    try {
      const response = await fetch('/api/admin/activity?action=all', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchActivities()
      }
    } catch (error) {
      console.error('Error clearing activities:', error)
    }
  }

  const handleMarkAsRead = async (activityId: string) => {
    try {
      const response = await fetch(`/api/admin/activity/${activityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'mark-read' })
      })
      
      if (response.ok) {
        await fetchActivities()
      }
    } catch (error) {
      console.error('Error marking activity as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/activity?action=read', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchActivities()
      }
    } catch (error) {
      console.error('Error marking all activities as read:', error)
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    try {
      const response = await fetch(`/api/admin/activity/${activityId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchActivities()
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  const handleViewDetails = async (activityId: string) => {
    try {
      const response = await fetch(`/api/admin/activity/${activityId}`)
      const data = await response.json()
      
      if (data.success) {
        // Show details in a modal or alert
        alert(`Activity Details:\n\nUser: ${data.data.userName}\nAction: ${data.data.action}\nTarget: ${data.data.target}\nType: ${data.data.type}\nTime: ${data.data.createdAt}\n\nDetails: ${data.data.details || 'No additional details'}`)
      }
    } catch (error) {
      console.error('Error viewing activity details:', error)
    }
  }

  const handleUpdateSettings = async () => {
    try {
      const response = await fetch('/api/admin/activity/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        alert('Settings updated successfully!')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  const filteredActivities = activities

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening across your platform today.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1 flex items-center">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  {' '}from last month
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Category Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categoryStats.map((category) => (
          <Card key={category.title} className="hover:shadow-md transition-shadow">
            <Link href={category.href}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{category.title}</CardTitle>
                <category.icon className={`h-4 w-4 text-${category.color}-600`} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.stats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">{stat.label}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{stat.value}</div>
                        <div className="text-xs text-green-600">{stat.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center text-xs text-blue-600">
                    View all
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest actions and system events
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="tournament">Tournaments</SelectItem>
                    <SelectItem value="clan">Clans</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={activityTimeRange} onValueChange={setActivityTimeRange}>
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={activityMenuOpen} onOpenChange={setActivityMenuOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Activity Management</DialogTitle>
                      <DialogDescription>
                        Manage and export recent activity logs
                      </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="actions" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                        <TabsTrigger value="export">Export</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="actions" className="space-y-4">
                        <div className="space-y-3">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => { handleRefreshActivity(); setActivityMenuOpen(false); }}
                            disabled={isRefreshing}
                          >
                            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh Activity
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => { handleMarkAllAsRead(); setActivityMenuOpen(false); }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark All as Read
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-red-600 hover:text-red-700" 
                            onClick={() => { handleClearActivity(); setActivityMenuOpen(false); }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear All Activity
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="export" className="space-y-4">
                        <div className="space-y-3">
                          <Label>Export Format</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleExportActivity('csv')}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              CSV
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleExportActivity('json')}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              JSON
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleExportActivity('pdf')}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              PDF
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Export Options</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="include-details" 
                                  checked={exportOptions.includeDetails}
                                  onCheckedChange={(checked) => 
                                    setExportOptions(prev => ({ ...prev, includeDetails: checked as boolean }))
                                  }
                                />
                                <Label htmlFor="include-details" className="text-sm">Include Details</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="include-timestamps" 
                                  checked={exportOptions.includeTimestamp}
                                  onCheckedChange={(checked) => 
                                    setExportOptions(prev => ({ ...prev, includeTimestamp: checked as boolean }))
                                  }
                                />
                                <Label htmlFor="include-timestamps" className="text-sm">Include Timestamps</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="include-user-info" 
                                  checked={exportOptions.includeUserInfo}
                                  onCheckedChange={(checked) => 
                                    setExportOptions(prev => ({ ...prev, includeUserInfo: checked as boolean }))
                                  }
                                />
                                <Label htmlFor="include-user-info" className="text-sm">Include User Info</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="settings" className="space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Auto-refresh Interval</Label>
                            <Select 
                              value={settings.autoRefresh.toString()} 
                              onValueChange={(value) => 
                                setSettings(prev => ({ ...prev, autoRefresh: parseInt(value) }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Disabled</SelectItem>
                                <SelectItem value="30">30 seconds</SelectItem>
                                <SelectItem value="60">1 minute</SelectItem>
                                <SelectItem value="300">5 minutes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Activity Retention</Label>
                            <Select 
                              value={settings.retentionPeriod.toString()} 
                              onValueChange={(value) => 
                                setSettings(prev => ({ ...prev, retentionPeriod: parseInt(value) }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7">7 days</SelectItem>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="365">1 year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Email Notifications</Label>
                              <p className="text-xs text-gray-500">Get notified of important activities</p>
                            </div>
                            <Switch 
                              checked={settings.emailNotifications}
                              onCheckedChange={(checked) => 
                                setSettings(prev => ({ ...prev, emailNotifications: checked }))
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Real-time Updates</Label>
                              <p className="text-xs text-gray-500">Live activity updates</p>
                            </div>
                            <Switch 
                              checked={settings.realTimeUpdates}
                              onCheckedChange={(checked) => 
                                setSettings(prev => ({ ...prev, realTimeUpdates: checked }))
                              }
                            />
                          </div>
                          
                          <Button 
                            className="w-full" 
                            onClick={() => { 
                              handleUpdateSettings(); 
                              setActivityMenuOpen(false); 
                            }}
                          >
                            Save Settings
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading activities...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => {
                  const getIcon = (type: string) => {
                    switch (type) {
                      case 'TOURNAMENT': return Trophy
                      case 'CLAN': return Users2
                      case 'PAYMENT': return CreditCard
                      case 'USER': return Users
                      case 'SYSTEM': return Shield
                      default: return Activity
                    }
                  }
                  
                  const ActivityIcon = getIcon(activity.type)
                  const timeAgo = new Date(activity.createdAt).toLocaleString()
                  
                  return (
                    <div key={activity.id} className={`flex items-center space-x-4 group hover:bg-gray-50 p-2 rounded-lg transition-colors ${!activity.isRead ? 'bg-blue-50' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'TOURNAMENT' ? 'bg-yellow-100' :
                        activity.type === 'CLAN' ? 'bg-blue-100' :
                        activity.type === 'PAYMENT' ? 'bg-green-100' :
                        activity.type === 'USER' ? 'bg-purple-100' :
                        activity.type === 'SYSTEM' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        <ActivityIcon className={`h-5 w-5 ${
                          activity.type === 'TOURNAMENT' ? 'text-yellow-600' :
                          activity.type === 'CLAN' ? 'text-blue-600' :
                          activity.type === 'PAYMENT' ? 'text-green-600' :
                          activity.type === 'USER' ? 'text-purple-600' :
                          activity.type === 'SYSTEM' ? 'text-red-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          <span className={!activity.isRead ? 'font-semibold' : ''}>
                            {activity.userName || 'System'}
                          </span>{' '}
                          {activity.action.toLowerCase()}
                          {activity.target && (
                            <span className="text-gray-600"> - {activity.target}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{timeAgo}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!activity.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => handleViewDetails(activity.id)}
                            title="View Details"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {!activity.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => handleMarkAsRead(activity.id)}
                              title="Mark as Read"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteActivity(activity.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            
            {!loading && filteredActivities.length === 0 && (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No activity found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or time range
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>
              Current system performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className={item.status === 'good' ? 'text-green-600' : 'text-yellow-600'}>
                      {item.value}{item.unit || '%'}
                    </span>
                  </div>
                  <Progress 
                    value={item.unit ? Math.min(item.value / 2, 100) : item.value} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <action.icon className={`h-6 w-6 text-${action.color}-600 mb-2`} />
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}