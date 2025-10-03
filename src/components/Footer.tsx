import { Link } from 'react-router-dom';
import { ArrowRight, Send, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-16 md:py-20">
    <div className="max-w-7xl mx-auto px-6">
      {/* Main Footer Content - 4 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Product Column */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-6">Product</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/integrations" className="text-gray-300 hover:text-white transition-colors">
                Integrations
              </Link>
            </li>
            <li>
              <Link to="/mobile-app" className="text-gray-300 hover:text-white transition-colors">
                Mobile App
              </Link>
            </li>
            <li>
              <Link to="/roadmap" className="text-gray-300 hover:text-white transition-colors">
                Roadmap
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-6">Resources</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/case-studies" className="text-gray-300 hover:text-white transition-colors">
                Case Studies
              </Link>
            </li>
            <li>
              <Link to="/api-docs" className="text-gray-300 hover:text-white transition-colors">
                API Docs
              </Link>
            </li>
            <li>
              <Link to="/changelog" className="text-gray-300 hover:text-white transition-colors">
                Changelog
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-6">Company</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/careers" className="text-gray-300 hover:text-white transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/press" className="text-gray-300 hover:text-white transition-colors">
                Press Kit
              </Link>
            </li>
            <li>
              <Link to="/partners" className="text-gray-300 hover:text-white transition-colors">
                Partners
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-6">Support</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/chat" className="text-gray-300 hover:text-white transition-colors">
                Chat
              </Link>
            </li>
            <li>
              <Link to="/status" className="text-gray-300 hover:text-white transition-colors">
                Status
              </Link>
            </li>
            <li>
              <a href="tel:+32123456789" className="text-gray-300 hover:text-white transition-colors">
                +32 XXX XXX
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="border-t border-gray-800 pt-8 mb-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-white text-xl font-semibold mb-4">
            Inventory tips & product updates
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              Subscribe
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left - Language/Currency */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              🇧🇪 Belgium
            </span>
            <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white">
              <option>English</option>
              <option>Dutch</option>
              <option>French</option>
              <option>German</option>
            </select>
            <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white">
              <option>EUR</option>
              <option>USD</option>
            </select>
          </div>

          {/* Center - Social Media */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          {/* Right - Legal Links */}
          <div className="flex items-center gap-4 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookies
            </Link>
            <span className="text-gray-400">GDPR</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 StockFlow • Privacy • Terms • Cookies • GDPR
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
