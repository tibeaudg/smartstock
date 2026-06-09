import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText, Plus, ScanLine, Layers,
  Upload, Clock, Package,
  TrendingDown, AlertTriangle, CheckCircle2,
  ArrowRight, RefreshCw,
  Boxes, DollarSign, Info,
  CircleCheck, CircleAlert,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';
import {
  useProductCount,
  useBasicDashboardMetrics,
  useDashboardData,
} from '@/hooks/useDashboardData';
import type { HealthBreakdown } from '@/lib/inventory/dashboardMetrics';
import { AccountChecklist } from './AccountChecklist';
import { OverLimitBanner } from './OverLimitBanner';
import { useAppEventTracker } from '@/hooks/useAppEventTracker';
import { useAddProductModal } from '@/hooks/AddProductModalContext';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface LowStockItem {
  product_name: string;
  quantity_in_stock: number;
  min_stock_level?: number;
  category?: string;
  id?: string;
}

interface RecentItem {
  id: string;
  name: string;
  quantity_in_stock: number;
  category?: string;
  updated_at?: string;
  sku?: string;
}

interface ActivityEntry {
  description: string;
  timestamp: string;
  type?: 'stock_in' | 'stock_out' | 'edit' | 'create' | 'delete';
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const getStockStatus = (qty: number, min?: number) => {
  if (qty === 0) return 'out';
  if (min && qty <= min) return 'critical';
  if (min && qty <= min * 2) return 'low';
  return 'ok';
};

const stockStatusConfig = {
  out: {
    label: 'Out of stock',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    rowClass: 'bg-red-50/40',
    dot: 'bg-red-500',
  },
  critical: {
    label: 'Critical',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    rowClass: 'bg-orange-50/30',
    dot: 'bg-orange-500',
  },
  low: {
    label: 'Low',
    badgeClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    rowClass: 'bg-yellow-50/20',
    dot: 'bg-yellow-500',
  },
  ok: {
    label: 'OK',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rowClass: '',
    dot: 'bg-emerald-500',
  },
};

const activityTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  stock_in:  { icon: TrendingDown,   color: 'text-emerald-500' },
  stock_out: { icon: TrendingDown,   color: 'text-rose-500' },
  create:    { icon: Plus,           color: 'text-blue-500' },
  edit:      { icon: RefreshCw,      color: 'text-slate-400' },
  delete:    { icon: AlertTriangle,  color: 'text-red-400' },
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

const QUICK_ACTIONS = [
  {
    icon: Plus,
    label: 'Add Product',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    onClickKey: 'add' as const,
  },
  {
    icon: ScanLine,
    label: 'Scan Barcode',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    onClickKey: 'scan' as const,
  },
  {
    icon: Layers,
    label: 'BOM',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    onClickKey: 'bom' as const,
  },
  {
    icon: Upload,
    label: 'Import CSV',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    onClickKey: 'import' as const,
  },
];

/** Consolidated quick-actions panel */
const QuickActionsPanel = ({
  onAction,
}: {
  onAction: (key: 'add' | 'scan' | 'bom' | 'import') => void;
}) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-sm">
    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
      Quick Actions
    </p>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {QUICK_ACTIONS.map(({ icon: Icon, label, iconColor, iconBg, onClickKey }) => (
        <button
          key={onClickKey}
          type="button"
          onClick={() => onAction(onClickKey)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
        >
          <span className={cn('rounded-md p-1.5', iconBg)}>
            <Icon className={cn('h-4 w-4', iconColor)} />
          </span>
          {label}
        </button>
      ))}
    </div>
  </div>
);

/** Compact clickable KPI card */
const KpiCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  href,
  tooltip,
  accent = 'blue',
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  subtext?: string;
  href?: string;
  tooltip?: string;
  accent?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}) => {
  const accentStyles = {
    blue: { icon: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-200' },
    green: { icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'hover:border-emerald-200' },
    orange: { icon: 'text-orange-600', bg: 'bg-orange-50', border: 'hover:border-orange-200' },
    purple: { icon: 'text-violet-600', bg: 'bg-violet-50', border: 'hover:border-violet-200' },
    red: { icon: 'text-red-600', bg: 'bg-red-50', border: 'hover:border-red-200' },
  }[accent];

  const inner = (
    <div
      className={cn(
        'group relative flex h-full flex-col rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm transition',
        href && 'cursor-pointer hover:shadow-md',
        accentStyles.border
      )}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={cn('rounded-md p-1', accentStyles.bg)}>
            <Icon className={cn('h-3.5 w-3.5', accentStyles.icon)} />
          </span>
          <span className="text-xs font-medium text-slate-500">{label}</span>
        </div>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-slate-300 transition hover:text-slate-400"
                  aria-label={`More about ${label}`}
                  onClick={(e) => e.preventDefault()}
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-sm leading-relaxed">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p className="text-2xl font-bold tabular-nums text-slate-900">{value}</p>
      {subtext && (
        <p className="mt-0.5 text-xs text-slate-400">{subtext}</p>
      )}
    </div>
  );

  return href ? <Link to={href} className="block h-full">{inner}</Link> : inner;
};

/** Inventory health summary — first KPI card */
const InventoryHealthCard = ({
  status,
  statusLabel,
  lowStock,
  outOfStock,
  reorderNeeded,
  href,
}: {
  status: 'healthy' | 'warning' | 'critical';
  statusLabel: string;
  lowStock: number;
  outOfStock: number;
  reorderNeeded: number;
  href: string;
}) => {
  const statusStyles = {
    healthy: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    warning: { dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
    critical: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  }[status];

  return (
    <Link to={href} className="block h-full">
      <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm transition hover:border-slate-200 hover:shadow-md">
        <p className="mb-1 text-xs font-medium text-slate-500">Inventory Health</p>
        <div className={cn('mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold', statusStyles.bg, statusStyles.text)}>
          <span className={cn('h-2 w-2 rounded-full', statusStyles.dot)} />
          {statusLabel}
        </div>
        <div className="mt-auto space-y-0.5 text-xs text-slate-500">
          <p><span className="font-semibold text-orange-600 tabular-nums">{lowStock}</span> Low Stock</p>
          <p><span className="font-semibold text-red-600 tabular-nums">{outOfStock}</span> Out of Stock</p>
          <p><span className="font-semibold text-slate-700 tabular-nums">{reorderNeeded}</span> Reorder Needed</p>
        </div>
      </div>
    </Link>
  );
};

/** Setup guidance for users with incomplete inventory data */
const GettingStartedPanel = ({
  items,
}: {
  items: Array<{ label: string; done: boolean; hint?: string }>;
}) => {
  const pending = items.filter((i) => !i.done);
  if (pending.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800">
        Getting Started
      </p>
      <ul className="space-y-1">
        {items.map(({ label, done, hint }) => (
          <li key={label} className="flex items-start gap-2 text-sm">
            {done ? (
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            )}
            <span className={done ? 'text-slate-500 line-through' : 'text-slate-700'}>
              {label}
              {!done && hint && (
                <span className="block text-xs font-normal text-slate-500">{hint}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Single row in the restock table */
const RestockRow = ({
  item,
  onRestock,
}: {
  item: LowStockItem;
  onRestock?: (item: LowStockItem) => void;
}) => {
  const status = getStockStatus(item.quantity_in_stock, item.min_stock_level);
  const cfg = stockStatusConfig[status];

  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition ${cfg.rowClass}`}>
      {/* Status dot */}
      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${cfg.dot}`} />

      {/* Name + category */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{item.product_name}</p>
        {item.category && (
          <p className="text-xs text-slate-400 truncate">{item.category}</p>
        )}
      </div>

      {/* Qty vs min */}
      <div className="text-right flex-shrink-0">
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cfg.badgeClass}`}>
          {item.quantity_in_stock} in stock
          {item.min_stock_level !== undefined && (
            <span className="ml-1 opacity-60">/ {item.min_stock_level} min</span>
          )}
        </span>
      </div>

      {/* Quick restock CTA */}
      {onRestock && (
        <button
          onClick={() => onRestock(item)}
          className="flex-shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
        >
          Restock
        </button>
      )}
    </div>
  );
};

/** Empty state with icon + optional action */
const EmptyState = ({
  message,
  subMessage,
  icon: Icon = FileText,
  action,
}: {
  message: string;
  subMessage?: string;
  icon?: React.ElementType;
  action?: { label: string; onClick: () => void };
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center px-6">
    <div className="mb-3 rounded-xl bg-slate-50 p-4">
      <Icon className="h-8 w-8 text-slate-300" />
    </div>
    <p className="text-sm font-medium text-slate-600">{message}</p>
    {subMessage && <p className="mt-1 text-xs text-slate-400">{subMessage}</p>}
    {action && (
      <button
        onClick={action.onClick}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
      >
        {action.label}
      </button>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
export const Dashboard = () => {
  const navigate = useNavigate();
  const { openAddProduct } = useAddProductModal();
  const { formatPrice } = useCurrency();
  const { track } = useAppEventTracker();
  const { productCount, isLoading: productCountLoading } = useProductCount();
  const { data: metrics } = useBasicDashboardMetrics();
  const { data: fullMetrics } = useDashboardData();

  const emptyHealthBreakdown: HealthBreakdown = { out: 0, critical: 0, low: 0, healthy: 0 };

  // Prefer fullMetrics when loaded; fall back to lightweight metrics while fetching
  const dashboardMetrics = useMemo(() => {
    const base = metrics ?? {
      totalValue: 0,
      totalProducts: 0,
      totalQuantity: 0,
      lowStockCount: 0,
      emptyStockCount: 0,
      itemsWithoutCostCount: 0,
      productsAddedThisWeek: 0,
      healthBreakdown: emptyHealthBreakdown,
    };

    return {
      totalValue: fullMetrics?.totalValue ?? base.totalValue,
      totalProducts: fullMetrics?.totalProducts ?? base.totalProducts,
      totalQuantity: fullMetrics?.totalQuantity ?? base.totalQuantity,
      lowStockCount: fullMetrics?.lowStockCount ?? base.lowStockCount,
      emptyStockCount: fullMetrics?.emptyStockCount ?? base.emptyStockCount,
      itemsWithoutCostCount: fullMetrics?.itemsWithoutCostCount ?? base.itemsWithoutCostCount,
      productsAddedThisWeek: fullMetrics?.productsAddedThisWeek ?? base.productsAddedThisWeek,
      categoryCount: fullMetrics?.categoryCount ?? 0,
      healthBreakdown: fullMetrics?.healthBreakdown ?? base.healthBreakdown ?? emptyHealthBreakdown,
    };
  }, [metrics, fullMetrics]);

  const recentActivity: ActivityEntry[] = fullMetrics?.recentActivity ?? [];
  const recentItems: RecentItem[] = fullMetrics?.recentItems ?? [];
  const lowStockItems: LowStockItem[] = fullMetrics?.lowStockProducts ?? [];

  // All useMemo/useCallback hooks MUST come before any conditional return
  const healthBreakdown = dashboardMetrics.healthBreakdown;

  const sortedRestockItems = useMemo(
    () => [...lowStockItems].sort((a, b) => a.quantity_in_stock - b.quantity_in_stock),
    [lowStockItems]
  );


  const handleRestock = (item: LowStockItem) => {
    track('restock_initiated', item.product_name, { source: 'dashboard' });
    navigate('/dashboard/products', { state: { restockProduct: item.product_name } });
  };

  const healthStatus = useMemo(() => {
    if (healthBreakdown.out > 0) return { status: 'critical' as const, label: 'Needs attention' };
    if (healthBreakdown.critical > 0 || healthBreakdown.low > 0) {
      return { status: 'warning' as const, label: 'Monitor stock' };
    }
    return { status: 'healthy' as const, label: 'Healthy' };
  }, [healthBreakdown]);

  const gettingStartedItems = useMemo(() => {
    const { categoryCount, totalProducts, totalQuantity, itemsWithoutCostCount } = dashboardMetrics;
    const hasCategories = categoryCount > 0;
    const hasProducts = totalProducts > 0;
    const hasStockRecorded = totalQuantity > 0;
    const hasStockWithCostData =
      hasStockRecorded && itemsWithoutCostCount === 0;

    return [
      { label: 'Create category', done: hasCategories },
      { label: 'Add products', done: hasProducts },
      {
        label: 'Record stock levels',
        done: hasStockRecorded,
        hint: 'Receive stock or adjust quantities so on-hand counts are accurate.',
      },
      {
        label: 'Set product costs',
        done: hasStockWithCostData,
        hint:
          itemsWithoutCostCount > 0
            ? `${itemsWithoutCostCount} item${itemsWithoutCostCount === 1 ? '' : 's'} missing purchase costs — add costs when receiving stock.`
            : 'Add purchase costs to calculate inventory value.',
      },
    ];
  }, [dashboardMetrics]);

  const handleQuickAction = (key: 'add' | 'scan' | 'bom' | 'import') => {
    switch (key) {
      case 'add':
        track('product_add_method_selected', 'Add Manually', { method: 'manual' });
        openAddProduct({ mode: 'full' });
        break;
      case 'scan':
        track('product_add_method_selected', 'Scan Barcode', { method: 'scan' });
        navigate('/dashboard/scan');
        break;
      case 'bom':
        navigate('/dashboard/bom');
        break;
      case 'import':
        track('product_add_method_selected', 'Import CSV', { method: 'import' });
        navigate('/dashboard/categories', { state: { openImport: true } });
        break;
    }
  };

  const skuSubtext =
    dashboardMetrics.productsAddedThisWeek > 0
      ? `+${dashboardMetrics.productsAddedThisWeek} this week`
      : undefined;

  /* New user onboarding checklist — early return AFTER all hooks */
  if (productCountLoading || productCount === 0) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <AccountChecklist onOpenScanner={() => navigate('/dashboard/scan')} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-[1600px]">
      <OverLimitBanner />



      {/* ── Quick Actions + KPI row ── */}
      <div className="space-y-3">
        <QuickActionsPanel onAction={handleQuickAction} />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <InventoryHealthCard
            status={healthStatus.status}
            statusLabel={healthStatus.label}
            lowStock={healthBreakdown.critical + healthBreakdown.low}
            outOfStock={healthBreakdown.out}
            reorderNeeded={dashboardMetrics.lowStockCount}
            href="/dashboard/categories?stockStatus=low-stock"
          />
          <KpiCard
            icon={Package}
            label="SKUs"
            value={dashboardMetrics.totalProducts}
            subtext={skuSubtext}
            href="/dashboard/categories"
            accent="blue"
            tooltip="Distinct products tracked in your inventory."
          />
          <KpiCard
            icon={Boxes}
            label="Quantity"
            value={`${dashboardMetrics.totalQuantity.toLocaleString()} units`}
            href="/dashboard/analytics/reports"
            accent="blue"
            tooltip="Sum of all units across every product and location."
          />
          <KpiCard
            icon={DollarSign}
            label="Value"
            value={formatPrice(dashboardMetrics.totalValue)}
            subtext={
              dashboardMetrics.itemsWithoutCostCount > 0
                ? `${dashboardMetrics.itemsWithoutCostCount} missing costs`
                : undefined
            }
            href="/dashboard/analytics/advanced"
            accent={dashboardMetrics.totalValue > 0 ? 'green' : 'orange'}
            tooltip="Total inventory value (cost × quantity). Products without a purchase cost contribute $0; add costs when receiving stock or on the product record."
          />
        </div>

        <GettingStartedPanel items={gettingStartedItems} />
      </div>

      {/* ── Restock alert ── */}
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            {lowStockItems.length > 0 ? (
              <div className="rounded-lg bg-red-50 p-1.5">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            ) : (
              <div className="rounded-lg bg-emerald-50 p-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
            )}
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Needs restocking</h2>
              {lowStockItems.length > 0 && (
                <p className="text-xs text-slate-400">
                  {healthBreakdown.out} out of stock · {healthBreakdown.critical + healthBreakdown.low} low
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lowStockItems.length > 0 && (
              <Link
                to="/dashboard/products?filter=low_stock"
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>

        <CardContent className="p-0">
          {sortedRestockItems.length > 0 ? (
            <>
              {/* Column headers */}
              <div className="flex items-center gap-3 border-b border-slate-50 px-5 py-2">
                <span className="w-2" />
                <span className="flex-1 text-xs font-medium uppercase tracking-wide text-slate-400">Product</span>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Stock level</span>
                <span className="w-16" />
              </div>
              <div className="divide-y divide-slate-50">
                {sortedRestockItems.slice(0, 8).map((item, i) => (
                  <RestockRow key={i} item={item} onRestock={handleRestock} />
                ))}
              </div>
              {sortedRestockItems.length > 8 && (
                <div className="border-t border-slate-100 px-5 py-3">
                  <Link
                    to="/dashboard/products?filter=low_stock"
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    + {sortedRestockItems.length - 8} more items need attention
                  </Link>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              message="All items are well stocked."
              subMessage="You'll see alerts here when items fall below their minimum level."
            />
          )}
        </CardContent>
      </Card>

      {/* ── Recent Items + Recent Activity ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Recent Items */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-800">Recently updated</h2>
            <Link
              to="/dashboard/products"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
            >
              All products <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <CardContent className="p-0">
            {recentItems.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentItems.map((item) => {
                  const status = getStockStatus(item.quantity_in_stock);
                  const cfg = stockStatusConfig[status];
                  return (
                    <Link
                      key={item.id}
                      to={`/dashboard/products/${item.id}`}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition"
                    >
                      {/* Status dot */}
                      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {item.sku && <span className="font-mono">#{item.sku} · </span>}
                          {item.category || 'Uncategorised'}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cfg.badgeClass}`}>
                          {item.quantity_in_stock}
                        </span>
                        {item.updated_at && (
                          <p className="mt-0.5 text-xs text-slate-300">
                            {new Date(item.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                message="No products yet."
                subMessage="Add your first product to get started."
                action={{ label: 'Add product', onClick: () => openAddProduct({ mode: 'full' }) }}
              />
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-800">Recent activity</h2>
            <Link
              to="/dashboard/activity"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
            >
              Full log <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <CardContent className="p-0">
            {recentActivity.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentActivity.map((activity, i) => {
                  const typeCfg = activityTypeConfig[activity.type ?? 'edit'] ?? activityTypeConfig.edit;
                  const Icon = typeCfg.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                      <div className="mt-0.5 rounded-lg bg-slate-50 p-1.5 flex-shrink-0">
                        <Icon className={`h-3.5 w-3.5 ${typeCfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 leading-snug">{activity.description}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{activity.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Clock}
                message="No activity yet."
                subMessage="Stock changes and edits will appear here."
              />
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;