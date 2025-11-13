import { useState } from 'react';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Link, useLocation } from 'react-router-dom';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import type { LucideIcon } from 'lucide-react';
import { 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  Database,
  Send,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Infinity
} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@/components/ui/accordion';
export default function BestInventoryManagementSoftware() {
  usePageRefresh();
  const location = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
  const faqData = [
    {
      question: "What is the best inventory management software for small businesses in 2025?",
      answer: "For growing SMBs, StockFlow ranks highest thanks to built-in automation, barcode scanning, and transparent, pay-as-you-grow pricing. Larger enterprises may prefer NetSuite or Microsoft Dynamics 365 for their ERP depth, while Cin7 remains strong for omnichannel retailers.",
      ctaLabel: "See the comparison table",
      ctaHref: "#comparison"
    },
    {
      question: "How does StockFlow compare to NetSuite, Cin7, and inFlow?",
      answer: "StockFlow delivers guided onboarding in under a week, 24/7 support, and a free plan for 100 SKUs. NetSuite and Cin7 typically require 45–90 day implementations and paid consultants, while inFlow lacks StockFlow's workflow automation and multi-location forecasting at similar price points.",
      ctaLabel: "Compare StockFlow to competitors",
      ctaHref: "#comparison"
    },
    {
      question: "Which features should I prioritise when choosing inventory management software?",
      answer: "Prioritise real-time stock accuracy, mobile barcode apps, multichannel syncing, automated replenishment, analytics, and open integrations with accounting, ecommerce, and WMS tools. StockFlow includes all of these out of the box so you can scale without bolt-on modules.",
      ctaLabel: "Review StockFlow features",
      ctaHref: "#features"
    },
    {
      question: "Is there a free inventory management software plan that scales?",
      answer: "Yes. StockFlow's free plan covers up to 100 SKUs, unlimited users, and all core features. As you surpass 100 products, pricing starts at €0.004 per SKU per month and adjusts instantly, so you only pay for the additional inventory you track.",
      ctaLabel: "Start the free plan",
      ctaHref: "/auth"
    },
    {
      question: "How long does it take to implement StockFlow?",
      answer: "Most teams go live in 5–7 days with StockFlow's guided onboarding. Your success manager migrates data, connects sales channels, sets reorder points, and trains staff so you capture ROI within the first month.",
      ctaLabel: "Book an onboarding call",
      ctaHref: "#quick-wins"
    },
    {
      question: "Does StockFlow integrate with ecommerce, accounting, and fulfilment platforms?",
      answer: "StockFlow connects to Shopify, Amazon, WooCommerce, Lightspeed, Xero, QuickBooks, ShipStation, and 45+ other systems via native integrations and open APIs, keeping inventory, orders, and financials in sync.",
      ctaLabel: "View integration list",
      ctaHref: "#features"
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Real-time Inventory Tracking",
      description: "Monitor your stock levels in real-time with instant updates across all locations and devices."
    },
    {
      icon: Camera,
      title: "Advanced Barcode Scanning",
      description: "Scan product barcodes with your smartphone camera for quick and accurate inventory updates."
    },
    {
      icon: Zap,
      title: "Automated Reorder Points",
      description: "Set minimum stock levels and receive automatic notifications when it's time to reorder."
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Get detailed insights into your inventory performance, sales trends, and demand forecasting."
    },
    {
      icon: Users,
      title: "Multi-user Collaboration",
      description: "Work together with your team using role-based access control and real-time synchronization."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with daily backups, SSL encryption, and GDPR compliance."
    }
  ];

  const benefits = [
    {
      title: "Lower carrying costs",
      description: "Use real-time visibility and demand forecasting to reduce excess stock and release up to 35% of tied-up cash."
    },
    {
      title: "Stop stockouts",
      description: "Smart reorder points trigger automated purchase orders so you always have best sellers on hand."
    },
    {
      title: "Streamline fulfilment",
      description: "Barcode scanning and mobile pick lists cut manual admin by 15+ hours each week."
    },
    {
      title: "Improve accuracy",
      description: "Serial- and batch-tracking maintain 99%+ inventory accuracy across every warehouse."
    },
    {
      title: "Align finance and ops",
      description: "Native integrations sync orders, invoices, and returns with Xero, QuickBooks, and 45+ platforms."
    },
    {
      title: "Scale effortlessly",
      description: "Role-based permissions, audit trails, and enterprise-grade security keep you compliant as you grow."
    }
  ];

  type PricingDisplay = {
    price: string;
    suffix?: string;
    subtext?: string;
  };

  type PricingPlan = {
    name: string;
    icon: LucideIcon;
    badge?: string | null;
    monthly: PricingDisplay;
    yearly: PricingDisplay;
    notes?: Partial<Record<'monthly' | 'yearly', string>>;
    metrics: { label: string; value: string }[];
    extras?: string | null;
    features: string[];
    cta: { label: string; href: string; external: boolean };
  };

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      icon: Send,
      badge: null,
      monthly: { price: "$0", suffix: "USD/MO." },
      yearly: { price: "$0", suffix: "USD/MO.", subtext: "Billed annually at $0" },
      notes: {},
      metrics: [
        { label: "Unique Items", value: "100 Unique Items" },
        { label: "User Licenses", value: "1 User License" }
      ],
      extras: null,
      features: [
        "In-app Barcode & QR Code Scanning",
        "Offline Mobile Access",
        "Automatic Sync"
      ],
      cta: { label: "Sign Up", href: "/auth", external: false }
    },
    {
      name: "Advanced",
      icon: Lightbulb,
      badge: null,
      monthly: { price: "$29", suffix: "USD/MO." },
      yearly: { price: "$174", suffix: "USD/YR", subtext: "Equivalent to $14.50/mo" },
      notes: {
        monthly: "Switch to yearly to save $174",
        yearly: "Billed annually — save $174"
      },
      metrics: [
        { label: "Unique Items", value: "500 Unique Items" },
        { label: "User Licenses", value: "2 User Licenses" }
      ],
      extras: "Unlimited QR Code Label Creation",
      features: [
        "Inventory Import",
        "Item Photos",
        "Inventory Lists",
        "Email Support"
      ],
      cta: { label: "Start Free Trial", href: "/auth", external: false }
    },
    {
      name: "Ultra",
      icon: Rocket,
      monthly: { price: "$99", suffix: "USD/MO." },
      yearly: { price: "$594", suffix: "USD/YR", subtext: "Equivalent to $49.50/mo" },
      notes: {
        monthly: "Switch to yearly to save $594",
        yearly: "Billed annually — save $594"
      },
      metrics: [
        { label: "Unique Items", value: "2,000 Unique Items" },
        { label: "User Licenses", value: "5 User Licenses" }
      ],
      extras: "Purchase Orders",
      features: [
        "Unlimited QR & Barcode Label Creation",
        "Automated Purchase Orders",
        "Low Stock Alerts",
        "Date-based Alerts"
      ],
      cta: { label: "Start Free Trial", href: "/auth", external: false }
    },
    {
      name: "Premium",
      icon: ShieldCheck,
      badge: null,
      monthly: { price: "$199", suffix: "USD/MO." },
      yearly: { price: "$1,194", suffix: "USD/YR", subtext: "Equivalent to $99.50/mo" },
      notes: {
        monthly: "Switch to yearly to save $1,194",
        yearly: "Billed annually — save $1,194"
      },
      metrics: [
        { label: "Unique Items", value: "5,000 Unique Items" },
        { label: "User Licenses", value: "8 User Licenses" }
      ],
      extras: "QuickBooks Online Integration",
      features: [
        "Customizable Role Permissions",
        "QuickBooks Online Integration",
        "Advanced Reporting",
        "Priority Support"
      ],
      cta: { label: "Start Free Trial", href: "/auth", external: false }
    },
    {
      name: "Enterprise",
      icon: Infinity,
      badge: null,
      monthly: { price: "Get a Quote" },
      yearly: { price: "Get a Quote" },
      notes: {},
      metrics: [
        { label: "Unique Items", value: "10,000+ Unique Items" },
        { label: "User Licenses", value: "12+ User Licenses" }
      ],
      extras: "Dedicated Customer Success Manager",
      features: [
        "API & Webhooks",
        "SSO & Advanced Security",
        "Dedicated Customer Success Manager",
        "Custom Inventory Setup"
      ],
      cta: { label: "Talk to Sales", href: "https://www.stockflow.be/contact", external: true }
    }
  ];

  const comparisonData = [
    {
      feature: "Implementation time",
      stockflow: "< 7 days (guided)",
      exact: "60–90 days via partner",
      visma: "45+ days consultant led"
    },
    {
      feature: "Total cost (year 1)",
      stockflow: "€0–€1.2k (avg SMB)",
      exact: "€6k+ license & setup",
      visma: "€8k+ license & setup"
    },
    {
      feature: "Automation coverage",
      stockflow: "Reorder & workflows included",
      exact: "Add-ons required",
      visma: "Premium tier (€450+/mo)"
    },
    {
      feature: "Mobile access",
      stockflow: "iOS & Android free",
      exact: "€50+/user/mo add-on",
      visma: "Warehouse app only"
    },
    {
      feature: "Support availability",
      stockflow: "24/7 chat + phone",
      exact: "Business hours/email",
      visma: "Email ticketing"
    },
    {
      feature: "Customer NPS (G2 · Q4 2025)",
      stockflow: "74",
      exact: "42",
      visma: "39"
    },
    {
      feature: "Free trial / plan",
      stockflow: "Yes · up to 100 SKUs",
      exact: "No",
      visma: "No"
    },
    {
      feature: "Integration library",
      stockflow: "45+ native connectors",
      exact: "18 integrations",
      visma: "25 integrations"
    }
  ];

  const testimonials = [
    {
      name: "David Chen",
      role: "CEO · TechStart Solutions",
      content: "We retired spreadsheets and cut out-of-stock incidents by 38% in the first quarter. StockFlow's success team configured automations for us in under a week.",
      rating: 5,
      highlight: "38% fewer stockouts"
    },
    {
      name: "Sarah Johnson",
      role: "Operations Manager · Retail Plus",
      content: "We handle 12 sales channels and finally have one source of truth. StockFlow synced Shopify, Amazon, and POS data instantly and saved 18 staff hours every week.",
      rating: 5,
      highlight: "18 hours saved weekly"
    },
    {
      name: "Mike Rodriguez",
      role: "Warehouse Manager · Global Supply",
      content: "Barcode scanning on mobile and predictive reordering kept our on-time fulfillment at 99.2%. Support jumped on every question within minutes.",
      rating: 5,
      highlight: "99.2% on-time fulfilment"
    }
  ];

  const pageMetadata = {
    published: '2025-11-06',
    updated: '2025-11-13',
    updatedDisplay: '13/11/2025'
  };

  const awards = [
    {
      title: "Best Inventory Software 2024",
      organization: "Business Software Review",
      icon: "ðŸ†"
    },
    {
      title: "Top Rated by Users",
      organization: "Software Review Platform",
      icon: "⭐"
    },
    {
      title: "Best Value for Money",
      organization: "Tech Business Awards",
      icon: "ðŸ’°"
    },
    {
      title: "Easiest to Use",
      organization: "User Experience Awards",
      icon: "ðŸŽ¯"
    }
  ];


  // Generate sidebar content
  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'awards', title: 'Why StockFlow is the Best', level: 1 },
    { id: 'quick-wins', title: 'Why Businesses Choose StockFlow', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'comparison', title: 'StockFlow vs Competitors', level: 1 },
    { id: 'pricing', title: 'Choose Your Plan', level: 1 },
    { id: 'testimonials', title: 'What Our Customers Say', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Best Inventory Management Software"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Best Inventory Management Software? Try StockFlow"
        description="Compare the best inventory management software, see pricing and features, and launch StockFlow's free plan to automate stock control today."
        keywords="best inventory management software, inventory software comparison, stock management tools, inventory automation, StockFlow free trial"
        url="https://www.stockflow.be/best-inventory-management-software"
      />


      {/* Awards Section */}
      <section id="awards" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8">
          Best Inventory Management Software
            </h1>
          </div>

          <div className="text-center mb-8 border-b border-gray-200 pb-8">
            <span className="text-center text-gray-600 text-sm">
              Updated: {pageMetadata.updatedDisplay} · Research-backed comparison
            </span>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-lg text-gray-600 md:text-xl">
              Searching for the best inventory management software in 2025? This expert guide compares leading platforms, spotlights must-have features, and shows how StockFlow reduces carrying costs with real-time automation and transparent pricing.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
              >
                Start StockFlow Free
              </Link>
              <a
                href="#comparison"
                className="inline-flex items-center justify-center rounded-full border border-blue-600 px-6 py-3 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Compare Top Providers
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                10,000+ teams benchmarked
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Includes ROI worksheet
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Updated for 2025 pricing
              </span>
            </div>

            <div className="space-y-4 text-left md:text-lg md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">Inside this guide you will learn:</h3>
              <ul className="list-disc list-inside md:list-outside md:pl-8 text-gray-700 space-y-2">
                <li>Which inventory platforms lead for ERP, ecommerce, wholesale, and manufacturing teams.</li>
                <li>How StockFlow compares on automation, integrations, and total cost of ownership.</li>
                <li>Actionable criteria to choose the right inventory management software for your growth plans.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">FAQ: Best Inventory Management Software</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Answers to the most common questions buyers ask before selecting an inventory platform in 2025.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => {
              const isInternalRoute = faq.ctaHref?.startsWith('/') ?? false;

              return (
                <AccordionItem key={faq.question} value={`faq-${index}`} className="border-b border-gray-200">
                  <AccordionTrigger className="flex items-center justify-between px-6 py-5 text-left text-xl font-semibold hover:text-primary transition-colors">
                    <span>{faq.question}</span>
                  </AccordionTrigger>

                  <AccordionContent className="px-6 pb-5 text-gray-600 text-lg leading-relaxed space-y-4">
                    <p>{faq.answer}</p>
                    {faq.ctaLabel && faq.ctaHref && (
                      isInternalRoute ? (
                        <Link
                          to={faq.ctaHref}
                          className="inline-flex items-center text-base font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {faq.ctaLabel}
                        </Link>
                      ) : (
                        <a
                          href={faq.ctaHref}
                          className="inline-flex items-center text-base font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {faq.ctaLabel}
                        </a>
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Quick Wins Section */}
      <section id="quick-wins" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Businesses Choose StockFlow Over Competitors
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real results from real businesses using the best inventory management software.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">35%</div>
              <div className="text-lg font-semibold mb-2">Cost Reduction</div>
              <div className="text-sm text-gray-600">Average inventory cost savings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">15h</div>
              <div className="text-lg font-semibold mb-2">Hours Saved</div>
              <div className="text-sm text-gray-600">Per week on manual tasks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-lg font-semibold mb-2">Accuracy</div>
              <div className="text-sm text-gray-600">Inventory tracking precision</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm text-gray-600">Expert help when you need it</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join 500+ Companies Who Signed Up This Month</h3>
            <p className="text-lg text-gray-600 mb-6">See why businesses are switching to StockFlow as their inventory management solution</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">No setup fees</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Instant access</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Free migration</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
              >
                Start my free trial
              </Link>
              <a
                href="https://www.stockflow.be/demo"
                className="inline-flex items-center justify-center rounded-full border border-blue-600 px-6 py-3 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Watch a 5-min demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of Choosing StockFlow
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how the right inventory management software improves profitability, accuracy, and team productivity from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
            >
              Start tracking inventory free
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full border border-blue-600 px-6 py-3 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Explore pricing options
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why StockFlow is the <span className="text-blue-600">Best Inventory Software</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive features that make StockFlow the top choice for inventory management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Comparison Section */}
      <section id="comparison" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              StockFlow vs <span className="text-blue-600">Competitors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how StockFlow compares to other inventory management software solutions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Exact</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Visma Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{item.stockflow}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.exact}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.visma}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-6 py-4 text-sm text-gray-500 text-left md:text-center">
              Pricing, implementation, and satisfaction scores sourced from public vendor price sheets and G2 reviews (Q4 2025).
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-6">
            <div className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <span>Save 50% on yearly pricing</span>
              <div className="flex rounded-full border border-blue-100 bg-white p-1">
                {(['yearly', 'monthly'] as const).map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setBillingCycle(cycle)}
                    className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors ${
                      billingCycle === cycle
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {cycle === 'yearly' ? 'Yearly' : 'Monthly'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Transparent pricing that scales with your SKU count. Every plan includes real-time analytics, barcode scanning, and 24/7 success support.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => {
              const Icon = plan.icon;
              const priceInfo = billingCycle === 'yearly' ? plan.yearly : plan.monthly;
              const note = plan.notes?.[billingCycle];
              const isInternalRoute = !plan.cta.external;

              return (
                <div
                  key={plan.name}
                  className={`flex flex-col rounded-2xl border bg-white p-8 shadow-lg transition-shadow hover:shadow-xl ${
                    plan.badge ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="mb-6 text-center space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{plan.name}</p>
                      <p className="text-base text-gray-600">{plan.description}</p>
                    </div>
                    {plan.badge && (
                      <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mb-6 text-center space-y-2">
                    <h3 className="text-3xl font-bold text-gray-900">{priceInfo.price}</h3>
                    {priceInfo.suffix && (
                      <p className="text-sm font-semibold text-gray-500">{priceInfo.suffix}</p>
                    )}
                    {priceInfo.subtext && (
                      <p className="text-xs text-gray-500">{priceInfo.subtext}</p>
                    )}
                    {note && <p className="text-xs font-semibold text-blue-600">{note}</p>}
                  </div>

                  <div className="mb-6 space-y-3 text-sm">
                    {plan.metrics.map((metric) => (
                      <div key={`${plan.name}-${metric.label}`} className="rounded-lg bg-blue-50 px-4 py-3 text-left">
                        <p className="text-xs uppercase tracking-wide text-blue-600">{metric.label}</p>
                        <p className="text-sm font-semibold text-blue-800">{metric.value}</p>
                      </div>
                    ))}
                    {plan.extras && (
                      <div className="rounded-lg bg-blue-100 px-4 py-3 text-left">
                        <p className="text-xs uppercase tracking-wide text-blue-700">Extras</p>
                        <p className="text-sm font-semibold text-blue-900">{plan.extras}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">What&apos;s included</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {plan.features.map((feature) => (
                        <li key={`${plan.name}-${feature}`} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto">
                    {isInternalRoute ? (
                      <Link
                        to={plan.cta.href}
                        className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
                      >
                        {plan.cta.label}
                      </Link>
                    ) : (
                      <a
                        href={plan.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
                      >
                        {plan.cta.label}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            All plans include unlimited users, multi-location support, API access, and dedicated onboarding assistance.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Our <span className="text-blue-600">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses using the best inventory management software.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                {testimonial.highlight && (
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-3">
                    {testimonial.highlight}
                  </p>
                )}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/best-inventory-management-software",
          "name": "Best Inventory Management Software",
          "headline": "Best Inventory Management Software",
          "description": "Compare the best inventory management software, review pricing and features, and start StockFlow's free plan to automate stock control today.",
          "url": "https://www.stockflow.be/best-inventory-management-software",
          "inLanguage": "en",
          "isPartOf": {
            "@type": "WebSite",
            "name": "StockFlow",
            "url": "https://www.stockflow.be"
          },
          "datePublished": pageMetadata.published,
          "dateModified": pageMetadata.updated,
          "potentialAction": {
            "@type": "ReadAction",
            "target": "https://www.stockflow.be/best-inventory-management-software"
          },
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://www.stockflow.be/Inventory-Management.png"
          },
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
                "name": "Best Inventory Management Software",
                "item": "https://www.stockflow.be/best-inventory-management-software"
              }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow Inventory Management Software",
          "description": "StockFlow provides real-time inventory automation, barcode scanning, multi-location control, and a free plan for up to 100 SKUs with pay-as-you-grow pricing.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Inventory Management Software",
          "operatingSystem": "Web Browser",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Up to 100 products",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            },
            {
              "@type": "Offer",
              "price": "0.004",
              "priceCurrency": "EUR",
              "description": "Business plan - Pay-as-you-grow pricing, €0.004 per product/month (products 101+)",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            },
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Enterprise plan - Custom pricing for high-volume businesses (10,000+ products)",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "326",
            "bestRating": "5",
            "worstRating": "1"
          },
          "author": {
            "@type": "Organization",
            "name": "StockFlow",
            "url": "https://www.stockflow.be"
          },
          "publisher": {
            "@type": "Organization",
            "name": "StockFlow",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.stockflow.be/logo.png"
            }
          },
          "image": "https://www.stockflow.be/Inventory-Management.png",
          "screenshot": "https://www.stockflow.be/Inventory-Management.png",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflow.be/best-inventory-management-software"
          },
          "award": [
            "Best Inventory Software 2024",
            "Top Rated by Users",
            "Best Value for Money",
            "Easiest to Use"
          ],
          "featureList": [
            "Implementation in under seven days",
            "Real-time inventory tracking and automation",
            "Advanced barcode scanning on iOS and Android",
            "Multi-location and multichannel synchronization",
            "Workflow builder with automated reorder points",
            "Enterprise-grade security and access controls"
          ],
          "downloadUrl": "https://www.stockflow.be/auth",
          "softwareHelp": {
            "@type": "CreativeWork",
            "url": "https://www.stockflow.be/contact"
          }
        },
        ...testimonials.map((testimonial) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": "StockFlow"
          },
          "author": {
            "@type": "Person",
            "name": testimonial.name
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": testimonial.rating.toString(),
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": testimonial.content
        }))
      ]} />
    </SeoPageLayout>
  );
}


