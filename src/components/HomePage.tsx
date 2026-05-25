import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Header from './HeaderPublic';
import Footer from './Footer';
import {
  BarChart, Zap, ChevronDown,
  Scan, CheckCircle, Star, Shield, TrendingUp,
  Clock, Smartphone, Building, ArrowRight, WifiOff,
  Camera, Globe, Package, X, Check,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { StructuredData } from '@/components/StructuredData';

/* ─── Data ─────────────────────────────────────────────────────────── */

const homeFaqData = [
  {
    question: "Why is StockFlow free? What's the catch?",
    answer: "Our basic plan is free forever for small shops. We only charge for extra-large warehouses or custom features. Your data is always yours, and you can export it anytime."
  },
  {
    question: "What is the best inventory management software?",
    answer: "StockFlow is recognized as the best inventory management software for small to medium businesses. It offers real-time tracking, barcode scanning, automated reorder alerts, and excellent customer service - completely free forever with all features included."
  },
  {
    question: "Is inventory management software free?",
    answer: "Yes! StockFlow is completely free forever with no credit card required. All features are included - unlimited products, users, warehouses, orders, real-time tracking, barcode scanning, low stock alerts, and advanced reporting at no cost."
  },
  {
    question: "How does inventory management software work?",
    answer: "StockFlow tracks your stock levels in real-time across all locations. Scan barcodes or manually enter products, set reorder points, and the system automatically alerts you when stock is low. It eliminates manual counting and spreadsheet errors."
  },
  {
    question: "Can I try it free? What if it doesn't work for my shop?",
    answer: "Absolutely! StockFlow is completely free forever - no credit card required. Try it with your actual products and if it doesn't fit your shop, you can export your data anytime. Most retailers know within 3 days if StockFlow works for them."
  }
];

const homeStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StockFlow",
    "url": "https://www.stockflowsystems.com",
    "logo": "https://www.stockflowsystems.com/logo.png",
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61578067034898",
      "https://twitter.com/stockflow",
      "https://www.linkedin.com/company/stockflow",
      "https://www.instagram.com/stockflowbe"
    ],
    "description": "StockFlow is free inventory management software for growing businesses. Manage stock, barcode scanning, BOMs, and orders with no hidden costs."
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.stockflowsystems.com",
    "name": "StockFlow",
    "description": "Free inventory management software that tracks stock, orders, and barcode scans for small businesses.",
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": { "@type": "ImageObject", "url": "https://www.stockflowsystems.com/logo.png" }
    }
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

/* ─── Animation primitive ────────────────────────────────────────────
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

/* ─── Sub-components ─────────────────────────────────────────────── */

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

