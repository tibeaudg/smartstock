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
  TrendingUp,
  Star
} from 'lucide-react';
import { generateFAQSchema, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/structuredData';

import { StructuredData } from '../../components/StructuredData';
export default function StockFlowVsSortly() {
  usePageRefresh();

  const faqData = [
    {
      question: "What's the main difference between StockFlow and Sortly?",
      answer: "StockFlow offers a completely free plan for up to 30 products, while Sortly only offers a 14-day trial. StockFlow also includes unlimited users at all price tiers, whereas Sortly charges per user. Additionally, StockFlow provides European data hosting and Dutch language support, making it ideal for Belgian businesses."
    },
    {
      question: "Is StockFlow better than Sortly for small businesses?",
      answer: "For small businesses, especially in Europe, StockFlow is often the better choice due to its free tier, unlimited users, and lower pricing. StockFlow's premium plan starts at €29/month with unlimited products, while Sortly starts at $29/month with limited users and features."
    },
    {
      question: "Can I migrate from Sortly to StockFlow?",
      answer: "Yes, you can easily migrate from Sortly to StockFlow. Our support team can help you import your product data, photos, and inventory history. Most migrations are completed within a few hours."
    },
    {
      question: "Does StockFlow have all the features that Sortly has?",
      answer: "StockFlow offers all essential inventory management features including barcode scanning, low stock alerts, multi-location support, custom reports, and a mobile app. While some enterprise features differ, StockFlow provides everything small to medium businesses need at a better price point."
    },
    {
      question: "How much money can I save by choosing StockFlow over Sortly?",
      answer: "Businesses typically save $300-600 per year by choosing StockFlow. With our free plan for up to 30 products and no per-user fees, the savings add up quickly compared to Sortly's $29/month starting price plus additional user costs."
    }
  ];

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Free Plan Available', stockflow: true, competitor: 'Limited (14-day trial)' },
    { feature: 'Mobile App', stockflow: true, competitor: true },
    { feature: 'Real-time Sync', stockflow: true, competitor: true },
    { feature: 'Multi-branch Support', stockflow: true, competitor: 'Enterprise only' },
    { feature: 'Barcode Scanning', stockflow: true, competitor: true },
    { feature: 'Low Stock Alerts', stockflow: true, competitor: true },
    { feature: 'Custom Reports', stockflow: true, competitor: 'Limited' },
    { feature: 'Multi-user Access', stockflow: 'Unlimited', competitor: 'Paid tiers' },
    { feature: 'API Access', stockflow: true, competitor: 'Enterprise only' },
    { feature: 'European Data Hosting', stockflow: true, competitor: false },
    { feature: 'Dutch Language Support', stockflow: true, competitor: false },
    { feature: 'Starting Price', stockflow: 'Free', competitor: '$29/month' },
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Better Pricing',
      description: 'Start free with up to 30 products. No credit card required. Sortly charges $29/month minimum.',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Full-featured mobile app with offline mode. Manage inventory from anywhere.',
    },
    {
      icon: Shield,
      title: 'European Privacy',
      description: 'GDPR-compliant with data hosted in Europe. Your data stays protected.',
    },
    {
      icon: Users,
      title: 'Unlimited Users',
      description: 'Add your entire team without per-user fees. Collaborate freely.',
    },
    {
      icon: Zap,
      title: 'Faster Setup',
      description: 'Get started in minutes, not hours. No complex configuration needed.',
    },
    {
      icon: TrendingUp,
      title: 'Better for Growth',
      description: 'Scale seamlessly as you grow. No forced upgrades or hidden costs.',
    },
  ];

  // Structured Data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.stockflow.be', position: 1 },
    { name: 'Comparisons', url: 'https://www.stockflow.be', position: 2 },
    { name: 'StockFlow vs Sortly', url: 'https://www.stockflow.be/stockflow-vs-sortly', position: 3 }
  ]);

  const faqSchema = generateFAQSchema(faqData);

  const softwareSchema = generateSoftwareApplicationSchema({
    name: 'StockFlow - Inventory Management',
    description: 'Free inventory management software with unlimited users and European data hosting',
    category: 'BusinessApplication',
    operatingSystem: 'Web Browser, iOS, Android',
    price: '0',
    currency: 'EUR',
    rating: { value: '4.8', count: '32' },
    url: 'https://www.stockflow.be',
    image: 'https://www.stockflow.be/Inventory-Management.png'
  });

  return (
    <SeoPageLayout title="StockFlow vs Sortly">
      <SEO
        title="StockFlow vs Sortly: Which Inventory Software is Better in 2025?"
        description="Compare StockFlow and Sortly inventory management software. See features, pricing, and why StockFlow is the better choice for small businesses. Start free today."
        keywords="stockflow vs sortly, sortly alternative, inventory management software comparison, sortly vs stockflow, best inventory app, free inventory software"
        url="https://www.stockflow.be/stockflow-vs-sortly"
        hreflang={[
          { lang: "en", url: "https://www.stockflow.be/stockflow-vs-sortly" },
          { lang: "nl", url: "https://www.stockflow.be/nl/stockflow-vs-sortly" }
        ]}
        structuredData={[breadcrumbSchema, faqSchema, softwareSchema]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              StockFlow vs Sortly: <span className="text-blue-600">The Complete Comparison</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choosing between StockFlow and Sortly for inventory management? 
              See why thousands of businesses choose StockFlow for its better pricing, 
              free plan, and powerful features.
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
                View Pricing
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
              <span className="text-sm text-gray-600">500+ Happy Businesses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Quick Comparison: StockFlow vs Sortly
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Both are solid inventory management solutions, but StockFlow offers better value 
            for small to medium businesses with its free tier and European data hosting.
          </p>
          <ComparisonTable 
            competitorName="Sortly" 
            features={comparisonFeatures}
          />
        </div>
      </section>

      {/* Why Choose StockFlow */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Choose StockFlow Over Sortly?
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
            Pricing: StockFlow vs Sortly
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-blue-500 rounded-lg p-8 bg-blue-50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">StockFlow</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">Free</div>
                <p className="text-gray-600">Up to 30 products</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Unlimited users</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Mobile app included</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Real-time sync</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Barcode scanning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>No credit card required</span>
                </li>
              </ul>
              <Link 
                to="/auth"
                className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Free
              </Link>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Sortly</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$29/mo</div>
                <p className="text-gray-600">14-day trial only</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Limited users</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Mobile app included</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Cloud sync</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Barcode scanning</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Credit card required</span>
                </li>
              </ul>
              <div className="block w-full text-center bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
                Starts at $29/mo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Migration Guide */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            How to Switch from Sortly to StockFlow
          </h2>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Export your data from Sortly</h3>
                  <p className="text-gray-600">
                    Export your inventory data as CSV from Sortly's export feature.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sign up for StockFlow</h3>
                  <p className="text-gray-600">
                    Create your free StockFlow account - no credit card needed.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Import your data</h3>
                  <p className="text-gray-600">
                    Use our CSV import tool to quickly transfer your inventory data.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Start managing inventory</h3>
                  <p className="text-gray-600">
                    You're ready to go! Download the mobile app and start tracking.
                  </p>
                </div>
              </div>
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
              <h3 className="font-semibold text-lg mb-2">Is StockFlow really free?</h3>
              <p className="text-gray-600">
                Yes! StockFlow is free for up to 30 products with unlimited users. 
                No credit card required, no trial period - it's free forever.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Can I import data from Sortly?</h3>
              <p className="text-gray-600">
                Yes, you can export your data from Sortly as CSV and import it into StockFlow 
                using our CSV import feature.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Does StockFlow have a mobile app?</h3>
              <p className="text-gray-600">
                Yes! StockFlow has full-featured mobile apps for iOS and Android with offline support, 
                barcode scanning, and real-time synchronization.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Where is my data stored?</h3>
              <p className="text-gray-600">
                StockFlow hosts all data in European data centers, ensuring GDPR compliance 
                and data sovereignty. Sortly stores data in the US.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Switch to StockFlow?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of businesses that switched from Sortly to StockFlow. 
            Start free today - no credit card required.
          </p>
          <Link 
            to="/auth" 
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Start Free Trial
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
                  "headline": "StockFlow vs Sortly: Complete Comparison 2025",
                  "description": "Compare StockFlow and Sortly inventory management software. Features, pricing, and migration guide.",
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

