import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Truck,
  Smartphone,
  QrCode,
  MapPin,
  BarChart3,
  Users,
  Package,
  Boxes,
  ClipboardList,
  History,
  ShieldCheck,
  CheckCircle,
  WifiOff,
  Link2
} from 'lucide-react';

export default function LogisticsInventoryManagementPage() {
  
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
      question: 'How does inventory software improve logistics efficiency?',
      answer:
        'Logistics inventory software centralizes data from multiple warehouses and transit points. By using mobile scanning and real-time syncing, it eliminates the delays of manual spreadsheets, ensuring that dispatchers and warehouse managers have 100% accurate stock levels at all times.',
    },
    {
      question: 'Can I track inventory across a fleet of trucks?',
      answer:
        'Yes. StockFlow allows you to designate individual trucks or vehicles as unique inventory locations. This enables drivers to update stock levels on the go, providing full visibility into "rolling inventory" and cross-docking operations.',
    },
    {
      question: 'How do barcode and QR scanning help in logistics?',
      answer:
        'Scanning speeds up the intake and shipment process by instantly identifying SKUs and updating quantities. It reduces picking errors during fulfillment and provides an automated audit trail for every item entering or leaving the facility.',
    },
    {
      question: 'Does the system support multi-warehouse management?',
      answer:
        'Absolutely. You can set up custom folder hierarchies for multiple warehouses, distribution centers, and regional hubs. This allows for easy stock transfers and centralized procurement planning across your entire logistics network.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Logistics Inventory Management Software | StockFlow',
    description:
      'Simplify your supply chain with real-time logistics inventory tracking. Manage multiple warehouses, fleet stock, and shipments with mobile scanning.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Logistics Edition',
      description:
        'A mobile-first inventory management solution designed for logistics providers, 3PLs, and fleet operations to track high-velocity stock.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Multi-warehouse location tracking',
        'Fleet & truck stock management',
        'Mobile QR/Barcode scanning',
        'Custom fields for SKUs & Lot numbers',
        'Real-time cloud synchronization',
        'Automated pick lists',
      ],
      image: 'https://www.stockflowsystems.com/logistics-inventory-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: Smartphone,
      title: 'Mobile Supply Chain Access',
      description: 'Update inventory from any smartphone or tablet. Manage shipments from the dock, the warehouse, or the truck cab.',
    },
    {
      icon: MapPin,
      title: 'Location & Fleet Tracking',
      description: 'Track items across multiple warehouses, distribution centers, and moving vehicles with precise location folders.',
    },
    {
      icon: QrCode,
      title: 'High-Velocity Scanning',
      description: 'Accelerate intake and fulfillment. Use the built-in scanner to manage bulk shipments and individual SKUs with 100% accuracy.',
    },
    {
      icon: BarChart3,
      title: 'Stock Level Analytics',
      description: 'Identify usage patterns and optimize stock levels. Avoid wasting storage space and capital on excess inventory.',
    },
    {
      icon: WifiOff,
      title: 'Offline Field Updates',
      description: 'Drivers can update inventory even in areas with poor cellular service. Data syncs automatically once reconnected.',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Permissions',
      description: 'Grant specific access to drivers, warehouse staff, and managers to ensure data security and accountability.',
    },
  ];

  const keyTakeaways = [
    'Real-time tracking of raw materials prevents costly production delays and downtime.',
    'Mobile-first scanning increases data accuracy on the shop floor compared to manual logs.',
    'Detailed reporting helps identify inventory usage patterns to optimize procurement and lean operations.',
    'StockFlow scales with your production volume, supporting multiple sites and unlimited items.',
  ];

  return (
    <SeoPageLayout
      title="Logistics Inventory Management, Simplified"
      heroTitle="Logistics Inventory Software Built for Modern Supply Chains"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Best Logistics Inventory Software 2026 | Warehouse & Fleet | StockFlow"
        description="Optimize your logistics operations. Track inventory across warehouses and trucks, automate fulfillment, and gain real-time visibility with our mobile app."
        keywords="logistics inventory software, supply chain management, warehouse tracking app, fleet inventory system, 3pl inventory management"
        url="https://www.stockflowsystems.com/logistics-inventory-management"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Synchronize Your Logistics & Supply Chain</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            In the world of logistics, speed and accuracy are the only metrics that matter. <strong>Logistics inventory management software</strong> provides the real-time visibility required to move goods efficiently from origin to destination. <strong>StockFlow</strong> replaces manual processes with a mobile-first digital ecosystem.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            From managing <strong>multiple regional warehouses</strong> to tracking stock inside a fleet of delivery vehicles, our platform ensures that every stakeholder has the right data. By digitizing your <strong>logistics workflow</strong>, you eliminate the friction of lost items and inaccurate stock counts, driving higher ROI across your entire operation.
          </p>
        </div>
      </section>

      {/* Efficiency Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Optimize Storage and Speed Up Fulfillment</h2>
          <div className="grid md:grid-cols-2 gap-12 text-gray-600">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <Package className="text-blue-600" /> High-Velocity Fulfillment
              </h3>
              <p className="mb-6">
                Streamline the "last mile" and warehouse picking. Use <strong>digital pick lists</strong> and mobile scanning to ensure that orders are fulfilled correctly the first time, reducing return costs and improving customer satisfaction.
              </p>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <Boxes className="text-blue-600" /> Multi-Location Visibility
              </h3>
              <p>
                Get a birds-eye view of your entire inventory network. <strong>Cloud-based syncing</strong> allows you to monitor stock levels across global hubs, local distribution centers, and even transit containers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <Truck className="text-blue-600" /> Fleet Stock Control
              </h3>
              <p className="mb-6">
                Treat every vehicle as a mobile warehouse. Drivers can use their smartphones to scan items in and out, providing real-time data on <strong>rolling stock</strong> and simplifying cross-docking procedures.
              </p>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <ClipboardList className="text-blue-600" /> Custom Detail Tracking
              </h3>
              <p>
                Track the unique details that matter to your business model. Add <strong>custom fields</strong> for SKU, lot numbers, manufacturer dates, or delivery priority to tailor the system to your logistics requirements.
              </p>
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

      {/* Deep Dive: Analytics & Control */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Data-Driven Supply Chain Management</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg opacity-90 leading-relaxed">
                Profitability in logistics is won through optimization. <strong>StockFlow Logistics Edition</strong> provides the oversight needed to eliminate waste and redundant storage costs.
              </p>
              <div className="flex gap-4 items-start">
                <History className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Employee Audit Trail:</strong> Monitor all activity to see exactly who updated stock levels or moved a shipment, enhancing accountability across the warehouse floor.</p>
              </div>
              <div className="flex gap-4 items-start">
                <Link2 className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>System Integrations:</strong> Connect your inventory data with your preferred logistics platforms and shipping carriers for a seamless, end-to-end data flow.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="font-bold mb-4 text-xl">Logistics Operations Toolkit</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> High-Res Item Photos for Condition Tracking</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Custom QR & Barcode Label Generation</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Automated Low Stock Threshold Alerts</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Exportable Reporting for Audits & Planning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Scale Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Scalable Solutions for Every Logistics Provider</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">3PL & Fulfillment</h4>
              <p className="text-sm text-gray-600">Manage client-specific inventories with granular permissions and automated pick lists for high-volume picking.</p>
            </div>
            <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Transportation & Trucking</h4>
              <p className="text-sm text-gray-600">Equip drivers with mobile tools to update inventory as it moves through the supply chain from dock to door.</p>
            </div>
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Industrial Warehousing</h4>
              <p className="text-sm text-gray-600">Optimize storage for heavy machinery, raw goods, and palletized stock across massive multi-site hubs.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-6xl mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        
      </section>

    </SeoPageLayout>
  );
}