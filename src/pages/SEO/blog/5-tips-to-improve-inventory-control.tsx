import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  ClipboardCheck,
  LayoutGrid,
  BarChart3,
  TrendingUp,
  Truck,
  Zap,
  CheckCircle,
  Smartphone,
  QrCode,
  AlertTriangle,
  History,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function InventoryControlTipsPage() {
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
      question: 'What is the most effective way to improve inventory control?',
      answer:
        'Transitioning from manual spreadsheets to automated inventory software is the most impactful step. Software provides real-time data, automated alerts, and barcode scanning, which significantly reduces human error and ensures you maintain optimal stock levels.',
    },
    {
      question: 'How does ABC analysis help with inventory management?',
      answer:
        'ABC analysis categorizes stock based on value and volume. "Category A" items are your high-value/high-profit goods that require the tightest control, while "Category C" items are low-value and require less frequent monitoring. This allows you to focus resources where they impact the bottom line most.',
    },
    {
      question: 'What is the difference between a full audit and a cycle count?',
      answer:
        'A full audit involves counting every item in stock at once, usually at year-end. A cycle count is a continuous process where small subsets of inventory are counted on a rotating schedule, ensuring accuracy throughout the year without halting operations.',
    },
    {
      question: 'How can I improve my demand forecasting?',
      answer:
        'Review historical inventory records and sales data from previous years to identify seasonal trends. Using inventory software with detailed reporting allows you to compare past forecasts against actual consumption, helping you refine your future ordering patterns.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: '5 Tips to Improve Inventory Control | StockFlow Guide',
    description:
      'Learn proven strategies to tighten inventory control, reduce waste, and boost profitability. From ABC analysis to automated forecasting.',
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
        'ABC Analysis support',
        'Cycle counting tools',
      ],
      image: 'https://www.stockflowsystems.com/inventory-control-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const tips = [
    {
      icon: LayoutGrid,
      title: '1. Organize Physical Inventory',
      description: 'Clean out storage areas and create a detailed digital list. Replace messy spreadsheets with mobile-first software for better visibility.',
    },
    {
      icon: ClipboardCheck,
      title: '2. Modernize Your Audits',
      description: 'Implement inventory cycle counts to verify stock levels incrementally. Use mobile scanning to increase speed and accuracy during counts.',
    },
    {
      icon: BarChart3,
      title: '3. Practice ABC Analysis',
      description: 'Categorize stock by profitability. Focus 70% of your control efforts on the 20% of inventory (Category A) that drives your revenue.',
    },
    {
      icon: TrendingUp,
      title: '4. Refine Demand Forecasting',
      description: 'Compare historical sales data against consumption records. Adjust reorder points based on real usage patterns rather than guesswork.',
    },
    {
      icon: Truck,
      title: '5. Audit Your Supply Chain',
      description: 'Evaluate vendor reliability and lead times. Reliable suppliers allow you to maintain leaner stock levels with higher confidence.',
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
        title="5 Tips to Improve Inventory Control & Management 2026"
        description="Master inventory control with these 5 essential tips. Reduce shrinkage, improve forecasting, and automate your small business stock management."
        keywords="inventory control tips, improve inventory management, abc analysis, inventory auditing, demand forecasting, stockflow inventory"
        url="https://www.stockflowsystems.com/tips-to-improve-inventory-control"
        structuredData={structuredData}
      />

      {/* Hero Content Section */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">How to Practice Tighter Inventory Control</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Inventory control is the delicate balance of maintaining enough stock to satisfy demand without tying up excessive capital. By implementing <strong>strategic inventory management</strong>, businesses can save time, reduce stress, and significantly boost profitability.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Whether you are managing raw materials or finished goods, moving from manual logs to <strong>automated inventory software</strong> is the most effective way to gain the insights needed for growth.
          </p>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Proven Ways to Optimize Your Inventory</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <tip.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                <p className="text-gray-600 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Content: ABC Analysis */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Deep Dive: ABC Analysis</h2>
              <p className="text-gray-600 leading-relaxed">
                You don’t have to obsess over every last item to improve your strategy. <strong>ABC Analysis</strong> divides your stock into three high-impact categories:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="font-bold text-blue-600">A:</div>
                  <span className="text-gray-600"><strong>High Value.</strong> 20% of inventory that brings in 70% of profits. Requires tight control.</span>
                </li>
                <li className="flex gap-3">
                  <div className="font-bold text-blue-600">B:</div>
                  <span className="text-gray-600"><strong>Moderate Value.</strong> 30% of inventory; 25% of profits. Balanced monitoring.</span>
                </li>
                <li className="flex gap-3">
                  <div className="font-bold text-blue-600">C:</div>
                  <span className="text-gray-600"><strong>Low Value.</strong> 50% of inventory; 5% of profits. Loose control is acceptable.</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-blue-900 p-8 rounded-2xl text-white">
              <Zap className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-xl font-bold mb-4">Why Software Beats Spreadsheets</h4>
              <ul className="space-y-3 opacity-90">
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Automated reorder points</li>
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Real-time multi-user syncing</li>
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Mobile QR & Barcode scanning</li>
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> High-res visual verification</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Actionable Strategy Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Transform Your Operations?</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-6 bg-white border rounded-lg">
              <h4 className="font-bold text-blue-600 mb-2 text-lg flex items-center gap-2">
                <Smartphone className="w-5 h-5" /> Start Small
              </h4>
              <p className="text-sm text-gray-600">Begin by digitizing one high-value category. Use your phone to scan and upload photos to create a baseline of accuracy.</p>
            </div>
            <div className="p-6 bg-white border rounded-lg">
              <h4 className="font-bold text-blue-600 mb-2 text-lg flex items-center gap-2">
                <Search className="w-5 h-5" /> Audit Voids
              </h4>
              <p className="text-sm text-gray-600">Run a cycle count report. Identify which items have the highest shrinkage and implement stricter user permissions for those SKUs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border rounded-xl hover:shadow-sm">
            <QrCode className="text-blue-600 mb-3" />
            <h5 className="font-bold mb-2">QR Generation</h5>
            <p className="text-xs text-gray-500">Create custom labels for items without barcodes.</p>
          </div>
          <div className="p-6 border rounded-xl hover:shadow-sm">
            <AlertTriangle className="text-blue-600 mb-3" />
            <h5 className="font-bold mb-2">Low Stock Alerts</h5>
            <p className="text-xs text-gray-500">Instant notifications when par levels are breached.</p>
          </div>
          <div className="p-6 border rounded-xl hover:shadow-sm">
            <History className="text-blue-600 mb-3" />
            <h5 className="font-bold mb-2">Audit History</h5>
            <p className="text-xs text-gray-500">Track every change made by every team member.</p>
          </div>
          <div className="p-6 border rounded-xl hover:shadow-sm">
            <ShieldCheck className="text-blue-600 mb-3" />
            <h5 className="font-bold mb-2">SSO Enabled</h5>
            <p className="text-xs text-gray-500">Enterprise-grade security for growing teams.</p>
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