import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  Camera, 
  Warehouse,
  CheckCircle,
  Star,
  Clock,
  Target,
  Database,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
export default function InventoryManagement() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is inventory management?",
      answer: "Inventory management is the process of tracking and controlling your business's stock levels, orders, sales, and deliveries. It involves monitoring what you have, what you need, and when to reorder to maintain optimal stock levels and prevent stockouts or overstock situations."
    },
    {
      question: "Why is inventory management important for businesses?",
      answer: "Effective inventory management is crucial because it helps prevent stockouts (losing sales), reduces overstock (tying up capital), improves cash flow, enhances customer satisfaction, and provides valuable insights into sales patterns and demand forecasting."
    },
    {
      question: "What are the key benefits of good inventory management?",
      answer: "Good inventory management provides benefits like reduced carrying costs, improved cash flow, better customer service, reduced waste, accurate demand forecasting, optimized warehouse space utilization, and increased profitability through better stock turnover."
    },
    {
      question: "How does digital inventory management differ from manual methods?",
      answer: "Digital inventory management automates tracking, provides real-time data, reduces human errors, enables better forecasting, offers mobile access, integrates with other business systems, and provides detailed analytics that manual methods cannot match."
    },
    {
      question: "What features should I look for in inventory management software?",
      answer: "Look for real-time tracking, barcode scanning, automated reorder points, multi-location support, reporting and analytics, mobile access, integration capabilities, user role management, and scalability to grow with your business."
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Real-time Inventory Tracking",
      description: "Monitor your stock levels in real-time with instant updates across all locations and devices."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Scan product barcodes with your smartphone camera for quick and accurate inventory updates."
    },
    {
      icon: Zap,
      title: "Automated Reorder Points",
      description: "Set minimum stock levels and receive automatic notifications when it's time to reorder."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get detailed insights into your inventory performance, sales trends, and demand forecasting."
    },
    {
      icon: Users,
      title: "Multi-user Access",
      description: "Collaborate with your team using role-based access control and real-time synchronization."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with daily backups and 99.9% uptime guarantee."
    }
  ];

  const benefits = [
    "Reduce inventory costs by up to 25%",
    "Eliminate stockouts and overstock situations",
    "Improve cash flow with better inventory turnover",
    "Save time with automated processes",
    "Increase customer satisfaction",
    "Make data-driven decisions",
    "Scale your business efficiently",
    "Integrate with existing systems"
  ];

  const industries = [
    {
      title: "Retail",
      description: "Perfect for retail stores managing multiple product lines and seasonal inventory.",
      icon: "ðŸ›ï¸"
    },
    {
      title: "E-commerce",
      description: "Ideal for online stores with complex inventory across multiple channels.",
      icon: "ðŸ’»"
    },
    {
      title: "Manufacturing",
      description: "Essential for manufacturers tracking raw materials and finished goods.",
      icon: "ðŸ­"
    },
    {
      title: "Wholesale",
      description: "Great for wholesale businesses managing large quantities and multiple suppliers.",
      icon: "ðŸ“¦"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Operations Manager, TechStore",
      content: "StockFlow transformed our inventory management. We reduced stockouts by 90% and improved cash flow significantly.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Owner, Fashion Forward",
      content: "The automated reorder points saved us hours every week. Our inventory accuracy improved from 75% to 98%.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Warehouse Manager, AutoParts Plus",
      content: "Real-time visibility into our inventory helped us reduce carrying costs by 30% and improve customer satisfaction.",
      rating: 5
    }
  ];

  const problems = [
    {
      icon: AlertTriangle,
      title: "Stockouts",
      description: "Losing sales due to out-of-stock items"
    },
    {
      icon: DollarSign,
      title: "Overstock",
      description: "Tying up capital in excess inventory"
    },
    {
      icon: Clock,
      title: "Manual Tracking",
      description: "Time-consuming and error-prone processes"
    },
    {
      icon: Target,
      title: "Poor Forecasting",
      description: "Difficulty predicting demand accurately"
    }
  ];

  return (
    <SeoPageLayout title="Inventory Management">
      <SEO
        title="Inventory Management 2025: Complete Guide"
        description="Master inventory management! Learn proven strategies to reduce costs by 35%, save 15 hours/week, and boost profits. Free guide + software trial. Trusted by 10,000+ businesses."
        keywords="inventory management, stock management, inventory control, inventory tracking, stock control, inventory optimization, inventory planning, stock planning, inventory forecasting, inventory analysis, inventory management system, stock management system, inventory management software, stock management software, inventory management best practices, inventory management techniques, inventory management strategies, inventory management solutions, inventory management tools, inventory management methods, inventory planning software, manage inventory"
        url="https://www.stockflow.be/inventory-management"
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
              Master <span className="text-blue-400">Inventory Management</span> for Business Success
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-4xl mx-auto">
              Learn the essential strategies, best practices, and tools for effective inventory management. Optimize your stock levels, reduce costs, and boost profitability with proven inventory management techniques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Start Free Trial
              </Link>

            </div>
            <p className="text-sm text-gray-200">Join 500+ businesses optimizing their inventory management</p>
          </div>
        </div>
      </section>

      {/* What is Inventory Management Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What is <span className="text-blue-600">Inventory Management</span>?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Inventory management is the systematic approach to sourcing, storing, and selling inventoryâ€”both raw materials (components) and finished goods (products). It involves tracking inventory from purchase to sale, ensuring that the right amount of stock is available at the right time.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Effective inventory management helps businesses minimize costs while meeting customer demand. It's a delicate balance between having enough stock to fulfill orders and not having so much that you tie up unnecessary capital.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Prevents Stockouts</h3>
                  <p className="text-sm text-blue-700">Ensure you always have products available for customers</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Reduces Overstock</h3>
                  <p className="text-sm text-green-700">Avoid tying up capital in excess inventory</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Key Inventory Management Components</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Stock level monitoring and tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Demand forecasting and planning</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Reorder point optimization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Supplier relationship management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span>Performance analytics and reporting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Common Inventory Management <span className="text-red-600">Problems</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Many businesses struggle with these inventory management challenges that can hurt profitability and customer satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problems.map((problem, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <problem.icon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Essential Inventory Management <span className="text-blue-600">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Modern inventory management requires these key features to optimize your operations and maximize profitability.
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
              Benefits of Effective <span className="text-blue-600">Inventory Management</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your business with proper inventory management practices and see immediate results.
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

      {/* Industries Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Inventory Management for <span className="text-blue-600">Every Industry</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're in retail, e-commerce, manufacturing, or wholesale, effective inventory management is crucial for success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{industry.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{industry.title}</h3>
                <p className="text-gray-600">{industry.description}</p>
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
              Success Stories from <span className="text-blue-600">Real Businesses</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how businesses like yours have transformed their inventory management with StockFlow.
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

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Optimizing Your Inventory Management Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of businesses that have transformed their inventory management with StockFlow.
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
            <p className="text-lg text-gray-600">Everything you need to know about inventory management</p>
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
            Master inventory management with StockFlow. Simple, powerful, and designed for business success.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Inventory management solutions for modern businesses.
            </p>
          </div>
        </div>
      </footer>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/inventory-management-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete software solutions for modern inventory management needs.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more â†’</div>
              </div>
            </Link>
            <Link to="/stock-management" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Stock Management
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Best practices and strategies for effective stock control and optimization.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more â†’</div>
              </div>
            </Link>
            <Link to="/inventory-management-smb" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory for SMB
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Tailored inventory management solutions for small and medium businesses.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more â†’</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

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
                "@type": "Article",
                "headline": "Inventory Management - Complete Guide & Best Practices",
                "description": "Master inventory management with our comprehensive guide. Learn best practices, benefits, and how to optimize your stock levels for maximum profitability.",
                "image": "https://www.stockflow.be/Inventory-Management.png",
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
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://www.stockflow.be/inventory-management"
                },
                "datePublished": "2024-01-01",
                "dateModified": "new Date().toISOString().split('T')[0]"        }      ]} />
    </SeoPageLayout>
  );
}


