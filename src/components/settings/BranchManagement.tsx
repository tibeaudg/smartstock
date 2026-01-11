import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { toast } from '@/hooks/use-toast';
import { Loader2, Building2, Plus, Edit, Users, Calendar, Trash2 } from 'lucide-react';

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

  // Fetch user branches
  const fetchUserBranches = async (): Promise<UserBranch[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase.rpc('get_user_branches', { 
      user_id: user.id 
    });
    
    if (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
    
    return (data as UserBranch[]) || [];
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
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Delete branch
  const deleteBranch = async (branchId: string, isMain: boolean) => {
    if (isMain) {
      toast({
        title: 'Cannot Delete',
        description: 'The main branch cannot be deleted.',
        variant: 'destructive',
      });
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this branch? This action cannot be undone.'
    );
    
    if (!confirmed || !user) return;

    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', branchId)
        .eq('user_id', user.id); // Security: ensure user owns the branch

      if (error) throw error;

      toast({ 
        title: 'Success', 
        description: 'Branch successfully deleted.' 
      });
      
      // Refresh data
      refetch();
      await refreshBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete branch. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Create or update branch
  const onSubmit = async (data: BranchFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to perform this action.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      if (editingBranch) {
        // Update existing branch
        const { error } = await supabase
          .from('branches')
          .update({
            name: data.name,
            address: data.address || null,
            phone: data.phone || null,
            email: data.email || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingBranch.branch_id)
          .eq('user_id', user.id); // Security: ensure user owns the branch

        if (error) throw error;

        toast({ 
          title: 'Success', 
          description: 'Branch successfully updated.' 
        });
      } else {
        // Create new branch
        const { data: newBranch, error: branchError } = await supabase
          .from('branches')
          .insert({
            name: data.name,
            address: data.address || null,
            phone: data.phone || null,
            email: data.email || null,
            user_id: user.id,
            is_main: false,
            is_active: true,
          })
          .select()
          .single();

        if (branchError) throw branchError;

        // Link user to the new branch
        const { error: userError } = await supabase
          .from('branch_users')
          .insert({
            branch_id: newBranch.id,
            user_id: user.id,
            role: 'admin',
            granted_by: user.id,
          });

        if (userError) {
          console.error('Error linking user to branch:', userError);
          toast({
            title: 'Warning',
            description: 'Branch created, but linking to user failed.',
            variant: 'destructive',
          });
        } else {
          toast({ 
            title: 'Success', 
            description: 'Branch successfully created.' 
          });
        }
      }

      // Close dialog and reset form
      setIsDialogOpen(false);
      setEditingBranch(null);
      reset();
      
      // Refresh data
      refetch();
      await refreshBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the branch.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Open edit dialog with branch data
  const handleEditBranch = async (branch: UserBranch) => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', branch.branch_id)
        .eq('user_id', user?.id) // Security: ensure user owns the branch
        .single();

      if (error) throw error;

      setEditingBranch(branch);
      reset({
        name: data.name,
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching branch:', error);
      toast({ 
        title: 'Error', 
        description: 'Could not fetch branch data.', 
        variant: 'destructive' 
      });
    }
  };

  // Open create dialog
  const handleCreateNew = () => {
    setEditingBranch(null);
    reset({ name: '', address: '', phone: '', email: '' });
    setIsDialogOpen(true);
  };

  // Close dialog handler
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBranch(null);
    reset();
  };

  // Error state
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Branches</h1>
          <p className="text-gray-600 mt-1">Create and manage your branch locations</p>
        </div>
        
        {/* Create Branch Button */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={handleCreateNew} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Branch
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? 'Edit Branch' : 'Create New Branch'}
              </DialogTitle>
              <DialogDescription>
                {editingBranch
                  ? 'Update the branch information below.'
                  : 'Enter the details for your new branch.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Branch Name - Required */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Branch Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Downtown Office"
                  {...register('name', {
                    required: 'Branch name is required',
                    minLength: {
                      value: 2,
                      message: 'Branch name must be at least 2 characters',
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Address - Optional */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="e.g., 123 Main Street, Amsterdam"
                  {...register('address')}
                />
              </div>

              {/* Phone - Optional */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +31 6 12345678"
                  {...register('phone')}
                />
              </div>

              {/* Email - Optional */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., branch@company.nl"
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseDialog}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingBranch ? 'Update Branch' : 'Create Branch'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Branches List */}
      {userBranches.length > 0 && (
        <div className="space-y-3">
          {userBranches.map((branch) => (
            <Card key={branch.branch_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {branch.branch_name}
                      </h3>
                      {branch.is_main && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Main Branch
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {branch.user_count || 0} {branch.user_count === 1 ? 'user' : 'users'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Created {new Date(branch.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleEditBranch(branch)}
                      size="sm"
                      variant="outline"
                      title="Edit branch"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteBranch(branch.branch_id, branch.is_main)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={branch.is_main}
                      title={branch.is_main ? 'Cannot delete main branch' : 'Delete branch'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Loading State */}
      {(isLoading || isFetching) && userBranches.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading branches...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {userBranches.length === 0 && !isLoading && !isFetching && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No branches yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first branch location.
            </p>
            <Button 
              onClick={handleCreateNew} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Branch
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};