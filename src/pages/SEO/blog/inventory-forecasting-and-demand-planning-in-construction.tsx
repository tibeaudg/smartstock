import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  LineChart,
  HardHat,
  Truck,
  Calendar,
  AlertTriangle,
  Users,
  Database,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Layers
} from 'lucide-react';

export default function ConstructionForecastingPage() {
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
      question: 'What is the difference between inventory forecasting and demand planning in construction?',
      answer:
        'Inventory forecasting is the data-driven process of predicting how much material and equipment you will need for specific project phases. Demand planning is the broader strategy that coordinates these forecasts with supply chain schedules, labor availability, and financial budgets to ensure project continuity.',
    },
    {
      question: 'How do lead times affect construction inventory planning?',
      answer:
        'Lead times must account for the entire cycle: from the moment an order is placed, through supplier processing and shipping, to final stocking on the job site. Failing to factor in these windows often results in project-stopping stockouts or costly emergency shipping fees.',
    },
    {
      question: 'Why is historical data important for construction forecasting?',
      answer:
        'Analyzing past projects helps identify patterns in material waste, typical rework requirements, and seasonal fluctuations. This data allows for more accurate predictive modeling, ensuring that current project estimates are grounded in reality rather than guesswork.',
    },
    {
      question: 'Can inventory software help with seasonal demand changes?',
      answer:
        'Yes. Construction inventory software like StockFlow allows you to track usage patterns over time. This helps you avoid overstocking weather-dependent materials (like roofing during winter) and ensures you have high-demand resources ready for peak building seasons.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Construction Inventory Forecasting & Demand Planning | StockFlow',
    description:
      'Master construction logistics with data-driven inventory forecasting. Learn best practices for demand planning, resource allocation, and lead time management.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Construction Pro',
      description:
        'Advanced inventory management for construction firms, featuring real-time tracking, low-stock alerts, and cross-site resource allocation.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Real-time material tracking',
        'Automated low-stock alerts',
        'Cross-site resource reallocation',
        'Predictive usage reporting',
        'Mobile QR/Barcode scanning',
      ],
      image: 'https://www.stockflowsystems.com/construction-forecasting-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const bestPractices = [
    {
      icon: Users,
      title: '1. Cross-Team Sync',
      description: 'Break down silos between the field and the office. Real-time communication ensures that a delay on site is instantly reflected in procurement plans.',
    },
    {
      icon: Database,
      title: '2. Historical Analysis',
      description: 'Look back at previous job actuals versus estimates. Use these margins to refine future material requirements and profitability targets.',
    },
    {
      icon: TrendingUp,
      title: '3. Predictive Modeling',
      description: 'Leverage data to uncover demand patterns. Predict supplier efficiency and improve competitive bidding with actionable usage insights.',
    },
    {
      icon: Layers,
      title: '4. Trend Forecasting',
      description: 'Monitor regional material shifts and industry growth. Stay ahead of supply chain volatility by tracking external market factors.',
    },
  ];

  const keyTakeaways = [
    'Accurate forecasting prevents costly project delays caused by material stockouts or emergency procurement.',
    'Effective demand planning reduces waste by ensuring excess materials are reallocated to other active job sites.',
    'Factoring in comprehensive lead times—from ordering to stocking—is essential for maintaining project timelines.',
    'Mobile-first inventory software provides the real-time data needed for agile decision-making on busy construction sites.',
  ];

  return (
    <SeoPageLayout
      title="Inventory Forecasting and Demand Planning in Construction"
      heroTitle="Optimize Construction Logistics with Precision Forecasting"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Construction Inventory Forecasting 2026 | Demand Planning Guide"
        description="Improve project profitability with effective construction demand planning. Discover best practices for forecasting materials, equipment, and resources."
        keywords="construction inventory forecasting, demand planning construction, material planning software, construction resource allocation, stockflow construction"
        url="https://www.stockflowsystems.com/construction-inventory-forecasting"
        structuredData={structuredData}
      />

      {/* Hero Narrative Section */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">The Blueprint for Material Success</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            In the high-stakes world of construction, profitability is built on the ability to predict the future. <strong>Inventory forecasting and demand planning</strong> are the dual engines that drive project timelines, manage budgets, and ensure client satisfaction by preventing the twin traps of <strong>overstock</strong> and <strong>material shortages</strong>.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            By digitizing your field operations and leveraging <strong>predictive modeling</strong>, your firm can transform from reactive ordering to proactive, data-driven resource management across every job site.
          </p>
        </div>
      </section>

      {/* Planning Methods Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">4 Pillars of Construction Forecasting</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestPractices.map((practice, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <practice.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{practice.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Time & Variability Focus */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Managing Lead Time & Project Variability</h2>
              <p className="text-gray-600 leading-relaxed">
                Construction inventory doesn't exist in a vacuum. Successful forecasting must account for <strong>comprehensive lead times</strong> and the inherent <strong>variability</strong> of the field:
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Clock className="text-blue-600 shrink-0" />
                  <p className="text-sm text-gray-700"><strong>The Ordering Cycle:</strong> Factor in supplier processing, logistics transit, and on-site stocking time for every critical SKU.</p>
                </div>
                <div className="flex gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <AlertTriangle className="text-orange-600 shrink-0" />
                  <p className="text-sm text-gray-700"><strong>Mitigating Volatility:</strong> Plan buffers for weather delays, equipment failures, and unexpected regulatory shifts.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-blue-900 p-8 rounded-2xl text-white shadow-xl">
              <HardHat className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-2xl font-bold mb-4">Strategic Demand Methods</h4>
              <p className="opacity-90 mb-6">Utilize advanced strategies to maintain an agile supply chain:</p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="text-blue-400 shrink-0" />
                  <span><strong>Demand Sensing:</strong> Short-term data spikes help you make rapid ordering shifts.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-blue-400 shrink-0" />
                  <span><strong>Just-in-Time (JIT):</strong> Reduce holding costs by timing deliveries exactly when needed for production.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-blue-400 shrink-0" />
                  <span><strong>Customer Segmentation:</strong> Track behavior patterns based on project types (e.g., Residential vs. HVAC).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Software Benefits Section */}
      <section className="py-20 bg-gray-50 border-t border-b">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The Power of Digital Construction Inventory</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border text-center shadow-sm">
              <BarChart3 className="text-blue-600 w-12 h-12 mx-auto mb-4" />
              <h4 className="font-bold mb-3">Real-Time Restock Alerts</h4>
              <p className="text-sm text-gray-600">Never get caught off guard. Get instant notifications when materials hit critical minimums.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border text-center shadow-sm">
              <Truck className="text-blue-600 w-12 h-12 mx-auto mb-4" />
              <h4 className="font-bold mb-3">Multi-Site Reallocation</h4>
              <p className="text-sm text-gray-600">Identify excess materials at Location A and shift them to Location B to maximize ROI.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border text-center shadow-sm">
              <LineChart className="text-blue-600 w-12 h-12 mx-auto mb-4" />
              <h4 className="font-bold mb-3">Data-Informed Bidding</h4>
              <p className="text-sm text-gray-600">Use precise usage reports to bid on future projects with tighter, more competitive margins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Callout */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Built for the Field, Ready for the Office</h2>
          <p className="text-lg text-gray-600 mb-10">
            Construction moves fast. Your inventory management should too. <strong>StockFlow</strong> provides a central hub for project collaboration, enabling your team to scan barcodes from any smartphone and update stock levels instantly—from the trailer to the top floor.
          </p>
          <div className="flex justify-center gap-4">
            <div className="px-6 py-3 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-semibold text-sm">
              14-Day Full Access Trial
            </div>
            <div className="px-6 py-3 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-semibold text-sm">
              Unlimited Project Sites
            </div>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}