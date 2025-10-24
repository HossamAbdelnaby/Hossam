'use client'

import { useState } from 'react'
import { 
  Plug, 
  CreditCard, 
  Shield, 
  Globe, 
  Mail, 
  BarChart3, 
  Database,
  Key,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  Save,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Integration {
  id: string
  name: string
  type: 'payment' | 'analytics' | 'email' | 'storage' | 'api'
  status: 'connected' | 'disconnected' | 'error'
  description: string
  icon: React.ReactNode
  config: Record<string, any>
  lastSync?: string
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Stripe',
    type: 'payment',
    status: 'connected',
    description: 'Process payments securely with Stripe',
    icon: <CreditCard className="h-5 w-5" />,
    config: {
      apiKey: 'sk_test_•••••••••••••••••••••••••',
      webhookSecret: 'whsec_•••••••••••••••••••••••••',
      publishableKey: 'pk_test_•••••••••••••••••••••••••'
    },
    lastSync: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'PayPal',
    type: 'payment',
    status: 'disconnected',
    description: 'Accept PayPal payments',
    icon: <CreditCard className="h-5 w-5" />,
    config: {
      clientId: '',
      clientSecret: '',
      sandbox: true
    }
  },
  {
    id: '3',
    name: 'Google Analytics',
    type: 'analytics',
    status: 'connected',
    description: 'Track website analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    config: {
      trackingId: 'GA-MEASUREMENT-ID',
      serviceAccountKey: '•••••••••••••••••••••••••'
    },
    lastSync: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    name: 'SendGrid',
    type: 'email',
    status: 'connected',
    description: 'Send transactional emails',
    icon: <Mail className="h-5 w-5" />,
    config: {
      apiKey: 'SG.•••••••••••••••••••••••••',
      fromEmail: 'noreply@clashtournaments.com'
    },
    lastSync: '2024-01-20T08:45:00Z'
  },
  {
    id: '5',
    name: 'AWS S3',
    type: 'storage',
    status: 'connected',
    description: 'Store files and media',
    icon: <Database className="h-5 w-5" />,
    config: {
      accessKeyId: 'AKIA•••••••••••••••••••••••••',
      region: 'us-east-1',
      bucket: 'clashtournaments-media'
    },
    lastSync: '2024-01-20T07:30:00Z'
  }
]

