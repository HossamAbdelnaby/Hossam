"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { 
  Search, 
  Filter, 
  Users, 
  Trophy, 
  DollarSign, 
  Calendar,
  MessageCircle,
  Clock,
  Star,
  Shield,
  CheckCircle,
  Loader2,
  Send,
  Plus,
  Crown,
  Sword,
  MapPin,
  Globe,
  User
} from "lucide-react";

interface Clan {
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
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function RentClanPage() {
  const [clans, setClans] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("trophies");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Contract dialog state
  const [selectedClan, setSelectedClan] = useState<Clan | null>(null);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [contractForm, setContractForm] = useState({
    message: "",
    playerTag: "",
    requestedPosition: "",
  });
  const [submittingContract, setSubmittingContract] = useState(false);
  const [contractSuccess, setContractSuccess] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchClans();
  }, [currentPage, regionFilter, typeFilter, sortBy]);

  const fetchClans = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sortBy,
      });

      if (regionFilter !== "all") {
        params.append("region", regionFilter);
      }

      if (typeFilter !== "all") {
        params.append("type", typeFilter);
      }

      const response = await fetch(`/api/clan?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch clans');
      }

      const data = await response.json();
      setClans(data.clans);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clans');
    } finally {
      setLoading(false);
    }
  };

  const filteredClans = clans.filter(clan =>
    clan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clan.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHireClan = (clan: Clan) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedClan(clan);
    setContractDialogOpen(true);
  };

  const handleContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClan || !user) return;

    setSubmittingContract(true);
    setError("");

    try {
      const response = await fetch('/api/clan/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clanId: selectedClan.id,
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
      setContractDialogOpen(false);
      setContractForm({ message: "", playerTag: "", requestedPosition: "" });
      setSelectedClan(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send contract request');
    } finally {
      setSubmittingContract(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INVITE_ONLY': return 'secondary';
      case 'ANYONE_CAN_JOIN': return 'default';
      case 'CLOSED': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Find Elite Clans</h1>
          <p className="text-muted-foreground">
            Hire professional Clash of Clans clans for your gaming needs
          </p>
        </div>
        
        {user && (
          <Button asChild className="gap-2">
            <Link href="/clan-registration">
              <Plus className="w-4 h-4" />
              Register Your Clan
            </Link>
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search clans by name, tag, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="GLOBAL">Global</SelectItem>
                  <SelectItem value="NORTH_AMERICA">North America</SelectItem>
                  <SelectItem value="EUROPE">Europe</SelectItem>
                  <SelectItem value="ASIA">Asia</SelectItem>
                  <SelectItem value="SOUTH_AMERICA">South America</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Users className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Clan Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="INVITE_ONLY">Invite Only</SelectItem>
                  <SelectItem value="ANYONE_CAN_JOIN">Anyone Can Join</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <Star className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trophies">Trophies</SelectItem>
                  <SelectItem value="warWins">War Wins</SelectItem>
                  <SelectItem value="members">Member Count</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
            Contract request sent successfully! The clan will review your request.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Clans Grid */}
          {filteredClans.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClans.map((clan) => (
                <Card key={clan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      {/* Clan Logo */}
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Crown className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-1">
                          {clan.name}
                        </CardTitle>
                        <CardDescription className="text-sm font-mono">
                          {clan.tag}
                        </CardDescription>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant={getTypeColor(clan.type)} className="text-xs">
                            {clan.type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {clan.region}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-muted rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                          <Trophy className="w-3 h-3" />
                          {clan.trophies.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Trophies</div>
                      </div>
                      
                      <div className="text-center p-2 bg-muted rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                          <Sword className="w-3 h-3" />
                          {clan.warWins}
                        </div>
                        <div className="text-xs text-muted-foreground">War Wins</div>
                      </div>
                      
                      <div className="text-center p-2 bg-muted rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                          <Users className="w-3 h-3" />
                          {clan.memberCount}/50
                        </div>
                        <div className="text-xs text-muted-foreground">Members</div>
                      </div>
                      
                      <div className="text-center p-2 bg-muted rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                          <Shield className="w-3 h-3" />
                          {clan.warWinStreak}
                        </div>
                        <div className="text-xs text-muted-foreground">Win Streak</div>
                      </div>
                    </div>
                    
                    {/* Region and Language */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{clan.region}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>{clan.language}</span>
                      </div>
                    </div>
                    
                    {/* Pricing */}
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-2">Pricing:</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Top Player:</span>
                          <span className="font-medium">${clan.topPlayerPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Co-Leader:</span>
                          <span className="font-medium">${clan.coLeaderPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Member:</span>
                          <span className="font-medium">${clan.memberPrice}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    {clan.description && (
                      <div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {clan.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => handleHireClan(clan)} 
                        className="flex-1"
                        disabled={!clan.isActive}
                      >
                        Hire Clan
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/clan/${clan.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // No clans found
            <div className="text-center py-12">
              <Crown className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No clans found
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to register your clan for hire!
              </p>
              {user ? (
                <Button asChild>
                  <Link href="/clan-registration">
                    <Plus className="w-4 h-4 mr-2" />
                    Register Your Clan
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/register">
                    <User className="w-4 h-4 mr-2" />
                    Sign Up to Register
                  </Link>
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Contract Dialog */}
      <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hire {selectedClan?.name}</DialogTitle>
            <DialogDescription>
              Send a hiring request to this clan. They will review your application and get back to you.
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
                placeholder="Tell the clan why you want to join and what you can offer..."
                value={contractForm.message}
                onChange={(e) => setContractForm(prev => ({ ...prev, message: e.target.value }))}
                className="min-h-20"
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={submittingContract} className="flex-1">
                {submittingContract ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setContractDialogOpen(false)}
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