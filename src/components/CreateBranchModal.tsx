
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
import { AlertCircle } from 'lucide-react';

interface CreateBranchModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onBranchCreated: () => void;
  isAdditionalBranch?: boolean;
}

interface FormData {
  branchName: string;
  address?: string;
  phone?: string;
  email?: string;
}

export const CreateBranchModal = ({ 
  open, 
  onOpenChange, 
  onBranchCreated, 
  isAdditionalBranch = false 
}: CreateBranchModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      branchName: isAdditionalBranch ? '' : 'Hoofdvestiging',
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
          is_main: !isAdditionalBranch,
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
      
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Exception creating branch:', error);
      toast.error('Er is een onverwachte fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isAdditionalBranch ? onOpenChange : undefined}>
      <DialogContent className="sm:max-w-md" hideCloseButton={!isAdditionalBranch}>
        <DialogHeader>
          <DialogTitle>
            {isAdditionalBranch ? 'Nieuw filiaal toevoegen' : 'Welkom! Maak je eerste filiaal aan'}
          </DialogTitle>
          <DialogDescription>
            {isAdditionalBranch ? (
              <div className="space-y-2">
                <p>Voeg een nieuw filiaal toe aan je account.</p>
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Een extra filiaal kost €5/maand
                  </p>
                </div>
              </div>
            ) : (
              'Om te beginnen met je voorraadbeheersysteem, moet je eerst een filiaal aanmaken.'
            )}
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
                      placeholder={isAdditionalBranch ? "Bijvoorbeeld: Filiaal West" : "Bijvoorbeeld: Hoofdvestiging"}
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
              {isAdditionalBranch && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={loading}
                >
                  Annuleren
                </Button>
              )}
              <Button type="submit" disabled={loading} className={isAdditionalBranch ? '' : 'w-full'}>
                {loading ? 'Bezig met aanmaken...' : 'Filiaal aanmaken'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