const availableIntegrations = [
  {
    name: 'Stripe',
    type: 'payment',
    description: 'Process payments securely with Stripe',
    icon: <CreditCard className="h-5 w-5" />,
    category: 'Payment'
  },
  {
    name: 'PayPal',
    type: 'payment',
    description: 'Accept PayPal payments',
    icon: <CreditCard className="h-5 w-5" />,
    category: 'Payment'
  },
  {
    name: 'Square',
    type: 'payment',
    description: 'Accept payments with Square',
    icon: <CreditCard className="h-5 w-5" />,
    category: 'Payment'
  },
  {
    name: 'Google Analytics',
    type: 'analytics',
    description: 'Track website analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    category: 'Analytics'
  },
  {
    name: 'Mixpanel',
    type: 'analytics',
    description: 'Product analytics platform',
    icon: <BarChart3 className="h-5 w-5" />,
    category: 'Analytics'
  },
  {
    name: 'SendGrid',
    type: 'email',
    description: 'Send transactional emails',
    icon: <Mail className="h-5 w-5" />,
    category: 'Email'
  },
  {
    name: 'Mailgun',
    type: 'email',
    description: 'Email delivery service',
    icon: <Mail className="h-5 w-5" />,
    category: 'Email'
  },
  {
    name: 'AWS S3',
    type: 'storage',
    description: 'Store files and media',
    icon: <Database className="h-5 w-5" />,
    category: 'Storage'
  },
  {
    name: 'Cloudinary',
    type: 'storage',
    description: 'Cloud image and video management',
    icon: <Database className="h-5 w-5" />,
    category: 'Storage'
  }
]

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [activeTab, setActiveTab] = useState('connected')
  const [isAddIntegrationOpen, setIsAddIntegrationOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null)
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'connected': return 'default'
      case 'disconnected': return 'secondary'
      case 'error': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected': return <XCircle className="h-4 w-4 text-gray-400" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard className="h-5 w-5" />
      case 'analytics': return <BarChart3 className="h-5 w-5" />
      case 'email': return <Mail className="h-5 w-5" />
      case 'storage': return <Database className="h-5 w-5" />
      default: return <Plug className="h-5 w-5" />
    }
  }

  const handleToggleApiKey = (integrationId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }))
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleConnectIntegration = (integration: any) => {
    setSelectedIntegration(integration)
    setIsAddIntegrationOpen(true)
  }

  const handleDisconnectIntegration = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, status: 'disconnected' as const }
        : integration
    ))
  }

  const handleReconnectIntegration = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, status: 'connected' as const }
        : integration
    ))
  }

  const filteredIntegrations = integrations.filter(integration => {
    if (activeTab === 'connected') return integration.status === 'connected'
    if (activeTab === 'disconnected') return integration.status === 'disconnected'
    if (activeTab === 'error') return integration.status === 'error'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600">Connect and manage third-party services</p>
        </div>
        <Dialog open={isAddIntegrationOpen} onOpenChange={setIsAddIntegrationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Connect New Integration</DialogTitle>
              <DialogDescription>
                Choose a service to integrate with your platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Integration</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIntegrations.map((integration) => (
                      <SelectItem key={integration.name} value={integration.name}>
                        <div className="flex items-center space-x-2">
                          {integration.icon}
                          <span>{integration.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input type="password" placeholder="Enter API key" />
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <Input type="password" placeholder="Enter secret key" />
                </div>
                <div className="space-y-2">
                  <Label>Environment</Label>
                  <Select defaultValue="sandbox">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddIntegrationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddIntegrationOpen(false)}>
                  Connect Integration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="disconnected">Disconnected</TabsTrigger>
          <TabsTrigger value="error">Errors</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>

        {/* Connected Integrations */}
        <TabsContent value="connected" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {integration.icon}
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(integration.status)}
                      <Badge variant={getStatusBadgeVariant(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Configuration</Label>
                      <div className="space-y-2">
                        {Object.entries(integration.config).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-mono">
                                {showApiKeys[integration.id] ? value : '•••••••••••••••••••••••••'}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleApiKey(integration.id)}
                              >
                                {showApiKeys[integration.id] ? (
                                  <EyeOff className="h-3 w-3" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyToClipboard(value as string)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {integration.lastSync && (
                      <div className="text-sm text-gray-500">
                        Last sync: {new Date(integration.lastSync).toLocaleString()}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnectIntegration(integration.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Disconnected Integrations */}
        <TabsContent value="disconnected" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {integration.icon}
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(integration.status)}
                      <Badge variant={getStatusBadgeVariant(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm"
                      onClick={() => handleReconnectIntegration(integration.id)}
                    >
                      <Plug className="mr-2 h-4 w-4" />
                      Reconnect
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Error Integrations */}
        <TabsContent value="error" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Errors</CardTitle>
              <CardDescription>
                Fix issues with your integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredIntegrations.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Errors</h3>
                    <p className="text-gray-600">All integrations are working properly</p>
                  </div>
                ) : (
                  filteredIntegrations.map((integration) => (
                    <div key={integration.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {integration.icon}
                          <h3 className="font-medium">{integration.name}</h3>
                        </div>
                        <Badge variant="destructive">Error</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Failed to sync with the service. Please check your API credentials.
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Retry
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="mr-2 h-4 w-4" />
                          Fix Configuration
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Available Integrations */}
        <TabsContent value="available" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableIntegrations.map((integration) => (
              <Card key={integration.name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {integration.icon}
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{integration.category}</Badge>
                    <Button 
                      size="sm"
                      onClick={() => handleConnectIntegration(integration)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* API Keys Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            API Keys Management
          </CardTitle>
          <CardDescription>
            Manage your API keys and access tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Platform API Key</h3>
                <p className="text-sm text-gray-600">Used for external API access</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono">pk_live_•••••••••••••••••••••••••</span>
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Webhook Secret</h3>
                <p className="text-sm text-gray-600">Used for webhook verification</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono">whsec_•••••••••••••••••••••••••</span>
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Generate New API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}