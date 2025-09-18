import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Euro, Users, Building2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// TYPE-SAFETY: Interfaces voor duidelijkere datastructuren
interface Profile {
  email: string;
}

interface BranchUser {
  id: string;
  user_id: string;
  role: string;
  // De 'profiles' property kan een object zijn of een array van objecten, afhankelijk van de relatie.
  // Hier maken we het expliciet een enkel object, of null.
  profiles: Profile | null;
}

interface DisplayUser {
  id: string;
  userId: string;
  email: string;
  role: string;
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

export const UserManagement = () => {
  const { user } = useAuth();
  const { branches, activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('staff');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [manageBranchesUser, setManageBranchesUser] = useState<DisplayUser | null>(null);
  const [userBranches, setUserBranches] = useState<string[]>([]);
  const [savingBranches, setSavingBranches] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (activeBranch?.branch_id && !selectedBranchId) {
      setSelectedBranchId(activeBranch.branch_id);
    }
  }, [activeBranch, selectedBranchId]);

  // React Query: fetch users for branch
  const fetchBranchUsers = async () => {
    if (!selectedBranchId) return [];
    const { data, error } = await supabase
      .from('branch_users')
      .select('id, user_id, role, profiles:profiles!branch_users_user_id_fkey(email)')
      .eq('branch_id', selectedBranchId);
    if (error) throw new Error(error.message);
    return (data || []).map((u: any) => ({
      id: u.id,
      userId: u.user_id,
      email: u.profiles?.email || '',
      role: u.role,
    }));
  };

