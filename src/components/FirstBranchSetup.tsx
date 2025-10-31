import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building2} from 'lucide-react';

interface FormData {
  branchName: string;
}

export const FirstBranchSetup = () => {
  const { user } = useAuth();
  const { setActiveBranch, refreshBranches } = useBranches();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    branchName: '',
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

      toast.success('Your first branch has been successfully created!');
      await refreshBranches();
    } catch (err: any) {
      console.error('Error creating branch:', err);
      toast.error('An error occurred: ' + err.message);
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
          <CardTitle className="text-2xl">Welcome to StockFlow!</CardTitle> 
          <CardDescription>
            Let's get started by creating your first branch. You can always add more branches later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branchName" className="text-sm font-medium">
                Company name *
              </Label>
              <Input
                id="branchName"
                type="text"
                placeholder="For example: My Company"
                value={formData.branchName}
                onChange={(e) => handleInputChange('branchName', e.target.value)}
                required
                className="w-full"
              />
            </div>



            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !formData.branchName.trim()}
            >
              {loading ? 'Creating...' : 'Create branch'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};


