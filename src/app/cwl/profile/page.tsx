'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { 
  Shield, 
  Users, 
  Crown, 
  Calendar,
  User,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Settings,
  Eye,
  Trash2
} from 'lucide-react'

interface Clan {
  id: string
  name: string
  tag: string
  leagueLevel?: number
  membersNeeded: number
  offeredPayment: number
  terms?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface JoinRequest {
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

export default function ClanProfilePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [clan, setClan] = useState<Clan | null>(null)
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [activeTab, setActiveTab] = useState('details')

  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchClanDetails()
      fetchJoinRequests()
    }
  }, [user])

  const fetchClanDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cwl/my-clan')
      
      if (!response.ok) {
        if (response.status === 404) {
          // User doesn't have a clan
          return
        }
        throw new Error('Failed to fetch clan details')
      }

      const data = await response.json()
      setClan(data.clan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clan details')
    } finally {
      setLoading(false)
    }
  }

  const fetchJoinRequests = async () => {
    try {
      const response = await fetch('/api/cwl/my-clan/applications')
      
      if (!response.ok) {
        if (response.status === 404) {
          // No clan or no applications
          return
        }
        throw new Error('Failed to fetch join requests')
      }

      const data = await response.json()
      setJoinRequests(data.applications || [])
    } catch (err) {
      console.error('Failed to fetch join requests:', err)
    }
  }

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/cwl/my-clan/applications/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`)
      }

      // Refresh join requests
      await fetchJoinRequests()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} request`)
    }
  }

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/cwl/my-clan/applications/${requestId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete request')
      }

      // Refresh join requests
      await fetchJoinRequests()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete request')
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-8">
            Please login to view your clan profile.
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
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!clan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">No Clan Found</h1>
          <p className="text-muted-foreground mb-8">
            You haven't registered any CWL clan yet.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/cwl/register">Register Your Clan</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cwl">Browse CWL Clans</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const pendingRequests = joinRequests.filter(req => req.status === 'pending')
  const approvedRequests = joinRequests.filter(req => req.status === 'approved')
  const rejectedRequests = joinRequests.filter(req => req.status === 'rejected')

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/cwl" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to CWL Clans
        </Link>
        
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{clan.name}</h1>
                <p className="text-muted-foreground">
                  Manage your CWL clan and view join requests
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/cwl/${clan.id}/apply`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Application Page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Clan Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Clan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clan Name</p>
                <p className="text-lg font-semibold">{clan.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clan Tag</p>
                <p className="text-lg font-semibold">{clan.tag}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">League Level</p>
                <Badge variant="outline">League {clan.leagueLevel || 'N/A'}</Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Members Needed</p>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg font-semibold">{clan.membersNeeded}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Per Player</p>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg font-semibold">${clan.offeredPayment.toFixed(2)}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={clan.isActive ? "default" : "secondary"}>
                  {clan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(clan.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {clan.terms && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Terms & Conditions</p>
                  <p className="text-sm bg-muted p-3 rounded-md">{clan.terms}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Join Requests */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Join Requests
              </CardTitle>
              <CardDescription>
                Manage player applications to join your clan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Pending ({pendingRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Approved ({approvedRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Rejected ({rejectedRequests.length})
                  </TabsTrigger>
                </TabsList>

                {/* Pending Requests */}
                <TabsContent value="pending" className="space-y-4">
                  {pendingRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No pending requests</p>
                    </div>
                  ) : (
                    pendingRequests.map((request) => (
                      <Card key={request.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{request.inGameName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {request.accountTag}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>{request.user.email}</span>
                                {request.user.name && (
                                  <span>({request.user.name})</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Applied {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRequestAction(request.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRequestAction(request.id, 'reject')}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteRequest(request.id)}
                                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* Approved Requests */}
                <TabsContent value="approved" className="space-y-4">
                  {approvedRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No approved requests</p>
                    </div>
                  ) : (
                    approvedRequests.map((request) => (
                      <Card key={request.id} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{request.inGameName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {request.accountTag}
                                </Badge>
                                <Badge variant="default" className="text-xs">
                                  Approved
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>{request.user.email}</span>
                                {request.user.name && (
                                  <span>({request.user.name})</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Applied {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteRequest(request.id)}
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* Rejected Requests */}
                <TabsContent value="rejected" className="space-y-4">
                  {rejectedRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <XCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No rejected requests</p>
                    </div>
                  ) : (
                    rejectedRequests.map((request) => (
                      <Card key={request.id} className="border-l-4 border-l-red-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{request.inGameName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {request.accountTag}
                                </Badge>
                                <Badge variant="destructive" className="text-xs">
                                  Rejected
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>{request.user.email}</span>
                                {request.user.name && (
                                  <span>({request.user.name})</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Applied {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteRequest(request.id)}
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}