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
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'tournament' ? 'bg-yellow-100' :
                    activity.type === 'clan' ? 'bg-blue-100' :
                    activity.type === 'payment' ? 'bg-green-100' :
                    'bg-gray-100'
                  }`}>
                    <activity.icon className={`h-5 w-5 ${
                      activity.type === 'tournament' ? 'text-yellow-600' :
                      activity.type === 'clan' ? 'text-blue-600' :
                      activity.type === 'payment' ? 'text-green-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user} {activity.action.toLowerCase()}
                    </p>
                    <p className="text-sm text-gray-500">{activity.target}</p>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
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