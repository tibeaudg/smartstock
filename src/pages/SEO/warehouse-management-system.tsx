import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

import { StructuredData } from '../../components/StructuredData';
export default function WarehouseManagementSystem() {
  // Use the page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is a warehouse management system?",
      answer: "A warehouse management system (WMS) is software that helps businesses control and manage warehouse operations from the moment goods enter the warehouse until they leave. It optimizes inventory tracking, order fulfillment, and warehouse efficiency."
    },
    {
      question: "How does a warehouse management system improve efficiency?",
      answer: "WMS systems improve efficiency by automating inventory tracking, optimizing picking routes, reducing errors, providing real-time visibility, and streamlining warehouse operations to maximize productivity and minimize costs."
    },
    {
      question: "What are the key features of a modern warehouse management system?",
      answer: "Key features include real-time inventory tracking, barcode scanning, automated picking and packing, integration with ERP systems, reporting and analytics, multi-location support, and mobile accessibility."
    },
    {
      question: "Is a warehouse management system suitable for small businesses?",
      answer: "Yes, modern WMS solutions like StockFlow are designed for businesses of all sizes, offering scalable features that grow with your business while remaining affordable and easy to use."
    },
    {
      question: "How does cloud-based warehouse management differ from on-premise systems?",
      answer: "Cloud-based WMS systems offer better accessibility, automatic updates, lower upfront costs, and easier integration with other business systems, while on-premise systems provide more control but require higher maintenance and investment."
    }
  ];

  return (
    <SeoPageLayout title="Warehouse Management System">
      <SEO
        title="Warehouse Management System 2025 | Reduce Costs 35% + Improve Efficiency | StockFlow"
        description="⚡ Best warehouse management system (WMS) 2025. Streamline operations, reduce costs by 35%, and improve efficiency. Real-time tracking, barcode scanning, automated workflows. FREE plan available. Trusted by 5,000+ warehouses. Start free trial now!"
        keywords="warehouse management system, warehousing system, warehousing management software, WMS software, warehouse management, inventory management, warehouse operations, stock management, warehouse automation, warehouse software, WMS platform, warehouse management solution, best warehouse management system, warehouse management software, cloud WMS, warehouse management system for small business, warehousing system software"
        url="https://www.stockflow.be/warehouse-management-system"
      />

      {/* Hero Section */}
      <section className="bg-white py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-600">Warehouse Management System</span> & <span className="text-blue-600">Warehousing System</span> 2025: Reduce Costs 35% + Boost Efficiency
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                ⚡ Transform your warehouse operations with StockFlow's award-winning warehouse management system. 
                Reduce costs by 35%, improve efficiency by 50%, and gain real-time visibility into your inventory and operations. 
                Trusted by 5,000+ warehouses worldwide. Start your free trial today - no credit card required!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/auth" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[48px] w-full sm:w-auto"
                >
                  Start Free Trial
                </Link>
                <Link 
                  to="/features" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base min-h-[48px] w-full sm:w-auto"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/optimized/Inventory-Management.png" 
                alt="Warehouse Management System Dashboard" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Complete Warehouse Management Solution</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow provides all the tools you need to manage your warehouse efficiently and cost-effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Inventory Tracking</h3>
              <p className="text-gray-600">
                Monitor your inventory levels in real-time with automatic updates and instant visibility across all locations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated Operations</h3>
              <p className="text-gray-600">
                Automate picking, packing, and shipping processes to reduce errors and improve operational efficiency.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
              <p className="text-gray-600">
                Get detailed insights and reports to optimize your warehouse operations and make data-driven decisions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile Access</h3>
              <p className="text-gray-600">
                Access your warehouse management system from anywhere with our mobile-friendly interface and apps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Integration</h3>
              <p className="text-gray-600">
                Seamlessly integrate with your existing ERP, accounting, and e-commerce systems for unified operations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security with 99.9% uptime guarantee and automatic backups to protect your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Wins / Statistics Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Results from Real Businesses</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how businesses are transforming their warehouse operations with StockFlow's warehouse management system.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">35%</div>
              <div className="text-lg font-semibold mb-2">Cost Reduction</div>
              <div className="text-sm text-gray-600">Average savings on warehouse operations</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50%</div>
              <div className="text-lg font-semibold mb-2">Efficiency Increase</div>
              <div className="text-sm text-gray-600">Faster order fulfillment times</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-lg font-semibold mb-2">Accuracy</div>
              <div className="text-sm text-gray-600">Inventory tracking precision</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm text-gray-600">Expert help when you need it</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose StockFlow for Warehouse Management?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of businesses that have transformed their warehouse operations with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Transform Your Warehouse Operations</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Reduce Operational Costs</h4>
                    <p className="text-gray-600">Lower inventory carrying costs and reduce labor expenses through automation.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Improve Accuracy</h4>
                    <p className="text-gray-600">Minimize picking errors and inventory discrepancies with real-time tracking.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Scale Your Business</h4>
                    <p className="text-gray-600">Easily handle growth with scalable warehouse management capabilities.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Get Started Today</h4>
              <p className="text-gray-600 mb-6">
                Join thousands of businesses using StockFlow for their warehouse management needs.
              </p>
              <Link 
                to="/auth" 
                className="inline-flex items-center justify-center w-full px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[48px]"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about warehouse management systems.
            </p>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Warehouse Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get Started Free today and see how StockFlow can streamline your warehouse operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/auth" 
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base min-h-[48px] w-full sm:w-auto"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-sm sm:text-base min-h-[48px] w-full sm:w-auto"
            >
              Contact Sales
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
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Warehouse Management System",
          "description": "Comprehensive warehouse management system for modern businesses. Streamline operations, reduce costs, and improve efficiency.",
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
            "ratingValue": "4.9",
            "ratingCount": "5000",
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
          "url": "https://www.stockflow.be/warehouse-management-system"
        }
      ]} />
    </SeoPageLayout>
  );
}
