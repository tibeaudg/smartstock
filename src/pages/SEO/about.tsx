import React from 'react';
import { SEO } from '../../components/SEO';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '../../hooks/usePageRefresh';

export default function About() {
  usePageRefresh();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StockFlow",
    "description": "Leading provider of free inventory management software for small and medium businesses worldwide.",
    "url": "https://www.stockflow.be",
    "logo": "https://www.stockflow.be/logo.png",
    "foundingDate": "2020",
    "founders": [
      {
        "@type": "Person",
        "name": "StockFlow Team"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Belgium"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+32-XXX-XXX-XXX",
      "contactType": "customer service",
      "email": "support@stockflow.be"
    },
    "sameAs": [
      "https://www.facebook.com/stockflowapp",
      "https://www.linkedin.com/company/stockflow"
    ]
  };

  return (
    <SeoPageLayout title="About Us">
      <SEO
        title="About StockFlow - Free Inventory Management Software for SMEs"
        description="Learn about StockFlow, the leading provider of free inventory management software for small and medium businesses. Discover our mission, team, and commitment to helping businesses grow."
        keywords="about stockflow, inventory management company, stock management company, warehouse management company, inventory software company, stock software company, warehouse software company, business software company, inventory management team, stock management team, warehouse management team, inventory software team, stock software team, warehouse software team, business software team, inventory management mission, stock management mission, warehouse management mission, inventory software mission, stock software mission, warehouse software mission, business software mission, inventory management company story, stock management company story, warehouse management company story, inventory software company story, stock software company story, warehouse software company story, business software company story"
        url="https://www.stockflow.be/about"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">StockFlow</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Empowering small and medium businesses worldwide with free, powerful inventory management solutions that drive growth and efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                At StockFlow, we believe that every business, regardless of size, deserves access to professional-grade inventory management tools. Our mission is to democratize inventory management by providing free, intuitive, and powerful software that helps small and medium businesses compete effectively in today's market.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We understand the challenges that growing businesses face - limited budgets, complex inventory needs, and the pressure to scale efficiently. That's why we've built StockFlow to be both powerful and accessible, ensuring that cost is never a barrier to effective inventory management.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why We Started</h3>
              <p className="text-gray-700">
                Founded in 2020, StockFlow was born from a simple observation: most inventory management solutions were either too expensive for small businesses or too basic to meet real-world needs. We set out to change that by creating a solution that combines enterprise-level features with small business accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape how we serve our customers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility</h3>
              <p className="text-gray-700">
                We believe powerful tools should be accessible to all businesses, regardless of size or budget constraints.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reliability</h3>
              <p className="text-gray-700">
                Our customers depend on us for their daily operations. We're committed to providing stable, reliable service.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-700">
                We continuously innovate to bring you the latest features and technologies in inventory management.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Focus</h3>
              <p className="text-gray-700">
                Every feature we build and every decision we make is guided by what's best for our customers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security</h3>
              <p className="text-gray-700">
                We take data security seriously and implement industry-leading security measures to protect your information.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-700">
                We believe in building a strong community of users who support and learn from each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're a passionate team of developers, designers, and business experts dedicated to making inventory management simple and accessible for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Development Team</h3>
              <p className="text-gray-600">
                Our talented developers work tirelessly to create robust, scalable solutions that meet the evolving needs of our users.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Success</h3>
              <p className="text-gray-600">
                Our customer success team ensures every user gets the most value from StockFlow and achieves their business goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Product Team</h3>
              <p className="text-gray-600">
                Our product team continuously researches market needs and user feedback to guide our development roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Since our launch, we've helped thousands of businesses worldwide streamline their inventory management and grow their operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions about StockFlow or want to learn more about how we can help your business? We'd love to hear from you.
          </p>
          <div className="bg-gray-50 p-8 rounded-lg">
            <p className="text-gray-700 mb-4"><strong>Email:</strong> hello@stockflow.be</p>
            <p className="text-gray-700 mb-4"><strong>Support:</strong> support@stockflow.be</p>
            <p className="text-gray-700"><strong>Business Inquiries:</strong> business@stockflow.be</p>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}
