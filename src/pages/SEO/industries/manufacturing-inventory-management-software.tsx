import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Factory,
  Settings2,
  QrCode,
  Smartphone,
  AlertTriangle,
  Layers,
  Box,
  Truck,
  History,
  WifiOff,
  ClipboardCheck,
  CheckCircle,
  Database,
  ShieldCheck
} from 'lucide-react';

import { KeyTakeaways } from '@/components/KeyTakeaways';

export default function ManufacturingInventoryManagementPage() {
  
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
      question: 'How do you track inventory in manufacturing?',
      answer:
        'Manufacturing inventory tracking involves monitoring items through three main stages: raw materials, work-in-progress (WIP), and finished goods. StockFlow enables real-time tracking across these stages using mobile QR scanning, allowing shop floor workers to update quantities as components are consumed or completed.',
    },
    {
      question: 'Can StockFlow help with lean manufacturing?',
      answer:
        'Yes. StockFlow supports lean principles by providing real-time visibility into stock levels and automated low stock alerts. This prevents overproduction and excess inventory (Waste) while ensuring that critical components are always available for Just-In-Time (JIT) production cycles.',
    },
    {
      question: 'How does barcode scanning work on a factory floor?',
      answer:
        'Workers can use their own smartphones or tablets as handheld scanners. By scanning barcodes on bins or individual parts, they can instantly record consumption for a Bill of Materials (BOM) or transfer finished products to a warehouse, eliminating manual data entry errors.',
    },
    {
      question: 'Can I manage multiple manufacturing facilities?',
      answer:
        'Absolutely. StockFlow uses a customizable folder and location system that allows you to manage multiple plants, warehouses, and even off-site vendor locations from a single dashboard with synchronized real-time data.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Manufacturing Inventory Management Software | StockFlow',
    description:
      'Keep your production line running with real-time manufacturing inventory tracking. Manage raw materials, WIP, and finished goods with mobile scanning.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Manufacturing Edition',
      description:
        'A comprehensive inventory management system for manufacturers to track raw materials, streamline production, and automate reordering.',
      category: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      price: '0',
      currency: 'USD',
      features: [
        'Raw material & WIP tracking',
        'Mobile QR/Barcode scanning',
        'Automated low stock alerts',
        'Multi-warehouse synchronization',
        'Offline shop floor access',
        'Bill of Materials (BOM) support',
      ],
      image: 'https://www.stockflowsystems.com/manufacturing-inventory-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: Factory,
      title: 'Lifecycle Stage Tracking',
      description: 'Monitor your inventory as it progresses from raw materials to work-in-progress (WIP) and final finished goods.',
    },
    {
      icon: AlertTriangle,
      title: 'Automated Reorder Alerts',
      description: 'Set minimum stock thresholds for critical components. Get notified before a stockout halts your production line.',
    },
    {
      icon: QrCode,
      title: 'Shop Floor Scanning',
      description: 'Turn any mobile device into a scanner. Use QR codes to quickly grab items for a BOM or update finished stock.',
    },
    {
      icon: Layers,
      title: 'Multi-Warehouse Sync',
      description: 'Manage inventory across multiple production plants and distribution centers with a unified real-time database.',
    },
    {
      icon: ClipboardCheck,
      title: 'Digital Pick Lists',
      description: 'Create accurate pick lists for the production team to ensure the correct parts are pulled for every assembly.',
    },
    {
      icon: WifiOff,
      title: 'Offline Data Entry',
      description: 'Track usage in remote areas of the factory without Wi-Fi. Data syncs automatically once a connection is restored.',
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
      title="Manufacturing Inventory Management Made Easy"
      heroTitle="Lean Manufacturing Inventory Software Built for Speed"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Best Manufacturing Inventory Software 2026 | Raw Materials & WIP | StockFlow"
        description="Streamline your production line with real-time inventory management. Track raw materials, reduce waste, and manage multiple plants with ease."
        keywords="manufacturing inventory software, raw materials tracking, wip inventory management, factory asset tracking, lean manufacturing tools"
        url="https://www.stockflowsystems.com/manufacturing-inventory-software"
        structuredData={structuredData}
      />

      {/* Core Explanation */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Streamline Production with Precise Inventory Control</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            In modern manufacturing, efficiency is the baseline for profitability. <strong>Manufacturing inventory management software</strong> provides the end-to-end visibility required to keep your production line lean. <strong>StockFlow</strong> enables you to track every component, from the arrival of <strong>raw materials</strong> to the shipment of <strong>finished goods</strong>.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            By digitizing your shop floor, you eliminate the delays caused by missing parts or inaccurate stock counts. Our platform allows your team to <strong>update inventory in real time</strong>, providing management with the data needed to make informed procurement decisions and forecast customer demand accurately.
          </p>
        </div>
      </section>

      {/* Lean Operations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Drive ROI Through Leaner Inventory Operations</h2>
          <div className="grid md:grid-cols-2 gap-12 text-gray-600">
            <div className="space-y-6">
              <div className="flex gap-4">
                <Box className="text-blue-600 shrink-0 w-8 h-8" />
                <div>
                  <h3 className="font-bold text-xl mb-2 text-blue-900">Work-In-Progress (WIP)</h3>
                  <p>Gain total transparency into the <strong>production lifecycle</strong>. Track items as they move through assembly stations, ensuring that bottlenecks are identified before they impact your delivery schedule.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Truck className="text-blue-600 shrink-0 w-8 h-8" />
                <div>
                  <h3 className="font-bold text-xl mb-2 text-blue-900">Multi-Site Coordination</h3>
                  <p>Transfer stock between warehouses or satellite facilities instantly. StockFlow’s <strong>cloud-based syncing</strong> ensures that every plant manager sees the true organizational stock level.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Settings2 className="text-blue-600 shrink-0 w-8 h-8" />
                <div>
                  <h3 className="font-bold text-xl mb-2 text-blue-900">BOM Optimization</h3>
                  <p>Simplify <strong>Bill of Materials</strong> management. Use pick lists and mobile scanning to ensure the right components are pulled for every specific product run, reducing assembly errors.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <History className="text-blue-600 shrink-0 w-8 h-8" />
                <div>
                  <h3 className="font-bold text-xl mb-2 text-blue-900">Full Audit History</h3>
                  <p>Maintain total accountability with a permanent digital record of every inventory update. See exactly who consumed materials and when, essential for <strong>quality control and compliance</strong>.</p>
                </div>
              </div>
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

      {/* Deep Dive: Customization & Security */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Engineered for Factory Floor Operations</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg opacity-90 leading-relaxed">
                Your manufacturing process is unique. <strong>StockFlow Manufacturing Edition</strong> is fully customizable to match your specific shop floor layout and safety requirements.
              </p>
              <div className="flex gap-4 items-start">
                <Database className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Custom Fields:</strong> Track unique details like material grades, batch numbers, manufacturer certs, or specific safety warnings for every part.</p>
              </div>
              <div className="flex gap-4 items-start">
                <ShieldCheck className="w-12 h-12 text-blue-400 shrink-0" />
                <p><strong>Granular User Permissions:</strong> Control who can edit stock levels. Grant "Read-Only" access to vendors or limited "Update" access to floor contractors.</p>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="font-bold mb-4 text-xl">Industrial Inventory Toolkit</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> High-Res Item Photo Documentation</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Custom Barcode/QR Label Printing</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Advanced Usage & Waste Reporting</li>
                <li className="flex gap-2 items-center"><CheckCircle className="text-blue-400" /> Integration-Ready API</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Guide / Scales */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Solutions for Every Stage of Production</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Workshops & Prototyping</h4>
              <p className="text-sm text-gray-600">Organize deep inventories of small parts and specialized tooling with simple mobile tools.</p>
            </div>
            <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Specialized Manufacturing</h4>
              <p className="text-sm text-gray-600">Coordinate raw materials and assembly across high-mix, low-volume production environments.</p>
            </div>
            <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2 text-lg">Enterprise Industrial</h4>
              <p className="text-sm text-gray-600">Scalable oversight for thousands of SKUs across multiple global manufacturing and warehouse sites.</p>
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