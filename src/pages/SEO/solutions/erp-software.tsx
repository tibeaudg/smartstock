import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { SeoPageHero } from '@/components/seo/SeoPageHero';
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
  Settings,
  Workflow,
  GitMerge
} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';

export default function ErpSoftware() {
  usePageRefresh();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is ERP software?",
      answer: "ERP (Enterprise Resource Planning) software is an integrated business management system that helps organizations manage and automate core business processes including inventory, accounting, human resources, customer relationship management, supply chain, and more. It provides a unified platform for all business operations."
    },
    {
      question: "What does ERP software do?",
      answer: "ERP software integrates various business functions into a single system, including inventory management, financial management, human resources, sales, procurement, manufacturing, and customer service. It provides real-time visibility into business operations, automates processes, and improves decision-making through centralized data."
    },
    {
      question: "Do I need ERP software for inventory management?",
      answer: "While ERP software includes inventory management, many small and medium businesses find that dedicated inventory management software like StockFlow is more cost-effective and easier to use. ERP systems are typically better suited for large enterprises with complex, multi-department needs. StockFlow can integrate with ERP systems when needed."
    },
    {
      question: "What is the difference between ERP software and inventory management software?",
      answer: "ERP software is a comprehensive system that manages all business functions (accounting, HR, sales, inventory, etc.), while inventory management software focuses specifically on tracking and managing inventory. ERP systems are typically more expensive and complex, while inventory management software is more affordable and specialized for inventory needs."
    },
    {
      question: "Can inventory management software integrate with ERP software?",
      answer: "Yes, StockFlow can integrate with ERP systems through APIs and data exports. This allows you to use specialized inventory management software while maintaining integration with your ERP system for accounting, financial reporting, and other business functions."
    },
    {
      question: "How much does ERP software cost?",
      answer: "ERP software typically costs significantly more than inventory management software. Enterprise ERP systems can cost $100,000+ for implementation and $10,000+ per month for licensing. StockFlow offers inventory management starting at free, making it a cost-effective alternative for businesses that primarily need inventory management."
    },
    {
      question: "Is ERP software suitable for small businesses?",
      answer: "ERP software is often too complex and expensive for small businesses. Most small and medium businesses find that specialized software like StockFlow for inventory management, combined with separate accounting software, is more cost-effective and easier to implement than a full ERP system."
    },
    {
      question: "What features should ERP software have?",
      answer: "Comprehensive ERP software should include modules for financial management, inventory management, human resources, customer relationship management (CRM), supply chain management, manufacturing, project management, and reporting. However, many businesses only need a subset of these features, which is why specialized software like StockFlow can be a better fit."
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Inventory Management",
      description: "Comprehensive inventory tracking, multi-warehouse support, and real-time stock level monitoring integrated with other business functions."
    },
    {
      icon: BarChart3,
      title: "Financial Management",
      description: "Accounting, financial reporting, budgeting, and financial analysis integrated with inventory and operations data."
    },
    {
      icon: Users,
      title: "Human Resources",
      description: "Employee management, payroll, attendance tracking, and HR analytics as part of the integrated system."
    },
    {
      icon: Workflow,
      title: "Supply Chain Management",
      description: "End-to-end supply chain visibility from suppliers through manufacturing to customers, all in one system."
    },
    {
      icon: Settings,
      title: "Manufacturing Management",
      description: "Production planning, work order management, bill of materials, and manufacturing resource planning."
    },
    {
      icon: GitMerge,
      title: "Business Intelligence",
      description: "Advanced reporting, analytics, and business intelligence tools that pull data from all business modules."
    }
  ];

  const benefits = [
    "Unified view of all business operations",
    "Improved data accuracy and consistency",
    "Streamlined business processes",
    "Better decision-making with real-time data",
    "Reduced manual data entry",
    "Enhanced collaboration across departments",
    "Scalable to support business growth",
    "Compliance and audit trail capabilities"
  ];

  const comparison = [
    {
      feature: "Cost",
      erp: "â‚¬10,000+ per month",
      stockflow: "Free to start, â‚¬0.004/product/month"
    },
    {
      feature: "Implementation Time",
      erp: "6-12 months",
      stockflow: "5 minutes"
    },
    {
      feature: "Complexity",
      erp: "Very complex, requires training",
      stockflow: "Simple and intuitive"
    },
    {
      feature: "Inventory Focus",
      erp: "Part of larger system",
      stockflow: "Specialized for inventory"
    },
    {
      feature: "Best For",
      erp: "Large enterprises",
      stockflow: "Small to medium businesses"
    }
  ];

  const testimonials = [
    {
      name: "Michael Thompson",
      role: "CEO, TechStart Solutions",
      content: "We evaluated ERP software but found it was overkill for our needs. StockFlow gives us the inventory management we need at a fraction of the cost, and we can integrate it with our accounting software.",
      rating: 5
    },
    {
      name: "Sarah Martinez",
      role: "Operations Manager, Retail Plus",
      content: "As a growing business, we needed inventory management but couldn't justify the cost of full ERP software. StockFlow is perfect - specialized inventory management that integrates with our existing systems.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Founder, Fashion Forward",
      content: "ERP software seemed too complex for our small team. StockFlow provides exactly what we need for inventory management, and we can add other specialized tools as we grow.",
      rating: 5
    }
  ];

  // Generate sidebar content
  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'what-is', title: 'What is ERP Software?', level: 1 },
    { id: 'features', title: 'ERP Features', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'comparison', title: 'ERP vs StockFlow', level: 1 },
    { id: 'testimonials', title: 'What Users Say', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="ERP Software"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="ERP Software 2025 | Enterprise Resource Planning | ERP vs Inventory Management | StockFlow"
        description="Complete guide to ERP software and enterprise resource planning systems. Learn about ERP features, costs, and when to choose ERP vs specialized inventory management software like StockFlow."
        keywords="erp software, enterprise resource planning, erp system, erp software solutions, erp software companies, erp software for small business, erp software meaning, erp software definition, erp management software, erp business software, cloud erp software, erp software comparison, erp software list, best erp software, erp software features, erp software cost, inventory management vs erp, erp inventory management, stockflow, stock flow"
        url="https://www.stockflow.be/erp-software"
      />

      <SeoPageHero
        title="ERP Software Guide: Enterprise Resource Planning vs Inventory Management"
        description="Complete guide to ERP software and enterprise resource planning systems. Learn when ERP makes sense and when specialized inventory management software like StockFlow is a better choice for your business."
        badges={[
          { icon: <Trophy className="w-6 h-6" />, text: "ERP Alternative", variant: 'warning' },
          { icon: <Star className="w-6 h-6" />, text: "4.9/5 Rating", variant: 'success' },
          { icon: <Users className="w-6 h-6" />, text: "10,000+ Users", variant: 'info' }
        ]}
        ctaText="Start Free Trial - No Credit Card"
        ctaLink="/auth"
        backgroundImage="/image.png"
      />

      {/* What Is Section */}
      <section id="what-is" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">ERP Software</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              ERP (Enterprise Resource Planning) software is an integrated business management system that helps organizations manage all aspects of their business - from inventory and accounting to HR and customer relationships - in a single unified platform.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Key ERP Modules:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <div className="font-semibold">Financial Management</div>
                  <div className="text-sm text-gray-600">Accounting, budgeting, financial reporting</div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <div className="font-semibold">Inventory Management</div>
                  <div className="text-sm text-gray-600">Stock tracking, warehouse management</div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <div className="font-semibold">Human Resources</div>
                  <div className="text-sm text-gray-600">Payroll, employee management, HR analytics</div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <div className="font-semibold">Supply Chain</div>
                  <div className="text-sm text-gray-600">Procurement, logistics, supplier management</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ERP Software <span className="text-blue-600">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive ERP software includes modules for all major business functions.
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
      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of <span className="text-blue-600">ERP Software</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Why organizations choose ERP software for integrated business management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ERP Software vs <span className="text-blue-600">StockFlow</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              When do you need full ERP software, and when is specialized inventory management better?
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">ERP Software</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparison.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.erp}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{item.stockflow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">When to Choose StockFlow Over ERP:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <span>You primarily need inventory management</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <span>You're a small to medium business</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <span>You want to start quickly and affordably</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <span>You need specialized inventory features</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <span>You can integrate with existing accounting software</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Users Say About <span className="text-blue-600">ERP vs StockFlow</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses that chose StockFlow over full ERP software.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg">
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
            Need Inventory Management, Not Full ERP?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            StockFlow provides specialized inventory management at a fraction of ERP software costs. Start free today.
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
              Start in 5 minutes
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free plan available
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about ERP software</p>
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
          "@id": "https://www.stockflow.be/erp-software",
          "name": "ERP Software Guide 2025",
          "description": "Complete guide to ERP software and enterprise resource planning systems. Learn about ERP features, costs, and when to choose ERP vs specialized inventory management software.",
          "url": "https://www.stockflow.be/erp-software",
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
                "name": "ERP Software",
                "item": "https://www.stockflow.be/erp-software"
              }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "ERP Software: Complete Guide to Enterprise Resource Planning",
          "description": "Complete guide to ERP software and enterprise resource planning systems. Learn when ERP makes sense and when specialized inventory management software is better.",
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
            "name": "StockFlow Inventory Management"
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



