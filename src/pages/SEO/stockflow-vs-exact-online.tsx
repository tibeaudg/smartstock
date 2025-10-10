import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { 
  ArrowRight, 
  CheckCircle, 
  DollarSign, 
  Smartphone, 
  Zap,
  Shield,
  Users,
  Target,
  Star
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function StockFlowVsExactOnline() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan Available', stockflow: true, competitor: false },
    { feature: 'Mobile App', stockflow: true, competitor: 'Limited' },
    { feature: 'Easy Setup', stockflow: true, competitor: false },
    { feature: 'Small Business Focused', stockflow: true, competitor: false },
    { feature: 'Barcode Scanning', stockflow: true, competitor: 'Add-on' },
    { feature: 'Real-time Inventory', stockflow: true, competitor: true },
    { feature: 'Multi-branch Support', stockflow: true, competitor: true },
    { feature: 'Accounting Integration', stockflow: 'Via API', competitor: 'Built-in' },
    { feature: 'Learning Curve', stockflow: 'Easy', competitor: 'Steep' },
    { feature: 'Dutch Language', stockflow: true, competitor: true },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '€255/month' },
    { feature: 'Contract Required', stockflow: false, competitor: true },
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Much Lower Cost',
      description: 'Start free vs €255/month for Exact Online. Save thousands per year on inventory management.',
    },
    {
      icon: Zap,
      title: 'Simple & Fast',
      description: 'Set up in minutes, not weeks. No complex training or consultants needed.',
    },
    {
      icon: Target,
      title: 'Built for SMEs',
      description: 'Designed specifically for small businesses. Not a scaled-down enterprise solution.',
    },
    {
      icon: Smartphone,
      title: 'True Mobile Experience',
      description: 'Full-featured mobile app. Exact Online mobile is limited compared to desktop.',
    },
    {
      icon: Users,
      title: 'No Hidden Costs',
      description: 'Transparent pricing with no surprise fees. Exact Online has many add-ons and extras.',
    },
    {
      icon: Shield,
      title: 'Flexible & Agile',
      description: 'No long-term contracts. Cancel anytime. Exact typically requires annual commitments.',
    },
  ];

  return (
    <SeoPageLayout title="StockFlow vs Exact Online">
      <SEO
        title="StockFlow vs Exact Online: Affordable Inventory Alternative 2025"
        description="Compare StockFlow and Exact Online for inventory management. StockFlow offers the same features at a fraction of the cost. Perfect for SMEs. Start free."
        keywords="stockflow vs exact online, exact online alternative, inventory management software, voorraadbeheer software, affordable exact alternative, small business inventory"
        url="https://www.stockflow.be/stockflow-vs-exact-online"
        hreflang={[
          { lang: "en", url: "https://www.stockflow.be/stockflow-vs-exact-online" },
          { lang: "nl", url: "https://www.stockflow.be/nl/stockflow-vs-exact-online" }
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              StockFlow vs Exact Online: <span className="text-blue-600">The Affordable Alternative</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get powerful inventory management without the enterprise price tag. 
              StockFlow delivers the features SMEs need from Exact Online, starting free instead of €255/month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Try StockFlow Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/pricing" 
                className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Compare Pricing
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">5.0/5</span>
              </div>
              <span className="text-sm text-gray-600">|</span>
              <span className="text-sm text-gray-600">Trusted by 500+ Businesses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Difference Highlight */}
      <section className="py-12 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">€0</div>
              <p className="text-lg">StockFlow Starting Price</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">vs</div>
              <p className="text-lg opacity-90">Compare</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">€255/mo</div>
              <p className="text-lg">Exact Online Minimum</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Feature Comparison: StockFlow vs Exact Online
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Exact Online is a comprehensive ERP system, but for pure inventory management, 
            StockFlow delivers what SMEs actually need without the complexity and cost.
          </p>
          <ComparisonTable 
            competitorName="Exact Online" 
            features={comparisonFeatures}
          />
        </div>
      </section>

      {/* Why Choose StockFlow */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Small Businesses Choose StockFlow Over Exact Online
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Real Cost Comparison: StockFlow vs Exact Online
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-blue-500 rounded-lg p-8 bg-blue-50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">StockFlow</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">€0</div>
                <p className="text-gray-600">Forever free for up to 30 products</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Full inventory management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Mobile app included</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Barcode scanning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Multi-branch support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>No setup fees</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>No contracts</span>
                </li>
              </ul>
              <Link 
                to="/auth"
                className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Free Now
              </Link>
              <p className="text-center text-sm text-gray-600 mt-4">
                <strong>Annual savings:</strong> €3,060+ compared to Exact Online
              </p>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Exact Online</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">€255/mo</div>
                <p className="text-gray-600">Minimum for inventory module</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Full ERP system</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Limited mobile features</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Barcode (add-on cost)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Multi-branch (higher tier)</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Implementation fees apply</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Annual contract typical</span>
                </li>
              </ul>
              <div className="block w-full text-center bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
                From €255/month
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Plus implementation & training costs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Choose Each */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Which Solution is Right for You?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Choose StockFlow if you:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Need inventory management only (not full ERP)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Are a small to medium-sized business</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Want to start immediately without complex setup</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Need a truly mobile-first solution</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Want to avoid long-term contracts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Have a limited budget</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Choose Exact Online if you:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Need a complete ERP system (accounting, payroll, CRM)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Are a larger enterprise with complex needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Have budget for implementation consultants</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Need deep accounting integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Can invest time in training and setup</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Already use Exact for accounting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Can StockFlow replace Exact Online for inventory?</h3>
              <p className="text-gray-600">
                For inventory management specifically, yes. StockFlow provides all the inventory features 
                SMEs need from Exact Online. However, if you need full ERP (accounting, payroll, etc.), 
                Exact Online is more comprehensive.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Can I integrate StockFlow with my accounting software?</h3>
              <p className="text-gray-600">
                Yes, StockFlow offers API access for integration with accounting software. You can also 
                export data to Excel/CSV for manual imports.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">How much can I save by switching to StockFlow?</h3>
              <p className="text-gray-600">
                Exact Online starts at €255/month (€3,060/year). StockFlow is free for small businesses 
                or starts at much lower pricing, potentially saving you thousands annually.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Is StockFlow as reliable as Exact Online?</h3>
              <p className="text-gray-600">
                Yes. StockFlow uses enterprise-grade infrastructure with 99.9% uptime, automatic backups, 
                and European data hosting. We're built specifically for reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Save Thousands on Inventory Management
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get the inventory features you need without the enterprise price tag. 
            Start free today - no credit card or contract required.
          </p>
          <Link 
            to="/auth" 
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Try StockFlow Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
                  "@context": "https://schema.org",
                  "@type": "Article",
                  "headline": "StockFlow vs Exact Online: Affordable Inventory Alternative 2025",
                  "description": "Compare StockFlow and Exact Online for inventory management. See features, pricing, and why StockFlow is better for SMEs.",
                  "author": {
                    "@type": "Organization",
                    "name": "StockFlow"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "StockFlow",
                    "logo": {
                      "@type": "ImageObject",
                      "url": "https://www.stockflow.be/logo.png"
                    }
                  },
                  "datePublished": "2025-01-01",
                  "dateModified": "2025-01-01"
                }
      ]} />
    </SeoPageLayout>
  );
}

