import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from './HeaderPublic';
import Footer from './Footer';

import { 
  Package, BarChart3, Zap, ChevronLeft, ChevronRight, 
  Scan, CheckCircle, Star, Shield, Users, TrendingUp,
  Clock, Smartphone, Building, Award, ArrowRight
} from 'lucide-react';
import { Head } from 'react-day-picker';
import { Navigate, useNavigate, Link } from 'react-router-dom';

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
      rating: 5
    },
    {
      name: "Tom Demuynck", 
      role: "Boutique Manager",
      savings: "$8,500 recovered",
      quote: "Identified slow-moving inventory worth $8,500. Cleared it at 30% margin instead of letting it sit.",
      rating: 5
    },
    {
      name: "Marie Dubois",
      role: "E-commerce Business",
      savings: "75% time saved",
      quote: "What took 4 hours now takes 1 hour. StockFlow pays for itself in time savings alone.",
      rating: 5
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
          <div className="border-t pt-4">
            <p className="font-semibold text-gray-900">{t.name}</p>
            <p className="text-sm text-gray-600">{t.role}</p>
            <p className="text-sm font-bold text-green-600 mt-1">{t.savings}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// FAQ Component
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
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
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {faqs.map((faq, idx) => (
        <div key={idx} className="mb-4">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            className="w-full text-left p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center"
          >
            <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
            <ChevronRight className={`w-5 h-5 text-blue-600 transition-transform ${openIndex === idx ? 'rotate-90' : ''}`} />
          </button>
          {openIndex === idx && (
            <div className="mt-2 p-6 bg-gray-50 rounded-lg">
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
    <Header />

    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16">
      {/* Hero Section - Above the Fold */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* H1 with Primary Keyword */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
              ✓ Completely Free Forever • No Credit Card Required
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Free Inventory Management<br />
              <span className="text-blue-600">That Actually Works</span>
            </h1>
            <p className="text-md md:text-lg text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
              Whether you're managing complex manufacturing with <Link to="/bill-of-materials-software-free" className="text-blue-600 hover:text-blue-700 font-semibold underline">Bill of Materials (BOM) software</Link>, comparing the <Link to="/best-inventory-management-software" className="text-blue-600 hover:text-blue-700 font-semibold underline">best inventory management software</Link> solutions, or optimizing operations with a comprehensive <Link to="/warehouse-management-system" className="text-blue-600 hover:text-blue-700 font-semibold underline">warehouse management system</Link>, StockFlow provides enterprise-grade inventory control that scales with your business—completely free forever.
            </p>
            <p className="text-md md:text-md text-gray-600 mb-8 max-w-2xl mx-auto">
              Stop stockouts. Recover dead stock capital. Track inventory in real-time with your phone. 
              <span className="font-semibold text-gray-900"> Join 500+ businesses using StockFlow - free forever.</span>
            </p>
          </div>

          {/* Primary CTA with Email Capture */}
          <div className="max-w-md mx-auto mb-12">
            <div>
       
              <Button 
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Start Free - No Credit Card Required
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-center text-sm text-gray-500 mt-3">
                ✓ Free forever  ✓ 2 minute setup  ✓ Cancel anytime
              </p>
            </div>
          </div>
        </div>
        </section>



        {/* Social Proof - Logo Bar */}
        <section className="py-16 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-slate-500 text-sm font-semibold uppercase tracking-wider mb-8">
              Powering Inventory Management for Industry Leaders
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale">
              {['Acme Manufacturing', 'TechParts Inc', 'GlobalAssembly', 'Precision Tools', 'IndustrialCo', 'MakerSpace'].map((company, i) => (
                <div key={i} className="text-2xl font-black text-slate-700">{company}</div>
              ))}
            </div>
          </div>
        </section>


      {/* Problem-Solution Section */}
      <section className="py-16 px-4 bg-white">
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
      <section className="py-16 px-4 bg-blue-50">
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
                features: ["Works offline", "No special hardware", "iOS & Android"]
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
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-lg text-blue-600 font-semibold mb-4">{feature.benefit}</p>
                <ul className="space-y-2">
                  {feature.features.map((f, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
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
              <div key={idx} className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-md">
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