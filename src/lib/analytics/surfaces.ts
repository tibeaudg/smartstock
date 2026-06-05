/** Maps pathname → canonical surface (snake_case) */
const EXACT_ROUTES: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/dashboard/categories': 'products',
  '/dashboard/products/new': 'product_create',
  '/dashboard/products/import': 'bulk_import',
  '/dashboard/categories-management': 'categories_management',
  '/dashboard/categories-management/new': 'category_create',
  '/dashboard/warehouses': 'warehouses',
  '/dashboard/locations': 'locations',
  '/dashboard/transactions': 'stock_movements',
  '/dashboard/workflows': 'workflows',
  '/dashboard/scan': 'barcode_scanner',
  '/dashboard/scan-flow': 'scan_flow',
  '/dashboard/bom': 'bom',
  '/dashboard/bom/new': 'bom_create',
  '/dashboard/analytics/reports': 'reports',
  '/dashboard/analytics/advanced': 'advanced_reports',
  '/dashboard/analytics/export': 'data_export',
  '/dashboard/settings': 'settings',
  '/dashboard/settings/profile': 'settings_profile',
  '/dashboard/settings/general': 'settings_general',
  '/dashboard/settings/users': 'user_management',
  '/dashboard/settings/integrations': 'integrations',
  '/dashboard/settings/billing': 'billing',
  '/dashboard/settings/branches': 'branch_settings',
  '/dashboard/settings/license': 'license',
  '/dashboard/settings/invoicing': 'invoicing',
  '/dashboard/stock-counts': 'stock_counts',
  '/dashboard/stock-counts/new': 'stock_count_create',
  '/dashboard/pick-lists': 'pick_lists',
  '/dashboard/pick-lists/new': 'pick_list_create',
  '/dashboard/sales-orders': 'sales_orders',
  '/dashboard/sales-orders/new': 'sales_order_create',
  '/dashboard/purchase-orders': 'purchase_orders',
  '/dashboard/purchase-orders/new': 'purchase_order_create',
  '/dashboard/customer-management': 'customers',
  '/dashboard/customer-management/new': 'customer_create',
  '/dashboard/suppliers': 'suppliers',
  '/dashboard/suppliers/new': 'supplier_create',
  '/admin': 'admin',
  '/admin/users': 'admin_users',
  '/admin/integrations': 'admin_integrations',
  '/auth': 'auth',
};

const PATTERNS: Array<{ test: RegExp; surface: string }> = [
  { test: /^\/dashboard\/products\/[^/]+$/, surface: 'product_detail' },
  { test: /^\/dashboard\/sales-orders\/[^/]+/, surface: 'sales_order_detail' },
  { test: /^\/dashboard\/purchase-orders\/[^/]+/, surface: 'purchase_order_detail' },
  { test: /^\/dashboard\/stock-counts\/[^/]+/, surface: 'stock_count_detail' },
  { test: /^\/dashboard\/pick-lists\/[^/]+/, surface: 'pick_list_detail' },
  { test: /^\/dashboard\/customer-management\/[^/]+/, surface: 'customer_detail' },
  { test: /^\/dashboard\/suppliers\/[^/]+/, surface: 'supplier_detail' },
  { test: /^\/dashboard\/bom\/edit\//, surface: 'bom_edit' },
  { test: /^\/dashboard\/settings\//, surface: 'settings' },
  { test: /^\/admin\//, surface: 'admin' },
  { test: /^\/dashboard\//, surface: 'dashboard' },
];

export function surfaceFromPathname(pathname: string): string {
  if (EXACT_ROUTES[pathname]) return EXACT_ROUTES[pathname];
  for (const { test, surface } of PATTERNS) {
    if (test.test(pathname)) return surface;
  }
  return pathname.replace(/^\//, '').replace(/\//g, '_') || 'unknown';
}
