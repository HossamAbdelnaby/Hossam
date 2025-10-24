'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  DollarSign, 
  Download,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  Mail,
  MousePointer,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface AnalyticsData {
  visitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: string
  revenue: number
  conversionRate: number
}

interface ChartData {
  name: string
  value: number
  change?: number
}

const mockAnalytics: AnalyticsData = {
  visitors: 12543,
  pageViews: 45678,
  bounceRate: 32.5,
  avgSessionDuration: '3:45',
  revenue: 12345,
  conversionRate: 2.8
}

const visitorData: ChartData[] = [
  { name: 'Mon', value: 1200, change: 5.2 },
  { name: 'Tue', value: 1450, change: 8.1 },
  { name: 'Wed', value: 1380, change: -2.3 },
  { name: 'Thu', value: 1620, change: 12.4 },
  { name: 'Fri', value: 1890, change: 15.6 },
  { name: 'Sat', value: 2100, change: 18.2 },
  { name: 'Sun', value: 1950, change: 10.1 }
]

const pageData: ChartData[] = [
  { name: 'Home', value: 8500 },
  { name: 'Tournaments', value: 6200 },
  { name: 'About', value: 3100 },
  { name: 'Contact', value: 2800 },
  { name: 'Blog', value: 4500 },
  { name: 'Register', value: 3900 }
]

const deviceData: ChartData[] = [
  { name: 'Desktop', value: 65 },
  { name: 'Mobile', value: 28 },
  { name: 'Tablet', value: 7 }
]

const sourceData: ChartData[] = [
  { name: 'Direct', value: 35 },
  { name: 'Organic Search', value: 28 },
  { name: 'Social Media', value: 18 },
  { name: 'Referral', value: 12 },
  { name: 'Email', value: 7 }
]

export default function Analytics() {
  const [dateRange, setDateRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('overview')

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num)
  }

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-gray-500'
    return change > 0 ? 'text-green-600' : 'text-red-600'
  }

  const getChangeIcon = (change?: number) => {
    if (!change) return null
    return change > 0 ? '↑' : '↓'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Monitor your website performance and user behavior</p>
        </div>
        <div className="flex space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(mockAnalytics.visitors)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(mockAnalytics.pageViews)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8.2%</span> from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(mockAnalytics.revenue)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+15.3%</span> from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">-2.1%</span> from last period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Visitor Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Visitor Trend</CardTitle>
                <CardDescription>
                  Daily visitor count over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visitorData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-8">{item.name}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(item.value / 2100) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{formatNumber(item.value)}</span>
                        {item.change && (
                          <span className={`text-xs ${getChangeColor(item.change)}`}>
                            {getChangeIcon(item.change)} {Math.abs(item.change)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>
                  Visitors by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MousePointer className="mr-2 h-5 w-5" />
                  Bounce Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.bounceRate}%</div>
                <p className="text-xs text-gray-500">
                  <span className="text-green-600">-3.2%</span> improvement
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Avg. Session Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.avgSessionDuration}</div>
                <p className="text-xs text-gray-500">
                  <span className="text-green-600">+0:45</span> from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Pages per Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.6</div>
                <p className="text-xs text-gray-500">
                  <span className="text-green-600">+0.4</span> from last period
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Where your visitors come from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sourceData.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>
                  Most visited pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pageData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-gray-600">{formatNumber(item.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>
                How your content is performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Most Popular Content</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Tournament Rules</span>
                        <Badge variant="secondary">2,341 views</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Getting Started</span>
                        <Badge variant="secondary">1,892 views</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Prize Structure</span>
                        <Badge variant="secondary">1,567 views</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Content Engagement</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Avg. Time on Page</span>
                        <span className="text-sm font-medium">2:45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Scroll Depth</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Social Shares</span>
                        <span className="text-sm font-medium">234</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversions Tab */}
        <TabsContent value="conversions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Goals</CardTitle>
                <CardDescription>
                  Track your conversion metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">User Registration</h3>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="text-2xl font-bold mb-1">342</div>
                    <div className="text-sm text-gray-600">Conversions this period</div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Tournament Signup</h3>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="text-2xl font-bold mb-1">156</div>
                    <div className="text-sm text-gray-600">Conversions this period</div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Tracking</CardTitle>
                <CardDescription>
                  Monitor your revenue streams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Tournament Entry Fees</h3>
                    <div className="text-2xl font-bold mb-1">{formatCurrency(8450)}</div>
                    <div className="text-sm text-green-600">+12.3% from last period</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Premium Passes</h3>
                    <div className="text-2xl font-bold mb-1">{formatCurrency(3895)}</div>
                    <div className="text-sm text-green-600">+8.7% from last period</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Download and manage your reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium">Monthly Analytics Report</h3>
                      <p className="text-sm text-gray-500">Generated on Jan 20, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium">Traffic Sources Report</h3>
                      <p className="text-sm text-gray-500">Generated on Jan 15, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium">Conversion Analysis</h3>
                      <p className="text-sm text-gray-500">Generated on Jan 10, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="mt-6 flex space-x-2">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate New Report
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Schedule Email Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}