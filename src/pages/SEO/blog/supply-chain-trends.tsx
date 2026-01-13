import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  RefreshCcw,
  Settings,
  Cpu,
  Users,
  Leaf,
  Boxes,
  Truck,
  Zap,
  CheckCircle,
  BarChart3,
  Smartphone,
  ShieldCheck
} from 'lucide-react';

export default function SupplyChainTrendsPage() {
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
      question: 'What is a circular supply chain?',
      answer:
        'A circular supply chain is an alternative to the traditional linear model. It focuses on the "reduce, reuse, and recycle" philosophy, where manufacturers break down discarded materials or end-of-life products to remake them into raw materials or new products for sale.',
    },
    {
      question: 'How can small businesses automate their supply chain?',
      answer:
        'Small businesses can start with accessible technology like inventory management apps. These tools automate data entry through QR scanning, provide AI-driven demand forecasting, and use cloud-syncing to eliminate manual spreadsheet updates.',
    },
    {
      question: 'Why is supply chain localization important for 2026?',
      answer:
        'Localization reduces the risk of global logjams and lowers transportation costs. By sourcing from a wider variety of local suppliers, businesses can fulfill customer orders faster and insulate themselves from international trade volatility.',
    },
    {
      question: 'What are the benefits of a green supply chain?',
      answer:
        'Sustainable practices reduce waste, lower utility costs, and satisfy growing consumer demand for eco-friendly brands. Furthermore, implementing green policies now helps businesses stay ahead of inevitable government environmental mandates.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: '5 Supply Chain Management Trends for 2026 | StockFlow',
    description:
      'Explore the future of supply chain management: from circular economies and automation to green logistics and labor shortage solutions.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Supply Chain Suite',
      description:
        'Advanced inventory and supply chain tracking software designed to help businesses automate operations and manage multiple vendor locations.',
      category: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      price: '0',
      currency: 'USD',
      features: [
        'AI-driven demand forecasting',
        'Multi-vendor management',
        'Automated low stock triggers',
        'Carbon footprint tracking support',
        'Mobile QR inventory auditing',
        'Real-time supply chain visibility',
      ],
      image: 'https://www.stockflowsystems.com/supply-chain-trends-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const trends = [
    {
      icon: RefreshCcw,
      title: 'Circular Supply Chains',
      description: 'Move away from linear "take-make-waste" models. Repurposing discarded materials into raw goods insulates your business from price volatility.',
    },
    {
      icon: Settings,
      title: 'Strategic Customization',
      description: 'Ditch one-size-fits-all logistics. Localize your network of partners to reduce lead times and bypass global shipping bottlenecks.',
    },
    {
      icon: Cpu,
      title: 'Hyper-Automation',
      description: 'Leverage AI for demand forecasting and mobile tools for shop floor tracking. Automation frees your team from repetitive, error-prone tasks.',
    },
    {
      icon: Users,
      title: 'Resilient Labor Strategies',
      description: 'Navigate human resource shortages by using technology to amplify your current workforce’s output and accuracy.',
    },
    {
      icon: Leaf,
      title: 'Sustainability & Green Logistics',
      description: 'Implement eco-friendly warehousing and electric fleet partnerships to meet consumer demand and stay ahead of regulatory changes.',
    },
  ];

  const keyTakeaways = [
    'Circular supply chains reduce costs and appeal to eco-conscious consumers.',
    'Automation technologies enhance accuracy and free up staff for higher-value tasks.',
    'Localizing suppliers mitigates risks from global disruptions and speeds up delivery times.',
    'Sustainable logistics practices are becoming essential for brand reputation and regulatory compliance.',
  ];

  return (
    <SeoPageLayout
      title="Supply Chain Management Trends 2026 | Small Business Strategy"
      heroTitle="Supply Chain Management Trends 2026 | Small Business Strategy"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Supply Chain Management Trends 2026 | Small Business Strategy"
        description="Stay ahead of the curve with the top 5 supply chain trends. Learn how circular economies and automation are transforming logistics for small businesses."
        keywords="supply chain trends 2026, circular supply chain, logistics automation, green supply chain, small business logistics, stockflow"
        url="https://www.stockflowsystems.com/supply-chain-management-trends"
        structuredData={structuredData}
      />

      {/* Hero Narrative */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Preparing Your Business for the Future of Logistics</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            A supply chain is an extensive network of people, businesses, and resources. In an era of constant global disruption, the most agile businesses are those that move from reactive management to <strong>proactive supply chain optimization</strong>.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            By understanding emerging trends—like <strong>circular economies</strong> and <strong>AI-driven automation</strong>—small businesses can turn logistics from a cost center into a competitive advantage.
          </p>
        </div>
      </section>

      {/* Trends Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Top 5 Trends Redefining Supply Chains</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trends.map((trend, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <trend.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{trend.title}</h3>
                <p className="text-gray-600 leading-relaxed">{trend.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive: Circular & Green */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">The Rise of the Circular Economy</h2>
              <p className="text-gray-600 leading-relaxed">
                Traditional supply chains are linear: take, make, waste. Modern businesses are thriving by closing the loop. By "remaking" discarded materials into raw goods, manufacturers can skirt the high cost of raw materials and reduce their dependence on volatile international markets.
              </p>
              <div className="flex gap-4 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
                <Leaf className="text-blue-600 shrink-0" />
                <p className="text-sm text-blue-900">
                  <strong>Sustainability Fact:</strong> 73% of modern consumers prefer brands with earth-friendly policies. Circular chains satisfy this demand while lowering overhead.
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-gray-900 text-white rounded-xl">
                  <h4 className="text-2xl font-bold mb-2">Automation</h4>
                  <p className="text-xs opacity-70 italic">AI, Robotics, & AR</p>
                </div>
                <div className="p-6 bg-blue-600 text-white rounded-xl">
                  <h4 className="text-2xl font-bold mb-2">Local</h4>
                  <p className="text-xs opacity-70 italic">Sourcing close to home</p>
                </div>
                <div className="p-6 bg-blue-100 rounded-xl">
                  <h4 className="text-2xl font-bold mb-2">Green</h4>
                  <p className="text-xs text-gray-500 italic">Net zero logistics</p>
                </div>
                <div className="p-6 bg-gray-100 rounded-xl">
                  <h4 className="text-2xl font-bold mb-2">Data</h4>
                  <p className="text-xs text-gray-500 italic">Predictive insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Integration Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Implementation: Start Small, Think Big</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 bg-white border rounded-2xl shadow-sm">
              <Zap className="text-blue-600 mb-4 w-10 h-10" />
              <h4 className="text-xl font-bold mb-3">Incremental Automation</h4>
              <p className="text-gray-600 mb-4">You don't need robots today. Start by digitizing your inventory with an app to eliminate human error in the warehouse.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle className="w-4 h-4 text-green-500" /> Digital Pick Lists</li>
                <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle className="w-4 h-4 text-green-500" /> Cloud-Syncing</li>
              </ul>
            </div>
            <div className="p-8 bg-white border rounded-2xl shadow-sm">
              <Truck className="text-blue-600 mb-4 w-10 h-10" />
              <h4 className="text-xl font-bold mb-3">Localization Audit</h4>
              <p className="text-gray-600 mb-4">Evaluate your primary suppliers. Identify secondary vendors closer to your hub to act as a buffer against global logjams.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle className="w-4 h-4 text-green-500" /> Reduced Lead Times</li>
                <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle className="w-4 h-4 text-green-500" /> Lower Carbon Footprint</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Footer */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-bold text-sm">Mobile First</p>
            </div>
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-bold text-sm">AI Analytics</p>
            </div>
            <div className="text-center">
              <Boxes className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-bold text-sm">Multi-Location</p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-bold text-sm">SOC 2 Secure</p>
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