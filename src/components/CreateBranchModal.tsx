import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBranches } from '@/hooks/useBranches';

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
}

export const CreateBranchModal = ({
  open,
  onOpenChange,
  onBranchCreated,
  isAdditionalBranch = false,
}: CreateBranchModalProps) => {
  const { user } = useAuth();
  const { setActiveBranch } = useBranches();
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
      confirmPayment: false,
    },
  });

  useEffect(() => {
    const fetchLicense = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('licenses')
        .select('license_type')
        .eq('admin_user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching license:', error);
      } else {
        setLicenseInfo(data);
        if (isAdditionalBranch) {
          setShowPaymentWarning(true);
        }
      }
    };

    if (open) {
      fetchLicense();
    }
  }, [open, isAdditionalBranch, user]);

  const handleSubmit = async (data: FormData) => {
    if (!user) return toast.error('Geen gebruiker gevonden');

    setLoading(true);
    try {
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .insert({
          name: data.branchName,
          address: data.address || null,
          phone: data.phone || null,
          email: data.email || null,
          is_main: !isAdditionalBranch,
          is_active: true,
          user_id: user.id, // <-- automatisch koppelen aan gebruiker
        })
        .select()
        .single();

      if (branchError) throw branchError;

      const { error: assignError } = await supabase.from('branch_users').insert({
        branch_id: branchData.id,
        user_id: user.id,
        role: 'admin',
        granted_by: user.id,
      });

      if (assignError) throw assignError;

      // Zet de nieuwe branch direct als actief na aanmaken
      if (branchData && branchData.id) {
        setActiveBranch({
          branch_id: branchData.id,
          branch_name: branchData.name,
          is_main: branchData.is_main,
          user_role: 'admin', // of haal uit branchData als beschikbaar
        });
      }

      toast.success(
        isAdditionalBranch
          ? 'Filiaal succesvol aangemaakt! Extra kosten worden verrekend in de volgende factuur.'
          : 'Filiaal succesvol aangemaakt!'
      );

      form.reset();
      onBranchCreated();
      onOpenChange?.(false);
      window.location.reload(); // Optional: kan verplaatst worden als reload niet wenselijk is
    } catch (err: any) {
      console.error('Fout bij het aanmaken:', err);
      toast.error('Er is een fout opgetreden: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isAdditionalBranch ? 'Nieuw Filiaal' : 'Hoofdvestiging'}
          </DialogTitle>
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

            {isAdditionalBranch && (
              <>
                {showPaymentWarning ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <CreditCard className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Betaalmethode vereist</p>
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
                            onOpenChange?.(false);
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
                      <FormItem className="flex flex-row items-start space-x-3">
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
              <Button type="submit" disabled={loading || (isAdditionalBranch && showPaymentWarning)}>
                {loading ? 'Bezig...' : 'Opslaan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
