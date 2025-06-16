import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { AlertCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  confirmPayment?: boolean;
}

interface LicenseInfo {
  license_type: string;
  stripe_customer_id: string | null;
}

export const CreateBranchModal = ({ 
  open, 
  onOpenChange, 
  onBranchCreated, 
  isAdditionalBranch = false 
}: CreateBranchModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      branchName: isAdditionalBranch ? '' : 'Hoofdvestiging',
      address: '',
      phone: '',
      email: '',
      confirmPayment: false
    },
  });

  useEffect(() => {
    const fetchLicenseInfo = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('licenses')
        .select('license_type, stripe_customer_id')
        .eq('admin_user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching license info:', error);
        return;
      }

      setLicenseInfo(data);
      
      // Show payment warning if this is an additional branch and no payment method
      if (isAdditionalBranch && !data.stripe_customer_id) {
        setShowPaymentWarning(true);
      }
    };

    if (open) {
      fetchLicenseInfo();
    }
  }, [user, open, isAdditionalBranch]);

  const handleSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Geen gebruiker gevonden');
      return;
    }

    // Check if payment is required but not confirmed
    if (isAdditionalBranch && !licenseInfo?.stripe_customer_id) {
      navigate('/settings/billing');
      toast.error('U moet eerst een betaalmethode toevoegen');
      if (onOpenChange) onOpenChange(false);
      return;
    }

    // If additional branch, make sure user confirms the extra cost
    if (isAdditionalBranch && !data.confirmPayment) {
      toast.error('Bevestig alstublieft de extra kosten');
      return;
    }

    setLoading(true);
    try {
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

      // Update license with extra branch count if this is an additional branch
      if (isAdditionalBranch) {
        const { error: licenseError } = await supabase
          .from('licenses')
          .update({ 
            extra_branches: supabase.sql`extra_branches + 1`
          })
          .eq('admin_user_id', user.id)
          .eq('is_active', true);

        if (licenseError) {
          console.error('Error updating license:', licenseError);
          toast.error('Fout bij het bijwerken van licentie');
          return;
        }
      }

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

      toast.success(isAdditionalBranch 
        ? 'Filiaal succesvol aangemaakt! Extra kosten worden verrekend in de volgende factuur.' 
        : 'Filiaal succesvol aangemaakt!');
      
      form.reset();
      onBranchCreated();
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isAdditionalBranch ? 'Nieuw Filiaal' : 'Hoofdvestiging'}</DialogTitle>
          <DialogDescription>
            {isAdditionalBranch 
              ? 'Voeg een nieuw filiaal toe aan uw account.' 
              : 'Configureer uw hoofdvestiging.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="branchName"
              rules={{ required: 'Filiaal naam is verplicht' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naam</FormLabel>
                  <FormControl>
                    <Input placeholder="Filiaal naam" {...field} />
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

            {isAdditionalBranch && (
              <>
                {showPaymentWarning ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <CreditCard className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Betaalmethode vereist
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          U moet eerst een betaalmethode toevoegen voordat u extra filialen kunt aanmaken.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            navigate('/settings/billing');
                            if (onOpenChange) onOpenChange(false);
                          }}
                        >
                          Ga naar betaalinstellingen
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="confirmPayment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Ik bevestig dat er €5/maand extra kosten in rekening worden gebracht
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <DialogFooter>
              <Button
                type="submit"
                disabled={loading || (isAdditionalBranch && showPaymentWarning)}
              >
                {loading ? 'Bezig...' : 'Opslaan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
