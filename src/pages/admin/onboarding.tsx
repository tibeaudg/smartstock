import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, Building2, Package, ShoppingBag, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import * as XLSX from 'xlsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

interface OnboardingUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  onboarding: string | null;
  industry_type: string | null;
  custom_industry: string | null;
  categories: string[];
  products_count: number;
  branches_count: number;
  onboarding_completed_at: string | null;
}

const industryDisplayNames: Record<string, string> = {
  retail: 'Retail Store',
  restaurant: 'Restaurant',
  warehouse: 'Warehouse',
  pharmacy: 'Pharmacy',
  electronics: 'Electronics',
  clothing: 'Clothing',
  grocery: 'Grocery Store',
  hardware: 'Hardware Store',
  automotive: 'Automotive',
  other: 'Other'
};

async function fetchOnboardingUsers(): Promise<OnboardingUser[]> {
  // Fetch users who have completed onboarding
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, created_at, onboarding')
    .eq('onboarding', 'done');

  if (profilesError) throw profilesError;
  if (!profiles || profiles.length === 0) return [];

  // Fetch company types for these users
  const userIds = profiles.map(p => p.id);
  const { data: companyTypes, error: companyTypesError } = await supabase
    .from('company_types')
    .select('user_id, type, custom_type, created_at')
    .in('user_id', userIds);

  if (companyTypesError) throw companyTypesError;

  // Create a map of user_id to company type
  const companyTypeMap = new Map(
    (companyTypes || []).map(ct => [ct.user_id, { type: ct.type, custom_type: ct.custom_type, created_at: ct.created_at }])
  );

  // Fetch categories with names for each user
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('user_id, name')
    .in('user_id', userIds);

  if (categoriesError) throw categoriesError;

  const categoriesMap = new Map<string, string[]>();
  (categories || []).forEach(cat => {
    const existing = categoriesMap.get(cat.user_id) || [];
    existing.push(cat.name);
    categoriesMap.set(cat.user_id, existing);
  });

  // Fetch products count for each user
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('user_id')
    .in('user_id', userIds);

  if (productsError) throw productsError;

  const productsCountMap = new Map<string, number>();
  (products || []).forEach(prod => {
    productsCountMap.set(prod.user_id, (productsCountMap.get(prod.user_id) || 0) + 1);
  });

  // Fetch branches count for each user
  const { data: branches, error: branchesError } = await supabase
    .from('branches')
    .select('user_id')
    .in('user_id', userIds);

  if (branchesError) throw branchesError;

  const branchesCountMap = new Map<string, number>();
  (branches || []).forEach(branch => {
    branchesCountMap.set(branch.user_id, (branchesCountMap.get(branch.user_id) || 0) + 1);
  });

  // Combine all data
  return profiles.map(profile => {
    const companyType = companyTypeMap.get(profile.id);
    return {
      id: profile.id,
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      created_at: profile.created_at,
      onboarding: profile.onboarding,
      industry_type: companyType?.type || null,
      custom_industry: companyType?.custom_type || null,
      categories: categoriesMap.get(profile.id) || [],
      products_count: productsCountMap.get(profile.id) || 0,
      branches_count: branchesCountMap.get(profile.id) || 0,
      onboarding_completed_at: companyType?.created_at || profile.created_at
    };
  });
}

interface AdminOnboardingPageProps {
  embedded?: boolean;
}

