import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  BarChart3, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  Cloud,
  Database,
  Zap
} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
export default function InventorySoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is inventory software?",
      answer: "Inventory software is a digital solution that helps businesses track, manage, and optimize their stock levels, orders, and warehouse operations. It provides real-time visibility into inventory levels, automates reordering processes, and helps prevent stockouts or overstock situations."
    },
    {
      question: "What are the benefits of using inventory software?",
      answer: "Inventory software provides benefits like real-time tracking, automated reorder points, reduced human errors, better demand forecasting, improved cash flow, enhanced customer service, detailed analytics, and integration with other business systems."
    },
    {
      question: "How much does inventory software cost?",
      answer: `Inventory software pricing varies, but StockFlow offers a free plan for small businesses with up to 30 products. Premium plans start at ${formatPrice(29)}/month for advanced features. Most solutions offer free trials to test the software before committing.`
    },
    {
      question: "Can inventory software integrate with other systems?",
      answer: "Yes, modern inventory software like StockFlow integrates with accounting systems, e-commerce platforms, POS systems, and ERP software. This ensures seamless data flow across your entire business ecosystem."
    },
    {
      question: "Is inventory software suitable for small businesses?",
      answer: "Absolutely! Inventory software is especially beneficial for small businesses as it helps automate processes, reduce errors, and provides insights that were previously only available to large enterprises. StockFlow is specifically designed for SMEs and growing businesses."
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Real-time Tracking",
      description: "Monitor your inventory levels in real-time with instant updates across all locations and devices."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Scan product barcodes with your smartphone camera for quick and accurate inventory updates."
    },
    {
      icon: Zap,
      title: "Automated Alerts",
      description: "Set minimum stock levels and receive automatic notifications when it's time to reorder."
    },
    {
      icon: BarChart3,
      title: "Advanced Reports",
      description: "Get detailed insights into your inventory performance, sales trends, and demand forecasting."
    },
    {
      icon: Users,
      title: "Multi-user Access",
      description: "Collaborate with your team using role-based access control and real-time synchronization."
    },
    {
      icon: Cloud,
      title: "Cloud-based",
      description: "Access your inventory data from anywhere with secure cloud storage and automatic backups."
    }
  ];

  const benefits = [
    "Reduce inventory costs by up to 30%",
    "Eliminate stockouts and overstock situations",
    "Improve cash flow with better inventory turnover",
    "Save 10+ hours per week on manual tracking",
    "Increase customer satisfaction",
    "Make data-driven decisions",
    "Scale your business efficiently",
    "Integrate with existing systems"
  ];

  const useCases = [
    {
      title: "Small Business",
      description: "Perfect for small businesses looking to automate their inventory management without complex setup.",
      icon: "ðŸª",
      features: ["Easy setup", "Affordable pricing", "Essential features"]
    },
    {
      title: "E-commerce",
      description: "Ideal for online stores managing inventory across multiple sales channels.",
      icon: "ðŸ’»",
      features: ["Multi-channel sync", "Real-time updates", "Order management"]
    },
    {
      title: "Retail",
      description: "Great for retail stores needing real-time inventory tracking and point-of-sale integration.",
      icon: "ðŸ›ï¸",
      features: ["POS integration", "Barcode scanning", "Customer insights"]
    },
    {
      title: "Wholesale",
      description: "Essential for wholesale businesses managing large quantities and multiple suppliers.",
      icon: "ðŸ“¦",
      features: ["Bulk operations", "Supplier management", "Advanced reporting"]
    }
  ];

  const testimonials = [
    {
      name: "David Wilson",
      role: "Owner, Wilson Electronics",
      content: "StockFlow's inventory software saved us 15 hours per week. The automated reorder points are a game-changer for our business.",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "Operations Manager, Fashion Hub",
      content: "The real-time tracking feature helped us reduce stockouts by 95%. Our customer satisfaction has never been higher.",
      rating: 5
    },
    {
      name: "John Smith",
      role: "CEO, Tech Solutions",
      content: "We tried several inventory software solutions, but StockFlow was the only one that was both powerful and easy to use.",
      rating: 5
    }
  ];

  const comparisonFeatures = [
    {
      feature: "Real-time tracking",
      stockflow: "âœ“",
      competitors: "Limited"
    },
    {
      feature: "Mobile access",
      stockflow: "âœ“",
      competitors: "Extra cost"
    },
    {
      feature: "Barcode scanning",
      stockflow: "âœ“",
      competitors: "Premium only"
    },
    {
      feature: "Multi-location",
      stockflow: "âœ“",
      competitors: "Enterprise only"
    },
    {
      feature: "Free plan",
      stockflow: "âœ“",
      competitors: "âœ—"
    }
  ];

  return (
    <SeoPageLayout title="Inventory Software">
      <SEO
        title="Best Inventory Software 2024 - Track & Manage Stock | StockFlow"
        description="Discover the best inventory software for your business. Real-time tracking, barcode scanning, automated alerts, and more. Start free trial today!"
        keywords="stockflow, stock flow, stockflow app, stockflow software, inventory software, stock management software, inventory tracking software, inventory management software, stock software, inventory control software, warehouse management software, inventory system software, stock tracking software, inventory software for small business, best inventory software, inventory software free, cloud inventory software, inventory software comparison, inventory software features, inventory software pricing, inventory software reviews, inventory software demo, inventory software trial"
        url="https://www.stockflow.be/inventory-software"
      />

      {/* Hero Section with Background */}
      <section 
        className="relative py-16 sm:py-20 md:py-24 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              The Best <span className="text-blue-400">Inventory Software</span> for Your Business
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Streamline your inventory management with powerful software that tracks stock levels, automates reordering, and provides real-time insights. Join 500+ businesses using StockFlow to optimize their inventory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Start Free Trial
              </Link>

            </div>
            <p className="text-sm text-gray-200">Trusted by 500+ businesses worldwide</p>
          </div>
        </div>
      </section>

      {/* Why Choose StockFlow Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose <span className="text-blue-600">StockFlow</span> Inventory Software?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow is designed specifically for growing businesses that need powerful inventory management without the complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transform Your Business with <span className="text-blue-600">Inventory Software</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See immediate results with our comprehensive inventory software solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Perfect for Every <span className="text-blue-600">Business Type</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're a small business or a growing enterprise, StockFlow adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              StockFlow vs <span className="text-blue-600">Competitors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how StockFlow compares to other inventory software solutions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Competitors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{item.stockflow}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.competitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Our <span className="text-blue-600">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses using StockFlow inventory software.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Simple, Transparent <span className="text-blue-600">Pricing</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">{formatPrice(0)}<span className="text-lg text-gray-500">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Up to 30 products</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic inventory tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Mobile access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
              <Link
                to="/auth"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-center block hover:bg-blue-700 transition"
              >
                Start Free
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Growth Plan</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-4">{formatPrice(29)}<span className="text-lg text-gray-500">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited products</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Barcode scanning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                to="/auth"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-center block hover:bg-blue-700 transition"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of businesses using StockFlow to optimize their inventory management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Start Free Trial
            </Link>

          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-75">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant access
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free trial
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about inventory software</p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img
            src="/logo.png"
            alt="StockFlow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            The best inventory software for growing businesses. Simple, powerful, and designed for success.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Inventory software solutions for modern businesses.
            </p>
          </div>
        </div>
      </footer>

      {/* Schema.org Structured Data */}
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
        {"@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "StockFlow - Best Inventory Software",
                "description": "Discover the best inventory software for your business. Real-time tracking, barcode scanning, automated alerts, and more.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web Browser",
                "offers": [
                  {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "EUR",
                    "description": "Free plan - Up to 30 products",
                    "availability": "https://schema.org/InStock"
                  },
                  {
                    "@type": "Offer",
                    "price": "29",
                    "priceCurrency": "EUR",
                    "description": "Growth plan - Unlimited products with advanced features",
                    "availability": "https://schema.org/InStock"
                  }
                ],
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
                "image": "https://www.stockflow.be/Inventory-Management.png",
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://www.stockflow.be/inventory-software"
                },
                "featureList": [
                  "Real-time inventory tracking",
                  "Barcode scanning",
                  "Automated reorder points",
                  "Multi-location support",
                  "Advanced analytics",
                  "Mobile access",
                  "Team collaboration",
                  "Cloud-based storage"
                ]
              }
        ]} />
    </SeoPageLayout>
  );
}


