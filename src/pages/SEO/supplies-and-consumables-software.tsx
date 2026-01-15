import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Boxes,
  RefreshCw,
  AlertTriangle,
  QrCode,
  Smartphone,
  Factory,
  ShieldCheck,
  Truck,
  Database,
  Layers,
  CheckCircle,
  Zap
} from 'lucide-react';

import { KeyTakeaways } from '@/components/KeyTakeaways';

export default function ConsumablesInventoryPage() {
  
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
      question: 'What is the best way to track office and warehouse supplies?',
      answer:
        'The most efficient way to track supplies is through a digital inventory system that supports mobile scanning and real-time cloud syncing. StockFlow allows teams to update quantities instantly as items are used, ensuring that stock levels are always accurate across multiple locations.',
    },
    {
      question: 'How do low stock alerts work for consumables?',
      answer:
        'In StockFlow, you can set "minimum quantity" thresholds for every item. When a staff member scans out a consumable and the count drops below that threshold, the system automatically triggers an email or push notification to the procurement team.',
    },
    {
      question: 'Can I track raw materials and PPE in the same system?',
      answer:
        'Yes. Modern inventory software allows you to categorize different types of consumables such as raw materials for production, PPE for safety compliance, and general office supplies within a single unified dashboard.',
    },
    {
      question: 'Does tracking consumables reduce business costs?',
      answer:
        'Absolutely. By maintaining real-time visibility, businesses avoid "panic buying" at retail prices, reduce waste from expired materials, and identify high-usage areas where bulk purchasing could save significant capital.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Supply & Consumable Management Software | StockFlow',
    description:
      'Simplify how your business tracks parts, raw materials, and PPE. Real-time consumable inventory management with mobile scanning and automated reordering.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Consumables Manager',
      description:
        'Professional-grade supply tracking software for managing high-turnover consumables, parts, and raw materials.',
      category: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      price: '0',
      currency: 'USD',
      features: [
        'Real-time quantity updates',
        'Low stock threshold alerts',
        'Multi-location supply sync',
        'Mobile QR & Barcode scanning',
        'PPE and raw material tracking',
        'Usage analytics and reporting',
      ],
      image: 'https://www.stockflowsystems.com/consumables-inventory.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: RefreshCw,
      title: 'Real-Time Quantity Tracking',
      description: 'Update stock levels instantly from any device as supplies are consumed in the warehouse or field.',
    },
    {
      icon: AlertTriangle,
      title: 'Automated Reorder Alerts',
      description: 'Never run out of essential materials. Receive notifications the moment stock dips below your custom minimum.',
    },
    {
      icon: QrCode,
      title: 'High-Speed Scanning',
      description: 'Use the in-app barcode and QR scanner to accelerate cycle counts and supply intake workflows.',
    },
    {
      icon: Factory,
      title: 'Raw Materials Management',
      description: 'Track the components and raw goods required for production to ensure zero downtime in manufacturing.',
    },
    {
      icon: ShieldCheck,
      title: 'PPE & Safety Compliance',
      description: 'Monitor the availability of Personal Protective Equipment to keep your workforce safe and compliant.',
    },
    {
      icon: Smartphone,
      title: 'Cloud-Based Mobile Sync',
      description: 'Manage your supplies from the office or on the road with automatic data syncing across all team devices.',
    },
  ];

  const keyTakeaways = [
    'Digital supply tracking eliminates the guesswork and manual errors of paper logs.',
    'Automated alerts ensure critical parts are always available before a project begins.',
    'Multi-location support allows for centralized procurement across several branch offices or warehouses.',
    'StockFlow simplifies consumables management for businesses of any size, from SMBs to enterprises.',
  ];

  return (
    <SeoPageLayout
      title="Supply & Consumable Management Simplified"
      heroTitle="Consumables Inventory Software Built for Speed"
      updatedDate="01/08/2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Best Consumables & Supply Management Software 2026 | StockFlow"
        description="Stop running out of essential parts and materials. Track your business consumables, PPE, and raw materials with our easy-to-use mobile inventory app."
        keywords="consumables inventory software, supply tracking system, raw materials management, ppe inventory app, parts tracking software"
        url="https://www.stockflowsystems.com/supplies-and-consumables-software"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">What Is Consumable Inventory Management?</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            In any fast-moving business, it is the small things <strong>consumables, parts, and supplies</strong> that keep the operation running. <strong>Consumable inventory management</strong> is the process of tracking items that are intended to be used up or replaced frequently. Without a digital system, these high-turnover items are easily overlooked until they are gone.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            By implementing <strong>supply tracking software</strong>, your organization gains the visibility needed to optimize procurement. Knowing exactly what is on hand across multiple warehouses reduces waste and ensures your team always has the materials they need to perform.
          </p>
        </div>
      </section>

      {/* Versatility Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Track Anything and Everything With Ease</h2>
          <div className="grid md:grid-cols-2 gap-12 text-gray-600">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <Boxes className="text-blue-600" /> Parts & Components
              </h3>
              <p className="mb-6">
                Manage high-volume parts, fasteners, and internal components. Use <strong>QR code scanning</strong> to check items out of the bin and into a specific job or project instantly.

              </p>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <Factory className="text-blue-600" /> Raw Materials
              </h3>
              <p>
                Track the raw goods that fuel your production line. Monitor usage patterns and set lead-time alerts so that manufacturing never halts due to a material shortage.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <ShieldCheck className="text-blue-600" /> PPE & Safety Gear
              </h3>
              <p className="mb-6">
                Maintain a rigorous record of safety equipment. Track the distribution of gloves, masks, and vests to ensure your team remains protected and your business meets OSHA standards.
              </p>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-900">
                <Smartphone className="text-blue-600" /> Mobile Efficiency
              </h3>
              <p>
                Empower your workforce to update inventory from their own devices. StockFlow's <strong>mobile inventory app</strong> eliminates the need for expensive dedicated hardware.
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

      {/* Deep Dive: Procurement Efficiency */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Data-Driven Procurement & Stock Control</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg opacity-90 leading-relaxed">
                Profitability is often found in the margins. <strong>StockFlow Consumables Edition</strong> provides the data needed to eliminate overstock and emergency purchasing.
              </p>
              <div className="flex gap-4 items-start">
                <Zap className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Predictive Ordering:</strong> Use historical usage reports to forecast future supply needs, allowing you to negotiate better rates for bulk orders.</p>
              </div>
              <div className="flex gap-4 items-start">
                <Truck className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Inter-Branch Transfers:</strong> See excess stock at one location and transfer it to another rather than purchasing new supplies.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="font-bold mb-4 text-xl">Operational Supply Toolkit</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Automated Threshold Alerts</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Multi-User Quantity Logs</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Shelf-Life/Expiry Tracking</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Barcode Generation & Printing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Scenarios */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Supply Management for Every Industry</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Office & Facilities</h4>
              <p className="text-sm text-gray-600">Track stationery, cleaning supplies, and kitchen stock across corporate campuses.</p>
            </div>
            <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Medical & Lab</h4>
              <p className="text-sm text-gray-600">Monitor high-turnover disposables like swabs, PPE, and reagents with strict expiry tracking.</p>
            </div>
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Workshops & Trades</h4>
              <p className="text-sm text-gray-600">Keep tabs on screws, drill bits, and small components across service vans and toolrooms.</p>
            </div>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}