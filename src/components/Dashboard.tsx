import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, Folder, Layers, Euro, Plus, ScanLine, 
  FilePlus2, Upload, Filter, Settings2, Clock 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { useBranches } from '@/hooks/useBranches';
import { useProductCount, useBasicDashboardMetrics, useDashboardData } from '@/hooks/useDashboardData';
import { AccountChecklist } from './AccountChecklist';
import { OverLimitBanner } from './OverLimitBanner';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { activeBranch } = useBranches();
  const { productCount, isLoading: productCountLoading } = useProductCount();
  const { data: metrics } = useBasicDashboardMetrics();
  const { data: fullMetrics } = useDashboardData();

  // Checklist view for new accounts
  if (productCountLoading || productCount === 0) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <AccountChecklist onOpenScanner={() => navigate('/dashboard/scan')} />
      </div>
    );
  }

  const safeMetrics = metrics || { totalValue: 0, totalProducts: 0, lowStockCount: 0 };
  const recentActivity = (fullMetrics as any)?.recentActivity || [];
  const recentItems = (fullMetrics as any)?.recentItems || [];
  const lowStockItems = (fullMetrics as any)?.lowStockProducts || [];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-8 min-h-screen">
      <OverLimitBanner />

      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate('/dashboard/products/new')} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/scan')}>
            <ScanLine className="mr-2 h-4 w-4" /> Scan Barcode
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/purchase-orders')}>
            <FilePlus2 className="mr-2 h-4 w-4" /> Purchase Order
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/bom')}>
            <Layers className="mr-2 h-4 w-4" /> BOM
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/categories', { state: { openImport: true } })}>
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
        </div>
      </div>

      {/* 2. Inventory Summary Cards */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard icon={<FileText className="text-blue-500" />} label="Items" value={safeMetrics.totalProducts} />
          <SummaryCard icon={<Folder className="text-amber-500" />} label="Categories" value={(fullMetrics as any)?.categoryDistribution?.length || 0} />
          <SummaryCard icon={<Layers className="text-purple-500" />} label="Total Quantity" value={(fullMetrics as any)?.totalQuantity || 0} />
          <SummaryCard icon={<Euro className="text-blue-400" />} label="Total Value" value={formatPrice(safeMetrics.totalValue)} />
        </div>
      </section>

      {/* 3. Items That Need Restocking */}
      <Card className="border-none shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-emerald-50 rounded">
              <Plus className="h-5 w-5 text-emerald-500 rotate-45" />
            </div>
            <h2 className="font-semibold text-slate-700">Items that need restocking</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">At or Below Min Level</span>
            <Button variant="ghost" size="icon"><Settings2 className="h-4 w-4 text-slate-400" /></Button>
          </div>
        </div>
        <CardContent className="p-0">
          {lowStockItems.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {lowStockItems.map((item: any, i: number) => (
                <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50">
                  <span className="text-sm font-medium text-slate-600">{item.product_name}</span>
                  <span className="text-sm text-blue-500 font-bold">{item.quantity_in_stock} in stock</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No items found." subMessage="Try selecting a different filter." />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. Recent Items */}
        <Card className="border-none shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">Recent Items</h2>
          </div>
          <CardContent className="p-0">
            {recentItems.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentItems.map((item: any) => (
                  <div key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                    <span className="text-sm font-medium text-slate-600">{item.name}</span>
                    <span className="text-sm text-slate-400">{item.quantity_in_stock} in stock</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No recent items." />
            )}
          </CardContent>
        </Card>

        {/* 5. Recent Activity */}
        <Card className="border-none shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-700">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-slate-400 text-xs">All Activity <Settings2 className="ml-2 h-3 w-3" /></Button>
          </div>
          <CardContent className="p-0">
            {recentActivity.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentActivity.map((activity: any, i: number) => (
                  <div key={i} className="p-4 flex gap-3 items-start">
                    <Clock className="h-4 w-4 text-slate-300 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-600">{activity.description}</p>
                      <p className="text-xs text-slate-400">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-slate-400">
                No recent activity. Check filters and try again.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper Components for the Layout
const SummaryCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
      <div className="p-2 bg-slate-50 rounded-full">{icon}</div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</div>
    </CardContent>
  </Card>
);

const EmptyState = ({ message, subMessage }: { message: string; subMessage?: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <FileText className="h-10 w-10 text-slate-200 mb-2" />
    <p className="text-sm text-slate-500 font-medium">{message}</p>
    {subMessage && <p className="text-xs text-slate-400">{subMessage}</p>}
  </div>
);