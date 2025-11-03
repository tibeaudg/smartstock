import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '../../components/StructuredData';
import { 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Gift
} from 'lucide-react';

export default function FreeStockManagement() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Is there really free stock management software available?",
      answer: "Yes! StockFlow offers completely free stock management for up to 100 products. No credit card required, no hidden fees. You get real-time tracking, mobile access, barcode scanning, and basic reporting at no cost. Perfect for small businesses and startups."
    },
    {
      question: "What features are included in free stock management?",
      answer: "The free plan includes: tracking up to 100 products, real-time inventory updates, mobile barcode scanning, basic analytics and reports, email support, automatic backups, and access from any device. All essential features to get started with professional stock management."
    },
    {
      question: "Can I upgrade from free stock management when I grow?",
      answer: "Absolutely! StockFlow scales with your business. When you exceed 100 products, you simply pay €0.004 per additional product per month. There's no lock-in, and you can upgrade or downgrade at any time. Start free and grow seamlessly."
    },
    {
      question: "How does free stock management compare to paid plans?",
      answer: "Free stock management gives you all core features for up to 100 products. Paid plans unlock unlimited products, advanced analytics, priority support, API access, multi-location management, and custom integrations. But the free plan is perfect for getting started."
    },
    {
      question: "Are there any limitations with free stock management?",
      answer: "The free plan limits you to 100 products, but includes all core features. There are no limitations on users, locations, or features - just the product count. This makes it perfect for small businesses testing stock management or those with smaller inventories."
    }
  ];

  const structuredData = [
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
      "@type": "SoftwareApplication",
      "name": "StockFlow - Free Stock Management",
      "description": "Free stock management software for up to 100 products. Track inventory in real-time, scan barcodes, and automate alerts. No credit card required. Perfect for small businesses.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Free plan - up to 100 products",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      },
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
      "url": "https://www.stockflow.be/free-stock-management"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.stockflow.be"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Free Stock Management",
          "item": "https://www.stockflow.be/free-stock-management"
        }
      ]
    }
  ];
  
  return (
    <SeoPageLayout title="Free Stock Management">
      <SEO
        title="Free Stock Management Software | Track 100 Products Free | StockFlow"
        description="Free stock management for up to 100 products. Real-time tracking, barcode scanning, automated alerts. No credit card required. Perfect for small businesses - start free today."
        keywords="free stock management, free inventory software, free stock control, no cost inventory, free warehouse management, free inventory tracking, free stock tracking, gratis stockbeheer"
        url="https://www.stockflow.be/free-stock-management"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/free-stock-management' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/gratis-stockbeheer' }
        ]}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Free Stock Management: <span className="text-blue-600">Professional Tools at Zero Cost</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Free stock management for up to 30 products. No credit card required. Perfect for small businesses and startups.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/pricing" className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition">
                  View Pricing
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">500+ Businesses</span>
              </div>
            </div>
            <div>
              <img 
                src="/Inventory-Management.png" 
                alt="Free stock management software dashboard showing real-time inventory tracking and analytics for small businesses"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-green-100 text-green-800 px-6 py-3 rounded-full mb-6">
              <Gift className="h-6 w-6 mr-2" />
              <span className="font-bold">100% Free Forever - Up to 100 Products</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What's Included in Free Stock Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage stock professionally - completely free
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Package, title: "Real-Time Tracking", description: "Monitor stock levels in real-time with instant updates across all devices" },
              { icon: BarChart3, title: "Analytics & Reports", description: "Basic reports and insights to make data-driven inventory decisions" },
              { icon: Zap, title: "Automated Alerts", description: "Get notified automatically when stock drops below minimum levels" },
              { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security with automatic daily backups included" },
              { icon: Clock, title: "Mobile Access", description: "Access and manage stock from any device - desktop, tablet, or smartphone" },
              { icon: CheckCircle, title: "Barcode Scanning", description: "Scan barcodes with your phone camera for quick and accurate updates" }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Paid Comparison */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Free vs Paid: What's the Difference?
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">Free Plan</th>
                  <th className="px-6 py-4 text-center font-semibold bg-blue-700">Paid Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-medium">Products</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">Up to 100</td>
                  <td className="px-6 py-4 text-center bg-blue-50">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Real-Time Tracking</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Barcode Scanning</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Mobile App</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Advanced Analytics</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-400">Basic</span>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Priority Support</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-400">Email</span>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
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
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/gratis-stockbeheer" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Gratis Stockbeheer (Dutch)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nederlandse versie - gratis stockbeheer software.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>
            <Link to="/free-inventory-management" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Free Inventory Management
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Free inventory management for growing businesses.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
            <Link to="/pricing" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Pricing Plans
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  See pricing options and upgrade paths when you grow.
                </p>
                <div className="text-blue-600 text-sm font-semibold">View pricing →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Free Stock Management Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free for up to 100 products. No credit card required. All core features included. Upgrade when you grow.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData data={structuredData} />
    </SeoPageLayout>
  );
}