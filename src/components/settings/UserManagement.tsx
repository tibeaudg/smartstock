
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, Users, Shield, Calendar, Building2 } from 'lucide-react';

interface BranchUser {
  user_id: string;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  user_role: string;
  branch_id: string;
  branch_name: string;
  granted_at: string;
}

export const UserManagement = () => {
  const { user } = useAuth();
  const [branchUsers, setBranchUsers] = useState<BranchUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranchUsers = async () => {
    if (!user) return;

    try {
      // Get all users from branches that the admin has access to
      const { data, error } = await supabase
        .from('branch_users')
        .select(`
          user_id,
          role,
          granted_at,
          branch_id,
          branches:branch_id (
            name
          ),
          profiles:user_id (
            email,
            first_name,
            last_name,
            role
          )
        `)
        .in('branch_id', 
          // First get branches that the admin has access to
          await supabase
            .from('branch_users')
            .select('branch_id')
            .eq('user_id', user.id)
            .then(({ data }) => data?.map(b => b.branch_id) || [])
        );

      if (error) {
        console.error('Error fetching branch users:', error);
        return;
      }

      console.log('Branch users data:', data);

      // Transform the data for easier use
      const transformedData = data?.map(item => ({
        user_id: item.user_id,
        user_email: item.profiles?.email || '',
        user_first_name: item.profiles?.first_name || '',
        user_last_name: item.profiles?.last_name || '',
        user_role: item.profiles?.role || 'staff',
        branch_id: item.branch_id,
        branch_name: item.branches?.name || '',
        granted_at: item.granted_at,
      })) || [];

      setBranchUsers(transformedData);
    } catch (error) {
      console.error('Exception fetching branch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchUsers();
  }, [user]);

  const removeUserFromBranch = async (userId: string, branchId: string) => {
    if (!user || userId === user.id) {
      toast({
        title: 'Niet toegestaan',
        description: 'U kunt uzelf niet verwijderen uit een filiaal.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('branch_users')
        .delete()
        .eq('user_id', userId)
        .eq('branch_id', branchId);

      if (error) {
        console.error('Error removing user from branch:', error);
        toast({
          title: 'Fout',
          description: 'Er is een fout opgetreden bij het verwijderen van de gebruiker.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Gebruiker verwijderd',
        description: 'De gebruiker is succesvol verwijderd uit het filiaal.',
      });

      await fetchBranchUsers();
    } catch (error) {
      console.error('Exception removing user from branch:', error);
      toast({
        title: 'Fout',
        description: 'Er is een onverwachte fout opgetreden.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Laden...</span>
      </div>
    );
  }

  // Group users by branch
  const usersByBranch = branchUsers.reduce((acc, user) => {
    if (!acc[user.branch_id]) {
      acc[user.branch_id] = {
        branch_name: user.branch_name,
        users: []
      };
    }
    acc[user.branch_id].users.push(user);
    return acc;
  }, {} as Record<string, { branch_name: string; users: BranchUser[] }>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Gebruikers Overzicht</h3>
        <p className="text-sm text-gray-600">Overzicht van alle gebruikers in uw filialen</p>
      </div>

      {Object.entries(usersByBranch).map(([branchId, branchData]) => (
        <Card key={branchId}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>{branchData.branch_name}</span>
              <Badge variant="secondary">{branchData.users.length} gebruiker(s)</Badge>
            </CardTitle>
            <CardDescription>
              Gebruikers met toegang tot dit filiaal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {branchData.users.map((branchUser) => (
                <div 
                  key={`${branchUser.user_id}-${branchUser.branch_id}`}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {branchUser.user_first_name} {branchUser.user_last_name}
                      </p>
                      <p className="text-sm text-gray-600">{branchUser.user_email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={branchUser.user_role === 'admin' ? 'default' : 'secondary'}>
                          <Shield className="w-3 h-3 mr-1" />
                          {branchUser.user_role}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Toegevoegd: {new Date(branchUser.granted_at).toLocaleDateString('nl-NL')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {branchUser.user_id !== user?.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeUserFromBranch(branchUser.user_id, branchUser.branch_id)}
                    >
                      Verwijderen
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {Object.keys(usersByBranch).length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen gebruikers gevonden</h3>
            <p className="text-gray-600">Er zijn nog geen gebruikers toegevoegd aan uw filialen.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