export default function AdminOnboardingPage({ embedded = false }: AdminOnboardingPageProps = {}) {
  const { userProfile } = useAuth();
  const [sortBy, setSortBy] = useState<'email' | 'created_at' | 'industry'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['onboarding-users'],
    queryFn: fetchOnboardingUsers,
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000 // Consider data stale after 5 seconds
  });

  // Check if user is admin/owner
  if (!userProfile?.is_owner) {
    const content = (
      <div className={embedded ? "p-6" : "container mx-auto p-6"}>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
    
    if (embedded) {
      return content;
    }
    
    return (
      <Layout children={''} currentTab={''} onTabChange={function (tab: string): void {
        throw new Error('Function not implemented.');
      } } userRole={'admin'}>
        {content}
      </Layout>
    );
  }




  const resetOnboardingMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user found');
      
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding: null } as any)
        .eq('id', user.id);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Onboarding status reset. Redirecting to onboarding page...');
      // Invalidate queries to refresh user profile and onboarding data
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-users'] });
      // Redirect to onboarding after a short delay
      setTimeout(() => {
        navigate('/onboarding');
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset onboarding status');
    }
  });


  const handleExport = () => {
    if (!users || users.length === 0) {
      toast.error('No data to export');
      return;
    }

    const exportData = users.map(user => ({
      'Email': user.email,
      'Name': `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A',
      'Industry': user.industry_type ? (industryDisplayNames[user.industry_type] || user.industry_type) : 'N/A',
      'Custom Industry': user.custom_industry || 'N/A',
      'Categories Created': user.categories.join(', '),
      'Products Created': user.products_count,
      'Branches Created': user.branches_count,
      'Account Created': new Date(user.created_at).toLocaleDateString(),
      'Onboarding Completed': user.onboarding_completed_at ? new Date(user.onboarding_completed_at).toLocaleDateString() : 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Onboarding Users');
    XLSX.writeFile(wb, `onboarding-users-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data exported successfully');
  };

  const sortedUsers = React.useMemo(() => {
    if (!users) return [];
    
    return [...users].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'industry':
          aValue = (a.industry_type || '').toLowerCase();
          bValue = (b.industry_type || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, sortBy, sortDirection]);

  const handleSort = (column: 'email' | 'created_at' | 'industry') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const content = (
    <>
      {!embedded && (
        <SEO
          title="Onboarding Analytics | Admin"
          description="View onboarding completion data and user inputs"
        />
      )}
      <div className={embedded ? "p-6" : "container mx-auto p-6"}>
                    {/* Onboarding Test Button - Always visible for admins */}
            {userProfile?.is_owner && (
              <Card className="mb-4 border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-semibold text-orange-900 mb-1">Test Onboarding Flow</h3>
                      <p className="text-sm text-orange-700">
                        Reset your onboarding status to test and review the onboarding experience
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                          disabled={resetOnboardingMutation.isPending}
                        >
                          {resetOnboardingMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Resetting...
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reset Onboarding
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset Onboarding Status?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reset your onboarding status to allow you to go through the onboarding flow again.
                            This is useful for testing and reviewing the onboarding experience.
                            <br /><br />
                            You will be redirected to the onboarding page after resetting.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => resetOnboardingMutation.mutate()}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Reset & Go to Onboarding
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Onboarding Analytics</CardTitle>
                <CardDescription>
                  View all users who have completed onboarding and their selected inputs
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    refetch();
                    toast.success('Refreshing data...');
                  }}
                >
                  Refresh
                </Button>
                <Button onClick={handleExport} disabled={!users || users.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export to Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading onboarding data...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading data: {error.message}</p>
                <Button onClick={() => refetch()} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : !users || users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No users have completed onboarding yet.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Total users completed: <strong>{users.length}</strong>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('email')}
                        >
                          Email {sortBy === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('industry')}
                        >
                          Industry {sortBy === 'industry' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Branches</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('created_at')}
                        >
                          Completed {sortBy === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>
                            {user.first_name || user.last_name
                              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {user.industry_type && (
                                <Badge variant="outline">
                                  {industryDisplayNames[user.industry_type] || user.industry_type}
                                </Badge>
                              )}
                              {user.custom_industry && (
                                <span className="text-xs text-gray-500 italic">
                                  {user.custom_industry}
                                </span>
                              )}
                              {!user.industry_type && (
                                <span className="text-gray-400">Not specified</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.categories.length > 0 ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                                      <Package className="w-4 h-4 text-gray-400" />
                                      <span className="text-blue-600 hover:underline">Categories</span>
                                    </div>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-sm mb-2">Categories ({user.categories.length})</h4>
                                    <div className="space-y-1 max-h-64 overflow-y-auto">
                                      {user.categories.map((category, idx) => (
                                        <div key={idx} className="text-sm py-1 px-2 bg-gray-50 rounded">
                                          {category}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <span className="text-gray-400">No categories</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4 text-gray-400" />
                              <span>{user.products_count}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span>{user.branches_count}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.onboarding_completed_at
                              ? new Date(user.onboarding_completed_at).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <Layout children={''} currentTab={''} onTabChange={function (tab: string): void {
      throw new Error('Function not implemented.');
    } } userRole={'admin'}>
      {content}
    </Layout>
  );
}

