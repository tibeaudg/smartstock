import React, { useState, useRef, lazy } from 'react';
import { Header } from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Carousel from './ui/carousel';
import { 
  Package, BarChart3, Users, Shield, Check, TrendingUp, Zap, Star, Clock, Euro, Target, 
  ChevronLeft, ChevronRight, Scan, Truck, ArrowRight, Play, Award, Globe, Smartphone, 
  CheckCircle, Rocket, Crown, Sparkles, Timer, Facebook, Twitter, Linkedin, Instagram,
  Repeat, Camera
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { motion } from 'framer-motion';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import OptimizedImage from '@/components/OptimizedImage';
import { Helmet } from 'react-helmet-async';
import { logger } from '../lib/logger';
import { useCurrency } from '@/hooks/useCurrency';
import { generateComprehensiveStructuredData } from '../lib/structuredData';
// import { useWebsiteTracking } from '@/hooks/useWebsiteTracking';
// import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';
import { ConversionTrackingTest } from './ConversionTrackingTest';
import { SavingsCalculator } from './SavingsCalculator';
import Footer from './Footer.js';

// CLS monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Dynamic import to prevent SSR issues
  import('../../scripts/cls-monitor.js').then(() => {
    console.log('🔍 CLS monitoring loaded');
  }).catch((error) => {
    console.warn('CLS monitoring failed to load:', error);
  });
}

// Lazy load non-critical components
const SocialShare = lazy(() => import('./SocialShare'));

// Lazy load heavy components for better performance
// Removed unused lazy imports: TestimonialsSection, FeaturesSection, VideoSection

// Enhanced animation components with consistent effects

  const FadeInWhenVisible = ({ children, delay = 0, direction = 'up', duration = 700 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
      // Reduce animations on mobile for better performance
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

    const getTransform = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      if (isMobile) return 'translate-y-0';
      
      switch (direction) {
        case 'left': return isVisible ? 'translate-x-0' : '-translate-x-8';
        case 'right': return isVisible ? 'translate-x-0' : 'translate-x-8';
        case 'up': return isVisible ? 'translate-y-0' : 'translate-y-8';
        case 'down': return isVisible ? 'translate-y-0' : '-translate-y-8';
        default: return isVisible ? 'translate-y-0' : 'translate-y-4';
      }
    };

  return (
      <div 
        ref={ref} 
        className={`transition-all duration-${duration} ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${getTransform()}`}
      >
        {children}
      </div>
    );
  };

const SlideInWhenVisible = ({ children, delay = 0, direction = 'left' }) => {
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

const ScaleInWhenVisible = ({ children, delay = 0, duration = 700 }) => {
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
      className={`transition-all duration-${duration} ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      {children}
    </div>
  );
};

// New animation components for consistent effects
const StaggerInWhenVisible = ({ children, delay = 0, staggerDelay = 100 }) => {
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
      style={{ transitionDelay: `${staggerDelay}ms` }}
    >
      {children}
    </div>
  );
};

const BounceInWhenVisible = ({ children, delay = 0 }) => {
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
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`}
      style={{
        transitionTimingFunction: isVisible ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'ease-out'
      }}
    >
      {children}
    </div>
  );
};

