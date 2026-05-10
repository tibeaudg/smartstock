import { useNavigate } from 'react-router-dom';
import { ClipboardList, ShoppingCart, TrendingUp, BarChart3, Plus, Users, Truck } from 'lucide-react';

interface WorkflowCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  newPath: string;
}

const cards: WorkflowCard[] = [
  {
    id: 'pick-lists',
    title: 'Pick Lists',
    description: 'Easily request items for pickup. Create a list, add items, and assign it to a user for review or pickup. Quantities update automatically after items are picked.',
    icon: ClipboardList,
    path: '/dashboard/pick-lists',
    newPath: '/dashboard/pick-lists/new',
  },
  {
    id: 'sales-orders',
    title: 'Sales Orders',
    description: 'Manage your sales pipeline by creating, tracking, and fulfilling customer orders from a single place.',
    icon: TrendingUp,
    path: '/dashboard/sales-orders',
    newPath: '/dashboard/sales-orders/new',
  },
  {
    id: 'purchase-orders',
    title: 'Purchase Orders',
    description: 'Simplify your procurement process by easily creating, managing, and tracking purchase orders. This is the hub for that.',
    icon: ShoppingCart,
    path: '/dashboard/purchase-orders',
    newPath: '/dashboard/purchase-orders/new',
  },
  {
    id: 'stock-counts',
    title: 'Stock Counts',
    description: 'Count and verify your inventory with ease. Stock counts help you track accurate quantities and keep your records up to date.',
    icon: BarChart3,
    path: '/dashboard/stock-counts',
    newPath: '/dashboard/stock-counts/new',
  },
  {
    id: 'customers',
    title: 'Customers',
    description: 'Manage your customer relationships. Add customers, track their contact details, and keep all your customer information in one place.',
    icon: Users,
    path: '/dashboard/customer-management',
    newPath: '/dashboard/customer-management/new',
  },
  {
    id: 'suppliers',
    title: 'Suppliers',
    description: 'Manage your supplier network. Keep supplier contact details, track relationships, and streamline your procurement contacts.',
    icon: Truck,
    path: '/dashboard/suppliers',
    newPath: '/dashboard/suppliers/new',
  },
];

export default function WorkflowsPage() {
  const navigate = useNavigate();

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
          return (
            <div
              key={card.id}
              onClick={() => navigate(card.path)}
              className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md"
            >
              {/* + New badge */}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); navigate(card.newPath); }}
                className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 px-2 py-0.5 rounded-full hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors"
              >
                <Plus className="w-3 h-3" />
                New
              </button>

              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{card.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
