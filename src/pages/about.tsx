import { SEO } from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function About() {
  usePageRefresh();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StockFlow",
    "description": "Leading provider of Cloud-based Inventory Management Platform for small and medium businesses worldwide.",
    "url": "https://www.stockflowsystems.com",
    "logo": "https://www.stockflowsystems.com/logo.png",
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
      "email": "support@stockflowsystems.com"
    },
    "sameAs": [
      "https://www.facebook.com/stockflowapp",
      "https://www.linkedin.com/company/stockflow"
    ]
  };

  return (
    <SeoPageLayout title="About Us">
      <SEO
        title="About StockFlow - Free Inventory Management Platform"
        description="StockFlow democratizes inventory management for small businesses. Founded in 2020, we've helped 500+ companies eliminate stockouts, reduce waste, and save 10-20 hours weekly. Free forever."
        keywords="about stockflow, inventory management company, stock management company, warehouse management company, inventory software company, stock software company, warehouse software company, business software company, inventory management team, stock management team, warehouse management team, inventory software team, stock software team, warehouse software team, business software team, inventory management mission, stock management mission, warehouse management mission, inventory software mission, stock software mission, warehouse software mission, business software mission, inventory management company story, stock management company story, warehouse management company story, inventory software company story, stock software company story, warehouse software company story, business software company story"
        url="https://www.stockflowsystems.com/about"
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
              We're eliminating the inventory management barrier for small businesses. Over 500 companies already use StockFlow to prevent stockouts, slash counting time by 75%, and recover capital tied up in dead stock.
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
                Small businesses waste $4,000-8,000 annually on inventory mistakes. Stockouts kill sales. Overstock ties up capital. We built StockFlow to stop this cycle—without the enterprise software price tag.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                After working with hundreds of retailers, we noticed a pattern: businesses either overpaid for complex systems they barely used, or limped along with spreadsheets that caused costly errors. StockFlow bridges that gap—professional features, zero cost, intuitive interface.
              </p>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-sm text-gray-600 italic">
                  <strong>Pro tip from our experience:</strong> Most businesses start tracking only their top 20-30 SKUs. Within weeks, they expand to full catalogs once they see the time savings.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why We Started</h3>
              <p className="text-gray-700 mb-4">
                Launched in 2020 after watching a Brussels retailer lose €12,000 in a month from stockouts and expired goods. Existing solutions cost €150-500/month—more than their monthly profit margin. That's when we realized: small businesses need enterprise power without enterprise pricing.
              </p>
              <p className="text-gray-700">
                Today, 500+ businesses trust StockFlow. Our data shows average users save 10-20 hours weekly on counting and reporting. One retail chain eliminated 85% of their stockouts in the first quarter.
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
              These principles drive our product decisions, customer support, and company culture every day.
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
                Enterprise inventory features shouldn't cost €500/month. We've made barcode scanning, multi-location tracking, and advanced analytics free—because every business deserves professional tools.
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
                99.9% uptime since launch. When a shop opens at 8 AM, StockFlow needs to work. We run redundant systems, automated backups, and monitor 24/7 so downtime never impacts your operations.
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
                Dead stock optimizer, mobile-first scanning, real-time multi-location sync—we ship features monthly based on actual customer requests. No roadmap theater. Just tools that solve real problems.
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
                We track feature requests in real customer conversations, not surveys. When three retailers ask for expiry date tracking, we build it. When warehouse teams need cycle count workflows, we ship them within weeks.
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
                SOC 2 compliant infrastructure, encrypted data at rest and in transit, role-based access controls. Your inventory data stays private. We've never had a security breach—and we're working to keep that record intact.
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
                Retailers share barcode scanning workflows. Contractors exchange multi-location setup tips. Our users help each other optimize processes—we just provide the platform and listen.
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
              Engineers who've built inventory systems for Fortune 500s. Retail veterans who've managed stockrooms. We combine enterprise software experience with small business empathy.
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
                Former engineers from Shopify, Zendesk, and regional inventory software companies. We know how to build systems that handle 10,000+ SKUs without breaking—or charging enterprise prices.
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
                We onboard new users personally. Import your first 50 products together. Set up scanning workflows. Train your team. Most businesses go live in under a week with our guided setup.
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
                We watch how businesses actually use StockFlow. Heatmaps show where teams struggle. Support tickets reveal missing features. User interviews surface pain points. Then we build what matters most.
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
              Five years in, we've processed millions of inventory transactions. Our users collectively save thousands of hours monthly. Here's what that looks like in numbers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10-20 hrs</div>
              <div className="text-gray-600">Saved Weekly (avg)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Since 2020</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">&lt;5 min</div>
              <div className="text-gray-600">Avg Support Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8">
            Questions about setup? Need help migrating from spreadsheets? Want to discuss custom integrations? Reach out—we respond within hours, not days.
          </p>
          <div className="bg-gray-50 p-8 rounded-lg">
            <p className="text-gray-700 mb-4"><strong>Email:</strong> hello@stockflowsystems.com</p>
            <p className="text-gray-700 mb-4"><strong>Support:</strong> support@stockflowsystems.com</p>
            <p className="text-gray-700"><strong>Business Inquiries:</strong> business@stockflowsystems.com</p>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}


