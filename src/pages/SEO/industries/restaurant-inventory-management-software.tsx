import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Utensils,
  Smartphone,
  AlertCircle,
  QrCode,
  LineChart,
  Users,
  IceCream,
  Wine,
  ClipboardList,
  ShieldCheck,
  CheckCircle,
  WifiOff,
  Clock,
  TrendingDown,
  BarChart3,
  Zap,
  Database,
  RefreshCw
} from 'lucide-react';

import { KeyTakeaways } from '@/components/KeyTakeaways';

export default function RestaurantInventoryManagementPage() {
  
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
      question: 'What software do restaurants use for inventory?',
      answer:
        'Restaurants use a variety of software depending on their size and needs. Popular options include all-in-one POS systems with built-in inventory (like Square for Restaurants or Toast), specialized inventory platforms (like MarketMan or xtraCHEF), and comprehensive enterprise suites (like Restaurant365 or Crunchtime). The best choice depends on your menu complexity, number of locations, and need for integrations with accounting or vendors[citation:4][citation:8][citation:9].',
    },
    {
      question: 'What is the best inventory method for restaurants?',
      answer:
        'The most effective method is a perpetual inventory system integrated with your POS. This provides real-time tracking where ingredient levels are automatically deducted as menu items are sold. Key components include ingredient-level recipe tracking to tie usage to sales, First-In-First-Out (FIFO) rotation to reduce spoilage, and setting data-driven par levels for automated reordering. This method replaces error-prone manual counts with accurate, real-time data[citation:1][citation:6].',
    },
    {
      question: 'How to track inventory in a restaurant?',
      answer:
        'Effective tracking involves consistent processes and the right tools. Best practices include: 1) Scheduling regular counts (daily for high-cost items, weekly for full inventory) at the same time each day[citation:6]; 2) Using mobile apps with barcode scanning to speed up counts and reduce errors[citation:1]; 3) Organizing storage areas and labeling shelves for efficiency[citation:6]; and 4) Implementing software that provides real-time dashboards and low-stock alerts to prevent shortages during service[citation:1][citation:3].',
    },
    {
      question: 'Can I manage inventory for multiple restaurant locations?',
      answer:
        'Yes. Multi-location inventory management is a core feature of enterprise-grade software like Supy, Restaurant365, and Operandio. These platforms provide a centralized cloud dashboard where owners can see live stock levels, usage trends, and cost data across all sites. This enables smarter purchasing decisions, allows for transfers between locations to reduce waste, and ensures recipe and portion consistency across your brand[citation:2][citation:8][citation:10].',
    },
    {
      question: 'Is free restaurant inventory management software available?',
      answer:
        'Yes, some platforms offer free entry-level plans. Square for Restaurants has a free plan with basic inventory features, and xtraCHEF by Toast offers a $0 starter kit for single-location restaurants[citation:4][citation:8]. These are suitable for very small operations but often lack advanced features like detailed recipe costing or vendor integrations. For growing restaurants, paid plans starting around $60-$200 per month provide more robust automation and reporting capabilities[citation:4][citation:7].',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Restaurant Inventory Management Software | 2026 Guide & Comparisons',
    description:
      'Explore the best restaurant inventory software for 2026. Compare features, pricing, and benefits of leading systems like MarketMan, Toast, and Square to reduce food costs and waste.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Hospitality Edition',
      description:
        'A mobile inventory management solution tailored for restaurants, bars, and catering businesses to track stock and automate reordering.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Mobile QR/Barcode counting',
        'Perishable stock alerts',
        'Multi-location bar & kitchen tracking',
        'Offline counting mode',
        'Usage analytics & waste reporting',
        'Supplier management',
      ],
      image: 'https://www.stockflowsystems.com/restaurant-inventory-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  // Enhanced and re-categorized features based on search insights
  const coreFeatures = [
    {
      icon: RefreshCw,
      title: 'Real-Time Auto-86 & Menu Sync',
      description: 'Prevent customer disappointment by automatically removing sold-out items from your POS, kitchen displays, and online ordering the moment stock runs out[citation:1].',
    },
    {
      icon: Database,
      title: 'Ingredient-Level Recipe Costing',
      description: 'Link every recipe and modifier directly to inventory. Track exact food costs per dish and identify your most (and least) profitable menu items with precision[citation:1][citation:7].',
    },
    {
      icon: AlertCircle,
      title: 'Smart Low-Stock & Par Alerts',
      description: 'Receive instant phone notifications when key ingredients dip below your preset levels. Proactive alerts prevent mid-service stockouts and enable timely reordering[citation:1][citation:3].',
    },
    {
      icon: QrCode,
      title: 'Mobile Barcode Scanning',
      description: 'Ditch clipboards and paper. Use any smartphone to scan items during counts and receiving, slashing counting time by up to 85% and drastically reducing human error[citation:1][citation:6].',
    },
  ];

  const advancedCapabilities = [
    {
      icon: TrendingDown,
      title: 'Theoretical vs. Actual Cost Analysis',
      description: 'Pinpoint the source of shrink. The system compares expected usage (based on recipes and sales) against actual counts to reveal waste, portioning issues, or theft[citation:1][citation:10].',
    },
    {
      icon: Zap,
      title: 'Automated Purchasing & Vendor Management',
      description: 'Generate purchase orders directly from low-stock alerts. Track price fluctuations from suppliers, manage invoices, and streamline your entire procurement cycle[citation:4][citation:7].',
    },
    {
      icon: BarChart3,
      title: 'Consolidated Multi-Unit Dashboards',
      description: 'For restaurant groups, get a single-pane-of-glass view of inventory, costs, and trends across all locations to standardize operations and leverage combined purchasing power[citation:2][citation:10].',
    },
    {
      icon: WifiOff,
      title: 'Offline Counting Mode',
      description: 'Inventory doesn’t stop in dead zones. Update counts in basements, walk-ins, or freezers; data syncs automatically once reconnected.',
    },
  ];

  // Software Comparison Data derived from search results
  const softwareComparison = [
    {
      name: 'Stockflow',
      bestFor: 'Restaurants, bars, and catering businesses',
      keyFeature: 'Mobile QR/Barcode counting, perishable stock alerts, multi-location bar & kitchen tracking, offline counting mode, usage analytics & waste reporting, supplier management',
      pricing: 'Free',
    },
    {
      name: 'Square for Restaurants',
      bestFor: 'Small to midsize restaurants, affordability',
      keyFeature: 'Free plan available, easy POS integration',
      pricing: 'Free - $60+/month[citation:4]',
    },
    {
      name: 'Toast / xtraCHEF',
      bestFor: 'Fast-casual & full-service restaurants',
      keyFeature: 'Tight POS integration, inventory management',
      pricing: '$0 Starter Kit - Custom[citation:4][citation:8]',
    },
    {
      name: 'Restaurant365',
      bestFor: 'Multi-location enterprise restaurant groups',
      keyFeature: 'All-in-one operations, accounting & inventory suite',
      pricing: 'Custom (Enterprise-focused)[citation:8][citation:9]',
    },
  ];

  const keyTakeaways = [
    'Specialized restaurant inventory software can reduce food costs by 3-5% on average by eliminating over-ordering, spoilage, and portioning waste[citation:1][citation:7].',
    'The most critical feature is ingredient-level tracking tied to recipes, which automates cost calculation and reveals true menu profitability[citation:1][citation:9].',
    'Mobile barcode scanning can cut weekly inventory counting time from 6-7 hours to under one hour, freeing managers for strategic tasks[citation:6].',
    'For multi-location groups, a centralized platform is non-negotiable for standardizing costs, recipes, and purchasing across all sites[citation:2][citation:10].',
  ];

  return (
    <SeoPageLayout
      title="Best Restaurant Inventory Management Software 2026"
      heroTitle="Restaurant Inventory Software: The 2026 Guide to Cutting Food Costs"
      updatedDate="01/15/2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Best Restaurant Inventory Software 2026 | Compare Systems & Features"
        description="Cut food costs and reduce waste. Our 2026 guide compares top restaurant inventory software like MarketMan, Toast, and Square on features, pricing, and use cases."
        keywords="restaurant inventory software, bar inventory app, food cost software, inventory management for restaurants, best restaurant inventory system, MarketMan, Toast, Square"
        url="https://www.stockflowsystems.com/restaurant-inventory-software"
        structuredData={structuredData}
      />

      {/* Core Explanation - Updated with Problem/Solution Focus */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">Beyond Spreadsheets: Modern Inventory Control for Restaurants</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Food waste costs the average restaurant <strong>4-10% of its revenue</strong>[citation:6], while manual inventory counts steal 6-7 hours from a manager's week[citation:6]. In 2026, <strong>restaurant inventory software</strong> is the essential tool that turns this costly guesswork into automated, data-driven control.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            This guide breaks down the systems—from all-in-one POS platforms to specialized cost-control suites—that help operators track every ounce of truffle oil and bottle of liquor, automate reordering, and finally understand their true plate cost to protect shrinking margins.
          </p>
        </div>
      </section>

      {/* Why It Matters & Core Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How Inventory Software Solves Core Restaurant Problems</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {coreFeatures.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <f.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Advanced Capabilities */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
            <h3 className="text-2xl font-bold mb-8 text-center">Advanced Capabilities for Growing Operations</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advancedCapabilities.map((f, i) => (
                <div key={i} className="text-center">
                  <f.icon className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
                  <h4 className="font-semibold mb-2">{f.title}</h4>
                  <p className="text-gray-600 text-sm">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Software Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Comparing Leading Restaurant Inventory Software</h2>
          <p className="text-gray-600 mb-12">The "best" software depends entirely on your restaurant type, size, and specific pain points. Below is a snapshot of top contenders in 2026.</p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-6 font-bold text-gray-900">Software</th>
                  <th className="text-left p-6 font-bold text-gray-900">Best For</th>
                  <th className="text-left p-6 font-bold text-gray-900">Standout Feature</th>
                  <th className="text-left p-6 font-bold text-gray-900">Starting Price (Monthly)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {softwareComparison.map((software, index) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="p-6 align-top font-medium">{software.name}</td>
                    <td className="p-6 align-top text-gray-700">{software.bestFor}</td>
                    <td className="p-6 align-top text-gray-700">{software.keyFeature}</td>
                    <td className="p-6 align-top">
                      <span className="font-medium text-gray-900">{software.pricing}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-gray-500 text-center">Data synthesized from vendor sites and industry comparisons[citation:4][citation:7][citation:8]. Prices are for entry-level plans; enterprise pricing is custom.</p>
        </div>
      </section>

      {/* Operational Insights & Data */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">The Data-Driven Kitchen: From Insight to Action</h2>
              <p className="text-gray-600 mb-6">
                Modern software does more than count—it analyzes. By connecting inventory data directly to sales and recipes, managers gain actionable insights that were previously invisible[citation:9].
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Identify Waste Sources:</strong> See if waste comes from over-prepping, spoilage, or portioning errors to target corrective training[citation:6].</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Menu Engineering:</strong> Accurately calculate the profitability of every dish, enabling data-driven decisions to adjust prices, portions, or promote high-margin items[citation:1][citation:7].</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Vendor Price Tracking:</strong> Automatically flag sudden price increases from suppliers, giving you the data to negotiate or seek alternative vendors[citation:7].</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
              <h4 className="font-bold mb-4 text-xl text-blue-900">Reported Results from Implementations</h4>
              <ul className="space-y-4">
                <li className="flex gap-2 items-start">
                  <Zap className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Time Saved:</strong> Inventory counting time reduced from 6-7 hours to under 1 hour per session[citation:6].</span>
                </li>
                <li className="flex gap-2 items-start">
                  <TrendingDown className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Cost Reduction:</strong> Food cost percentage decreased by 3-5% on average, with some restaurants reporting drops from 39% to 33%[citation:7].</span>
                </li>
                <li className="flex gap-2 items-start">
                  <ShieldCheck className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Theft & Shrink Control:</strong> Clear variance reporting helps identify and prevent unexplained losses, with one operator saving "$600 a month on sodas alone"[citation:7].</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Considerations */}
      <section className="py-20 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Choosing the Right System: Key Considerations</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-6 bg-white border rounded-xl">
              <h4 className="font-bold text-blue-600 mb-3">For Small / Single Locations</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Prioritize ease of use and low cost.</li>
                <li>• Consider free plans from Square or Toast to start.</li>
                <li>• Ensure basic features: mobile counting, low-stock alerts, simple reporting.</li>
                <li>• Confirm integration with your existing POS if separate.</li>
              </ul>
            </div>
            <div className="p-6 bg-white border rounded-xl">
              <h4 className="font-bold text-blue-600 mb-3">For Multi-Unit Restaurant Groups</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Centralized dashboard and reporting are non-negotiable.</li>
                <li>• Look for advanced features: automated purchasing, commissary management, advanced APIs.</li>
                <li>• Evaluate vendor integration capabilities to streamline supply chain.</li>
                <li>• Prioritize scalability and dedicated support for enterprise needs.</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-gray-600">
            The most successful implementations start by defining your greatest pain points—is it waste, time spent counting, lack of cost visibility, or managing across locations?—and choosing a platform that directly addresses them[citation:9].
          </p>
        </div>
      </section>

      {/* FAQ Section - Using User's Specified Structure */}
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