'use client'

import { useState } from 'react'
import { 
  Shield, 
  Activity, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  RefreshCw,
  Lock,
  Key,
  Database,
  Clock,
  User,
  Mail,
  Settings,
  Ban,
  Trash2,
  Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface SecurityLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  ip: string
  status: 'success' | 'failure' | 'warning'
  details: string
}

interface SecurityEvent {
  id: string
  type: 'login' | 'permission' | 'data' | 'system'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  user?: string
  ip: string
  resolved: boolean
}

const mockSecurityLogs: SecurityLog[] = [
  {
    id: '1',
    timestamp: '2024-01-20T10:30:00Z',
    user: 'admin@clashtournaments.com',
    action: 'LOGIN',
    resource: 'Admin Panel',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Successful login with 2FA'
  },
  {
    id: '2',
    timestamp: '2024-01-20T10:25:00Z',
    user: 'john@example.com',
    action: 'LOGIN_ATTEMPT',
    resource: 'Admin Panel',
    ip: '192.168.1.101',
    status: 'failure',
    details: 'Failed login - invalid credentials'
  },
  {
    id: '3',
    timestamp: '2024-01-20T10:20:00Z',
    user: 'admin@clashtournaments.com',
    action: 'USER_UPDATE',
    resource: 'User Management',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Updated user role for john@example.com'
  },
  {
    id: '4',
    timestamp: '2024-01-20T10:15:00Z',
    user: 'admin@clashtournaments.com',
    action: 'DATA_EXPORT',
    resource: 'Analytics',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Exported analytics report (PDF)'
  },
  {
    id: '5',
    timestamp: '2024-01-20T10:10:00Z',
    user: 'jane@example.com',
    action: 'PERMISSION_DENIED',
    resource: 'User Management',
    ip: '192.168.1.102',
    status: 'failure',
    details: 'Access denied to admin panel'
  }
]

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'login',
    severity: 'high',
    title: 'Multiple Failed Login Attempts',
    description: '5 failed login attempts from IP 192.168.1.101',
    timestamp: '2024-01-20T10:25:00Z',
    user: 'john@example.com',
    ip: '192.168.1.101',
    resolved: false
  },
  {
    id: '2',
    type: 'permission',
    severity: 'medium',
    title: 'Unauthorized Access Attempt',
    description: 'User attempted to access admin panel without permissions',
    timestamp: '2024-01-20T10:10:00Z',
    user: 'jane@example.com',
    ip: '192.168.1.102',
    resolved: true
  },
  {
    id: '3',
    type: 'data',
    severity: 'low',
    title: 'Large Data Export',
    description: 'User exported large amount of data from analytics',
    timestamp: '2024-01-20T10:15:00Z',
    user: 'admin@clashtournaments.com',
    ip: '192.168.1.100',
    resolved: true
  }
]

