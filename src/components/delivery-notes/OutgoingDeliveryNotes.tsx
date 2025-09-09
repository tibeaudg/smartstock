import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Download, 
  Plus, 
  FileText, 
  Calendar, 
  User, 
  Building,
  Package,
  ArrowUp,
  Edit,
  Trash2,
  Eye,
  Printer
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface DeliveryNote {
  id: string;
  type: 'incoming' | 'outgoing';
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  supplier_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_address?: string;
  delivery_date?: string;
  reference_number?: string;
  notes?: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export const OutgoingDeliveryNotes: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<DeliveryNote | null>(null);

  // Fetch outgoing delivery notes
  const { data: deliveryNotes = [], isLoading } = useQuery<DeliveryNote[]>({
    queryKey: ['delivery-notes', 'outgoing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_notes')
        .select('*')
        .eq('user_id', user?.id)
        .eq('type', 'outgoing')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Create delivery note mutation
  const createMutation = useMutation({
    mutationFn: async (noteData: Partial<DeliveryNote>) => {
      const { data, error } = await supabase
        .from('delivery_notes')
        .insert({
          ...noteData,
          user_id: user?.id,
          type: 'outgoing',
          status: 'draft'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Leveringsbon aangemaakt',
        description: 'De uitgaande leveringsbon is succesvol aangemaakt.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het aanmaken van de leveringsbon.',
        variant: 'destructive',
      });
    }
  });

  const handleCreateNote = (formData: FormData) => {
    const data = {
      customer_name: formData.get('customer_name') as string,
      customer_email: formData.get('customer_email') as string || null,
      customer_address: formData.get('customer_address') as string || null,
      delivery_date: formData.get('delivery_date') as string || null,
      reference_number: formData.get('reference_number') as string || null,
      notes: formData.get('notes') as string || null,
    };
    
    createMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Concept';
      case 'processing': return 'In Behandeling';
      case 'completed': return 'Voltooid';
      case 'cancelled': return 'Geannuleerd';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Leveringsbonnen laden...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Uitgaande Leveringsbonnen</h2>
          <p className="text-gray-600 mt-1">Genereer leveringsbonnen voor klanten</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nieuwe Leveringsbon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nieuwe Uitgaande Leveringsbon</DialogTitle>
            </DialogHeader>
            <form action={handleCreateNote} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reference_number">Referentienummer</Label>
                  <Input
                    id="reference_number"
                    name="reference_number"
                    placeholder="LEV-2024-001"
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_date">Leveringsdatum</Label>
                  <Input
                    id="delivery_date"
                    name="delivery_date"
                    type="date"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customer_name">Klant Naam *</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  placeholder="Naam van de klant"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="customer_email">Klant Email</Label>
                <Input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  placeholder="email@voorbeeld.nl"
                />
              </div>
              
              <div>
                <Label htmlFor="customer_address">Leveringsadres</Label>
                <Textarea
                  id="customer_address"
                  name="customer_address"
                  placeholder="Straat, huisnummer, postcode, plaats"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Opmerkingen</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Extra opmerkingen over de levering..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Annuleren
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Aanmaken...' : 'Aanmaken'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delivery Notes List */}
      <div className="space-y-4">
        {deliveryNotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Geen leveringsbonnen</h3>
              <p className="text-gray-600 mb-4">Je hebt nog geen uitgaande leveringsbonnen aangemaakt.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Eerste Leveringsbon Aanmaken
              </Button>
            </CardContent>
          </Card>
        ) : (
          deliveryNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <ArrowUp className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {note.reference_number || `LEV-${note.id.slice(-8)}`}
                      </h3>
                      <Badge className={getStatusColor(note.status)}>
                        {getStatusLabel(note.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{note.customer_name || 'Geen klant'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{note.delivery_date ? new Date(note.delivery_date).toLocaleDateString('nl-NL') : 'Geen datum'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>€{note.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span>{new Date(note.created_at).toLocaleDateString('nl-NL')}</span>
                      </div>
                    </div>
                    
                    {note.notes && (
                      <p className="text-sm text-gray-600 mt-2">{note.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
