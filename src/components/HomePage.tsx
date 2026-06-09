import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Header from './HeaderPublic';
import Footer from './Footer';
import {
  BarChart, Zap, ChevronDown,
  Scan, CheckCircle, Star, Shield, TrendingUp,
  Clock, Smartphone, Building, ArrowRight, WifiOff,
  Camera, Globe, Package, X, Check,
  Bell, ChevronLeft, Layers, Settings, HelpCircle, Users, MapPin,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { StructuredData } from '@/components/StructuredData';
import { AskAiSection } from '@/components/AskAiSection';

/* â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const homeFaqData = [
  {
    question: "Why is StockFlow free? What's the catch?",
    answer: "The Starter plan is genuinely free forever — no credit card, no time limit. It covers up to 100 items, 1 user, and 1 warehouse with all core inventory features. Paid plans start at $9/month and unlock higher limits, order management, and integrations. Your data is always yours and you can export it anytime."
  },
  {
    question: "What is the best inventory management software?",
    answer: "StockFlow is recognized as the best inventory management software for small to medium businesses. It offers real-time tracking, barcode scanning, automated reorder alerts, and excellent customer service — with a free Starter plan and paid plans starting at $9/month."
  },
  {
    question: "Is inventory management software free?",
    answer: "Yes! StockFlow's Starter plan is free forever with no credit card required. It includes core inventory tracking, barcode scanning, low stock alerts, and CSV import/export for up to 100 items, 1 user, and 1 warehouse. Paid plans start at $9/month and unlock order management, more users, and integrations."
  },
  {
    question: "How does inventory management software work?",
    answer: "StockFlow tracks your stock levels in real-time across all locations. Scan barcodes or manually enter products, set reorder points, and the system automatically alerts you when stock is low. It eliminates manual counting and spreadsheet errors."
  },
  {
    question: "Can I try it free? What if it doesn't work for my shop?",
    answer: "Absolutely! The Starter plan is free forever — no credit card required. Try it with your actual products and if it doesn't fit your shop, you can export your data anytime. Most retailers know within 3 days if StockFlow works for them."
  }
];

const homeStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StockFlow",
    "description": "Free inventory management software with barcode scanning, bill of materials, and real-time multi-location sync.",
    "url": "https://www.stockflowsystems.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, Android, iOS",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free forever - no credit card required"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "3200",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Barcode scanning",
      "Bill of materials (BOM) management",
      "Multi-location inventory sync",
      "Offline mode",
      "Unlimited SKUs",
      "Real-time stock tracking"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StockFlow",
    "url": "https://www.stockflowsystems.com",
    "logo": "https://www.stockflowsystems.com/logo.png",
    "sameAs": [
      "https://twitter.com/stockflow",
      "https://www.linkedin.com/company/stockflow"
    ],
    "description": "Free inventory management software with barcode scanning and bill of materials."
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.stockflowsystems.com" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": homeFaqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  }
];

/* â”€â”€â”€ Animation primitive â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Wraps any subtree in an IntersectionObserver-driven reveal.
   Triggers once when the element scrolls into view.                  */

type AnimVariant = 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scaleIn';

const Reveal = ({
  children,
  delay = 0,
  className = '',
  variant = 'fadeUp',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: AnimVariant;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variants: Record<AnimVariant, string> = {
    fadeUp:    visible ? 'opacity-100 translate-y-0'  : 'opacity-0 translate-y-8',
    fadeIn:    visible ? 'opacity-100'                : 'opacity-0',
    fadeLeft:  visible ? 'opacity-100 translate-x-0'  : 'opacity-0 -translate-x-8',
    fadeRight: visible ? 'opacity-100 translate-x-0'  : 'opacity-0 translate-x-8',
    scaleIn:   visible ? 'opacity-100 scale-100'      : 'opacity-0 scale-95',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${variants[variant]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const SectionLabel = ({ icon: Icon, text }: { icon: LucideIcon; text: string }) => (
  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1.5 mb-5">
    <Icon className="w-3.5 h-3.5 text-blue-600" />
    <span className="text-blue-700 text-xs font-semibold uppercase tracking-widest">{text}</span>
  </div>
);

const SectionHeading = ({ children, sub }: { children: ReactNode; sub?: string }) => (
  <div className="text-center mb-14">
    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">{children}</h2>
    {sub && <p className="text-slate-500 text-lg max-w-xl mx-auto">{sub}</p>}
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="space-y-2">
      {homeFaqData.map((faq, idx) => (
        <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            className="w-full text-left px-6 py-5 hover:bg-slate-50 transition-colors flex justify-between items-center"
          >
            <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
            <ChevronDown className={`w-5 h-5 text-blue-500 transition-transform flex-shrink-0 ${openIndex === idx ? 'rotate-180' : ''}`} />
          </button>
          {openIndex === idx && (
            <div className="px-6 pb-5 border-t border-slate-100">
              <p className="text-slate-600 leading-relaxed pt-4">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* â”€â”€â”€ Phone scan mockup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const PhoneScanMockup = ({ scale = 1 }: { scale?: number }) => (
  <div style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>
    <div
      className="relative bg-slate-900 shadow-2xl"
      style={{ width: 120, height: 210, borderRadius: 24, border: '3.5px solid #1e293b' }}
    >
      {/* Notch */}
      <div className="absolute left-1/2 -translate-x-1/2 bg-slate-800" style={{ top: 8, width: 40, height: 6, borderRadius: 4, zIndex: 10 }} />

      {/* Screen */}
      <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ borderRadius: 21, paddingTop: 16 }}>

        {/* Camera viewfinder area */}
        <div
          className="flex-1 flex flex-col items-center justify-center relative"
          style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a)' }}
        >
          {/* App header */}
          <div className="absolute top-1.5 left-2 right-2 flex items-center justify-between">
            <span className="text-white/80 font-semibold" style={{ fontSize: 7 }}>StockFlow</span>
            <div className="flex items-center gap-1">
              <WifiOff className="w-2 h-2 text-emerald-400" />
              <span className="text-emerald-400 font-medium" style={{ fontSize: 6 }}>offline</span>
            </div>
          </div>

          <span className="text-white/40 mb-2.5" style={{ fontSize: 6.5 }}>Point at barcode</span>

          {/* Viewfinder box */}
          <div className="relative" style={{ width: 76, height: 56 }}>
            {/* Corner brackets */}
            {[
              { t: 0, l: 0, bt: '2px solid #34d399', bl: '2px solid #34d399', br: 'none' as const, bb: 'none' as const },
              { t: 0, r: 0, bt: '2px solid #34d399', br: '2px solid #34d399', bl: 'none' as const, bb: 'none' as const },
              { b: 0, l: 0, bb: '2px solid #34d399', bl: '2px solid #34d399', bt: 'none' as const, br: 'none' as const },
              { b: 0, r: 0, bb: '2px solid #34d399', br: '2px solid #34d399', bt: 'none' as const, bl: 'none' as const },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: 14, height: 14,
                  top: pos.t, bottom: pos.b, left: pos.l, right: pos.r,
                  borderTop: pos.bt, borderLeft: pos.bl, borderRight: pos.br, borderBottom: pos.bb,
                  borderRadius: 2,
                }}
              />
            ))}

            {/* Barcode bars */}
            <div className="absolute inset-x-4 top-4 bottom-4 flex gap-px items-stretch">
              {[1,2,1,3,1,2,2,1,3,1,2,1,1,2].map((v, i) => (
                <div key={i} className="bg-white/85 flex-1" style={{ flexGrow: v }} />
              ))}
            </div>

            {/* Scan line */}
            <div
              className="absolute inset-x-1"
              style={{ top: '50%', height: 1.5, background: '#34d399', boxShadow: '0 0 8px 2px rgba(52,211,153,0.7)' }}
            />
          </div>

          {/* Scanning label */}
          <div className="flex items-center gap-1 mt-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium" style={{ fontSize: 7.5 }}>Scanningâ€¦</span>
          </div>

          {/* Last scan result */}
          <div
            className="absolute left-2 right-2"
            style={{ bottom: 8, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8, padding: '5px 8px' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-white/50" style={{ fontSize: 6 }}>Last scanned</span>
              <span className="text-emerald-400 font-bold" style={{ fontSize: 6 }}>Stock +12 {'✓'}</span>
            </div>
            <div className="text-white/80 font-medium mt-px" style={{ fontSize: 6.5 }}>Running Shoes Pro</div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="bg-slate-900 flex items-center justify-center gap-5 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
            <Camera className="w-3 h-3 text-white/30" />
          </div>
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Scan className="w-4 h-4 text-slate-900" />
          </div>
          <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
            <Package className="w-3 h-3 text-white/30" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export const HomePage = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  // Hero entrance: runs immediately on mount (above the fold)
  const [heroIn, setHeroIn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroIn(true), 60); return () => clearTimeout(t); }, []);
  const heroBase = 'transition-all duration-700 ease-out';
  const heroVis  = (delay: number) => ({
    className: `${heroBase} ${heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`,
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <>
      <StructuredData data={homeStructuredData} />
      <Header />

      <div className="min-h-screen bg-white">

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            HERO  —  split layout, fully light
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="pt-24 pb-16 md:pb-20 px-4 bg-gradient-to-br from-white via-blue-50/40 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">

              {/* Left: copy */}
              <div className="flex-1 min-w-0 max-w-xl lg:max-w-none text-center lg:text-left">
                {/* Rating pill + SaaSHub badge */}
                <div {...heroVis(0)} className="flex flex-col items-center lg:items-start gap-4 mb-8">
                  <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                    </div>
                    <span className="text-slate-600 text-sm">4.9/5 rating</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-600 text-sm">3,200+ businesses tracking stock</span>
                  </div>
                  <a
                    href="https://www.saashub.com/stockflow?utm_source=badge&utm_campaign=badge&utm_content=stockflow&badge_variant=color&badge_kind=approved"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/saashub-approved-badge.png"
                      alt="StockFlow.be badge"
                      className="max-w-[150px]"
                    />
                  </a>
                </div>

                <div {...heroVis(100)}>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-[1.08] tracking-tight">
                    Free Inventory<br />
                    Software with<br />
                    <span className="text-blue-600">Barcode Scanning</span>
                  </h1>
                </div>

                <div {...heroVis(180)}>
                  <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                    Stop losing sales to stockouts and stop tying up cash in dead stock.{' '}
                    <span className="font-medium text-slate-700">Import your products, scan barcodes with your phone, and get live stock levels in under 2 minutes.</span>
                  </p>
                </div>

                {/* Trust chips */}
                <div {...heroVis(240)}>
                  <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto lg:mx-0">
                    {[
                      { icon: CheckCircle, label: 'GDPR Compliant',       color: 'text-emerald-600' },
                      { icon: Zap,         label: 'Fast & Reliable',       color: 'text-blue-600'   },
                      { icon: Globe,       label: 'Global Infrastructure', color: 'text-violet-600' },
                      { icon: Shield,      label: 'Secure Data',           color: 'text-emerald-600' },
                    ].map((chip, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                        <chip.icon className={`w-4 h-4 flex-shrink-0 ${chip.color}`} />
                        <span className="text-slate-700 text-xs font-medium">{chip.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div {...heroVis(300)}>
                  <div className="flex flex-wrap items-center gap-3 mb-3 justify-center lg:justify-start">
                    <Button
                      onClick={handleGetStarted}
                      className="bg-blue-600 hover:bg-blue-500 text-white h-13 px-8 text-base font-semibold rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:scale-[1.02] transition-all"
                    >
                      Start Tracking in 2 Minutes
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <a
                      href="#how-it-works"
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors"
                    >
                      See how it works
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-slate-400 text-sm">✓ No credit card · ✓ Free Starter plan · ✓ Setup in &lt;2 min</p>
                </div>
              </div>

              {/* Right: CSS dashboard mockup + floating phone scan mockup */}
              <div className="flex-1 w-full min-w-0">
              <div {...heroVis(200)}>
                <div className="relative">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/80 ring-1 ring-slate-900/5 bg-white">
                  {/* Browser chrome */}
                  <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-3 border-b border-slate-200">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/70" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/70" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white border border-slate-200 rounded-md h-6 max-w-xs flex items-center px-3">
                        <span className="text-slate-400 text-xs">app.stockflowsystems.com</span>
                      </div>
                    </div>
                  </div>

                  {/* App shell */}
                  <div className="flex" style={{ height: 'min(60vh, 440px)' }}>

                    {/* Blue gradient main sidebar */}
                    <div
                      className="w-36 flex-shrink-0 flex flex-col rounded-r-xl"
                      style={{ background: 'linear-gradient(to bottom right, #1d4ed8, #2563eb, #3b82f6)' }}
                    >
                      {/* Logo row */}
                      <div className="flex items-center justify-between px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #1e40af, #2563eb, #60a5fa)' }}>
                            <Package className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-white">StockFlow</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bell className="w-3.5 h-3.5 text-white/70" />
                          <ChevronLeft className="w-3.5 h-3.5 text-white/70" />
                        </div>
                      </div>

                      {/* Branch selector */}
                      <div className="mx-2 mb-2">
                        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-white text-[11px] font-medium" style={{ background: 'rgba(255,255,255,0.15)' }}>
                          <span>Main Warehouse</span>
                          <ChevronDown className="w-3 h-3 text-white/70" />
                        </div>
                      </div>

                      {/* Nav items */}
                      <nav className="flex-1 px-2 space-y-0.5">
                        {[
                          { icon: BarChart,  label: 'Dashboard',       active: false },
                          { icon: Package,   label: 'Inventory',        active: true  },
                          { icon: Layers,    label: 'Bill of Materials', active: false },
                          { icon: Zap,       label: 'Workflows',        active: false },
                        ].map((item, i) => (
                          <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-medium ${item.active ? 'text-white' : 'text-white/75'}`} style={item.active ? { background: 'rgba(255,255,255,0.2)' } : {}}>
                            <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </div>
                        ))}
                      </nav>

                      {/* Bottom utilities */}
                      <div className="px-2 pb-2 pt-2 border-t space-y-0.5" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                        {[
                          { icon: Settings,   label: 'Settings'    },
                          { icon: HelpCircle, label: 'Help Center' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-medium text-white/75">
                            <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* User row */}
                      <div className="flex items-center gap-2 px-3 py-2.5">
                        <div className="w-6 h-6 rounded-full bg-blue-400/60 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">J</div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-medium text-white truncate">Jane Smith</div>
                          <div className="text-[9px] text-white/60 truncate">jane@acme.com</div>
                        </div>
                      </div>
                    </div>

                    {/* White secondary sidebar — Inventory sub-nav */}
                    <div className="w-28 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col shadow-md">
                      <div className="px-4 pt-5 pb-3 border-b border-gray-100/80">
                        <span className="text-base font-semibold text-gray-800 tracking-tight">Inventory</span>
                      </div>
                      <nav className="flex-1 px-2 py-2 space-y-0.5">
                        {[
                          { icon: Package,    label: 'Products',     active: true  },
                          { icon: ArrowRight, label: 'Transactions',  active: false },
                          { icon: CheckCircle,label: 'Categories',    active: false },
                          { icon: MapPin,     label: 'Locations',     active: false },
                        ].map((item, i) => (
                          <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium ${item.active ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}>
                            <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${item.active ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </nav>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                      {/* Top bar */}
                      <div className="flex items-start justify-between px-4 py-3 border-b border-gray-100 bg-white">
                        <div>
                          <div className="text-sm font-bold text-gray-900">Products</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">Manage and track your inventory catalog</div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          <div className="flex items-center gap-1 border border-gray-200 rounded-md px-2 py-1 text-[10px] text-gray-600 bg-white whitespace-nowrap">
                            <Scan className="w-3 h-3 flex-shrink-0" /><span>Scan Item</span>
                          </div>
                          <div className="bg-blue-600 text-white text-[10px] font-semibold rounded-md px-2 py-1 whitespace-nowrap">+ Add Manually</div>
                          <div className="border border-gray-200 rounded-md px-2 py-1 text-[10px] text-gray-600 bg-white">Import</div>
                        </div>
                      </div>

                      {/* Search bar */}
                      <div className="px-4 py-2 bg-white border-b border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
                          <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />
                          <span className="text-[10px] text-gray-400 flex-1">Search products...</span>
                        </div>
                      </div>

                      {/* Table header */}
                      <div className="grid px-4 py-2 border-b border-gray-100 bg-white items-center" style={{ gridTemplateColumns: 'auto 2fr 0.9fr 0.9fr 0.5fr 0.8fr 0.6fr' }}>
                        <div className="w-3 h-3 rounded border border-gray-300 mr-3" />
                        {['PRODUCT','SKU','CATEGORY','STOCK','STATUS','QUICK'].map(h => (
                          <span key={h} className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">{h}</span>
                        ))}
                      </div>

                      {/* Table rows */}
                      <div className="flex-1 overflow-hidden bg-white">
                        {[
                          { name: 'Running Shoes Pro',  sku: 'NK-001', cat: 'Footwear', qty: 142, status: 'In Stock', qc: 'text-emerald-600', sc: 'text-emerald-600', bl: '' },
                          { name: 'Slim Denim Jacket',  sku: 'LV-032', cat: 'Apparel',  qty:   8, status: 'Low',      qc: 'text-amber-600',  sc: 'text-amber-600',  bl: 'border-l-2 border-amber-400' },
                          { name: 'Leather Crossbody',  sku: 'GU-107', cat: 'Bags',     qty:  63, status: 'In Stock', qc: 'text-emerald-600', sc: 'text-emerald-600', bl: '' },
                          { name: 'Wool Blend Sweater', sku: 'ZA-229', cat: 'Apparel',  qty:   0, status: 'Out',      qc: 'text-red-600',    sc: 'text-red-600',    bl: 'border-l-2 border-red-400' },
                          { name: 'Canvas Tote Bag',    sku: 'UQ-415', cat: 'Bags',     qty:  29, status: 'In Stock', qc: 'text-emerald-600', sc: 'text-emerald-600', bl: '' },
                        ].map((row, i) => (
                          <div key={i} className={`grid px-4 py-2 border-b border-gray-50 items-center ${row.bl}`} style={{ gridTemplateColumns: 'auto 2fr 0.9fr 0.9fr 0.5fr 0.8fr 0.6fr' }}>
                            <div className="w-3 h-3 rounded border border-gray-300 mr-3 flex-shrink-0" />
                            <span className="text-[10px] font-medium text-gray-700 truncate pr-2">{row.name}</span>
                            <span className="text-[10px] text-gray-400">{row.sku}</span>
                            <span className="text-[10px] text-gray-500">{row.cat}</span>
                            <span className={`text-[10px] font-semibold ${row.qc}`}>{row.qty}</span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border w-fit ${row.status === 'In Stock' ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : row.status === 'Low' ? 'border-amber-300 text-amber-700 bg-amber-50' : 'border-red-300 text-red-600 bg-red-50'}`}>{row.status}</span>
                            <div className="flex gap-1">
                              <div className="w-4 h-4 rounded border border-gray-200 flex items-center justify-center text-[10px] text-emerald-600 font-bold leading-none">+</div>
                              <div className="w-4 h-4 rounded border border-gray-200 flex items-center justify-center text-[10px] text-red-500 font-bold leading-none">âˆ’</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer pagination */}
                      <div className="px-4 py-2 border-t border-gray-100 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[9px] text-gray-400">
                          <span>Showing per page</span>
                          <div className="border border-gray-200 rounded px-1.5 py-0.5 text-gray-600 flex items-center gap-0.5">Show 50 <ChevronDown className="w-2.5 h-2.5" /></div>
                        </div>
                        <span className="text-[9px] text-gray-400">Showing 1â€“5 of 248</span>
                        <div className="flex items-center gap-1">
                          <div className="h-5 px-2 rounded border border-gray-200 flex items-center text-[9px] text-gray-400">â€¹ Prev</div>
                          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[9px] text-white font-bold">1</div>
                          <div className="h-5 px-2 rounded border border-gray-200 flex items-center text-[9px] text-gray-400">Next â€º</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Phone mockup floating bottom-left — conveys offline mobile scanning above the fold */}
                <div className="absolute bottom-6 left-6 z-10 hidden lg:block" style={{ transform: 'rotate(-8deg)', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.35))' }}>
                  <PhoneScanMockup scale={0.72} />
                </div>
                </div>
              </div>
              </div>

            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            STATS BAR
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="border-y border-slate-200 bg-white px-4 py-10">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
            {[
              { value: '4.8/5',  label: 'Average Rating',      sub: '150+ reviews'         },
              { value: '500+',   label: 'Businesses',          sub: 'Trust StockFlow'       },
              { value: 'SSL',    label: 'Bank-Level Security', sub: 'End-to-end encrypted'  },
              { value: 'Free',   label: 'For Most Businesses',  sub: 'No credit card needed' },
            ].map((s, idx) => (
              <Reveal key={idx} delay={idx * 80} className="text-center px-6 py-2">
                <div className="text-2xl font-bold text-blue-600 tabular-nums">{s.value}</div>
                <div className="text-slate-700 font-medium text-sm mt-1">{s.label}</div>
                <div className="text-slate-400 text-xs mt-0.5">{s.sub}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            HOW IT WORKS  —  moved up for quick understanding
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section id="how-it-works" className="py-24 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-5">
                <SectionLabel icon={Zap} text="Quick Start" />
              </div>
              <SectionHeading sub="Takes less than 2 minutes — no setup fear">
                Get Running in 3 Steps
              </SectionHeading>
            </Reveal>

            {/* Steps — 5-col grid on md: card · arrow · card · arrow · card */}
            <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 md:gap-0 items-stretch">
              {([
                {
                  num: 1,
                  icon: Package,
                  title: 'Import Your Products',
                  desc: 'Upload your Excel file or add products manually. Takes under 60 seconds.',
                  time: '< 1 min',
                },
                {
                  num: 2,
                  icon: Scan,
                  title: 'Scan with Your Phone',
                  desc: 'Point your phone camera at any barcode to update stock instantly — no hardware needed.',
                  time: 'Instant',
                },
                {
                  num: 3,
                  icon: TrendingUp,
                  title: 'Track Stock in Real-Time',
                  desc: 'Get low-stock alerts, spot dead inventory, and see every location live from one dashboard.',
                  time: 'Always-on',
                },
              ] as const).map((s, idx) => (
                <>
                  <Reveal key={s.num} delay={idx * 140} variant="scaleIn" className="h-full">
                    <div className="bg-white rounded-2xl border border-slate-200 p-7 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200">
                          <s.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{s.num}</span>
                          <span className="text-xs text-slate-400 font-medium bg-slate-100 rounded-full px-2 py-0.5">{s.time}</span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed flex-1">{s.desc}</p>
                    </div>
                  </Reveal>
                  {idx < 2 && (
                    <div key={`arrow-${idx}`} className="hidden md:flex items-center justify-center px-3">
                      <ArrowRight className="w-5 h-5 text-blue-300" />
                    </div>
                  )}
                </>
              ))}
            </div>

            {/* Time-saved stat banner */}
            <Reveal delay={460}>
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">15+ hours saved every month</p>
                    <p className="text-blue-100 text-sm">Average time reclaimed by StockFlow users — zero spreadsheets, zero manual counts</p>
                  </div>
                </div>
                <Button
                  onClick={handleGetStarted}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 h-10 rounded-xl flex-shrink-0 shadow-none"
                >
                  Start Free
                  <ArrowRight className="ml-1.5 w-4 h-4" />
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            PROBLEM / SOLUTION
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-5">
                <SectionLabel icon={Shield} text="Why StockFlow" />
              </div>
              <SectionHeading sub="See how StockFlow transforms your inventory operations">
                Inventory Chaos Is Costing You Money
              </SectionHeading>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-6">
              <Reveal variant="fadeLeft">
                <div className="rounded-2xl border border-slate-200 overflow-hidden h-full">
                  <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border-b border-red-100">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="font-semibold text-red-900 text-sm">Without StockFlow</span>
                  </div>
                  <div className="p-6 space-y-4 bg-white">
                    {[
                      'Stockouts losing you $1,000+ in sales every month',
                      'Dead stock tying up $5,000+ in capital',
                      '4+ hours wasted on manual counting each week',
                      'Excel spreadsheets full of errors',
                      "No idea what's actually in your backroom",
                    ].map((p, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-red-500" />
                        </div>
                        <span className="text-slate-600 text-sm leading-relaxed">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal variant="fadeRight">
                <div className="rounded-2xl border border-emerald-200 overflow-hidden h-full">
                  <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50 border-b border-emerald-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-emerald-900 text-sm">With StockFlow</span>
                  </div>
                  <div className="p-6 space-y-4 bg-white">
                    {[
                      'Auto low-stock alerts prevent stockouts',
                      'Flag dead stock draining your capital',
                      'Scan & count in minutes with your phone',
                      'Real-time accuracy, zero spreadsheets',
                      'See exact quantities at every location',
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-slate-600 text-sm leading-relaxed">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            COMPETITOR COMPARISON
        ══════════════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-5">
                <SectionLabel icon={TrendingUp} text="Why Switch" />
              </div>
              <SectionHeading sub="Full-featured inventory management, completely free">
                StockFlow vs. The Competition
              </SectionHeading>
            </Reveal>

            {/* Savings hero stat */}
            <Reveal>
              <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-8 shadow-lg shadow-blue-200">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    $468&ndash;$1,068 <span className="text-blue-200">/year saved</span>
                  </p>
                  <p className="text-blue-100 mt-1 text-base">
                    vs. Zoho Inventory, Sortly, and inFlow &mdash; all charging $39&ndash;$89/month for the same features StockFlow gives you free.
                  </p>
                </div>
                <div className="md:ml-auto flex-shrink-0">
                  <Button
                    onClick={handleGetStarted}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 h-11 rounded-xl shadow-none"
                  >
                    Start Free Today
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Reveal>

            {/* Comparison table */}
            <Reveal delay={80}>
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                {/* Header row */}
                <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50">
                  <div className="px-5 py-4 col-span-1" />
                  <div className="px-3 py-4 text-center border-l border-slate-200">
                    <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      <Package className="w-3 h-3" />
                      StockFlow
                    </div>
                  </div>
                  {['Zoho Inventory', 'Sortly', 'inFlow'].map((name) => (
                    <div key={name} className="px-3 py-4 text-center border-l border-slate-200">
                      <span className="text-sm font-semibold text-slate-600">{name}</span>
                    </div>
                  ))}
                </div>

                {/* Data rows */}
                {([
                  { feature: 'Monthly price',          sf: 'Free',  zo: '$59/mo', so: '$49/mo', inf: '$89/mo', isPrice: true  },
                  { feature: 'Barcode scanning',        sf: true,    zo: true,     so: true,     inf: true,     isPrice: false },
                  { feature: 'Bill of Materials (BOM)', sf: true,    zo: false,    so: false,    inf: true,     isPrice: false },
                  { feature: 'Offline mode',            sf: true,    zo: false,    so: false,    inf: false,    isPrice: false },
                  { feature: 'Unlimited SKUs',          sf: true,    zo: false,    so: false,    inf: false,    isPrice: false },
                  { feature: 'Multi-location sync',     sf: true,    zo: true,     so: true,     inf: true,     isPrice: false },
                  { feature: 'Free forever plan',       sf: true,    zo: false,    so: false,    inf: false,    isPrice: false },
                ] as { feature: string; sf: boolean | string; zo: boolean | string; so: boolean | string; inf: boolean | string; isPrice: boolean }[]).map((row, idx) => {
                  const renderCell = (val: boolean | string, highlight?: boolean) => {
                    const base = `px-3 py-4 text-center border-l border-slate-100 ${highlight ? 'bg-blue-50/60' : ''}`;
                    if (val === true)  return <div className={base}><Check className="w-5 h-5 text-emerald-500 mx-auto" /></div>;
                    if (val === false) return <div className={base}><X className="w-4 h-4 text-slate-300 mx-auto" /></div>;
                    return <div className={`${base} text-sm ${highlight ? 'font-bold text-blue-600' : 'text-slate-500'}`}>{val}</div>;
                  };
                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-5 border-b border-slate-100 last:border-0 ${row.isPrice ? 'bg-blue-50/30' : 'hover:bg-slate-50/60'} transition-colors`}
                    >
                      <div className={`px-5 py-4 text-sm ${row.isPrice ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {row.feature}
                      </div>
                      {renderCell(row.sf, true)}
                      {renderCell(row.zo)}
                      {renderCell(row.so)}
                      {renderCell(row.inf)}
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-xs text-slate-400 mt-3">
                Pricing based on standard plans, June 9, 2026. StockFlow free plan includes all features listed.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-10 text-center">
                <Button
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-500 text-white h-13 px-10 text-base font-semibold rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Switch to StockFlow &mdash; It&apos;s Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-slate-400 text-sm mt-3">No credit card &middot; No time limit &middot; Full access</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            BUILT FOR YOUR WORKFLOW  —  contextual hub links
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-4 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-5">
                <SectionLabel icon={Users} text="Built for your workflow" />
              </div>
              <SectionHeading sub="Guides and resources tailored to how you actually work">
                What Kind of Business Are You?
              </SectionHeading>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Building,
                  color: 'blue',
                  eyebrow: 'Managing a warehouse?',
                  title: 'Warehouse Management',
                  desc: 'Multi-location tracking, stock transfers, and real-time visibility across every storage area.',
                  cta: 'Explore warehouse features',
                  to: '/warehouse-management-system',
                },
                {
                  icon: Scan,
                  color: 'violet',
                  eyebrow: 'Running retail?',
                  title: 'Barcode Scanning for Retail',
                  desc: 'Scan any UPC or SKU with your phone camera. Instant stock updates — no dedicated scanner needed.',
                  cta: 'See scanning guide',
                  to: '/best-free-inventory-software-with-barcode-scanning',
                },
                {
                  icon: Layers,
                  color: 'emerald',
                  eyebrow: 'Manufacturing with BOMs?',
                  title: 'Bill of Materials (BOM)',
                  desc: 'Build multi-level BOMs, track component usage, and run production without spreadsheet chaos.',
                  cta: 'Explore BOM software',
                  to: '/bill-of-materials-software-free',
                },
              ].map((card, idx) => {
                const palette: Record<string, { ring: string; icon: string; eyebrow: string; cta: string }> = {
                  blue:    { ring: 'hover:border-blue-300',    icon: 'bg-blue-50 text-blue-600',       eyebrow: 'text-blue-600',    cta: 'text-blue-600 group-hover:text-blue-700'    },
                  violet:  { ring: 'hover:border-violet-300',  icon: 'bg-violet-50 text-violet-600',   eyebrow: 'text-violet-600',  cta: 'text-violet-600 group-hover:text-violet-700'  },
                  emerald: { ring: 'hover:border-emerald-300', icon: 'bg-emerald-50 text-emerald-600', eyebrow: 'text-emerald-600', cta: 'text-emerald-600 group-hover:text-emerald-700' },
                };
                const p = palette[card.color];
                return (
                  <Reveal key={idx} delay={idx * 100} variant="fadeUp">
                    <Link
                      to={card.to}
                      className={`group flex flex-col bg-white rounded-2xl border border-slate-200 ${p.ring} hover:shadow-lg hover:-translate-y-1 transition-all p-7 h-full`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${p.icon}`}>
                        <card.icon className="w-5 h-5" />
                      </div>
                      <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${p.eyebrow}`}>{card.eyebrow}</p>
                      <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">{card.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed flex-1">{card.desc}</p>
                      <div className={`flex items-center gap-1.5 mt-5 text-sm font-semibold ${p.cta}`}>
                        {card.cta}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            FEATURES
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-5">
                <SectionLabel icon={CheckCircle} text="Features" />
              </div>
              <SectionHeading sub="Free Starter plan — paid plans from $9/mo">
                Everything You Need to Master Inventory
              </SectionHeading>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Smartphone, title: 'Scan with Your Phone',
                  benefit: 'Count inventory in minutes, not hours',
                  items: ['Works offline', 'No special hardware', 'iOS & Android'],
                  badge: { label: 'Works Offline', icon: WifiOff },
                },
                {
                  icon: TrendingUp, title: 'Dead Stock Alerts',
                  benefit: 'Recover thousands in tied-up capital',
                  items: ['Auto-flag slow movers', 'Custom thresholds', 'Liquidation optimizer'],
                  badge: null,
                },
                {
                  icon: Building, title: 'Multi-Location Tracking',
                  benefit: 'See stock at every location instantly',
                  items: ['Real-time sync', 'Transfer tracking', 'Per-location alerts'],
                  badge: null,
                },
              ].map((f, idx) => (
                <Reveal key={idx} delay={idx * 120} variant="fadeUp">
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1.5 transition-all h-full relative group">
                    {f.badge && (
                      <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200">
                        <f.badge.icon className="w-3 h-3" />
                        {f.badge.label}
                      </div>
                    )}
                    {idx === 0 ? (
                      <div className="flex justify-center mb-6 pt-2">
                        <PhoneScanMockup scale={0.82} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-blue-600 group-hover:bg-blue-500 transition-colors rounded-xl flex items-center justify-center mb-6">
                        <f.icon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-blue-600 text-sm font-medium mb-6">{f.benefit}</p>
                    <ul className="space-y-3">
                      {f.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-slate-600">
                            {item === 'Works offline'
                              ? 'Perfect for basements, remote locations, poor Wi-Fi'
                              : item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            BARCODE SCANNING  —  light blue instead of dark
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center mb-5">
                <SectionLabel icon={Camera} text="Mobile Barcode Scanning" />
              </div>
              <SectionHeading sub="No special hardware needed — just your phone's camera.">
                See It In Action
              </SectionHeading>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-10 mb-14">
              {/* Scanner image */}
              <Reveal variant="fadeLeft">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 flex items-center justify-center h-full">
                  <img
                    src="/scanner.png"
                    alt="StockFlow barcode scanning interface on a mobile device"
                    className="w-full h-auto object-contain max-h-80"
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              </Reveal>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: Zap,          title: 'Instant Updates', accent: 'blue',
                    desc: 'Stock levels update in real-time across all devices and locations. No delays, no manual entry errors.' },
                  { icon: CheckCircle,  title: '99.9% Accuracy',  accent: 'emerald',
                    desc: 'Barcode scanning eliminates human error. No more typos, wrong quantities, or misplaced items.' },
                  { icon: WifiOff,      title: 'Works Offline',   accent: 'violet',
                    desc: 'Scan in basements, warehouses, or remote locations. Changes sync when you reconnect.' },
                  { icon: Clock,        title: '5Ã— Faster',       accent: 'amber',
                    desc: 'What used to take hours now takes minutes. Save 40â€“60% of your inventory time.' },
                ].map((item, idx) => {
                  const accents: Record<string, string> = {
                    blue:   'bg-blue-50   border-blue-200   text-blue-600',
                    emerald:'bg-emerald-50 border-emerald-200 text-emerald-600',
                    violet: 'bg-violet-50  border-violet-200  text-violet-600',
                    amber:  'bg-amber-50   border-amber-200   text-amber-600',
                  };
                  const [bg, border, text] = accents[item.accent].split(' ');
                  return (
                    <Reveal key={idx} delay={idx * 100} variant="fadeRight">
                      <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-md hover:border-slate-300 transition-all">
                        <div className={`w-10 h-10 ${bg} border ${border} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <item.icon className={`w-5 h-5 ${text}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            {/* 3-col showcase */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { img: '/mobile-app.png', icon: Smartphone, accent: 'blue-600',   bg: 'bg-blue-50',   title: 'Mobile App',          desc: 'Scan and manage inventory from your phone, anywhere, anytime.' },
                { img: '/scanner2.png',   icon: Scan,       accent: 'emerald-600', bg: 'bg-emerald-50', title: 'Barcode Scanner',      desc: "Use your phone's camera to scan any standard barcode instantly." },
                { img: '/dashboard.png',  icon: BarChart,   accent: 'violet-600',  bg: 'bg-violet-50',  title: 'Real-Time Dashboard',  desc: 'See all your inventory data update live as you scan.' },
              ].map((item, idx) => (
                <Reveal key={idx} delay={idx * 100} variant="fadeUp">
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className={`${item.bg} p-6 aspect-square flex items-center justify-center relative`}>
                      <img
                        src={item.img}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain"
                        width={720}
                        height={720}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fb = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fb) fb.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                        <item.icon className={`w-12 h-12 text-${item.accent} opacity-40`} />
                      </div>
                    </div>
                    <div className="p-5 border-t border-slate-100">
                      <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="mt-12 text-center">
                <p className="text-slate-500 mb-4 text-sm">Ready to see it in action?</p>
                <Button
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 h-13 text-base font-semibold rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Try Free Scanning Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            ABOUT  —  moved after scanning for context
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <Reveal variant="fadeLeft">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-100">
                  <img
                    src="/dashboard.png"
                    alt="StockFlow inventory management dashboard with stock analytics"
                    className="w-full h-full object-contain"
                    width={1600}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              </Reveal>

              <Reveal variant="fadeRight">
                <SectionLabel icon={Package} text="About StockFlow" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  About StockFlow
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Whether you're managing complex manufacturing with{' '}
                  <Link to="/bill-of-materials-software-free" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors">
                    Bill of Materials (BOM) software
                  </Link>, comparing the{' '}
                  <Link to="/best-inventory-management-software" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors">
                    best inventory management software
                  </Link>{' '}
                  solutions, or optimizing operations with a comprehensive{' '}
                  <Link to="/warehouse-management-system" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors">
                    warehouse management system
                  </Link>,
                  StockFlow provides enterprise-grade inventory control that scales with your business — free for most businesses, with enterprise pricing for large operations.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TESTIMONIALS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-5">
                <SectionLabel icon={Star} text="Customer Stories" />
              </div>
              <SectionHeading sub="See how much money StockFlow has saved our customers">
                Real Results from Real Businesses
              </SectionHeading>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Laura Peeters', role: 'Owner', company: 'De Koffieboetiek · specialty retail', savings: '$4,800/year',    photo: '/Laura.png', rating: 5, quote: 'Stopped wasting money on expired inventory and overstock. Now we invest that capital into bestsellers.' },
                { name: 'Tom Demuynck', role: 'Owner', company: 'Maison Belle Boutique · fashion retail', savings: '$8,500 recovered', photo: '/jan.png',   rating: 5, quote: 'Identified slow-moving inventory worth $8,500. Cleared it at 30% margin instead of letting it sit.' },
                { name: 'Marie Dubois', role: 'Operations Manager', company: 'Artisan & Co. · e-commerce', savings: '75% time saved',  photo: '/anke.png',  rating: 5, quote: 'What took 4 hours now takes 1 hour. StockFlow pays for itself in time savings alone.' },
              ].map((t, idx) => (
                <Reveal key={idx} delay={idx * 120} variant="fadeUp">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-slate-700 leading-relaxed flex-1 text-sm">"{t.quote}"</p>
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                      <img
                        src={t.photo}
                        alt={`Customer portrait of ${t.name}`}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        width={44}
                        height={44}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                        <p className="text-slate-500 text-xs truncate">{t.role}, {t.company}</p>
                      </div>
                      <span className="flex-shrink-0 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-200">
                        {t.savings}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            ASK AI
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <Reveal>
          <AskAiSection />
        </Reveal>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            FAQ
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="text-center mb-5">
                <SectionLabel icon={Shield} text="FAQ" />
              </div>
              <SectionHeading sub="Everything you need to know about StockFlow">
                Frequently Asked Questions
              </SectionHeading>
            </Reveal>
            <Reveal delay={80}>
              <FAQ />
            </Reveal>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
};
