import React, { useState } from 'react';
import { SEO } from '../../components/SEO';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '../../hooks/usePageRefresh';

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact StockFlow",
    "description": "Get in touch with StockFlow for support, sales inquiries, or general questions about our inventory management software.",
    "url": "https://www.stockflow.be/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "StockFlow",
      "url": "https://www.stockflow.be",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+32-XXX-XXX-XXX",
          "contactType": "customer service",
          "email": "support@stockflow.be"
        },
        {
          "@type": "ContactPoint",
          "contactType": "sales",
          "email": "sales@stockflow.be"
        }
      ]
    }
  };

  return (
    <SeoPageLayout title="Contact Us">
      <SEO
        title="Contact StockFlow - Get Support & Sales Information"
        description="Contact StockFlow for support, sales inquiries, or questions about our free inventory management software. Get help from our expert team and learn how we can help your business grow."
        keywords="contact stockflow, stockflow support, stockflow sales, inventory management support, stock management support, warehouse management support, inventory software support, stock software support, warehouse software support, business software support, inventory management contact, stock management contact, warehouse management contact, inventory software contact, stock software contact, warehouse software contact, business software contact, inventory management help, stock management help, warehouse management help, inventory software help, stock software help, warehouse software help, business software help, inventory management assistance, stock management assistance, warehouse management assistance, inventory software assistance, stock software assistance, warehouse software assistance, business software assistance"
        url="https://www.stockflow.be/contact"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact <span className="text-blue-600">StockFlow</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get in touch with our team for support, sales inquiries, or any questions about our inventory management solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">General Inquiries</h3>
              <p className="text-gray-600 mb-4">For general questions and information</p>
              <p className="text-blue-600 font-semibold">hello@stockflow.be</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Technical Support</h3>
              <p className="text-gray-600 mb-4">Get help with your account and technical issues</p>
              <p className="text-green-600 font-semibold">support@stockflow.be</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sales & Partnerships</h3>
              <p className="text-gray-600 mb-4">For sales inquiries and partnership opportunities</p>
              <p className="text-purple-600 font-semibold">sales@stockflow.be</p>
            </div>
          </div>
        </div>
      </section>

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

      {/* Additional Contact Info */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Other Ways to Connect</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Business Hours</h3>
                <p className="text-gray-700 mb-2"><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM CET</p>
                <p className="text-gray-700 mb-2"><strong>Saturday:</strong> 10:00 AM - 2:00 PM CET</p>
                <p className="text-gray-700"><strong>Sunday:</strong> Closed</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Response Times</h3>
                <p className="text-gray-700 mb-2"><strong>General Inquiries:</strong> Within 24 hours</p>
                <p className="text-gray-700 mb-2"><strong>Technical Support:</strong> Within 12 hours</p>
                <p className="text-gray-700"><strong>Sales Inquiries:</strong> Within 4 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}
