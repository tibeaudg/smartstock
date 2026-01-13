import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  RefreshCw,
  ClipboardCheck,
  Zap,
  Clock,
  Database,
  Calculator,
  MapPin,
  TrendingUp,
  BarChart3,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function PerpetualVsPhysicalInventoryPage() {
  usePageRefresh();
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
      question: 'What is the main difference between perpetual and physical inventory?',
      answer:
        'Perpetual inventory is a continuous tracking method that updates stock levels in real-time as transactions occur. Physical inventory is a periodic method where businesses manually count stock at specific intervals (monthly, quarterly, or annually) to reconcile records.',
    },
    {
      question: 'Does perpetual inventory eliminate the need for physical counts?',
      answer:
        'No. While perpetual inventory provides real-time data, businesses still need to perform occasional physical counts or "cycle counts" to account for theft, damage, or administrative errors that the software cannot see.',
    },
    {
      question: 'Which method is better for multi-location businesses?',
      answer:
        'Perpetual inventory is significantly better for multi-site operations. It allows managers to see stock levels across all locations simultaneously, facilitating easy transfers and preventing over-ordering at one site while another has a surplus.',
    },
    {
      question: 'Is perpetual inventory expensive to implement?',
      answer:
        'Costs vary. While high-end enterprise systems can be expensive, modern cloud-based apps like StockFlow offer affordable entry points, allowing small businesses to use existing smartphones for scanning and real-time updates.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Perpetual vs. Physical Inventory: Key Differences | StockFlow Guide',
    description:
      'Compare perpetual and physical inventory methods. Learn which system fits your business size, location count, and transaction volume.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Perpetual Inventory System',
      description:
        'Real-time inventory tracking software that automates stock updates, provides instant reporting, and supports mobile barcode scanning.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Real-time stock level updates',
        'Mobile barcode & QR scanning',
        'Multi-location data sharing',
        'Automated COGS tracking',
        'Low-stock reorder alerts',
      ],
      image: 'https://www.stockflowsystems.com/perpetual-vs-physical-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const comparisonFeatures = [
    {
      icon: Zap,
      title: 'Technology & Automation',
      perpetual: 'Requires software and scanning for real-time updates.',
      physical: 'Can be manual or use basic accounting software.',
    },
    {
      icon: BarChart3,
      title: 'Data Accuracy',
      perpetual: 'Instant visibility of quantity and cost at any second.',
      physical: 'Accuracy is only guaranteed on the day of the count.',
    },
    {
      icon: Clock,
      title: 'Labor Intensity',
      perpetual: 'Higher daily discipline, lower "big count" labor.',
      physical: 'Intense labor spikes during scheduled counting periods.',
    },
  ];

  const keyTakeaways = [
    'Perpetual inventory provides real-time visibility, essential for high-volume or multi-location businesses.',
    'Physical inventory is a periodic manual reconciliation that remains necessary to verify stock condition and prevent "shrinkage."',
    'Modern software makes perpetual tracking affordable for startups, eliminating the need for expensive proprietary hardware.',
    'The choice between methods depends on inventory size, transaction volume, and your budget for labor vs. technology.',
  ];

  return (
    <SeoPageLayout
      title="Perpetual vs. Physical Inventory"
      heroTitle="Real-Time Accuracy or Periodic Reconciliation?"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Perpetual vs. Physical Inventory | Which Method is Best? (2026)"
        description="Understand the core differences between perpetual and physical inventory systems. Compare technology needs, costs, and data accuracy for your business."
        keywords="perpetual inventory vs physical inventory, inventory tracking methods, real-time inventory, periodic stock count, stockflow"
        url="https://www.stockflowsystems.com/perpetual-vs-physical-inventory"
        structuredData={structuredData}
      />

      {/* Hero Narrative */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Choosing Your Path to Inventory Control</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Is your inventory data a live pulse or a historical snapshot? The difference between <strong>perpetual and physical inventory</strong> determines how you make decisions, manage costs, and scale your operations. While one offers constant updates, the other focuses on manual verification.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Understanding how these methods compare in terms of <strong>technology, labor, and accuracy</strong> is the first step toward a more profitable, efficient business model.
          </p>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">At a Glance: How They Compare</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {comparisonFeatures.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="font-bold block text-blue-900">Perpetual:</span>
                    <span className="text-gray-600">{feature.perpetual}</span>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <span className="font-bold block text-gray-900">Physical:</span>
                    <span className="text-gray-600">{feature.physical}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decision Factors */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Which Method is Right for You?</h2>
              <p className="text-gray-600 leading-relaxed">
                Selecting a method isn't just about software; it's about matching your workflow to your business goals. Consider these four critical factors:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Maximize className="text-blue-600 shrink-0 w-6 h-6" />
                  <div>
                    <span className="font-bold block">Inventory Size</span>
                    <span className="text-sm text-gray-600">Small stockrooms can be managed manually, but large warehouses become overwhelming without perpetual automation.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin className="text-blue-600 shrink-0 w-6 h-6" />
                  <div>
                    <span className="font-bold block">Business Locations</span>
                    <span className="text-sm text-gray-600">Perpetual systems excel at sharing data between multiple sites, preventing stock imbalance.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <TrendingUp className="text-blue-600 shrink-0 w-6 h-6" />
                  <div>
                    <span className="font-bold block">Transaction Volume</span>
                    <span className="text-sm text-gray-600">High-frequency sales require instant updates to keep Cost of Goods Sold (COGS) accurate.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Calculator className="text-blue-600 shrink-0 w-6 h-6" />
                  <div>
                    <span className="font-bold block">Labor Budget</span>
                    <span className="text-sm text-gray-600">Compare the cost of massive quarterly physical counts vs. the efficiency of daily scanning.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-blue-900 p-8 rounded-2xl text-white shadow-xl">
              <RefreshCw className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-2xl font-bold mb-4">The Perpetual Advantage</h4>
              <p className="opacity-90 mb-6">StockFlow makes perpetual inventory accessible for teams of all sizes:</p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Real-Time Accounting:</strong> Quantity and cost update with every scan.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Instant Reports:</strong> Run availability and usage reports on demand.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Zero Hardware Cost:</strong> Scan barcodes using the smartphone camera.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reconciliation Callout */}
      <section className="py-20 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto text-center px-4">
          <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Don't Forget the Human Element</h2>
          <p className="text-lg text-gray-600 mb-8">
            Even with the most advanced <strong>perpetual inventory software</strong>, regular <strong>physical inspections</strong> remain essential. No software can detect if an item has been damaged on the shelf or spoiled due to storage conditions. A hybrid approach—using perpetual tracking for daily operations and cycle counting for verification—is the industry gold standard.
          </p>
          <div className="bg-white p-6 rounded-lg border shadow-sm inline-block text-left">
            <h5 className="font-bold mb-2 flex items-center gap-2"><Search className="text-blue-600 w-4 h-4" /> Visual Audit Checklist:</h5>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Check for expiration dates on perishables</li>
              <li>• Inspect high-value items for physical damage</li>
              <li>• Verify shelf tags match digital QR records</li>
              <li>• Reconcile discrepancies immediately in the app</li>
            </ul>
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

function Maximize(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}