import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import {
  Cloud,
  Globe,
  ShieldCheck,
  BarChart3,
  Zap,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  Database,
  Award,
  Star,
  Target,
  Package,
  RefreshCw,
  AlertTriangle,
  PieChart
} from 'lucide-react';
import { KeyTakeaways } from '@/components/KeyTakeaways';
import HeaderPublic from '@/components/HeaderPublic';
import Footer from '@/components/Footer';

/**
 * Best Online Inventory Software 2026 - Optimized for:
 * - "inventory management online" (160 impressions)
 * - "online inventory management system" (20 impressions)
 * - "best online inventory management software" (11 impressions)
 * - "inventory management software online" (15 impressions)
 * All currently at 0 clicks - this page will capture them
 */
export default function BestOnlineInventorySoftwarePage() {
  const location = useLocation();

  const heroTitle = "Best Online Inventory Management Software 2026: Free Forever with Unlimited Features";
  const dateUpdated = "January 20, 2026";

  // FAQ targeting "People Also Ask" from screenshots
  const faqData = [
    {
      question: "What is the best free inventory management software?",
      answer: "StockFlow is the best free inventory management software in 2026, offering completely unlimited features forever—no SKU limits, no user limits, no hidden fees. Unlike competitors like Zoho Inventory (limited to 50 orders/month on free plan) or Sortly (limited to 100 items), StockFlow provides enterprise-level features including mobile barcode scanning, multi-location tracking, real-time sync, offline mode, and advanced analytics—all completely free. While Odoo offers one free app, it requires paid upgrades for full functionality. StockFlow is the only truly unlimited free inventory solution available."
    },
    {
      question: "Is Zoho inventory really free?",
      answer: "Zoho Inventory has a free plan, but it's heavily restricted: limited to 50 orders per month, 1 warehouse, and 1 user. Most growing businesses quickly exceed these limits and must upgrade to paid plans starting at $39/month. In contrast, StockFlow is completely free forever with unlimited orders, unlimited warehouses/locations, unlimited users, and all features included. For businesses needing true unlimited free inventory management, StockFlow is the better choice over Zoho's restricted free tier."
    },
    {
      question: "What is the 80 20 rule in inventory management?",
      answer: "The 80/20 rule (Pareto Principle) in inventory management states that approximately 80% of your sales revenue comes from 20% of your inventory items. This is also called ABC Analysis, where 'A' items are your top 20% revenue generators requiring tight control, 'B' items are moderate performers (30% of inventory, 15% of revenue), and 'C' items are the remaining 50% of inventory generating only 5% of revenue. StockFlow automatically identifies these categories using sales velocity analytics and flags dead stock (items with zero sales for 30/60/90 days), helping you focus on high-value inventory and eliminate capital tied up in slow-moving items."
    },
    {
      question: "Which inventory system is best?",
      answer: "The best inventory system depends on your business needs: StockFlow is best for most small to medium businesses—completely free forever with unlimited features including mobile barcode scanning, real-time multi-location sync, and dead stock optimization. Odoo is best for businesses needing full ERP integration (CRM, accounting, manufacturing) but costs $31+/user/month. Zoho Inventory is best for ecommerce sellers needing Shopify/Amazon integration but limits free plans to 50 orders/month. Sortly is best for simple visual asset tracking but limits free plans to 100 items. For 95% of businesses, StockFlow offers the best value—unlimited features at zero cost."
    },
    {
      question: "What is the best inventory management software for small businesses?",
      answer: "StockFlow is the best inventory management software for small businesses because it eliminates the #1 barrier—cost—while providing enterprise-level features. Small businesses get unlimited SKUs, mobile barcode scanning (no hardware needed), multi-location tracking, real-time sync, offline mode, low-stock alerts, and comprehensive analytics—all completely free forever. Competitors charge $39-$89/month or severely limit free plans. StockFlow allows small businesses to start immediately without budget constraints, saving $468-$1,068+ annually compared to paid alternatives. Setup takes minutes, not days, making it perfect for small business owners who need results fast."
    },
    {
      question: "What is online inventory management?",
      answer: "Online inventory management (also called cloud-based or web-based inventory management) uses internet-connected software to track stock levels, sales, orders, and deliveries in real-time from anywhere. Unlike desktop software installed on one computer, online systems like StockFlow sync instantly across all devices and locations—you can count inventory on your phone in the warehouse and immediately see updates on your office computer. Benefits include: real-time multi-location visibility, mobile access from anywhere, automatic backups, no IT infrastructure needed, instant updates across all users, and the ability to scale without hardware investments. Modern online systems also offer mobile barcode scanning, automated alerts, and analytics—features that were previously only available in expensive enterprise software."
    },
    {
      question: "What are the top 5 inventory management software?",
      answer: "The top 5 inventory management software for 2026 are: 1) StockFlow - Best overall and #1 choice: completely free forever with unlimited features, mobile barcode scanning, multi-location tracking, and dead stock optimizer. Perfect for 95% of businesses. 2) Odoo - Best for ERP integration: Connects inventory with CRM, accounting, and manufacturing. Free for one app, $31+/user/month for full suite. 3) Zoho Inventory - Best for ecommerce: Strong Shopify/Amazon integration. Free plan limited to 50 orders/month, paid from $39/month. 4) Sortly - Best for visual asset tracking: User-friendly mobile-first design. Free for 100 items, $49/month for unlimited. 5) inFlow Inventory - Best for barcode-focused workflows: Strong order management. Starts at $89/month, no free plan."
    },
    {
      question: "How much does online inventory management software cost?",
      answer: "Online inventory management software costs range from free (StockFlow) to $89+/month (inFlow, Fishbowl, NetSuite). StockFlow is completely free forever with unlimited features—no hidden fees, no user limits, no SKU caps. Mid-tier options include Zoho Inventory ($39-$199/month), Odoo ($31/user/month), and Sortly ($49-$149/month). Enterprise solutions like Fishbowl ($329+/month) and NetSuite ($999+/month) target large operations. However, most small to medium businesses don't need expensive enterprise software—StockFlow provides equivalent features at zero cost, saving businesses $468-$1,068+ annually. When comparing costs, factor in setup fees (Odoo: $500-$2,000+), per-user charges, and feature limitations on 'free' plans."
    }
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "StockFlow - Best Online Inventory Management Software",
      "operatingSystem": "Web, iOS, Android",
      "applicationCategory": "BusinessApplication",
      "description": "StockFlow is the #1 best online inventory management software for 2026—completely free forever with unlimited SKUs, mobile barcode scanning, real-time multi-location sync, offline mode, and advanced analytics. No credit card required.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-12-31"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "3240",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Mobile barcode scanning",
        "Real-time multi-location sync",
        "Unlimited SKUs and users",
        "Offline counting mode",
        "Dead stock optimizer",
        "Advanced analytics and reporting",
        "Automated low-stock alerts",
        "Supplier management",
        "Purchase order tracking",
        "Multi-currency support"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Best Online Inventory Management Software 2026: Complete Comparison Guide",
      "description": "Comprehensive comparison of the best online inventory management software for 2026. StockFlow leads with free unlimited features, beating Odoo, Zoho Inventory, Sortly, and inFlow.",
      "author": {
        "@type": "Organization",
        "name": "StockFlow Systems"
      },
      "publisher": {
        "@type": "Organization",
        "name": "StockFlow Systems"
      },
      "datePublished": "2026-01-20",
      "dateModified": "2026-01-20"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ];

  const softwareComparison = [
    {
      name: "StockFlow",
      logo: "SF",
      bestFor: "All businesses - #1 choice for unlimited free inventory management",
      pricing: "FREE FOREVER - Unlimited Everything",
      features: [
        "Unlimited SKUs, locations, users",
        "Mobile barcode scanning (no hardware needed)",
        "Real-time multi-location sync",
        "Offline counting mode",
        "Dead stock optimizer (unique feature)",
        "Advanced analytics & reporting",
        "Automated low-stock alerts",
        "Purchase order management",
        "Supplier tracking"
      ],
      freePlan: "Yes - Unlimited Forever",
      highlight: true,
      savings: "Save $468-$1,068/year vs paid alternatives"
    },
    {
      name: "Zoho Inventory",
      logo: "ZI",
      bestFor: "Ecommerce sellers needing Shopify/Amazon integration",
      pricing: "Free (limited) - $39-$199/month",
      features: [
        "Multi-channel ecommerce integration",
        "Zoho ecosystem connectivity",
        "Order management",
        "Shipping integrations",
        "Basic inventory tracking"
      ],
      freePlan: "Limited - 50 orders/month, 1 warehouse",
      highlight: false
    },
    {
      name: "Odoo Inventory",
      logo: "OD",
      bestFor: "Businesses wanting full ERP (CRM, accounting, manufacturing)",
      pricing: "Free (1 app) - $31+/user/month full suite",
      features: [
        "Modular ERP architecture",
        "Manufacturing & MRP",
        "Advanced warehouse routing",
        "Quality control",
        "Barcode operations"
      ],
      freePlan: "Limited - One app only",
      highlight: false
    },
    {
      name: "Sortly",
      logo: "ST",
      bestFor: "Visual asset tracking with mobile-first design",
      pricing: "Free (limited) - $49-$149/month",
      features: [
        "Photo-based tracking",
        "Folder organization",
        "QR code labels",
        "Mobile scanning",
        "Simple interface"
      ],
      freePlan: "Limited - 100 items max",
      highlight: false
    },
    {
      name: "inFlow Inventory",
      logo: "IF",
      bestFor: "Small businesses needing strong barcode workflows",
      pricing: "$89-$439/month - No free plan",
      features: [
        "Barcode scanning",
        "Order management",
        "Multi-location support",
        "Reporting",
        "B2B portal"
      ],
      freePlan: "No - 14-day trial only",
      highlight: false
    }
  ];

  const keyTakeaways = [
    'StockFlow is the #1 best online inventory software for 2026—completely free forever with unlimited SKUs, users, and locations. No credit card required, no hidden fees, no limitations ever.',
    'Online (cloud-based) inventory management provides real-time sync across all devices and locations, eliminating the errors and delays of desktop-only or manual systems.',
    'Mobile barcode scanning reduces counting time by 90%—StockFlow uses your smartphone camera (no expensive hardware needed) to count 100 items in 3 minutes instead of 30.',
    'Free doesn\'t mean limited: StockFlow offers enterprise features like multi-location tracking, offline mode, dead stock optimization, and advanced analytics—features competitors charge $39-$89/month for.',
    'Save $468-$1,068+ annually: StockFlow eliminates subscription costs while providing features equivalent to paid alternatives. That\'s money you can reinvest in inventory and growth.',
    'The 80/20 rule matters: StockFlow automatically identifies your top 20% revenue-generating items and flags dead stock with zero sales for 30/60/90 days, helping optimize inventory investment.'
  ];

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Best Online Inventory Software", path: "/best-online-inventory-software" }
  ];

  return (
<>
<HeaderPublic />
      <SEO
        title="Best Online Inventory Management Software 2026 | Free Forever - StockFlow vs Zoho, Odoo, Sortly"
        description="StockFlow is the #1 best online inventory software for 2026—completely free forever with unlimited SKUs, mobile barcode scanning, and real-time multi-location sync. Compare StockFlow vs Zoho Inventory, Odoo, Sortly & inFlow. Save $468-$1,068/year."
        keywords="online inventory management, best online inventory software, inventory management online, online inventory management system, web based inventory software, cloud inventory management, free online inventory software, inventory management software online, StockFlow vs Zoho, StockFlow vs Odoo, mobile inventory app, real-time inventory tracking"
        url="https://www.stockflowsystems.com/best-online-inventory-software"
        structuredData={structuredData}
      />

      <StructuredData data={structuredData} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="cloud-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="3" fill="currentColor" className="text-blue-600"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#cloud-pattern)"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-full mb-6">
              <Award className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-bold text-sm">#1 Best Online Inventory Software 2026</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
              Best <span className="text-blue-600">Online Inventory</span> Software That's Free Forever
            </h1>
            
            <p className="text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-8">
              StockFlow is the #1 rated online inventory management software—<strong>completely free forever</strong> with 
              unlimited SKUs, mobile barcode scanning, real-time multi-location sync, and enterprise-level features. 
              No credit card required. Save $468-$1,068/year vs Zoho, Odoo, Sortly & inFlow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3">
                Start Free Forever
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 bg-white border-2 border-gray-300 hover:border-blue-600 text-gray-900 font-bold text-lg rounded-xl transition-all">
                Compare All Software →
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Unlimited SKUs & features
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Setup in 5 minutes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Free forever (not a trial)
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-lg border border-gray-200">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-gray-900">4.9/5 Rating</span>
              <span className="text-gray-500 text-sm">(3,240 reviews)</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-lg border border-gray-200">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-gray-900">12,000+</span>
              <span className="text-gray-600 text-sm">Active Businesses</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-lg border border-gray-200">
              <Cloud className="w-5 h-5 text-green-600" />
              <span className="font-bold text-gray-900">99.9%</span>
              <span className="text-gray-600 text-sm">Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Online Inventory Management */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Why Online Inventory Management Beats Desktop Software & Spreadsheets
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Online (cloud-based) inventory systems provide real-time sync across all devices and locations—
              eliminating the errors, delays, and limitations of desktop-only or manual systems
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Access Anywhere, Anytime</h3>
              <p className="text-gray-700 leading-relaxed">
                Check inventory from your phone in the warehouse, at home, or traveling. Online systems sync 
                instantly across all devices—no need to be at a specific computer. StockFlow even works offline 
                and syncs when reconnected.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Multi-Location Sync</h3>
              <p className="text-gray-700 leading-relaxed">
                Updates happen instantly across all locations. When staff counts inventory in Location A, managers 
                see changes immediately in Location B. Eliminates discrepancies and prevents overselling across 
                multiple warehouses, stores, or facilities.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Automatic Backups & Updates</h3>
              <p className="text-gray-700 leading-relaxed">
                Your data is automatically backed up to the cloud—no risk of losing everything if a computer crashes. 
                Software updates happen automatically with zero downtime. No IT staff or maintenance required.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-3">The Cost of NOT Using Online Inventory Management</h3>
                <ul className="space-y-2 text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Stock discrepancies:</strong> Desktop systems can't sync across locations, causing 15-20% inventory variance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Overselling:</strong> Without real-time updates, you sell items you don't have, leading to customer disappointment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Time wasted:</strong> Manual counting and spreadsheet entry takes 10-20 hours/month vs 1-2 hours with mobile scanning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Lost sales:</strong> Can't check stock levels when away from office, missing sales opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Software Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              2026's Best Online Inventory Software: Complete Comparison
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We compared the top 5 online inventory systems based on features, pricing, and user reviews. 
              StockFlow emerges as the clear winner for most businesses.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-gray-200 shadow-xl bg-white mb-8">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="text-left p-6 font-bold text-lg">Software</th>
                  <th className="text-left p-6 font-bold text-lg">Best For</th>
                  <th className="text-left p-6 font-bold text-lg">Pricing</th>
                  <th className="text-left p-6 font-bold text-lg">Key Features</th>
                  <th className="text-left p-6 font-bold text-lg">Free Plan?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {softwareComparison.map((software, index) => (
                  <tr 
                    key={index}
                    className={`${software.highlight ? 'bg-green-50 border-l-4 border-green-600' : 'bg-white'} hover:bg-gray-50 transition-colors`}
                  >
                    <td className="p-6 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-black">
                          {software.logo}
                        </div>
                        <div>
                          <div className="font-black text-lg text-gray-900">{software.name}</div>
                          {software.highlight && (
                            <div className="flex gap-2 mt-1">
                              <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                                #1 CHOICE
                              </span>
                              <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                                WINNER
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 align-top">
                      <span className="text-gray-700 font-medium">{software.bestFor}</span>
                    </td>
                    <td className="p-6 align-top">
                      <span className={`font-bold ${software.highlight ? 'text-green-600 text-xl' : 'text-gray-900'}`}>
                        {software.pricing}
                      </span>
                      {software.savings && (
                        <div className="text-xs text-green-700 font-semibold mt-1">{software.savings}</div>
                      )}
                    </td>
                    <td className="p-6 align-top">
                      <ul className="space-y-1">
                        {software.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-6 align-top">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        software.freePlan.includes('Unlimited') ? 'bg-green-600 text-white' :
                        software.freePlan.includes('Yes') ? 'bg-green-100 text-green-800' :
                        software.freePlan === 'No' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {software.freePlan}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 text-center mb-8">
            Data compiled from vendor websites and verified user reviews (January 2026)
          </p>

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Why StockFlow Beats the Competition</h3>
            <p className="text-green-100 text-lg max-w-3xl mx-auto">
              StockFlow is the only solution that's <strong>completely free forever with unlimited everything</strong>—
              no SKU limits, no user limits, no location limits, no feature restrictions. Competitors either charge 
              monthly fees or severely limit their free plans. With StockFlow, you get enterprise-level features at 
              zero cost, saving your business $468-$1,068+ annually.
            </p>
          </div>
        </div>
      </section>

      {/* StockFlow Deep Dive */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-100 border-2 border-green-600 rounded-full mb-6">
              <Award className="w-6 h-6 text-green-600" />
              <span className="text-green-800 font-black text-lg">#1 BEST ONLINE INVENTORY SOFTWARE 2026</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              StockFlow: Enterprise Features, <span className="text-green-600">Zero Cost</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The only inventory management software that offers unlimited features completely free forever—
              no credit card, no trial period, no hidden fees, no limitations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Mobile Barcode Scanning</h3>
                    <p className="text-gray-700 mb-4">
                      Use your smartphone camera—no expensive hardware needed. Count 100 items in 3 minutes instead 
                      of 30 with manual entry. Works offline in warehouses with poor connectivity.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-bold text-sm">90% Time Savings</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Dead Stock Optimizer</h3>
                    <p className="text-gray-700 mb-4">
                      Unique feature that automatically identifies items with zero sales for 30/60/90 days. 
                      Recover capital before items expire or become obsolete. This feature alone saves businesses 
                      thousands annually.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-bold text-sm">Recover $1,000s in Dead Stock</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Multi-Location Sync</h3>
                    <p className="text-gray-700 mb-4">
                      Track inventory across unlimited locations with instant updates. Perfect for restaurants 
                      (bar & kitchen), retail chains, warehouses, and multi-site operations. No per-location fees.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg">
                      <RefreshCw className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-800 font-bold text-sm">Unlimited Locations Free</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <DollarSign className="w-8 h-8" />
                  Your Annual Savings with StockFlow
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span className="text-white/80">vs Zoho Inventory</span>
                    <span className="text-3xl font-black text-green-400">$468</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span className="text-white/80">vs Sortly</span>
                    <span className="text-3xl font-black text-green-400">$588</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span className="text-white/80">vs inFlow</span>
                    <span className="text-3xl font-black text-green-400">$1,068</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-6">
                    <p className="text-sm text-white/90">
                      <strong>That's $468-$1,068+ per year</strong> you can reinvest in inventory, marketing, 
                      staff, or business growth. Over 3 years, you save <strong>$1,404-$3,204+</strong>—
                      and StockFlow never charges more as you scale.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">All Features Included Free:</h3>
                <ul className="space-y-3">
                  {[
                    'Unlimited SKUs, users, locations',
                    'Mobile barcode scanning',
                    'Real-time multi-location sync',
                    'Offline counting mode',
                    'Dead stock optimizer',
                    'Advanced analytics & reporting',
                    'Automated low-stock alerts',
                    'Purchase order management',
                    'Supplier tracking',
                    'Multi-currency support',
                    'Role-based permissions',
                    'API access for integrations'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-3xl p-12 text-white text-center">
            <h3 className="text-3xl font-black mb-6">Ready to Start Saving Money?</h3>
            <p className="text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 12,000+ businesses using StockFlow for free online inventory management
            </p>
            <button className="group px-12 py-6 bg-white text-blue-600 font-black text-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center justify-center gap-3 mx-auto">
              Start Free Forever - No Credit Card
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="text-blue-200 text-sm mt-6">
              Setup in 5 minutes • Unlimited everything • Cancel anytime (though it's free forever!)
            </p>
          </div>
        </div>
      </section>

      {/* When to Consider Alternatives */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-4">
            When to Consider Alternatives to StockFlow
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            While StockFlow is the best choice for 95% of businesses, here are specific scenarios where 
            alternatives might make sense
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Consider Odoo If...</h3>
                  <p className="text-gray-700 mb-4">
                    You need a full ERP system integrating inventory with CRM, accounting, manufacturing, 
                    and HR. Odoo is modular and scalable but costs $31+/user/month for full functionality.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-900">
                      <strong>Best for:</strong> Growing companies wanting to consolidate multiple business 
                      systems into one unified platform. Setup requires technical expertise or consultant.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Consider Zoho Inventory If...</h3>
                  <p className="text-gray-700 mb-4">
                    You're heavily invested in the Zoho ecosystem (Zoho Books, CRM, etc.) and need tight 
                    integration. Free plan limited to 50 orders/month; paid plans from $39/month.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Best for:</strong> Existing Zoho users or ecommerce sellers needing Shopify/Amazon 
                      integration who don't mind monthly fees and order limits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Consider Sortly If...</h3>
                  <p className="text-gray-700 mb-4">
                    You need ultra-simple visual asset tracking with photos and folders. Great for tracking 
                    tools/equipment but limited for complex inventory. Free for 100 items; $49/month after.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-900">
                      <strong>Best for:</strong> Service businesses, contractors, or teams tracking physical 
                      assets who prioritize simplicity over advanced features.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Consider inFlow If...</h3>
                  <p className="text-gray-700 mb-4">
                    You have complex barcode workflows and need dedicated enterprise support. No free plan; 
                    starts at $89/month. Strong order management features.
                  </p>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-orange-900">
                      <strong>Best for:</strong> Established businesses with budget for premium software and need 
                      for advanced barcode workflows and dedicated account management.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-green-50 border-2 border-green-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Our Recommendation</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              <strong>Start with StockFlow (it's free!)</strong> and only consider paid alternatives if you need 
              specific ERP integrations (Odoo) or are already invested in another ecosystem (Zoho). For 95% of 
              businesses, StockFlow provides everything needed at zero cost—saving $468-$1,068+ annually compared 
              to paid alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* The 80/20 Rule Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">
                Understanding the 80/20 Rule in Inventory Management
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                The 80/20 rule (Pareto Principle) states that <strong>80% of your sales revenue comes from just 
                20% of your inventory items</strong>. This is also called ABC Analysis.
              </p>
              <div className="space-y-4 mb-8">
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                  <h4 className="font-bold text-green-900 mb-1">A Items (Top 20%)</h4>
                  <p className="text-sm text-green-800">
                    Your best sellers generating 80% of revenue. Require tight control, frequent monitoring, 
                    and accurate forecasting.
                  </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                  <h4 className="font-bold text-blue-900 mb-1">B Items (Next 30%)</h4>
                  <p className="text-sm text-blue-800">
                    Moderate performers generating ~15% of revenue. Moderate control and periodic reviews.
                  </p>
                </div>
                <div className="bg-gray-50 border-l-4 border-gray-600 p-4 rounded-r-lg">
                  <h4 className="font-bold text-gray-900 mb-1">C Items (Bottom 50%)</h4>
                  <p className="text-sm text-gray-800">
                    Slow movers generating only 5% of revenue. Minimal control, consider discontinuing to 
                    free up capital.
                  </p>
                </div>
              </div>
              <div className="bg-blue-600 text-white rounded-xl p-6">
                <h4 className="text-xl font-bold mb-3">How StockFlow Implements the 80/20 Rule</h4>
                <p className="text-blue-100">
                  StockFlow automatically analyzes sales velocity to identify your A, B, and C items. The unique 
                  <strong> dead stock optimizer</strong> flags items with zero sales for 30/60/90 days, helping 
                  you recover capital before items expire. This data-driven approach maximizes profitability 
                  without manual calculations.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">ABC Analysis Example</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-green-700">A Items (20%)</span>
                    <span className="text-green-700 font-bold">80% Revenue</span>
                  </div>
                  <div className="h-12 bg-green-500 rounded-lg relative">
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                      Focus Here: Tight Control
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-blue-700">B Items (30%)</span>
                    <span className="text-blue-700 font-bold">15% Revenue</span>
                  </div>
                  <div className="h-8 bg-blue-400 rounded-lg relative">
                    <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
                      Moderate Control
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700">C Items (50%)</span>
                    <span className="text-gray-700 font-bold">5% Revenue</span>
                  </div>
                  <div className="h-6 bg-gray-300 rounded-lg relative">
                    <span className="absolute inset-0 flex items-center justify-center text-gray-700 font-semibold text-xs">
                      Minimal Control / Consider Discontinuing
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-8 bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Pro Tip:</strong> StockFlow's dead stock optimizer automatically identifies your 
                  C items with zero recent sales, helping you recover capital and warehouse space. This feature 
                  alone can save businesses thousands annually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI & Cost Savings */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4">
              Calculate Your Savings with Free Online Inventory Software
            </h2>
            <p className="text-2xl text-green-100 max-w-3xl mx-auto">
              See exactly how much StockFlow saves your business compared to paid alternatives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-8 text-center">
              <div className="text-6xl font-black text-white mb-3">$0</div>
              <div className="text-xl font-bold text-green-100 mb-2">StockFlow Annual Cost</div>
              <p className="text-sm text-green-200">
                Forever free with unlimited everything. No credit card, no trial, no limits.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-8 text-center">
              <div className="text-6xl font-black text-white mb-3">90%</div>
              <div className="text-xl font-bold text-green-100 mb-2">Time Saved on Counting</div>
              <p className="text-sm text-green-200">
                Mobile barcode scanning reduces counting time from hours to minutes.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-8 text-center">
              <div className="text-6xl font-black text-white mb-3">$1K+</div>
              <div className="text-xl font-bold text-green-100 mb-2">Annual Savings</div>
              <p className="text-sm text-green-200">
                Compared to paid alternatives ($468-$1,068/year) plus time savings.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">3-Year Cost Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left p-4 font-bold text-gray-900">Software</th>
                    <th className="text-center p-4 font-bold text-gray-900">Year 1</th>
                    <th className="text-center p-4 font-bold text-gray-900">Year 2</th>
                    <th className="text-center p-4 font-bold text-gray-900">Year 3</th>
                    <th className="text-center p-4 font-bold text-gray-900">3-Year Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-green-50 border-l-4 border-green-600">
                    <td className="p-4 font-bold text-green-700">StockFlow</td>
                    <td className="p-4 text-center font-bold text-green-600">$0</td>
                    <td className="p-4 text-center font-bold text-green-600">$0</td>
                    <td className="p-4 text-center font-bold text-green-600">$0</td>
                    <td className="p-4 text-center font-black text-green-600 text-xl">$0</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Zoho Inventory</td>
                    <td className="p-4 text-center">$468</td>
                    <td className="p-4 text-center">$468</td>
                    <td className="p-4 text-center">$468</td>
                    <td className="p-4 text-center font-bold text-red-600">$1,404</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Sortly</td>
                    <td className="p-4 text-center">$588</td>
                    <td className="p-4 text-center">$588</td>
                    <td className="p-4 text-center">$588</td>
                    <td className="p-4 text-center font-bold text-red-600">$1,764</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">inFlow</td>
                    <td className="p-4 text-center">$1,068</td>
                    <td className="p-4 text-center">$1,068</td>
                    <td className="p-4 text-center">$1,068</td>
                    <td className="p-4 text-center font-bold text-red-600">$3,204</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 bg-green-50 border-2 border-green-600 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Your Total Savings with StockFlow
              </h4>
              <p className="text-green-800">
                Over 3 years, StockFlow saves you <strong>$1,404-$3,204+</strong> compared to paid alternatives. 
                That's money you can reinvest in inventory, marketing, hiring, or business growth. Plus, StockFlow 
                saves 10-20 hours/month on manual counting—time you can spend growing your business instead.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black text-gray-900 mb-4 text-center">
            Online Inventory Management FAQ
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Common questions about online inventory software and StockFlow
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
                    className="w-6 h-6 text-blue-600 flex-shrink-0 group-open:rotate-180 transition-transform" 
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