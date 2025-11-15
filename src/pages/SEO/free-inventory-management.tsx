import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  Gift,
  Coins,
  CheckCircle,
  Smartphone,
  BarChart3,
  ArrowRight,
  Star,
  Users,
  Cloud
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';

export default function FreeInventoryManagement() {
  usePageRefresh();

  const benefits = [
    {
      icon: Gift,
      title: 'Free Forever Plan',
      description:
        'Manage up to 30 products with unlimited activity logs, images and locations – no credit card required.'
    },
    {
      icon: Coins,
      title: 'Upgrade Only When Ready',
      description:
        'Scale into advanced automation, integrations and analytics without losing historical data or workflows.'
    },
    {
      icon: Smartphone,
      title: 'Mobile & Barcode Ready',
      description:
        'Scan barcodes, count stock and approve transfers straight from the StockFlow mobile apps.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Dashboards',
      description:
        'Get instant visibility into stock levels, low-stock alerts and valuation with ready-to-use dashboards.'
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description:
        'Automatic backups, secure hosting in the EU and zero IT maintenance so you can focus on operations.'
    },
    {
      icon: Users,
      title: 'Invite Your Whole Team',
      description:
        'Collaborate with purchasing, finance and warehouse teams through multi-user access and granular permissions.'
    }
  ];

  const faq = [
    {
      question: 'What is included in the free inventory management plan?',
      answer:
        'The free plan covers up to 30 products, unlimited transactions, barcode scanning, stock alerts, multi-location support and access to both web and mobile apps. It is ideal for new businesses validating their processes before scaling.'
    },
    {
      question: 'Can I keep my data when I upgrade?',
      answer:
        'Yes. All data, workflows and documents remain in place when you move to paid tiers. You simply unlock additional capacity, automation or integrations as needed.'
    },
    {
      question: 'Do I need to install anything locally?',
      answer:
        'No installation is required. StockFlow runs entirely in the cloud, so you can log in from any device with an internet connection and start working in minutes.'
    },
    {
      question: 'Is there onboarding support?',
      answer:
        'Our team provides knowledge base guides, template imports and direct chat support to help you launch quickly. Paid plans include dedicated onboarding sessions.'
    }
  ];

  return (
    <SeoPageLayout title="Free Inventory Management">
      <SEO
        title="Free Inventory Management Software 2025 | Start Free"
        description="100% free inventory management for up to 30 products. Barcode scanning, alerts, multi-location. No credit card. Upgrade when ready. Trusted by 500+ businesses."
        keywords="free inventory management, inventory software free plan, free stock management, free warehouse software, free inventory tracking, free inventory system, no cost inventory software, free inventory app, free stock control, free inventory management tool"
        url="https://www.stockflow.be/free-inventory-management"
        publishedTime="2024-01-01T00:00:00Z"
        modifiedTime={new Date().toISOString()}
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Free Inventory Management{' '}
                <span className="text-blue-600">Built for Growing Teams</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get the visibility, automation and collaboration you need without the upfront cost. Start with StockFlow’s free plan and upgrade when operations demand more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Start Free Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Compare Pricing
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">Trusted by 500+ SMEs</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="Free inventory management dashboard"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Launch Without Risk, Grow Without Limits
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto text-center">
            StockFlow’s free plan is designed to help small teams digitise their inventory operations quickly. When volume spikes or workflows become more complex, paid plans unlock automation, advanced analytics and integrations – keeping your data intact.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <benefit.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perfect for Startups, Makers & Retailers
            </h2>
            <p className="text-lg opacity-90">
              Track stock across locations, see what is about to run out and keep your team aligned – free. StockFlow grows with you, connecting Shopify, accounting systems and purchasing when you need deeper automation.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Included in the free plan</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Unlimited transactions, locations and suppliers</li>
                <li>• Barcode & QR scanning via iOS and Android</li>
                <li>• Real-time alerts and activity history</li>
                <li>• Downloadable reports and CSV exports</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">When to upgrade</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Need more than 30 active products</li>
                <li>• Require multi-warehouse automation</li>
                <li>• Want integrations with accounting or POS</li>
                <li>• Need advanced analytics or API access</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Content Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Free Inventory Management Software?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Starting a business or managing inventory for the first time shouldn't require a significant upfront investment. Free inventory management software like StockFlow's free plan allows you to digitize your inventory operations without financial risk, giving you time to validate your processes and understand your needs before committing to paid solutions.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Many businesses start with spreadsheets or manual tracking, which quickly becomes unsustainable as operations grow. Free inventory management software bridges the gap between basic tracking and expensive enterprise solutions, providing professional-grade features at no cost.
          </p>
          
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Makes StockFlow's Free Plan Different</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Unlike many "free" software options that are limited trials or feature-restricted, StockFlow's free plan includes:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>Full access to core inventory management features, not just a demo</li>
            <li>Unlimited transactions, locations, and suppliers - no hidden limits</li>
            <li>Mobile apps for iOS and Android with barcode scanning capabilities</li>
            <li>Real-time alerts and notifications for low stock situations</li>
            <li>Complete data portability - your data stays yours, always</li>
            <li>No credit card required - truly free, no payment method needed</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Upgrade from Free to Paid Plans</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            The free plan is perfect for businesses managing up to 30 products. As your business grows, you'll know it's time to upgrade when you:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>Need to track more than 30 products across your inventory</li>
            <li>Require advanced automation like automated purchase orders</li>
            <li>Want integrations with accounting software, e-commerce platforms, or POS systems</li>
            <li>Need advanced analytics, custom reports, or API access</li>
            <li>Require multi-warehouse automation and complex transfer workflows</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6">
            The best part? When you upgrade, all your data, settings, and workflows remain intact. There's no migration needed - you simply unlock additional features and capacity.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mt-8">
            <p className="text-gray-800 leading-relaxed font-medium">
              Ready to replace spreadsheets with professional inventory management? <Link to="/auth" className="text-blue-600 hover:text-blue-800 font-semibold">Start your free account</Link> today - no credit card required, no time limits, no hidden fees.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Create Your Free Account Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Replace spreadsheets with a single source of truth for inventory. Launch in minutes, invite your team and keep scaling with StockFlow.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Free Plan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Free Inventory Management Software",
          "description": "100% free inventory management software for up to 30 products. Track stock, scan barcodes, automate alerts. No credit card required. Upgrade when ready.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Manage up to 30 products with full features",
              "availability": "https://schema.org/InStock"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "ratingCount": "500",
            "bestRating": "5",
            "worstRating": "1"
          },
          "featureList": [
            "Free inventory tracking for up to 30 products",
            "Barcode and QR code scanning",
            "Multi-location support",
            "Real-time stock alerts",
            "Mobile apps for iOS and Android",
            "Unlimited transactions",
            "Cloud-based with automatic backups"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Free Inventory Management Software | StockFlow",
          "description": "100% free inventory management for up to 30 products. No credit card required. Start tracking inventory today.",
          "url": "https://www.stockflow.be/free-inventory-management",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.stockflow.be"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Free Inventory Management",
                "item": "https://www.stockflow.be/free-inventory-management"
              }
            ]
          }
        }
      ]} />
    </SeoPageLayout>
  );
}


