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
  Infinity,
  ArrowRight
} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';

type PricingDisplay = {
  price: string;
  suffix?: string;
  subtext?: string;
};

type PricingPlan = {
  name: string;
  icon: LucideIcon;
  description: string;
  badge?: string | null;
  monthly: PricingDisplay;
  yearly: PricingDisplay;
  notes?: Partial<Record<'monthly' | 'yearly', string>>;
  metrics: { label: string; value: string }[];
  extras?: string | null;
  features: string[];
  cta: { label: string; href: string; external: boolean };
};

export default function OnlineInventorySoftware() {
  usePageRefresh();
  const location = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [roiInputs, setRoiInputs] = useState({
    inventoryValue: '',
    hoursPerWeek: '',
    hourlyRate: '',
    stockoutLosses: ''
  });
  const [roiResult, setRoiResult] = useState<{
    carryingCostSavings: number;
    timeSavings: number;
    stockoutSavings: number;
    netSavings: number;
    roi: number;
  } | null>(null);

  const pageMetadata = {
    published: '2025-11-06',
    updated: '2025-11-13',
    updatedDisplay: '13/11/2025'
  };

  const faqData = [
    {
      question: 'What is online inventory software?',
      answer:
        'Online inventory software keeps every SKU, order, and location synced in the cloud so teams can manage stock from anywhere. StockFlow combines real-time visibility, barcode scanning, and automation to replace error-prone spreadsheets.'
    },
    {
      question: 'How do I choose the best online inventory software?',
      answer:
        'Match the platform to your channels, order volume, and integrations. Look for real-time syncing, mobile apps, reorder automation, analytics, and open APIs. StockFlow includes these out of the box, plus guided onboarding so you launch in under a week.',
      ctaLabel: 'Compare StockFlow to alternatives',
      ctaHref: '#comparison'
    },
    {
      question: 'Does StockFlow integrate with my sales and accounting tools?',
      answer:
        'Yes. StockFlow connects to Shopify, Amazon, WooCommerce, Squarespace, Xero, QuickBooks Online, Lightspeed, ShipStation, and 45+ other platforms to keep orders and financial data aligned.',
      ctaLabel: 'View integration highlights',
      ctaHref: '#features'
    },
    {
      question: 'Is there a free online inventory software plan that scales?',
      answer:
        'StockFlow’s Free plan covers up to 100 SKUs, unlimited locations, and mobile barcode scanning. As you scale, pricing adjusts to €0.004 per SKU per month with no hidden setup or support fees.',
      ctaLabel: 'Start StockFlow Free',
      ctaHref: '/auth'
    },
    {
      question: 'How quickly can we implement StockFlow?',
      answer:
        'Most teams go live in 5–7 days. Your success manager migrates data, configures automations, and trains your team so ROI arrives within the first month.',
      ctaLabel: 'Book an onboarding call',
      ctaHref: 'https://www.stockflow.be/demo'
    },
    {
      question: 'What kind of support do we get?',
      answer:
        'StockFlow offers 24/7 chat, phone, and email support plus an in-app academy. Growth and Scale plans include dedicated success managers and quarterly optimization workshops.'
    }
  ];

  const features = [
    {
      icon: Database,
      title: 'Unified, Real-time Inventory',
      description: 'Sync sales, purchase orders, and warehouse counts instantly so every channel and team sees accurate stock levels.'
    },
    {
      icon: Camera,
      title: 'Mobile Barcode & QR Scanning',
      description: 'Use any iOS or Android device for receiving, counting, and picking with offline support and lot/serial tracking.'
    },
    {
      icon: Zap,
      title: 'Automated Reorder & Workflows',
      description: 'Trigger purchase orders, transfer stock, and escalate low inventory with customizable workflow rules.'
    },
    {
      icon: BarChart3,
      title: 'Predictive Analytics',
      description: 'Forecast demand, monitor velocity, and identify dead stock with dashboards built for operators and finance teams.'
    },
    {
      icon: Users,
      title: 'Role-based Collaboration',
      description: 'Control permissions for warehouse, finance, ecommerce, and supplier partners with audit-ready activity logs.'
    },
    {
      icon: Shield,
      title: 'Enterprise-grade Security',
      description: 'SOC2-ready controls, SSO, granular permissions, and automated backups keep inventory and financial data protected.'
    }
  ];

  const benefits = [
    {
      title: 'Slash carrying costs',
      description: 'Forecast demand accurately and clear obsolete stock to release up to 35% of tied-up cash.'
    },
    {
      title: 'Eliminate stockouts',
      description: 'Smart reorder points and automated transfers keep best sellers available across every channel.'
    },
    {
      title: 'Streamline fulfillment',
      description: 'Mobile pick, pack, and ship workflows save 15+ hours of manual entry each week.'
    },
    {
      title: 'Improve accuracy',
      description: 'Serial, batch, and bin tracking maintain 99%+ inventory accuracy across warehouses and stores.'
    },
    {
      title: 'Connect finance and operations',
      description: 'Two-way sync with accounting and ERP tools keeps COGS, landed costs, and margins updated automatically.'
    },
    {
      title: 'Scale with confidence',
      description: 'Flexible API, integrations, and permissions adapt as you add new channels, locations, and product lines.'
    }
  ];

  const comparisonData = [
    {
      feature: 'Implementation time',
      stockflow: '< 7 days guided',
      exact: '60–90 days via partner',
      visma: '45+ days consultant led',
      netsuite: '90–180 days (enterprise)',
      zoho: '30–60 days',
      cin7: '45–90 days'
    },
    {
      feature: 'Total cost (year 1)',
      stockflow: '€0–€1.2k (avg SMB)',
      exact: '€6k+ license & setup',
      visma: '€8k+ license & setup',
      netsuite: '€15k+ license & setup',
      zoho: '€1.2k–€3.6k',
      cin7: '€3.6k–€7.2k'
    },
    {
      feature: 'Automation coverage',
      stockflow: 'Reorder & workflows included',
      exact: 'Add-ons required',
      visma: 'Premium tier (€450+/mo)',
      netsuite: 'Advanced modules (€500+/mo)',
      zoho: 'Limited automation',
      cin7: 'Workflows included'
    },
    {
      feature: 'Mobile access',
      stockflow: 'iOS & Android free',
      exact: '€50+/user/mo add-on',
      visma: 'Warehouse app only',
      netsuite: 'Mobile app included',
      zoho: 'Mobile app included',
      cin7: 'Mobile app included'
    },
    {
      feature: 'Support availability',
      stockflow: '24/7 chat + phone',
      exact: 'Business hours/email',
      visma: 'Email ticketing',
      netsuite: '24/7 (premium tier)',
      zoho: 'Business hours',
      cin7: 'Business hours + chat'
    },
    {
      feature: 'Customer NPS (G2 · Q4 2025)',
      stockflow: '74',
      exact: '42',
      visma: '39',
      netsuite: '58',
      zoho: '65',
      cin7: '52'
    },
    {
      feature: 'Free trial / plan',
      stockflow: 'Yes · up to 100 SKUs',
      exact: 'No',
      visma: 'No',
      netsuite: 'No',
      zoho: '14-day trial',
      cin7: '14-day trial'
    },
    {
      feature: 'Integration library',
      stockflow: '45+ native connectors',
      exact: '18 integrations',
      visma: '25 integrations',
      netsuite: '1000+ integrations',
      zoho: '40+ integrations',
      cin7: '200+ integrations'
    },
    {
      feature: 'Cloud-based access',
      stockflow: 'Yes · anywhere, anytime',
      exact: 'On-premise or cloud',
      visma: 'Cloud available',
      netsuite: 'Yes · cloud-native',
      zoho: 'Yes · cloud-native',
      cin7: 'Yes · cloud-native'
    },
    {
      feature: 'Real-time sync',
      stockflow: 'Instant across all channels',
      exact: 'Scheduled updates',
      visma: 'Near real-time',
      netsuite: 'Real-time',
      zoho: 'Real-time',
      cin7: 'Real-time'
    }
  ];

  const testimonials = [
    {
      name: 'David Chen',
      role: 'CEO · TechStart Solutions',
      content:
        "StockFlow gave us realtime visibility across Shopify, Amazon, and our 3PL. We cut stockouts by 38% and automated purchasing in the first quarter.",
      rating: 5,
      highlight: '38% fewer stockouts'
    },
    {
      name: 'Sarah Johnson',
      role: 'Operations Manager · Retail Plus',
      content:
        'We run 12 channels and finally have one live inventory view. StockFlow syncing and workflow automations save us 18 hours every week.',
      rating: 5,
      highlight: '18 hours saved weekly'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Warehouse Manager · Global Supply',
      content:
        'Barcode scanning, cycle counting, and predictive reordering keep fulfillment at 99.2% on-time. Support responds in under five minutes.',
      rating: 5,
      highlight: '99.2% on-time fulfilment'
    }
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: 'Free',
      icon: Send,
      description: 'Best for getting started.',
      badge: null,
      monthly: { price: '$0', suffix: 'USD/MO.' },
      yearly: { price: '$0', suffix: 'USD/MO.', subtext: 'Billed annually at $0' },
      metrics: [
        { label: 'Unique Items', value: '100 Unique Items' },
        { label: 'User Licenses', value: '1 User License' }
      ],
      extras: null,
      features: [
        'In-app Barcode & QR Code Scanning',
        'Offline Mobile Access',
        'Automatic Sync'
      ],
      cta: { label: 'Sign Up', href: '/auth', external: false }
    },
    {
      name: 'Advanced',
      icon: Lightbulb,
      description: 'Best for maintaining optimal stock levels.',
      badge: null,
      monthly: { price: '$29', suffix: 'USD/MO.' },
      yearly: { price: '$174', suffix: 'USD/YR', subtext: 'Equivalent to $14.50/mo' },
      notes: {
        monthly: 'Switch to yearly to save $174',
        yearly: 'Billed annually — save $174'
      },
      metrics: [
        { label: 'Unique Items', value: '500 Unique Items' },
        { label: 'User Licenses', value: '2 User Licenses' }
      ],
      extras: 'Unlimited QR Code Label Creation',
      features: [
        'Inventory Import',
        'Item Photos',
        'Inventory Lists',
        'Email Support'
      ],
      cta: { label: 'Start Free Trial', href: '/auth', external: false }
    },
    {
      name: 'Ultra',
      icon: Rocket,
      description: 'Best for simplifying day-to-day tasks.',
      badge: 'Most Popular',
      monthly: { price: '$99', suffix: 'USD/MO.' },
      yearly: { price: '$594', suffix: 'USD/YR', subtext: 'Equivalent to $49.50/mo' },
      notes: {
        monthly: 'Switch to yearly to save $594',
        yearly: 'Billed annually — save $594'
      },
      metrics: [
        { label: 'Unique Items', value: '2,000 Unique Items' },
        { label: 'User Licenses', value: '5 User Licenses' }
      ],
      extras: 'Purchase Orders',
      features: [
        'Unlimited QR & Barcode Label Creation',
        'Automated Purchase Orders',
        'Low Stock Alerts',
        'Date-based Alerts'
      ],
      cta: { label: 'Start Free Trial', href: '/auth', external: false }
    },
    {
      name: 'Premium',
      icon: ShieldCheck,
      description: 'Best for streamlining complex operations.',
      badge: null,
      monthly: { price: '$199', suffix: 'USD/MO.' },
      yearly: { price: '$1,194', suffix: 'USD/YR', subtext: 'Equivalent to $99.50/mo' },
      notes: {
        monthly: 'Switch to yearly to save $1,194',
        yearly: 'Billed annually — save $1,194'
      },
      metrics: [
        { label: 'Unique Items', value: '5,000 Unique Items' },
        { label: 'User Licenses', value: '8 User Licenses' }
      ],
      extras: 'QuickBooks Online Integration',
      features: [
        'Customizable Role Permissions',
        'QuickBooks Online Integration',
        'Advanced Reporting',
        'Priority Support'
      ],
      cta: { label: 'Start Free Trial', href: '/auth', external: false }
    },
    {
      name: 'Enterprise',
      icon: Infinity,
      description: 'Best for customized inventory control.',
      badge: null,
      monthly: { price: 'Get a Quote' },
      yearly: { price: 'Get a Quote' },
      metrics: [
        { label: 'Unique Items', value: '10,000+ Unique Items' },
        { label: 'User Licenses', value: '12+ User Licenses' }
      ],
      extras: 'Dedicated Customer Success Manager',
      features: [
        'API & Webhooks',
        'SSO & Advanced Security',
        'Dedicated Customer Success Manager',
        'Custom Inventory Setup'
      ],
      cta: { label: 'Talk to Sales', href: 'https://www.stockflow.be/contact', external: true }
    }
  ];

  const sidebarContent = generateSidebarContent(location.pathname, [
    { id: 'awards', title: 'Why StockFlow Leads', level: 1 },
    { id: 'quick-wins', title: 'Why Teams Switch', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'comparison', title: 'StockFlow vs Competitors', level: 1 },
    { id: 'pricing', title: 'Choose Your Plan', level: 1 },
    { id: 'testimonials', title: 'Customer Proof', level: 1 },
    { id: 'roi', title: 'ROI Calculator', level: 1 },
    { id: 'video-demo', title: 'Product Demo', level: 1 },
    { id: 'buyers-guide', title: 'Free Buyer\'s Guide', level: 1 },
    { id: 'faq', title: 'FAQ', level: 1 }
  ]);

  return (
    <SeoPageLayout title="Online Inventory Software" showSidebar={true} sidebarContent={sidebarContent}>
      <SEO
        title="Online Inventory Software | Cloud-Based System & Free Trial"
        description="Compare the best online inventory software 2025. Free plan, 5-day setup, real-time cloud sync, barcode scanning. See pricing and start free trial."
        keywords="online inventory software, cloud inventory management, inventory management system, online inventory management, ecommerce inventory tool, inventory automation, StockFlow free trial"
        url="https://www.stockflow.be/online-inventory-software"
      />

      {/* Hero Section */}
      <section id="awards" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8">Online Inventory Software</h1>
          </div>

          <div className="text-center mb-8 border-b border-gray-200 pb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                <div className="text-sm text-gray-600">Based on 326 reviews</div>
              </div>
            </div>
            <span className="text-center text-gray-600 text-sm">
              Updated: {pageMetadata.updatedDisplay} · Cloud-native comparison
            </span>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-lg text-gray-600 md:text-xl">
              Searching for the best online inventory software or cloud-based inventory management system? This 2025 guide compares leading platforms, breaks down
              must-have features, and shows how StockFlow automates stock control across ecommerce, retail, and
              wholesale channels.
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
                Includes ROI calculator
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Updated for 2025 pricing
              </span>
            </div>

            <div className="space-y-4 text-left md:text-lg">
              <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">Inside this guide you will learn:</h3>
              <ul className="list-disc list-inside md:list-outside md:pl-8 text-gray-700 space-y-2">
                <li>Which online inventory tools lead for ecommerce, retail, wholesale, and manufacturing teams.</li>
                <li>How StockFlow compares on automation, integrations, implementation speed, and total cost.</li>
                <li>Decision criteria to choose a platform that scales with your channels and growth targets.</li>
              </ul>
              
              <div className="mt-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-gray-700 leading-relaxed mb-4">
                  This comprehensive comparison of the best online inventory software and cloud-based inventory management systems is based on real customer data, implementation timelines from 500+ businesses, and detailed feature analysis of leading platforms including StockFlow, NetSuite, Zoho Inventory, Cin7, and Microsoft Dynamics 365. We've evaluated each solution across key criteria: cloud accessibility, ease of implementation, total cost of ownership, automation capabilities, mobile access, customer support quality, and integration flexibility.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Whether you're a small business looking for online inventory software that scales, an ecommerce retailer managing multi-channel sales, or a manufacturing company needing cloud-based inventory tracking, this guide helps you identify the best online inventory management system for your specific industry and business size. We've included real ROI calculations, implementation timelines, and feature comparisons to make your decision process faster and more informed.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our analysis covers free online inventory software options, pay-as-you-grow pricing models, enterprise cloud solutions, and everything in between. Each platform has been evaluated for its strengths in cloud-based inventory tracking accuracy, barcode scanning capabilities, automated reorder points, multi-location support, reporting and analytics, and API integration options. By the end of this guide, you'll know exactly which online inventory software features matter most for your business and how to compare cloud inventory management platforms effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">FAQ: Online Inventory Software</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Answers to the questions buyers ask before choosing a cloud inventory platform.
            </p>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => {
              const isInternalRoute = faq.ctaHref?.startsWith('/') ?? false;
              return (
                <div key={faq.question} className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                  {faq.ctaLabel && faq.ctaHref && (
                    isInternalRoute ? (
                      <Link to={faq.ctaHref} className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
                        {faq.ctaLabel}
                      </Link>
                    ) : (
                      <a
                        href={faq.ctaHref}
                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                        target={faq.ctaHref.startsWith('http') ? '_blank' : undefined}
                        rel={faq.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {faq.ctaLabel}
                      </a>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Wins */}
      <section id="quick-wins" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Teams Switch to StockFlow</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real outcomes from companies modernising their online inventory operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">35%</div>
              <div className="text-lg font-semibold mb-2">Carrying Cost Reduction</div>
              <div className="text-sm text-gray-600">Average inventory cost savings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">15h</div>
              <div className="text-lg font-semibold mb-2">Hours Saved Weekly</div>
              <div className="text-sm text-gray-600">Lower manual data entry</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-lg font-semibold mb-2">Inventory Accuracy</div>
              <div className="text-sm text-gray-600">Across every channel</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Global Support</div>
              <div className="text-sm text-gray-600">Chat, phone, and email</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join 500+ Companies Who Signed Up This Month</h3>
            <p className="text-lg text-gray-600 mb-6">
              See why businesses are replacing legacy tools with StockFlow for unified online inventory control.
            </p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Benefits of StockFlow Online Inventory Software</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Deliver higher accuracy, lower costs, and faster fulfillment with cloud-native inventory control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-lg p-6 shadow-lg">
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
              Why StockFlow is the <span className="text-blue-600">Best Online Inventory Software</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              End-to-end features built to unify ecommerce, retail, wholesale, and manufacturing inventory.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="bg-white p-6 rounded-lg shadow-lg">
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
              See how StockFlow compares to other online inventory software and cloud-based inventory management system solutions. Compare features, pricing, implementation time, and customer satisfaction across leading platforms.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">Feature</th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-blue-600">StockFlow</th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600">NetSuite</th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600">Zoho</th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600">Cin7</th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600">Exact</th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600">Visma</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonData.map((item, index) => (
                    <tr key={item.feature} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-4 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">{item.feature}</td>
                      <td className="px-4 py-4 text-center text-xs text-green-600 font-semibold">{item.stockflow}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-600">{item.netsuite}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-600">{item.zoho}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-600">{item.cin7}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-600">{item.exact}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-600">{item.visma}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-6 py-4 text-sm text-gray-500 text-left md:text-center">
              Pricing, implementation, and satisfaction data sourced from public vendor price sheets and G2 reviews
              (Q4 2025).
            </p>
          </div>

          {/* Pricing Comparison Table */}
          <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Pricing Comparison: Online Inventory Software</h3>
              <p className="text-sm text-gray-600 mt-2">Compare annual costs for small to medium businesses (SMB) with 500-1,000 SKUs</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Software</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Starting Price (Monthly)</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Setup/Implementation</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Year 1 Total Cost</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free Plan/Trial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-green-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">StockFlow</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€0 (Free plan) or €14.50/mo</td>
                    <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">Free (5-7 days)</td>
                    <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">€0-€174</td>
                    <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">✅ Free plan (100 SKUs)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Zoho Inventory</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€29/mo</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€500-€1,500</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€1,200-€3,600</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">14-day trial</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Cin7</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€300/mo</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€2,000-€5,000</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€3,600-€7,200</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">14-day trial</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">NetSuite</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€999/mo+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€10,000-€50,000</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€15,000+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">No free trial</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Exact</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€500/mo+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€3,000-€8,000</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€6,000+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">No free trial</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Visma</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€450/mo+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€4,000-€10,000</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">€8,000+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">No free trial</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
              <p className="font-semibold mb-2">Note:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pricing varies based on number of users, SKUs, and required features</li>
                <li>StockFlow offers the only free plan with up to 100 SKUs</li>
                <li>Implementation costs include data migration, training, and setup</li>
                <li>All prices in EUR, converted from USD where applicable</li>
              </ul>
            </div>
          </div>

          {/* Feature Comparison Matrix */}
          <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Feature Comparison Matrix</h3>
              <p className="text-sm text-gray-600 mt-2">Quick visual comparison of key features across leading online inventory management systems</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">Feature</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-600">StockFlow</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">NetSuite</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Zoho</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Cin7</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">Real-time inventory tracking</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">Barcode scanning (mobile)</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">Cloud-based access</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">Multi-location support</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">Limited</span></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">E-commerce integration</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">Free plan available</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">24/7 support</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">Premium only</span></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                      billingCycle === cycle ? 'bg-blue-600 text-white shadow' : 'text-blue-600 hover:bg-blue-100'
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
                Flexible pricing that scales with your SKU count. Every plan includes analytics, barcode scanning, and 24/7
                support.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
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
                    {priceInfo.suffix && <p className="text-sm font-semibold text-gray-500">{priceInfo.suffix}</p>}
                    {priceInfo.subtext && <p className="text-xs text-gray-500">{priceInfo.subtext}</p>}
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
            All plans include unlimited locations, API access, and dedicated onboarding assistance.
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
              Real commentary from teams running StockFlow as their online inventory system.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-gray-50 p-6 rounded-lg">
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

      {/* ROI Calculator Section */}
      <section id="roi" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Proven ROI: Real Cost Savings & Time Efficiency
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The best online inventory software delivers measurable returns. Calculate your potential savings with our interactive ROI calculator.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Interactive ROI Calculator</h3>
            <p className="text-center text-gray-600 mb-8">Enter your numbers to see potential savings with StockFlow online inventory software</p>
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Inventory Value (€)</label>
                  <input
                    type="number"
                    value={roiInputs.inventoryValue}
                    onChange={(e) => setRoiInputs({...roiInputs, inventoryValue: e.target.value})}
                    placeholder="100000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Spent on Inventory/Week</label>
                  <input
                    type="number"
                    value={roiInputs.hoursPerWeek}
                    onChange={(e) => setRoiInputs({...roiInputs, hoursPerWeek: e.target.value})}
                    placeholder="15"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (€)</label>
                  <input
                    type="number"
                    value={roiInputs.hourlyRate}
                    onChange={(e) => setRoiInputs({...roiInputs, hourlyRate: e.target.value})}
                    placeholder="25"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Stockout Losses (€)</label>
                  <input
                    type="number"
                    value={roiInputs.stockoutLosses}
                    onChange={(e) => setRoiInputs({...roiInputs, stockoutLosses: e.target.value})}
                    placeholder="12000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    const inventoryValue = parseFloat(roiInputs.inventoryValue || '0');
                    const hoursPerWeek = parseFloat(roiInputs.hoursPerWeek || '0');
                    const hourlyRate = parseFloat(roiInputs.hourlyRate || '0');
                    const stockoutLosses = parseFloat(roiInputs.stockoutLosses || '0');
                    
                    const carryingCostSavings = inventoryValue * 0.35;
                    const timeSavings = hoursPerWeek * hourlyRate * 52;
                    const stockoutSavings = stockoutLosses * 0.8;
                    const softwareCost = 174;
                    const netSavings = carryingCostSavings + timeSavings + stockoutSavings - softwareCost;
                    const roi = softwareCost > 0 ? ((netSavings / softwareCost) * 100) : 0;
                    
                    setRoiResult({
                      carryingCostSavings,
                      timeSavings,
                      stockoutSavings,
                      netSavings,
                      roi
                    });
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Calculate My ROI
                </button>
                {roiResult && (
                  <div className="mt-6 p-6 bg-green-50 rounded-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Your Potential Annual Savings</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Carrying cost savings:</span>
                        <span className="font-bold text-green-600 ml-2">€{roiResult.carryingCostSavings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Time savings:</span>
                        <span className="font-bold text-green-600 ml-2">€{roiResult.timeSavings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Stockout reduction:</span>
                        <span className="font-bold text-green-600 ml-2">€{roiResult.stockoutSavings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Software cost:</span>
                        <span className="font-bold text-gray-600 ml-2">€174</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold">Net Annual Savings:</span>
                        <span className="text-2xl font-bold text-green-600">€{roiResult.netSavings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">ROI:</span>
                        <span className="text-2xl font-bold text-green-600">{roiResult.roi.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section id="video-demo" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              See StockFlow Online Inventory Software in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Watch how the best online inventory software helps businesses automate stock control, prevent stockouts, and reduce costs with cloud-based access.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-white z-10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
                  <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-lg font-semibold mb-2">Product Demo Video</p>
                <p className="text-sm text-gray-300">Click to watch 3-minute overview</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-20"></div>
              <div className="absolute inset-0" style={{backgroundImage: 'url(/Inventory-Management.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3}}></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              <Link to="/demo" className="text-blue-600 hover:underline font-semibold">
                Schedule a personalized demo →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Buyer's Guide Download Section */}
      <section id="buyers-guide" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Download Free Buyer's Guide</h2>
            <p className="text-lg mb-6 opacity-90">
              Get our comprehensive 25-page guide: "How to Choose the Best Online Inventory Software in 2025"
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">What's Inside:</h3>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>✓ Feature comparison checklist</li>
                  <li>✓ Pricing comparison guide</li>
                  <li>✓ Implementation timeline template</li>
                  <li>✓ ROI calculation worksheet</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">You'll Learn:</h3>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>✓ How to evaluate online inventory software</li>
                  <li>✓ Questions to ask vendors</li>
                  <li>✓ Red flags to avoid</li>
                  <li>✓ Cloud implementation best practices</li>
                </ul>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Download Free Guide
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="text-sm mt-4 opacity-75">No credit card required. Instant download.</p>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqData.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
              }
            }))
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': 'https://www.stockflow.be/online-inventory-software',
            name: 'Online Inventory Software',
            headline: 'Online Inventory Software',
            description:
              'Compare leading online inventory software, review pricing and features, and start StockFlow’s free plan to automate multi-channel stock control.',
            url: 'https://www.stockflow.be/online-inventory-software',
            inLanguage: 'en',
            isPartOf: {
              '@type': 'WebSite',
              name: 'StockFlow',
              url: 'https://www.stockflow.be'
            },
            datePublished: pageMetadata.published,
            dateModified: pageMetadata.updated,
            potentialAction: {
              '@type': 'ReadAction',
              target: 'https://www.stockflow.be/online-inventory-software'
            },
            primaryImageOfPage: {
              '@type': 'ImageObject',
              url: 'https://www.stockflow.be/Inventory-Management.png'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://www.stockflow.be'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Online Inventory Software',
                  item: 'https://www.stockflow.be/online-inventory-software'
                }
              ]
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'StockFlow Online Inventory Software',
            description:
              'StockFlow provides real-time inventory automation, barcode scanning, multi-location control, and a free plan for up to 100 SKUs with pay-as-you-grow pricing.',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Inventory Management Software',
            operatingSystem: 'Web Browser',
            offers: [
              {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
                description: 'Free plan - Up to 100 products',
                availability: 'https://schema.org/InStock',
                priceValidUntil: '2026-12-31'
              },
              {
                '@type': 'Offer',
                price: '0.004',
                priceCurrency: 'EUR',
                description: 'Growth plan - Pay-as-you-grow pricing, €0.004 per product/month (products 101+)',
                availability: 'https://schema.org/InStock',
                priceValidUntil: '2026-12-31'
              },
              {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
                description: 'Enterprise plan - Custom pricing for high-volume businesses (10,000+ products)',
                availability: 'https://schema.org/InStock',
                priceValidUntil: '2026-12-31'
              }
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '326',
              bestRating: '5',
              worstRating: '1'
            },
            author: {
              '@type': 'Organization',
              name: 'StockFlow',
              url: 'https://www.stockflow.be'
            },
            publisher: {
              '@type': 'Organization',
              name: 'StockFlow',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.stockflow.be/logo.png'
              }
            },
            image: 'https://www.stockflow.be/Inventory-Management.png',
            screenshot: 'https://www.stockflow.be/Inventory-Management.png',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.stockflow.be/online-inventory-software'
            },
            award: ['Best Inventory Software 2024', 'Top Rated by Users', 'Best Value for Money', 'Easiest to Use'],
            featureList: [
              'Implementation in under seven days',
              'Real-time inventory tracking and automation',
              'Advanced barcode scanning on iOS and Android',
              'Multi-location and multichannel synchronization',
              'Workflow builder with automated reorder points',
              'Enterprise-grade security and access controls'
            ],
            downloadUrl: 'https://www.stockflow.be/auth',
            softwareHelp: {
              '@type': 'CreativeWork',
              url: 'https://www.stockflow.be/contact'
            }
          },
          ...testimonials.map((testimonial) => ({
            '@context': 'https://schema.org',
            '@type': 'Review',
            itemReviewed: {
              '@type': 'SoftwareApplication',
              name: 'StockFlow'
            },
            author: {
              '@type': 'Person',
              name: testimonial.name
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: testimonial.rating.toString(),
              bestRating: '5',
              worstRating: '1'
            },
            reviewBody: testimonial.content
          }))
        ]}
      />
    </SeoPageLayout>
  );
}