'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  RefreshCw, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Building2, 
  Users, 
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { useOnboardingSync } from '@/hooks/useOnboardingSync';

interface OnboardingResponse {
  id: string;
  user_id: string;
  profile_id: string;
  sector: string;
  business_size: string;
  important_features: string[];
  specific_needs: string | null;
  expectations: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
  // Joined data
  user_email?: string;
  user_name?: string;
}

interface OnboardingStats {
  totalResponses: number;
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
  sectorBreakdown: Record<string, number>;
  businessSizeBreakdown: Record<string, number>;
  topFeatures: Record<string, number>;
}

// Fetch onboarding responses
async function fetchOnboardingResponses(): Promise<OnboardingResponse[]> {
  const { data, error } = await supabase
    .from('onboarding_responses')
    .select(`
      *,
      profiles!onboarding_responses_profile_id_fkey (
        email,
        first_name,
        last_name
      )
    `)
    .order('completed_at', { ascending: false });

  if (error) throw error;

  return data?.map(item => ({
    ...item,
    user_email: item.profiles?.email,
    user_name: `${item.profiles?.first_name || ''} ${item.profiles?.last_name || ''}`.trim()
  })) || [];
}

// Fetch onboarding statistics
async function fetchOnboardingStats(): Promise<OnboardingStats> {
  const { data: responses, error } = await supabase
    .from('onboarding_responses')
    .select('*');

  if (error) throw error;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  const completedToday = responses.filter(r => new Date(r.completed_at) >= today).length;
  const completedThisWeek = responses.filter(r => new Date(r.completed_at) >= weekAgo).length;
  const completedThisMonth = responses.filter(r => new Date(r.completed_at) >= monthAgo).length;

  // Sector breakdown
  const sectorBreakdown = responses.reduce((acc, r) => {
    acc[r.sector] = (acc[r.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Business size breakdown
  const businessSizeBreakdown = responses.reduce((acc, r) => {
    acc[r.business_size] = (acc[r.business_size] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top features
  const topFeatures = responses.reduce((acc, r) => {
    r.important_features.forEach(feature => {
      acc[feature] = (acc[feature] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    totalResponses: responses.length,
    completedToday,
    completedThisWeek,
    completedThisMonth,
    sectorBreakdown,
    businessSizeBreakdown,
    topFeatures
  };
}

export const OnboardingTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [businessSizeFilter, setBusinessSizeFilter] = useState('all');
  const [selectedResponse, setSelectedResponse] = useState<OnboardingResponse | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const queryClient = useQueryClient();
  const { syncOnboardingData } = useOnboardingSync();

  // Fetch onboarding responses
  const { data: responses = [], isLoading: loadingResponses, refetch: refetchResponses } = useQuery({
    queryKey: ['onboardingResponses'],
    queryFn: fetchOnboardingResponses,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch onboarding statistics
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['onboardingStats'],
    queryFn: fetchOnboardingStats,
    refetchInterval: 60000, // Refresh every minute
  });

  // Filter responses based on search and filters
  const filteredResponses = responses.filter(response => {
    const matchesSearch = !searchTerm || 
      response.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.sector.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === 'all' || response.sector === sectorFilter;
    const matchesBusinessSize = businessSizeFilter === 'all' || response.business_size === businessSizeFilter;

    return matchesSearch && matchesSector && matchesBusinessSize;
  });

  // Get unique sectors and business sizes for filters
  const uniqueSectors = [...new Set(responses.map(r => r.sector))];
  const uniqueBusinessSizes = [...new Set(responses.map(r => r.business_size))];

  const handleRefresh = async () => {
    try {
      await syncOnboardingData();
      await refetchResponses();
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Error updating data');
    }
  };

  const handleViewDetails = (response: OnboardingResponse) => {
    setSelectedResponse(response);
    setShowDetails(true);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Naam', 'Sector', 'Bedrijfsgrootte', 'Belangrijke Features', 'Specifieke Behoeften', 'Verwachtingen', 'Voltooid Op'],
      ...filteredResponses.map(response => [
        response.user_email || '',
        response.user_name || '',
        response.sector,
        response.business_size,
        response.important_features.join(', '),
        response.specific_needs || '',
        response.expectations || '',
        new Date(response.completed_at).toLocaleDateString('nl-NL')
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboarding-responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV file downloaded');
  };

  if (loadingResponses || loadingStats) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Onboarding</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalResponses || 0}</div>
            <p className="text-xs text-muted-foreground">All completed onboarding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedToday || 0}</div>
            <p className="text-xs text-muted-foreground">Completed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedThisWeek || 0}</div>
            <p className="text-xs text-muted-foreground">Completed this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">Completed this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, name or sector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sectors</SelectItem>
                {uniqueSectors.map(sector => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={businessSizeFilter} onValueChange={setBusinessSizeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by business size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sizes</SelectItem>
                {uniqueBusinessSizes.map(size => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Results Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Business Size</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{response.user_name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{response.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{response.sector}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{response.business_size}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {response.important_features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {response.important_features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{response.important_features.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(response.completed_at).toLocaleDateString('nl-NL')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(response)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredResponses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No onboarding responses found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Onboarding Details</DialogTitle>
          </DialogHeader>
          
          {selectedResponse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User</label>
                  <p className="text-sm">{selectedResponse.user_name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{selectedResponse.user_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Completed</label>
                  <p className="text-sm">{new Date(selectedResponse.completed_at).toLocaleString('en-US')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sector</label>
                  <Badge variant="secondary">{selectedResponse.sector}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Size</label>
                  <Badge variant="outline">{selectedResponse.business_size}</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Important Features</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedResponse.important_features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedResponse.specific_needs && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specific Needs</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedResponse.specific_needs}
                  </p>
                </div>
              )}

              {selectedResponse.expectations && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expectations</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedResponse.expectations}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
