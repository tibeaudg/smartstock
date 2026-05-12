import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

const PAGE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/products': 'Products',
  '/dashboard/products/add': 'Add Product',
  '/dashboard/categories': 'Categories',
  '/dashboard/stock-movements': 'Stock Movements',
  '/dashboard/sales-orders': 'Sales Orders',
  '/dashboard/sales-orders/create': 'Create Sales Order',
  '/dashboard/purchase-orders': 'Purchase Orders',
  '/dashboard/purchase-orders/create': 'Create Purchase Order',
  '/dashboard/customers': 'Customers',
  '/dashboard/customers/create': 'Create Customer',
  '/dashboard/suppliers': 'Suppliers',
  '/dashboard/suppliers/create': 'Create Supplier',
  '/dashboard/settings': 'Settings',
  '/dashboard/settings/profile': 'Profile Settings',
  '/dashboard/settings/users': 'User Management',
  '/dashboard/settings/billing': 'Billing',
  '/dashboard/settings/branches': 'Branches',
  '/dashboard/settings/general': 'General Settings',
  '/dashboard/settings/license': 'License',
  '/dashboard/settings/invoicing': 'Invoicing',
  '/dashboard/workflows': 'Workflows',
  '/dashboard/reporting': 'Reports',
  '/dashboard/warehouses': 'Warehouses',
  '/dashboard/stock-counts': 'Stock Counts',
  '/dashboard/pick-lists': 'Pick Lists',
  '/dashboard/scan': 'Barcode Scanner',
  '/dashboard/bom': 'Bill of Materials',
  '/dashboard/bulk-import': 'Bulk Import',
};

function getPageLabel(pathname: string): string {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  if (pathname.match(/^\/dashboard\/products\/[^/]+$/)) return 'Product Detail';
  if (pathname.match(/^\/dashboard\/customers\/[^/]+$/)) return 'Customer Detail';
  if (pathname.match(/^\/dashboard\/sales-orders\/[^/]+$/)) return 'Sales Order Detail';
  if (pathname.match(/^\/dashboard\/purchase-orders\/[^/]+$/)) return 'Purchase Order Detail';
  if (pathname.match(/^\/dashboard\/stock-counts\/[^/]+$/)) return 'Stock Count Detail';
  if (pathname.match(/^\/dashboard\/pick-lists\/[^/]+$/)) return 'Pick List Detail';
  if (pathname.match(/^\/dashboard\/suppliers\/[^/]+$/)) return 'Supplier Detail';
  if (pathname.startsWith('/dashboard/settings/')) return 'Settings';
  if (pathname.startsWith('/dashboard/')) return 'Dashboard';
  return pathname;
}

export function usePageViewLogger() {
  const location = useLocation();
  const { user } = useAuth();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const path = location.pathname;
    if (path === lastPathRef.current) return;
    if (!path.startsWith('/dashboard') && !path.startsWith('/admin')) return;
    lastPathRef.current = path;

    const label = getPageLabel(path);
    // Fire and forget — never block the UI
    supabase.from('app_events' as any).insert({
      user_id: user.id,
      event_type: 'page_view',
      page: path,
      label,
    }).then(() => {});
  }, [location.pathname, user?.id]);
}
