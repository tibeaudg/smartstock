import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Smartphone,
  MapPin,
  AlertTriangle,
  QrCode,
  Users,
  Camera,
  BarChart3,
  WifiOff,
  Settings2,
  ListChecks,
  Link2,
  CheckCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

import { KeyTakeaways } from '@/components/KeyTakeaways';

export default function InventoryManagementSoftwarePage() {
  
  const location = useLocation();

  const breadcrumbs = getBreadcrumbPath(location.pathname).map(
    (item, index) => ({
      name: item.name,
      url: item.path,
      position: index + 1,
    })
  );

  const faqData = [
    {
      question: 'Why is digital inventory management better than spreadsheets?',
      answer:
        'Digital inventory systems eliminate manual data entry errors, provide real-time updates across multiple devices, and offer automated features like low stock alerts and barcode scanning that spreadsheets cannot replicate. This ensures data integrity and prevents costly project delays.',
    },
    {
      question: 'Can I track inventory across multiple locations and job sites?',
      answer:
        'Yes. Modern cloud-based software like StockFlow allows you to create custom folder hierarchies to track items as they move between warehouses, service vehicles, and active job sites, providing a single source of truth for your entire operation.',
    },
    {
      question: 'How does barcode and QR scanning improve accuracy?',
      answer:
        'By using a mobile scanner to check items in and out, you eliminate "human error" in SKU recording. Forced scanning ensures the correct item is being tracked, instantly updating quantities and providing an accurate audit trail of user activity.',
    },
    {
      question: 'Does the software work without an internet connection?',
      answer:
        'StockFlow features offline mobile access, allowing field teams to update inventory in remote areas or basements with poor reception. The data automatically syncs with the cloud once a connection is re-established.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Modern Inventory Management Software | StockFlow',
    description:
      'Replace spreadsheets with an intuitive, mobile-first inventory system. Track assets, supplies, and tools across multiple locations with real-time syncing.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Inventory Core',
      description:
        'Cloud-based inventory management platform featuring barcode scanning, low stock alerts, and multi-user collaboration.',
      category: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      price: '0',
      currency: 'USD',
      features: [
        'Multi-location tracking',
        'Mobile QR/Barcode scanning',
        'Automated low stock alerts',
        'Custom reporting & analytics',
        'Offline data entry',
        'Pick lists & Purchase orders',
      ],
      image: 'https://www.stockflowsystems.com/inventory-management-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: Smartphone,
      title: 'Universal Mobile Access',
      description: 'Update and manage your inventory from any smartphone or tablet, ensuring the field and office stay in sync.',
    },
    {
      icon: MapPin,
      title: 'Location & Folder Tracking',
      description: 'Organize items by warehouse, truck, or bin. Monitor assets as they move across your entire infrastructure.',
    },
    {
      icon: AlertTriangle,
      title: 'Intelligent Stock Alerts',
      description: 'Receive instant notifications when quantities hit custom minimums to prevent stockouts and project downtime.',
    },
    {
      icon: QrCode,
      title: 'Integrated QR Scanning',
      description: 'Use your device’s camera to scan existing barcodes or generate and print custom labels directly from the app.',
    },
    {
      icon: ListChecks,
      title: 'Pick Lists & Orders',
      description: 'Ensure accuracy during fulfillment with digital pick lists and streamlined purchase order generation.',
    },
    {
      icon: WifiOff,
      title: 'Offline Syncing',
      description: 'Continue tracking items in areas without service. Data syncs automatically once you are back online.',
    },
  ];

  const keyTakeaways = [
    'Cloud-based inventory management replaces static spreadsheets with actionable, real-time data.',
    'Multi-user permissions ensure the right team members have the appropriate level of data access.',
    'Automated alerts and mobile scanning significantly reduce administrative overhead and manual errors.',
    'Real-time reporting enables data-driven forecasting and improved financial planning.',
  ];

  return (
    <SeoPageLayout
      title="Inventory Management Software – Simplified Operations"
      heroTitle="Inventory Software Built to Scale Your Business"
      updatedDate="01/08/2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Best Inventory Management Software 2026 | StockFlow"
        description="Streamline your operations with powerful, easy-to-use inventory tracking. Manage tools, supplies, and equipment from any device, anywhere."
        keywords="inventory management software, inventory tracking system, barcode inventory app, multi-location inventory, small business inventory tool"
        url="https://www.stockflowsystems.com/inventory-software"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Modern Inventory Management, Simplified</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Relying on outdated spreadsheets or manual logs is a barrier to growth. <strong>Modern inventory management software</strong> provides the digital infrastructure necessary to track supplies, materials, and equipment with total precision. <strong>StockFlow</strong> is designed to be the single source of truth for your business assets, accessible from any device in any location.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            By digitizing your <strong>inventory workflow</strong>, you eliminate the "hidden costs" of missing items, emergency reorders, and project delays. Our platform bridges the gap between field operations and back-office accounting, ensuring everyone has the data they need to drive the business forward.
          </p>
        </div>
      </section>

      {/* Business Growth Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Drive Operational Excellence & Business Growth</h2>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1 space-y-6">
              <div className="flex gap-4">
                <TrendingUp className="text-blue-600 shrink-0 w-8 h-8" />
                <div>
                  <h3 className="font-bold text-xl mb-2">Informed Decision Making</h3>
                  <p className="text-gray-600">Identify usage trends and forecast seasonal demand based on real-time data, allowing for smarter procurement and leaner stock levels.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="text-blue-600 shrink-0 w-8 h-8" />
                <div>
                  <h3 className="font-bold text-xl mb-2">Reduced Administrative Overhead</h3>
                  <p className="text-gray-600">Automate tedious tasks like cycle counts and reorder notifications, freeing your team to focus on high-value, growth-driving activities.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <ShieldCheck className="text-blue-600 shrink-0 w-8 h-8" />
                <div>
                  <h3 className="font-bold text-xl mb-2">Error Elimination</h3>
                  <p className="text-gray-600">Smart features like forced barcode scanning and digital pick lists ensure the right items are grabbed for the right job, every time.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-blue-900 mb-4 text-lg">Inventory Impact Metrics</h4>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span>Up to 99% Inventory Accuracy</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span>30% Reduction in Lost Assets</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span>Lower Carrying Costs</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span>Faster Audit Completion Time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <f.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Dive: Customization & Connectivity */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Tailored Control & Seamless Integration</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg opacity-90 leading-relaxed">
                Your business is unique. Your software should be too. <strong>StockFlow’s flexible architecture</strong> allows you to build an inventory system that reflects your specific operations.
              </p>
              <div className="flex gap-4 items-start">
                <Settings2 className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Custom Fields:</strong> Track unique data points like handling instructions, manufacturer IDs, or project codes for every item entry.</p>
              </div>
              <div className="flex gap-4 items-start">
                <Link2 className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Ecosystem Integrations:</strong> Connect your inventory data with accounting, ERP, and shipping platforms to create a unified business workflow.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="font-bold mb-4 text-xl">Advanced Management Toolkit</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> High-Res Item Photos</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Granular User Permissions</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Activity History & Audits</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Custom Label Generation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Summary / Decision Guide */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Choose the Best Path for Your Inventory</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Small Teams</h4>
              <p className="text-sm text-gray-600">Quickly move away from paper tracking with an intuitive app that works on devices you already own.</p>
            </div>
            <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Scaling SMBs</h4>
              <p className="text-sm text-gray-600">Add multi-location support, low stock alerts, and team collaboration to manage growing complexity.</p>
            </div>
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Enterprise Ops</h4>
              <p className="text-sm text-gray-600">Leverage API access, advanced reporting, and bulk management tools for large-scale asset oversight.</p>
            </div>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}