  const {
    data: users = [],
    isLoading: loading,
    isFetching,
    error,
    refetch,
  } = useQuery<DisplayUser[]>({
    queryKey: ['branchUsers', selectedBranchId],
    queryFn: fetchBranchUsers,
    enabled: !!selectedBranchId,
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
    
    // Pricing: €2 per extra user (first user is free), €5 per extra branch (main branch is free)
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

  // Real-time updates voor gebruikers
  useEffect(() => {
    if (!user?.id || !selectedBranchId) return;

    const usersChannel = supabase
      .channel('branch-users-changes-' + selectedBranchId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'branch_users',
          filter: `branch_id=eq.${selectedBranchId}`,
        },
        () => {
          console.log('Branch user change detected, refresh users...');
          queryClient.invalidateQueries({ queryKey: ['branchUsers', selectedBranchId] });
          queryClient.invalidateQueries({ queryKey: ['pricingInfo', user.id] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          console.log('Profile change detected, refresh users...');
          queryClient.invalidateQueries({ queryKey: ['branchUsers', selectedBranchId] });
          queryClient.invalidateQueries({ queryKey: ['pricingInfo', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
    };
  }, [user?.id, selectedBranchId, queryClient]);

  const handleInviteUser = async () => {
    if (!inviteEmail || !selectedBranchId || !user) return;
    
    setInviting(true);

    const { error } = await supabase.functions.invoke('invite-user', {
      body: {
        email: inviteEmail,
        role: inviteRole,
        branch_id: selectedBranchId
      },
    });

    setInviting(false);

    if (error) {
      console.error("Error inviting user:", error);
      toast({ title: "Error", description: error.message || "Could not invite user", variant: "destructive" });
      return;
    }

    toast({ title: "Invitation sent", description: `${inviteEmail} is invited.` });
    setInviteEmail('');
    setInviteRole("staff");
    refetch();
    queryClient.invalidateQueries({ queryKey: ['pricingInfo', user.id] });
  };

  const handleRemoveUser = async (userIdToRemove: string) => {
    if (userIdToRemove === user?.id) {
      toast({ title: "Action not allowed", description: "You cannot delete yourself.", variant: "destructive" });
      return;
    }
    
    const { error } = await supabase
      .from('branch_users')
      .delete()
      .eq('branch_id', selectedBranchId)
      .eq('user_id', userIdToRemove);

    if (error) {
      console.error("Error removing user:", error);
      toast({ title: "Error", description: "Could not delete the user.", variant: "destructive" });
    } else {
      toast({ title: "User deleted", description: "The user has been deleted from this branch." });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['pricingInfo', user.id] });
    }
  };

  // Fetch branches for a specific user
  const fetchUserBranches = async (userId: string) => {
    const { data, error } = await supabase
      .from('branch_users')
      .select('branch_id')
      .eq('user_id', userId);
    if (error) return [];
    return (data || []).map((b: any) => b.branch_id);
  };

  // Open modal and load current branches
  const handleOpenManageBranches = async (user: DisplayUser) => {
    setManageBranchesUser(user);
    const userBranchIds = await fetchUserBranches(user.userId);
    setUserBranches(userBranchIds);
  };

  // Save assigned branches
  const handleSaveBranches = async () => {
    if (!manageBranchesUser) return;
    setSavingBranches(true);
    // Delete all existing branch_users for this user
    await supabase.from('branch_users').delete().eq('user_id', manageBranchesUser.userId);
    // Add new branch_users
    const inserts = userBranches.map(branch_id => ({
      user_id: manageBranchesUser.userId,
      branch_id,
      role: manageBranchesUser.role,
    }));
    if (inserts.length > 0) {
      await supabase.from('branch_users').insert(inserts);
    }
    setSavingBranches(false);
    setManageBranchesUser(null);
    refetch();
    queryClient.invalidateQueries({ queryKey: ['pricingInfo', user.id] });
  };

  // Completely delete user (branch_users, profiles, auth)
  const handleDeleteUserCompletely = async (userIdToRemove: string) => {
    setDeletingUserId(userIdToRemove);
    // 1. Delete from branch_users
    await supabase.from('branch_users').delete().eq('user_id', userIdToRemove);
    // 2. Delete from profiles
    await supabase.from('profiles').delete().eq('id', userIdToRemove);
              // 3. Delete from auth (only possible if you use service role key, otherwise via edge function)
    // await supabase.auth.admin.deleteUser(userIdToRemove); // Vereist elevated privileges
    // Alternatief: roep een edge function aan die dit doet
    await supabase.functions.invoke('delete-user', { body: { user_id: userIdToRemove } });
    setDeletingUserId(null);
      toast({ title: 'User deleted', description: 'The account has been completely deleted.' });
    refetch();
    queryClient.invalidateQueries({ queryKey: ['pricingInfo', user.id] });
  };

  return (
    <div className="space-y-6">

      {/* Check if branches are available */}
      {(!branches || !Array.isArray(branches)) ? (
        <div style={{ color: '#b91c1c', background: '#fef2f2', padding: 24, borderRadius: 8, marginBottom: 24 }}>
          <b>Error:</b> Branches could not be loaded. Please refresh the page or contact the administrator.
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Invite User</CardTitle>
              <CardDescription>Add a new or existing user to a branch.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="user@email.com" />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Branch</Label>
                  <Select value={selectedBranchId} onValueChange={setSelectedBranchId} disabled={branches.length === 0}>
                    <SelectTrigger><SelectValue placeholder="Select a branch" /></SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.branch_id} value={branch.branch_id}>{branch.branch_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="button" onClick={handleInviteUser} disabled={inviting || !inviteEmail || !selectedBranchId}>
                {inviting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {inviting ? 'Inviting...' : 'Send Invitation'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users in Branch</CardTitle>
              <CardDescription>Overview of users in the selected branch.</CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 && (loading || isFetching) ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Loading users...</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="mt-2 text-gray-600">Users are loading...</span>
                  </CardContent>
                </Card>
              ) : (
                <ul className="space-y-2">
                  {users.length > 0 ? users.map(u => (
                    <li key={u.id} className="flex justify-between items-center border p-3 rounded-md">
                      <div>
                        <p className="font-medium">{u.email}</p>
                        <p className="text-sm text-gray-500 capitalize">{u.role}</p>
                      </div>
                      <div className="flex gap-2">
                        {/* Hide 'Manage Branches' button for admin himself */}
                        {!(u.userId === user?.id && u.role === 'admin') && (
                          <Button variant="outline" size="sm" onClick={() => handleOpenManageBranches(u)}>
                              Manage Branches
                          </Button>
                        )}
                        {u.userId !== user?.id && (
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteUserCompletely(u.userId)} disabled={deletingUserId === u.userId}>
                            {deletingUserId === u.userId ? 'Deleting...' : 'Delete'}
                          </Button>
                        )}
                      </div>
                    </li>
                  )) : (
                    <div className="text-center text-gray-500 py-4">No users found in this branch.</div>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Modal for managing branches */}
          <Dialog open={!!manageBranchesUser} onOpenChange={open => !open && setManageBranchesUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Branches for {manageBranchesUser?.email}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {branches.map(branch => (
                  <label key={branch.branch_id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={userBranches.includes(branch.branch_id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setUserBranches([...userBranches, branch.branch_id]);
                        } else {
                          setUserBranches(userBranches.filter(id => id !== branch.branch_id));
                        }
                      }}
                    />
                    {branch.branch_name}
                  </label>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={handleSaveBranches} disabled={savingBranches}>
                  {savingBranches ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};
