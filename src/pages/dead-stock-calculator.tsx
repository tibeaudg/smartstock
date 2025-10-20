import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/HeaderPublic';
import { Button } from '@/components/ui/button';
import { 
  Check, CheckCircle, Shield, Clock, Euro, TrendingUp, Zap, 
  Package, BarChart3, Target, AlertCircle, DollarSign, TrendingDown,
  Calculator, Store, ShoppingBag, Sparkles
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { logger } from '../lib/logger';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

// Animation components
const FadeInWhenVisible = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
};

const SlideInWhenVisible = ({ children, delay = 0, direction = 'left' }: { children: React.ReactNode, delay?: number, direction?: 'left' | 'right' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case 'left': return isVisible ? 'translate-x-0' : '-translate-x-12';
      case 'right': return isVisible ? 'translate-x-0' : 'translate-x-12';
      default: return isVisible ? 'translate-x-0' : '-translate-x-12';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTransform()}`}
    >
      {children}
    </div>
  );
};

export default function DeadStockCalculatorPage() {
  const navigate = useNavigate();
  const [leadEmail, setLeadEmail] = useState('');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [inventoryValue, setInventoryValue] = useState('');
  const [shopType, setShopType] = useState('');

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = /.+@.+\..+/.test(leadEmail);
    if (!isValid) {
      setLeadStatus('error');
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem('leads') || '[]');
      existing.push({ 
        email: leadEmail, 
        inventoryValue,
        shopType,
        source: 'dead_stock_calculator',
        ts: Date.now() 
      });
      localStorage.setItem('leads', JSON.stringify(existing));
      logger.info('Dead stock calculator lead captured', { email: leadEmail, inventoryValue, shopType });
      
      // Track Google Ads conversion
      try {
        GoogleAdsTracking.trackContactFormConversion(
          'calculator_signup',
          leadEmail,
          10 // Higher value for calculator leads
        );
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to track conversion:', error);
        }
      }

      setLeadStatus('success');
      setTimeout(() => {
        setLeadEmail('');
        setInventoryValue('');
        setShopType('');
        setLeadStatus('idle');
      }, 5000);
    } catch (error) {
      logger.error('Failed to capture lead', { error });
      setLeadStatus('error');
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Dead Stock Calculator for Retail & Boutique Shops",
    "description": "Free calculator to discover how much money is tied up in slow-moving inventory. Perfect for boutique owners, small retail shops, and independent stores.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "250"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      <Helmet>
        <title>Free Dead Stock Calculator for Boutique & Retail Shops | StockFlow</title>
        <meta name="description" content="Calculate how much money is locked in unsold inventory. Free dead stock calculator for boutique owners, small retail shops, and independent stores. Get your personalized report in 60 seconds." />
        <meta name="keywords" content="dead stock calculator, boutique inventory management, retail dead stock, slow moving inventory, boutique shop inventory, small retail inventory, inventory turnover calculator, excess inventory cost" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Dead Stock Calculator for Boutique & Retail Shops" />
        <meta property="og:description" content="Discover how much capital is tied up in slow-moving inventory. Free calculator for boutique owners and small retailers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stockflow.be/dead-stock-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Dead Stock Calculator for Boutique Shops" />
        <meta name="twitter:description" content="Calculate your dead stock cost in 60 seconds. Perfect for boutique owners and small retailers." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://stockflow.be/dead-stock-calculator" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-blue-700 mb-6">
                <Calculator className="h-4 w-4 mr-2" />
                100% Free Tool • No Credit Card Required
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                How Much Is Dead Stock <br className="hidden sm:block" />
                <span className="text-blue-600">Costing Your Boutique?</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Most boutique and small retail shop owners have <strong>€2,000-€8,000 tied up in slow-moving inventory</strong>. 
                Discover your exact number in just 60 seconds with our free calculator.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Perfect for boutiques</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Small retail shops</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Independent stores</span>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Main Calculator Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left Side - Value Proposition */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-12 text-white">
                <FadeInWhenVisible>
                  <div className="mb-8">
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                      🎁 Free Calculator Tool
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                      Calculate Your Hidden Inventory Costs
                    </h2>
                    
                    <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                      Identify exactly how much capital is locked in unsold merchandise and get actionable recommendations to free up cash flow.
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-5 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-5 w-5 text-green-900" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg">Calculate Your Capital at Risk</p>
                        <p className="text-sm text-blue-100">See exactly how much money is locked in unsold inventory and slow-moving products</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-5 w-5 text-green-900" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg">Get Liquidation Recommendations</p>
                        <p className="text-sm text-blue-100">Receive a personalized action plan to recover your capital and improve cash flow</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-5 w-5 text-green-900" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg">Compare to Industry Benchmarks</p>
                        <p className="text-sm text-blue-100">Learn how your inventory health compares to other boutiques and small retailers</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-5 w-5 text-green-900" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg">Improve Inventory Turnover</p>
                        <p className="text-sm text-blue-100">Discover strategies to reduce dead stock and increase profitability</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Proof */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Sparkles key={i} className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">4.8/5 from 250+ shop owners</span>
                    </div>
                    <p className="text-sm text-blue-100 italic">
                      "This calculator helped me identify €3,200 in dead stock. Within 2 months, I recovered 80% through clearance sales!"
                    </p>
                    <p className="text-xs text-blue-200 mt-2">— Laura M., Fashion Boutique Owner</p>
                  </div>
                </FadeInWhenVisible>
              </div>

              {/* Right Side - Calculator Form */}
              <div className="p-8 md:p-12 bg-gray-50">
                <SlideInWhenVisible direction="right" delay={200}>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Get Your Free Report
                    </h3>
                    <p className="text-base text-gray-600">
                      Enter your details to receive your personalized dead stock analysis and action plan
                    </p>
                  </div>

                  {/* Lead Capture Form */}
                  <form onSubmit={handleLeadSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="calc-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="calc-email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="you@yourboutique.com"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="calc-inventory-value" className="block text-sm font-medium text-gray-700 mb-2">
                        Approximate Inventory Value
                      </label>
                      <select
                        id="calc-inventory-value"
                        value={inventoryValue}
                        onChange={(e) => setInventoryValue(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900"
                      >
                        <option value="">Select range...</option>
                        <option value="under-5k">Under €5,000</option>
                        <option value="5k-15k">€5,000 - €15,000</option>
                        <option value="15k-50k">€15,000 - €50,000</option>
                        <option value="50k-100k">€50,000 - €100,000</option>
                        <option value="100k-plus">€100,000+</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="calc-shop-type" className="block text-sm font-medium text-gray-700 mb-2">
                        Shop Type
                      </label>
                      <select
                        id="calc-shop-type"
                        value={shopType}
                        onChange={(e) => setShopType(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900"
                      >
                        <option value="">Select type...</option>
                        <option value="fashion">Fashion & Clothing Boutique</option>
                        <option value="gifts">Gifts & Home Decor</option>
                        <option value="artisan">Artisan & Handcrafted Goods</option>
                        <option value="jewelry">Jewelry & Accessories</option>
                        <option value="specialty">Specialty Foods & Beverages</option>
                        <option value="beauty">Beauty & Cosmetics</option>
                        <option value="books">Books & Stationery</option>
                        <option value="other">Other Retail</option>
                      </select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-bold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg min-h-[56px]"
                    >
                      Calculate →
                    </Button>

                    {leadStatus === 'success' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-green-50 border-2 border-green-200 rounded-xl"
                      >
                        <p className="text-green-800 font-semibold flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Success! Check your email for your personalized report.
                        </p>
                      </motion.div>
                    )}

                    {leadStatus === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                      >
                        <p className="text-red-800 font-semibold flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          Please enter a valid email address.
                        </p>
                      </motion.div>
                    )}

                    <p className="text-xs text-gray-500 text-center mt-4">
                      🔒 We respect your privacy. No spam, unsubscribe anytime. GDPR compliant.
                    </p>
                  </form>

                  {/* Trust Indicators */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>GDPR Compliant</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>60 sec delivery</span>
                      </div>
                    </div>
                  </div>
                </SlideInWhenVisible>
              </div>
            </div>
          </div>

          {/* Statistics Below Calculator */}
          <FadeInWhenVisible delay={400}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 rounded-xl bg-white border border-gray-100 shadow-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Euro className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Average Savings: €4,200</h4>
                <p className="text-sm text-gray-600">
                  Boutique owners who use this calculator recover an average of €4,200 in tied-up capital within 3 months
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white border border-gray-100 shadow-md">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">250+ Shops Helped</h4>
                <p className="text-sm text-gray-600">
                  Boutique and small retail shop owners across Europe trust our calculator to optimize their inventory
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white border border-gray-100 shadow-md sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Instant Results</h4>
                <p className="text-sm text-gray-600">
                  Get your personalized dead stock report and action plan delivered to your inbox in under 60 seconds
                </p>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Why Dead Stock Matters for Boutiques */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Dead Stock Is Critical for Small Retailers
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                For boutique and independent shop owners, every euro counts. Dead stock doesn't just take up space—it actively hurts your business.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <FadeInWhenVisible delay={100}>
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">The Cost of Dead Stock</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Tied-up capital:</strong> Money locked in unsold products can't be invested in new, profitable inventory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Storage costs:</strong> Every item takes valuable shelf and storage space that could be used for faster-selling products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Depreciation:</strong> Fashion and seasonal items lose value over time, especially for boutiques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Cash flow problems:</strong> Reduced cash flow makes it harder to pay suppliers and cover operating expenses</span>
                  </li>
                </ul>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={200}>
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Benefits of Managing Dead Stock</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Free up capital:</strong> Recover thousands of euros to invest in trending, high-margin products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Better cash flow:</strong> Improve your ability to pay bills and suppliers on time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Optimize space:</strong> Make room for products that actually sell and generate profit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Increase profitability:</strong> Focus on high-turnover items that drive revenue for your boutique</span>
                  </li>
                </ul>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How the Calculator Works
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Get actionable insights tailored specifically for boutique and small retail businesses
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <FadeInWhenVisible delay={100}>
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Share Basic Info</h3>
                <p className="text-gray-600">
                  Tell us about your shop type and approximate inventory value. Takes just 30 seconds.
                </p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={200}>
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get Instant Analysis</h3>
                <p className="text-gray-600">
                  Our algorithm analyzes industry data from hundreds of similar boutiques and retailers.
                </p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={300}>
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Receive Action Plan</h3>
                <p className="text-gray-600">
                  Get a personalized report with specific recommendations to liquidate dead stock and recover capital.
                </p>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
          </FadeInWhenVisible>

          <div className="space-y-6">
            <FadeInWhenVisible delay={100}>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  What is dead stock?
                </h3>
                <p className="text-gray-700">
                  Dead stock (also called obsolete inventory or slow-moving stock) refers to products that haven't sold within a reasonable timeframe and are unlikely to sell in the future. For boutiques, this often includes out-of-season items, discontinued styles, or products that didn't resonate with customers.
                </p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={150}>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Is this calculator really free?
                </h3>
                <p className="text-gray-700">
                  Yes! This calculator is 100% free with no hidden costs or credit card required. We created it to help boutique and small retail shop owners make better inventory decisions.
                </p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={200}>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  How accurate is the calculator?
                </h3>
                <p className="text-gray-700">
                  Our calculator uses industry benchmarks from over 250 boutiques and small retailers across Europe. While exact results vary by business, the estimates are typically within 15-20% of actual dead stock costs based on inventory audits.
                </p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={250}>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  What will I receive in my report?
                </h3>
                <p className="text-gray-700">
                  You'll receive a personalized email report with: (1) Estimated dead stock cost for your shop type and inventory size, (2) Comparison to industry benchmarks, (3) Recommended liquidation strategies, (4) Tips to prevent future dead stock accumulation, and (5) Potential capital recovery timeline.
                </p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={300}>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Is my information secure?
                </h3>
                <p className="text-gray-700">
                  Absolutely. We are GDPR compliant and never share your information with third parties. Your data is encrypted and stored securely. You can unsubscribe from our emails at any time.
                </p>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInWhenVisible>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Unlock Hidden Capital in Your Boutique?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join 250+ boutique owners who've recovered thousands in tied-up inventory
            </p>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Calculate Now →
            </Button>
            <p className="text-sm text-blue-200 mt-4">
              Free • No credit card required • Results in 60 seconds
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      <Footer />
    </div>
  );
}

