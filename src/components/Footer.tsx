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
import { Helmet } from 'react-helmet-async';

const Footer = () => {
  const navigate = useNavigate();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StockFlow",
    "url": "https://www.stockflowsystems.com",
    "logo": "https://www.stockflowsystems.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BE"
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61578067034898",
      "https://twitter.com/stockflow",
      "https://www.linkedin.com/company/stockflow",
      "https://www.instagram.com/stockflowbe"
    ]
  };

  const footerLinks = {
    product: [
      { name: 'Features', path: '/features' },
      { name: 'Pricing', path: '/pricing' },
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
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      </Helmet>

      {/* High-Impact CTA Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-blue-900/20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                  Stop losing revenue to <span className="text-blue-200">inventory friction.</span>
                </h2>
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2 text-blue-100">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-medium text-sm md:text-base">Free Forever Plan</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Globe2 className="w-5 h-5" />
                    <span className="font-medium text-sm md:text-base">Global Availability</span>
                  </div>
                </div>
                <button onClick={() => navigate('/auth')} className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow text-lg md:text-xl">
                  Start your free inventory audit
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Active Users", val: "500+" },
                  { label: "Success Rate", val: "99.9%" },
                  { label: "Avg Savings", val: "€15k" },
                  { label: "Support", val: "24/7" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-6">
                    <div className="text-2xl font-bold text-white mb-1">{stat.val}</div>
                    <div className="text-blue-100 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Footer */}
      <footer className="bg-gray-900 border-t border-gray-600 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-12 mb-20">
            
            {/* Brand Identity */}
            <div className="col-span-2 lg:col-span-4">
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
        />              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-sm">
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