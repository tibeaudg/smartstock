import { Link } from 'react-router-dom';
import { ArrowRight, Send, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Footer = () => {
  // Organization Schema for Footer
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StockFlow",
    "alternateName": "stockflow",
    "url": "https://www.stockflow.be",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.stockflow.be/logo.png",
      "width": 200,
      "height": 60
    },
    "description": "Cloud-based Inventory Management Platform for growing businesses in Belgium. Smart stock control and warehouse management solution for SMEs.",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BE",
      "addressRegion": "Belgium",
      "addressLocality": "Belgium"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@stockflow.be",
        "availableLanguage": ["English", "Dutch", "French", "German"]
      },
      {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": "sales@stockflow.be",
        "availableLanguage": ["English", "Dutch"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61578067034898",
      "https://twitter.com/stockflow",
      "https://www.linkedin.com/company/stockflow",
      "https://www.instagram.com/stockflowbe"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Belgium"
    },
    "knowsAbout": [
      "Inventory Management",
      "Stock Control",
      "Warehouse Management",
      "Business Software",
      "SMB Solutions",
      "Voorraadbeheer",
      "Magazijnbeheer"
    ],
    "makesOffer": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "SoftwareApplication",
        "name": "StockFlow Inventory Management",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "description": "Cloud-based Inventory Management Platform for small and medium businesses"
      },
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
      {/* Company Info */}
      <div className="md:col-span-2">
        <img
          src="/logo.png"
          alt="stockflow"
          className="h-10 md:h-12 mb-6"
          loading="lazy"
          decoding="async"
          onLoad={(e) => {
            e.currentTarget.classList.add('loaded');
          }}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
          Smart inventory management for growing businesses
        </p>
        
        {/* Social Media Follow Buttons */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-3">
            <a 
              href="https://www.facebook.com/profile.php?id=61578067034898"
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com/stockflow" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-lg transition-colors"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/company/stockflow" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg transition-colors"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://www.instagram.com/stockflowbe"
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-lg transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="space-y-2">
          <Link to="/contact" className="block text-gray-400 hover:text-white underline cursor-pointer">
            Contact
          </Link>
          <Link to="/auth" className="block text-gray-400 hover:text-white underline">
            Login
          </Link>
          <Link to="/pricing" className="block text-gray-400 hover:text-white underline">
            Pricing
          </Link>
          <Link to="/features" className="block text-gray-400 hover:text-white underline">
            Features
          </Link>
          <Link to="/demo" className="block text-gray-400 hover:text-white underline">
            Demo
          </Link>
        </div>
      </div>

      {/* Solutions (Dutch) */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Oplossingen</h3>
        <div className="space-y-2">
          <Link to="/voorraadbeheer-software" className="block text-gray-400 hover:text-white underline">
            Voorraadbeheer Software
          </Link>
          <Link to="/voorraadbeheer-kmo" className="block text-gray-400 hover:text-white underline">
            Voor KMO
          </Link>
          <Link to="/voorraadbeheer-horeca" className="block text-gray-400 hover:text-white underline">
            Voor Horeca
          </Link>
          <Link to="/voorraadbeheer-webshop" className="block text-gray-400 hover:text-white underline">
            Voor Webshops
          </Link>
          <Link to="/magazijnbeheer-software" className="block text-gray-400 hover:text-white underline">
            Magazijnbeheer
          </Link>
        </div>
      </div>

      {/* Solutions (English) */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Solutions</h3>
        <div className="space-y-2">
          <Link to="/inventory-management-software" className="block text-gray-400 hover:text-white underline">
            Inventory Software
          </Link>
          <Link to="/inventory-management-SMB" className="block text-gray-400 hover:text-white underline">
            For SMB
          </Link>
          <Link to="/warehouse-management-system" className="block text-gray-400 hover:text-white underline">
            Warehouse Management
          </Link>
          <Link to="/best-inventory-management-software" className="block text-gray-400 hover:text-white underline">
            Best Inventory Software
          </Link>
          <Link to="/inventory-software-for-small-business" className="block text-gray-400 hover:text-white underline">
            For Small Business
          </Link>
        </div>
      </div>
      
      {/* Legal & Company Links */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Legal & Company</h3>
        <div className="space-y-2">
          <Link to="/privacy-policy" className="block text-gray-400 hover:text-white underline">
            Privacy Policy
          </Link>
          <Link to="/terms-conditions" className="block text-gray-400 hover:text-white underline">
            Terms & Conditions
          </Link>
          <Link to="/about" className="block text-gray-400 hover:text-white underline">
            About
          </Link>
          <Link to="/contact" className="block text-gray-400 hover:text-white underline">
            Contact
          </Link>
          <a href="/sitemap.xml" className="block text-gray-400 hover:text-white underline">
            Sitemap
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-700 pt-6 text-center">
      <p className="text-gray-500 text-xs md:text-sm">
        &copy; {new Date().getFullYear()} stockflow. All rights reserved. 
      </p>
    </div>
  </div>
</footer>
    </>
  );
};

export default Footer;
