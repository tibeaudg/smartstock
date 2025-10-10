import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function StockManagement() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is stock management?",
      answer: "Stock management is the process of tracking, organizing, and controlling inventory levels to ensure optimal stock availability. It helps businesses maintain the right amount of products, prevent stockouts, and reduce excess inventory costs."
    },
    {
      question: "What's the difference between stock management and inventory management?",
      answer: "While often used interchangeably, stock management typically refers to physical goods in storage, while inventory management encompasses a broader scope including raw materials, work-in-progress, and finished goods across the entire supply chain."
    },
    {
      question: "Why is stock management important for small businesses?",
      answer: "Effective stock management helps small businesses reduce costs, improve cash flow, prevent stockouts, minimize waste, and provide better customer service. It's essential for business growth and profitability."
    },
    {
      question: "How can I improve my stock management?",
      answer: "Use digital stock management software, implement regular stock counts, set reorder points, analyze sales data, automate processes, and maintain accurate records. Start with a free tool like StockFlow to digitize your processes."
    },
    {
      question: "What are the best stock management practices?",
      answer: "Best practices include: regular inventory audits, using the FIFO (First In, First Out) method, setting minimum stock levels, tracking stock movements in real-time, organizing your warehouse efficiently, and using barcode scanning for accuracy."
    }
  ];

  return (
    <SeoPageLayout title="Stock Management Software">
      <SEO
        title="Stock Management: Complete Guide for Small Businesses | StockFlow"
        description="Master stock management with our comprehensive guide. Learn best practices, tools, and strategies to optimize inventory, reduce costs, and grow your business."
        keywords="stock management, inventory control, stock tracking, warehouse management, inventory software, stock control system, SME inventory, small business stock, stockflow, stock management app"
        url="https://www.stockflow.be/stock-management"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                #1 Stock Management Solution
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Master <span className="text-blue-600">Stock Management</span> for Your Business
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Take control of your inventory with powerful stock management tools. Track products, optimize levels, and grow your business with confidence.
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
              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5 Rating</span>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>500+</strong> Happy Businesses
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/Inventory-Management.png" 
                alt="Stock Management Dashboard" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for <span className="text-blue-600">Stock Management</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to simplify stock control and boost efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: "Real-Time Stock Tracking",
                description: "Monitor stock levels in real-time across all locations with instant updates"
              },
              {
                icon: BarChart3,
                title: "Analytics & Reports",
                description: "Make data-driven decisions with comprehensive stock reports and insights"
              },
              {
                icon: Zap,
                title: "Automated Alerts",
                description: "Get notified when stock runs low and automate reordering processes"
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Enterprise-grade security with automatic backups and data protection"
              },
              {
                icon: Clock,
                title: "Save Time",
                description: "Reduce manual work by up to 70% with automated stock management"
              },
              {
                icon: TrendingUp,
                title: "Scale Your Business",
                description: "Grow without limits - our platform scales with your business needs"
              }
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

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Choose <span className="text-blue-600">StockFlow</span> for Stock Management?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Reduce Costs",
                description: "Minimize excess inventory and prevent stockouts. Optimize your stock levels and reduce holding costs by up to 30%."
              },
              {
                title: "Improve Efficiency",
                description: "Automate manual processes and save hours every week. Spend less time on admin and more on growing your business."
              },
              {
                title: "Better Decision Making",
                description: "Access real-time data and insights to make informed decisions about purchasing, pricing, and inventory levels."
              },
              {
                title: "Enhanced Accuracy",
                description: "Eliminate human errors with barcode scanning and automated tracking. Maintain 99.9% inventory accuracy."
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Managing Your Stock Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free for up to 30 products. No credit card required. Upgrade anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/demo" className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
              Watch Demo
            </Link>
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
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schema.org Structured Data - FAQ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
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
      })}} />

      {/* Schema.org Structured Data - SoftwareApplication */}

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "StockFlow - Stock Management Software",
                "description": "Master stock management for your business. Track products, optimize levels, and grow with confidence.",
                "applicationCategory": "BusinessApplication",
                "applicationSubCategory": "SaaS",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "EUR",
                  "availability": "https://schema.org/InStock"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "32",
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
                "url": "https://www.stockflow.be/stock-management"
              }
      ]} />
    </SeoPageLayout>
  );
}
