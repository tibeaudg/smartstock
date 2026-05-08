import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from './HeaderPublic';
import Footer from './Footer';

import { 
  Package, BarChart3, Zap, ChevronLeft, ChevronRight, 
  Scan, CheckCircle, Star, Shield, Users, TrendingUp,
  Clock, Smartphone, Building, Award, ArrowRight, WifiOff,
  Camera, RefreshCw, BarChart, Globe
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { StructuredData } from '@/components/StructuredData';

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
    answer: "Yes! StockFlow is completely free forever with no credit card required. All features are included - unlimited products, users, branches, orders, real-time tracking, barcode scanning, low stock alerts, and advanced reporting at no cost."
  },
  {
    question: "How does inventory management software work?",
    answer: "StockFlow tracks your stock levels in real-time across all locations. Scan barcodes or manually enter products, set reorder points, and the system automatically alerts you when stock is low. It eliminates manual counting and spreadsheet errors."
  },
  {
    question: "Can I try it free? What if it doesn't work for my shop?",
    answer: "Absolutely! StockFlow is completely free forever - no credit card required. Try it with your actual products and if it doesn't fit your shop, you can export your data anytime. Most retailers know within 3 days if StockFlow works for them."
  },
  {
    question: "How much does StockFlow cost? Is StockFlow free?",
    answer: "StockFlow is free forever with no credit card required. All features are included: unlimited products, users, branches, BOM management and reporting. Read our pricing page for more information."
  },
  {
    question: "How much does StockFlow cost? What is the subscription price?",
    answer: "StockFlow is free forever. There is no subscription fee — our core inventory management platform is completely free with unlimited products, users, branches, and orders. No credit card required to get started."
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
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflowsystems.com/logo.png"
      }
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": homeFaqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
];

// Trust Badges Component
const TrustBadges = () => {
  const badges = [
    { icon: Star, text: "4.8/5 Rating", subtext: "150+ Reviews" },
    { icon: Shield, text: "Bank-Level Security", subtext: "SSL Encrypted" },
    { icon: Users, text: "500+ Businesses", subtext: "Trust StockFlow" },
    { icon: Clock, text: "Free Forever", subtext: "No Credit Card" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-lg backdrop-blur-sm">
          <badge.icon className="w-8 h-8 text-blue-600 mb-2" />
          <p className="font-semibold text-sm text-gray-900">{badge.text}</p>
          <p className="text-xs text-gray-600">{badge.subtext}</p>
        </div>
      ))}
    </div>
  );
};

