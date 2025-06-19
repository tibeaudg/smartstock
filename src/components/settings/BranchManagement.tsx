import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBranch, setEditingBranch] = useState<AdminBranch | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchFormData>();

  // Load branches
  useEffect(() => {
    const fetchAdminBranches = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('get_admin_branches', {
          admin_id: user.id,
        });

        if (error) {
          console.error('Error fetching admin branches:', error);
        } else {
          setAdminBranches(data || []);
        }
      } catch (error) {
        console.error('Exception fetching admin branches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminBranches();
  }, [user]);

  // Delete branch
  const deleteBranch = async (branchId: string) => {
    const confirmed = window.confirm('Weet je zeker dat je dit filiaal wilt verwijderen?');
    if (!confirmed || !user) return;

    const { error } = await supabase
      .from('branches')
      .delete()
      .eq('id', branchId)

    if (error) {
      console.error('Fout bij verwijderen:', error);
    } else {
      setAdminBranches(prev => prev.filter(branch => branch.branch_id !== branchId));
      toast({ title: 'Verwijderd', description: 'Filiaal succesvol verwijderd.' });
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

        toast({ title: 'Bijgewerkt', description: 'Filiaal succesvol bijgewerkt.' });
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
            title: 'Waarschuwing',
            description: 'Filiaal aangemaakt, maar koppelen aan gebruiker mislukt.',
            variant: 'destructive',
          });
        } else {
          toast({ title: 'Aangemaakt', description: 'Nieuw filiaal succesvol toegevoegd.' });
        }
      }

      setIsDialogOpen(false);
      setEditingBranch(null);
      reset();
      await refreshBranches();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden tijdens het opslaan.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditBranch = async (branch: AdminBranch) => {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('id', branch.branch_id)
      .single();

    if (error) {
      console.error('Fout bij ophalen filiaal:', error);
      toast({ title: 'Fout', description: 'Kon gegevens niet ophalen.', variant: 'destructive' });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Filialen laden...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Nieuw Filiaal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBranch ? 'Filiaal Bewerken' : 'Nieuw Filiaal'}</DialogTitle>
              <DialogDescription>
                {editingBranch
                  ? 'Pas de gegevens van dit filiaal aan.'
                  : 'Voer de gegevens van het nieuwe filiaal in.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {['name'].map((field) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>
                    {field === 'name' ? 'Filiaal Naam *' : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={
                      field === 'name'
                        ? ''

                        : field === 'phone'
                        ? '+31 6 12345678'
                        : 'filiaal@bedrijf.nl'
                    }
                    {...register(field as keyof BranchFormData, {
                      required: field === 'name' ? 'Naam is verplicht' : false,
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
          <Card key={branch.branch_id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{branch.branch_name}</span>
                </div>
                {branch.is_main && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Hoofdvestiging
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{branch.user_count} gebruikers</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(branch.created_at).toLocaleDateString('nl-NL')}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEditBranch(branch)} size="sm" variant="outline" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Bewerken
                </Button>
                  <Button
                    onClick={() => deleteBranch(branch.branch_id)}
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    disabled={branch.is_main}
                  >
                    Verwijderen
                  </Button>

              </div>
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
