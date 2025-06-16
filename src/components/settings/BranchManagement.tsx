
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Building2, Plus, Edit, Users, Calendar } from 'lucide-react';

interface BranchFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface AdminBranch {
  branch_id: string;
  branch_name: string;
  is_main: boolean;
  user_count: number;
  created_at: string;
}

export const BranchManagement = () => {
  const { user } = useAuth();
  const { refreshBranches } = useBranches();
  const [adminBranches, setAdminBranches] = useState<AdminBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBranch, setEditingBranch] = useState<AdminBranch | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BranchFormData>();

  const fetchAdminBranches = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_admin_branches', {
        admin_id: user.id
      });

      if (error) {
        console.error('Error fetching admin branches:', error);
        return;
      }

      console.log('Admin branches fetched:', data);
      setAdminBranches(data || []);
    } catch (error) {
      console.error('Exception fetching admin branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminBranches();
  }, [user]);

  const onSubmit = async (data: BranchFormData) => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (editingBranch) {
        // Update existing branch
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

        if (error) {
          console.error('Error updating branch:', error);
          toast({
            title: 'Fout',
            description: 'Er is een fout opgetreden bij het bijwerken van het filiaal.',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Succesvol bijgewerkt',
          description: 'Het filiaal is succesvol bijgewerkt.',
        });
      } else {
        // Create new branch
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

        if (branchError) {
          console.error('Error creating branch:', branchError);
          toast({
            title: 'Fout',
            description: 'Er is een fout opgetreden bij het aanmaken van het filiaal.',
            variant: 'destructive',
          });
          return;
        }

        // Assign admin to the new branch
        const { error: userError } = await supabase
          .from('branch_users')
          .insert({
            branch_id: newBranch.id,
            user_id: user.id,
            role: 'admin',
            granted_by: user.id,
          });

        if (userError) {
          console.error('Error assigning user to branch:', userError);
          toast({
            title: 'Waarschuwing',
            description: 'Filiaal aangemaakt, maar er was een probleem met de gebruikerstoewijzing.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Succesvol aangemaakt',
            description: 'Het nieuwe filiaal is succesvol aangemaakt.',
          });
        }
      }

      setIsDialogOpen(false);
      setEditingBranch(null);
      reset();
      await fetchAdminBranches();
      await refreshBranches();
    } catch (error) {
      console.error('Exception saving branch:', error);
      toast({
        title: 'Fout',
        description: 'Er is een onverwachte fout opgetreden.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditBranch = async (branch: AdminBranch) => {
    // Fetch full branch details
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('id', branch.branch_id)
      .single();

    if (error) {
      console.error('Error fetching branch details:', error);
      toast({
        title: 'Fout',
        description: 'Kon filiaal gegevens niet ophalen.',
        variant: 'destructive',
      });
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
    reset({
      name: '',
      address: '',
      phone: '',
      email: '',
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Laden...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Uw Filialen</h3>
          <p className="text-sm text-gray-600">Beheer en overzicht van alle filialen</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Nieuw Filiaal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? 'Filiaal Bewerken' : 'Nieuw Filiaal Aanmaken'}
              </DialogTitle>
              <DialogDescription>
                {editingBranch 
                  ? 'Bewerk de gegevens van het geselecteerde filiaal.'
                  : 'Voer de gegevens in voor het nieuwe filiaal.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Filiaal Naam *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Filiaal naam is verplicht' })}
                  placeholder="Hoofdvestiging"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Straat 123, 1234 AB Stad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefoon</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+31 6 12345678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="filiaal@bedrijf.nl"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuleren
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingBranch ? 'Bijwerken' : 'Aanmaken'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adminBranches.map((branch) => (
          <Card key={branch.branch_id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span className="truncate">{branch.branch_name}</span>
                </div>
                {branch.is_main && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Hoofdvestiging
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{branch.user_count} gebruiker(s)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Aangemaakt: {new Date(branch.created_at).toLocaleDateString('nl-NL')}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditBranch(branch)}
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                Bewerken
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {adminBranches.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen filialen gevonden</h3>
            <p className="text-gray-600 mb-4">Begin met het aanmaken van uw eerste filiaal.</p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Eerste Filiaal Aanmaken
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
