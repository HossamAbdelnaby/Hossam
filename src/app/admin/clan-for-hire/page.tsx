"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { 
  Crown, 
  Search, 
  RefreshCw, 
  Eye,
  Trophy,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  Phone,
  Star,
  Filter,
  Download,
  Activity,
  BarChart3,
  UserPlus,
  Target,
  Zap,
  Trash2,
  AlertTriangle,
  Globe,
  Shield,
  MapPin
} from "lucide-react";

interface ClanForHire {
  id: string;
  name: string;
  tag: string;
  description: string;
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
  contracts: Array<{
    id: string;
    status: string;
    createdAt: string;
    user: {
      id: string;
      username: string;
      name?: string;
    };
  }>;
}

interface ClansResponse {
  clans: ClanForHire[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalClans: number;
    activeClans: number;
    totalMembers: number;
    averageTopPlayerPrice: number;
    totalContracts: number;
  };
}

export default function AdminClanForHirePage() {
  const [clans, setClans] = useState<ClanForHire[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClans, setTotalClans] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    region: 'all',
    type: 'all',
    minTrophies: '',
    maxPrice: '',
    isActive: 'all',
    limit: 20
  });

  useEffect(() => {
    fetchClans();
  }, [currentPage, filters]);

  const fetchClans = async () => {
    try {
      setLoading(true);
      setError("");
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: filters.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.region && filters.region !== 'all' && { region: filters.region }),
        ...(filters.type && filters.type !== 'all' && { type: filters.type }),
        ...(filters.minTrophies && { minTrophies: filters.minTrophies }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.isActive && filters.isActive !== 'all' && { isActive: filters.isActive })
      });

      const response = await fetch(`/api/admin/clan-for-hire?${params}`);
      
      if (response.ok) {
        const data: ClansResponse = await response.json();
        setClans(data.clans);
        setTotalPages(data.totalPages);
        setTotalClans(data.total);
        setStats(data.stats);
      } else {
        setError("Failed to fetch clans");
      }
    } catch (error) {
      console.error('Error fetching clans:', error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClan = async (clanId: string) => {
    if (deleteConfirm !== clanId) {
      setDeleteConfirm(clanId);
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/clan-for-hire/${clanId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClans(prev => prev.filter(c => c.id !== clanId));
        setDeleteConfirm(null);
        // Refresh data to update stats
        await fetchClans();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete clan');
      }
    } catch (error) {
      console.error('Error deleting clan:', error);
      setError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      region: 'all',
      type: 'all',
      minTrophies: '',
      maxPrice: '',
      isActive: 'all',
      limit: 20
    });
    setCurrentPage(1);
  };

  const updateClanStatus = async (clanId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/clan-for-hire/${clanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });

      if (response.ok) {
        fetchClans();
      }
    } catch (error) {
      console.error('Error updating clan status:', error);
    }
  };

  const getRegionBadge = (region: string) => {
    const regionColors: Record<string, string> = {
      'GLOBAL': 'bg-blue-100 text-blue-800',
      'NORTH_AMERICA': 'bg-green-100 text-green-800',
      'EUROPE': 'bg-purple-100 text-purple-800',
      'ASIA': 'bg-red-100 text-red-800',
      'SOUTH_AMERICA': 'bg-yellow-100 text-yellow-800',
      'AFRICA': 'bg-orange-100 text-orange-800',
      'OCEANIA': 'bg-pink-100 text-pink-800'
    };
    
    return (
      <Badge className={regionColors[region] || 'bg-gray-100 text-gray-800'}>
        {region.replace('_', ' ')}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      'OPEN': 'bg-green-100 text-green-800',
      'INVITE_ONLY': 'bg-yellow-100 text-yellow-800',
      'CLOSED': 'bg-red-100 text-red-800',
      'ANYONE_CAN_JOIN': 'bg-blue-100 text-blue-800'
    };
    
    const typeNames: Record<string, string> = {
      'OPEN': 'Open',
      'INVITE_ONLY': 'Invite Only',
      'CLOSED': 'Closed',
      'ANYONE_CAN_JOIN': 'Anyone Can Join'
    };
    
    return (
      <Badge className={typeColors[type] || 'bg-gray-100 text-gray-800'}>
        {typeNames[type] || type}
      </Badge>
    );
  };

  const getContractStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'ACCEPTED':
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && 
      value !== 20 && 
      value !== 'all'
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clan for Hire Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all rental clans on the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchClans} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clans</p>
                  <p className="text-2xl font-bold">{stats.totalClans}</p>
                </div>
                <Crown className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Clans</p>
                  <p className="text-2xl font-bold">{stats.activeClans}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{stats.totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Top Player Price</p>
                  <p className="text-2xl font-bold">${stats.averageTopPlayerPrice}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contracts</p>
                  <p className="text-2xl font-bold">{stats.totalContracts}</p>
                </div>
                <UserPlus className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()} active</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search clans..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All regions</SelectItem>
                  <SelectItem value="GLOBAL">Global</SelectItem>
                  <SelectItem value="NORTH_AMERICA">North America</SelectItem>
                  <SelectItem value="EUROPE">Europe</SelectItem>
                  <SelectItem value="ASIA">Asia</SelectItem>
                  <SelectItem value="SOUTH_AMERICA">South America</SelectItem>
                  <SelectItem value="AFRICA">Africa</SelectItem>
                  <SelectItem value="OCEANIA">Oceania</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="INVITE_ONLY">Invite Only</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="ANYONE_CAN_JOIN">Anyone Can Join</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Min Trophies</label>
              <Input
                type="number"
                placeholder="10000"
                value={filters.minTrophies}
                onChange={(e) => handleFilterChange('minTrophies', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Max Price ($)</label>
              <Input
                type="number"
                placeholder="200"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={filters.isActive} onValueChange={(value) => handleFilterChange('isActive', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clan Directory</CardTitle>
          <CardDescription>
            Showing {clans.length} of {totalClans} clans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2">Loading clans...</span>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clan</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead>Contracts</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clans.map((clan) => (
                      <TableRow key={clan.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                              <Crown className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                              <div className="font-medium">{clan.name}</div>
                              <div className="text-sm text-muted-foreground">{clan.tag}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-xs">
                                {clan.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{clan.user.name || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">{clan.user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{clan.trophies.toLocaleString()} trophies</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">{clan.memberCount} members</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-green-500" />
                              <span className="text-sm">{clan.warWins} war wins</span>
                            </div>
                            {getTypeBadge(clan.type)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRegionBadge(clan.region)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>Top: ${clan.topPlayerPrice}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-blue-500" />
                              <span>Co: ${clan.coLeaderPrice}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-green-500" />
                              <span>Member: ${clan.memberPrice}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {clan.contracts?.length || 0} total
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {clan.contracts?.filter((c: any) => c.status === 'PENDING').length || 0} pending
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(clan.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Switch
                              checked={clan.isActive}
                              onCheckedChange={(checked) => updateClanStatus(clan.id, checked)}
                            />
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/clan/${clan.id}`}>
                                <Eye className="w-4 h-4" />
                              </a>
                            </Button>
                            {deleteConfirm === clan.id ? (
                              <>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteClan(clan.id)}
                                  disabled={deleting}
                                >
                                  {deleting ? 'Deleting...' : 'Confirm'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setDeleteConfirm(null)}
                                  disabled={deleting}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteClan(clan.id)}
                                disabled={deleting || deleteConfirm !== null}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Switch component for toggling active status
function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-green-600' : 'bg-gray-200'
      }`}
      onClick={() => onCheckedChange(!checked)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}