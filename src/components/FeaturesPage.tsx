import React from 'react';
import { BarChart, Scan, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesPage: React.FC = () => {
  const featuresData = [
    {
      icon: BarChart,
      title: "Analytics & Reporting",
      description: "Comprehensive insights into your inventory performance and business metrics.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        "Real-time stock reports",
        "Sales analytics dashboard",
        "Performance metrics",
        "Custom report builder",
      ],
    },
    {
      icon: Scan,
      title: "Barcode Scanning",
      description: "Quick and accurate inventory tracking with mobile barcode scanning.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: [
        "Mobile barcode scanner",
        "Batch scanning support",
        "Custom barcode generation",
        "Offline scanning capability",
      ],
    },
    {
      icon: Truck,
      title: "Delivery Management",
      description: "Streamline your delivery process with integrated delivery note management.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        "Incoming delivery notes",
        "Outgoing delivery tracking",
        "Supplier management",
        "Delivery scheduling",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <BarChart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">stockflow</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/features"
                className="text-blue-600 font-medium transition-colors border border-blue-600 px-4 py-2 rounded-lg"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors border border-gray-300 hover:border-blue-600 px-4 py-2 rounded-lg"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors border border-gray-300 hover:border-blue-600 px-4 py-2 rounded-lg"
              >
                Contact
              </Link>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/demo"
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View Demo
              </Link>
              <Link
                to="/auth"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-md"
              >
                Register/Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Powerful Features for Your Business
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover how StockFlow's comprehensive tools can revolutionize your inventory management,
            streamline operations, and boost your profitability.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-colors shadow-lg"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Inventory
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From real-time tracking to advanced analytics, StockFlow provides all the tools you need to optimize your inventory management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`p-4 rounded-full ${feature.bgColor} mb-6 w-fit`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  index === 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                  index === 1 ? 'bg-green-600 hover:bg-green-700 text-white' :
                  'bg-purple-600 hover:bg-purple-700 text-white'
                }`}>
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              More Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              StockFlow offers a complete suite of inventory management tools designed for modern businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Real-time Sync", description: "Instant updates across all devices" },
              { title: "Multi-location", description: "Manage inventory across multiple locations" },
              { title: "Mobile App", description: "Full functionality on your smartphone" },
              { title: "API Integration", description: "Connect with your existing systems" },
              { title: "Automated Alerts", description: "Never run out of stock again" },
              { title: "Cost Tracking", description: "Monitor your inventory costs" },
              { title: "Supplier Management", description: "Manage all your suppliers" },
              { title: "Custom Reports", description: "Generate reports tailored to your needs" },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses who trust StockFlow to manage their inventory efficiently and profitably.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full transition-colors shadow-lg"
            >
              Start Free Trial →
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium rounded-full transition-colors"
            >
              Watch Demo
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <BarChart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">stockflow</span>
              </div>
              <p className="text-gray-400 text-sm">
                Built by inventory management experts in Belgium to solve the complex challenge of stockouts and overstocking that costs SMEs thousands of euros annually.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Pages</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@stockflow.be</li>
                <li>+32 123 456 789</li>
                <li>Belgium</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Socials</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 StockFlow. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;

