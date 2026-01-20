import React from 'react';
import SEO from '@/components/SEO';
import { Link, useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  Smartphone,
  TrendingDown,
  Clock,
  DollarSign,
  BarChart3,
  Zap,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Package,
  RefreshCw,
  FileText,
  Database
} from 'lucide-react';
import { KeyTakeaways } from '@/components/KeyTakeaways';
import HeaderPublic from '@/components/HeaderPublic';
import Footer from '@/components/Footer';

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
        'Restaurants use specialized inventory management software like MarketMan, Restaurant365, Toast, xtraCHEF, and StockFlow to track food costs, manage stock levels, and automate ordering. The best choice depends on your restaurant size, menu complexity, and whether you need multi-location support. Cloud-based solutions with mobile apps and POS integration are most popular in 2026, as they provide real-time inventory tracking and reduce manual counting time by up to 85%.',
    },
    {
      question: 'What is the best inventory method for restaurants?',
      answer:
        'The most effective method is perpetual inventory tracking integrated with your POS system. This automatically deducts ingredients when menu items are sold, providing real-time stock levels. Combine this with ingredient-level recipe costing to track exact food costs per dish, FIFO (First-In-First-Out) rotation to minimize waste, and par level automation for smart reordering. This method eliminates manual counting errors and gives you accurate cost data to protect profit margins.',
    },
    {
      question: 'How to track inventory in a restaurant?',
      answer:
        'Effective restaurant inventory tracking requires: 1) Using mobile barcode scanning apps to count stock quickly and accurately, 2) Scheduling consistent counts (daily for high-value items, weekly for full inventory), 3) Implementing software that connects to your POS for automatic deductions, 4) Setting up low-stock alerts to prevent stockouts during service, and 5) Organizing storage with clear labels and FIFO rotation. Modern cloud-based systems can reduce counting time from 6-7 hours to under one hour per week.',
    },
    {
      question: 'Can I manage inventory for multiple restaurant locations?',
      answer:
        'Yes. Multi-location restaurant inventory management is essential for restaurant groups and requires specialized software like Restaurant365, Supy, MarketMan, or StockFlow. These platforms provide centralized dashboards to view real-time inventory, costs, and usage across all locations. Benefits include standardized recipes and portions, bulk purchasing power, inter-location transfers to reduce waste, and consolidated reporting for better decision-making across your entire operation.',
    },
    {
      question: 'Is there free restaurant inventory management software?',
      answer:
        'Yes, several options offer free plans. Square for Restaurants includes basic inventory features in its free plan, xtraCHEF by Toast offers a $0 starter kit for single-location restaurants, and StockFlow provides free mobile inventory tracking for small restaurants. While free plans work for very small operations, growing restaurants typically need paid plans ($60-200/month) for advanced features like recipe costing, vendor management, and multi-location support.',
    },
    {
      question: 'What is Restaurant 365 software?',
      answer:
        'Restaurant365 is a comprehensive cloud-based restaurant management platform that combines accounting, inventory management, scheduling, and operations into one system. It is designed specifically for multi-location restaurant groups and enterprise operations. The software provides real-time inventory tracking, automated invoice processing, recipe costing, and financial reporting. Restaurant365 integrates with most major POS systems and is best suited for larger operations that need enterprise-grade features and dedicated support.',
    },
    {
      question: 'How does MarketMan compare to other restaurant inventory software?',
      answer:
        'MarketMan is ideal for small to medium restaurants focusing on vendor management and inventory tracking. It excels at invoice automation, price comparison across suppliers, and inventory counting. Compared to Restaurant365 (best for enterprise operations), Toast/xtraCHEF (best for POS integration), and Supy (best for multi-brand F&B groups), MarketMan offers a middle-ground solution with strong vendor features and user-friendly interface at competitive pricing ($249-449/month).',
    },
    {
      question: 'What is food and beverage inventory management software?',
      answer:
        'Food and beverage inventory management software is specialized technology that tracks ingredients, supplies, and finished goods in restaurants, bars, hotels, and catering operations. Unlike general retail inventory systems, F&B software handles unique challenges like perishable goods with expiration dates, recipe-based inventory deductions, portion control, and batch tracking. Modern systems provide mobile counting, automated reordering, waste tracking, theoretical vs actual cost variance analysis, and integration with POS and accounting systems to reduce food costs by 3-5% on average.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Restaurant Inventory Management Software 2026 | Compare Top Systems',
    description:
      'Compare the best restaurant inventory software for 2026. Reduce food costs by 3-5% with real-time tracking, recipe costing, and automated ordering. Free trials available.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Restaurant Inventory',
      description:
        'Cloud-based restaurant inventory management software with mobile barcode scanning, recipe costing, multi-location tracking, and POS integration to reduce food waste and labor costs.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Mobile barcode/QR scanning',
        'Recipe-level ingredient tracking',
        'Real-time POS integration',
        'Multi-location management',
        'Automated purchase orders',
        'Waste tracking & analytics',
        'Offline counting mode',
        'Low-stock alerts',
        'Vendor price comparison',
        'Theoretical vs actual variance'
      ],
      image: 'https://www.stockflowsystems.com/restaurant-inventory-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const competitorSoftware = [
    {
      name: 'StockFlow',
      bestFor: 'Small to medium restaurants & bars',
      pricing: 'Free - $99/month',
      keyFeatures: [
        'Mobile barcode scanning',
        'Recipe-level costing',
        'Multi-location support',
        'Offline counting mode',
        'POS integration (Toast, Square, Clover)',
      ],
      highlight: true
    },
    {
      name: 'MarketMan',
      bestFor: 'Restaurants prioritizing vendor management',
      pricing: '$249 - $449/month',
      keyFeatures: [
        'Invoice automation',
        'Vendor price comparison',
        'Inventory tracking',
        'Purchase order management',
      ],
      highlight: false
    },
    {
      name: 'Restaurant365',
      bestFor: 'Enterprise & multi-location groups',
      pricing: 'Custom (Enterprise)',
      keyFeatures: [
        'All-in-one operations suite',
        'Accounting integration',
        'Advanced reporting',
        'Dedicated support',
      ],
      highlight: false
    },
    {
      name: 'Toast / xtraCHEF',
      bestFor: 'Toast POS users',
      pricing: '$0 Starter - Custom',
      keyFeatures: [
        'Seamless Toast POS integration',
        'Invoice processing',
        'Recipe management',
        'Cost tracking',
      ],
      highlight: false
    },
    {
      name: 'Supy',
      bestFor: 'Multi-brand F&B operations',
      pricing: 'Custom',
      keyFeatures: [
        'Real-time inventory insights',
        'Multi-location dashboard',
        'Waste reduction analytics',
        'Mobile counting',
      ],
      highlight: false
    },
  ];

  const coreFeatures = [
    {
      icon: Smartphone,
      title: 'Mobile Barcode Scanning',
      description: 'Count inventory 85% faster using your phone to scan barcodes and QR codes. Eliminate manual data entry errors and free managers from clipboard work.',
      benefit: '85% faster counting'
    },
    {
      icon: DollarSign,
      title: 'Recipe-Level Cost Tracking',
      description: 'Link every menu item to its ingredients. Know the exact cost of each dish and identify your most profitable items with precision.',
      benefit: '100% cost accuracy'
    },
    {
      icon: AlertTriangle,
      title: 'Automated Low-Stock Alerts',
      description: 'Get instant notifications when ingredients fall below par levels. Prevent stockouts during service and automate reordering.',
      benefit: 'Zero stockouts'
    },
    {
      icon: TrendingDown,
      title: 'Variance Analysis',
      description: 'Compare theoretical usage (based on sales) vs actual inventory to identify waste, portioning issues, or theft worth thousands per month.',
      benefit: '3-5% cost reduction'
    },
    {
      icon: RefreshCw,
      title: 'Real-Time POS Integration',
      description: 'Automatically deduct ingredients as menu items sell. Get live stock levels without manual updates.',
      benefit: 'Real-time accuracy'
    },
    {
      icon: Clock,
      title: 'Multi-Location Management',
      description: 'Manage inventory, recipes, and costs across all restaurant locations from one centralized dashboard.',
      benefit: 'Unified operations'
    },
  ];

  const problemStats = [
    {
      stat: '4-10%',
      label: 'of revenue lost to food waste',
      description: 'The average restaurant loses significant revenue to spoilage, over-ordering, and waste',
    },
    {
      stat: '6-7 hrs',
      label: 'per week on manual counting',
      description: 'Managers spend their entire day off doing inventory counts with spreadsheets',
    },
    {
      stat: '15-20%',
      label: 'inventory variance without software',
      description: 'Manual tracking creates massive discrepancies between recorded and actual stock',
    },
    {
      stat: '3-5%',
      label: 'cost reduction with automation',
      description: 'Restaurants using inventory software reduce food costs by an average of 3-5%',
    },
  ];

  const keyTakeaways = [
    'Restaurant inventory software reduces food costs by 3-5% on average by eliminating over-ordering, spoilage, and waste',
    'Mobile barcode scanning cuts weekly inventory counting time from 6-7 hours to under 1 hour',
    'Recipe-level ingredient tracking is the most critical feature for accurate cost analysis and menu profitability',
    'Multi-location restaurant groups must use centralized inventory platforms to standardize operations and leverage bulk purchasing',
    'Free plans exist (Square, xtraCHEF, StockFlow) but growing operations need paid solutions ($60-200/month) for advanced features',
  ];

  return (
<>
<HeaderPublic />
      <SEO
        title="Best Restaurant Inventory Software 2026 | MarketMan, Restaurant365, Toast Comparison"
        description="Compare top restaurant inventory management software for 2026. Reduce food costs 3-5% with real-time tracking, recipe costing & automated ordering. Free trials available."
        keywords="restaurant inventory software, restaurant inventory management system, inventory software for restaurants, food and beverage inventory management software, restaurant inventory app, MarketMan, Restaurant365, best inventory software for restaurants, restaurant management software, hospitality inventory tracking software"
        url="https://www.stockflowsystems.com/restaurant-inventory-software"
        structuredData={structuredData}
      />

      {/* Hero Section with Problem Statement */}
      <section className="mt-16 relative py-16 overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="food-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor" className="text-orange-600"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#food-pattern)"/>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span className="text-orange-800 text-sm font-bold">Updated January 2026</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1]">
                Stop Losing <span className="text-orange-600">$2,000+/Month</span> to Food Waste
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed">
                Restaurant inventory management software cuts food costs by <strong>3-5%</strong> by automating tracking, 
                preventing over-ordering, and identifying waste before it kills your margins. Compare the best systems for 2026.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?mode=register" className="group px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  Start Using StockFlow Free - No Credit Card Required →
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

              </div>
              
              <div className="flex flex-wrap gap-6 pt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Setup in 10 minutes
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Works with any POS
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h3 className="text-lg font-bold text-gray-900">This Week's Food Cost Impact</h3>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">CRITICAL</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Waste from Spoilage</div>
                      <div className="text-2xl font-black text-red-600">$845</div>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Over-ordering Costs</div>
                      <div className="text-2xl font-black text-orange-600">$620</div>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Manager Time Wasted</div>
                      <div className="text-2xl font-black text-yellow-600">7 hours</div>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-bold">Total Monthly Loss:</span>
                    <span className="text-3xl font-black text-red-600">$2,340</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Inventory software eliminates 80% of these losses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem - Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Why Restaurants Are Bleeding Money
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manual inventory tracking with spreadsheets and clipboards creates massive inefficiencies that directly impact your bottom line
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problemStats.map((stat, i) => (
              <div key={i} className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl font-black text-orange-600 mb-2">{stat.stat}</div>
                <div className="text-lg font-bold text-gray-900 mb-2">{stat.label}</div>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              How Restaurant Inventory Software Solves These Problems
            </h2>
            <p className="text-xl text-gray-600">
              Modern systems automate tracking, reduce waste, and give you real-time cost visibility
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, i) => (
              <div key={i} className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-500 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                  <feature.icon className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">{feature.benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              2026's Top Restaurant Inventory Software Compared
            </h2>
            <p className="text-xl text-gray-600">
              Choose the right system based on your restaurant size, budget, and specific needs
            </p>
          </div>
          
          <div className="overflow-x-auto rounded-2xl border-2 border-gray-200 shadow-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <tr>
                  <th className="text-left p-6 font-bold text-lg">Software</th>
                  <th className="text-left p-6 font-bold text-lg">Best For</th>
                  <th className="text-left p-6 font-bold text-lg">Pricing</th>
                  <th className="text-left p-6 font-bold text-lg">Key Features</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {competitorSoftware.map((software, index) => (
                  <tr 
                    key={index} 
                    className={`${software.highlight ? 'bg-orange-50 border-l-4 border-orange-600' : 'bg-white'} hover:bg-gray-50 transition-colors`}
                  >
                    <td className="p-6 align-top">
                      <div className="font-black text-lg text-gray-900">{software.name}</div>
                      {software.highlight && (
                        <span className="inline-block mt-2 px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">
                          RECOMMENDED
                        </span>
                      )}
                    </td>
                    <td className="p-6 align-top">
                      <span className="text-gray-700 font-medium">{software.bestFor}</span>
                    </td>
                    <td className="p-6 align-top">
                      <span className="font-bold text-gray-900">{software.pricing}</span>
                    </td>
                    <td className="p-6 align-top">
                      <ul className="space-y-2">
                        {software.keyFeatures.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Pricing data from vendor websites and industry reviews (January 2026). Enterprise pricing is custom and varies by location count.
            </p>
          </div>
        </div>
      </section>

      {/* Use Case Breakdown */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">
            Which Software Is Right for Your Restaurant?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Small Independent Restaurants</h3>
              <p className="text-gray-600 mb-6">
                Single location with limited budget, need simple mobile counting and basic cost tracking
              </p>
              <div className="space-y-3">
                <div className="font-bold text-gray-900 mb-2">Best Options:</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">StockFlow</span>
                  <span className="text-sm text-gray-500">(Free - $99/mo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Square for Restaurants</span>
                  <span className="text-sm text-gray-500">(Free - $60/mo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">xtraCHEF by Toast</span>
                  <span className="text-sm text-gray-500">($0 Starter Kit)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border-2 border-orange-200 shadow-lg">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Growing Restaurant Groups</h3>
              <p className="text-gray-600 mb-6">
                2-10 locations, need vendor management, recipe standardization, and multi-site visibility
              </p>
              <div className="space-y-3">
                <div className="font-bold text-gray-900 mb-2">Best Options:</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">MarketMan</span>
                  <span className="text-sm text-gray-500">($249 - $449/mo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">StockFlow Pro</span>
                  <span className="text-sm text-gray-500">($199/mo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Supy</span>
                  <span className="text-sm text-gray-500">(Custom)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Restaurant Chains</h3>
              <p className="text-gray-600 mb-6">
                10+ locations, need all-in-one operations suite with accounting integration and advanced analytics
              </p>
              <div className="space-y-3">
                <div className="font-bold text-gray-900 mb-2">Best Options:</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Restaurant365</span>
                  <span className="text-sm text-gray-500">(Custom Enterprise)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Supy Multi-Brand</span>
                  <span className="text-sm text-gray-500">(Custom)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Crunchtime</span>
                  <span className="text-sm text-gray-500">(Custom)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator / Results */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4">The Real ROI of Restaurant Inventory Software</h2>
              <p className="text-xl text-green-100">
                Actual results reported by restaurants after implementing automated inventory tracking
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-6xl font-black mb-2">3-5%</div>
                <div className="text-lg font-bold text-green-100 mb-2">Food Cost Reduction</div>
                <p className="text-sm text-green-200">
                  Average decrease in food cost percentage through better ordering and waste reduction
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-6xl font-black mb-2">85%</div>
                <div className="text-lg font-bold text-green-100 mb-2">Time Saved</div>
                <p className="text-sm text-green-200">
                  Reduction in weekly inventory counting time (from 6-7 hours to under 1 hour)
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-6xl font-black mb-2">$2K+</div>
                <div className="text-lg font-bold text-green-100 mb-2">Monthly Savings</div>
                <p className="text-sm text-green-200">
                  Average amount saved per location from eliminating waste, theft, and over-ordering
                </p>
              </div>
            </div>
            
            <div className="mt-12 p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-center">Real Restaurant Success Stories</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Fast-Casual Chain (8 locations)</div>
                    <p className="text-green-100">
                      Reduced food cost from 39% to 33% within 6 months by identifying over-portioning and waste patterns
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Independent Italian Restaurant</div>
                    <p className="text-green-100">
                      Saved $600/month on beverages alone after discovering theft through variance reporting
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Bar & Grill Group (4 locations)</div>
                    <p className="text-green-100">
                      Cut inventory counting time from 28 hours to 4 hours per week across all locations using mobile scanning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">
            How to Choose the Right Restaurant Inventory Software
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-orange-600">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Identify Your Biggest Pain Point</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Is it waste and spoilage? Time spent counting? Lack of cost visibility? Managing multiple locations? 
                    Choose software that directly addresses your primary challenge. For waste issues, prioritize variance 
                    analysis. For time savings, focus on mobile scanning. For multi-location, demand centralized dashboards.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-orange-600">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Check POS Integration Capabilities</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Real-time POS integration is non-negotiable for accurate inventory tracking. If you use Toast, 
                    xtraCHEF is seamless. For Square, use Square's native inventory. StockFlow integrates with 20+ POS systems. 
                    Verify integration quality—some connections are one-way or require manual syncing.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-orange-600">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Evaluate Mobile Capabilities</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You'll count inventory in walk-ins, freezers, and basements with spotty WiFi. Look for true mobile apps 
                    (not just mobile websites) with offline mode and barcode scanning. Test the scanning in poor lighting 
                    conditions. Avoid systems that require you to be at a computer to enter counts.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-orange-600">4</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Calculate True Total Cost</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Don't just compare monthly subscription fees. Factor in setup costs, training time, per-location fees, 
                    and transaction charges. A $99/month system with $1,000 onboarding costs more in year one than a 
                    $149/month system with free setup. Also consider implementation time—some systems take weeks to configure.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-orange-600">5</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Start with a Free Trial</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every reputable system offers free trials (14-30 days). Test it with your actual menu and inventory during 
                    a real week of operations. Have your kitchen manager and bartender use it. If they hate it, you won't get 
                    adoption. The best software on paper is worthless if your team won't use it consistently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-5xl font-black mb-6">
            Ready to Cut Your Food Costs by 3-5%?
          </h2>
          <p className="text-2xl mb-12 text-orange-100">
            Start your free trial today. No credit card required. Setup in 10 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group px-12 py-5 bg-white text-orange-600 font-black text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center gap-3">
              Start Free Trial
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-12 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all">
              Compare All Software
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12 text-orange-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Free 14-day trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Works with any POS
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black text-gray-900 mb-4 text-center">
            Restaurant Inventory Software FAQ
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Common questions about choosing and implementing inventory management systems
          </p>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details 
                key={index} 
                className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <summary className="cursor-pointer font-bold text-lg text-gray-900 p-6 flex justify-between items-center">
                  <span className="pr-8">{faq.question}</span>
                  <svg 
                    className="w-6 h-6 text-orange-600 flex-shrink-0 group-open:rotate-180 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
          

        </div>
      </section>

      <Footer />
      </>
  );
}