export default function Security() {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(mockSecurityLogs)
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents)
  const [activeTab, setActiveTab] = useState('logs')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    ipWhitelist: false,
    ipWhitelistList: '',
    auditLogging: true,
    emailAlerts: true,
    smsAlerts: false
  })

  const filteredLogs = securityLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredEvents = securityEvents.filter(event => {
    const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity
    return matchesSeverity
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success': return 'default'
      case 'failure': return 'destructive'
      case 'warning': return 'secondary'
      default: return 'outline'
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failure': return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'low': return <AlertTriangle className="h-4 w-4 text-blue-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const handleResolveEvent = (eventId: string) => {
    setSecurityEvents(events => events.map(event => 
      event.id === eventId ? { ...event, resolved: true } : event
    ))
  }

  const handleExportLogs = () => {
    // Implementation for exporting logs
    console.log('Exporting security logs...')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security & System Logs</h1>
          <p className="text-gray-600">Monitor security events and system activity</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityLogs.filter(log => log.status === 'failure').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(securityLogs.map(log => log.user)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Good security
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
          <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
        </TabsList>

        {/* Activity Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                Monitor all user and system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Logs Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">{log.user}</TableCell>
                        <TableCell className="text-sm">{log.action}</TableCell>
                        <TableCell className="text-sm">{log.resource}</TableCell>
                        <TableCell className="text-sm">{log.ip}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(log.status)}
                            <Badge variant={getStatusBadgeVariant(log.status)}>
                              {log.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>
                Monitor and respond to security incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex justify-between items-center mb-6">
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Events List */}
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(event.severity)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge variant={getSeverityBadgeVariant(event.severity)}>
                              {event.severity}
                            </Badge>
                            {event.resolved && (
                              <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Type: {event.type}</span>
                            <span>IP: {event.ip}</span>
                            <span>Time: {new Date(event.timestamp).toLocaleString()}</span>
                            {event.user && <span>User: {event.user}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!event.resolved && (
                          <Button 
                            size="sm"
                            onClick={() => handleResolveEvent(event.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Resolve
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Configure your security settings and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Authentication Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentication</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for all admin users</p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input 
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => 
                        setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Policy</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Minimum Password Length</Label>
                    <Input 
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => 
                        setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Uppercase Letters</Label>
                      <p className="text-sm text-gray-500">Passwords must contain uppercase letters</p>
                    </div>
                    <Switch 
                      checked={securitySettings.passwordRequireUppercase}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, passwordRequireUppercase: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Numbers</Label>
                      <p className="text-sm text-gray-500">Passwords must contain numbers</p>
                    </div>
                    <Switch 
                      checked={securitySettings.passwordRequireNumbers}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, passwordRequireNumbers: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Symbols</Label>
                      <p className="text-sm text-gray-500">Passwords must contain special characters</p>
                    </div>
                    <Switch 
                      checked={securitySettings.passwordRequireSymbols}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, passwordRequireSymbols: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Login Protection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Login Protection</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Max Login Attempts</Label>
                    <Input 
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => 
                        setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lockout Duration (minutes)</Label>
                    <Input 
                      type="number"
                      value={securitySettings.lockoutDuration}
                      onChange={(e) => 
                        setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})
                      }
                    />
                  </div>
                </div>
              </div>

              {/* IP Restrictions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">IP Restrictions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>IP Whitelist</Label>
                      <p className="text-sm text-gray-500">Only allow access from whitelisted IPs</p>
                    </div>
                    <Switch 
                      checked={securitySettings.ipWhitelist}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, ipWhitelist: checked})
                      }
                    />
                  </div>
                  {securitySettings.ipWhitelist && (
                    <div className="space-y-2">
                      <Label>Whitelisted IPs (one per line)</Label>
                      <Textarea 
                        rows={4}
                        placeholder="192.168.1.1&#10;10.0.0.1&#n;..."
                        value={securitySettings.ipWhitelistList}
                        onChange={(e) => 
                          setSecuritySettings({...securitySettings, ipWhitelistList: e.target.value})
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Monitoring */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Monitoring & Alerts</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-gray-500">Log all security events</p>
                    </div>
                    <Switch 
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, auditLogging: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-gray-500">Send email alerts for security events</p>
                    </div>
                    <Switch 
                      checked={securitySettings.emailAlerts}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, emailAlerts: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-gray-500">Send SMS alerts for critical events</p>
                    </div>
                    <Switch 
                      checked={securitySettings.smsAlerts}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, smsAlerts: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Recovery Tab */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Database Backups
                </CardTitle>
                <CardDescription>
                  Manage your database backups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Last Backup</h3>
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      January 20, 2024 at 10:00 AM
                    </p>
                    <p className="text-sm text-gray-500">Size: 245 MB</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Next Scheduled Backup</h3>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      January 21, 2024 at 2:00 AM
                    </p>
                    <p className="text-sm text-gray-500">Automatic daily backup</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button>
                      <Database className="mr-2 h-4 w-4" />
                      Backup Now
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Backup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Backup Settings
                </CardTitle>
                <CardDescription>
                  Configure backup schedule and retention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Retention Period</Label>
                    <Select defaultValue="30">
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
                  <div className="space-y-2">
                    <Label>Backup Location</Label>
                    <Select defaultValue="local">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local Storage</SelectItem>
                        <SelectItem value="s3">Amazon S3</SelectItem>
                        <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                        <SelectItem value="azure">Azure Blob Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Encrypt Backups</Label>
                      <p className="text-sm text-gray-500">Encrypt backup files</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}