const SlideUpWhenVisible = ({ children, delay = 0, duration = 800 }) => {
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
      className={`transition-all duration-${duration} ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
};

// Carousel component for mobile display (with ARIA and swipe)
const MobileCarousel = ({ items, renderItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (delta > threshold) nextSlide();
    if (delta < -threshold) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials and benefits carousel"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4" aria-label={`Slide ${index + 1} of ${items.length}`}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-4 space-x-2" role="tablist" aria-label="Carousel navigation">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </>
      )}
    </div>
  );
};

export const HomePage = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  // ALL HOOKS DISABLED TO PREVENT CRASHES
  // usePageRefresh();
  // useWebsiteTracking();
  
  // Initialize tracking with comprehensive error suppression
  React.useEffect(() => {
    // Comprehensive global error handler for all tracking services
    const handleTrackingError = (event: ErrorEvent) => {
      const errorMessage = event.message || '';
      const errorSource = event.filename || '';
      
      // Suppress Facebook Pixel errors
      if (errorMessage.includes('facebook.com') || errorSource.includes('fbevents')) {
        event.preventDefault();
        return false;
      }
      
      // Suppress Google Ads errors
      if (errorMessage.includes('googleadservices') || errorMessage.includes('googleads')) {
        event.preventDefault();
        return false;
      }
      
      // Suppress CORS errors
      if (errorMessage.includes('CORS') || errorMessage.includes('Access-Control-Allow-Origin')) {
        event.preventDefault();
        return false;
      }
    };

    // Add error listeners
    window.addEventListener('error', handleTrackingError);
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.toString().includes('googleadservices')) {
        event.preventDefault();
      }
    });

    // Only initialize tracking in production
    if (process.env.NODE_ENV === 'production') {
      const timer = setTimeout(() => {
        try {
          GoogleAdsTracking.initializeGoogleAdsTracking();
          GoogleAdsTracking.trackPageViewConversion('homepage', 1, {
            page_type: 'landing_page',
            conversion_type: 'page_view'
          });
        } catch (error) {
          // Silently fail
        }
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('error', handleTrackingError);
      };
    }
    
    return () => {
      window.removeEventListener('error', handleTrackingError);
    };
  }, []);

  // Cookie consent & exit-intent state
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cookie_consent') !== 'accepted';
    } catch {
      return true;
    }
  });

  // FAQ accordion state
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  // Pricing toggle state
  const [isYearly, setIsYearly] = useState(false);



  const useCases = [
    {
      title: "E-commerce",
      description: "Perfect for online stores managing multiple product lines and seasonal inventory fluctuations.",
      icon: "🛒"
    },
    {
      title: "Retail",
      description: "Ideal for physical stores needing real-time inventory tracking and point-of-sale integration.",
      icon: "🏪"
    },
    {
      title: "Wholesale",
      description: "Great for wholesale businesses managing large quantities and multiple suppliers.",
      icon: "📦"
    },
    {
      title: "Manufacturing",
      description: "Essential for manufacturers tracking raw materials, work-in-progress, and finished goods.",
      icon: "🏭"
    }
  ];




  const handleLoginClick = () => {
    logger.info('CTA click', { id: 'start-now' });
    
    // Track Google Ads conversion for registration intent with error handling
    try {
      GoogleAdsTracking.trackCustomConversion(
        'start_now_click',
        'AW-17574614935',
        1,
        {
          cta_location: 'hero_section',
          cta_type: 'primary_button',
          conversion_type: 'registration_intent'
        }
      );
    } catch (error) {
      // Silently fail in production, only log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Google Ads tracking failed:', error);
      }
    }
    
    navigate('/pricing');
  };

  const handlePricingClick = () => {
    logger.info('CTA click', { id: 'pricing' });
    
    // Track Google Ads conversion for pricing page view with error handling
    try {
      GoogleAdsTracking.trackPricingViewConversion('homepage_cta');
    } catch (error) {
      // Silently fail in production, only log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Google Ads tracking failed:', error);
      }
    }
    
    navigate('/pricing');
  };

  const handleHowItWorksClick = () => {
    logger.info('CTA click', { id: 'how-it-works' });
    
    // Track Google Ads conversion for demo interest with error handling
    try {
      GoogleAdsTracking.trackCustomConversion(
        'demo_interest',
        'AW-17574614935',
        1,
        {
          cta_location: 'hero_section',
          cta_type: 'secondary_button',
          conversion_type: 'demo_interest'
        }
      );
    } catch (error) {
      // Silently fail in production, only log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Google Ads tracking failed:', error);
      }
    }
    
    scrollToSection('video-section');
  };

  // Exit-intent popup removed

  const acceptCookies = () => {
    try { localStorage.setItem('cookie_consent', 'accepted'); } catch {}
    setShowCookieBanner(false);
  };

  // Contact form logic removed - now on separate /contact page

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 64; // 16 * 4 = 64px
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Retailer-focused FAQ section
  const faqData = [
    {
      question: "Does StockFlow work with my POS system or cash register?",
      answer: "Yes! StockFlow integrates with most modern POS systems including Square, Shopify POS, Lightspeed, and Clover. You can also use StockFlow standalone — many retailers use it to track backroom inventory while their POS handles the shop floor. We offer CSV export/import to sync with any system. If you have a specific POS, contact us and we'll confirm compatibility.",
      category: "POS Integration",
      benefit: "Works with major POS systems"
    },
    {
      question: "Can I track inventory across multiple shop locations?",
      answer: "Absolutely! You can manage inventory across multiple store locations, warehouses, or stockrooms. See stock levels at each location in real-time, transfer items between locations, and get low-stock alerts per location. Perfect if you have a main shop plus a storage unit, or multiple retail locations. Available on Growth and Premium plans.",
      category: "Multi-Location",
      benefit: "Track multiple stores or stockrooms"
    },
    {
      question: "How many products (SKUs) can I track?",
      answer: "Our Free plan supports up to 100 products — perfect for small shops getting started. Growth plan includes 1,000 products, and Premium supports unlimited products. You can also track product variants (sizes, colors) as separate SKUs. Need more? Contact us for custom limits at no extra charge.",
      category: "Product Limits",
      benefit: "Free: 100 SKUs, Paid: 1,000 - unlimited"
    },
    {
      question: "What are your support hours? Can I get help when I'm in the shop?",
      answer: "Our support team is available Monday-Friday 8AM-8PM and Saturday 9AM-5PM (CET). We respond to emails and chat within 5 minutes during business hours. Need help outside these hours? Our help center has step-by-step guides, and you can always schedule a call. We also offer free onboarding sessions to get you set up.",
      category: "Support Hours",
      benefit: "Support 6 days/week, <5 min response"
    },
    {
      question: "Will you help me get started? I'm not great with technology.",
      answer: "Yes, we'll guide you every step! Every new customer gets a free 30-minute onboarding call where we help you import products, set up scanning, and configure alerts. We also have video tutorials and live chat support. Most shop owners are fully set up in under 10 minutes. If you get stuck, we're just a message away — real people, not bots.",
      category: "Onboarding Help",
      benefit: "Free 1-on-1 setup assistance included"
    },
    {
      question: "Can I track deliveries from suppliers and shipments to customers?",
      answer: "Yes! StockFlow includes delivery note management. Record incoming deliveries from suppliers (with photos and notes), track outgoing shipments to customers, and manage delivery schedules. You can also save supplier contact details and order history. Perfect for managing stock that arrives weekly or monthly from different vendors.",
      category: "Shipping & Deliveries",
      benefit: "Track incoming & outgoing deliveries"
    },
    {
      question: "What if I'm already using Excel or pen and paper?",
      answer: "We make switching easy! Import your Excel inventory list in seconds (we'll help format it if needed). If you use paper, we'll show you how to quickly add products by scanning barcodes or typing them in. Many customers start by entering just their top 20-30 products to test the system. You can always export to Excel anytime if you need a backup.",
      category: "Migration",
      benefit: "Easy import from Excel or manual entry"
    },
    {
      question: "Can I try it free? What if it doesn't work for my shop?",
      answer: "Absolutely! Sign up for our free plan — no credit card required. You get 100 products forever, which is perfect for testing. Try it with your actual products for a week. If it doesn't fit your shop, you can export your data and cancel anytime. Most retailers know within 3 days if StockFlow works for them.",
      category: "Free Trial",
      benefit: "Free forever plan, no commitment"
    }
  ];

  // Trust bar company logos - Real small businesses from around the world
  const trustCompanies = [
    { 
      name: "Bakkerij De Vries", 
      logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=80&fit=crop&crop=center",
      url: "https://www.bakkerijdevries.nl",
      location: "Netherlands"
    },
    { 
      name: "Café Central", 
      logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&h=80&fit=crop&crop=center",
      url: "https://www.cafecentral.be",
      location: "Belgium"
    },
    { 
      name: "Boutique Marie", 
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=80&fit=crop&crop=center",
      url: "https://www.boutiquemarie.fr",
      location: "France"
    },
    { 
      name: "TechStart Solutions", 
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=80&fit=crop&crop=center",
      url: "https://www.techstartsolutions.com",
      location: "Germany"
    },
    { 
      name: "Green Valley Store", 
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=80&fit=crop&crop=center",
      url: "https://www.greenvalleystore.co.uk",
      location: "United Kingdom"
    }
  ];

  // Integration partners
  const integrationPartners = [
    { name: "Partner 1", logo: "/placeholder.svg" },
    { name: "Partner 2", logo: "/placeholder.svg" },
    { name: "Partner 3", logo: "/placeholder.svg" },
    { name: "Partner 4", logo: "/placeholder.svg" },
    { name: "Partner 5", logo: "/placeholder.svg" }
  ];

  // Retail pains → outcomes (no jargon)
  const heroFeatures = [
    {
      icon: TrendingUp,
      title: "Never miss a sale to out-of-stock",
      benefit: "Always know what's running low",
      impact: "Get automatic alerts ",
      detailedDescription: "See stock levels instantly, Get alerts when items run low, Know exactly when to reorder.",
      category: "Stock Tracking",
      visual: "stockout-prevention",
    },
    {
      icon: Euro,
      title: "Reduce overstock & free up cash",
      benefit: "Stop tying up money in slow-moving items",
      impact: "See what sells & what sits on shelves",
      detailedDescription: "Track which products sell fast, Spot items that aren't moving, Make smarter buying decisions.",
      category: "Cash Flow",
      visual: "profit-optimization",
    },
    {
      icon: Smartphone,
      title: "Count inventory in minutes with your phone",
      benefit: "Skip the clipboard & spreadsheets",
      impact: "Scan items with your phone camera",
      detailedDescription: "Use your phone to scan barcodes, Update stock from the shop floor, No computer needed during counts.",
      category: "Mobile Counting",
      visual: "mobile-efficiency",
    },
  ];

  // Secondary features (simple retail language)
  const secondaryFeatures = [
    {
      icon: Shield,
      title: "Your data stays safe",
      benefit: "No need to worry about losing your inventory records",
      description: "Automatic backups every day. Your stock data is secure.",
      category: "Data Safety"
    },
    {
      icon: BarChart3,
      title: "See what's selling",
      benefit: "Know your top sellers at a glance",
      description: "Simple reports show which products move fast and which don't.",
      category: "Sales Insights"
    },
    {
      icon: Clock,
      title: "Get help when stuck",
      benefit: "Real people ready to help in minutes",
      description: "Chat or email support that responds fast when you need it.",
      category: "Support"
    },
    {
      icon: Package,
      title: "Start with what you have",
      benefit: "Import your existing product list",
      description: "Bring in your current inventory from Excel or CSV files.",
      category: "Easy Setup"
    }
  ];

  // Data metrics for the features section - focused on key benefits
  const dataMetrics = [
    { value: "$2,400", label: "Average Annual Savings", description: "Stop losing money to stockouts" },
    { value: "95%", label: "Customer Satisfaction", description: "Loved by Belgian SMEs" }
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      step: "1",
      title: "Sign Up & Import Data",
      description: "Create your free account and import your existing inventory via CSV/Excel or integrate with your current systems."
    },
    {
      step: "2", 
      title: "Track & Monitor",
      description: "Monitor your inventory in real-time with automated alerts."
    },
    {
      step: "3",
      title: "Grow & Scale",
      description: "Scale your business with advanced analytics and reporting."
    }
  ];

  // Why choose us reasons - Value-focused approach
  const whyChooseUs = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Don't Wait, Start Now",
      description: "Unlike competitors with complex onboarding, our patented Smart Setup gets you running in minutes, not days. See results from day one."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Built Exclusively for SMEs",
      description: "We don't try to serve everyone. Our deep expertise in small business inventory means we understand your challenges better than enterprise-focused solutions."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "100% Satisfaction Guarantee",
      description: "We stand behind our work. If you're not completely satisfied with StockFlow, we'll refund your subscription and help you migrate your data."
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Proprietary AI-Powered Insights",
      description: "Leverage our exclusive machine learning algorithms to optimize your inventory 24/7, something manual tracking simply can't match."
    }
  ];

  // Trust-building statistics
  const trustStats = [
    { number: "98%", label: "Customer Retention" },
    { number: "$2M+", label: "Inventory Value Managed" },
  ];
  
  const testimonials = [
    {
      name: "Laura Peeters",
      role: "Owner, De Koffieboetiek",
      title: "Coffee Shop Owner",
      quote: "StockFlow's automatic reorder system increased our inventory accuracy by 95% and cut our stockouts by 80% in the first quarter. We went from losing $400/month on expired products to zero waste. The ROI was immediate.",
      avatar: '/Laura.png',
      rating: 5,
      company: "De Koffieboetiek",
      location: "Ghent, Belgium",
      industry: "Hospitality",
      savings: `${formatPrice(2400)}/year saved`,
      timeSaved: "8 hours/week",
      specificResults: [
        "95% inventory accuracy improvement",
        "80% reduction in stockouts", 
        "$400/month waste elimination",
        "Immediate ROI in first quarter"
      ],
      beforeAfter: {
        before: "Manual tracking, frequent stockouts, $400/month waste",
        after: "95% accuracy, zero waste, automated reorders"
      }
    },
    {
      name: "Tom De Wit",
      role: "Operations Manager, TechOnderdelen BV",
      title: "Electronics Distributor",
      quote: "When we had a critical inventory discrepancy worth $15,000, StockFlow's real-time tracking identified the issue in under 5 minutes. Their support team resolved it completely within 2 hours. We've never had such fast, reliable inventory management.",
      avatar: '/jan.png',
      rating: 5,
      company: "TechOnderdelen BV",
      location: "Antwerp, Belgium",
      industry: "Technology",
      savings: `${formatPrice(5200)}/year saved`,
      timeSaved: "12 hours/week",
      specificResults: [
        "$15,000 discrepancy resolved in 5 minutes",
        "2-hour complete resolution time",
        "Zero inventory discrepancies since implementation",
        "12 hours/week time savings"
      ],
      beforeAfter: {
        before: "Manual tracking, frequent discrepancies, slow resolution",
        after: "Real-time accuracy, instant problem detection, 2-hour resolution"
      }
    },
    {
      name: "Anke Willems",
      role: "Studio Manager, Creatief Atelier",
      title: "Creative Workshop Owner",
      quote: "StockFlow's barcode system reduced our material ordering time from 3 hours to 15 minutes. We now track 200+ art supplies with 100% accuracy. Our workshop efficiency increased by 40% in the first month alone.",
      avatar: '/anke.png',
      rating: 5,
      company: "Creatief Atelier",
      location: "Bruges, Belgium",
      industry: "Creative",
      savings: `${formatPrice(1800)}/year saved`,
      timeSaved: "6 hours/week",
      specificResults: [
        "3 hours → 15 minutes ordering time",
        "200+ items tracked with 100% accuracy",
        "40% efficiency increase in first month",
        "6 hours/week time savings"
      ],
      beforeAfter: {
        before: "3-hour manual ordering, inventory confusion, efficiency issues",
        after: "15-minute automated ordering, 100% accuracy, 40% efficiency boost"
      }
    }
  ];

  // Benefits section
  const benefits = [
    {
      icon: <Euro className="h-8 w-8" />,
      title: "100% Free Forever",
      description: "No hidden costs, no limits. Completely free inventory management for SMEs."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Get Started Immediately",
      description: "No complex setup or training required. Start your inventory management within 5 minutes."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Specifically for SMEs",
      description: "Developed with the needs of businesses in mind. Professional support and local expertise."
    }
  ];

  // --- BEGIN USP DATA ---
  const usps = [
    {
      icon: <Package className="h-8 w-8" />,
      title: "Track stock easily",
      desc: "See what's in store, what's in the backroom, and what needs ordering.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Know what's selling", 
      desc: "Spot your best sellers and slow movers to make better buying choices.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Your whole team can use it",
      desc: "Everyone sees the same stock numbers, no more asking around.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Your data stays safe",
      desc: "Automatic backups mean you won't lose your inventory records.",
    },
  ];
  // --- EINDE USP DATA ---

  // --- BEGIN SUBSCRIPTION FEATURES DATA ---
  const subscriptionFeatures = [
    {
      icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
      title: "See What's Selling",
      description: "Know which products move fast and which ones sit on shelves.",
      features: [
        "View current stock levels",
        "See your best sellers",
        "Spot slow-moving items",
        "Export reports to Excel"
      ],
      tier: "growth",
      image: "/placeholder.svg"
    },
    {
      icon: <Scan className="h-12 w-12 text-green-600" />,
      title: "Scan with Your Phone",
      description: "Count stock faster using your phone camera instead of paper.",
      features: [
        "Scan barcodes with phone",
        "Count multiple items quickly",
        "Print your own barcodes",
        "Works without internet"
      ],
      tier: "growth",
      image: "/placeholder.svg"
    },
    {
      icon: <Truck className="h-12 w-12 text-purple-600" />,
      title: "Track Deliveries",
      description: "Keep track of what comes in from suppliers and goes out to customers.",
      features: [
        "Record deliveries received",
        "Track outgoing orders",
        "Save supplier details",
        "Schedule deliveries"
      ],
      tier: "premium",
      image: "/placeholder.svg"
    }
  ];
  // --- EINDE SUBSCRIPTION FEATURES DATA ---

  // --- BEGIN CAPABILITIES DATA ---
  const capabilities = [
    {
      icon: <Users className="h-12 w-12" />,
      title: "Your whole team can use it",
      desc: "Everyone sees the same stock numbers, no more asking around or confusion.",
      learnMore: "#",
    },
    {
      icon: <BarChart3 className="h-12 w-12" />,
      title: "See what's selling",
      desc: "Know which products sell fast and which ones don't move.",
      learnMore: "#",
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Your data stays safe",
      desc: "Automatic daily backups mean you won't lose your inventory records.",
      learnMore: "#",
    },
  ];
  // --- EINDE CAPABILITIES DATA ---

  // --- BEGIN FEATURE DATA ---
  const landingFeatures = [
    {
      title: "Never miss a sale to out-of-stock",
      subtitle: "Stock Tracking",
      desc: "Get alerts on your phone when items run low. Always know what needs ordering before you sell out.",
      benefits: [
        "See stock levels instantly",
        "Get alerts when items run low",
        "Know exactly when to reorder",
        "Track both shop floor & backroom"
      ],
      icon: <Package className="h-8 w-8 text-white" />,
      gradient: "from-blue-500 to-blue-700",
      bgPattern: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500",
      stats: "Save $2,400+ annually",
    },
    {
      title: "Reduce overstock & free up cash",
      subtitle: "Sales Insights",
      desc: "See which products sell fast and which sit on shelves. Stop tying up money in items that don't move.",
      benefits: [
        "Track which products sell fast",
        "Spot items that aren't moving",
        "See your profit on each product",
        "Make smarter buying decisions"
      ],
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      gradient: "from-green-500 to-green-700",
      bgPattern: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-500",
      stats: "Increase profits by 15-25%",
    },
    {
      title: "Count inventory in minutes with your phone",
      subtitle: "Mobile Counting",
      desc: "Skip the clipboard and spreadsheets. Use your phone to scan barcodes and update stock from the shop floor.",
      benefits: [
        "Scan barcodes with your phone",
        "Update stock from anywhere in store",
        "Works without internet connection",
        "No computer needed during counts"
      ],
      icon: <Smartphone className="h-8 w-8 text-white" />,
      gradient: "from-purple-500 to-purple-700",
      bgPattern: "bg-purple-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-500",
      stats: "Save 8 hours per week",
    }
  ];
  // --- EINDE FEATURE DATA ---

  // Lead capture state
  const [leadEmail, setLeadEmail] = useState('');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = /.+@.+\..+/.test(leadEmail);
    if (!isValid) {
      setLeadStatus('error');
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem('leads') || '[]');
      existing.push({ email: leadEmail, ts: Date.now() });
      localStorage.setItem('leads', JSON.stringify(existing));
      logger.info('Lead captured', { email: leadEmail });
      
      // Track Google Ads conversion for lead capture with error handling
      try {
        GoogleAdsTracking.trackContactFormConversion(
          'email_signup',
          leadEmail,
          5 // Assign value to email signups
        );
      } catch (error) {
        // Silently fail in production, only log in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Google Ads tracking failed:', error);
        }
      }
      
      setLeadStatus('success');
      setLeadEmail('');
    } catch (err) {
      setLeadStatus('error');
    }
  };

  // Enhanced structured data for better search engine understanding
  const structuredData = [
    // Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "StockFlow",
      "url": "https://www.stockflow.be",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflow.be/logo.png",
        "width": 200,
        "height": 60
      },
      "description": "Free inventory management software for SMEs",
      "foundingDate": "2023",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+32-123-456-789",
        "contactType": "customer service",
        "email": "info@stockflow.be",
        "availableLanguage": ["English", "Dutch", "French", "German"]
      },
      "sameAs": [
        "https://www.linkedin.com/company/stockflow",
        "https://www.facebook.com/stockflowapp",
        "https://twitter.com/stockflowapp",
        "https://www.instagram.com/stockflowapp",
        "https://www.youtube.com/channel/stockflow",
        "https://github.com/stockflow"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BE",
        "addressLocality": "Belgium"
      }
    },
    // Software Application Schema
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "StockFlow - Inventory Management for Retail Shops",
      "description": "Mobile inventory management for small retail stores. Track shop floor and backroom stock with phone scanning. Stop stockouts, reduce overstock, count inventory in minutes.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "softwareVersion": "1.0",
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "offers": [
        {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": "Free plan - Perfect for small retail shops with up to 100 products",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01"
        },
        {
          "@type": "Offer",
          "price": "29",
          "priceCurrency": "EUR",
          "description": "Growth plan - For growing retail stores with multi-location support",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      },
      "audience": {
        "@type": "BusinessAudience",
        "audienceType": "Small Retail Businesses",
        "geographicArea": {
          "@type": "Place",
          "name": "Belgium and Europe"
        }
      },
      "author": {"@type": "Organization", "name": "StockFlow"},
      "publisher": {"@type": "Organization", "name": "StockFlow", "logo": {"@type": "ImageObject", "url": "https://www.stockflow.be/logo.png"}},
      "image": ["https://www.stockflow.be/Inventory-Management.png", "https://www.stockflow.be/optimized/desktop.png"],
      "screenshot": "https://www.stockflow.be/optimized/desktop.png",
      "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/"},
      "featureList": [
        "Mobile barcode scanning for shop floor counting",
        "Track shop floor and backroom stock separately",
        "Low stock alerts on phone", 
        "Multi-location inventory for retail chains",
        "POS system integration (Square, Shopify, Lightspeed)",
        "Simple reports on bestsellers and slow movers",
        "Works on any smartphone - no special hardware",
        "CSV import from Excel spreadsheets"
      ]
    },
    // WebPage Schema
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Inventory Management for Small Retail Shops",
      "description": "Track stock across shop floor and backroom with your phone. Stop stockouts, reduce overstock, count inventory in minutes. Built for small retail stores.",
      "url": "https://www.stockflow.be/",
      "mainEntity": {
        "@type": "SoftwareApplication",
        "name": "StockFlow"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.stockflow.be/"
          }
        ]
      },
      "isPartOf": {
        "@type": "WebSite",
        "name": "StockFlow",
        "url": "https://www.stockflow.be"
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2"]
      }
    },
    // LocalBusiness Schema - Supporting small retailers
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "StockFlow - Retail Inventory Software",
      "description": "Inventory management software designed specifically for small retail shops, local stores, and boutiques.",
      "url": "https://www.stockflow.be/",
      "logo": "https://www.stockflow.be/logo.png",
      "image": "https://www.stockflow.be/Inventory-Management.png",
      "priceRange": "Free - €29/month",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BE",
        "addressLocality": "Belgium"
      },
      "areaServed": [
        {
          "@type": "Country",
          "name": "Belgium"
        },
        {
          "@type": "Country",
          "name": "Netherlands"
        },
        {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": "50.8503",
            "longitude": "4.3517"
          },
          "geoRadius": "500000"
        }
      ],
      "makesOffer": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Retail Inventory Management Software",
            "description": "Mobile-first inventory tracking for small retail shops"
          },
          "price": "0",
          "priceCurrency": "EUR"
        }
      ],
      "audience": {
        "@type": "Audience",
        "audienceType": "Small Retail Business Owners"
      }
    },
    // FAQPage Schema
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        ...(faqData as any[]).map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { 
            "@type": "Answer", 
            "text": f.answer,
            "author": {
              "@type": "Organization",
              "name": "StockFlow"
            }
          }
        }))
      ]
    },
    // VideoObject Schema
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "StockFlow Inventory Management Demo",
      "description": "Watch how StockFlow helps businesses manage their inventory efficiently with real-time tracking and analytics.",
      "thumbnailUrl": ["https://www.stockflow.be/Inventory-Management.png"],
      "uploadDate": "2024-01-01",
      "contentUrl": "https://www.stockflow.be/intro_vid.mp4",
      "embedUrl": "https://www.stockflow.be/intro_vid.mp4",
      "duration": "PT3M30S",
      "publisher": {
        "@type": "Organization",
        "name": "StockFlow",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.stockflow.be/logo.png"
        }
      }
    },
    // Product Schema for pricing plans
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "StockFlow Inventory Management Software",
      "description": "Free inventory management software for SMEs",
      "brand": {
        "@type": "Brand",
        "name": "StockFlow"
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Free Plan",
          "price": "0",
          "priceCurrency": "EUR",
          "description": "Basic inventory management for small businesses",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer", 
          "name": "Growth Plan",
          "price": "29",
          "priceCurrency": "EUR",
          "description": "Advanced features for growing businesses",
          "availability": "https://schema.org/InStock"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150"
      }
    },
    // LocalBusiness Schema
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "StockFlow",
      "description": "Free inventory management software for SMEs",
      "url": "https://www.stockflow.be",
      "telephone": "+32-123-456-789",
      "email": "info@stockflow.be",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "50.8503",
        "longitude": "4.3517"
      },
      "openingHours": "Mo-Fr 09:00-17:00",
      "priceRange": "$$"
    }
  ];

  return (
    <div className="bg-white text-gray-900 font-sans">
      <Helmet>
        {/* Non-render-blocking resource optimization */}
        
        {/* Critical images preload with high priority */}
        <link rel="preload" as="image" href="/optimized/desktop.png" media="(min-width: 1024px)" />
        <link rel="preload" as="image" href="/optimized/mobile.png" media="(max-width: 1023px)" />
        <link rel="preload" as="image" href="/optimized/image.png" media="(min-width: 1024px)" />
        <link rel="preload" as="image" href="/optimized/image-mobile.png" media="(max-width: 1023px)" />
        <link rel="preload" as="image" href="/optimized/analytics.png" media="(min-width: 1024px)" />
        <link rel="preload" as="image" href="/optimized/analytics-mobile.png" media="(max-width: 1023px)" />
        <link rel="preload" as="image" href="/logo.png" />
        <link rel="preload" as="image" href="/Inventory-Management.png" />
        
        {/* Font preloading with display swap to prevent render blocking */}
        <link rel="preload" as="font" href="/fonts/inter-var.woff2" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" href="/fonts/inter-var.woff" type="font/woff" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external resources - non-blocking */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Preconnect to critical origins - non-blocking */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* OpenGraph Meta Tags for Social Sharing - Retailer focused */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.stockflow.be/" />
        <meta property="og:title" content="StockFlow - Inventory Management for Small Retail Shops" />
        <meta property="og:description" content="Track stock across shop floor & backroom with your phone. Stop stockouts, reduce overstock, count inventory in minutes. Built for small retail stores. Free plan available." />
        <meta property="og:image" content="https://www.stockflow.be/Inventory-Management.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="StockFlow - Mobile inventory management for retail shops" />
        <meta property="og:site_name" content="StockFlow" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.stockflow.be/" />
        <meta name="twitter:title" content="StockFlow - Inventory Management for Small Retail Shops" />
        <meta name="twitter:description" content="Track stock with your phone. Stop stockouts, reduce overstock, count inventory in minutes. Built for small retail stores." />
        <meta name="twitter:image" content="https://www.stockflow.be/Inventory-Management.png" />
        <meta name="twitter:image:alt" content="StockFlow - Mobile inventory management for retail shops" />
        
        {/* Additional Meta Tags */}
        <meta name="application-name" content="StockFlow" />
        <meta name="apple-mobile-web-app-title" content="StockFlow" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Non-render-blocking CSS loading */}
        <link rel="preload" as="style" href="/index.css" onLoad={() => {}} />
        <noscript>
          {`<link rel="stylesheet" href="/index.css" />`}
        </noscript>
        
        {/* Non-render-blocking JavaScript loading */}
        {/* Note: JavaScript files are handled by Vite bundler automatically */}
        
        {/* Critical CSS inline for above-the-fold content - prevents render blocking */}
        <style>{`
          /* Critical above-the-fold styles - inline to prevent render blocking */
          * { box-sizing: border-box; }
          html { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }
          body { margin: 0; padding: 0; background-color: #ffffff; color: #111827; }
          
          /* Custom Header Font Sizes - Adjust these values to change header sizes */
          /* Format: clamp(minimum_mobile, responsive_scaling, maximum_desktop) */
          .hero-header { font-size: clamp(2.5rem, 5vw, var(--hero-header-size, 8rem)) !important; }
          
          /* Mobile-specific adjustments for hero section */
          @media (max-width: 767px) {
            .hero-header { font-size: 3rem !important; }
            .hero-subtitle { font-size: 1.125rem !important; }
          }
          .features-header { font-size: clamp(2rem, 4vw, var(--features-header-size, 6rem)) !important; }
          .demo-header { font-size: clamp(2rem, 4vw, var(--demo-header-size, 8rem)) !important; }
          .testimonials-header { font-size: clamp(2rem, 4vw, var(--testimonials-header-size, 8rem)) !important; }
          .use-cases-header { font-size: clamp(2rem, 4vw, var(--use-cases-header-size, 8rem)) !important; }
          .cta-header { font-size: clamp(2rem, 4vw, var(--cta-header-size, 8rem)) !important; }
          
          /* Hero section critical styles */
          .bg-white { background-color: #ffffff; }
          .text-gray-900 { color: #111827; }
          .font-sans { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }
          .max-w-7xl { max-width: 80rem; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
          .md\\:py-24 { padding-top: 6rem; padding-bottom: 6rem; }
          .text-center { text-align: center; }
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .sm\\:text-5xl { font-size: 3rem; line-height: 1; }
          .md\\:text-6xl { font-size: 3.75rem; line-height: 1; }
          .lg\\:text-7xl { font-size: 4.5rem; line-height: 1; }
          .font-bold { font-weight: 700; }
          .mb-6 { margin-bottom: 1.5rem; }
          .leading-tight { line-height: 1.25; }
          .block { display: block; }
          .text-blue-600 { color: #2563eb; }
          .text-2xl { font-size: 1.5rem; line-height: 2rem; }
          .sm\\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
          .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .lg\\:text-5xl { font-size: 3rem; line-height: 1; }
          .font-semibold { font-weight: 600; }
          .mt-2 { margin-top: 0.5rem; }
          
          /* Button critical styles */
          .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
          .from-blue-600 { --tw-gradient-from: #2563eb; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0)); }
          .to-blue-700 { --tw-gradient-to: #1d4ed8; }
          .text-white { color: #ffffff; }
          .px-8 { padding-left: 2rem; padding-right: 2rem; }
          .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
          .rounded-xl { border-radius: 0.75rem; }
          .font-semibold { font-weight: 600; }
          .hover\\:from-blue-700:hover { --tw-gradient-from: #1d4ed8; }
          .hover\\:to-blue-800:hover { --tw-gradient-to: #1e40af; }
          .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
          .duration-300 { transition-duration: 300ms; }
          .transform { transform: translateX(var(--tw-translate-x, 0)) translateY(var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1)); }
          .hover\\:scale-105:hover { --tw-scale-x: 1.05; --tw-scale-y: 1.05; }
          .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
          .hover\\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .w-full { width: 100%; }
          .sm\\:w-auto { width: auto; }
          
          /* Flexbox critical styles */
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .sm\\:flex-row { flex-direction: row; }
          .gap-4 { gap: 1rem; }
          .justify-center { justify-content: center; }
          .items-center { align-items: center; }
          
          /* Grid critical styles */
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .gap-6 { gap: 1.5rem; }
          
          /* Responsive utilities */
          @media (min-width: 640px) {
            .sm\\:text-5xl { font-size: 3rem; line-height: 1; }
            .sm\\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
            .sm\\:flex-row { flex-direction: row; }
            .sm\\:w-auto { width: auto; }
            .sm\\:block { display: block; }
          }
          
          @media (min-width: 768px) {
            .md\\:text-6xl { font-size: 3.75rem; line-height: 1; }
            .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            .md\\:py-24 { padding-top: 6rem; padding-bottom: 6rem; }
            .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          }
          
          @media (min-width: 1024px) {
            .lg\\:text-7xl { font-size: 4.5rem; line-height: 1; }
            .lg\\:text-5xl { font-size: 3rem; line-height: 1; }
          }
          
          /* Loading states to prevent layout shift */
          .loading { opacity: 0.7; }
          .loaded { opacity: 1; transition: opacity 0.3s ease-in-out; }
        `}</style>
        
        {/* Non-render-blocking JavaScript loading strategy */}
        <script>{`
          // Load non-critical CSS asynchronously
          function loadCSS(href) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print';
            link.onload = function() { this.media = 'all'; };
            document.head.appendChild(link);
          }
          
          // Load CSS after page load
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
              loadCSS('/index.css');
            });
          } else {
            loadCSS('/index.css');
          }
          
          // Vite handles JavaScript bundling automatically
          // No manual JavaScript loading needed
        `}</script>
      </Helmet>
      <SEO
        title="StockFlow - Inventory Management for Small Retail Shops"
        description="Track stock across shop floor & backroom with your phone. Stop stockouts, reduce overstock, count inventory in minutes. Built for small retail stores. Free plan available."
        keywords="retail inventory management, inventory for retail shops, retail stock management, small retail inventory, shop inventory software, retail store inventory, inventory tracking for retailers, retail inventory app, barcode scanning retail, mobile inventory retail, shop floor inventory, backroom inventory tracking, retail stock control, point of sale inventory, POS inventory integration, retail inventory system, small shop inventory, local store inventory, boutique inventory management, independent retailer inventory, retail inventory software, multi-location retail inventory, inventory management for stores, retail stocktaking, retail inventory counting, retail reorder alerts, retail stock alerts, prevent stockouts retail, reduce overstock retail, retail cash flow, retail inventory free, free retail inventory software, inventory app for shops, retail business software, small business retail inventory, inventory for small retailers, retail inventory Belgium, shop inventory management, store stock management, retail merchandise tracking, retail product tracking, inventory management small retail"
        url="https://www.stockflow.be/"
        hreflang={[
          { lang: 'en', url: 'https://www.stockflow.be/' },
        ]}
        structuredData={structuredData}
      />

      <Header 
        onLoginClick={() => navigate('/auth?mode=login')}
        onNavigate={() => {}}
        simplifiedNav={false}
        hideNotifications={true}
      />



      {/* Hero Section with Video Below */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50 py-12 md:py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Text Content */}
          <div className="text-center mb-6 md:mb-16">
          
              {/* Micro-badge for small retailers */}
              <FadeInWhenVisible delay={100}>
                <div className="flex justify-center mb-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm">
                    Built for small shops & local stores
                  </span>
                </div>
              </FadeInWhenVisible>
          
              <BounceInWhenVisible delay={200}>
                <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-4 md:mb-8 leading-tight px-2">
                  Inventory management made simple
                </h1>
              </BounceInWhenVisible>
              
              <SlideUpWhenVisible delay={400}>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-12 max-w-3xl mx-auto px-2 leading-relaxed">
                  Track stock across front-of-store & backroom, stop stockouts, and spend less time counting.
                </p>
              </SlideUpWhenVisible>
              
              <ScaleInWhenVisible delay={600}>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6 md:mb-8">
                <Button
              onClick={handleLoginClick}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
            >
              Start free today
            </Button>
            <Button
              onClick={() => navigate('/demo')}
              variant="outline"
              className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
            >
              See how it works
            </Button>
                </div>
              </ScaleInWhenVisible>
              
              <FadeInWhenVisible delay={800}>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 px-2">
                  No credit card needed ♦ Unlimited time on Free plan
                </p>
                <p className="text-xs text-gray-400 px-2">
                  Includes a Free Plan for 2 Users/100 Products
                </p>
              </FadeInWhenVisible>
            </div>
            
          {/* Hero Visual: In-Store Scene with Dashboard Overlay */}
          <SlideUpWhenVisible delay={1000}>
            <div className="relative max-w-6xl mx-auto px-2 sm:px-4">
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                {/* Background: Store Scene */}
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                  {/* In-store photo */}
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&crop=center&auto=format&q=80"
                    alt="Store owner managing inventory at retail shop"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Gradient overlay for better contrast */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                  
                  {/* Dashboard Overlay - Desktop View */}
                  <div className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-[200px] sm:w-[280px] md:w-[400px] lg:w-[480px]">
                    <div className="bg-white rounded-lg md:rounded-xl shadow-2xl overflow-hidden border-2 md:border-4 border-white/20 backdrop-blur-sm">
                      {/* Dashboard Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          <span className="text-white font-semibold text-xs sm:text-sm md:text-base">StockFlow</span>
                        </div>
                        <div className="hidden sm:flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-white/30"></div>
                          <div className="w-2 h-2 rounded-full bg-white/30"></div>
                          <div className="w-2 h-2 rounded-full bg-white/30"></div>
                        </div>
                      </div>
                      
                      {/* Dashboard Content Preview */}
                      <div className="p-2 sm:p-4 md:p-6 bg-white">
                        {/* Stock Alert */}
                        <div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start gap-1 sm:gap-2">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1 sm:mt-1.5 rounded-full bg-amber-500 flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-amber-900 truncate">Low Stock Alert</p>
                              <p className="text-[9px] sm:text-xs text-amber-700 mt-0.5 hidden sm:block">3 items need reordering</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Stock Items */}
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex items-center justify-between p-1.5 sm:p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <Package className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 truncate">Coffee Beans</p>
                                <p className="text-[9px] sm:text-xs text-gray-500 hidden sm:block">SKU: CB-001</p>
                              </div>
                            </div>
                            <div className="text-right ml-2 flex-shrink-0">
                              <p className="text-[10px] sm:text-xs md:text-sm font-bold text-red-600">8 left</p>
                              <p className="text-[9px] sm:text-xs text-gray-400 hidden sm:block">Reorder: 50</p>
                            </div>
                          </div>
                          
                          <div className="hidden sm:flex items-center justify-between p-1.5 sm:p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                                <Package className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 truncate">Tea Selection</p>
                                <p className="text-[9px] sm:text-xs text-gray-500">SKU: TS-002</p>
                              </div>
                            </div>
                            <div className="text-right ml-2 flex-shrink-0">
                              <p className="text-[10px] sm:text-xs md:text-sm font-bold text-green-600">145 left</p>
                              <p className="text-[9px] sm:text-xs text-gray-400">In stock</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-200">
                          <div className="flex gap-1 sm:gap-2">
                            <button className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white text-[10px] sm:text-xs font-medium rounded-lg flex items-center justify-center gap-1">
                              <Scan className="h-3 w-3" />
                              <span className="hidden sm:inline">Scan</span>
                            </button>
                            <button className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-medium rounded-lg">
                              Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating badge */}
                    <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                      ✓ Live Dashboard
                    </div>
                  </div>
                  
                  {/* Mobile Scanner Badge */}
                  <div className="hidden sm:block absolute bottom-4 sm:bottom-6 left-2 sm:left-4 md:left-8 bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-xl p-2 sm:p-4 max-w-[160px] sm:max-w-[200px] md:max-w-[240px]">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">Scan with phone</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">Update from shop floor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Key Features Below Image */}
              <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 text-xs sm:text-sm text-gray-600 px-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                  <span>Instant stock alerts</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                  <span>Mobile scanning</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                  <span>No credit card needed</span>
                </div>
              </div>
            </div>
          </SlideUpWhenVisible>

        </div>
      </section>


      {/* One-line Value + 3 Quick Bullets - Above the Fold */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInWhenVisible>
            {/* One-line value proposition */}
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-4 md:mb-8 leading-tight px-2">
                Stop guessing what's in stock
              </h1>
              <p className="text-base md:text-lg text-gray-600">
                Built specifically for small retail shops
              </p>
            </div>
          </FadeInWhenVisible>
          
          {/* 3 Micro-benefits for retailers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <SlideUpWhenVisible delay={100}>
              <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No more "Do we have this?"
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Check stock instantly from your phone — no need to walk to the backroom or call staff
                </p>
              </div>
            </SlideUpWhenVisible>
            
            <SlideUpWhenVisible delay={200}>
              <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Count stock in 10 minutes, not hours
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Scan barcodes with your phone camera instead of writing on clipboards and typing into Excel
                </p>
              </div>
            </SlideUpWhenVisible>
            
            <SlideUpWhenVisible delay={300}>
              <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Stop losing sales to empty shelves
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get alerts before items sell out — reorder the right amount at the right time
                </p>
              </div>
            </SlideUpWhenVisible>
          </div>
        </div>
      </section>


      {/* Short Retail Testimonial Snippets */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-4 md:mb-8 leading-tight px-2">
                Trusted by Local Retailers
              </h1>
              <p className="text-lg md:text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">See Real results from real customers.

</p>
            </div>
          </FadeInWhenVisible>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Testimonial 1 - Coffee Shop */}
            <SlideInWhenVisible direction="left" delay={100}>
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="/Laura.png" 
                    alt="Laura Peeters" 
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Laura Peeters</h4>
                    <p className="text-sm text-gray-600">Owner, De Koffieboetiek</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
                  "We cut stockouts by 80% in the first quarter. No more walking to the backroom 20 times a day — I check stock on my phone while helping customers."
                </blockquote>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    80% fewer stockouts
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <Clock className="h-3 w-3 mr-1" />
                    8 hrs/week saved
                  </span>
                </div>
              </div>
            </SlideInWhenVisible>
            
            {/* Testimonial 2 - Creative Workshop */}
            <SlideInWhenVisible direction="right" delay={200}>
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="/anke.png" 
                    alt="Anke Willems" 
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Anke Willems</h4>
                    <p className="text-sm text-gray-600">Studio Manager, Creatief Atelier</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
                  "Counting 200+ art supplies used to take 3 hours. Now it takes 15 minutes with my phone. I can focus on customers instead of clipboards."
                </blockquote>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    3 hrs → 15 min
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <Smartphone className="h-3 w-3 mr-1" />
                    200+ items tracked
                  </span>
                </div>
              </div>
            </SlideInWhenVisible>
          </div>
          
          {/* Early Adopter Incentive */}
          <FadeInWhenVisible delay={400}>
            <div className="mt-8 text-center">
              <div className="inline-block bg-white rounded-xl shadow-md px-6 py-4 border-2 border-blue-100">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-600">Early adopter bonus:</span> Get 3 months free on any paid plan when you share your success story
                </p>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>


      {/* How It Works - 3 Steps for Retailers */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-4 md:mb-8 leading-tight px-2">
                Start tracking in 3 simple steps
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Get up and running in under 10 minutes.
              </p>
            </div>
          </FadeInWhenVisible>
          
          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 transform -translate-y-1/2" style={{ top: '80px' }}></div>
            
            {/* Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 relative">
              {/* Step 1 */}
              <SlideUpWhenVisible delay={100}>
                <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
                  {/* Step number */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      1
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-4 sm:mb-6 mt-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center">
                    Add products or import CSV
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Type in your products manually or upload your existing inventory list from Excel. Your data imports in seconds.
                  </p>
                  
                  {/* Visual indicator */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Takes 5 minutes</span>
                    </div>
                  </div>
                </div>
              </SlideUpWhenVisible>
              
              {/* Step 2 */}
              <SlideUpWhenVisible delay={200}>
                <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-100">
                  {/* Step number */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      2
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-4 sm:mb-6 mt-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center">
                    Scan & count with your phone
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Use your phone camera to scan barcodes. Update stock from the shop floor or backroom — no laptop needed.
                  </p>
                  
                  {/* Visual indicator */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <span>Works on any phone</span>
                    </div>
                  </div>
                </div>
              </SlideUpWhenVisible>
              
              {/* Step 3 */}
              <SlideUpWhenVisible delay={300}>
                <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100">
                  {/* Step number */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      3
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-4 sm:mb-6 mt-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center">
                    Get alerts & simple reports
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Receive alerts when items run low. See what's selling and what's not with easy-to-read reports.
                  </p>
                  
                  {/* Visual indicator */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span>Automatic updates</span>
                    </div>
                  </div>
                </div>
              </SlideUpWhenVisible>
            </div>
          </div>
          
          {/* CTA below steps */}
          <FadeInWhenVisible delay={400}>
            <div className="text-center mt-12 md:mt-16 px-4">
              <Button
                onClick={handleLoginClick}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
              >
                Start tracking your stock now
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 mt-4">
                Free plan forever • Set up in 10 minutes • No credit card
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>


      {/* Interactive Savings Calculator - Micro-Conversion */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-4 md:mb-8 leading-tight px-2">
                Calculate Your Savings
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get a personalized calculation in under 2 minutes.
              </p>
            </div>
          </FadeInWhenVisible>
          
          <SlideUpWhenVisible delay={200}>
            <SavingsCalculator 
              onCalculate={(savings) => {
                // Track the micro-conversion
                try {
                  GoogleAdsTracking.trackCustomConversion(
                    'savings_calculated',
                    'AW-17574614935',
                    savings,
                    {
                      currency: 'EUR',
                      conversion_type: 'savings_calculated'
                    }
                  );
                } catch (error) {
                  // Silently fail
                }
              }}
              className="max-w-4xl mx-auto"
            />
          </SlideUpWhenVisible>
        </div>
      </section>

      {/* Simple Features for Small Retail Shops */}
      <section id="features-section" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-4 md:mb-8 leading-tight px-2">
                Everything you need, nothing you don't
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Simple tools that save small shops $2,400+ per year
              </p>
            </div>
          </FadeInWhenVisible>
          
          {/* 3 Key Features - Simple Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {heroFeatures.map((feature, index) => (
              <SlideUpWhenVisible key={index} delay={index * 100}>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  {/* Icon */}
                  <div className="mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.impact}
                  </p>
                  
                  {/* Quick bullets */}
                  <ul className="space-y-2">
                    {feature.detailedDescription.split(', ').slice(0, 3).map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SlideUpWhenVisible>
            ))}
          </div>

          {/* Simple CTA */}
          <FadeInWhenVisible delay={400}>
            <div className="text-center px-4">
              <Button
                onClick={handleLoginClick}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
              >
                Try it free for your shop
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 mt-4">
                Free forever • No credit card • 100 products included
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>



      {/* Why Choose Us Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Compelling Headline */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-4 md:mb-8 leading-tight px-2">
              Why Choose StockFlow
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Built specifically for small businesses. 
            </p>
            
            {/* Trust Statistics */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
              {trustStats.map((stat, index) => (
                <div key={index} className="text-center px-2 md:px-4">
                  <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Value-Focused Benefits */}
          <div className="mb-16">
            <Carousel
              itemsPerView={{
                mobile: 1,
                tablet: 2,
                desktop: 4
              }}
              showArrows={true}
              showDots={true}
              autoPlay={false}
              className="px-4"
            >
              {whyChooseUs.map((reason, index) => (
                <motion.div 
                  key={index} 
                  className="text-center bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-3xl mb-6">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                </motion.div>
              ))}
            </Carousel>
          </div>



          {/* Clear Call to Action */}
          <div className="text-center mt-12 px-4">
            <Button
              onClick={handleLoginClick}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
            >
              Start free today
            </Button>

            <p className="text-xs sm:text-sm text-gray-500 mt-4">
              Join 100+ retail shops using StockFlow • Set up in 10 minutes
            </p>
          </div>
        </div>
      </section>


      


      {/* Enhanced FAQ Section */}
      <section id="faq-section" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Compelling Headline */}
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-4 md:mb-8 leading-tight px-2">
                Questions from Shop Owners Like You
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              POS integration, multi-location tracking. 
              </p>
                      
            </div>
          </FadeInWhenVisible>

          {/* FAQ Grid */}
          <div className="mb-16">
            <Carousel
              itemsPerView={{
                mobile: 1,
                tablet: 1,
                desktop: 2
              }}
              showArrows={true}
              showDots={true}
              autoPlay={false}
              className="px-4"
            >
              {faqData.map((faq, index) => (
                <StaggerInWhenVisible 
                  key={index} 
                  delay={index * 150}
                  staggerDelay={index * 75}
                >
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                    {/* FAQ Header */}
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* Category Badge */}
                          <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                            {faq.category}
                          </div>
                          
                          {/* Question */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-relaxed">
                            {faq.question}
                          </h3>
                          
                          {/* Benefit Preview */}
                          <div className="text-sm text-blue-600 font-medium">
                            {faq.benefit}
                          </div>
                        </div>
                      
                        {/* Expand/Collapse Icon */}
                        <div className="ml-4 flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-200 ${
                            openFAQ === index ? 'rotate-180' : ''
                          }`}>
                            <ChevronRight className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    {/* FAQ Answer */}
                    {openFAQ === index && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </StaggerInWhenVisible>
              ))}
            </Carousel>
          </div>

          {/* Still Have Questions CTA */}
          <FadeInWhenVisible delay={600}>
            <div className="p-8 md:p-8 text-center">
              <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-4 md:mb-8 leading-tight px-2">
                Still Have Questions?
              </h1>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Our team is here to help. Get personalized answers to your specific business questions 
                in under 5 minutes.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center px-4">
                <Button
                  onClick={handleLoginClick}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
                >
                  Start free
                </Button>
                <Button
                  onClick={() => navigate('/contact')}
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
                >
                  Get help
                </Button>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>





      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto max-w-6xl m-2 md:m-4 rounded-2xl md:rounded-3xl bg-white shadow-xl border border-gray-200 p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
            <p className="text-xs md:text-sm text-gray-700">
              We use cookies to improve your experience on our website
            </p>
            <div className="flex gap-2 w-full md:w-auto md:ml-auto">
              <Button variant="outline" className="border-gray-300 text-xs md:text-sm flex-1 md:flex-none" onClick={() => setShowCookieBanner(false)}>Decline</Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 text-xs md:text-sm flex-1 md:flex-none" onClick={acceptCookies}>Accept</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />




  </div>
  );
};
