import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import Header from '@/components/HeaderPublic';
import Footer from '@/components/Footer';

const faqSections = [
  {
    section: 'Getting Started',
    items: [
      {
        q: 'What is StockFlow?',
        a: 'StockFlow is a free, cloud-based inventory management platform built for small and medium businesses. It lets you track stock levels in real time, scan barcodes, manage orders, and generate reports — all from your browser or mobile device.',
      },
      {
        q: 'Is StockFlow really free?',
        a: 'Yes. The Starter plan is free forever with no credit card required. It includes all core inventory features for up to 100 unique items and 1 user. Paid plans start at $9/month and unlock higher limits plus advanced features like order management and integrations.',
      },
      {
        q: 'How do I get started?',
        a: 'Simply create a free account at stockflowsystems.com. No setup fee, no credit card, no commitment. You can start tracking inventory within minutes by importing a CSV or adding items manually.',
      },
      {
        q: 'Do I need to install anything?',
        a: 'No installation is required. StockFlow is fully browser-based and works on any device. We also have a mobile-optimised version for barcode scanning on iOS and Android.',
      },
      {
        q: 'Can I migrate from spreadsheets or another tool?',
        a: 'Yes. StockFlow supports CSV import so you can bring your existing inventory over in minutes. Our customer success team is available to help with complex migrations at no extra cost.',
      },
    ],
  },
  {
    section: 'Features',
    items: [
      {
        q: 'Does StockFlow support barcode and QR code scanning?',
        a: 'Yes. You can scan barcodes and QR codes directly from your phone camera or a USB scanner. StockFlow also lets you generate and print custom QR code labels for any item in your inventory.',
      },
      {
        q: 'Can I manage inventory across multiple locations?',
        a: 'Yes. Professional plan supports 2 warehouses, Business supports 5, and Enterprise supports unlimited locations. Each location has its own stock levels, and you get a consolidated view across all sites.',
      },
      {
        q: 'Does StockFlow work offline?',
        a: 'Yes. StockFlow has offline support so you can continue scanning and updating stock even without an internet connection. Changes sync automatically when your connection is restored.',
      },
      {
        q: 'Does StockFlow support sales and purchase orders?',
        a: 'Yes, starting from the Professional plan. You can create, track, and fulfil sales orders and purchase orders directly within StockFlow, with automatic stock adjustments when orders are completed.',
      },
      {
        q: 'Can I set low stock alerts?',
        a: 'Yes. You can set a minimum stock threshold for each item. StockFlow will notify you when stock drops below that level so you can reorder before running out.',
      },
      {
        q: 'Does StockFlow support Bill of Materials (BOM)?',
        a: 'Yes. StockFlow includes a Bill of Materials feature that lets you define the components needed to produce finished goods. When you build a product, stock of all components is automatically deducted.',
      },
      {
        q: 'What reporting is available?',
        a: 'StockFlow includes stock movement reports, valuation reports, low stock reports, and sales analytics. Business and Enterprise plans have access to advanced reporting and custom report builder.',
      },
    ],
  },
  {
    section: 'Pricing & Plans',
    items: [
      {
        q: 'What plans are available?',
        a: 'StockFlow offers four plans: Starter (free, 100 items, 1 user), Professional ($9/mo, 2,000 items, 5 users), Business ($29/mo, 5,000 items, 8 users), and Enterprise ($59/mo, 10,000+ items, 12+ users). All paid plans include a 14-day free trial.',
      },
      {
        q: 'Do I need a credit card to start a free trial?',
        a: 'No. You can start a 14-day free trial of any paid plan without entering payment details. A card is only required if you decide to continue after the trial.',
      },
      {
        q: 'Can I upgrade or downgrade at any time?',
        a: 'Yes. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period so you never lose access mid-cycle.',
      },
      {
        q: 'Can I add extra users or warehouses?',
        a: 'Yes. Extra user licenses cost $2/month each and extra warehouses cost $5/month each, on top of your plan\'s included allowance.',
      },
      {
        q: 'Is there a discount for annual billing?',
        a: 'Contact our team for annual billing options and enterprise pricing discounts. We offer savings for teams that commit to a full year.',
      },
    ],
  },
  {
    section: 'Security & Data',
    items: [
      {
        q: 'Is my data secure?',
        a: 'Yes. StockFlow uses bank-level encryption (AES-256) for data at rest and TLS for data in transit. Our infrastructure is hosted on SOC 2 compliant servers with 99.9% uptime SLA.',
      },
      {
        q: 'Who owns my data?',
        a: 'You do. Your inventory data belongs to you. StockFlow will never sell your data or use it for advertising. You can export your full data at any time.',
      },
      {
        q: 'Can I control what my team members can see?',
        a: 'Yes, from the Business plan onwards. You can assign role-based access permissions so team members only see and edit what is relevant to their job.',
      },
      {
        q: 'What happens to my data if I cancel?',
        a: 'Your data remains accessible for 30 days after cancellation so you can export it. After that, it is permanently deleted from our servers.',
      },
    ],
  },
  {
    section: 'Integrations',
    items: [
      {
        q: 'Does StockFlow integrate with QuickBooks?',
        a: 'Yes. The Business plan includes a native QuickBooks Online integration that syncs your inventory values and purchase data with your accounting records automatically.',
      },
      {
        q: 'Does StockFlow have an API?',
        a: 'Yes. The Enterprise plan includes full REST API and webhook support so you can connect StockFlow to any system — ERP, e-commerce platforms, shipping tools, and more.',
      },
      {
        q: 'Can StockFlow connect to my online store?',
        a: 'Yes. Via the API you can sync inventory levels with Shopify, WooCommerce, and other platforms. Native integrations for popular platforms are on our roadmap.',
      },
    ],
  },
];

const allFaqs = faqSections.flatMap((s) => s.items);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": allFaqs.map((item) => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.a,
    },
  })),
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
        aria-expanded={open}
      >
        <span>{q}</span>
        {open
          ? <ChevronUp className="h-5 w-5 flex-shrink-0 text-blue-600" />
          : <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />}
      </button>
      {open && <p className="pb-5 text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function FAQPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="StockFlow FAQ — Frequently Asked Questions"
        description="Find answers to the most common questions about StockFlow: free inventory management software for small businesses. Pricing, features, security, integrations and more."
        keywords="stockflow faq, inventory management questions, stockflow help, inventory software questions"
        url="https://www.stockflowsystems.com/faq"
        structuredData={structuredData}
      />

      <Header onLoginClick={() => navigate('/auth?mode=login')} onNavigate={() => {}} simplifiedNav={false} hideNotifications={true} />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-slate-50 to-blue-50 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about StockFlow. Can't find your answer?{' '}
            <a href="/contact" className="text-blue-600 hover:underline font-medium">Contact us</a>.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          {faqSections.map((section) => (
            <div key={section.section} className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600 inline-block">
                {section.section}
              </h2>
              <div className="mt-4">
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control of your inventory?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start free today — no credit card, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/auth?mode=register')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-semibold text-lg"
            >
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
