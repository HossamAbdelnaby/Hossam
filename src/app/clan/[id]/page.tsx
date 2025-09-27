"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  DollarSign, 
  Calendar,
  Clock,
  CheckCircle,
  Loader2,
  Star,
  Shield,
  Globe,
  MapPin,
  Send,
  Crown,
  Target,
  Zap,
  User,
  Award
} from "lucide-react";

interface ClanProfile {
  id: string;
  name: string;
  tag: string;
  description?: string;
  region: string;
  language: string;
  type: string;
  trophies: number;
  warWins: number;
  warWinStreak: number;
  memberCount: number;
  topPlayerPrice: number;
  coLeaderPrice: number;
  memberPrice: number;
  requirements: {
    required: string[];
    preferred: string[];
  };
  terms: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  contracts: any[];
}

export default function ClanProfilePage() {
  const [clan, setClan] = useState<ClanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const [contractForm, setContractForm] = useState({
    message: "",
    playerTag: "",
    requestedPosition: "",
  });
  
  const [editForm, setEditForm] = useState({
    name: "",
    tag: "",
    description: "",
    region: "",
    language: "",
    type: "",
    trophies: 0,
    warWins: 0,
    warWinStreak: 0,
    memberCount: 0,
    topPlayerPrice: 0,
    coLeaderPrice: 0,
    memberPrice: 0,
    requirements: {
      required: [] as string[],
      preferred: [] as string[],
    },
    terms: "",
    isActive: true,
  });
  
  const [submittingContract, setSubmittingContract] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [contractSuccess, setContractSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const clanId = params.id as string;

  useEffect(() => {
    fetchClan();
  }, [clanId]);

  const fetchClan = async () => {
    try {
      const response = await fetch(`/api/clan/${clanId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Clan not found');
        } else {
          setError('Failed to fetch clan');
        }
        return;
      }

      const data = await response.json();
      setClan(data.clan);
    } catch (err) {
      setError('Failed to fetch clan');
    } finally {
      setLoading(false);
    }
  };

  const handleHireClan = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setShowHireDialog(true);
  };

  const handleEditClan = () => {
    if (!clan) return;
    
    setEditForm({
      name: clan.name,
      tag: clan.tag,
      description: clan.description || "",
      region: clan.region,
      language: clan.language,
      type: clan.type,
      trophies: clan.trophies,
      warWins: clan.warWins,
      warWinStreak: clan.warWinStreak,
      memberCount: clan.memberCount,
      topPlayerPrice: clan.topPlayerPrice,
      coLeaderPrice: clan.coLeaderPrice,
      memberPrice: clan.memberPrice,
      requirements: {
        required: clan.requirements.required,
        preferred: clan.requirements.preferred,
      },
      terms: clan.terms,
      isActive: clan.isActive,
    });
    setShowEditDialog(true);
  };

  const handleContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clan || !user) return;

    setSubmittingContract(true);
    setError("");

    try {
      const response = await fetch('/api/clan/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clanId: clan.id,
          message: contractForm.message,
          playerTag: contractForm.playerTag,
          requestedPosition: contractForm.requestedPosition,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send contract request');
      }

      setContractSuccess(true);
      setShowHireDialog(false);
      setContractForm({ message: "", playerTag: "", requestedPosition: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send contract request');
    } finally {
      setSubmittingContract(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clan || !user) return;

    setSubmittingEdit(true);
    setError("");

    try {
      const response = await fetch(`/api/clan/${clan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update clan');
      }

      const data = await response.json();
      setClan(data.clan);
      setEditSuccess(true);
      setShowEditDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update clan');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleEditChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRequirementsChange = (type: 'required' | 'preferred', value: string) => {
    setEditForm(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [type]: value.split('\n').filter(line => line.trim() !== '')
      }
    }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INVITE_ONLY': return 'secondary';
      case 'ANYONE_CAN_JOIN': return 'default';
      case 'CLOSED': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'GLOBAL': return 'default';
      case 'NORTH_AMERICA': return 'secondary';
      case 'EUROPE': return 'outline';
      case 'ASIA': return 'destructive';
      case 'SOUTH_AMERICA': return 'secondary';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !clan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{error || 'Clan not found'}</h1>
          <Button asChild>
            <Link href="/rent-clan">Back to Clans</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/rent-clan" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Clans
        </Link>
        
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center">
              <Crown className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{clan.name}</h1>
                <p className="text-muted-foreground mb-3">
                  {clan.tag}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant={getTypeColor(clan.type)}>
                    {clan.type}
                  </Badge>
                  <Badge variant={getRegionColor(clan.region)}>
                    {clan.region}
                  </Badge>
                  {clan.isActive && (
                    <Badge variant="default" className="text-green-600 bg-green-50">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {user && user.id === clan.user.id && (
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={handleEditClan}
                    className="gap-2"
                  >
                    Edit Clan
                  </Button>
                )}
                <Button 
                  size="lg"
                  disabled={!clan.isActive}
                  onClick={handleHireClan}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  {clan.isActive ? 'Apply to Join' : 'Not Accepting Applications'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {contractSuccess && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Application sent successfully! The clan leader will review your request.
          </AlertDescription>
        </Alert>
      )}

      {editSuccess && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Clan information updated successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Clan Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                    <Trophy className="w-5 h-5" />
                    {clan.trophies.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Trophies</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                    <Target className="w-5 h-5" />
                    {clan.warWins}
                  </div>
                  <div className="text-sm text-muted-foreground">War Wins</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                    <Users className="w-5 h-5" />
                    {clan.memberCount}/50
                  </div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                    <Zap className="w-5 h-5" />
                    {clan.warWinStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">Win Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Membership Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-primary mb-2">
                    ${clan.topPlayerPrice}
                  </div>
                  <h3 className="font-semibold mb-2">Top Player</h3>
                  <p className="text-sm text-muted-foreground">
                    Guaranteed top player position with full privileges
                  </p>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-primary mb-2">
                    ${clan.coLeaderPrice}
                  </div>
                  <h3 className="font-semibold mb-2">Co-Leader</h3>
                  <p className="text-sm text-muted-foreground">
                    Co-leader position with administrative responsibilities
                  </p>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-primary mb-2">
                    ${clan.memberPrice}
                  </div>
                  <h3 className="font-semibold mb-2">Member</h3>
                  <p className="text-sm text-muted-foreground">
                    Regular member position with standard benefits
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Required</h4>
                  <div className="space-y-2">
                    {clan.requirements.required.map((req, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-blue-600">Preferred</h4>
                  <div className="space-y-2">
                    {clan.requirements.preferred.map((req, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {clan.description && (
            <Card>
              <CardHeader>
                <CardTitle>About Our Clan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {clan.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Terms and Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {clan.terms}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Clan Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Leader: {clan.user.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span>{clan.language}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{clan.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Founded {formatDate(clan.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full"
                disabled={!clan.isActive}
                onClick={handleHireClan}
              >
                <Send className="w-4 h-4 mr-2" />
                Apply to Join
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/rent-clan">
                  <Users className="w-4 h-4 mr-2" />
                  Browse Other Clans
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Applications</span>
                  <span className="font-medium">{clan.contracts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Slots</span>
                  <span className="font-medium">{clan.memberCount}/50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={clan.isActive ? "default" : "secondary"}>
                    {clan.isActive ? "Accepting Applications" : "Closed"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contract Dialog */}
      <Dialog open={showHireDialog} onOpenChange={setShowHireDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply to {clan?.name}</DialogTitle>
            <DialogDescription>
              Send your application to join this clan. The clan leader will review your request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContractSubmit} className="space-y-4">
            <div>
              <Label htmlFor="playerTag">Player Tag</Label>
              <Input
                id="playerTag"
                placeholder="#YourPlayerTag"
                value={contractForm.playerTag}
                onChange={(e) => setContractForm(prev => ({ ...prev, playerTag: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="requestedPosition">Requested Position</Label>
              <Select 
                value={contractForm.requestedPosition} 
                onValueChange={(value) => setContractForm(prev => ({ ...prev, requestedPosition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOP_PLAYER">Top Player</SelectItem>
                  <SelectItem value="CO_LEADER">Co-Leader</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us about yourself and why you want to join our clan..."
                value={contractForm.message}
                onChange={(e) => setContractForm(prev => ({ ...prev, message: e.target.value }))}
                className="min-h-[100px]"
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={submittingContract} className="flex-1">
                {submittingContract ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Application
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowHireDialog(false)}
                disabled={submittingContract}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Clan Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Clan Information</DialogTitle>
            <DialogDescription>
              Update your clan's details and settings
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Clan Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-tag">Clan Tag</Label>
                <Input
                  id="edit-tag"
                  value={editForm.tag}
                  onChange={(e) => handleEditChange('tag', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-region">Region</Label>
                <Select value={editForm.region} onValueChange={(value) => handleEditChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GLOBAL">Global</SelectItem>
                    <SelectItem value="NORTH_AMERICA">North America</SelectItem>
                    <SelectItem value="EUROPE">Europe</SelectItem>
                    <SelectItem value="ASIA">Asia</SelectItem>
                    <SelectItem value="SOUTH_AMERICA">South America</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-language">Language</Label>
                <Select value={editForm.language} onValueChange={(value) => handleEditChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="portuguese">Portuguese</SelectItem>
                    <SelectItem value="russian">Russian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-type">Clan Type</Label>
                <Select value={editForm.type} onValueChange={(value) => handleEditChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INVITE_ONLY">Invite Only</SelectItem>
                    <SelectItem value="ANYONE_CAN_JOIN">Anyone Can Join</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-isActive">Status</Label>
                <Select value={editForm.isActive ? 'true' : 'false'} onValueChange={(value) => handleEditChange('isActive', value === 'true')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active (Accepting Applications)</SelectItem>
                    <SelectItem value="false">Inactive (Not Accepting)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => handleEditChange('description', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="edit-trophies">Trophies</Label>
                <Input
                  id="edit-trophies"
                  type="number"
                  value={editForm.trophies}
                  onChange={(e) => handleEditChange('trophies', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-warWins">War Wins</Label>
                <Input
                  id="edit-warWins"
                  type="number"
                  value={editForm.warWins}
                  onChange={(e) => handleEditChange('warWins', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-warWinStreak">Win Streak</Label>
                <Input
                  id="edit-warWinStreak"
                  type="number"
                  value={editForm.warWinStreak}
                  onChange={(e) => handleEditChange('warWinStreak', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-memberCount">Member Count</Label>
                <Input
                  id="edit-memberCount"
                  type="number"
                  value={editForm.memberCount}
                  onChange={(e) => handleEditChange('memberCount', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-topPlayerPrice">Top Player Price ($)</Label>
                <Input
                  id="edit-topPlayerPrice"
                  type="number"
                  value={editForm.topPlayerPrice}
                  onChange={(e) => handleEditChange('topPlayerPrice', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-coLeaderPrice">Co-Leader Price ($)</Label>
                <Input
                  id="edit-coLeaderPrice"
                  type="number"
                  value={editForm.coLeaderPrice}
                  onChange={(e) => handleEditChange('coLeaderPrice', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-memberPrice">Member Price ($)</Label>
                <Input
                  id="edit-memberPrice"
                  type="number"
                  value={editForm.memberPrice}
                  onChange={(e) => handleEditChange('memberPrice', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-required">Required Requirements (one per line)</Label>
                <Textarea
                  id="edit-required"
                  value={editForm.requirements.required.join('\n')}
                  onChange={(e) => handleRequirementsChange('required', e.target.value)}
                  rows={4}
                  placeholder="Minimum trophies: 5000&#10;Town Hall level: 12+&#10;War stars: 1000+"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-preferred">Preferred Requirements (one per line)</Label>
                <Textarea
                  id="edit-preferred"
                  value={editForm.requirements.preferred.join('\n')}
                  onChange={(e) => handleRequirementsChange('preferred', e.target.value)}
                  rows={4}
                  placeholder="High hero levels&#10;Good war attack strategy&#10;Active daily"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-terms">Terms and Conditions</Label>
              <Textarea
                id="edit-terms"
                value={editForm.terms}
                onChange={(e) => handleEditChange('terms', e.target.value)}
                rows={4}
                required
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="submit" 
                disabled={submittingEdit}
              >
                {submittingEdit ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Save Changes
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
                disabled={submittingEdit}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}