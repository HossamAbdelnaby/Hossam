"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { 
  Crown, 
  Users, 
  Trophy, 
  Target, 
  Globe, 
  Shield, 
  Plus,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Zap
} from "lucide-react";
import Link from "next/link";

interface PricingTier {
  position: string;
  price: string;
  description: string;
}

interface Requirement {
  title: string;
  description: string;
  isRequired: boolean;
}

export default function ClanRegistrationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Basic Information
  const [formData, setFormData] = useState({
    clanName: "",
    clanTag: "",
    description: "",
    region: "",
    language: "",
    type: "",
    requiredMembers: "",
    currentMembers: "",
    trophies: "",
    warWins: "",
    warWinStreak: "",
    terms: "",
  });

  // Pricing tiers
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    { position: "", price: "", description: "" }
  ]);

  // Requirements
  const [requirements, setRequirements] = useState<Requirement[]>([
    { title: "", description: "", isRequired: true }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPricingTier = () => {
    setPricingTiers(prev => [...prev, { position: "", price: "", description: "" }]);
  };

  const updatePricingTier = (index: number, field: keyof PricingTier, value: string) => {
    setPricingTiers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removePricingTier = (index: number) => {
    if (pricingTiers.length > 1) {
      setPricingTiers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addRequirement = () => {
    setRequirements(prev => [...prev, { title: "", description: "", isRequired: true }]);
  };

  const updateRequirement = (index: number, field: keyof Requirement, value: string | boolean) => {
    setRequirements(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    // Validate required fields
    if (!formData.clanName || !formData.clanTag || !formData.region || !formData.type) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate clan tag format
    if (!formData.clanTag.startsWith('#')) {
      setError("Clan tag must start with #");
      return;
    }

    // Validate pricing tiers
    const validPricingTiers = pricingTiers.filter(tier => 
      tier.position && tier.price && tier.description
    );
    
    if (validPricingTiers.length === 0) {
      setError("Please add at least one pricing tier");
      return;
    }

    // Validate requirements
    const validRequirements = requirements.filter(req => 
      req.title && req.description
    );
    
    if (validRequirements.length === 0) {
      setError("Please add at least one requirement");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/clan/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clanName: formData.clanName,
          clanTag: formData.clanTag,
          description: formData.description,
          region: formData.region,
          language: formData.language,
          type: formData.type,
          trophies: formData.trophies,
          warWins: formData.warWins,
          warWinStreak: formData.warWinStreak,
          currentMembers: formData.currentMembers,
          terms: formData.terms,
          pricingTiers: validPricingTiers,
          requirements: validRequirements,
          userId: user.id,
          userEmail: user.email,
          userName: user.name
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to rent-clan page after successful registration
        setTimeout(() => {
          router.push('/rent-clan');
        }, 2000);
      } else {
        setError(data.error || 'Failed to register clan');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register clan');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to register your clan for hire.
          </p>
          <Button asChild>
            <Link href="/login">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Clan Registration Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your clan has been successfully registered and is now available for hire.
            You will be redirected to the clans page shortly.
          </p>
          <Button asChild>
            <Link href="/rent-clan">
              View Clans
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/rent-clan" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Clans
        </Link>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Register Your Clan</h1>
          <p className="text-muted-foreground">
            List your clan for hire and find skilled players to join your ranks
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Essential information about your clan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clanName">Clan Name *</Label>
                <Input
                  id="clanName"
                  placeholder="Enter your clan name"
                  value={formData.clanName}
                  onChange={(e) => handleInputChange('clanName', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="clanTag">Clan Tag *</Label>
                <Input
                  id="clanTag"
                  placeholder="#ABC123"
                  value={formData.clanTag}
                  onChange={(e) => handleInputChange('clanTag', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your clan, its goals, and what makes it special..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="region">Region *</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GLOBAL">Global</SelectItem>
                    <SelectItem value="EUROPE">Europe</SelectItem>
                    <SelectItem value="ASIA">Asia</SelectItem>
                    <SelectItem value="AMERICAS">Americas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="language">Primary Language</Label>
                <Input
                  id="language"
                  placeholder="English"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Clan Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INVITE_ONLY">Invite Only</SelectItem>
                    <SelectItem value="ANYONE_CAN_JOIN">Anyone Can Join</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clan Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Clan Statistics
            </CardTitle>
            <CardDescription>
              Current statistics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="trophies">Total Trophies</Label>
                <Input
                  id="trophies"
                  type="number"
                  placeholder="45000"
                  value={formData.trophies}
                  onChange={(e) => handleInputChange('trophies', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="warWins">War Wins</Label>
                <Input
                  id="warWins"
                  type="number"
                  placeholder="250"
                  value={formData.warWins}
                  onChange={(e) => handleInputChange('warWins', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="warWinStreak">Current Win Streak</Label>
                <Input
                  id="warWinStreak"
                  type="number"
                  placeholder="15"
                  value={formData.warWinStreak}
                  onChange={(e) => handleInputChange('warWinStreak', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="requiredMembers">Required Members</Label>
                <Input
                  id="requiredMembers"
                  type="number"
                  placeholder="50"
                  value={formData.requiredMembers}
                  onChange={(e) => handleInputChange('requiredMembers', e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="currentMembers">Current Members</Label>
              <Input
                id="currentMembers"
                type="number"
                placeholder="45"
                value={formData.currentMembers}
                onChange={(e) => handleInputChange('currentMembers', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing Tiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Membership Pricing
            </CardTitle>
            <CardDescription>
              Set different pricing tiers for various positions in your clan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Tier {index + 1}</h4>
                  {pricingTiers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePricingTier(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <Label>Position</Label>
                    <Input
                      placeholder="e.g., Top Player, Co-leader"
                      value={tier.position}
                      onChange={(e) => updatePricingTier(index, 'position', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Price (USD)</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={tier.price}
                      onChange={(e) => updatePricingTier(index, 'price', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Brief description"
                      value={tier.description}
                      onChange={(e) => updatePricingTier(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={addPricingTier} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Pricing Tier
            </Button>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Player Requirements
            </CardTitle>
            <CardDescription>
              Set requirements for players who want to join your clan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requirements.map((req, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Requirement {index + 1}</h4>
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="e.g., Minimum Trophies"
                      value={req.title}
                      onChange={(e) => updateRequirement(index, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 h-10">
                    <input
                      type="checkbox"
                      id={`required-${index}`}
                      checked={req.isRequired}
                      onChange={(e) => updateRequirement(index, 'isRequired', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor={`required-${index}`} className="text-sm">
                      Required
                    </Label>
                  </div>
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Input
                    placeholder="Detailed description of the requirement"
                    value={req.description}
                    onChange={(e) => updateRequirement(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={addRequirement} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Requirement
            </Button>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Terms and Conditions
            </CardTitle>
            <CardDescription>
              Set the rules and expectations for clan members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="terms">Clan Rules *</Label>
              <Textarea
                id="terms"
                placeholder="Outline your clan's rules, expectations, and conditions for membership..."
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering Clan...
              </>
            ) : (
              <>
                <Crown className="mr-2 h-4 w-4" />
                Register Clan
              </>
            )}
          </Button>
          
          <Button type="button" variant="outline" asChild>
            <Link href="/rent-clan">
              Cancel
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}