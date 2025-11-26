import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

const faqData = [
  {
    question: 'What makes StockFlow an all-in-one inventory management software solution?',
    answer: 'StockFlow combines purchasing, warehouse operations, sales channel sync, reporting, and barcode workflows. The platform replaces spreadsheets and point tools with a single source of truth.'
  },
  {
    question: 'Can StockFlow integrate with my existing software stack?',
    answer: 'Yes. StockFlow offers native integrations with Shopify, WooCommerce, Exact, Zoho Books, and provides open APIs plus Zapier connectors for custom workflows.'
  },
  {
    question: 'Do I need a large team to implement StockFlow?',
    answer: 'No. Guided onboarding and data import templates help teams go live in under two weeks. We provide dedicated success managers regardless of your plan.'
  },
  {
    question: 'How does pricing work?',
    answer: 'Start free for up to 30 products. Paid tiers unlock advanced automations, analytics, and additional users. Pricing scales predictably with your active SKUs.'
  },
  {
    question: 'Is StockFlow suitable for multi-location inventory?',
    answer: 'Absolutely. You can manage multiple warehouses and retail stores with transfer workflows, per-location reorder points, and mobile scanning.'
  }
];

const structuredData = generateComprehensiveStructuredData('software', {
  title: 'Inventory Management Software Solutions | StockFlow',
  url: 'https://www.stockflow.be/inventory-management-software-solutions',
  description:
    'Explore StockFlow’s inventory management software solutions. Unify purchasing, warehousing, and analytics with barcode automation and multi-location control.',
  breadcrumbs: [
    { name: 'Home', url: 'https://www.stockflow.be/', position: 1 },
    { name: 'Inventory Management Software', url: 'https://www.stockflow.be/inventory-management-software', position: 2 },
    { name: 'Inventory Management Software Solutions', url: 'https://www.stockflow.be/inventory-management-software-solutions', position: 3 }
  ],
  faqData,
  softwareData: {
    name: 'StockFlow Inventory Management Solutions',
    description: 'Cloud-based inventory management software solution with purchasing automation, warehouse management, and analytics.',
    category: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    price: '0',
    currency: 'EUR',
    rating: {
      value: '4.8',
      count: '168'
    },
    features: [
      'Purchasing automation',
      'Barcode & mobile scanning',
      'Multi-warehouse management',
      'Sales channel integrations',
      'Demand forecasting',
      'Real-time analytics'
    ],
    image: 'https://www.stockflow.be/Inventory-Management.png',
    url: 'https://www.stockflow.be/inventory-management-software-solutions'
  }
});

export default function InventoryManagementSoftwareSolutionsPage() {
  usePageRefresh();

  return (
    <SeoPageLayout 
      title="Inventory Management Software Solutions"
      heroTitle="Inventory Management Software Solutions"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Inventory Management Software Solutions 2025 | Complete Solutions | StockFlow"
        description="Get complete inventory management software solutions. Unify purchasing, warehousing, and analytics with barcode automation and multi-location control. Free plan for up to 100 products. Start free trial."
        keywords="inventory management software solutions, inventory solutions, inventory management solution, stock management solution, inventory system software, cloud inventory solution, inventory management systems solutions, stockflow, stock flow"
        url="https://www.stockflow.be/solutions/inventory-management-software-solutions"
        structuredData={structuredData}
      />

      <section className="bg-blue-50 rounded-3xl px-6 sm:px-10 py-12 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center text-xs sm:text-sm font-semibold uppercase tracking-wide text-blue-700 bg-white/80 px-3 py-1 rounded-full">
              Complete Inventory Management Solutions
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
              One solution to control purchasing, stock, and fulfillment
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mt-5 leading-relaxed">
              StockFlow gives operations, finance, and sales teams a shared platform for demand planning, warehouse efficiency, and customer fulfillment. Automate routine tasks so you can focus on growth. Our <Link to="/solutions/inventory-management-software" className="text-blue-600 hover:underline font-semibold">inventory management software</Link> provides comprehensive solutions for businesses of all sizes. Explore <Link to="/solutions/inventory-software" className="text-blue-600 hover:underline font-semibold">inventory software</Link> options or learn about <Link to="/solutions/inventory-management-systems-solutions" className="text-blue-600 hover:underline font-semibold">inventory management systems solutions</Link>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg text-center">
                Start Free
              </Link>
              <Link to="/demo" className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg text-center">
                Explore Solutions Demo
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">Trusted by wholesalers, retailers & D2C brands across Europe</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-lg font-semibold text-gray-900">Solution Highlights</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>âœ… Automated purchase orders and supplier portals</li>
              <li>âœ… Real-time visibility across warehouses & stores</li>
              <li>âœ… Barcode picking, packing, and cycle counts</li>
              <li>âœ… Analytics dashboard for finance & demand planning</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-16 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">A solution stack built for every inventory workflow</h2>
          <p className="text-gray-700 leading-relaxed">
            Whether you ship B2B pallets or D2C parcels, StockFlow adapts. Automate replenishment rules, orchestrate warehouse tasks, and sync sales channels for a consistent customer experience.
          </p>
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Purchasing Automation</h3>
              <p className="text-sm text-gray-600 mt-2">Generate purchase orders based on forecast demand, supplier lead times, and safety stock targets.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Warehouse Execution</h3>
              <p className="text-sm text-gray-600 mt-2">Mobile barcode workflows for receiving, putaway, picking, and packing keep accuracy above 99%.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Insights & Reporting</h3>
              <p className="text-sm text-gray-600 mt-2">Dashboards cover inventory turnover, aged stock, and profitability so leadership can act quickly.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900">Industries we serve</h3>
          <ul className="mt-5 space-y-3 text-sm text-gray-700">
            <li>• Wholesale & distribution</li>
            <li>• Ecommerce & omnichannel retail</li>
            <li>• Manufacturing & assembly</li>
            <li>• Food & beverage</li>
            <li>• Health & beauty brands</li>
          </ul>
          <Link to="/case-studies" className="inline-flex mt-6 text-blue-600 font-semibold hover:underline">
            See customer results →
          </Link>
        </div>
      </section>

    </SeoPageLayout>
  );
}




