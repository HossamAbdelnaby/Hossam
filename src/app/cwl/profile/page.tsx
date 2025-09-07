'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/auth-context'
import { 
  ArrowLeft, 
  Shield, 
  Crown,
  Users, 
  Loader2,
  Save,
  Settings,
  Trash2,
  Power,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface Clan {
  id: string
  name: string
  tag: string
  leagueLevel: number
  membersNeeded: number
  offeredPayment: number
  terms: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    email: string
    name?: string
  }
}

export default function CWLProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [clan, setClan] = useState<Clan | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    leagueLevel: '',
    membersNeeded: '',
    offeredPayment: '',
    terms: '',
    isActive: false
  })

  const { user } = useAuth()

  useEffect(() => {
    fetchClan()
  }, [])

  const fetchClan = async () => {
    try {
      setLoading(true)
      setDebugInfo(null)
      const response = await fetch('/api/cwl/my-clan')
      
      if (response.status === 404) {
        // No clan found
        setClan(null)
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch clan details')
      }

      const data = await response.json()
      setClan(data.clan)
      setFormData({
        name: data.clan.name,
        tag: data.clan.tag,
        leagueLevel: data.clan.leagueLevel.toString(),
        membersNeeded: data.clan.membersNeeded.toString(),
        offeredPayment: data.clan.offeredPayment.toString(),
        terms: data.clan.terms,
        isActive: data.clan.isActive
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clan details')
    } finally {
      setLoading(false)
    }
  }

  const checkClanRelations = async () => {
    try {
      setDebugInfo('Checking clan relations...')
      const response = await fetch('/api/cwl/my-clan/check-relations', {
        method: 'GET'
      })
      
      if (response.ok) {
        const data = await response.json()
        setDebugInfo(JSON.stringify(data, null, 2))
      } else {
        setDebugInfo('Failed to check relations')
      }
    } catch (err) {
      setDebugInfo('Error checking relations: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Clan name is required')
      }

      if (!formData.tag.trim()) {
        throw new Error('Clan tag is required')
      }

      const leagueLevel = parseInt(formData.leagueLevel)
      if (isNaN(leagueLevel) || leagueLevel < 1 || leagueLevel > 3) {
        throw new Error('Valid league level (1-3) is required')
      }

      const membersNeeded = parseInt(formData.membersNeeded)
      if (isNaN(membersNeeded) || membersNeeded < 1 || membersNeeded > 15) {
        throw new Error('Valid members needed (1-15) is required')
      }

      const offeredPayment = parseFloat(formData.offeredPayment)
      if (isNaN(offeredPayment) || offeredPayment < 0) {
        throw new Error('Valid payment amount is required')
      }

      if (!formData.terms.trim()) {
        throw new Error('Terms and conditions are required')
      }

      const response = await fetch('/api/cwl/my-clan', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          tag: formData.tag.trim(),
          leagueLevel,
          membersNeeded,
          offeredPayment,
          terms: formData.terms.trim(),
          isActive: formData.isActive
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update clan')
      }

      const data = await response.json()
      setClan(data.clan)
      setSuccess('Clan settings updated successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update clan')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset your clan? This will remove all members and applications, deactivate the clan, and reset its settings. You can reactivate it later.')) {
      return
    }

    setError('')
    setSuccess('')
    setResetting(true)

    try {
      const response = await fetch('/api/cwl/my-clan/reset', {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = errorData.error || 'Failed to reset clan'
        
        // Provide more user-friendly error messages
        if (errorMessage.includes('Failed to delete clan applications')) {
          errorMessage = 'Failed to reset clan: Could not remove clan applications. Please try again.'
        } else if (errorMessage.includes('Failed to delete clan members')) {
          errorMessage = 'Failed to reset clan: Could not remove clan members. Please try again.'
        } else if (errorMessage.includes('Failed to reset clan')) {
          errorMessage = 'Failed to reset clan: Database error. Please try again or contact support.'
        } else if (errorMessage.includes('Clan not found')) {
          errorMessage = 'Clan not found or already reset.'
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setSuccess('Clan reset successfully! All members and applications removed.')
      
      // Refresh the clan data
      await fetchClan()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset clan')
    } finally {
      setResetting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your clan? This action cannot be undone and will remove all clan members and applications.')) {
      return
    }

    setError('')
    setSuccess('')
    setDeleting(true)

    try {
      // Use the specific delete endpoint
      const response = await fetch('/api/cwl/my-clan/delete', {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = errorData.error || 'Failed to delete clan'
        
        // Provide more user-friendly error messages
        if (errorMessage.includes('Failed to delete clan applications')) {
          errorMessage = 'Failed to delete clan: Could not remove clan applications. Please try again.'
        } else if (errorMessage.includes('Failed to delete clan members')) {
          errorMessage = 'Failed to delete clan: Could not remove clan members. Please try again.'
        } else if (errorMessage.includes('Failed to delete clan')) {
          errorMessage = 'Failed to delete clan: Database error. Please try again or contact support.'
        } else if (errorMessage.includes('Clan not found')) {
          errorMessage = 'Clan not found or already deleted.'
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setClan(null)
      setSuccess('Clan deleted successfully!')
      
      // Redirect to CWL page after a short delay
      setTimeout(() => {
        window.location.href = '/cwl'
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete clan')
    } finally {
      setDeleting(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-8">
            Please login to manage your clan settings.
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

  if (!clan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle>No Clan Found</CardTitle>
            <CardDescription>
              You haven't registered a clan yet. Create your clan to get started with CWL.
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/cwl" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to CWL
        </Link>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Settings className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">My Clan Settings</h1>
            <p className="text-muted-foreground">
              Manage your CWL clan settings and configuration
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={clan.isActive ? 'default' : 'secondary'}>
              {clan.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">
              League {clan.leagueLevel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/cwl/profile/applications">
            <Users className="w-4 h-4" />
            Manage Applications
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href={`/cwl/${clan.id}`}>
            <Shield className="w-4 h-4" />
            View Public Profile
          </Link>
        </Button>
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

      <div className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Clan Information
            </CardTitle>
            <CardDescription>
              Update your clan's basic details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Clan Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter clan name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tag">Clan Tag *</Label>
                <Input
                  id="tag"
                  value={formData.tag}
                  onChange={(e) => handleInputChange('tag', e.target.value)}
                  placeholder="#ABC123XYZ"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leagueLevel">League Level *</Label>
                <Select value={formData.leagueLevel} onValueChange={(value) => handleInputChange('leagueLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select league level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">League 1</SelectItem>
                    <SelectItem value="2">League 2</SelectItem>
                    <SelectItem value="3">League 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="membersNeeded">Number of Members Needed *</Label>
                <Input
                  id="membersNeeded"
                  type="number"
                  min="1"
                  max="15"
                  value={formData.membersNeeded}
                  onChange={(e) => handleInputChange('membersNeeded', e.target.value)}
                  placeholder="1-15"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 15 members can join your clan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Payment Information
            </CardTitle>
            <CardDescription>
              Set the payment amount for players joining your clan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="offeredPayment">Price (per player) *</Label>
              <Input
                id="offeredPayment"
                type="number"
                min="0"
                step="0.01"
                value={formData.offeredPayment}
                onChange={(e) => handleInputChange('offeredPayment', e.target.value)}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Amount you will pay to each player who joins your clan
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Terms & Conditions
            </CardTitle>
            <CardDescription>
              Define the terms and conditions for players joining your clan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="terms">Terms & Conditions *</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                placeholder="Describe the terms and conditions for players joining your clan, including expectations, requirements, and agreement details..."
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                This will be shown to players before they join your clan
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Clan Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="w-5 h-5" />
              Clan Status
            </CardTitle>
            <CardDescription>
              Control whether your clan is active and visible to other players
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Clan is active and visible to players</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              When inactive, your clan won't be shown in the CWL listings and players won't be able to apply to join.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                
                <Button variant="outline" asChild>
                  <Link href="/cwl">Cancel</Link>
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={checkClanRelations}
                  disabled={loading}
                >
                  Debug Relations
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleReset}
                  disabled={resetting}
                  className="gap-2"
                >
                  {resetting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4" />
                      Reset Clan
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={deleting}
                  className="gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Clan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        {debugInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Debug Information</CardTitle>
              <CardDescription>
                Information about clan relations that might affect deletion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded overflow-auto max-h-64">
                {debugInfo}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}