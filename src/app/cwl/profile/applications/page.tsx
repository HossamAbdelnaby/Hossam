'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'
import { 
  ArrowLeft, 
  Users, 
  UserCheck, 
  UserX, 
  Trash2, 
  Calendar,
  Mail,
  Shield,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'

interface Application {
  id: string
  inGameName: string
  accountTag: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  user: {
    id: string
    email: string
    name?: string
  }
}

export default function CWLApplicationsPage() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<Application[]>([])
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [success, setSuccess] = useState('')

  const { user } = useAuth()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cwl/my-clan/applications')
      
      if (!response.ok) {
        if (response.status === 404) {
          // No clan found
          setError('You need to register a clan first')
          return
        }
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      setApplications(data.applications)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationAction = async (applicationId: string, action: 'approve' | 'reject') => {
    setProcessingId(applicationId)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/cwl/my-clan/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${action} application`)
      }

      const data = await response.json()
      setSuccess(data.message)
      
      // Refresh the applications list
      await fetchApplications()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} application`)
    } finally {
      setProcessingId(null)
    }
  }

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return
    }

    setProcessingId(applicationId)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/cwl/my-clan/applications/${applicationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete application')
      }

      setSuccess('Application deleted successfully')
      
      // Refresh the applications list
      await fetchApplications()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'approved': return UserCheck
      case 'rejected': return UserX
      default: return Clock
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-8">
            Please login to manage clan applications.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error && error.includes('register a clan first')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle>No Clan Found</CardTitle>
            <CardDescription>
              You need to register a clan first before you can manage applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/cwl/register">
                <Shield className="mr-2 h-4 w-4" />
                Register Clan
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/cwl">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to CWL
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const pendingApplications = applications.filter(app => app.status === 'pending')
  const processedApplications = applications.filter(app => app.status !== 'pending')

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/cwl/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Clan Settings
        </Link>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Clan Applications</h1>
            <p className="text-muted-foreground">
              Manage applications from players who want to join your clan
            </p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-2xl font-bold">{pendingApplications.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Pending Applications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span className="text-2xl font-bold">
                {applications.filter(app => app.status === 'approved').length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-red-600" />
              <span className="text-2xl font-bold">
                {applications.filter(app => app.status === 'rejected').length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications */}
      {pendingApplications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pending Applications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingApplications.map((application) => {
              const StatusIcon = getStatusIcon(application.status)
              return (
                <Card key={application.id} className="border-blue-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-1">
                          {application.inGameName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Shield className="w-3 h-3" />
                          {application.accountTag}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(application.status)} className="text-xs">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{application.user.name || application.user.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Applied {formatDate(application.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleApplicationAction(application.id, 'approve')}
                        disabled={processingId === application.id}
                      >
                        {processingId === application.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                        Approve
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleApplicationAction(application.id, 'reject')}
                        disabled={processingId === application.id}
                      >
                        {processingId === application.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserX className="w-4 h-4" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Processed Applications */}
      {processedApplications.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Processed Applications</h2>
          <div className="space-y-4">
            {processedApplications.map((application) => {
              const StatusIcon = getStatusIcon(application.status)
              return (
                <Card key={application.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{application.inGameName}</h3>
                          <Badge variant={getStatusColor(application.status)} className="text-xs">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {application.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>{application.accountTag}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{application.user.name || application.user.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(application.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteApplication(application.id)}
                        disabled={processingId === application.id}
                      >
                        {processingId === application.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* No Applications */}
      {applications.length === 0 && (
        <Card className="text-center py-16">
          <CardContent>
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Applications Yet</h2>
            <p className="text-muted-foreground mb-6">
              When players apply to join your clan, their applications will appear here.
            </p>
            <Button asChild>
              <Link href="/cwl">Back to CWL</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}