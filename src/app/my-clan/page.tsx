"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { 
  ArrowLeft, 
  Shield, 
  Crown,
  Users, 
  Settings,
  Plus,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ExternalLink
} from "lucide-react";

interface Clan {
  id: string;
  name: string;
  tag: string;
  leagueLevel?: number;
  membersNeeded: number;
  offeredPayment: number;
  terms?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    email: string;
    name?: string;
  };
  _count: {
    members: number;
    applications: number;
  };
}

export default function MyClanPage() {
  const [clan, setClan] = useState<Clan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { user } = useAuth();

  useEffect(() => {
    fetchMyClan();
  }, []);

  const fetchMyClan = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cwl/my-clan');
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No clan found. You need to register a clan first.');
        } else {
          setError('Failed to fetch clan information');
        }
        return;
      }

      const data = await response.json();
      setClan(data.clan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clan information');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-8">
            Please login to view your clan information.
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
    );
  }

  if (error && !clan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">{error}</h1>
          <p className="text-muted-foreground mb-8">
            You need to register a clan first to access this page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/cwl/register">
                <Plus className="w-4 h-4 mr-2" />
                Register Clan
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cwl">
                <Users className="w-4 h-4 mr-2" />
                Browse Clans
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">My Clan</h1>
            <p className="text-muted-foreground">
              Manage your CWL clan and settings
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {clan && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clan Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Clan Overview
                </CardTitle>
                <CardDescription>
                  Your clan's current information and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{clan.name}</h2>
                      <Badge variant={clan.isActive ? 'default' : 'secondary'}>
                        {clan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Tag: {clan.tag}</span>
                      <span>•</span>
                      <span>Created: {formatDate(clan.createdAt)}</span>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/cwl/profile">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Settings
                    </Link>
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3 text-primary">League Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">League Level</span>
                          <Badge variant="outline">
                            {clan.leagueLevel ? `League ${clan.leagueLevel}` : 'Not Set'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Current Members</span>
                          <span className="font-medium">{clan._count.members}/15</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Members Needed</span>
                          <span className="font-medium">{clan.membersNeeded}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 text-primary">Payment Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Payment per Player</span>
                          <span className="font-medium">${clan.offeredPayment}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Total Budget</span>
                          <span className="font-medium">${(clan.offeredPayment * clan.membersNeeded).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-primary">Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Pending Applications</span>
                        <Badge variant="outline">{clan._count.applications}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium">{formatDate(clan.updatedAt)}</span>
                      </div>
                    </div>

                    {clan.terms && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 text-primary">Terms & Conditions</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {clan.terms}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Manage your clan and related activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button asChild className="h-20 flex-col">
                    <Link href="/cwl/profile">
                      <Settings className="w-6 h-6 mb-2" />
                      Clan Settings
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="h-20 flex-col">
                    <Link href={`/cwl/${clan.id}`}>
                      <ExternalLink className="w-6 h-6 mb-2" />
                      View Public Page
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="h-20 flex-col">
                    <Link href={`/cwl/${clan.id}/applications`}>
                      <Users className="w-6 h-6 mb-2" />
                      Manage Applications ({clan._count.applications})
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="h-20 flex-col">
                    <Link href="/cwl">
                      <Users className="w-6 h-6 mb-2" />
                      Browse Other Clans
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Clan Status */}
            <Card>
              <CardHeader>
                <CardTitle>Clan Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={clan.isActive ? 'default' : 'secondary'}>
                    {clan.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">League Level</span>
                  <span className="font-medium">
                    {clan.leagueLevel ? `League ${clan.leagueLevel}` : 'Not Set'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Members</span>
                  <span className="font-medium">{clan._count.members}/15</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Applications</span>
                  <span className="font-medium">{clan._count.applications}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Rate</span>
                  <span className="font-medium">${clan.offeredPayment}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-medium">{formatDate(clan.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Members Recruited</span>
                    <span>{clan._count.members}/{clan.membersNeeded}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(clan._count.members / clan.membersNeeded) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {clan.membersNeeded - clan._count.members} more members needed
                  </p>
                </div>

                {clan._count.applications > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pending Applications</span>
                      <Badge variant="outline">{clan._count.applications}</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                      <Link href={`/cwl/${clan.id}/applications`}>
                        Review Applications
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Owner Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{clan.owner.name || clan.owner.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{clan.owner.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}