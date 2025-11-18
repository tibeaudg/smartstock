import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

const faqData = [
  {
    question: 'Is there a free bill of material management software?',
    answer: 'Yes. StockFlow includes a free plan that lets product companies build unlimited bills of material, automate component tracking, and sync finished goods with purchase and sales orders.'
  },
  {
    question: 'How does StockFlow handle bill of materials (BOM)?',
    answer: 'Create multi-level BOMs, define component substitutions, and trigger low-stock alerts for raw materials. Production runs automatically consume components and update finished goods inventory.'
  },
  {
    question: 'Can I import existing BOM data from spreadsheets?',
    answer: 'You can upload CSV or Excel templates to import BOM structures, component costs, and supplier details in minutes.'
  },
  {
    question: 'Does the free plan include barcode or traceability features?',
    answer: 'The free plan includes barcode scanning through the mobile app, lot tracking, and activity logs so you always know which components were used in production.'
  },
  {
    question: 'When should I upgrade from the free plan?',
    answer: 'Upgrade when you need advanced automations, API integrations, or more than 30 active products. Paid tiers add capacity planning, finite scheduling, and deeper analytics.'
  }
];

const structuredData = generateComprehensiveStructuredData('software', {
  title: 'Free Bill of Material Management Software | StockFlow',
  url: 'https://www.stockflow.be/bill-of-material-management-software-free',
  description:
    'Manage bills of material for free with StockFlow. Track components, automate production runs, and sync finished goods with purchasing. Start today.',
  breadcrumbs: [
    { name: 'Home', url: 'https://www.stockflow.be/', position: 1 },
    { name: 'Free Bill of Material Management Software', url: 'https://www.stockflow.be/bill-of-material-management-software-free', position: 2 }
  ],
  faqData,
  softwareData: {
    name: 'StockFlow BOM Management',
    description: 'Free bill of material management software with production workflows, barcode tracking, and purchasing automation.',
    category: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    price: '0',
    currency: 'EUR',
    rating: {
      value: '4.8',
      count: '127'
    },
    features: [
      'Multi-level BOM builder',
      'Automatic component allocation',
      'Production order tracking',
      'Barcode and lot traceability',
      'Supplier and cost management',
      'Real-time stock visibility'
    ],
    image: 'https://www.stockflow.be/Inventory-Management.png',
    url: 'https://www.stockflow.be/bill-of-material-management-software-free'
  }
});

export default function BillOfMaterialManagementSoftwareFreePage() {
  usePageRefresh();

  return (
    <SeoPageLayout title="Free Bill of Material Management Software">
      <SEO
        title="Bill Of Material Management Software Free 2025"
        description="Discover how bill of material management software free to optimize your inventory management. Find out how bill of material management software free to. Try ..."
        keywords="bill of material management software free, free bom software, free manufacturing inventory, bom management tool, production inventory software, stockflow"
        url="https://www.stockflow.be/bill-of-material-management-software-free"
        structuredData={structuredData}
      />

      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Free BOM Software</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
              Free Bill of Material Management Software for Makers & Manufacturers
            </h1>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Build accurate bills of material, allocate components automatically, and keep production aligned with purchasing. StockFlow brings manufacturing-grade inventory management to small teams with a generous free plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/auth" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg text-center">
                Start Free Today
              </Link>
              <Link to="/demo" className="border border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-lg text-center">
                Book BOM Demo
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-3">30 products free • Barcode scanning • Guided onboarding</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">BOM features included:</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>âœ… Multi-level BOMs with component versioning</li>
              <li>âœ… Automatic cost roll-ups and margin tracking</li>
              <li>âœ… Purchase suggestions for raw materials</li>
              <li>âœ… Mobile barcode app for production picks</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-16 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why manufacturers trust StockFlow for BOM control</h2>
          <p className="text-gray-700 leading-relaxed">
            StockFlow unifies inventory, purchasing, and production so every component is accounted for. Build reusable templates, push work orders to the shop floor, and track costs automatically. Perfect for batches, kits, and make-to-order workflows.
          </p>
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Template Libraries</h3>
              <p className="text-sm text-gray-600 mt-2">Save BOM templates for popular products and clone them for new production runs in seconds.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Real-Time Costing</h3>
              <p className="text-sm text-gray-600 mt-2">Component cost updates automatically flow into finished good pricing so you always know your margins.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Supplier Collaboration</h3>
              <p className="text-sm text-gray-600 mt-2">Generate purchase orders from approved BOMs and notify suppliers automatically.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900">Free plan limits</h3>
          <ul className="mt-5 space-y-3 text-sm text-gray-700">
            <li>• Up to 30 active finished products</li>
            <li>• Unlimited components and raw materials</li>
            <li>• 2 team members with barcode access</li>
            <li>• Email support with 24h response time</li>
          </ul>
          <p className="text-sm text-gray-600 mt-6">Upgrade to unlock MRP planning, demand forecasting, and API integrations.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-16 bg-blue-600 text-white rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-bold">Launch your free BOM workspace today</h2>
        <p className="mt-4 text-base sm:text-lg opacity-90">
          Connect purchasing, production, and inventory in one real-time dashboard. StockFlow keeps every component counted and every build profitable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/auth" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow">
            Create Free Account
          </Link>
          <Link to="/demo" className="border border-white text-white font-semibold px-6 py-3 rounded-lg">
            Schedule Manufacturing Demo
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">FAQ: Bill of Material Management Software</h2>
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




