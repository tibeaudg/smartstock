import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { SeoPageHero } from '../../components/seo/SeoPageHero';
import { useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  Trophy,
  Database,
  TrendingUp,
  Calculator,
  Target,
  Calendar,
  Planning
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';

export default function CapacityRequirementPlanning() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is capacity requirement planning?",
      answer: "Capacity requirement planning (CRP) is a manufacturing and inventory management process that determines the production capacity needed to meet demand forecasts. It involves analyzing current capacity, forecasting future demand, identifying capacity gaps, and planning resources to ensure production can meet customer requirements without overstocking or underutilizing resources."
    },
    {
      question: "Why is capacity requirement planning important?",
      answer: "Capacity requirement planning is crucial because it helps businesses: prevent stockouts by ensuring adequate production capacity, avoid overproduction and excess inventory, optimize resource utilization, reduce costs by balancing capacity with demand, improve customer satisfaction through better availability, and make informed decisions about capacity investments."
    },
    {
      question: "How does capacity requirement planning work?",
      answer: "Capacity requirement planning works by: 1) Analyzing current production capacity and inventory levels, 2) Forecasting future demand based on historical data and trends, 3) Identifying capacity gaps between required and available capacity, 4) Developing plans to address gaps through scheduling, staffing, or equipment, 5) Monitoring and adjusting plans based on actual performance. Inventory management software like StockFlow helps automate this process."
    },
    {
      question: "What is the difference between capacity planning and capacity requirement planning?",
      answer: "Capacity planning is a broader strategic process that determines overall capacity needs, while capacity requirement planning (CRP) is a more detailed operational process that calculates specific capacity requirements for production schedules. CRP is typically used in manufacturing and production environments to ensure resources are available when needed."
    },
    {
      question: "How can inventory management software help with capacity requirement planning?",
      answer: "Inventory management software like StockFlow helps with capacity requirement planning by providing real-time inventory data, demand forecasting, automated reorder points, production planning tools, and analytics that help identify capacity needs. The software tracks inventory levels, sales velocity, and trends to inform capacity decisions."
    },
    {
      question: "What factors affect capacity requirement planning?",
      answer: "Key factors affecting capacity requirement planning include: demand forecasts, production lead times, current inventory levels, production capacity limits, supplier reliability, seasonality, market trends, resource availability (labor, equipment, materials), and business growth plans."
    },
    {
      question: "How often should capacity requirement planning be reviewed?",
      answer: "Capacity requirement planning should be reviewed regularly - typically monthly for operational planning and quarterly for strategic planning. However, it should be adjusted immediately when there are significant changes in demand, new product launches, seasonal variations, or capacity constraints. Real-time inventory management helps maintain accurate capacity planning."
    },
    {
      question: "Can small businesses benefit from capacity requirement planning?",
      answer: "Yes, small businesses can significantly benefit from capacity requirement planning. Even without complex manufacturing, CRP principles help small businesses optimize inventory levels, plan purchasing, manage supplier relationships, and ensure they have the right stock at the right time. StockFlow makes capacity requirement planning accessible to businesses of all sizes."
    }
  ];

  const features = [
    {
      icon: Planning,
      title: "Demand Forecasting",
      description: "Analyze historical sales data and trends to accurately forecast future demand and capacity requirements."
    },
    {
      icon: Calculator,
      title: "Capacity Calculations",
      description: "Automatically calculate required capacity based on inventory levels, sales velocity, and lead times."
    },
    {
      icon: Calendar,
      title: "Production Planning",
      description: "Plan production schedules and resource allocation to meet demand without overstocking or shortages."
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "Identify patterns and trends in demand to optimize capacity planning for seasonal variations and growth."
    },
    {
      icon: Target,
      title: "Gap Analysis",
      description: "Identify capacity gaps between required and available capacity to make informed planning decisions."
    },
    {
      icon: Database,
      title: "Real-Time Monitoring",
      description: "Monitor inventory levels and capacity utilization in real-time to adjust plans as needed."
    }
  ];

  const benefits = [
    "Prevent stockouts by ensuring adequate capacity",
    "Reduce excess inventory and carrying costs",
    "Optimize resource utilization and efficiency",
    "Improve customer satisfaction through better availability",
    "Make data-driven capacity investment decisions",
    "Balance production with demand forecasts",
    "Reduce waste and obsolescence",
    "Scale operations efficiently"
  ];

  const steps = [
    {
      step: "1",
      title: "Analyze Current Capacity",
      description: "Assess your current production capacity, inventory levels, and resource availability to establish a baseline."
    },
    {
      step: "2",
      title: "Forecast Demand",
      description: "Use historical data, trends, and market analysis to forecast future demand for your products."
    },
    {
      step: "3",
      title: "Calculate Requirements",
      description: "Calculate the capacity needed to meet forecasted demand, considering lead times and safety stock."
    },
    {
      step: "4",
      title: "Identify Gaps",
      description: "Compare required capacity with available capacity to identify gaps that need to be addressed."
    },
    {
      step: "5",
      title: "Develop Plans",
      description: "Create plans to address capacity gaps through scheduling, staffing, equipment, or process improvements."
    },
    {
      step: "6",
      title: "Monitor & Adjust",
      description: "Continuously monitor performance and adjust capacity plans based on actual demand and changing conditions."
    }
  ];

  const useCases = [
    {
      title: "Manufacturing",
      description: "Plan production capacity to meet manufacturing schedules and ensure adequate raw materials and resources.",
      icon: "🏭"
    },
    {
      title: "Retail",
      description: "Forecast inventory needs and plan purchasing capacity to meet customer demand without overstocking.",
      icon: "🏪"
    },
    {
      title: "E-commerce",
      description: "Plan inventory capacity to handle seasonal spikes, promotions, and growing demand across channels.",
      icon: "🛒"
    },
    {
      title: "Wholesale",
      description: "Optimize warehouse capacity and inventory levels to meet bulk order requirements efficiently.",
      icon: "📦"
    }
  ];

  const testimonials = [
    {
      name: "Michael Thompson",
      role: "Operations Director, Global Manufacturing",
      content: "Capacity requirement planning with StockFlow transformed our production planning. We can now accurately forecast demand and plan capacity, reducing stockouts by 80% and excess inventory by 35%.",
      rating: 5
    },
    {
      name: "Sarah Martinez",
      role: "Inventory Manager, Retail Plus",
      content: "Understanding what is capacity requirement planning and implementing it helped us optimize our inventory levels. StockFlow's forecasting tools make capacity planning so much easier.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "CEO, TechSupply Co",
      content: "Capacity requirement planning was a game-changer for our business. We now have the right inventory at the right time, and our carrying costs have decreased significantly.",
      rating: 5
    }
  ];

  // Generate sidebar content
  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is Capacity Requirement Planning?', level: 1 },
    { id: 'how-it-works', title: 'How It Works', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'use-cases', title: 'Use Cases', level: 1 },
    { id: 'testimonials', title: 'What Users Say', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Capacity Requirement Planning"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Capacity Requirement Planning 2025 | What is Capacity Requirement Planning | Complete Guide | StockFlow"
        description="Complete guide to capacity requirement planning. Learn what is capacity requirement planning, how it works, and how to implement it for your business. Optimize inventory levels, prevent stockouts, and reduce costs. Free tools included."
        keywords="capacity requirement planning, what is capacity requirement planning, capacity planning, capacity requirement, capacity requirements planning, capacity requirement planning definition, capacity requirement planning meaning, capacity requirement planning process, capacity requirement planning software, capacity requirement planning tools, capacity requirement planning in manufacturing, capacity requirement planning inventory, capacity planning inventory, capacity requirement analysis, stockflow, stock flow"
        url="https://www.stockflow.be/capacity-requirement-planning"
      />

      <SeoPageHero
        title="Capacity Requirement Planning: Complete Guide to What is Capacity Requirement Planning"
        description="Master capacity requirement planning for your business. Learn what is capacity requirement planning, how it works, and how to implement it to optimize inventory, prevent stockouts, and reduce costs. Free planning tools included."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "Complete Guide", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "Free Tools Included", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Planning Free"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      {/* What Is Section */}
      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">Capacity Requirement Planning</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Capacity requirement planning (CRP) is a strategic process that determines the production and inventory capacity needed to meet customer demand. It helps businesses balance supply with demand, optimize resources, and ensure efficient operations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Key Concepts</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Demand Forecasting:</strong> Predicting future customer demand based on historical data and trends</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Capacity Analysis:</strong> Assessing current production and inventory capacity capabilities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Gap Identification:</strong> Finding the difference between required and available capacity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Resource Planning:</strong> Developing plans to address capacity gaps and optimize utilization</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">Why It Matters</h3>
              <p className="text-gray-700 mb-4">
                Capacity requirement planning is essential for businesses that want to:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Prevent stockouts and lost sales</li>
                <li>✓ Avoid excess inventory and carrying costs</li>
                <li>✓ Optimize resource utilization</li>
                <li>✓ Improve customer satisfaction</li>
                <li>✓ Make informed investment decisions</li>
                <li>✓ Scale operations efficiently</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How <span className="text-blue-600">Capacity Requirement Planning</span> Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow these steps to implement effective capacity requirement planning for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Capacity Requirement Planning <span className="text-blue-600">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow provides the tools you need for effective capacity requirement planning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of <span className="text-blue-600">Capacity Requirement Planning</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Why capacity requirement planning is essential for business success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
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
      <section id="use-cases" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Perfect for All Types of <span className="text-blue-600">Businesses</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Capacity requirement planning benefits businesses across industries and sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Users Say About <span className="text-blue-600">Capacity Planning</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses using StockFlow for capacity requirement planning.
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
            Start Capacity Requirement Planning Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join thousands of businesses using StockFlow to optimize capacity requirement planning and inventory management.
          </p>
          <div className="flex justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-12 py-5 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
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
              Free planning tools
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant access
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about capacity requirement planning</p>
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
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/capacity-requirement-planning",
          "name": "Capacity Requirement Planning Guide 2025",
          "description": "Complete guide to capacity requirement planning. Learn what is capacity requirement planning, how it works, and how to implement it for your business.",
          "url": "https://www.stockflow.be/capacity-requirement-planning",
          "inLanguage": "en",
          "isPartOf": {
            "@type": "WebSite",
            "name": "StockFlow",
            "url": "https://www.stockflow.be"
          },
          "datePublished": "2024-01-15",
          "dateModified": new Date().toISOString().split('T')[0],
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://www.stockflow.be/Inventory-Management.png"
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
                "name": "Capacity Requirement Planning",
                "item": "https://www.stockflow.be/capacity-requirement-planning"
              }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Capacity Requirement Planning: Complete Guide to What is Capacity Requirement Planning",
          "description": "Complete guide to capacity requirement planning. Learn what is capacity requirement planning, how it works, and how to implement it for your business.",
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
          "datePublished": "2024-01-15",
          "dateModified": new Date().toISOString().split('T')[0]
        },
        ...testimonials.map((testimonial) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": "StockFlow Capacity Requirement Planning"
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

