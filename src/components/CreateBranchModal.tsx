
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CreateBranchModalProps {
  open: boolean;
  onBranchCreated: () => void;
}

interface FormData {
  branchName: string;
  address?: string;
  phone?: string;
  email?: string;
}

export const CreateBranchModal = ({ open, onBranchCreated }: CreateBranchModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      branchName: 'Hoofdvestiging',
      address: '',
      phone: '',
      email: '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Geen gebruiker gevonden');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating branch:', data);
      
      // Create the branch
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .insert({
          name: data.branchName,
          address: data.address || null,
          phone: data.phone || null,
          email: data.email || null,
          is_main: true,
          is_active: true,
        })
        .select()
        .single();

      if (branchError) {
        console.error('Error creating branch:', branchError);
        toast.error('Fout bij het aanmaken van filiaal: ' + branchError.message);
        return;
      }

      console.log('Branch created:', branchData);

      // Assign the user to the branch
      const { error: assignError } = await supabase
        .from('branch_users')
        .insert({
          branch_id: branchData.id,
          user_id: user.id,
          role: 'admin',
          granted_by: user.id,
        });

      if (assignError) {
        console.error('Error assigning user to branch:', assignError);
        toast.error('Fout bij het toewijzen aan filiaal: ' + assignError.message);
        return;
      }

      console.log('User assigned to branch successfully');
      toast.success('Filiaal succesvol aangemaakt!');
      form.reset();
      onBranchCreated();
    } catch (error) {
      console.error('Exception creating branch:', error);
      toast.error('Er is een onverwachte fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle>Welkom! Maak je eerste filiaal aan</DialogTitle>
          <DialogDescription>
            Om te beginnen met je voorraadbeheersysteem, moet je eerst een filiaal aanmaken.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="branchName"
              rules={{ required: 'Filiaalnaam is verplicht' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filiaalnaam *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Bijvoorbeeld: Hoofdvestiging"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres (optioneel)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Straat en huisnummer, postcode, plaats"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefoon (optioneel)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="06-12345678"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail (optioneel)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="info@bedrijf.nl"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Bezig met aanmaken...' : 'Filiaal aanmaken'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
