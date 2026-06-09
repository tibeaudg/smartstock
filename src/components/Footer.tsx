import { Link, useNavigate } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  ChevronRight, 
  ShieldCheck,
  Globe2
} from 'lucide-react';
const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    product: [
      { name: 'Features', path: '/features' },
      { name: 'Security', path: '/security' },
      { name: 'Integrations', path: '/integrations' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
    ],
    popularGuides: [
      { name: 'FIFO vs LIFO', path: '/fifo-vs-lifo' },
      { name: 'Barcode Label Printers', path: '/barcode-label-printer' },
      { name: 'Inventory Turnover', path: '/inventory-turnover' },
      { name: 'Excel Inventory Template', path: '/excel-inventory-template' },
      { name: 'Cost of Goods Formula', path: '/cost-of-goods-formula' },
      { name: 'Best Barcode Scanner', path: '/best-barcode-scanner' },
      { name: 'Forecasting', path: '/forecasting' },
      { name: 'Drop Shipping', path: '/drop-shipping-inventory-management' },
    ],
    seoHubsAndComparisons: [
      { name: 'Best Free Inventory Software with Barcode Scanning', path: '/best-free-inventory-software-with-barcode-scanning' },
      { name: 'Bill of Materials Software Free', path: '/bill-of-materials-software-free' },
      { name: 'Best Free Alternative to Katana MRP', path: '/best-free-alternative-to-katana-mrp' },
      { name: 'StockFlow vs Zoho Inventory', path: '/stockflow-vs-zoho-inventory' },
    ],
  };

  return (
    <>


      {/* Corporate Footer */}
      <footer className="bg-gray-900 border-t border-gray-600 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-12 mb-20">
            
            {/* Brand Identity */}
            <div className="col-span-2 lg:col-span-4">
      <Link to="/">
          <img
            src="/logo.png"
            alt="stockflow"
            className="h-10 md:h-12 mb-6"
            onLoad={(e) => {
              e.currentTarget.classList.add('loaded');
            }}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </Link>              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-sm">
                The modern standard for cloud-based inventory orchestration. Empowering SMEs with enterprise-grade logistics.
              </p>
              <div className="flex gap-4">
                {[
                  { name: 'LinkedIn', Icon: Linkedin, url: "https://linkedin.com/company/stockflow" },
                  { name: 'Twitter', Icon: Twitter, url: "https://twitter.com/stockflow" },
                  { name: 'Instagram', Icon: Instagram, url: "https://instagram.com/stockflowbe" },
                  { name: 'Facebook', Icon: Facebook, url: "https://facebook.com/profile.php?id=61578067034898" }
                ].map((social, i) => {
                  const Icon = social.Icon;
                  return (
                    <a
                      key={i}
                      href={social.url}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all"
                      aria-label={`Follow StockFlow on ${social.name}`}
                      title={`Follow StockFlow on ${social.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon aria-hidden="true" />
                      <span className="sr-only">{`Follow StockFlow on ${social.name}`}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Link Verticals */}
            <div className="col-span-1 lg:col-span-2 lg:ml-auto">
              <h4 className="font-bold text-gray-900 mb-6">Product</h4>
              <ul className="space-y-4">
                {footerLinks.product.map(link => (
                  <li key={link.name}><Link to={link.path} className="text-gray-500 hover:text-blue-600 transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <h4 className="font-bold text-gray-900 mb-6">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map(link => (
                  <li key={link.name}><Link to={link.path} className="text-gray-500 hover:text-blue-600 transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* Newsletter / Contact */}
            <div className="col-span-2 lg:col-span-4 lg:pl-12">
              <h4 className="font-bold text-gray-900 mb-6">Global Support</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="text-sm font-bold text-gray-900 uppercase tracking-tighter">Support Desk</div>
                    <a href="mailto:info@stockflow.be" className="text-gray-500 hover:text-blue-600">info@stockflow.be</a>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                  <span className="text-sm font-medium text-gray-600">System Status</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    All Operational
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Guides */}
          <div className="border-t border-gray-700 pt-12 mb-12">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Main Hubs and Comparisons</h4>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footerLinks.seoHubsAndComparisons.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Guides */}
          <div className="border-t border-gray-700 pt-12 mb-12">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Popular Guides</h4>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footerLinks.popularGuides.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/resources" className="text-blue-500 hover:text-blue-300 text-sm font-medium transition-colors">
                  View all resources →
                </Link>
              </li>
            </ul>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-gray-600 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-sm">
              © 2026 StockFlow Systems. All rights reserved.
            </div>
            <div className="flex gap-8">
              {footerLinks.legal.map(link => (
                <Link key={link.name} to={link.path} className="text-gray-400 hover:text-gray-900 text-sm transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;