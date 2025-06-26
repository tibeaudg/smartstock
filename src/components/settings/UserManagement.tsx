import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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

export const UserManagement = () => {
  const { user } = useAuth();
  const { branches, activeBranch } = useBranches();
  
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [loading, setLoading] = useState(true); // Start loading op true voor de eerste laadbeurt
  const [inviting, setInviting] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('staff');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  useEffect(() => {
    if (activeBranch?.branch_id && !selectedBranchId) {
      setSelectedBranchId(activeBranch.branch_id);
    }
  }, [activeBranch, selectedBranchId]);

  const fetchBranchUsers = useCallback(async () => {
    if (!selectedBranchId) {
      setUsers([]);
      setLoading(false);
      return;
    };

    setLoading(true);
    try {
      // --- CORRECTIE HIERONDER ---
      // We specificeren de exacte foreign key relatie om de dubbelzinnigheid op te lossen.
      const { data, error } = await supabase
        .from('branch_users')
        .select(`
          id,
          user_id,
          role,
          profiles!branch_users_user_id_fkey (email)
        `)
        .eq('branch_id', selectedBranchId)
        .returns<BranchUser[]>();

      if (error) throw error;

      const displayUsers = (data || []).map(u => ({
        id: u.id,
        userId: u.user_id,
        email: u.profiles?.email || 'Uitnodiging in afwachting',
        role: u.role,
      }));
      setUsers(displayUsers);

    } catch (error) {
      console.error("Error fetching branch users:", error);
      toast({ title: 'Fout', description: 'Kon gebruikers niet laden', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [selectedBranchId]);

  useEffect(() => {
    fetchBranchUsers();
  }, [fetchBranchUsers]);

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
      toast({ title: "Fout", description: error.message || "Kon gebruiker niet uitnodigen", variant: "destructive" });
      return;
    }

    toast({ title: "Uitnodiging verzonden", description: `${inviteEmail} is uitgenodigd.` });
    setInviteEmail('');
    setInviteRole("staff");
    fetchBranchUsers();
  };

  const handleRemoveUser = async (userIdToRemove: string) => {
    if (userIdToRemove === user?.id) {
      toast({ title: "Actie niet toegestaan", description: "U kunt uzelf niet verwijderen.", variant: "destructive" });
      return;
    }
    
    const { error } = await supabase
      .from('branch_users')
      .delete()
      .eq('branch_id', selectedBranchId)
      .eq('user_id', userIdToRemove);

    if (error) {
      console.error("Error removing user:", error);
      toast({ title: "Fout", description: "Kon de gebruiker niet verwijderen.", variant: "destructive" });
    } else {
      toast({ title: "Gebruiker verwijderd", description: "De gebruiker is verwijderd uit dit filiaal." });
      fetchBranchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gebruiker uitnodigen</CardTitle>
          <CardDescription>Voeg een nieuwe of bestaande gebruiker toe aan een filiaal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="gebruiker@email.com" />
            </div>
            <div>
              <Label>Rol</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Medewerker</SelectItem>
                  <SelectItem value="admin">Beheerder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Filiaal</Label>
              <Select value={selectedBranchId} onValueChange={setSelectedBranchId} disabled={branches.length === 0}>
                <SelectTrigger><SelectValue placeholder="Selecteer een filiaal" /></SelectTrigger>
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
            {inviting ? 'Uitnodigen...' : 'Verstuur Uitnodiging'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gebruikers in Filiaal</CardTitle>
          <CardDescription>Overzicht van gebruikers in het geselecteerde filiaal.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center text-gray-500"><Loader2 className="w-4 h-4 mr-2 animate-spin" />Laden...</div>
          ) : (
            <ul className="space-y-2">
              {users.length > 0 ? users.map(u => (
                <li key={u.id} className="flex justify-between items-center border p-3 rounded-md">
                  <div>
                    <p className="font-medium">{u.email}</p>
                    <p className="text-sm text-gray-500 capitalize">{u.role}</p>
                  </div>
                  {u.userId !== user?.id && (
                    <Button variant="outline" size="sm" onClick={() => handleRemoveUser(u.userId)}>
                      Verwijder
                    </Button>
                  )}
                </li>
              )) : (
                <div className="text-center text-gray-500 py-4">Geen gebruikers gevonden in dit filiaal.</div>
              )}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};