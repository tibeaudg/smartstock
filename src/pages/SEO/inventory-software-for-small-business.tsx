import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  BarChart3, 
  Users, 
  Zap, 
  CheckCircle,
  Star,
  DollarSign,
  Heart,
  Building,
  Camera
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function InventorySoftwareForSmallBusiness() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is the best inventory software for small business?",
      answer: "StockFlow is specifically designed for small businesses, offering an intuitive interface, affordable pricing, and essential features without complexity. It's perfect for small businesses that need professional inventory management without the overhead of enterprise solutions."
    },
    {
      question: "How much does inventory software cost for small businesses?",
      answer: "StockFlow offers a free plan for small businesses with up to 30 products, making it perfect for startups and small operations. Premium plans start at just $29/month, which is significantly more affordable than enterprise solutions that can cost hundreds per month."
    },
    {
      question: "Do small businesses really need inventory software?",
      answer: "Yes! Small businesses often benefit the most from inventory software because it helps them compete with larger companies, reduces manual errors, saves time, and provides insights that were previously only available to large enterprises with dedicated staff."
    },
    {
      question: "What features should small business inventory software have?",
      answer: "For small businesses, look for easy setup, mobile access, barcode scanning, basic reporting, affordable pricing, good customer support, and the ability to grow with your business. StockFlow includes all these features and more."
    },
    {
      question: "Can small business inventory software integrate with other tools?",
      answer: "Yes, StockFlow integrates with popular small business tools like accounting software, e-commerce platforms, and payment processors. This ensures seamless data flow across your entire business ecosystem without manual data entry."
    }
  ];

  const features = [
    {
      icon: Heart,
      title: "Small Business Focused",
      description: "Designed specifically for small businesses with simple setup and intuitive interface."
    },
    {
      icon: Camera,
      title: "Mobile Barcode Scanning",
      description: "Use your smartphone camera to scan barcodes for quick inventory updates."
    },
    {
      icon: Zap,
      title: "Automated Alerts",
      description: "Get notified when stock is low so you never run out of popular items."
    },
    {
      icon: BarChart3,
      title: "Simple Reports",
      description: "Easy-to-understand reports that help you make better business decisions."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team members using role-based access control."
    },
    {
      icon: DollarSign,
      title: "Affordable Pricing",
      description: "Start free and grow with plans that fit your budget and business size."
    }
  ];

  const benefits = [
    "Start with a free plan - no risk",
    "Save 10+ hours per week on manual tracking",
    "Reduce inventory errors by 95%",
    "Never run out of stock again",
    "Make better purchasing decisions",
    "Grow your business with confidence",
    "Access from anywhere with mobile app",
    "Get support when you need it"
  ];

  const smallBusinessTypes = [
    {
      title: "Retail Stores",
      description: "Perfect for small retail shops managing multiple product lines.",
      icon: "🏪",
      features: ["Point of sale integration", "Customer insights", "Seasonal planning"]
    },
    {
      title: "E-commerce",
      description: "Ideal for online stores selling through multiple channels.",
      icon: "💻",
      features: ["Multi-channel sync", "Order management", "Shipping integration"]
    },
    {
      title: "Restaurants",
      description: "Great for restaurants and cafes managing food inventory.",
      icon: "🍽️",
      features: ["Expiry tracking", "Recipe costing", "Supplier management"]
    },
    {
      title: "Service Businesses",
      description: "Perfect for service businesses with equipment and supplies.",
      icon: "🔧",
      features: ["Equipment tracking", "Maintenance scheduling", "Cost tracking"]
    }
  ];

  const testimonials = [
    {
      name: "Lisa Chen",
      role: "Owner, Boutique Fashion",
      content: "StockFlow helped our small boutique compete with big retailers. The inventory tracking is so easy to use, and we never run out of popular items anymore.",
      rating: 5
    },
    {
      name: "Tom Wilson",
      role: "Manager, Local Hardware Store",
      content: "As a small business, we needed something affordable and easy to use. StockFlow was perfect - we set it up in one day and it's been saving us hours every week.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Owner, Family Restaurant",
      content: "The mobile app is fantastic for our restaurant. We can track inventory on the go, and the alerts help us avoid running out of ingredients during busy periods.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Free Plan",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Up to 30 products",
        "Basic inventory tracking",
        "Mobile access",
        "Email support"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Growth Plan",
      price: "$29",
      period: "/month",
      description: "Best for growing small businesses",
      features: [
        "Unlimited products",
        "Advanced analytics",
        "Barcode scanning",
        "Priority support"
      ],
      cta: "Start Free Trial",
      popular: true
    }
  ];

  const successStories = [
    {
      title: "Local Bakery Increases Sales by 40%",
      description: "By tracking inventory better, this small bakery reduced waste and increased sales significantly.",
      metric: "40% increase in sales"
    },
    {
      title: "Retail Store Saves 15 Hours Per Week",
      description: "Automated inventory tracking freed up time for customer service and business growth.",
      metric: "15 hours saved weekly"
    },
    {
      title: "Restaurant Reduces Food Waste by 60%",
      description: "Better inventory management helped this restaurant track expiry dates and reduce waste.",
      metric: "60% less waste"
    }
  ];

  return (
    <SeoPageLayout title="Inventory Software for Small Business">
      <SEO
        title="Best Inventory Software for Small Business 2024 | StockFlow"
        description="Perfect inventory software for small businesses. Easy to use, affordable pricing, and powerful features. Start free with up to 30 products. No credit card required!"
        keywords="inventory software for small business, small business inventory software, inventory management for small business, small business inventory management, inventory software small business, small business stock management, inventory tracking for small business, small business inventory system, inventory software for small companies, small business inventory tracking, inventory management software for small business, stock management software for small business, inventory software for small retailers, small business inventory app, inventory software for small restaurants, small business inventory solution, affordable inventory software, cheap inventory software, free inventory software for small business, inventory software for startups"
        url="https://www.stockflow.be/inventory-software-for-small-business"
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
            <div className="flex justify-center items-center mb-6">
              <Building className="w-8 h-8 text-blue-400 mr-3" />
              <span className="text-blue-400 font-semibold text-lg">Built for Small Business</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              <span className="text-blue-400">Inventory Software</span> for Small Business
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Simple, affordable, and powerful inventory management designed specifically for small businesses. Start free with up to 30 products and grow with your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Start Free Now
              </Link>
              <Link
                to="/demo"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Watch Demo
              </Link>
            </div>
            <p className="text-sm text-gray-200">No credit card required • Start with 30 products free</p>
          </div>
        </div>
      </section>

      {/* Why Small Business Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Small Businesses <span className="text-blue-600">Choose StockFlow</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Small businesses need inventory software that's simple to use, affordable, and grows with them. StockFlow is designed specifically for small businesses, offering professional features without the complexity or cost of enterprise solutions.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Unlike complex enterprise systems, StockFlow focuses on what small businesses actually need: easy setup, mobile access, and essential features that help you compete with larger companies.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Start Free</h3>
                  <p className="text-sm text-blue-700">No risk with our free plan for up to 30 products</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Grow With You</h3>
                  <p className="text-sm text-green-700">Scale from startup to established business</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Perfect for Small Business</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Easy setup in minutes, not hours</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Affordable pricing that fits your budget</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Mobile access for on-the-go management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>No technical expertise required</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Grows with your business</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Features Designed for <span className="text-blue-600">Small Business</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your inventory efficiently, without the complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits for <span className="text-blue-600">Small Business</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how StockFlow helps small businesses compete and grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Perfect for Every <span className="text-blue-600">Small Business</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're running a retail store, restaurant, or service business, StockFlow adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {smallBusinessTypes.map((type, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature, featureIndex) => (
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

      {/* Success Stories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Small Business <span className="text-blue-600">Success Stories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how other small businesses have transformed their operations with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{story.title}</h3>
                <p className="text-gray-700 mb-4">{story.description}</p>
                <div className="text-2xl font-bold text-blue-600">{story.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Small Business <span className="text-blue-600">Owners Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from small business owners using StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
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
              Affordable Pricing for <span className="text-blue-600">Small Business</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Start free and grow with plans designed for small business budgets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white p-8 rounded-lg shadow-lg ${plan.popular ? 'border-2 border-blue-600' : ''}`}>
                {plan.popular && (
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold text-center mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {plan.price}<span className="text-lg text-gray-500">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  className={`w-full py-3 rounded-lg font-semibold text-center block transition ${
                    plan.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Small Business Inventory Management Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join thousands of small businesses using StockFlow to manage their inventory efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Start Free Now
            </Link>
            <Link
              to="/demo"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition"
            >
              Watch Demo
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-75">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Start with 30 products free
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Setup in minutes
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything small business owners need to know about inventory software</p>
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
            The best inventory software for small businesses. Simple, affordable, and designed for growth.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Inventory software for small business success.
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
                "name": "StockFlow - Inventory Software for Small Business",
                "description": "Perfect inventory software for small businesses. Easy to use, affordable pricing, and powerful features. Start free with up to 30 products.",
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
                  "ratingCount": "500",
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
                  "@id": "https://www.stockflow.be/inventory-software-for-small-business"
                },
                "featureList": [
                  "Small business focused",
                  "Mobile barcode scanning",
                  "Automated alerts",
                  "Simple reports",
                  "Team collaboration",
                  "Affordable pricing"
                ]
              }
        ]} />
    </SeoPageLayout>
  );
}
