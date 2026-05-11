import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ShoppingCart, TrendingUp, BarChart3, Plus, Users, Truck, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WorkflowCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  newPath: string;
  requiredFeature?: 'orders' | 'contacts';
}

const cards: WorkflowCard[] = [
  {
    id: 'pick-lists',
    title: 'Pick Lists',
    description: 'Easily request items for pickup. Create a list, add items, and assign it to a user for review or pickup. Quantities update automatically after items are picked.',
    icon: ClipboardList,
    path: '/dashboard/pick-lists',
    newPath: '/dashboard/pick-lists/new',
    requiredFeature: 'orders',
  },
  {
    id: 'sales-orders',
    title: 'Sales Orders',
    description: 'Manage your sales pipeline by creating, tracking, and fulfilling customer orders from a single place.',
    icon: TrendingUp,
    path: '/dashboard/sales-orders',
    newPath: '/dashboard/sales-orders/new',
    requiredFeature: 'orders',
  },
  {
    id: 'purchase-orders',
    title: 'Purchase Orders',
    description: 'Simplify your procurement process by easily creating, managing, and tracking purchase orders. This is the hub for that.',
    icon: ShoppingCart,
    path: '/dashboard/purchase-orders',
    newPath: '/dashboard/purchase-orders/new',
    requiredFeature: 'orders',
  },
  {
    id: 'stock-counts',
    title: 'Stock Counts',
    description: 'Count and verify your inventory with ease. Stock counts help you track accurate quantities and keep your records up to date.',
    icon: BarChart3,
    path: '/dashboard/stock-counts',
    newPath: '/dashboard/stock-counts/new',
    requiredFeature: 'orders',
  },
  {
    id: 'customers',
    title: 'Customers',
    description: 'Manage your customer relationships. Add customers, track their contact details, and keep all your customer information in one place.',
    icon: Users,
    path: '/dashboard/customer-management',
    newPath: '/dashboard/customer-management/new',
    requiredFeature: 'contacts',
  },
  {
    id: 'suppliers',
    title: 'Suppliers',
    description: 'Manage your supplier network. Keep supplier contact details, track relationships, and streamline your procurement contacts.',
    icon: Truck,
    path: '/dashboard/suppliers',
    newPath: '/dashboard/suppliers/new',
    requiredFeature: 'contacts',
  },
];

const featureLabels: Record<string, string> = {
  orders: 'Orders',
  contacts: 'Contacts',
};

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const { canUseFeature } = useSubscription();
  const [lockedFeature, setLockedFeature] = useState<'orders' | 'contacts' | null>(null);

  const handleUpgrade = async () => {
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
    if (!paymentLink) {
      window.location.href = '/dashboard/settings/billing';
      return;
    }
    const { data: { session } } = await import('@/integrations/supabase/client').then(
      (m) => m.supabase.auth.getSession()
    );
    if (!session?.user) {
      window.location.href = '/auth';
      return;
    }
    const params = new URLSearchParams();
    if (session.user.email) params.set('prefilled_email', session.user.email);
    params.set('client_reference_id', session.user.id);
    const url = `${paymentLink}${paymentLink.includes('?') ? '&' : '?'}${params.toString()}`;
    window.location.href = url;
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Workflows</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Workflows are actions you can take on your inventory that interact with quantities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const isLocked = card.requiredFeature ? !canUseFeature(card.requiredFeature) : false;

          return (
            <div
              key={card.id}
              onClick={() => {
                if (isLocked) {
                  setLockedFeature(card.requiredFeature!);
                } else {
                  navigate(card.path);
                }
              }}
              className={`relative bg-white dark:bg-gray-900 border rounded-xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-200 ${
                isLocked
                  ? 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                  : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
              }`}
            >
              {!isLocked && (
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); navigate(card.newPath); }}
                  className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 px-2 py-0.5 rounded-full hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  New
                </button>
              )}

              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                {isLocked
                  ? <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  : <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                }
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{card.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={lockedFeature !== null} onOpenChange={(open) => { if (!open) setLockedFeature(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-3">
              <Lock className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            </div>
            <DialogTitle className="text-center">
              Upgrade to unlock
            </DialogTitle>
            <DialogDescription className="text-center">
              Start your 14-day free trial. No credit card required.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            <Button onClick={handleUpgrade} className="w-full">
              Start free trial
            </Button>
            <Button variant="ghost" onClick={() => setLockedFeature(null)} className="w-full">
              Maybe later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
