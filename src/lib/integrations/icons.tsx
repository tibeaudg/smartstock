import React from 'react';
import {
  ShoppingCart,
  Store,
  CreditCard,
  BarChart3,
  Truck,
  Building2,
  Zap,
  Mail,
  Globe,
  Package,
} from 'lucide-react';
import type { IntegrationIconKey } from './catalog';

const ICON_MAP: Record<IntegrationIconKey, React.ComponentType<{ className?: string }>> = {
  'shopping-cart': ShoppingCart,
  store: Store,
  'credit-card': CreditCard,
  'bar-chart': BarChart3,
  truck: Truck,
  building: Building2,
  zap: Zap,
  mail: Mail,
  globe: Globe,
  package: Package,
};

export function IntegrationIcon({
  iconKey,
  className = 'h-6 w-6',
}: {
  iconKey: IntegrationIconKey;
  className?: string;
}) {
  const Icon = ICON_MAP[iconKey];
  return <Icon className={className} />;
}
