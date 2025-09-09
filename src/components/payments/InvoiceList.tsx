import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, Download, Eye, Euro, Calendar, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'cancelled';
  created_at: string;
  due_date: string;
  module_title: string;
  billing_cycle: string;
  stripe_invoice_id?: string;
  pdf_url?: string;
}

export const InvoiceList: React.FC = () => {
  const { user } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Fetch invoices
  const {
    data: invoices = [],
    isLoading,
    error
  } = useQuery<Invoice[]>({
    queryKey: ['invoices', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          user_module_subscriptions!inner(
            module_id,
            billing_cycle,
            modules(title)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(invoice => ({
        ...invoice,
        module_title: invoice.user_module_subscriptions?.modules?.title || 'Onbekende module',
        billing_cycle: invoice.user_module_subscriptions?.billing_cycle || 'monthly',
      })) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Betaald';
      case 'pending': return 'In behandeling';
      case 'failed': return 'Mislukt';
      case 'cancelled': return 'Geannuleerd';
      default: return 'Onbekend';
    }
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      if (invoice.pdf_url) {
        // Download existing PDF
        window.open(invoice.pdf_url, '_blank');
      } else {
        // Generate new PDF
        const response = await fetch(`/api/invoices/${invoice.id}/pdf`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to generate invoice PDF');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factuur-${invoice.invoice_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het downloaden van de factuur.',
        variant: 'destructive',
      });
    }
  };

  const totalPaid = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const totalPending = invoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Facturen laden...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Fout bij laden</h3>
        <p className="text-red-600">Er is een fout opgetreden bij het laden van de facturen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Totaal facturen</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Euro className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Betaald</p>
                <p className="text-2xl font-bold text-gray-900">€{totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Openstaand</p>
                <p className="text-2xl font-bold text-gray-900">€{totalPending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Factuur #{invoice.invoice_number}
                    </h3>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusText(invoice.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Module:</span> {invoice.module_title}
                    </div>
                    <div>
                      <span className="font-medium">Periode:</span> {invoice.billing_cycle === 'monthly' ? 'Maandelijks' : 'Jaarlijks'}
                    </div>
                    <div>
                      <span className="font-medium">Datum:</span> {new Date(invoice.created_at).toLocaleDateString('nl-NL')}
                    </div>
                  </div>

                  {invoice.due_date && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Vervaldatum:</span> {new Date(invoice.due_date).toLocaleDateString('nl-NL')}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                      <Euro className="w-5 h-5" />
                      {invoice.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">{invoice.currency.toUpperCase()}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInvoice(invoice)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Bekijken
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {invoices.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen facturen gevonden</h3>
            <p className="text-gray-600">Je hebt nog geen facturen ontvangen.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
