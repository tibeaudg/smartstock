import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, ShoppingCart, Layers, Wrench, TrendingUp, Building2, Users, Tag, Truck, FileText, Activity, Download } from 'lucide-react';
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

async function fetchUserBOMs(userId: string) {
  // Get BOMs for user's products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .eq('user_id', userId);
  
  if (productsError) throw productsError;
  if (!products || products.length === 0) return [];
  
  const productIds = products.map(p => p.id);
  const { data, error } = await supabase
    .from('product_bom')
    .select(`
      *,
      parent_product:products!product_bom_parent_product_id_fkey(name),
      component_product:products!product_bom_component_product_id_fkey(name)
    `)
    .in('parent_product_id', productIds)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

async function fetchUserWorkOrders(userId: string) {
  const { data, error } = await supabase
    .from('work_orders')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchUserStockTransactions(userId: string) {
  const { data, error } = await supabase
    .from('stock_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1000); // Limit to prevent performance issues
  if (error) throw error;
  return data || [];
}

async function fetchUserBranches(userId: string) {
  const result = await (supabase.rpc as any)('get_admin_branches', {
    admin_id: userId
  });
  if (result.error) throw result.error;
  return result.data || [];
}

async function fetchUserCustomers(userId: string) {
  // Extract unique customers from sales orders
  const { data, error } = await supabase
    .from('sales_orders')
    .select('customer_id, customer_name')
    .eq('user_id', userId)
    .not('customer_name', 'is', null);
  
  if (error) throw error;
  
  // Group by customer and count orders
  const customerMap = new Map<string, { name: string; orderCount: number }>();
  (data || []).forEach(order => {
    if (order.customer_name) {
      const key = order.customer_id || order.customer_name;
      const existing = customerMap.get(key) || { name: order.customer_name, orderCount: 0 };
      customerMap.set(key, { ...existing, orderCount: existing.orderCount + 1 });
    }
  });
  
  return Array.from(customerMap.values());
}

async function fetchUserCategories(userId: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchUserSuppliers(userId: string) {
  const { data, error } = await supabase
    .from('suppliers')
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

  const { data: branches = [], isLoading: loadingBranches } = useQuery({
    queryKey: ['userBranches', user?.id],
    queryFn: () => fetchUserBranches(user!.id),
    enabled: !!user && isOpen && (activeTab === 'branches' || activeTab === 'overview'),
  });

  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ['userCustomers', user?.id],
    queryFn: () => fetchUserCustomers(user!.id),
    enabled: !!user && isOpen && (activeTab === 'customers' || activeTab === 'overview'),
  });

  const { data: boms = [], isLoading: loadingBOMs } = useQuery({
    queryKey: ['userBOMs', user?.id],
    queryFn: () => fetchUserBOMs(user!.id),
    enabled: !!user && isOpen && activeTab === 'boms',
  });

  const { data: workOrders = [], isLoading: loadingWorkOrders } = useQuery({
    queryKey: ['userWorkOrders', user?.id],
    queryFn: () => fetchUserWorkOrders(user!.id),
    enabled: !!user && isOpen && activeTab === 'work-orders',
  });

  const { data: stockTransactions = [], isLoading: loadingStockTransactions } = useQuery({
    queryKey: ['userStockTransactions', user?.id],
    queryFn: () => fetchUserStockTransactions(user!.id),
    enabled: !!user && isOpen && activeTab === 'stock-transactions',
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['userCategories', user?.id],
    queryFn: () => fetchUserCategories(user!.id),
    enabled: !!user && isOpen && activeTab === 'categories-suppliers',
  });

  const { data: suppliers = [], isLoading: loadingSuppliers } = useQuery({
    queryKey: ['userSuppliers', user?.id],
    queryFn: () => fetchUserSuppliers(user!.id),
    enabled: !!user && isOpen && activeTab === 'categories-suppliers',
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
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-11 gap-1 mb-4 overflow-x-auto">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="products" className="text-xs">
              Products
              {products.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {products.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sales-orders" className="text-xs">
              Orders
              {salesOrders.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {salesOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="boms" className="text-xs">
              BOMs
              {boms.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {boms.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="work-orders" className="text-xs">
              Work Orders
              {workOrders.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {workOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="stock-transactions" className="text-xs">Stock</TabsTrigger>
            <TabsTrigger value="branches" className="text-xs">
              Branches
              {branches.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {branches.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="customers" className="text-xs">
              Customers
              {customers.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {customers.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="categories-suppliers" className="text-xs">Categories</TabsTrigger>
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
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <Badge className={`ml-2 ${user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.blocked ? 'Blocked' : 'Active'}
                      </Badge>
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
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{branches.length}</div>
                      <div className="text-sm text-gray-600">Branches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{customers.length}</div>
                      <div className="text-sm text-gray-600">Customers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Products ({products.length})</h3>
                {products.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(products, `user_${user.id}_products`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
              {loadingProducts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No products found</div>
              ) : (
                <div className="space-y-2">
                  {products.map((product: any) => (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-600">Stock: {product.current_stock || 0}</p>
                            <p className="text-sm text-gray-600">Status: {product.status}</p>
                          </div>
                          <Badge>{product.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Sales Orders Tab */}
            <TabsContent value="sales-orders" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Sales Orders ({salesOrders.length})</h3>
                {salesOrders.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(salesOrders, `user_${user.id}_sales_orders`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
              {loadingSalesOrders ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : salesOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No sales orders found</div>
              ) : (
                <div className="space-y-2">
                  {salesOrders.map((order: any) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{order.so_number}</h4>
                            <p className="text-sm text-gray-600">Customer: {order.customer_name || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Amount: ${order.total_amount || 0}</p>
                            <p className="text-sm text-gray-600">Date: {format(new Date(order.order_date), 'PP')}</p>
                          </div>
                          <Badge>{order.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* BOMs Tab */}
            <TabsContent value="boms" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Bill of Materials ({boms.length})</h3>
                {boms.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(boms, `user_${user.id}_boms`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
              {loadingBOMs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : boms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No BOMs found</div>
              ) : (
                <div className="space-y-2">
                  {boms.map((bom: any) => (
                    <Card key={bom.id}>
                      <CardContent className="p-4">
                        <div>
                          <h4 className="font-semibold">Parent: {bom.parent_product?.name || 'N/A'}</h4>
                          <p className="text-sm text-gray-600">Component: {bom.component_product?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Quantity: {bom.quantity_required}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Work Orders Tab */}
            <TabsContent value="work-orders" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Work Orders ({workOrders.length})</h3>
                {workOrders.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(workOrders, `user_${user.id}_work_orders`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
              {loadingWorkOrders ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : workOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No work orders found</div>
              ) : (
                <div className="space-y-2">
                  {workOrders.map((wo: any) => (
                    <Card key={wo.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{wo.wo_number}</h4>
                            <p className="text-sm text-gray-600">Status: {wo.status}</p>
                            <p className="text-sm text-gray-600">Quantity: {wo.quantity_to_build}</p>
                          </div>
                          <Badge>{wo.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Stock Transactions Tab */}
            <TabsContent value="stock-transactions" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Stock Transactions ({stockTransactions.length})</h3>
                {stockTransactions.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(stockTransactions, `user_${user.id}_stock_transactions`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
              {loadingStockTransactions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : stockTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No stock transactions found</div>
              ) : (
                <div className="space-y-2">
                  {stockTransactions.slice(0, 100).map((tx: any) => (
                    <Card key={tx.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">Type: {tx.transaction_type}</p>
                            <p className="text-sm text-gray-600">Quantity: {tx.quantity}</p>
                            <p className="text-sm text-gray-600">Reason: {tx.reason || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Date: {format(new Date(tx.created_at), 'PPpp')}</p>
                          </div>
                          <Badge>{tx.transaction_type}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stockTransactions.length > 100 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      Showing first 100 of {stockTransactions.length} transactions
                    </p>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Branches Tab */}
            <TabsContent value="branches" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Branches ({branches.length})</h3>
                {branches.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(branches, `user_${user.id}_branches`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
              {loadingBranches ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : branches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No branches found</div>
              ) : (
                <div className="space-y-2">
                  {branches.map((branch: any) => (
                    <Card key={branch.branch_id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{branch.branch_name}</h4>
                            <p className="text-sm text-gray-600">Users: {branch.user_count}</p>
                            <p className="text-sm text-gray-600">Main: {branch.is_main ? 'Yes' : 'No'}</p>
                          </div>
                          {branch.is_main && <Badge>Main</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Customers ({customers.length})</h3>
                {customers.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(customers, `user_${user.id}_customers`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
              {loadingCustomers ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No customers found</div>
              ) : (
                <div className="space-y-2">
                  {customers.map((customer: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{customer.name}</h4>
                            <p className="text-sm text-gray-600">Orders: {customer.orderCount}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Categories & Suppliers Tab */}
            <TabsContent value="categories-suppliers" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Categories ({categories.length})</h3>
                    {categories.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportData(categories, `user_${user.id}_categories`)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    )}
                  </div>
                  {loadingCategories ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No categories found</div>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((cat: any) => (
                        <Card key={cat.id}>
                          <CardContent className="p-4">
                            <h4 className="font-semibold">{cat.name}</h4>
                            {cat.description && (
                              <p className="text-sm text-gray-600">{cat.description}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Suppliers ({suppliers.length})</h3>
                    {suppliers.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportData(suppliers, `user_${user.id}_suppliers`)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    )}
                  </div>
                  {loadingSuppliers ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : suppliers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No suppliers found</div>
                  ) : (
                    <div className="space-y-2">
                      {suppliers.map((supplier: any) => (
                        <Card key={supplier.id}>
                          <CardContent className="p-4">
                            <h4 className="font-semibold">{supplier.name}</h4>
                            {supplier.contact_info && (
                              <p className="text-sm text-gray-600">{supplier.contact_info}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
