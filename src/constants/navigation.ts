import type { LucideIcon } from 'lucide-react';
import { 
  Boxes, 
  Truck, 
  Wrench, 
  HardHat, 
  Zap, 
  Stethoscope, 
  Warehouse, 
  FileText, 
  TrendingUp, 
  LifeBuoy, 
  Scale,
} from 'lucide-react';

export type NavItem = {
  id: string;
  label: string;
  to?: string;
  megaMenu?: {
    intro?: {
      title: string;
      description: string;
      ctaLabel?: string;
      ctaTo?: string;
    };
    sections: {
      title?: string;
      items?: { label: string; description?: string; to: string; icon?: LucideIcon }[];
    }[];
  };
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'solutions',
    label: 'Solutions',
    megaMenu: {
      intro: {
        title: 'Solutions',
        description: 'No matter what you need to track, StockFlow keeps your operations organized.',
        ctaLabel: 'Explore all solutions',
        ctaTo: '/features'
      },
      sections: [
        {
          title: 'Use Cases',
          items: [
            { label: 'Inventory Management', description: 'Manage, organize, and track all inventory in real time.', to: '/inventory-management', icon: Boxes },
            { label: 'Supplies Tracking', description: 'Track materials, consumables, and parts with ease.', to: '/supplies-and-consumables-software', icon: Truck },
            { label: 'Asset Tracking', description: 'Keep tabs on critical tools, equipment, and spare parts.', to: '/asset-tracking', icon: Wrench }
          ]
        },
        {
          title: 'Industries',
          items: [
            { label: 'Construction', description: 'Monitor job-site inventory from anywhere.', to: '/contractor-inventory-management', icon: HardHat },
            { label: 'Electrical', description: 'Stay on top of electrical supplies across teams.', to: '/electrical-inventory-management', icon: Zap },
            { label: 'Medical', description: 'Track medical supplies with full traceability.', to: '/medical-inventory-management', icon: Stethoscope }
          ]
        },
        {
          title: 'More Industries',
          items: [
            { label: 'Warehouse', description: 'Run smart warehouse operations with automation.', to: '/warehouse-software', icon: Warehouse }
          ]
        }
      ]
    }
  },
  {
    id: 'resources',
    label: 'Resources',
    megaMenu: {
      intro: {
        title: 'Resources',
        description: 'Access educational content, customer stories, and technical support.',
      },
      sections: [
        {
          title: 'Learn & Support',
          items: [
            { label: 'Articles', description: 'Expert insights on inventory optimization.', to: '/blog', icon: FileText },
            { label: 'Case Studies', description: 'Real-world success stories from our clients.', to: '/case-studies', icon: TrendingUp },
            { label: 'Support', description: 'Get technical help and documentation.', to: '/help-center', icon: LifeBuoy },
            { label: 'Comparisons', description: 'How StockFlow ranks against competitors.', to: '/compare-inventory-software', icon: Scale },
          ]
        }
      ]
    }
  },
  { id: 'pricing', label: 'Pricing', to: '/pricing' },
  { id: 'contact', label: 'Contact Us', to: '/contact' },
];