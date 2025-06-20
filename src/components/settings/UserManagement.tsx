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

interface BranchUser {
  id: string;
  user_id: string;
  branch_id: string;
  role: string;
  email: string;
}

export const UserManagement = () => {
  const { user } = useAuth();
  const { branches, activeBranch } = useBranches();
  const [users, setUsers] = useState<BranchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('staff');
  const [inviting, setInviting] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(activeBranch?.branch_id || '');

  useEffect(() => {
    if (activeBranch) setSelectedBranchId(activeBranch.branch_id);
  }, [activeBranch]);

  useEffect(() => {
    if (selectedBranchId) fetchBranchUsers();
    // eslint-disable-next-line
  }, [selectedBranchId]);

  const fetchBranchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('branch_users')
      .select('id, user_id, branch_id, role, profiles:profiles!branch_users_user_id_fkey(email)')      .eq('branch_id', selectedBranchId);
    if (error) {
      toast({ title: 'Fout', description: 'Kon gebruikers niet laden', variant: 'destructive' });
      setLoading(false);
      return;
    }
    setUsers(
      (data || []).map((u: any) => ({
        id: u.id,
        user_id: u.user_id,
        branch_id: u.branch_id,
        role: u.role,
        email: u.profiles?.email || '',
      }))
    );
    setLoading(false);
  };

  const handleInviteUser = async () => {
    console.log("Invite clicked"); // Add this line
    if (!inviteEmail || !selectedBranchId) return;
    setInviting(true);

    const response = await fetch("https://sszuxnqhbxauvershuys.supabase.co/functions/v1/invite-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "<YOUR_SUPABASE_ANON_KEY>"}`
      },
      body: JSON.stringify({
        email: inviteEmail,
        role: inviteRole,
        branch_id: selectedBranchId,
        invited_by: user?.id,
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch (e) {
      toast({ title: "Fout", description: "Ongeldig antwoord van server", variant: "destructive" });
      setInviting(false);
      return;
    }
    if (!response.ok) {
      toast({ title: "Fout", description: result?.error || "Kon gebruiker niet uitnodigen", variant: "destructive" });
      setInviting(false);
      return;
    }

    toast({ title: "Uitnodiging verzonden", description: "De gebruiker is uitgenodigd." });
    setInviteEmail("");
    setInviteRole("staff");
    setInviting(false);
    fetchBranchUsers();
  };

  const handleRemoveUser = async (userId: string) => {
    await supabase.from('branch_users').delete().eq('branch_id', selectedBranchId).eq('user_id', userId);
    fetchBranchUsers();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gebruiker uitnodigen</CardTitle>
          <CardDescription>Voeg een gebruiker toe aan een filiaal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Email</Label>
              <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="gebruiker@bedrijf.nl" />
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
              <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.branch_id} value={branch.branch_id}>{branch.branch_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="button" onClick={handleInviteUser} disabled={inviting || !inviteEmail || !selectedBranchId}>
            {inviting ? 'Uitnodigen...' : 'Uitnodigen'}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Gebruikers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Laden...</div>
          ) : (
            <ul className="space-y-2">
              {users.map(u => (
                <li key={u.id} className="flex justify-between items-center border p-2 rounded">
                  <span>{u.email} ({u.role})</span>
                  {u.user_id !== user?.id && (
                    <Button variant="outline" size="sm" onClick={() => handleRemoveUser(u.user_id)}>
                      Verwijder
                    </Button>
                  )}
                </li>
              ))}
              {users.length === 0 && <div>Geen gebruikers gevonden.</div>}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
