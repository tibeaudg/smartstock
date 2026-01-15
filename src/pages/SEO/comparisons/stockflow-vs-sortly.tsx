import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  FileText,
  MapPin,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
  Camera,
  Smartphone,
  Database,
  Settings,
  AlertCircle,
  X
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@/components/ui/accordion';


export default function StockFlowVsSortly() {
  
  

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "Why should I switch from Sortly to StockFlow?",
      answer: "StockFlow is completely free forever with all features included, while Sortly charges $25/month. StockFlow provides faster setup (5-7 days vs 30+ days), better operational features like automated reorder points and multi-location management, European data hosting for GDPR compliance, and 24/7 customer support. StockFlow is designed for teams that need fast barcode workflows and inventory operations, while Sortly focuses more on visual catalog browsing."
    },
    {
      question: "How does migration from Sortly to StockFlow work?",
      answer: "Migration is straightforward and free with StockFlow. Step 1: Export your data from Sortly (CSV format). Step 2: Our team helps import it into StockFlow with free setup assistance. Step 3: Map your locations and categories. Step 4: Train your team with our free onboarding. Step 5: Go live in 5-7 days. The entire process is supported by our team at no extra cost, and we ensure all your inventory data transfers accurately."
    },
    {
      question: "What's the cost difference between StockFlow and Sortly?",
      answer: "StockFlow is completely free forever with unlimited products and all features included, while Sortly starts at $25/month and charges up to $99/month for advanced features. StockFlow saves you $300-1200+ per year compared to Sortly, plus you get free setup and migration assistance (Sortly may charge for setup)."
    },
    {
      question: "What are the key feature differences between StockFlow and Sortly?",
      answer: "StockFlow excels at operational inventory management with real-time tracking, automated reorder points, multi-location support, advanced reporting, and barcode-first workflows. Sortly focuses on visual catalog browsing with folder-style organization and photo-heavy item displays. StockFlow is better for teams managing inventory operations, while Sortly is better for simple visual catalog needs. StockFlow also offers European data hosting and 24/7 support, while Sortly hosts in the US with business hours support."
    },
    {
      question: "How long does setup take for StockFlow vs Sortly?",
      answer: "StockFlow can be set up and running in 5-7 days with free guided onboarding. Sortly typically requires 30+ days for full implementation, especially if you need custom configurations or integrations. StockFlow's faster setup is due to ready-to-use templates, automated data import, and dedicated support during onboarding. We also provide free migration assistance to help you move from Sortly quickly."
    },
    {
      question: "Can I export my data from Sortly to StockFlow?",
      answer: "Yes, you can export your data from Sortly in CSV format, and StockFlow provides free import assistance. Our team will help you map your Sortly data (items, locations, categories) to StockFlow's structure. We ensure all inventory counts, item details, and location information transfer accurately. The migration process is included in our free setup service, so you don't pay extra for data migration."
    },
    {
      question: "Does StockFlow have better features than Sortly?",
      answer: "StockFlow offers superior operational features including automated reorder points, multi-location inventory management, advanced reporting and analytics, role-based user permissions, and barcode-first workflows optimized for field teams. Sortly is stronger for visual catalog browsing with folder-style organization. If you need inventory operations (receiving, picking, transfers, reordering), StockFlow is better. If you mainly need a visual catalog to browse items, Sortly can work."
    },
    {
      question: "Is StockFlow's free plan better than Sortly's paid plans?",
      answer: "StockFlow is completely free forever with unlimited products, real-time tracking, barcode scanning, mobile app access, multi-location support, advanced reporting, and all premium features everything that Sortly charges $25-99/month for. StockFlow requires no payment ever, while Sortly requires payment from day one."
    },
    {
      question: "What support does StockFlow offer compared to Sortly?",
      answer: "StockFlow provides 24/7 customer support via email and chat, with European-based support teams for faster response times. Sortly offers support during business hours (US time zones) primarily via email. StockFlow also includes free onboarding and migration assistance, while Sortly may charge for setup help. For European businesses, StockFlow's EU-based support ensures GDPR compliance and local language assistance."
    },
    {
      question: "Can I use StockFlow if I'm currently using Sortly?",
      answer: "Absolutely! Many businesses switch from Sortly to StockFlow for better features, lower costs, and faster setup. StockFlow offers free migration assistance to help you move your data, and you can run both systems in parallel during the transition. Our team will help you export from Sortly, import to StockFlow, and ensure a smooth transition. The free plan lets you test StockFlow without canceling Sortly first."
    }
  ];

  const featureComparison = [
    {
      feature: "Pricing",
      stockflow: "✓ Completely Free Forever",
      sortly: "✗ Starts at $25/month"
    },
    {
      feature: "Real-Time Inventory Tracking",
      stockflow: "✓ Full real-time sync",
      sortly: "✓ Basic tracking"
    },
    {
      feature: "Barcode Scanning",
      stockflow: "✓ Advanced (barcode-first)",
      sortly: "✓ Basic support"
    },
    {
      feature: "Multi-Location Support",
      stockflow: "✓ Unlimited locations",
      sortly: "Limited (plan-dependent)"
    },
    {
      feature: "Mobile App",
      stockflow: "✓ iOS & Android (optimized)",
      sortly: "✓ iOS & Android"
    },
    {
      feature: "Automated Reorder Points",
      stockflow: "✓ Included",
      sortly: "Limited"
    },
    {
      feature: "Purchase Order Management",
      stockflow: "✓ Full PO workflow",
      sortly: "Basic"
    },
    {
      feature: "Reporting & Analytics",
      stockflow: "✓ Advanced dashboards",
      sortly: "Basic reports"
    },
    {
      feature: "User Permissions & Roles",
      stockflow: "✓ Role-based access",
      sortly: "Limited"
    },
    {
      feature: "Integrations",
      stockflow: "✓ 50+ integrations",
      sortly: "Limited integrations"
    },
    {
      feature: "Data Hosting",
      stockflow: "✓ EU (GDPR compliant)",
      sortly: "US hosting"
    },
    {
      feature: "Customer Support",
      stockflow: "24/7 support",
      sortly: "Business hours"
    },
    {
      feature: "Setup Time",
      stockflow: "5-7 days (free setup)",
      sortly: "30+ days"
    },
    {
      feature: "Migration Assistance",
      stockflow: "✓ Free migration help",
      sortly: "May charge extra"
    }
  ];

  const pricingComparison = [
    {
      plan: "Pricing",
      stockflow: "Completely Free Forever",
      sortly: "$25-99/month",
      savings: "Save $300-1200+/year"
    },
    {
      plan: "Products",
      stockflow: "Unlimited",
      sortly: "Limited by plan",
      savings: "No limits"
    },
    {
      plan: "Features",
      stockflow: "All features included",
      sortly: "Limited by plan",
      savings: "Everything included"
    },
    {
      plan: "Setup & Migration",
      stockflow: "Free",
      sortly: "May charge extra",
      savings: "Save $500-1000"
    }
  ];

  const migrationSteps = [
    {
      step: 1,
      title: "Export Data from Sortly",
      description: "Export your inventory data from Sortly in CSV format. This includes items, quantities, locations, and categories.",
      icon: Download,
      timeframe: "1-2 hours"
    },
    {
      step: 2,
      title: "Import to StockFlow",
      description: "Our team provides free setup assistance to import your data into StockFlow. We'll help map your Sortly structure to StockFlow.",
      icon: Database,
      timeframe: "1 day"
    },
    {
      step: 3,
      title: "Map Locations & Categories",
      description: "Configure your locations, categories, and organizational structure in StockFlow to match your workflow.",
      icon: MapPin,
      timeframe: "1 day"
    },
    {
      step: 4,
      title: "Train Your Team",
      description: "Free onboarding sessions help your team learn StockFlow. We provide training materials and live support.",
      icon: Users,
      timeframe: "2-3 days"
    },
    {
      step: 5,
      title: "Go Live",
      description: "Start using StockFlow! Our team remains available for questions. Total migration time: 5-7 days vs Sortly's 30+ days.",
      icon: Zap,
      timeframe: "5-7 days total"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Martinez",
      role: "Operations Manager, TechSupply Co.",
      content: "We switched from Sortly to StockFlow and saved $600 in the first year. The free plan covered our needs, and setup took just 5 days. The barcode scanning is much faster than Sortly.",
      rating: 5,
      fromSortly: true
    },
    {
      name: "James Wilson",
      role: "Warehouse Manager, Retail Solutions",
      content: "StockFlow's multi-location features are far superior to Sortly. We manage 5 locations now with real-time sync, something Sortly couldn't handle well. Migration was free and smooth.",
      rating: 5,
      fromSortly: true
    },
    {
      name: "Emma Thompson",
      role: "Owner, Field Service Pro",
      content: "The free plan was a game-changer. We were paying $49/month to Sortly for features StockFlow gives us for free. The automated reorder points prevent stockouts better than Sortly ever did.",
      rating: 5,
      fromSortly: true
    }
  ];

  return (
    <SeoPageLayout 
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'StockFlow vs Sortly', href: '/stockflow-vs-sortly' }
      ]}
      heroTitle="StockFlow vs Sortly   Compare Features, Pricing, and Migration"
      dateUpdated="06/01/2026"
      heroDescription="Completely free forever vs $25/month • 5-7 day setup vs 30+ days • Save 100% costs • Free migration assistance"
              previousArticle={{
      title: "StockFlow vs Katana",
      href: "/stockflow-vs-katana"
    }}
    nextArticle={{
      title: "StockFlow vs Spreadsheets",
      href: "/stockflow-vs-spreadsheets"
    }}
    >
      <SEO
        title="StockFlow vs Sortly   Compare Features, Pricing, and Migration 2026 | StockFlow"
        description="Compare StockFlow vs Sortly 2026. Free forever vs $25/month, better features. 5-7 day setup vs 30+ days. EU hosting. Save 100% costs."
        keywords="StockFlow vs Sortly, Sortly vs StockFlow, StockFlow comparison, Sortly alternative, inventory software comparison, migrate from Sortly, StockFlow features, Sortly pricing, inventory management software, free inventory software, StockFlow migration, Sortly competitor, best inventory software, StockFlow vs Sortly pricing, StockFlow vs Sortly features"
        url="https://www.stockflowsystems.com/stockflow-vs-sortly"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/stockflow-vs-sortly' }
        ]}
      />



      {/* Feature Comparison Matrix */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Feature Comparison: StockFlow vs Sortly
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how StockFlow compares to Sortly across key inventory management features
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 bg-blue-50">StockFlow</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Sortly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {featureComparison.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{item.stockflow}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.sortly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Pricing Comparison: StockFlow vs Sortly
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compare pricing plans and see how much you can save with StockFlow
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Plan</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 bg-blue-50">StockFlow</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Sortly</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-green-600">Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pricingComparison.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.plan}</td>
                      <td className="px-6 py-4 text-center text-sm text-blue-600 font-semibold">{item.stockflow}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.sortly}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{item.savings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Total First Year Savings</h3>
            <p className="text-lg text-gray-700">
              Switching from Sortly to StockFlow saves you <strong className="text-green-600">$300-1200+ per year</strong> since StockFlow is completely free forever, 
              plus free setup and migration assistance (worth $500-1000). That's a total savings of <strong className="text-green-600">$800-2200+</strong> 
              compared to Sortly's paid plans and setup fees.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Save 90% - Switch Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Migration Steps */}
      <section id="migration" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              How to Migrate from Sortly to StockFlow
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Free migration assistance makes switching from Sortly to StockFlow easy. Complete migration in 5-7 days vs Sortly's 30+ day setup.
            </p>
          </div>

          <div className="space-y-6">
            {migrationSteps.map((step, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                      <span className="ml-auto text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                        {step.timeframe}
                      </span>
                    </div>
                    <p className="text-gray-700">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              Free Migration Support Included
            </h3>
            <p className="text-gray-700">
              All migration assistance is included at no extra cost. Our team helps with data export, import, mapping, 
              and training. Compare this to Sortly, which may charge $500-1000+ for setup and migration help.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Free Migration Help
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Businesses Switch */}
      <section id="why-switch" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Why Businesses Switch from Sortly to StockFlow
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real benefits that make the switch worthwhile
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <DollarSign className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Save 90% on Costs</h3>
              <p className="text-gray-700">
                Free plan vs $25/month starting price. Save $300-600+ in the first year, plus free setup (worth $500-1000).
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <Clock className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">5-7 Day Setup</h3>
              <p className="text-gray-700">
                Get up and running in days, not weeks. StockFlow's guided onboarding is faster than Sortly's 30+ day setup.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <Zap className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Better Operations</h3>
              <p className="text-gray-700">
                Automated reorder points, multi-location management, and barcode-first workflows optimized for inventory operations.
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <Shield className="h-10 w-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">EU Data Hosting</h3>
              <p className="text-gray-700">
                GDPR compliant European hosting vs Sortly's US hosting. Better for European businesses with data privacy requirements.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
              <Users className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">24/7 Support</h3>
              <p className="text-gray-700">
                Round-the-clock support vs Sortly's business hours. Get help when you need it, not just during US business hours.
              </p>
            </div>

            <div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
              <TrendingUp className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Free Migration</h3>
              <p className="text-gray-700">
                Free setup and migration assistance included. Sortly may charge $500-1000+ for similar help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When Each Makes Sense */}
      <section id="when-to-choose" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              When to Choose StockFlow vs Sortly
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Honest comparison to help you decide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 border-2 border-blue-200 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                <CheckCircle className="h-8 w-8" />
                When StockFlow is Better
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You need <strong>fast barcode workflows</strong> for receiving, counting, and picking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You operate across <strong>multiple locations</strong> and need real-time sync</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You want <strong>automated reorder points</strong> and purchase order workflows</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You need <strong>advanced reporting</strong> and analytics for inventory decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You prefer <strong>free plans</strong> and transparent pricing that scales</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You need <strong>European data hosting</strong> for GDPR compliance</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 border-2 border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-600 mb-6 flex items-center gap-2">
                <AlertCircle className="h-8 w-8" />
                When Sortly Can Fit
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You primarily need a <strong>visual catalog</strong> to browse items with photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Your process is <strong>light on purchasing</strong> and multi-location controls</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You mainly need <strong>tagging and finding items</strong> visually</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You don't need <strong>automated reordering</strong> or advanced workflows</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You're okay with <strong>US data hosting</strong> and business hours support</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">You prefer <strong>folder-style organization</strong> over operational dashboards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              What Customers Say After Switching from Sortly
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses that migrated from Sortly to StockFlow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                {testimonial.fromSortly && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Migrated from Sortly
                    </span>
                  </div>
                )}
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about StockFlow vs Sortly
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>



      {/* Structured Data */}
      <StructuredData data={[
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
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.stockflowsystems.com/stockflow-vs-sortly",
          "name": "StockFlow vs Sortly   Compare Features, Pricing, and Migration",
          "headline": "StockFlow vs Sortly: Free Plan vs $25/month, Better Features, 5-7 Day Setup",
          "description": "Compare StockFlow vs Sortly 2026. Free forever vs $25/month, better features. 5-7 day setup vs 30+ days. EU hosting. Save 100% costs.",
          "url": "https://www.stockflowsystems.com/stockflow-vs-sortly",
          "inLanguage": "en",
          "isPartOf": {
            "@type": "WebSite",
            "name": "StockFlow",
            "url": "https://www.stockflowsystems.com"
          },
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://www.stockflowsystems.com/Inventory-Management.png"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.stockflowsystems.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "StockFlow vs Sortly",
                "item": "https://www.stockflowsystems.com/stockflow-vs-sortly"
              }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow",
          "description": "Free inventory management software with real-time tracking, barcode scanning, multi-location support, and automated reorder points. Save 90% vs Sortly.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Inventory Management Software",
          "operatingSystem": "Web Browser, iOS, Android",
          "softwareVersion": "2.0",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Up to 100 products",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            },
            {
              "@type": "Offer",
              "price": "29",
              "priceCurrency": "EUR",
              "description": "Growth plan - Unlimited products",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "500",
            "bestRating": "5",
            "worstRating": "1"
          },
          "author": {
            "@type": "Organization",
            "name": "StockFlow",
            "url": "https://www.stockflowsystems.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "StockFlow",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.stockflowsystems.com/logo.png"
            }
          },
          "image": "https://www.stockflowsystems.com/Inventory-Management.png",
          "screenshot": "https://www.stockflowsystems.com/Inventory-Management.png",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflowsystems.com/stockflow-vs-sortly"
          },
          "featureList": [
            "Real-time inventory tracking",
            "Barcode scanning",
            "Multi-location support",
            "Automated reorder points",
            "Mobile app",
            "Advanced reporting",
            "Free plan available",
            "European data hosting"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Sortly",
          "description": "Visual inventory catalog software with folder-style organization and photo-heavy item displays.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Inventory Management Software",
          "operatingSystem": "Web Browser, iOS, Android",
          "offers": [
            {
              "@type": "Offer",
              "price": "25",
              "priceCurrency": "USD",
              "description": "Basic plan",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "price": "49",
              "priceCurrency": "USD",
              "description": "Advanced plan",
              "availability": "https://schema.org/InStock"
            }
          ]
        },
        ...testimonials.map((testimonial) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": "StockFlow"
          },
          "author": {
            "@type": "Person",
            "name": testimonial.name
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": testimonial.rating.toString(),
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": testimonial.content
        }))
      ]} />
    </SeoPageLayout>
  );
}