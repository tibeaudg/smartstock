import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '@/components/StructuredData';
import { 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Building2
} from 'lucide-react';

export default function StockManagementSoftware() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is stock management software?",
      answer: "Stock management software is a digital tool that helps businesses track, monitor, and optimize inventory levels in real-time. It automates stock counting, reordering, and reporting processes, enabling businesses to maintain optimal inventory levels, reduce costs, and prevent stockouts or overstock situations."
    },
    {
      question: "Why do small businesses need stock management software?",
      answer: "Small businesses benefit from stock management software by reducing manual errors (which can cost 10-20% of inventory value), saving 10+ hours weekly on inventory tasks, preventing stockouts that lose sales, optimizing cash flow by reducing tied-up capital, and enabling data-driven purchasing decisions."
    },
    {
      question: "How much does stock management software cost?",
      answer: "StockFlow offers free stock management software for up to 100 products. Premium plans start at â‚¬0.004 per additional product per month. Most businesses see ROI within the first month through time savings and error reduction alone. Many solutions offer free trials to test before committing."
    },
    {
      question: "Can stock management software integrate with other business systems?",
      answer: "Yes! Modern stock management software like StockFlow integrates with accounting systems (QuickBooks, Xero), ecommerce platforms (Shopify, WooCommerce), POS systems, and ERP software. This ensures seamless data flow and eliminates manual data entry across your business operations."
    },
    {
      question: "Is stock management software suitable for small warehouses?",
      answer: "Absolutely! Stock management software is scalable and perfect for small warehouses. StockFlow works great for businesses with 10 products or 10,000+ products. Features like multi-location tracking, barcode scanning, and automated alerts benefit businesses of all sizes."
    }
  ];

  const softwareFeatures = [
    {
      feature: "Real-Time Stock Tracking",
      benefit: "Always know exactly what you have in stock",
      timeSaved: "5-8 hours/week"
    },
    {
      feature: "Automated Reorder Alerts",
      benefit: "Never run out of stock again",
      timeSaved: "2-3 hours/week"
    },
    {
      feature: "Barcode Scanning",
      benefit: "99.9% accuracy, eliminate manual errors",
      timeSaved: "4-6 hours/week"
    },
    {
      feature: "Multi-Location Management",
      benefit: "Manage multiple warehouses from one system",
      timeSaved: "3-5 hours/week"
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
      "name": "StockFlow - Stock Management Software",
      "description": "Professional stock management software designed for SMEs. Track inventory in real-time, optimize stock levels, automate reordering, and streamline warehouse operations. Free trial available.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser, iOS, Android",
      "softwareVersion": "2.0",
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
        "ratingCount": "200",
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
      "url": "https://www.stockflow.be/stock-management-software",
      "featureList": [
        "Real-time stock tracking",
        "Automated reorder alerts",
        "Barcode scanning",
        "Multi-location management",
        "Mobile access",
        "Analytics and reporting"
      ]
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
          "name": "Stock Management Software",
          "item": "https://www.stockflow.be/stock-management-software"
        }
      ]
    }
  ];
  
  return (
    <SeoPageLayout title="Stock Management Software">
      <SEO
        title="Stock Management Software for Small Business 2025 | StockFlow"
        description="Professional stock management software for SMEs. Track inventory in real-time, optimize stock levels, automate reordering, and save 10+ hours weekly. Free trial available."
        keywords="stock management software, inventory software, stock control, warehouse software, SMB stock, small business inventory, stock tracking software, inventory management for small business"
        url="https://www.stockflow.be/stock-management-software"
        locale="en"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/stock-management-software' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/stockbeheer-software' }
        ]}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Stock Management Software: <span className="text-blue-600">All-in-One Solution for Business Growth</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Professional stock management software designed for SMEs. Track inventory, optimize stock levels, and streamline operations.
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
                alt="Stock management software dashboard showing real-time inventory tracking, automated alerts, and warehouse management features"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Essential Stock Management Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage stock efficiently and save time
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {softwareFeatures.map((item, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.feature}</h3>
                    <p className="text-gray-700 mb-2">{item.benefit}</p>
                    <div className="flex items-center text-green-600 font-semibold">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>Time Saved: {item.timeSaved}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Small Business */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Small Businesses Choose Stock Management Software
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: "Save 10+ Hours Weekly", description: "Automate inventory tasks that take hours manually. Focus on growing your business instead of managing spreadsheets." },
              { icon: Shield, title: "Reduce Errors by 90%", description: "Barcode scanning and automated processes eliminate the 88% error rate common in manual inventory management." },
              { icon: Building2, title: "Scale as You Grow", description: "Start small and expand seamlessly. Software grows with your business from 10 to 10,000+ products." },
              { icon: BarChart3, title: "Better Decision Making", description: "Get insights into stock turnover, best sellers, and seasonal trends to optimize purchasing." },
              { icon: Zap, title: "Prevent Stockouts", description: "Automated reorder alerts ensure you never run out of popular products, protecting your sales." },
              { icon: Clock, title: "Improve Cash Flow", description: "Optimize stock levels to reduce tied-up capital while ensuring adequate inventory for demand." }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Return on Investment
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-lg">Hours Saved/Week</div>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">90%</div>
              <div className="text-lg">Error Reduction</div>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">â‚¬2,000+</div>
              <div className="text-lg">Monthly Savings</div>
            </div>
          </div>
          <p className="text-xl opacity-90">
            Most small businesses see ROI within the first month. At â‚¬50/hour, saving 10 hours weekly = â‚¬2,000/month in time savings alone.
          </p>
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
            <Link to="/stockbeheer-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Stockbeheer Software (Dutch)
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nederlandse versie - stockbeheer software voor kleine bedrijven.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>
            <Link to="/inventory-management-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete inventory management solution for all business sizes.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more â†’</div>
              </div>
            </Link>
            <Link to="/stock-management" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Stock Management
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Learn best practices for effective stock management.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more â†’</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Managing Stock More Efficiently Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free for up to 100 products. Save 10+ hours weekly. Reduce errors by 90%. No credit card required.
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