// Social Proof Component
const SocialProof = () => {
  const testimonials = [
    {
      name: "Laura Peeters",
      role: "Retail Store Owner",
      savings: "$4,800/year",
      quote: "Stopped wasting money on expired inventory and overstock. Now we invest that capital into bestsellers.",
      rating: 5,
      photo: "/Laura.png"
    },
    {
      name: "Tom Demuynck", 
      role: "Boutique Manager",
      savings: "$8,500 recovered",
      quote: "Identified slow-moving inventory worth $8,500. Cleared it at 30% margin instead of letting it sit.",
      rating: 5,
      photo: "/jan.png"
    },
    {
      name: "Marie Dubois",
      role: "E-commerce Business",
      savings: "75% time saved",
      quote: "What took 4 hours now takes 1 hour. StockFlow pays for itself in time savings alone.",
      rating: 5,
      photo: "/anke.png"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((t, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex mb-2">
            {[...Array(t.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-700 mb-4 italic">"{t.quote}"</p>
          <div className="border-t pt-4 flex items-center gap-4">
            <img 
              src={t.photo} 
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{t.name}</p>
              <p className="text-sm text-gray-600">{t.role}</p>
              <p className="text-sm font-bold text-green-600 mt-1">{t.savings}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// FAQ Component
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = homeFaqData;
    {
      q: "What is the best inventory management software?",
      a: "StockFlow is recognized as the best inventory management software for small to medium businesses. It offers real-time tracking, barcode scanning, automated reorder alerts, and excellent customer service - completely free forever with all features included."
    },
    {
      q: "Is inventory management software free?",
      a: "Yes! StockFlow is completely free forever with no credit card required. All features are included - unlimited products, users, branches, orders, real-time tracking, barcode scanning, low stock alerts, and advanced reporting at no cost."
    },
    {
      q: "How does inventory management software work?",
      a: "StockFlow tracks your stock levels in real-time across all locations. Scan barcodes or manually enter products, set reorder points, and the system automatically alerts you when stock is low. It eliminates manual counting and spreadsheet errors."
    },
    {
      q: "Can I try it free? What if it doesn't work for my shop?",
      a: "Absolutely! StockFlow is completely free forever - no credit card required. Try it with your actual products and if it doesn't fit your shop, you can export your data anytime. Most retailers know within 3 days if StockFlow works for them."
    },
    {
      q: "How much does StockFlow cost? Is StockFlow free?",
      a: "StockFlow is free forever with no credit card required. All features are included: unlimited products, users, branches, BOM management and reporting. Read our pricing page for more information."
    },
    {
      q: "How much does StockFlow cost? What is the subscription price?",
      a: "StockFlow is free forever. There is no subscription fee our core inventory management platform is completely free with unlimited products, users, branches, and orders. No credit card required to get started."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {faqs.map((faq, idx) => (
        <div key={idx} className="mb-4">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            className="w-full text-left p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow flex justify-between items-center"
          >
            <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
            <ChevronRight className={`w-5 h-5 text-blue-600 transition-transform ${openIndex === idx ? 'rotate-90' : ''}`} />
          </button>
          {openIndex === idx && (
            <div className="mt-2 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const HomePage = () => {

  const navigate = useNavigate();


  const handleGetStarted = () => {
    navigate("/auth");    // Track conversion event
  };

  return (
    <>
    <StructuredData data={homeStructuredData} />
    <Header />

    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16">
      {/* Hero Section - Above the Fold */}
      <section className="pt-20 pb-12 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Sub-header: Rating & Users */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">4.9/5 rating</span>
            </div>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span className="text-sm font-medium text-gray-700">3200+ happy users</span>
          </div>

          {/* H1 with Primary Keyword */}
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 leading-tight">
              Free Inventory Management<br />
              <span className="text-blue-600">That Actually Works</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-600/90 font-medium mb-4">
              For Growing Businesses
            </p>
            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Track stock levels, manage suppliers, and grow your business with our powerful yet simple inventory management platform.
            </p>
          </div>

          {/* Feature Batches */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {[
              { icon: CheckCircle, text: "GDPR Compliant", color: "text-green-600" },
              { icon: Zap, text: "Fast & Reliable", color: "text-blue-600" },
              { icon: Globe, text: "Global Infrastructure", color: "text-purple-600" },
              { icon: Shield, text: "Secure Data", color: "text-green-600" }
            ].map((batch, idx) => (
              <div key={idx} className="flex items-center gap-2 justify-center md:justify-start">
                <batch.icon className={`w-5 h-5 flex-shrink-0 ${batch.color}`} />
                <span className="text-sm font-medium text-gray-700">{batch.text}</span>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="max-w-md mx-auto mb-12 md:mb-16">
            <Button 
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Get My Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-center text-sm text-gray-500 mt-3">
              ✓ Free forever  ✓ 2 minute setup  ✓ Cancel anytime
            </p>
          </div>

          {/* Platform Screenshot */}
          <div className="relative max-w-5xl mx-auto">
            <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              <img 
                src="/adam.png" 
                alt="StockFlow platform dashboard showing inventory management" 
                className="w-full h-auto object-contain"
                style={{ maxHeight: 'min(70vh, 600px)' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="hidden w-full min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center"
                style={{ display: 'none' }}
              >
                <BarChart className="w-24 h-24 text-blue-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>



        <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">

              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                About Stockflow
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image Left */}
              <div className="order-2 md:order-1">


                <div className=" overflow-hidden">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <img 
                      src="/dashboard.png" 
                      alt="StockFlow dashboard showing inventory management" 
                      className="w-full h-full object-contain border-2 border-blue-200 rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                      <BarChart className="w-16 h-16 text-blue-600 opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Text Right */}
              <div className="order-1 md:order-2">
                <div className="">
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    Whether you're managing complex manufacturing with <Link to="/bill-of-materials-software-free" className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors">Bill of Materials (BOM) software</Link>, comparing the <Link to="/best-inventory-management-software" className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors">best inventory management software</Link> solutions, or optimizing operations with a comprehensive <Link to="/warehouse-management-system" className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors">warehouse management system</Link>, StockFlow provides enterprise-grade inventory control that scales with your business completely free forever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Problem-Solution Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-red-100 text-red-700">The Problem</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Inventory Chaos Is Costing You Money
              </h2>
              <ul className="space-y-4">
                {[
                  "Stockouts losing you $1,000+ in sales every month",
                  "Dead stock tying up $5,000+ in capital",
                  "4+ hours wasted on manual counting each week",
                  "Excel spreadsheets full of errors",
                  "No idea what's actually in your backroom"
                ].map((problem, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-red-500 mr-3 text-xl">✗</span>
                    <span className="text-gray-700 text-lg">{problem}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700">The Solution</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                StockFlow Fixes All of This
              </h2>
              <ul className="space-y-4">
                {[
                  "Auto low-stock alerts prevent stockouts",
                  "Flag dead stock draining your capital",
                  "Scan & count in minutes with your phone",
                  "Real-time accuracy, zero spreadsheets",
                  "See exact quantities at every location"
                ].map((solution, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Real Results from Real Businesses
            </h2>
            <p className="text-xl text-gray-600">
              See how much money StockFlow has saved our customers
            </p>
          </div>
          <SocialProof />
        </div>
      </section>



            {/* Barcode Scanning Demo Section */}
            <section className="py-20 px-4 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Camera className="w-3 h-3 mr-1 inline" />
              Mobile Barcode Scanning
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Scan a barcode and watch stock update instantly. No special hardware needed just your phone's camera.
            </p>
          </div>

          {/* Main Demo Area */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Left: Demo Video/Image */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 overflow-hidden">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden mb-4">
                {/* Primary demo image */}
                <img 
                  src="/scanner.png" 
                  alt="Barcode scanning demonstration" 
                  className="w-150 h-150 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
  
              </div>

            </div>

            {/* Right: Key Features */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-600">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Instant Updates</h3>
                    <p className="text-gray-600 text-sm">Stock levels update in real-time across all devices and locations. No delays, no manual entry errors.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-600">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">99.9% Accuracy</h3>
                    <p className="text-gray-600 text-sm">Barcode scanning eliminates human error. No more typos, wrong quantities, or misplaced items.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-600">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <WifiOff className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Works Offline</h3>
                    <p className="text-gray-600 text-sm">Scan in basements, warehouses, or remote locations. Changes sync automatically when you reconnect.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-600">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">5x Faster</h3>
                    <p className="text-gray-600 text-sm">What used to take hours of manual counting now takes minutes. Save 40-60% of your inventory time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile App Showcase */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 mb-4 aspect-square flex items-center justify-center relative overflow-hidden">
                <img 
                  src="/mobile-app.png" 
                  alt="Mobile app interface" 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                  <Smartphone className="w-16 h-16 text-blue-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Mobile App</h3>
              <p className="text-sm text-gray-600">Scan and manage inventory from your phone, anywhere, anytime.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 mb-4 aspect-square flex items-center justify-center relative overflow-hidden">
                <img 
                  src="/scanner2.png" 
                  alt="Barcode scanner interface" 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                  <Scan className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Barcode Scanner</h3>
              <p className="text-sm text-gray-600">Use your phone's camera to scan any standard barcode instantly.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 mb-4 aspect-square flex items-center justify-center relative overflow-hidden">
                <img 
                  src="/dashboard.png" 
                  alt="Dashboard view" 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                  <BarChart className="w-16 h-16 text-purple-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Real-Time Dashboard</h3>
              <p className="text-sm text-gray-600">See all your inventory data update live as you scan.</p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Ready to see it in action?</p>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Try Free Scanning Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>


      

      {/* Feature Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Master Inventory
            </h2>
            <p className="text-xl text-gray-600">
              All features included - free forever
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Scan with Your Phone",
                benefit: "Count inventory in minutes, not hours",
                features: ["Works offline", "No special hardware", "iOS & Android"],
                offlineHighlight: true
              },
              {
                icon: TrendingUp,
                title: "Dead Stock Alerts",
                benefit: "Recover thousands in tied-up capital",
                features: ["Auto-flag slow movers", "Custom thresholds", "Liquidation optimizer"]
              },
              {
                icon: Building,
                title: "Multi-Location Tracking",
                benefit: "See stock at every location instantly",
                features: ["Real-time sync", "Transfer tracking", "Per-location alerts"]
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg relative">
                {feature.offlineHighlight && (
                  <Badge className="absolute top-4 right-4 bg-green-100 text-green-700 border-green-300 flex items-center gap-1">
                    <WifiOff className="w-3 h-3" />
                    Works Offline
                  </Badge>
                )}
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-lg text-blue-600 font-semibold mb-4">{feature.benefit}</p>
                <ul className="space-y-2">
                  {feature.features.map((f, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {f === "Works offline" ? (
                        <span className="font-semibold text-green-700">Perfect for basements, remote locations, and poor Wi-Fi areas</span>
                      ) : (
                        f
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Pricing & Abonnement Section */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Pricing & Subscription
            </h2>
            <p className="text-xl text-gray-600">
              StockFlow is free forever with no credit card required.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <p className="text-4xl font-bold text-blue-600 mb-4">$0 / month</p>
              <ul className="space-y-2 text-gray-700 mb-6">
                {["Unlimited products & users", "BOM management included", "Barcode scanning", "Multi-location tracking", "Reporting & analytics"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
             
            </div>
            <div>
              <p className="text-lg text-gray-700">
                StockFlow inventory management is <strong>free forever</strong>. No trial period, 
                no limits on products or users. Start today and manage your inventory professionally without costs.
              </p>
              <p className="text-gray-600 mt-4">
                Read more on our <Link to="/pricing" className="text-blue-600 hover:underline font-semibold">pricing page</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">Takes less than 2 minutes</p>
          </div>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Import Products",
                description: "Upload your Excel file or add products manually. No setup needed."
              },
              {
                step: "2",
                title: "Scan & Count",
                description: "Use your phone camera to scan barcodes. Update stock from anywhere."
              },
              {
                step: "3",
                title: "Track & Optimize",
                description: "Get alerts, identify bestsellers, and flag dead stock automatically."
              }
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl font-bold">{step.step}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-lg text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about StockFlow
            </p>
          </div>
          <FAQ />
        </div>
      </section>


    </div>

    <Footer />
    </>
  );
}