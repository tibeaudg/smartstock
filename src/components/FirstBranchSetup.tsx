import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';

interface FormData {
  branchName: string;
  address: string;
  phone: string;
  email: string;
}

export const FirstBranchSetup = () => {
  const { user } = useAuth();
  const { setActiveBranch, refreshBranches } = useBranches();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    branchName: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('Geen gebruiker gevonden');

    if (!formData.branchName.trim()) {
      toast.error('Bedrijfsnaam is verplicht');
      return;
    }

    setLoading(true);
    try {
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .insert({
          name: formData.branchName.trim(),
          address: formData.address.trim() || null,
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null,
          is_main: true,
          is_active: true,
          user_id: user.id,
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

      // Set the new branch as active
      if (branchData && branchData.id) {
        setActiveBranch({
          branch_id: branchData.id,
          branch_name: branchData.name,
          is_main: branchData.is_main,
          user_role: 'admin',
        });
      }

      toast.success('Je eerste vestiging is succesvol aangemaakt!');
      await refreshBranches();
    } catch (err: any) {
      console.error('Fout bij het aanmaken van vestiging:', err);
      toast.error('Er is een fout opgetreden: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welkom bij StockFlow!</CardTitle>
          <CardDescription>
            Laten we beginnen door je eerste vestiging aan te maken. Je kunt later altijd meer vestigingen toevoegen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branchName" className="text-sm font-medium">
                Bedrijfsnaam *
              </Label>
              <Input
                id="branchName"
                type="text"
                placeholder="Bijv. Mijn Bedrijf"
                value={formData.branchName}
                onChange={(e) => handleInputChange('branchName', e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adres
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Straat, huisnummer, postcode, plaats"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefoonnummer
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+31 6 12345678"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-mailadres
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="info@bedrijf.nl"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !formData.branchName.trim()}
            >
              {loading ? 'Aanmaken...' : 'Vestiging aanmaken'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
