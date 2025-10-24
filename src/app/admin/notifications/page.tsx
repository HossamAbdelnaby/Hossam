'use client'

import { useState } from 'react'
import { 
  Bell, 
  Mail, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Copy,
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
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  target: 'all' | 'users' | 'admins' | 'specific'
  status: 'draft' | 'scheduled' | 'sent'
  scheduledDate?: string
  sentDate?: string
  readCount: number
  totalCount: number
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  type: 'welcome' | 'password_reset' | 'tournament' | 'newsletter' | 'custom'
  variables: string[]
  content: string
  active: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'System Maintenance Scheduled',
    message: 'We will be performing scheduled maintenance on January 25, 2024 from 2:00 AM to 4:00 AM EST.',
    type: 'warning',
    target: 'all',
    status: 'scheduled',
    scheduledDate: '2024-01-24T20:00:00Z',
    readCount: 0,
    totalCount: 2543
  },
  {
    id: '2',
    title: 'New Tournament Features',
    message: 'Check out our new tournament features including enhanced matchmaking and prize distribution!',
    type: 'info',
    target: 'users',
    status: 'sent',
    sentDate: '2024-01-20T10:00:00Z',
    readCount: 1823,
    totalCount: 2100
  },
  {
    id: '3',
    title: 'Welcome to Clash Tournaments!',
    message: 'Thank you for joining! Get started by creating your profile and exploring upcoming tournaments.',
    type: 'success',
    target: 'users',
    status: 'sent',
    sentDate: '2024-01-15T09:00:00Z',
    readCount: 456,
    totalCount: 512
  }
]

const mockEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Clash Tournaments!',
    type: 'welcome',
    variables: ['{{user_name}}', '{{signup_date}}'],
    content: 'Hi {{user_name}},\n\nWelcome to Clash Tournaments! We\'re excited to have you join our community.\n\nBest regards,\nThe Clash Tournaments Team',
    active: true
  },
  {
    id: '2',
    name: 'Password Reset',
    subject: 'Reset Your Password',
    type: 'password_reset',
    variables: ['{{user_name}}', '{{reset_link}}', '{{expiry_time}}'],
    content: 'Hi {{user_name}},\n\nClick the link below to reset your password:\n{{reset_link}}\n\nThis link will expire in {{expiry_time}}.\n\nIf you didn\'t request this, please ignore this email.',
    active: true
  },
  {
    id: '3',
    name: 'Tournament Registration',
    subject: 'Tournament Registration Confirmation',
    type: 'tournament',
    variables: ['{{user_name}}', '{{tournament_name}}', '{{tournament_date}}', '{{registration_id}}'],
    content: 'Hi {{user_name}},\n\nYou have successfully registered for {{tournament_name}} on {{tournament_date}}.\n\nRegistration ID: {{registration_id}}\n\nGood luck!',
    active: true
  }
]

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates)
  const [activeTab, setActiveTab] = useState('notifications')
  const [isCreateNotificationOpen, setIsCreateNotificationOpen] = useState(false)
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    digestEmail: 'weekly',
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    }
  })

  const [emailSettings, setEmailSettings] = useState({
    provider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@clashtournaments.com',
    smtpPassword: '••••••••',
    fromEmail: 'noreply@clashtournaments.com',
    fromName: 'Clash Tournaments',
    replyTo: 'support@clashtournaments.com'
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <MessageSquare className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default'
      case 'scheduled': return 'secondary'
      case 'draft': return 'outline'
      default: return 'outline'
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'success': return 'default'
      case 'warning': return 'secondary'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  const handleSendNotification = () => {
    // Implementation for sending notification
    console.log('Sending notification...')
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setIsCreateTemplateOpen(true)
  }

  const handleDeleteTemplate = (id: string) => {
    setEmailTemplates(emailTemplates.filter(t => t.id !== id))
  }

  const handleToggleTemplate = (id: string) => {
    setEmailTemplates(emailTemplates.map(t => 
      t.id === id ? { ...t, active: !t.active } : t
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications & Email</h1>
          <p className="text-gray-600">Manage notifications and email templates</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCreateNotificationOpen} onOpenChange={setIsCreateNotificationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Send New Notification</DialogTitle>
                <DialogDescription>
                  Create and send a notification to users
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notification-title">Title</Label>
                  <Input id="notification-title" placeholder="Enter notification title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-message">Message</Label>
                  <Textarea 
                    id="notification-message" 
                    rows={4}
                    placeholder="Enter notification message"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification-type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-target">Target</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="users">Regular Users</SelectItem>
                        <SelectItem value="admins">Admins</SelectItem>
                        <SelectItem value="specific">Specific Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateNotificationOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateNotificationOpen(false)}>
                    Send Notification
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="email-config">Email Config</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => n.status === 'sent').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => n.status === 'scheduled').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Read Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  Average read rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.reduce((sum, n) => sum + n.totalCount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                View and manage sent notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={getStatusBadgeVariant(notification.status)}>
                              {notification.status}
                            </Badge>
                            <Badge variant={getTypeBadgeVariant(notification.type)}>
                              {notification.type}
                            </Badge>
                            <Badge variant="outline">
                              {notification.target}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right text-sm text-gray-500">
                          {notification.readCount}/{notification.totalCount} read
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Email Templates</h2>
              <p className="text-gray-600">Manage your email templates</p>
            </div>
            <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedTemplate ? 'Edit Template' : 'Create New Template'}
                  </DialogTitle>
                  <DialogDescription>
                    Design your email template
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input 
                      id="template-name" 
                      defaultValue={selectedTemplate?.name}
                      placeholder="Enter template name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-subject">Subject</Label>
                    <Input 
                      id="template-subject" 
                      defaultValue={selectedTemplate?.subject}
                      placeholder="Enter email subject" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-content">Content</Label>
                    <Textarea 
                      id="template-content" 
                      rows={8}
                      defaultValue={selectedTemplate?.content}
                      placeholder="Enter email content. Use {'{variable_name}'} for dynamic content."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Available Variables</Label>
                    <div className="text-sm text-gray-600">
                      Use {'{variable_name}'} syntax. Available: user_name, email, signup_date, etc.
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsCreateTemplateOpen(false)
                      setSelectedTemplate(null)
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      setIsCreateTemplateOpen(false)
                      setSelectedTemplate(null)
                    }}>
                      Save Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {emailTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="outline">{template.type}</Badge>
                        {template.active && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Subject: {template.subject}</p>
                      <p className="text-sm text-gray-500">
                        Variables: {template.variables.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={template.active}
                        onCheckedChange={() => handleToggleTemplate(template.id)}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how notifications are delivered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send notifications via email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, emailNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-500">Send browser push notifications</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, pushNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Send notifications via SMS</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, smsNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>In-App Notifications</Label>
                    <p className="text-sm text-gray-500">Show notifications in the app</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.inAppNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, inAppNotifications: checked})
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Digest Email Frequency</Label>
                  <Select 
                    value={notificationSettings.digestEmail}
                    onValueChange={(value) => 
                      setNotificationSettings({...notificationSettings, digestEmail: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Quiet Hours</Label>
                    <p className="text-sm text-gray-500">Limit notifications during specific hours</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({
                        ...notificationSettings, 
                        quietHours: {...notificationSettings.quietHours, enabled: checked}
                      })
                    }
                  />
                </div>
                {notificationSettings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input 
                        type="time" 
                        value={notificationSettings.quietHours.start}
                        onChange={(e) => 
                          setNotificationSettings({
                            ...notificationSettings, 
                            quietHours: {...notificationSettings.quietHours, start: e.target.value}
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input 
                        type="time" 
                        value={notificationSettings.quietHours.end}
                        onChange={(e) => 
                          setNotificationSettings({
                            ...notificationSettings, 
                            quietHours: {...notificationSettings.quietHours, end: e.target.value}
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Configuration Tab */}
        <TabsContent value="email-config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure your email service provider settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Provider</Label>
                  <Select 
                    value={emailSettings.provider}
                    onValueChange={(value) => setEmailSettings({...emailSettings, provider: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="aws-ses">AWS SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {emailSettings.provider === 'smtp' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SMTP Host</Label>
                        <Input 
                          value={emailSettings.smtpHost}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SMTP Port</Label>
                        <Input 
                          value={emailSettings.smtpPort}
                          onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Username</Label>
                      <Input 
                        value={emailSettings.smtpUsername}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Password</Label>
                      <Input 
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Settings</h3>
                  <div className="space-y-2">
                    <Label>From Email</Label>
                    <Input 
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>From Name</Label>
                    <Input 
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reply-To Email</Label>
                    <Input 
                      value={emailSettings.replyTo}
                      onChange={(e) => setEmailSettings({...emailSettings, replyTo: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                  <Button variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}