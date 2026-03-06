import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Download, MessageSquare, AlertCircle, ListChecks } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  selected_plan: string | null;
  blocked: boolean | null;
  last_login?: string | null;
  organization_name?: string | null;
  referral_source?: string | null;
}

interface UserDetailModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

// Data fetching functions
async function fetchUserProducts(userId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchUserSalesOrders(userId: string) {
  const { data, error } = await supabase
    .from('sales_orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}













async function fetchUserBilling(userId: string) {
  // Try to find license_id first
  const { data: licenses, error: licenseError } = await supabase
    .from('licenses')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (licenseError) throw licenseError;
  
  if (!licenses) return [];
  
  const { data, error } = await supabase
    .from('billing_periods')
    .select('*')
    .eq('license_id', licenses.id)
    .order('period_start', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

async function fetchUserAuditLogs(userId: string) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}




export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [resettingChecklist, setResettingChecklist] = useState(false);

  const handleRetriggerChecklist = async () => {
    if (!user) return;
    setResettingChecklist(true);
    try {
      const { error } = await supabase.functions.invoke('reset-checklist', {
        body: { user_id: user.id },
      });
      if (error) throw error;
      toast.success('Checklist will be shown to user on their next dashboard visit');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to retrigger checklist');
    } finally {
      setResettingChecklist(false);
    }
  };

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
    }
  }, [isOpen]);

  // Queries for each tab (lazy loaded)
  // Overview tab needs basic stats, so fetch products and sales orders
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['userProducts', user?.id],
    queryFn: () => fetchUserProducts(user!.id),
    enabled: !!user && isOpen && (activeTab === 'products' || activeTab === 'overview'),
  });

  const { data: salesOrders = [], isLoading: loadingSalesOrders } = useQuery({
    queryKey: ['userSalesOrders', user?.id],
    queryFn: () => fetchUserSalesOrders(user!.id),
    enabled: !!user && isOpen && (activeTab === 'sales-orders' || activeTab === 'overview'),
  });







  const { data: billing = [], isLoading: loadingBilling } = useQuery({
    queryKey: ['userBilling', user?.id],
    queryFn: () => fetchUserBilling(user!.id),
    enabled: !!user && isOpen && activeTab === 'billing',
  });

  const { data: auditLogs = [], isLoading: loadingAuditLogs } = useQuery({
    queryKey: ['userAuditLogs', user?.id],
    queryFn: () => fetchUserAuditLogs(user!.id),
    enabled: !!user && isOpen && activeTab === 'activity',
  });





  // Export functions
  const exportData = (data: any[], filename: string) => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${data.length} records`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {user.email}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3 gap-1 mb-4 overflow-x-auto">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
           
          
           
        
      
            
          
            <TabsTrigger value="billing" className="text-xs">
              Billing
              {billing.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {billing.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <p className="text-sm">{user.first_name} {user.last_name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Role:</span>
                      <Badge className="ml-2">{user.role}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Plan:</span>
                      <p className="text-sm">{user.selected_plan || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Organization:</span>
                      <p className="text-sm">{user.organization_name || '—'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Referral Source:</span>
                      <p className="text-sm">{user.referral_source || '—'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <Badge className={`ml-2 ${user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.blocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </div>
                    <div className="pt-3 border-t mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetriggerChecklist}
                        disabled={resettingChecklist}
                        className="text-gray-600"
                      >
                        {resettingChecklist ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <ListChecks className="h-4 w-4 mr-2" />
                        )}
                        Retrigger onboarding checklist
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">
                        User will see the account setup steps again on next login
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Created:</span>
                      <p className="text-sm">{format(new Date(user.created_at), 'PPpp')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Last Login:</span>
                      <p className="text-sm">
                        {user.last_login ? format(new Date(user.last_login), 'PPpp') : 'Never'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                      <p className="text-sm">{format(new Date(user.updated_at), 'PPpp')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                      <div className="text-sm text-gray-600">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{salesOrders.length}</div>
                      <div className="text-sm text-gray-600">Sales Orders</div>
                    </div>
                  
                
                  </div>
                </CardContent>
              </Card>
            </TabsContent>



   

            {/* Billing Tab */}
            <TabsContent value="billing" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Billing Periods ({billing.length})</h3>
                {billing.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(billing, `user_${user.id}_billing`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
              {loadingBilling ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : billing.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No billing records found</div>
              ) : (
                <div className="space-y-2">
                  {billing.map((period: any) => (
                    <Card key={period.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">
                              {format(new Date(period.period_start), 'PP')} - {format(new Date(period.period_end), 'PP')}
                            </h4>
                            <p className="text-sm text-gray-600">Amount: ${period.total_amount || 0}</p>
                            <p className="text-sm text-gray-600">Status: {period.status}</p>
                          </div>
                          <Badge>{period.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Activity Log Tab */}
            <TabsContent value="activity" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Activity Log ({auditLogs.length})</h3>
                {auditLogs.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(auditLogs, `user_${user.id}_activity`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
              {loadingAuditLogs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No activity logs found</div>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map((log: any) => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <div>
                          <p className="text-sm font-medium">{log.action} on {log.table_name}</p>
                          <p className="text-sm text-gray-600">Date: {format(new Date(log.created_at), 'PPpp')}</p>
                          {log.record_id && (
                            <p className="text-sm text-gray-600">Record ID: {log.record_id}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
