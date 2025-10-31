import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '../../lib/structuredData';

export default function OnlineInventoryManagement() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "What is online inventory management?",
      answer: "Online inventory management is a digital system that allows businesses to track, monitor, and control their stock levels in real-time through web-based software. It provides instant access to inventory data from anywhere, enabling better decision-making and operational efficiency."
    },
    {
      question: "How does online inventory management differ from traditional methods?",
      answer: "Unlike traditional spreadsheet-based or paper systems, online inventory management offers real-time updates, cloud accessibility, automated alerts, and integration with other business systems. This eliminates manual errors and provides instant visibility into stock levels."
    },
    {
      question: "What are the key benefits of online inventory management?",
      answer: "Key benefits include real-time stock visibility, reduced stockouts and overstock, improved cash flow, automated reorder points, better demand forecasting, and seamless integration with sales and accounting systems."
    },
    {
      question: "Is online inventory management suitable for small businesses?",
      answer: "Yes, online inventory management is particularly beneficial for small businesses as it provides enterprise-level features at affordable prices. It helps small businesses compete more effectively and scale their operations efficiently."
    },
    {
      question: "How secure is online inventory management?",
      answer: "Reputable online inventory management systems use enterprise-grade security including SSL encryption, secure cloud hosting, regular backups, and role-based access controls to protect your business data."
    }
  ];

  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Best Inventory Management Online for Small Businesses | StockFlow",
    url: "https://www.stockflow.be/online-inventory-management",
    description: "Simple inventory management online for small businesses. Manage stock, suppliers, and inventory in one web app. Free to try.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Inventory Management Online", url: "https://www.stockflow.be/online-inventory-management", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow Online Inventory Management",
      description: "Simple inventory management online for small businesses. Manage stock in one web app.",
      category: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.8",
        count: "127"
      },
      features: [
        "Real-time inventory tracking online",
        "Barcode scanning",
        "Multi-location support",
        "Automated reorder points",
        "Cloud-based access",
        "Mobile app",
        "Reporting and analytics"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: "https://www.stockflow.be/online-inventory-management"
    }
  });

  return (
    <SeoPageLayout title="Online Inventory Management">
      <SEO
        title="Inventory Management Online 2025: Free Trial"
        description="Manage inventory online from anywhere! Cloud-based software trusted by 10,000+ businesses. Real-time tracking, automated alerts, barcode scanning. Start FREE - no credit card!"
        keywords="inventory management online, online inventory management, online stock management, cloud inventory management, web based inventory, real-time inventory tracking, inventory management system"
        url="https://www.stockflow.be/online-inventory-management"
        structuredData={structuredData}
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-blue-600">Inventory Management Online</span> for Small Businesses
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                Transform your business with powerful online inventory management solutions. Track stock levels in real-time, automate reorder points, and eliminate stockouts with our comprehensive inventory management platform. Perfect for businesses of all sizes looking to optimize their operations and reduce costs.
              </p>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://rompslomp.nl/hs-fs/hubfs/voorraadbeheer.jpg?width=1200&height=800&name=voorraadbeheer.jpg" 
                  alt="Online Inventory Management" 
                  className="w-full max-w-sm sm:max-w-md lg:w-96 h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Online Inventory Management Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.greatplacetowork.ca/images/Asset_3.webp" 
                  alt="Team Collaboration" 
                  className="w-full h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                Why Online Inventory Management is Essential for Modern Businesses
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Online inventory management has revolutionized how businesses handle their stock. Unlike traditional methods, it provides real-time visibility, automated processes, and seamless integration with other business systems. This modern approach eliminates manual errors, reduces costs, and improves customer satisfaction.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Real-time Stock Visibility</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Access your inventory data from anywhere, anytime with <span className="text-blue-600 font-semibold">cloud-based</span> online inventory management systems.</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-green-800 mb-2">Automated Reorder Points</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Never run out of stock again with automated alerts and reorder suggestions based on your sales patterns.</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-purple-800 mb-2">Seamless Integration</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Connect with your POS, e-commerce platform, and accounting software for a unified business management experience.</p>
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
                Essential Features of Online Inventory Management
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8">
                Modern online inventory management systems offer comprehensive features designed to streamline your operations and maximize efficiency:
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">1. Real-time Stock Tracking:</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Monitor your inventory levels in real-time with instant updates across all channels. This feature ensures you always have accurate stock information and can make informed decisions about purchasing and sales.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">2. Automated Reorder Management:</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Set up automatic reorder points based on historical sales data and lead times. The system will alert you when stock levels are low and can even place orders automatically with your suppliers.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">3. Multi-location Support:</h3>
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
                  alt="Barcode Scanning Technology" 
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
                  alt="Modern Warehouse" 
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-6">
                Transform Your Business with Online Inventory Management
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Join thousands of businesses that have revolutionized their operations with online inventory management. From small startups to large enterprises, companies are seeing significant improvements in efficiency, accuracy, and profitability.
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
              <span className="text-blue-600">Proven Results</span> from Online Inventory Management
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Cost Reduction</h3>
              <p className="text-gray-700">
                Businesses typically see a 25-40% reduction in inventory costs through better stock control, reduced overstock, and elimination of stockouts. Online inventory management helps optimize your purchasing decisions and cash flow.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Improved Efficiency</h3>
              <p className="text-gray-700">
                Automate routine tasks and reduce manual errors by up to 90%. Online inventory management systems streamline operations, saving time and reducing the need for manual data entry and calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Your Online Inventory Management Journey Today
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Join thousands of businesses already using stockflow for their online inventory management needs. Start free and experience the difference.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Start Free Trial
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">No credit card required • Instant access • 24/7 support</p>
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
            Professional online inventory management solutions for businesses of all sizes.
            Real-time tracking, automated alerts, and seamless integration.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. All rights reserved.
              Online inventory management made simple.
            </p>
          </div>
        </div>
      </footer>

    </SeoPageLayout>
  );
}
