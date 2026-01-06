import { Link } from 'react-router-dom';
import { ArrowRight, Send, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ScrollTriggeredButton from './ScrollTriggeredButton';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-day-picker';

const Footer = () => {
  const navigate = useNavigate();
  
  // Organization Schema for Footer
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StockFlow",
    "alternateName": "stockflow",
    "url": "https://www.stockflowsystems.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.stockflowsystems.com/logo.png",
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
        "email": "support@stockflowsystems.com",
        "availableLanguage": ["English", "Dutch", "French", "German"]
      },
      {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": "sales@stockflowsystems.com",
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


      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Stop Losing Money on Inventory?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 500+ businesses using StockFlow free forever
          </p>
          <div className="max-w-md mx-auto">
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-stretch sm:items-center  px-4">
            <ScrollTriggeredButton
              as="button"
              onClick={() => {
          
                navigate('/auth');
              }}
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50
                px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-4 lg:px-6
                text-base sm:text-lg md:text-xl lg:text-2xl
                font-bold rounded-lg transform hover:scale-105
                
                shadow-2xl hover:shadow-3xl
                ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                sm:min-h-[56px] touch-manipulation"
        >
          Create a Free Account
          </ScrollTriggeredButton>

            </div>

          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-2">500+</p>
              <p className="text-blue-200">Active Businesses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-2">4.8/5</p>
              <p className="text-blue-200">Customer Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-2">$15K+</p>
              <p className="text-blue-200">Avg. Savings/Year</p>
            </div>
          </div>
        </div>
      </section>




      
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
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
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
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




    </div>


    <div className="border-t border-gray-700 pt-6 text-center">
      <p className="text-gray-300 text-xs md:text-sm">
        &copy; {new Date().getFullYear()} stockflow. All rights reserved. 
      </p>
    </div>
  </div>
</footer>
    </>
  );
};

export default Footer;
