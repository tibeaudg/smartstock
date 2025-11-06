import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

const faqData = [
  {
    question: 'What is an inventory management system solution?',
    answer: 'An inventory management system solution combines software, hardware, and best practices to control stock across purchasing, warehousing, and fulfillment. StockFlow centralizes these workflows in one cloud platform.'
  },
  {
    question: 'Does StockFlow support barcode hardware and scanners?',
    answer: 'Yes. Use our mobile app with iOS/Android devices or connect Bluetooth scanners. StockFlow also integrates with Zebra and Honeywell hardware for high-volume warehouses.'
  },
  {
    question: 'Can I manage multiple inventory systems in different regions?',
    answer: 'StockFlow handles multi-warehouse and multi-region configurations with localized currency, tax, and language support.'
  },
  {
    question: 'How quickly can we deploy StockFlow as our system?',
    answer: 'Most companies launch within 14 days thanks to guided onboarding, data import templates, and ready-to-use automations.'
  }
];

const structuredData = generateComprehensiveStructuredData('software', {
  title: 'Inventory Management Systems Solutions | StockFlow',
  url: 'https://www.stockflow.be/inventory-management-systems-solutions',
  description:
    'Discover StockFlow inventory management systems solutions. Connect hardware, barcode workflows, and cloud software to control stock everywhere.',
  breadcrumbs: [
    { name: 'Home', url: 'https://www.stockflow.be/', position: 1 },
    { name: 'Inventory Management Solutions', url: 'https://www.stockflow.be/inventory-management-software-solutions', position: 2 },
    { name: 'Inventory Management Systems Solutions', url: 'https://www.stockflow.be/inventory-management-systems-solutions', position: 3 }
  ],
  faqData,
  softwareData: {
    name: 'StockFlow Inventory System',
    description: 'Inventory management system solution with barcode workflows, multi-warehouse control, and real-time analytics.',
    category: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    price: '0',
    currency: 'EUR',
    rating: {
      value: '4.8',
      count: '168'
    },
    features: [
      'Barcode & RFID support',
      'Multi-warehouse routing',
      'Hardware integrations',
      'Automated replenishment',
      'Analytics & dashboards',
      'APIs and webhooks'
    ],
    image: 'https://www.stockflow.be/Inventory-Management.png',
    url: 'https://www.stockflow.be/inventory-management-systems-solutions'
  }
});

export default function InventoryManagementSystemsSolutionsPage() {
  usePageRefresh();

  return (
    <SeoPageLayout title="Inventory Management Systems Solutions">
      <SEO
        title="Inventory Management Systems Solutions | StockFlow"
        description="Build a connected inventory management system with StockFlow. Combine barcode hardware, mobile apps, and cloud automation to control stock across every location."
        keywords="inventory management systems solutions, inventory system solution, barcode inventory system, warehouse system solution, stockflow inventory system"
        url="https://www.stockflow.be/inventory-management-systems-solutions"
        structuredData={structuredData}
      />

      <section className="bg-gray-50 border border-gray-200 rounded-3xl px-6 sm:px-10 py-12 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-700 bg-white/80 px-3 py-1 rounded-full">
              Connected Inventory Systems
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
              One system to power barcode, mobile, and cloud inventory
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mt-5 leading-relaxed">
              StockFlow unites hardware scanners, mobile apps, and real-time dashboards. Receive goods, pick orders, and audit stock with confidence, whether you operate one warehouse or ten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg text-center">
                Start Free
              </Link>
              <Link to="/demo" className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg text-center">
                Talk to Systems Expert
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">Compatible with Zebra, Honeywell, and iOS/Android devices</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">System capabilities</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>✅ Receive with ASN & barcode validation</li>
              <li>✅ Guided picking & packing workflows</li>
              <li>✅ Cycle counts and RFID support</li>
              <li>✅ IoT-ready APIs for automation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-16 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">End-to-end system architecture</h2>
          <p className="text-gray-700 leading-relaxed">
            Deploy StockFlow as the nucleus of your inventory stack. Connect ERP, ecommerce, 3PL partners, and hardware so data flows automatically and teams operate in sync.
          </p>
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">API-first platform</h3>
              <p className="text-sm text-gray-600 mt-2">Use REST and GraphQL APIs plus webhooks to extend automations or integrate robotics.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Hardware flexibility</h3>
              <p className="text-sm text-gray-600 mt-2">From handheld scanners to fixed RFID portals, StockFlow works with the devices you already trust.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Unified analytics</h3>
              <p className="text-sm text-gray-600 mt-2">Monitor throughput, accuracy, and labor efficiency with dashboards built for operations leaders.</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900">System rollout steps</h3>
          <ol className="mt-5 space-y-3 text-sm text-gray-700 list-decimal list-inside">
            <li>Audit current inventory processes and data sources</li>
            <li>Migrate SKU, location, and supplier data with templates</li>
            <li>Configure barcode labels, mobile workflows, and automations</li>
            <li>Train teams with on-demand videos and live sessions</li>
            <li>Monitor KPIs and adjust rules with your success manager</li>
          </ol>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-16 bg-blue-600 text-white rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-bold">Upgrade to a connected inventory management system</h2>
        <p className="mt-4 text-base sm:text-lg opacity-90">
          StockFlow unifies hardware, mobile, and cloud to eliminate blind spots. Get expert guidance every step of the rollout.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/auth" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow">
            Create Free Account
          </Link>
          <Link to="/demo" className="border border-white text-white font-semibold px-6 py-3 rounded-lg">
            Schedule Systems Demo
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">FAQ: Inventory management systems</h2>
        <div className="mt-8 space-y-4">
          {faqData.map((item, index) => (
            <details key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <summary className="font-semibold text-gray-900 cursor-pointer">{item.question}</summary>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </SeoPageLayout>
  );
}


