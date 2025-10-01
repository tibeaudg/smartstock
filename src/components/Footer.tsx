import { Link } from 'react-router-dom';
import { ArrowRight, Send } from 'lucide-react';

const Footer = () => (
  <footer className="bg-blue-600 text-gray-200 py-16 md:py-20">
    <div className="max-w-7xl mx-auto px-6">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left Section - CTA */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Mobilize Your Inventory
          </h2>
          <p className="text-white text-base md:text-lg max-w-md">
            Unlock instant analytics and reporting for your inventory data.
            No setup headaches, just powerful insights, ready to go.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium"
            >
              Start Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <div className="flex items-center gap-2 text-white">
              <Send className="w-5 h-5" />
              <div>
                <p className="text-sm">Send us a message.</p>
                <a
                  href="mailto:support@stockflow.be"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  info@stockflow.be
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Navigation Links */}
        <div className="grid grid-cols-3 gap-8">
          {/* Legal Column */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms"
                  className="text-white hover:text-gray-300 transition-colors text-sm"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-white hover:text-gray-300 transition-colors text-sm"
                >
                  Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Menu Column */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4">Menu</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-gray-300 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-white hover:text-gray-300 transition-colors text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <a
                  href="/#faq-section"
                  className="text-white hover:text-gray-300 transition-colors text-sm"
                >
                  Faq
                </a>
              </li>
            </ul>
          </div>

          {/* Actions Column */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4">Actions</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="text-white hover:text-gray-300 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/demo"
                  className="text-white hover:text-gray-300 transition-colors text-sm"
                >
                  Try Demo
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className="relative justify-center items-center flex">
        <h1 
          className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #dbeafe 50%, #bfdbfe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          StockFlow<sup className="text-4xl md:text-5xl"
                    style={{
                      backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #dbeafe 50%, #bfdbfe 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                    >®</sup>
        </h1>
      </div>
    </div>
  </footer>
);

export default Footer;
