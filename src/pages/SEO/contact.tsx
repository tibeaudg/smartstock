import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '../../hooks/usePageRefresh';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Contact() {
  usePageRefresh();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can integrate with your contact API here
  };

  const structuredData = [
    // ContactPage Schema
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact StockFlow",
      "description": "Get in touch with StockFlow for support, sales inquiries, or general questions about our inventory management software.",
      "url": "https://www.stockflow.be/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "StockFlow",
        "url": "https://www.stockflow.be"
      }
    },
    // Organization Schema
    {
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
      "description": "Smart inventory management software for growing businesses. Free stock management solution for SMEs.",
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BE",
        "addressRegion": "Belgium"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+32-XXX-XXX-XXX",
          "contactType": "customer service",
          "email": "support@stockflow.be",
          "availableLanguage": ["English"]
        },
        {
          "@type": "ContactPoint",
          "contactType": "sales",
          "email": "sales@stockflow.be",
          "availableLanguage": ["English"]
        },
        {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "email": "support@stockflow.be"
        }
      ],
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61578067034898",
        "https://twitter.com/stockflow",
        "https://www.linkedin.com/stockflow",
        "https://www.instagram.com/stockflowbe"
      ],
      "knowsAbout": [
        "Inventory Management",
        "Stock Control",
        "Warehouse Management",
        "Business Software",
        "SME Solutions"
      ],
      "makesOffer": {
        "@type": "Offer",
        "itemOffered": {
          "@type": "SoftwareApplication",
          "name": "StockFlow Inventory Management",
          "description": "Free inventory management software for small and medium businesses"
        },
        "price": "0",
        "priceCurrency": "EUR"
      }
    },
    // BreadcrumbList Schema
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.stockflow.be/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact",
          "item": "https://www.stockflow.be/contact"
        }
      ]
    },
    // WebSite Schema
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "StockFlow",
      "url": "https://www.stockflow.be",
      "description": "Smart inventory management for growing businesses",
      "publisher": {
        "@type": "Organization",
        "name": "StockFlow"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.stockflow.be/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    // Service Schema
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Inventory Management Service",
      "description": "Professional inventory management and stock control services for businesses",
      "provider": {
        "@type": "Organization",
        "name": "StockFlow"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Belgium"
      },
      "serviceType": "Software as a Service",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Free inventory management service"
      }
    }
  ];

  function scrollToSection(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <SeoPageLayout title="Contact Us">
      <SEO
        title="Contact StockFlow - Get Support & Sales Information"
        description="Contact StockFlow for support, sales inquiries, or questions about our free inventory management software. Get help from our expert team and learn how we can help your business grow."
        keywords="contact stockflow, stockflow support, stockflow sales, inventory management support, stock management support, warehouse management support, inventory software support, stock software support, warehouse software support, business software support, inventory management contact, stock management contact, warehouse management contact, inventory software contact, stock software contact, warehouse software contact, business software contact, inventory management help, stock management help, warehouse management help, inventory software help, stock software help, warehouse software help, business software help, inventory management assistance, stock management assistance, warehouse management assistance, inventory software assistance, stock software assistance, warehouse software assistance, business software assistance"
        url="https://www.stockflow.be/contact"
        structuredData={structuredData}
      />




      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please describe your inquiry in detail..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Find quick answers to common questions about StockFlow.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How quickly do you respond to support requests?</h3>
              <p className="text-gray-700">
                We typically respond to support requests within 24 hours during business days. For urgent issues, please mark your email as "Urgent" in the subject line.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer phone support?</h3>
              <p className="text-gray-700">
                Currently, we provide support primarily through email and our in-app chat system. This allows us to provide detailed, documented responses and maintain high-quality support for all users.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I schedule a demo or consultation?</h3>
              <p className="text-gray-700">
                Absolutely! Contact our sales team at sales@stockflow.be to schedule a personalized demo or consultation to see how StockFlow can benefit your business.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What languages do you support?</h3>
              <p className="text-gray-700">
                StockFlow is available in multiple languages including English, Dutch, French, German, and Spanish. Our support team can assist you in English and Dutch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid md:grid-cols-4 gap-8 mb-8">
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
              href="https://www.linkedin.com/stockflow" 
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
        
        <div className="flex flex-wrap gap-4 text-sm">
          <button 
            onClick={() => scrollToSection('modules-section')} 
            className="text-gray-400 hover:text-white underline cursor-pointer"
          >
            Modules
          </button>
          <button 
            onClick={() => scrollToSection('features-section')} 
            className="text-gray-400 hover:text-white underline cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('pricing-section')} 
            className="text-gray-400 hover:text-white underline cursor-pointer"
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollToSection('testimonials-section')} 
            className="text-gray-400 hover:text-white underline cursor-pointer"
          >
            Testimonials
          </button>
        </div>
      </div>
      
      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="space-y-2">
          <button 
            onClick={() => scrollToSection('video-section')} 
            className="block text-gray-400 hover:text-white underline cursor-pointer"
          >
            Demo
          </button>
          <button 
            onClick={() => scrollToSection('contact-section')} 
            className="block text-gray-400 hover:text-white underline cursor-pointer"
          >
            Contact
          </button>
          <Link to="/auth" className="block text-gray-400 hover:text-white underline">
            Login
          </Link>
          <Link to="/pricing" className="block text-gray-400 hover:text-white underline">
            Pricing
          </Link>
        </div>
      </div>
      
      {/* Resources */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Resources</h3>
        <div className="space-y-2">
          <button 
            onClick={() => scrollToSection('features-section')} 
            className="block text-gray-400 hover:text-white underline cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('testimonials-section')} 
            className="block text-gray-400 hover:text-white underline cursor-pointer"
          >
            Case Studies
          </button>
          <button 
            onClick={() => scrollToSection('contact-section')} 
            className="block text-gray-400 hover:text-white underline cursor-pointer"
          >
              Support
          </button>
          <Link to="/auth" className="block text-gray-400 hover:text-white underline">
            Get Started
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
    </SeoPageLayout>

  );
}
