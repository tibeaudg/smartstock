import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function OnlineInventorySoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is online inventory software?",
      answer: "Online inventory software is a cloud-based system that helps businesses track, manage, and control their inventory in real-time. It provides instant access to stock levels, automates reorder processes, and integrates with other business systems for comprehensive inventory management."
    },
    {
      question: "How does online inventory software differ from desktop software?",
      answer: "Online inventory software runs in the cloud, allowing access from any device with internet connection. Unlike desktop software, it offers real-time collaboration, automatic updates, and no need for local installation or maintenance."
    },
    {
      question: "What features should I look for in online inventory software?",
      answer: "Key features include real-time stock tracking, automated reorder points, barcode scanning, multi-location support, reporting and analytics, integration capabilities, and mobile accessibility for on-the-go management."
    },
    {
      question: "Is online inventory software secure for my business data?",
      answer: "Reputable online inventory software providers use enterprise-grade security including SSL encryption, secure cloud hosting, regular backups, and compliance with data protection regulations to keep your business information safe."
    },
    {
      question: "Can online inventory software integrate with my existing systems?",
      answer: "Yes, most modern online inventory software solutions offer APIs and integrations with popular POS systems, e-commerce platforms, accounting software, and other business tools for seamless data flow."
    }
  ];

  return (
    <SeoPageLayout title="Online Inventory Software">
      <SEO
        title="Best Online Inventory Software 2024 | Real-time Stock Management | stockflow"
        description="Discover the best online inventory software for your business. Real-time tracking, automated alerts, and seamless integration. Get Started Free today with stockflow."
        keywords="online inventory software, inventory management software, stock management software, cloud inventory software, inventory tracking software, warehouse management software, inventory control software, stock control software, real-time inventory software, cloud-based inventory management, stockflow"
        url="https://www.stockflow.be/online-inventory-software"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-blue-600">Online Inventory Software</span> That Works
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                Streamline your inventory management with powerful online inventory software designed for modern businesses. Track stock levels in real-time, automate reorder processes, and eliminate stockouts with our comprehensive cloud-based solution. Perfect for businesses looking to optimize their operations and reduce costs.
              </p>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://rompslomp.nl/hs-fs/hubfs/voorraadbeheer.jpg?width=1200&height=800&name=voorraadbeheer.jpg" 
                  alt="Online Inventory Software" 
                  className="w-full max-w-sm sm:max-w-md lg:w-96 h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Online Inventory Software Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.greatplacetowork.ca/images/Asset_3.webp" 
                  alt="Cloud Technology" 
                  className="w-full h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                Why Choose Online Inventory Software Over Traditional Methods
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Online inventory software revolutionizes how businesses manage their stock. Unlike traditional spreadsheet-based systems, it provides real-time updates, cloud accessibility, and automated processes that eliminate manual errors and improve efficiency.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Cloud-Based Accessibility</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Access your inventory data from anywhere with <span className="text-blue-600 font-semibold">secure cloud storage</span> and real-time synchronization across all devices.</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-green-800 mb-2">Automated Workflows</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Eliminate manual processes with automated reorder points, stock alerts, and intelligent demand forecasting.</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-purple-800 mb-2">Seamless Integration</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Connect with your existing business systems including POS, e-commerce, and accounting software for unified operations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-blue-600">
                Essential Features of Modern Online Inventory Software
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8">
                The best online inventory software solutions offer comprehensive features designed to streamline your operations and maximize efficiency:
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">1. Real-time Stock Tracking:</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Monitor inventory levels across all locations in real-time with instant updates. This feature ensures accurate stock information and enables better decision-making for purchasing and sales.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">2. Automated Reorder Management:</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Set up intelligent reorder points based on sales history and lead times. The software automatically alerts you when stock is low and can even place orders with suppliers.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">3. Advanced Reporting & Analytics:</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Generate detailed reports on stock movements, sales trends, and inventory performance. Make data-driven decisions with comprehensive analytics and forecasting tools.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">4. Multi-location Management:</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Manage inventory across multiple warehouses, stores, or locations from a single dashboard. Transfer stock between locations and maintain accurate records for each site.
                  </p>
                </div>
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.warehousingandfulfillment.com/wp-content/uploads/2020/04/Barcode-Scanning-Technologies.jpg" 
                  alt="Inventory Management Dashboard" 
                  className="w-full max-w-sm sm:max-w-md lg:w-96 h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Side - Large Image */}
            <div className="lg:col-span-2">
              <div className=" rounded-lg">
                <img 
                  src="https://valuechain.be/media/images/20232316226515_shutterstock-1106078390.width-1292.webp" 
                  alt="Modern Warehouse Management" 
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-6">
                Transform Your Business with Online Inventory Software
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Join thousands of businesses that have revolutionized their inventory management with cloud-based software solutions. From small startups to large enterprises, companies are seeing significant improvements in efficiency, accuracy, and profitability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Proven Results</span> from Online Inventory Software
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Significant Cost Savings</h3>
              <p className="text-gray-700">
                Businesses typically see a 30-50% reduction in inventory costs through better stock control, reduced overstock, and elimination of stockouts. Online inventory software helps optimize purchasing decisions and improve cash flow.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Improved Operational Efficiency</h3>
              <p className="text-gray-700">
                Automate routine tasks and reduce manual errors by up to 95%. Online inventory software streamlines operations, saving time and reducing the need for manual data entry and calculations.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Better Customer Service</h3>
              <p className="text-gray-700">
                Real-time stock visibility ensures you can always fulfill customer orders. Reduce stockouts by 80% and improve customer satisfaction with accurate inventory information.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Scalable Growth</h3>
              <p className="text-gray-700">
                Cloud-based online inventory software grows with your business. Easily add new locations, products, and users without the need for expensive hardware upgrades or complex installations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Get Started Free of Online Inventory Software Today
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Experience the power of modern online inventory software. Join thousands of businesses already using stockflow for their inventory management needs.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Start Free Trial
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">No credit card required • Instant setup • 24/7 support</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-1 h-16 bg-blue-600 mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
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
            alt="stockflow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Professional online inventory software for businesses of all sizes.
            Real-time tracking, automated alerts, and seamless integration.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. All rights reserved.
              Online inventory software made simple.
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
        "@type": "Article",
        "headline": "Best Online Inventory Software 2024 | Real-time Stock Management",
        "description": "Discover the best online inventory software for your business. Real-time tracking, automated alerts, and seamless integration. Get Started Free today with stockflow.",
        "image": "https://www.stockflow.be/optimized/Inventory-Management.png",
        "author": {
          "@type": "Organization",
          "name": "stockflow"
        },
        "publisher": {
          "@type": "Organization",
          "name": "stockflow",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.stockflow.be/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/online-inventory-software"
        },
        "datePublished": "2024-06-01",
        "dateModified": "2024-12-19"
      }`}} />
    </SeoPageLayout>
  );
}
