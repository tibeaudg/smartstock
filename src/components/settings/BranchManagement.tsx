import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

import { toast } from '@/hooks/use-toast';
import { Loader2, Building2, Plus, Edit, Users, Calendar, Euro } from 'lucide-react';

interface BranchFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface UserBranch {
  branch_id: string;
  branch_name: string;
  is_main: boolean;
  user_count?: number;
  created_at: string;
}

interface PricingInfo {
  totalUsers: number;
  totalBranches: number;
  extraUsers: number;
  extraBranches: number;
  userCost: number;
  branchCost: number;
  totalCost: number;
}

export const BranchManagement = () => {
  const { user } = useAuth();
  const { refreshBranches } = useBranches();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBranch, setEditingBranch] = useState<UserBranch | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchFormData>();

  // React Query: fetch user branches
  const fetchUserBranches = async () => {
    if (!user) return [];
    const { data, error } = await supabase.rpc('get_user_branches', { user_id: user.id });
    if (error) throw error;
    return data as UserBranch[];
  };

  const {
    data: userBranches = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userBranches', user?.id],
    queryFn: fetchUserBranches,
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

  // Fetch pricing information
  const fetchPricingInfo = async (): Promise<PricingInfo> => {
    if (!user) return { totalUsers: 0, totalBranches: 0, extraUsers: 0, extraBranches: 0, userCost: 0, branchCost: 0, totalCost: 0 };
    
    // Get all branches for this user
    const { data: branches, error: branchesError } = await supabase
      .from('branches')
      .select('id')
      .eq('user_id', user.id);
    
    if (branchesError) {
      console.error('Error fetching branches for pricing:', branchesError);
      return { totalUsers: 0, totalBranches: 0, extraUsers: 0, extraBranches: 0, userCost: 0, branchCost: 0, totalCost: 0 };
    }
    
    const branchIds = branches?.map(b => b.id) || [];
    
    // Get all users across all branches for this user
    const { data: branchUsers, error: usersError } = await supabase
      .from('branch_users')
      .select('user_id')
      .in('branch_id', branchIds);
    
    if (usersError) {
      console.error('Error fetching branch users for pricing:', usersError);
      return { totalUsers: 0, totalBranches: 0, extraUsers: 0, extraBranches: 0, userCost: 0, branchCost: 0, totalCost: 0 };
    }
    
    // Count unique users
    const uniqueUsers = new Set(branchUsers?.map(u => u.user_id) || []);
    const totalUsers = uniqueUsers.size;
    const totalBranches = branchIds.length;
    
    // Pricing: $2 per extra user (first user is free), $5 per extra branch (main branch is free)
    const extraUsers = Math.max(0, totalUsers - 1); // First user is free
    const extraBranches = Math.max(0, totalBranches - 1); // Main branch is free
    const userCost = extraUsers * 2;
    const branchCost = extraBranches * 5;
    const totalCost = userCost + branchCost;
    
    return {
      totalUsers,
      totalBranches,
      extraUsers,
      extraBranches,
      userCost,
      branchCost,
      totalCost
    };
  };

  const {
    data: pricingInfo,
    isLoading: pricingLoading,
  } = useQuery<PricingInfo>({
    queryKey: ['pricingInfo', user?.id],
    queryFn: fetchPricingInfo,
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

  // Delete branch
  const deleteBranch = async (branchId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this branch?');
    if (!confirmed || !user) return;

    const { error } = await supabase
      .from('branches')
      .delete()
      .eq('id', branchId)

    if (error) {
      console.error('Error deleting branch:', error);
    } else {
      toast({ title: 'Deleted', description: 'Branch successfully deleted.' });
      refetch();
      // Refresh pricing info
      queryClient.invalidateQueries({ queryKey: ['pricingInfo', user.id] });
    }
  };

  // Create / Update form submit
  const onSubmit = async (data: BranchFormData) => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (editingBranch) {
        // Update existing
        const { error } = await supabase
          .from('branches')
          .update({
            name: data.name,
            address: data.address,
            phone: data.phone,
            email: data.email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingBranch.branch_id);

        if (error) throw error;

          toast({ title: 'Updated', description: 'Branch successfully updated.' });
      } else {
        // Create new
        const { data: newBranch, error: branchError } = await supabase
          .from('branches')
          .insert({
            name: data.name,
            address: data.address,
            phone: data.phone,
            email: data.email,
            is_main: false,
            is_active: true,
          })
          .select()
          .single();

        if (branchError) throw branchError;

        const { error: userError } = await supabase
          .from('branch_users')
          .insert({
            branch_id: newBranch.id,
            user_id: user.id,
            role: 'admin',
            granted_by: user.id,
          });

        if (userError) {
          toast({
            title: 'Warning',
            description: 'Branch created, but linking to user failed.',
            variant: 'destructive',
          });
        } else {
          // Track branch creation event
          await trackCustomEvent('branch_created', {
            branch_id: newBranch.id,
            branch_name: newBranch.name,
            is_main: false,
            is_additional: true,
            source: 'branch_management',
          }, `Branch created: ${newBranch.name}`);
          
          toast({ title: 'Created', description: 'New branch successfully added.' });
        }
      }

      setIsDialogOpen(false);
      setEditingBranch(null);
      reset();
      await refreshBranches();
      // Refresh pricing info
      queryClient.invalidateQueries({ queryKey: ['pricingInfo', user.id] });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditBranch = async (branch: UserBranch) => {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('id', branch.branch_id)
      .single();

    if (error) {
      console.error('Error fetching branch:', error);
      toast({ title: 'Error', description: 'Could not fetch data.', variant: 'destructive' });
      return;
    }

    setEditingBranch(branch);
    reset({
      name: data.name,
      address: data.address || '',
      phone: data.phone || '',
      email: data.email || '',
    });
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingBranch(null);
    reset({ name: '', address: '', phone: '', email: '' });
    setIsDialogOpen(true);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">An error occurred</h3>
        <p className="text-gray-600 mb-4">Could not load branches. Please try again later.</p>
        <Button onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header Section with Title and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Branches</h1>
        </div>
        
        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateNew} className="h-9 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Branch
              </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBranch ? 'Edit Branch' : 'New Branch'}</DialogTitle>
              <DialogDescription>
                {editingBranch
                  ? 'Adjust the data of this branch.'
                  : 'Enter the data of the new branch.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {['name'].map((field) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>
                    {field === 'name' ? 'Branch Name *' : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={
                      field === 'name'
                        ? ''

                        : field === 'phone'
                        ? '+31 6 12345678'
                        : 'branch@company.nl'
                    }
                    {...register(field as keyof BranchFormData, {
                      required: field === 'name' ? 'Name is required' : false,
                    })}
                  />
                  {errors[field as keyof BranchFormData] && (
                    <p className="text-sm text-red-600">
                      {errors[field as keyof BranchFormData]?.message}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingBranch ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Branches List */}
      <div className="space-y-2">
        {userBranches.map((branch) => (
          <Card key={branch.branch_id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4" />
                    <h3 className="text-lg font-semibold text-gray-900">{branch.branch_name}</h3>
                    {branch.is_main && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        Main Branch
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{branch.user_count} users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(branch.created_at).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEditBranch(branch)} size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteBranch(branch.branch_id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={branch.is_main}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(isLoading || isFetching) && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading branches...</p>
          </div>
        </div>
      )}

      {userBranches.length === 0 && !isLoading && !isFetching && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No branches found</h3>
            <p className="text-gray-600 mb-4">Begin with creating your first branch.</p>
            <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create First Branch
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
