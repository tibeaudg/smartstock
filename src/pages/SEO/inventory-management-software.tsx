import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  Smartphone, 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  Camera, 
  Package, 
  Warehouse,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

export default function InventoryManagementSoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is inventory management software?",
      answer: "Inventory management software is a digital solution that helps businesses track, manage, and optimize their stock levels, orders, and warehouse operations. It provides real-time visibility into inventory levels, automates reordering processes, and helps prevent stockouts or overstock situations."
    },
    {
      question: "What features should inventory management software have?",
      answer: "The best inventory management software includes real-time tracking, barcode scanning, automated reorder points, multi-location support, reporting and analytics, integration capabilities, mobile access, and user role management. These features ensure efficient inventory control and business growth."
    },
    {
      question: "How much does inventory management software cost?",
      answer: "Inventory management software pricing varies, but StockFlow offers a free plan for small businesses with up to 30 products. Premium plans start at €29/month for advanced features. Most solutions offer free trials to test the software before committing."
    },
    {
      question: "Can inventory management software integrate with other systems?",
      answer: "Yes, modern inventory management software like StockFlow integrates with accounting systems, e-commerce platforms, POS systems, and ERP software. This ensures seamless data flow across your entire business ecosystem."
    },
    {
      question: "Is inventory management software suitable for small businesses?",
      answer: "Absolutely! Inventory management software is especially beneficial for small businesses as it helps automate processes, reduce errors, and provides insights that were previously only available to large enterprises. StockFlow is specifically designed for SMEs and growing businesses."
    }
  ];

  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Access your inventory management software from anywhere with our responsive mobile interface. Perfect for warehouse staff and managers on the go."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Scan barcodes directly with your smartphone camera for quick and accurate inventory updates. No additional hardware required."
    },
    {
      icon: Zap,
      title: "Real-time Synchronization",
      description: "All inventory changes sync instantly across all devices and locations. Never work with outdated information again."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with daily backups, SSL encryption, and GDPR compliance. Your data is always safe and protected."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team using role-based access control. Assign different permissions to different team members."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get insights into your inventory performance with detailed reports, trend analysis, and forecasting capabilities."
    }
  ];

  const benefits = [
    "No hidden costs or commitments",
    "Start immediately, no installation required",
    "User-friendly mobile interface",
    "Real-time synchronization between devices",
    "Automatic low stock notifications",
    "Barcode scanning functionality",
    "Professional reporting and analytics",
    "24/7 access from anywhere"
  ];

  const useCases = [
    {
      title: "E-commerce",
      description: "Perfect for online stores managing multiple product lines and seasonal inventory fluctuations.",
      icon: "🛒"
    },
    {
      title: "Retail",
      description: "Ideal for physical stores needing real-time inventory tracking and point-of-sale integration.",
      icon: "🏪"
    },
    {
      title: "Wholesale",
      description: "Great for wholesale businesses managing large quantities and multiple suppliers.",
      icon: "📦"
    },
    {
      title: "Manufacturing",
      description: "Essential for manufacturers tracking raw materials, work-in-progress, and finished goods.",
      icon: "🏭"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Operations Manager, TechStore",
      content: "StockFlow transformed our inventory management. We went from manual tracking to 95% automation in just 2 weeks.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Owner, Fashion Forward",
      content: "The barcode scanning feature alone saved us 3 hours per day. Our inventory accuracy improved from 85% to 99%.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Warehouse Manager, AutoParts Plus",
      content: "Real-time visibility into our inventory levels helped us reduce stockouts by 80% and improve customer satisfaction.",
      rating: 5
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Connect Your Data",
      description: "Import your existing inventory data or start fresh. Our inventory management software works with any business size."
    },
    {
      step: "2", 
      title: "Set Up Automation",
      description: "Configure automatic reorder points and notifications. Let the software handle routine inventory decisions."
    },
    {
      step: "3",
      title: "Train Your Team",
      description: "Get your team up and running quickly with our intuitive interface and comprehensive training resources."
    },
    {
      step: "4",
      title: "Optimize & Scale",
      description: "Use analytics to optimize your inventory levels and scale your operations as your business grows."
    }
  ];

  return (
    <SeoPageLayout title="Inventory Management Software">
      <SEO
        title="Inventory Management Software - Automate Your Stock Control | StockFlow"
        description="Professional inventory management software for growing businesses. Track stock levels, manage suppliers, and grow your business with our powerful yet simple platform. Free trial available."
        keywords="inventory management software, stock management, inventory control, warehouse management, inventory tracking, stock management software, inventory system, warehouse software, inventory optimization, stock control software, inventory management system, warehouse management system, inventory tracking software, stock management system, inventory software, warehouse tracking, inventory control system, stock tracking software, inventory management solution, warehouse inventory software, inventory management platform"
        url="https://www.stockflow.be/inventory-management-software"
      />

      {/* Hero Section - Optiply Style with Background Image */}
      <section 
        className="relative py-16 sm:py-20 md:py-24 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              The only way to fully automate your inventory management
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Stop time-consuming manual inventory tracking and guesswork. 500+ businesses that manage inventory daily use StockFlow to make 100% automatic inventory decisions, prevent stockouts and overstock, and optimize cashflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Start Free Trial
              </Link>
              <Link
                to="/demo"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Watch Demo
              </Link>
            </div>
            <p className="text-sm text-gray-200">Used by 500+ businesses that manage inventory daily</p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-6">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="ml-4 text-sm text-gray-600">+ 500 businesses trust StockFlow</span>
            </div>
            <p className="text-lg text-gray-600 mb-6">"Ensures you achieve the desired service level – with minimal inventory and minimal costs."</p>
            <p className="text-lg text-gray-600 mb-6">"We started with 80% product availability. That has now risen to 95%."</p>
            <p className="text-lg text-gray-600 mb-6">"Our two purchasers went from a full workday to just 15 minutes per day of purchasing."</p>
            <p className="text-lg text-gray-600">"Purchasing on autopilot doesn't make you redundant, but gives more time for exceptions."</p>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Finally, a way to make 100% automatic inventory decisions
            </h2>
            <p className="text-lg text-gray-600">
              StockFlow uses all your data to always order the right products at the right time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Without StockFlow */}
            <div className="bg-red-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-red-800 mb-6">Without StockFlow</h3>
              <p className="text-red-700 mb-6">Too much or too little inventory due to time-consuming, manual purchasing</p>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Manual purchasing based on gut feeling
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Reactive purchasing when you're often already too late
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Time spent on what, when, where and how much to purchase
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Not knowing if inventory is balanced
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  High inventory but still stockouts
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  No clear insight into purchasing needs and moments
                </li>
              </ul>
            </div>

            {/* With StockFlow */}
            <div className="bg-green-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-green-800 mb-6">With StockFlow</h3>
              <p className="text-green-700 mb-6">Purchase the right inventory based on all available data and trends</p>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Automatic data-driven purchasing
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Proactive purchasing based on trends and seasons
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Optimize purchasing decisions and data
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Optimal inventory for more revenue and cashflow control
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  More revenue with less inventory
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Optimize daily purchasing decisions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Proven Results with StockFlow
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join hundreds of businesses that have transformed their inventory management with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <p className="text-gray-600">Inventory Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">80%</div>
              <p className="text-gray-600">Time Saved</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">25%</div>
              <p className="text-gray-600">Cost Reduction</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">99%</div>
              <p className="text-gray-600">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Always trust the right inventory decisions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow uses all your available data and automatically calculates what, when and how much you need to purchase—for optimal inventory levels. This way you purchase up to 80% faster.
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

      {/* Process Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              This is what the route to automatic inventory decisions looks like
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Other solutions work with static min/max settings and historical data. StockFlow puts your purchasing on autopilot by continuously optimizing demand forecasts, inventory levels and order moments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Smarter inventory management for e-commerce, warehouses and physical stores
            </h2>
            <p className="text-lg text-gray-600">
              Discover how e-commerce inventory teams use StockFlow for strategic, automatic purchasing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Always make the right inventory decisions
            </h2>
            <p className="text-lg text-gray-600">
              Maintain control over your supply chain. Know exactly what, when and where to purchase and always place the right orders for maximum revenue.
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

      {/* Security & Trust Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your data is protected with bank-level security and industry-standard compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">SSL Encryption</h3>
              <p className="text-gray-600 text-sm">256-bit SSL encryption for all data transmission</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-gray-600 text-sm">Full compliance with European data protection laws</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Daily Backups</h3>
              <p className="text-gray-600 text-sm">Automated daily backups with 99.9% uptime</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">SOC 2 Certified</h3>
              <p className="text-gray-600 text-sm">Enterprise-grade security and compliance standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Making Better Inventory Decisions Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of businesses that already use StockFlow to optimize their inventory management and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Start Free Trial
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
              Instant access
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              English support
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              14-day free trial
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about inventory management software</p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
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
            Professional inventory management software for growing businesses.
            Simple, powerful, and designed for success.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Inventory management software for modern businesses.
            </p>
          </div>
        </div>
      </footer>

      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          ${faqData.map(faq => `{
            "@type": "Question",
            "name": "${faq.question}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${faq.answer}"
            }
          }`).join(',')}
        ]
      }`}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "StockFlow - Inventory Management Software",
        "description": "Professional inventory management software for growing businesses. Track stock levels, manage suppliers, and grow your business with our powerful yet simple platform.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "softwareVersion": "1.0",
        "datePublished": "2024-01-01",
        "dateModified": "${new Date().toISOString().split('T')[0]}",
        "offers": [
          {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "description": "Free plan - 100% free inventory management for SMEs",
            "availability": "https://schema.org/InStock",
            "validFrom": "2024-01-01"
          },
          {
            "@type": "Offer",
            "price": "29",
            "priceCurrency": "EUR",
            "description": "Growth plan - Advanced features for growing businesses",
            "availability": "https://schema.org/InStock",
            "validFrom": "2024-01-01"
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
        "image": [
          "https://www.stockflow.be/Inventory-Management.png",
          "https://www.stockflow.be/optimized/desktop.png"
        ],
        "screenshot": "https://www.stockflow.be/optimized/desktop.png",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/inventory-management-software"
        },
        "featureList": [
          "Real-time inventory tracking",
          "Barcode scanning",
          "Automated reorder points",
          "Multi-location support",
          "Advanced analytics",
          "Mobile access",
          "Team collaboration",
          "Integration capabilities"
        ],
        "keywords": "inventory management software, stock management, inventory control, warehouse management, inventory tracking, stock management software, inventory system, warehouse software, inventory optimization, stock control software, inventory management system, warehouse management system, inventory tracking software, stock management system, inventory software, warehouse tracking, inventory control system, stock tracking software, inventory management solution, warehouse inventory software, inventory management platform"
      }`}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "StockFlow",
        "url": "https://www.stockflow.be",
        "logo": "https://www.stockflow.be/logo.png",
        "description": "Professional inventory management software for growing businesses",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BE"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "info@stockflow.be"
        },
        "sameAs": [
          "https://www.linkedin.com/company/stockflow"
        ]
      }`}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Inventory Management Software - StockFlow",
        "description": "Professional inventory management software for growing businesses. Track stock levels, manage suppliers, and grow your business with our powerful yet simple platform.",
        "url": "https://www.stockflow.be/inventory-management-software",
        "mainEntity": {
          "@type": "SoftwareApplication",
          "name": "StockFlow - Inventory Management Software"
        },
        "breadcrumb": {
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
              "name": "Inventory Management Software",
              "item": "https://www.stockflow.be/inventory-management-software"
            }
          ]
        }
      }`}} />
    </SeoPageLayout>
  );
}
