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
  ArrowRight,
  Target,
  Search
} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@/components/ui/accordion';
export default function BestInventoryManagementSoftware() {
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
  
  const faqData = [
    {
      question: "What is inventory management software?",
      answer: "Inventory management software is a digital solution that helps businesses track, manage, and optimize their stock levels across multiple locations and sales channels. It provides real-time visibility into inventory levels, automates reorder processes, prevents stockouts, and integrates with ecommerce platforms, accounting systems, and point-of-sale systems. Modern inventory management systems like StockFlow offer barcode scanning, demand forecasting, multi-location support, and automated workflows to streamline operations.",
      ctaLabel: "Learn more about StockFlow",
      ctaHref: "#features"
    },
    {
      question: "What is an inventory management system?",
      answer: "An inventory management system is a comprehensive platform that combines software, hardware (like barcode scanners), and processes to track inventory from procurement to sale. Unlike basic inventory tracking, a full inventory management system includes features like automated reorder points, multi-location tracking, serial and batch number management, integration with accounting and ecommerce platforms, and advanced reporting. StockFlow provides a complete inventory management system that scales from small businesses to enterprises.",
      ctaLabel: "See StockFlow features",
      ctaHref: "#features"
    },
    {
      question: "What is the best inventory management software for small businesses in 2025?",
      answer: "For growing SMBs, StockFlow ranks highest thanks to built-in automation, barcode scanning, and transparent, pay-as-you-grow pricing. Larger enterprises may prefer NetSuite or Microsoft Dynamics 365 for their ERP depth, while Cin7 remains strong for omnichannel retailers.",
      ctaLabel: "See the comparison table",
      ctaHref: "#comparison"
    },
    {
      question: "What is the best inventory management software for small business?",
      answer: "Small businesses should prioritize inventory management software that offers a free or low-cost entry point, easy setup, and scales as they grow. StockFlow's free plan supports up to 100 SKUs with full features, making it ideal for small businesses. Other options include Zoho Inventory and inFlow, but StockFlow stands out with its 5-7 day implementation, 24/7 support, and no hidden fees. The best inventory management software for small business balances affordability with essential features like barcode scanning, multi-channel sync, and automated reordering.",
      ctaLabel: "Start free plan",
      ctaHref: "/auth"
    },
    {
      question: "How to compare inventory management software?",
      answer: "When comparing inventory management software, evaluate these key factors: (1) Implementation time and cost - StockFlow goes live in 5-7 days vs. 45-90 days for enterprise solutions, (2) Pricing transparency - look for free plans or pay-as-you-grow models vs. fixed monthly fees, (3) Feature set - ensure real-time tracking, barcode scanning, multi-location support, and integrations are included, (4) Support quality - 24/7 support vs. business hours only, (5) Scalability - can it grow with your business without expensive migrations? Use our comparison table to see how StockFlow stacks up against NetSuite, Cin7, Zoho, and others.",
      ctaLabel: "View comparison table",
      ctaHref: "#comparison"
    },
    {
      question: "What is the best inventory software for ecommerce?",
      answer: "The best inventory software for ecommerce must sync inventory across multiple sales channels (Shopify, Amazon, WooCommerce), prevent overselling, automate order fulfillment, and provide real-time stock updates. StockFlow excels for ecommerce with native integrations to 45+ platforms, automated multi-channel synchronization, and real-time inventory tracking. Other strong options include Cin7 for omnichannel retailers and Zoho Inventory for smaller ecommerce stores, but StockFlow offers the fastest implementation and most transparent pricing.",
      ctaLabel: "See ecommerce integrations",
      ctaHref: "#integrations"
    },
    {
      question: "How much does inventory management software cost?",
      answer: "Inventory management software pricing varies widely. Free plans (like StockFlow's up to 100 SKUs) are available for small businesses. Paid plans typically range from €14-€300/month for SMBs, while enterprise solutions like NetSuite cost €999+/month plus implementation fees. StockFlow uses transparent pay-as-you-grow pricing starting at €0.004 per SKU/month after the free tier, with no setup fees. Most competitors charge €29-€300/month plus €500-€10,000+ in implementation costs. Year 1 total cost for StockFlow averages €0-€1,200 vs. €1,200-€15,000+ for competitors.",
      ctaLabel: "View pricing plans",
      ctaHref: "#pricing"
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
      question: "What features should inventory management solutions include?",
      answer: "Essential inventory management solutions should include: real-time inventory tracking across all locations, barcode and QR code scanning (mobile and desktop), automated reorder points and low stock alerts, multi-location and multi-warehouse support, integration with ecommerce platforms (Shopify, Amazon, WooCommerce), accounting software integration (QuickBooks, Xero), purchase order management, serial and batch tracking, demand forecasting and analytics, role-based user permissions, mobile apps for iOS and Android, and API access for custom integrations. StockFlow includes all these features in every plan.",
      ctaLabel: "See all features",
      ctaHref: "#features"
    },
    {
      question: "How does online inventory management software work?",
      answer: "Online inventory management software operates in the cloud, allowing you to access your inventory data from any device with an internet connection. The software syncs inventory levels in real-time across all locations, sales channels, and devices. When a sale occurs on Shopify or Amazon, the inventory management system automatically updates stock levels. Barcode scanning via mobile apps updates inventory instantly, and automated reorder points trigger alerts when stock runs low. All data is stored securely in the cloud with daily backups, and integrations keep your inventory, orders, and financials synchronized across platforms.",
      ctaLabel: "See how StockFlow works",
      ctaHref: "#quick-wins"
    },
    {
      question: "What is the best stock management software?",
      answer: "The best stock management software depends on your business size and needs. For small to medium businesses, StockFlow ranks highest with its free plan, 5-7 day implementation, and transparent pricing. For larger enterprises, NetSuite offers comprehensive ERP capabilities but requires 90-180 day implementations. Cin7 excels for omnichannel retailers, while Zoho Inventory suits smaller operations. StockFlow stands out for its combination of features, affordability, fast setup, and 24/7 support. Use our comparison table to evaluate features, pricing, and implementation timelines.",
      ctaLabel: "Compare stock management software",
      ctaHref: "#comparison"
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
      ctaHref: "#integrations"
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
      visma: "45+ days consultant led",
      netsuite: "90–180 days (enterprise)",
      zoho: "30–60 days",
      cin7: "45–90 days"
    },
    {
      feature: "Total cost (year 1)",
      stockflow: "€0–€1.2k (avg SMB)",
      exact: "€6k+ license & setup",
      visma: "€8k+ license & setup",
      netsuite: "€15k+ license & setup",
      zoho: "€1.2k–€3.6k",
      cin7: "€3.6k–€7.2k"
    },
    {
      feature: "Automation coverage",
      stockflow: "Reorder & workflows included",
      exact: "Add-ons required",
      visma: "Premium tier (€450+/mo)",
      netsuite: "Advanced modules (€500+/mo)",
      zoho: "Limited automation",
      cin7: "Workflows included"
    },
    {
      feature: "Mobile access",
      stockflow: "iOS & Android free",
      exact: "€50+/user/mo add-on",
      visma: "Warehouse app only",
      netsuite: "Mobile app included",
      zoho: "Mobile app included",
      cin7: "Mobile app included"
    },
    {
      feature: "Support availability",
      stockflow: "24/7 chat + phone",
      exact: "Business hours/email",
      visma: "Email ticketing",
      netsuite: "24/7 (premium tier)",
      zoho: "Business hours",
      cin7: "Business hours + chat"
    },
    {
      feature: "Customer NPS (G2 · Q4 2025)",
      stockflow: "74",
      exact: "42",
      visma: "39",
      netsuite: "58",
      zoho: "65",
      cin7: "52"
    },
    {
      feature: "Free trial / plan",
      stockflow: "Yes · up to 100 SKUs",
      exact: "No",
      visma: "No",
      netsuite: "No",
      zoho: "14-day trial",
      cin7: "14-day trial"
    },
    {
      feature: "Integration library",
      stockflow: "45+ native connectors",
      exact: "18 integrations",
      visma: "25 integrations",
      netsuite: "1000+ integrations",
      zoho: "40+ integrations",
      cin7: "200+ integrations"
    },
    {
      feature: "Barcode scanning",
      stockflow: "Free mobile app",
      exact: "Add-on required",
      visma: "Premium feature",
      netsuite: "Included",
      zoho: "Basic included",
      cin7: "Included"
    },
    {
      feature: "Multi-location support",
      stockflow: "Unlimited locations",
      exact: "Add-on required",
      visma: "Premium tier",
      netsuite: "Included",
      zoho: "Limited locations",
      cin7: "Included"
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
    { id: 'faq', title: 'FAQ', level: 1 },
    { id: 'how-to-choose', title: 'How to Choose Inventory Management Software', level: 1 },
    { id: 'quick-wins', title: 'Why Businesses Choose StockFlow', level: 1 },
    { id: 'benefits', title: 'Benefits', level: 1 },
    { id: 'features', title: 'Features', level: 1 },
    { id: 'use-cases', title: 'Industry-Specific Solutions', level: 1 },
    { id: 'implementation', title: 'Implementation & Onboarding', level: 1 },
    { id: 'roi', title: 'ROI & Cost Savings', level: 1 },
    { id: 'security', title: 'Security & Compliance', level: 1 },
    { id: 'integrations', title: 'Integrations', level: 1 },
    { id: 'comparison', title: 'StockFlow vs Competitors', level: 1 },
    { id: 'pricing', title: 'Choose Your Plan', level: 1 },
    { id: 'testimonials', title: 'What Our Customers Say', level: 1 }
  ]);

  return (
    <SeoPageLayout 
      title="Best Inventory Management Software"
      showSidebar={true}
      sidebarContent={sidebarContent}
    >
      <SEO
        title="Inventory Management Software | Top 10 Comparison & Free Demo"
        description="Compare the best inventory management software 2025. Free plan, 5-day setup, real-time tracking, barcode scanning. See pricing and start free trial. Find the best inventory management system, stock management software, and inventory solutions for your business."
        keywords="best inventory management software, inventory management software, inventory management system, inventory management solutions, stock management software, inventory software, inventory system, inventory management tools, inventory control software, inventory tracking software, how to choose inventory management software, compare inventory management software, best inventory software for ecommerce, inventory management software price, inventory management software small business, best stock management software, online inventory management software"
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
              Updated: {pageMetadata.updatedDisplay} · Research-backed comparison
            </span>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-lg text-gray-600 md:text-xl">
              Searching for the best inventory management software, inventory management system, or stock management software in 2025? This expert guide compares leading inventory management solutions, spotlights must-have features, and shows how StockFlow reduces carrying costs with real-time automation and transparent pricing. Whether you're evaluating inventory software, inventory systems, or inventory management tools, this comprehensive comparison helps you find the right solution.
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
              
              <div className="mt-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-gray-700 leading-relaxed mb-4">
                  This comprehensive comparison of the best inventory management software and inventory management systems is based on real customer data, implementation timelines from 500+ businesses, and detailed feature analysis of leading inventory management solutions including StockFlow, NetSuite, Cin7, Microsoft Dynamics 365, and inFlow. We've evaluated each inventory software platform across key criteria: ease of implementation, total cost of ownership, automation capabilities, mobile access, customer support quality, and integration flexibility.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Whether you're a small business looking for inventory management software that scales, an ecommerce retailer managing multi-channel sales, or a manufacturing company needing BOM (Bill of Materials) tracking, this guide helps you identify the best inventory management system for your specific industry and business size. We've included real ROI calculations, implementation timelines, and feature comparisons to make your decision process faster and more informed when choosing between inventory management solutions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our analysis covers free inventory management software options, pay-as-you-grow pricing models, enterprise inventory systems, and everything in between. Each stock management software platform has been evaluated for its strengths in inventory tracking accuracy, barcode scanning capabilities, automated reorder points, multi-location support, reporting and analytics, and API integration options. By the end of this guide, you'll know exactly which inventory software features matter most for your business and how to compare inventory management tools effectively.
                </p>
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
              See StockFlow in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Watch how the best inventory management software and inventory management systems help businesses automate stock control, prevent stockouts, and reduce costs. See how modern inventory management solutions streamline operations.
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
              Get our comprehensive 25-page guide: "How to Choose the Best Inventory Management Software in 2025"
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
                  <li>✓ How to evaluate inventory software</li>
                  <li>✓ Questions to ask vendors</li>
                  <li>✓ Red flags to avoid</li>
                  <li>✓ Implementation best practices</li>
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

      {/* How to Choose Section */}
      <section id="how-to-choose" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How to Choose Inventory Management Software
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A step-by-step guide to selecting the right inventory management system for your business needs, budget, and growth plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Step 1: Assess Your Business Needs</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Start by evaluating your current inventory challenges and future growth plans. Consider:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Business size:</strong> Number of SKUs, locations, and team members</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Sales channels:</strong> Do you sell on Shopify, Amazon, in-store, or multiple channels?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Industry requirements:</strong> Do you need BOM tracking, expiry dates, or serial numbers?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Growth plans:</strong> Will you expand to new locations or channels in the next 2 years?</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Step 2: Define Essential Features</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Create a checklist of must-have features for your inventory management solution:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Real-time tracking:</strong> Instant visibility across all locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Barcode scanning:</strong> Mobile app for warehouse and retail floor</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multi-channel sync:</strong> Automatic updates across Shopify, Amazon, POS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Automated reordering:</strong> Smart alerts and purchase order generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Integrations:</strong> Connect with accounting, shipping, and ecommerce tools</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Step 3: Evaluate Pricing & Total Cost</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Look beyond monthly fees to understand the true cost of ownership:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Setup costs:</strong> Implementation fees, data migration, training</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Monthly fees:</strong> Base subscription plus per-user or per-SKU charges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Add-on costs:</strong> Premium features, integrations, or support tiers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Scalability:</strong> Will pricing increase dramatically as you grow?</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> StockFlow offers a free plan for up to 100 SKUs with transparent pay-as-you-grow pricing, eliminating surprise costs as your business scales.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Step 4: Consider Implementation Time</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Fast implementation means faster ROI. Compare timelines:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>StockFlow:</strong> 5-7 days with guided onboarding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Zoho Inventory:</strong> 30-60 days with setup assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Cin7:</strong> 45-90 days with consultant support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>NetSuite:</strong> 90-180 days for enterprise implementations</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Quick win:</strong> Faster implementation means you start seeing ROI sooner. StockFlow's 5-7 day setup includes data migration, integration setup, and team training at no extra cost.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Step 5: Test Support Quality</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Reliable support is crucial when issues arise. Evaluate:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Availability:</strong> 24/7 support vs. business hours only</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Response time:</strong> Average time to first response</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Support channels:</strong> Chat, phone, email, or ticket system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Onboarding assistance:</strong> Dedicated success manager or self-service</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Step 6: Verify Security & Compliance</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ensure your inventory data is protected with enterprise-grade security:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Data encryption:</strong> SSL/TLS in transit, AES-256 at rest</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Compliance:</strong> GDPR, SOC 2 Type II, ISO 27001 certifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Backups:</strong> Daily automated backups with point-in-time recovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Access controls:</strong> Role-based permissions, 2FA, SSO support</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Choose Your Inventory Management Software?</h3>
            <p className="text-lg mb-6 opacity-90">
              Use our comparison table to see how StockFlow stacks up against competitors, or start your free trial to experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#comparison"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Compare Software Options
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
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
              Real results from real businesses using the best inventory management software, inventory management systems, and stock management software solutions.
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
              See how the right inventory management software, inventory management system, or inventory management solution improves profitability, accuracy, and team productivity from day one.
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

      {/* Industry-Specific Use Cases Section */}
      <section id="use-cases" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Industry-Specific Inventory Management Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Different industries have unique inventory challenges. See how the best inventory management software, inventory management systems, and stock management software adapt to your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-3">E-commerce</h3>
              <p className="text-gray-600 mb-4">
                Multi-channel inventory sync prevents overselling across Shopify, Amazon, and WooCommerce. Real-time stock updates, automated fulfillment workflows, and seasonal demand forecasting keep your online store running smoothly.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Multi-channel synchronization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automated order processing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Prevent overselling</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold mb-3">Retail</h3>
              <p className="text-gray-600 mb-4">
                Point-of-sale integration, multi-location inventory tracking, and real-time stock visibility across stores. Barcode scanning and mobile access enable efficient stock management for retail chains.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>POS system integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Multi-location support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>In-store barcode scanning</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="text-xl font-semibold mb-3">Manufacturing</h3>
              <p className="text-gray-600 mb-4">
                Bill of Materials (BOM) management, work-in-progress tracking, and raw material inventory control. Serial and batch tracking ensure compliance and traceability throughout the production process.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>BOM management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Serial & batch tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Production planning</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-3">Wholesale & Distribution</h3>
              <p className="text-gray-600 mb-4">
                High-volume inventory management with advanced forecasting, automated purchase orders, and multi-warehouse coordination. Handle large SKU counts and complex distribution networks efficiently.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>High-volume processing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automated purchase orders</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Multi-warehouse management</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold mb-3">Healthcare</h3>
              <p className="text-gray-600 mb-4">
                Expiry date tracking, lot traceability, and compliance management for medical supplies and pharmaceuticals. Maintain strict inventory control for regulatory compliance.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Expiry date management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Lot traceability</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Regulatory compliance</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-3">Food & Beverage</h3>
              <p className="text-gray-600 mb-4">
                Perishable inventory tracking with expiry alerts, recipe costing, and kitchen integration. Manage food inventory efficiently to reduce waste and control costs.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Expiry date alerts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Recipe costing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Waste reduction tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation & Onboarding Section */}
      <section id="implementation" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Fast Implementation & Guided Onboarding
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unlike enterprise solutions that take months to implement, the best inventory management software and inventory management systems should be up and running quickly. Here's what to expect with StockFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Implementation Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Day 1-2: Account Setup</h4>
                    <p className="text-sm text-gray-600">Your dedicated success manager creates your account, imports initial inventory data, and configures basic settings.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Day 3-4: Integration Setup</h4>
                    <p className="text-sm text-gray-600">Connect your sales channels (Shopify, Amazon, POS systems), accounting software, and other business tools.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Day 5-6: Workflow Configuration</h4>
                    <p className="text-sm text-gray-600">Set up automated reorder points, low stock alerts, and custom workflows tailored to your business processes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                  <div>
                    <h4 className="font-semibold mb-1">Day 7: Go Live</h4>
                    <p className="text-sm text-gray-600">Team training session and you're ready to start managing inventory with real-time accuracy.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">What's Included in Onboarding</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Data Migration</h4>
                    <p className="text-sm text-gray-600">Free migration of your existing inventory data from spreadsheets, legacy systems, or other software.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Integration Setup</h4>
                    <p className="text-sm text-gray-600">Expert assistance connecting all your business tools and sales channels for seamless data flow.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Team Training</h4>
                    <p className="text-sm text-gray-600">Comprehensive training sessions for your team, including mobile app usage and best practices.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">24/7 Support</h4>
                    <p className="text-sm text-gray-600">Ongoing support via chat, phone, and email to answer questions and optimize your setup.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Success Manager</h4>
                    <p className="text-sm text-gray-600">Dedicated point of contact to ensure you achieve ROI within the first month.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-6 opacity-90">
              Most teams are fully operational within 5-7 days. No consultants, no lengthy implementations, just fast results.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Examples Section */}
      <section id="roi" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Proven ROI: Real Cost Savings & Time Efficiency
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The best inventory management software, inventory management systems, and inventory management solutions deliver measurable returns. Here's how businesses calculate ROI and achieve cost savings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="text-4xl font-bold text-green-600 mb-2">35%</div>
              <h3 className="text-xl font-semibold mb-3">Reduced Carrying Costs</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Real-time visibility and demand forecasting help reduce excess inventory. Average businesses free up 35% of capital tied in stock.
              </p>
              <div className="text-sm text-gray-500">
                <strong>Example:</strong> A business with €100,000 in inventory saves €35,000 annually by optimizing stock levels.
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="text-4xl font-bold text-blue-600 mb-2">15h</div>
              <h3 className="text-xl font-semibold mb-3">Hours Saved Per Week</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Automated processes eliminate manual counting, data entry, and reconciliation tasks. Teams save 15+ hours weekly on inventory admin.
              </p>
              <div className="text-sm text-gray-500">
                <strong>Example:</strong> At €25/hour, that's €375/week or €19,500/year in time savings per employee.
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <h3 className="text-xl font-semibold mb-3">Inventory Accuracy</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Barcode scanning and automated tracking maintain 99.9% accuracy, eliminating costly discrepancies and stockouts.
              </p>
              <div className="text-sm text-gray-500">
                <strong>Example:</strong> Reduce stockout incidents by 38%, preventing lost sales and customer dissatisfaction.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">ROI Calculation Example</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 text-gray-900">Annual Costs Without Software</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Excess inventory carrying costs</span>
                    <span className="font-semibold">€35,000</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Manual labor (15h/week × €25/h × 52)</span>
                    <span className="font-semibold">€19,500</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Stockout losses (estimated)</span>
                    <span className="font-semibold">€12,000</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Inventory discrepancies</span>
                    <span className="font-semibold">€8,000</span>
                  </li>
                  <li className="flex justify-between pt-2">
                    <span className="font-bold text-gray-900">Total Annual Cost</span>
                    <span className="font-bold text-red-600">€74,500</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-900">Annual Costs With StockFlow</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">StockFlow subscription (Advanced plan)</span>
                    <span className="font-semibold">€348</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Reduced carrying costs (35% savings)</span>
                    <span className="font-semibold text-green-600">-€35,000</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Time savings (automated processes)</span>
                    <span className="font-semibold text-green-600">-€19,500</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Reduced stockout losses</span>
                    <span className="font-semibold text-green-600">-€9,600</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Eliminated discrepancies</span>
                    <span className="font-semibold text-green-600">-€6,400</span>
                  </li>
                  <li className="flex justify-between pt-2">
                    <span className="font-bold text-gray-900">Net Annual Savings</span>
                    <span className="font-bold text-green-600">€60,052</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
              <p className="text-lg font-semibold text-gray-900">
                ROI: <span className="text-green-600">17,260%</span> in the first year
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Payback period: Less than 1 week
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Calculate Your ROI
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Interactive ROI Calculator */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Interactive ROI Calculator</h3>
            <p className="text-center text-gray-600 mb-8">Enter your numbers to see potential savings with StockFlow</p>
            <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-md">
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
                    const softwareCost = 174; // Annual cost for Advanced plan
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

      {/* Security & Compliance Section */}
      <section id="security" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The best inventory management software, inventory management systems, and inventory management solutions protect your data with bank-level security, compliance certifications, and robust encryption.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Data Encryption</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>SSL/TLS encryption</strong> for all data in transit (256-bit)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>AES-256 encryption</strong> for data at rest in secure data centers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Encrypted backups</strong> stored in geographically distributed locations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Secure API connections</strong> with OAuth 2.0 authentication</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <ShieldCheck className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Compliance & Certifications</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>GDPR compliant</strong> - Full compliance with EU General Data Protection Regulation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>SOC 2 Type II</strong> - Annual security audits and compliance verification</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>ISO 27001</strong> - Information security management system certified</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Regular penetration testing</strong> by independent security firms</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold mb-3">Access Controls</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Role-based permissions</li>
                <li>• Two-factor authentication (2FA)</li>
                <li>• Single Sign-On (SSO) support</li>
                <li>• IP whitelisting</li>
                <li>• Session management</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold mb-3">Data Protection</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Daily automated backups</li>
                <li>• Point-in-time recovery</li>
                <li>• Data retention policies</li>
                <li>• Audit trails & logging</li>
                <li>• Data export capabilities</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold mb-3">Infrastructure</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 99.9% uptime SLA</li>
                <li>• Redundant data centers</li>
                <li>• DDoS protection</li>
                <li>• Firewall & intrusion detection</li>
                <li>• 24/7 security monitoring</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-gray-900 text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Your Data is Protected</h3>
            <p className="text-lg mb-6 opacity-90">
              StockFlow uses the same security standards as major financial institutions. Your inventory data is encrypted, backed up, and protected around the clock.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center text-blue-300 hover:text-white font-semibold"
            >
              Learn more about our security practices →
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Deep Dive Section */}
      <section id="integrations" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Seamless Integrations: Connect Your Entire Business Ecosystem
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The best inventory management software, inventory management systems, and inventory management solutions integrate with 45+ platforms to keep your inventory, orders, and financials in perfect sync.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🛒</span>
                E-commerce Platforms
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Shopify</strong> - Real-time inventory sync, order import, product updates
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>WooCommerce</strong> - WordPress store integration with automatic stock updates
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Amazon</strong> - Multi-marketplace inventory management and FBA sync
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>BigCommerce</strong> - Native integration for enterprise e-commerce
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Magento</strong> - Full inventory synchronization for Magento stores
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">💰</span>
                Accounting Software
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>QuickBooks Online</strong> - Automatic invoice sync, COGS tracking, financial reporting
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Xero</strong> - Real-time inventory value updates and purchase order sync
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Sage</strong> - Complete integration for Sage accounting users
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>FreshBooks</strong> - Seamless invoicing and expense tracking
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>NetSuite</strong> - Enterprise ERP integration for large businesses
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">📦</span>
                Fulfillment & Shipping
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>ShipStation</strong> - Automated shipping label creation and tracking
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Shippo</strong> - Multi-carrier shipping integration
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>FedEx & UPS</strong> - Direct carrier integrations for shipping
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>DHL</strong> - International shipping integration
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>3PL Providers</strong> - Connect with third-party logistics partners
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Complete Integration Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Platforms</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Key Benefits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">E-commerce</td>
                    <td className="px-4 py-3 text-gray-600">Shopify, WooCommerce, Amazon, BigCommerce, Magento, eBay, Etsy</td>
                    <td className="px-4 py-3 text-gray-600">Prevent overselling, real-time stock sync, automated order processing</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Accounting</td>
                    <td className="px-4 py-3 text-gray-600">QuickBooks, Xero, Sage, FreshBooks, NetSuite, MYOB</td>
                    <td className="px-4 py-3 text-gray-600">Automatic COGS tracking, invoice sync, financial reporting</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">POS Systems</td>
                    <td className="px-4 py-3 text-gray-600">Square, Lightspeed, Clover, Toast, Revel, Vend</td>
                    <td className="px-4 py-3 text-gray-600">Unified inventory across online and in-store, real-time updates</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Shipping</td>
                    <td className="px-4 py-3 text-gray-600">ShipStation, Shippo, FedEx, UPS, DHL, USPS</td>
                    <td className="px-4 py-3 text-gray-600">Automated label creation, tracking updates, rate comparison</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Warehouse</td>
                    <td className="px-4 py-3 text-gray-600">WMS systems, barcode scanners, RFID readers</td>
                    <td className="px-4 py-3 text-gray-600">Real-time warehouse inventory, pick/pack workflows</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">API & Custom</td>
                    <td className="px-4 py-3 text-gray-600">REST API, Webhooks, Zapier, Make (Integromat)</td>
                    <td className="px-4 py-3 text-gray-600">Build custom integrations, automate workflows, connect any system</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need a Custom Integration?</h3>
            <p className="text-lg text-gray-700 mb-6">
              Our REST API and webhook system make it easy to connect StockFlow with any business tool. Enterprise customers get dedicated integration support.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Request Integration Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
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
              See how StockFlow compares to other inventory management software, inventory management systems, stock management software, and inventory management solutions. Compare features, pricing, implementation time, and customer satisfaction across leading inventory software platforms.
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
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
              Pricing, implementation, and satisfaction scores sourced from public vendor price sheets and G2 reviews (Q4 2025).
            </p>
          </div>

          {/* Pricing Comparison Table */}
          <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Pricing Comparison: Inventory Management Software</h3>
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
              <p className="text-sm text-gray-600 mt-2">Quick visual comparison of key features across leading inventory management systems</p>
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
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">Automated reorder points</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
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
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">Accounting integration</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">Free plan available</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">Mobile app (iOS/Android)</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">24/7 support</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">Premium only</span></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-4 py-3 text-center"><span className="text-gray-400">—</span></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-900 font-medium sticky left-0 bg-inherit z-10">API access</td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
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
              Real feedback from businesses using the best inventory management software, inventory management systems, and inventory management solutions.
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
          "description": "Compare the best inventory management software, inventory management systems, stock management software, and inventory management solutions. Review pricing, features, and implementation timelines. Learn how to choose inventory management software and start StockFlow's free plan to automate stock control today.",
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


