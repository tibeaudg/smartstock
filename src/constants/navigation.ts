import { 
  Boxes, Truck, Wrench, HardHat, Zap, Stethoscope, 
  Warehouse, FileText, TrendingUp, LifeBuoy, PlayCircle, Scale 
} from 'lucide-react';
import { NavItem } from '../components/Header'; // Pas import pad aan indien nodig

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
            { label: 'Supplies Tracking', description: 'Track materials, consumables, and parts with ease.', to: '/suppliers', icon: Truck },
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
        description: 'Need help or information? Here you can find what you are looking for',
      },
      sections: [
        {
          title: 'Blog',
          items: [
            { label: 'Articles', description: 'Read our content for free.', to: '/blog', icon: FileText },
            { label: 'Case Studies', description: 'Find out other success stories.', to: '/case-studies', icon: TrendingUp },
            { label: 'Support', description: 'Get help here!', to: '/help-center', icon: LifeBuoy },
            { label: 'Demo Videos', description: 'Watch our free instruction videos.', to: '/videos', icon: PlayCircle },
            { label: 'Comparisons', description: 'Compare Stockflow with other inventory management platforms.', to: '/compare-inventory-software', icon: Scale }
          ]
        }
      ]
    }
  },
  { id: 'about', label: 'About', to: '/about' },
  { id: 'support', label: 'Support', to: '/help-center' }
];