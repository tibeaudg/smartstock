import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Network,
  Boxes,
  Activity,
  QrCode,
  Bell,
  Eye,
  ShieldAlert,
  BarChart3,
  Cpu,
  Truck,
  CheckCircle,
  Share2
} from 'lucide-react';

export default function SupplyChainOptimizationPage() {
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
      question: 'How does materials tracking improve supply chain efficiency?',
      answer:
        'Materials tracking provides real-time visibility into the movement and consumption of raw materials, WIP, and finished goods. By knowing exactly where resources are, businesses can implement perpetual inventory, which reduces the need for "just-in-case" excess stock and prevents production-stopping stockouts.',
    },
    {
      question: 'What is the role of automation in supply chain optimization?',
      answer:
        'Automation, such as low-stock alerts and mobile QR scanning, removes the human error associated with manual logs. This ensures that procurement decisions are based on accurate data, freeing up your team to focus on strategic supplier negotiations and high-level problem solving.',
    },
    {
      question: 'How can I increase transparency with my suppliers?',
      answer:
        'Start by sharing materials tracking data with key partners. If full data integration is not possible, regularly scheduled data-driven conversations about demand fluctuations and manufacturing lead times can provide the visibility needed to optimize the entire network.',
    },
    {
      question: 'What are the risks of using manual systems for materials tracking?',
      answer:
        'Manual systems are prone to lag and error, making it impossible to respond quickly to supply chain disruptions. Without real-time data, businesses often suffer from bullwhip effects, where small changes in customer demand lead to massive, costly fluctuations in inventory orders.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Supply Chain Optimization via Materials Tracking | StockFlow',
    description:
      'Learn how to leverage materials tracking to create a leaner, more transparent supply chain. Discover strategies for automation, transparency, and demand forecasting.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Supply Chain Suite',
      description:
        'Advanced inventory and materials tracking software designed to provide end-to-end supply chain visibility through QR scanning and automated alerts.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'End-to-end materials tracking',
        'Real-time supply chain visibility',
        'Automated low-stock notifications',
        'QR & Barcode scanning',
        'Multi-partner data sharing',
      ],
      image: 'https://www.stockflowsystems.com/supply-chain-optimization-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const optimizationSteps = [
    {
      icon: Activity,
      title: '1. Implement Perpetual Tracking',
      description: 'Shift away from static spreadsheets. Use a system that updates stock levels instantly as materials move through production or between sites.',
    },
    {
      icon: Cpu,
      title: '2. Leverage Intelligent Automation',
      description: 'Set automated low-stock triggers and use AI-driven reporting to eliminate tedious manual counts and prioritize high-value logistics challenges.',
    },
    {
      icon: Share2,
      title: '3. Drive Partner Transparency',
      description: 'Collaborate with vendors to share consumption data. Shared visibility reduces lead times and helps identify vulnerabilities before they impact the bottom line.',
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
      title="Optimize your Supply Chain with Materials Tracking"
      heroTitle="Build a Leaner, More Responsive Supply Chain"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Supply Chain Materials Tracking Guide 2026 | StockFlow"
        description="Optimize your supply chain with precision materials tracking. Learn how real-time data, QR codes, and partner transparency drive operational excellence."
        keywords="supply chain optimization, materials tracking software, inventory transparency, perpetual inventory, stockflow materials"
        url="https://www.stockflowsystems.com/supply-chain-materials-tracking"
        structuredData={structuredData}
      />

      {/* Hero Narrative */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Turning Visibility into Velocity</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            A lean supply chain is only as strong as its <strong>materials tracking</strong> strategy. Without precise data on where your raw materials, work-in-progress, and finished goods are at any given second, your operation is forced to rely on "safety stock"—an expensive buffer for uncertainty.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            By optimizing your tracking processes through <strong>perpetual inventory</strong> and modern automation, you replace that uncertainty with absolute transparency, allowing your business to scale without the weight of excess inventory.
          </p>
        </div>
      </section>

      {/* Optimization Steps Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">3 Pillars of Supply Chain Optimization</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {optimizationSteps.map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <step.icon className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Deep Dive */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Unlocking the Rewards of Tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                Materials tracking isn't just about knowing where things are; it's about identifying <strong>vulnerabilities</strong> and <strong>forecasting demand</strong> with unprecedented precision.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <ShieldAlert className="text-blue-600 w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold">Identify Risks Sooner</span>
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <BarChart3 className="text-blue-600 w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold">Data-Driven Bidding</span>
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <QrCode className="text-blue-600 w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold">360° Scan Accuracy</span>
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <Eye className="text-blue-600 w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold">Site-Wide Transparency</span>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-blue-900 p-8 rounded-2xl text-white shadow-xl">
              <Network className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-2xl font-bold mb-4">The StockFlow Advantage</h4>
              <p className="opacity-90 mb-6">Modern technology that simplifies complex supply chain hurdles:</p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Mobile-First Scanning:</strong> Turn any device into a professional materials scanner.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Instant Alerts:</strong> Receive low-stock notifications for critical production inputs.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-blue-400 shrink-0 mt-1" />
                  <span><strong>Multi-Site Management:</strong> Sync data across warehouses and manufacturing floors in real time.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor Collaboration Callout */}
      <section className="py-20 bg-gray-50 border-t border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Truck className="w-12 h-12 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Beyond Your Four Walls</h2>
          <p className="text-lg text-gray-600 mb-8">
            An optimized supply chain relies on regularly scheduled coordination with vendors. By using <strong>StockFlow</strong> to export precise materials tracking data, you can have informed conversations with suppliers about lead times, market fluctuations, and transportation logistics.
          </p>
          <div className="bg-white p-6 rounded-lg border shadow-sm inline-block text-left">
            <h5 className="font-bold mb-2 flex items-center gap-2"><Boxes className="text-blue-600 w-4 h-4" /> Next Step for Optimization:</h5>
            <p className="text-sm text-gray-500">Select three critical raw materials and begin tracking their consumption via QR codes to establish your first baseline of demand data.</p>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}