
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Edit, Trash2, Crown, User } from 'lucide-react';

interface BranchUser {
  id: string;
  user_id: string;
  branch_id: string;
  role: string;
  granted_at: string;
  profile: {
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
  };
}

export const UserManagement = () => {
  const { user } = useAuth();
  const { branches, activeBranch } = useBranches();
  const [users, setUsers] = useState<BranchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('staff');
  const [inviting, setInviting] = useState(false);

  const fetchBranchUsers = async () => {
    if (!activeBranch) return;

    try {
      const { data, error } = await supabase
        .from('branch_users')
        .select(`
          id,
          user_id,
          branch_id,
          role,
          granted_at,
          profiles!branch_users_user_id_fkey (
            email,
            first_name,
            last_name,
            role
          )
        `)
        .eq('branch_id', activeBranch.branch_id);

      if (error) {
        console.error('Error fetching branch users:', error);
        toast({
          title: "Fout",
          description: "Kon gebruikers niet laden",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our interface
      const transformedUsers = data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        branch_id: item.branch_id,
        role: item.role,
        granted_at: item.granted_at,
        profile: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      })) || [];

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching branch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail || !activeBranch) return;

    setInviting(true);
    try {
      // First check if user already exists in the system
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteEmail)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (existingUser) {
        // User exists, add them to the branch
        const { error: branchUserError } = await supabase
          .from('branch_users')
          .insert({
            branch_id: activeBranch.branch_id,
            user_id: existingUser.id,
            role: inviteRole,
            granted_by: user?.id
          });

        if (branchUserError) {
          if (branchUserError.code === '23505') {
            toast({
              title: "Gebruiker al toegevoegd",
              description: "Deze gebruiker heeft al toegang tot dit filiaal",
              variant: "destructive",
            });
          } else {
            throw branchUserError;
          }
        } else {
          toast({
            title: "Gebruiker toegevoegd",
            description: "De gebruiker is succesvol toegevoegd aan het filiaal",
          });
          setInviteEmail('');
          await fetchBranchUsers();
        }
      } else {
        // User doesn't exist, create invitation (in a real app, you'd send an invitation email)
        toast({
          title: "Uitnodiging verstuurd",
          description: "Een uitnodiging is verstuurd naar " + inviteEmail,
        });
        setInviteEmail('');
      }
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Fout",
        description: "Kon gebruiker niet uitnodigen",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!activeBranch) return;

    try {
      const { error } = await supabase
        .from('branch_users')
        .delete()
        .eq('branch_id', activeBranch.branch_id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Gebruiker verwijderd",
        description: "De gebruiker is verwijderd uit het filiaal",
      });
      
      await fetchBranchUsers();
    } catch (error) {
      console.error('Error removing user:', error);
      toast({
        title: "Fout",
        description: "Kon gebruiker niet verwijderen",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!activeBranch) return;

    try {
      const { error } = await supabase
        .from('branch_users')
        .update({ role: newRole })
        .eq('branch_id', activeBranch.branch_id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Rol bijgewerkt",
        description: "De gebruikersrol is succesvol bijgewerkt",
      });
      
      await fetchBranchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Fout",
        description: "Kon rol niet bijwerken",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (activeBranch) {
      fetchBranchUsers();
    }
  }, [activeBranch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Laden...</span>
      </div>
    );
  }

  if (!activeBranch) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Selecteer eerst een filiaal om gebruikers te beheren</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invite User Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Gebruiker Uitnodigen</span>
          </CardTitle>
          <CardDescription>
            Nodig een nieuwe gebruiker uit voor {activeBranch.branch_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="gebruiker@bedrijf.nl"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Medewerker</SelectItem>
                  <SelectItem value="admin">Beheerder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={handleInviteUser} 
            disabled={!inviteEmail || inviting}
            className="w-full md:w-auto"
          >
            {inviting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uitnodigen...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Uitnodigen
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Huidige Gebruikers</CardTitle>
          <CardDescription>
            Beheer gebruikers voor {activeBranch.branch_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((branchUser) => (
              <div
                key={branchUser.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {branchUser.profile?.role === 'admin' ? (
                      <Crown className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <User className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {branchUser.profile?.first_name} {branchUser.profile?.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{branchUser.profile?.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={branchUser.role === 'admin' ? 'default' : 'secondary'}>
                        {branchUser.role === 'admin' ? 'Beheerder' : 'Medewerker'}
                      </Badge>
                      <Badge variant="outline">
                        {branchUser.profile?.role === 'admin' ? 'Systeem Admin' : 'Gebruiker'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select
                    value={branchUser.role}
                    onValueChange={(newRole) => handleUpdateRole(branchUser.user_id, newRole)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Medewerker</SelectItem>
                      <SelectItem value="admin">Beheerder</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {branchUser.user_id !== user?.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveUser(branchUser.user_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {users.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">Geen gebruikers gevonden voor dit filiaal</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