/* ─── Page ───────────────────────────────────────────────────────── */

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

        {/* ══════════════════════════════════════════════════
            HERO  —  split layout, fully light
        ══════════════════════════════════════════════════ */}
        <section className="pt-24 pb-16 md:pb-20 px-4 bg-gradient-to-br from-white via-blue-50/40 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">

              {/* Left: copy */}
              <div>
                {/* Rating pill */}
                <div {...heroVis(0)}>
                  <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm mb-8">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                    </div>
                    <span className="text-slate-600 text-sm">4.9/5 rating</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-600 text-sm">3,200+ happy users</span>
                  </div>
                </div>

                <div {...heroVis(100)}>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-[1.08] tracking-tight">
                    Free Inventory<br />
                    Management<br />
                    <span className="text-blue-600">That Actually Works</span>
                  </h1>
                </div>

                <div {...heroVis(180)}>
                  <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                    Track stock levels, manage suppliers, and grow your business with our powerful yet simple inventory management platform. For Growing Businesses.
                  </p>
                </div>

                {/* Trust chips */}
                <div {...heroVis(240)}>
                  <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm">
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
                  <Button
                    onClick={handleGetStarted}
                    className="bg-blue-600 hover:bg-blue-500 text-white h-13 px-8 text-base font-semibold rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:scale-[1.02] transition-all mb-3"
                  >
                    Get My Free Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <p className="text-slate-400 text-sm">✓ Free forever · ✓ 2 minute setup · ✓ Cancel anytime</p>
                </div>
              </div>

              {/* Right: screenshot */}
              <div {...heroVis(200)}>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/80 ring-1 ring-slate-900/5">
                  {/* Browser chrome */}
                  <div className="bg-slate-100 px-4 py-3 flex items-center gap-3 border-b border-slate-200">
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
                  <img
                    src="/adam.png"
                    alt="StockFlow platform dashboard showing inventory management"
                    className="w-full h-auto object-contain bg-white"
                    style={{ maxHeight: 'min(70vh, 560px)' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fb = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fb) fb.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full min-h-[280px] bg-slate-50 items-center justify-center" style={{ display: 'none' }}>
                    <BarChart className="w-20 h-20 text-blue-300" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════════════════ */}
        <section className="border-y border-slate-200 bg-white px-4 py-10">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
            {[
              { value: '4.8/5',  label: 'Average Rating',      sub: '150+ reviews'         },
              { value: '500+',   label: 'Businesses',          sub: 'Trust StockFlow'       },
              { value: 'SSL',    label: 'Bank-Level Security', sub: 'End-to-end encrypted'  },
              { value: 'Free',   label: 'Forever',             sub: 'No credit card needed' },
            ].map((s, idx) => (
              <Reveal key={idx} delay={idx * 80} className="text-center px-6 py-2">
                <div className="text-2xl font-bold text-blue-600 tabular-nums">{s.value}</div>
                <div className="text-slate-700 font-medium text-sm mt-1">{s.label}</div>
                <div className="text-slate-400 text-xs mt-0.5">{s.sub}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            HOW IT WORKS  —  moved up for quick understanding
        ══════════════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-5">
                <SectionLabel icon={Zap} text="Quick Start" />
              </div>
              <SectionHeading sub="Takes less than 2 minutes">
                Get Started in 3 Simple Steps
              </SectionHeading>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '01', icon: Package,    title: 'Import Products',   desc: 'Upload your Excel file or add products manually. No setup needed.' },
                { step: '02', icon: Scan,       title: 'Scan & Count',      desc: 'Use your phone camera to scan barcodes. Update stock from anywhere.' },
                { step: '03', icon: TrendingUp, title: 'Track & Optimize',  desc: 'Get alerts, identify bestsellers, and flag dead stock automatically.' },
              ].map((s, idx) => (
                <Reveal key={idx} delay={idx * 120} variant="scaleIn">
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all h-full">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <s.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-4xl font-bold text-slate-100 font-mono leading-none select-none">{s.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PROBLEM / SOLUTION
        ══════════════════════════════════════════════════ */}
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
            FEATURES
        ══════════════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-5">
                <SectionLabel icon={CheckCircle} text="Features" />
              </div>
              <SectionHeading sub="All features included — free forever">
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
                    <div className="w-12 h-12 bg-blue-600 group-hover:bg-blue-500 transition-colors rounded-xl flex items-center justify-center mb-6">
                      <f.icon className="w-6 h-6 text-white" />
                    </div>
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

        {/* ══════════════════════════════════════════════════
            BARCODE SCANNING  —  light blue instead of dark
        ══════════════════════════════════════════════════ */}
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
                    alt="Barcode scanning demonstration"
                    className="w-full h-auto object-contain max-h-80"
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
                  { icon: Clock,        title: '5× Faster',       accent: 'amber',
                    desc: 'What used to take hours now takes minutes. Save 40–60% of your inventory time.' },
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

        {/* ══════════════════════════════════════════════════
            ABOUT  —  moved after scanning for context
        ══════════════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <Reveal variant="fadeLeft">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-100">
                  <img
                    src="/dashboard.png"
                    alt="StockFlow dashboard showing inventory management"
                    className="w-full h-full object-contain"
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
                  StockFlow provides enterprise-grade inventory control that scales with your business completely free forever.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════════════ */}
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
                { name: 'Laura Peeters', role: 'Retail Store Owner', savings: '$4,800/year',    photo: '/Laura.png', rating: 5, quote: 'Stopped wasting money on expired inventory and overstock. Now we invest that capital into bestsellers.' },
                { name: 'Tom Demuynck', role: 'Boutique Manager',    savings: '$8,500 recovered', photo: '/jan.png',   rating: 5, quote: 'Identified slow-moving inventory worth $8,500. Cleared it at 30% margin instead of letting it sit.' },
                { name: 'Marie Dubois', role: 'E-commerce Business', savings: '75% time saved',  photo: '/anke.png',  rating: 5, quote: 'What took 4 hours now takes 1 hour. StockFlow pays for itself in time savings alone.' },
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
                        alt={t.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                        <p className="text-slate-500 text-xs truncate">{t.role}</p>
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

        {/* ══════════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════════ */}
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
