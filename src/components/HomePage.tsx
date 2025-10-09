import React, { useState, useRef, lazy } from 'react';
import { Header } from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Carousel from './ui/carousel';
import { 
  Package, BarChart3, Users, Shield, Check, TrendingUp, Zap, Star, Clock, Euro, Target, 
  ChevronLeft, ChevronRight, Scan, Truck, ArrowRight, Play, Award, Globe, Smartphone, 
  CheckCircle, Rocket, Crown, Sparkles, Timer, Facebook, Twitter, Linkedin, Instagram,
  Repeat, Camera, Building
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { motion } from 'framer-motion';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Helmet } from 'react-helmet-async';
import { logger } from '../lib/logger';
import { useCurrency } from '@/hooks/useCurrency';
import { generateComprehensiveStructuredData } from '../lib/structuredData';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useIsMobile } from '@/hooks/useWindowSize';
// import { useWebsiteTracking } from '@/hooks/useWebsiteTracking';
// import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';
import { ConversionTrackingTest } from './ConversionTrackingTest';
import { SavingsCalculator } from './SavingsCalculator';
import Footer from './Footer';
import { FloatingChatWidget } from './FloatingChatWidget';



  const FadeInWhenVisible = ({ children, delay = 0, direction = 'up', duration = 700 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
      // Reduce animations on mobile for better performance
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
  }, [delay, isMobile]);

    const getTransform = () => {
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
  const isMobile = useIsMobile();

  React.useEffect(() => {
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
  }, [delay, isMobile]);

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
  
  // Pricing-related state and hooks
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const { pricingTiers, isLoading } = useSubscription();
  
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

  // Pricing helper functions
  const getTierIcon = (tierName: string) => {
    switch (tierName) {
      case 'basic':
        return <Package className="h-8 w-8" />;
      case 'growth':
        return <Zap className="h-8 w-8" />;
      case 'premium':
        return <Crown className="h-8 w-8" />;
      default:
        return <Package className="h-8 w-8" />;
    }
  };

  const getTierColor = (tierName: string) => {
    switch (tierName) {
      case 'basic':
        return 'text-gray-600';
      case 'growth':
        return 'text-blue-600';
      case 'premium':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSelectPlan = (tierId: string, isBusinessTier: boolean = false) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // For business tier, redirect to contact page
    if (isBusinessTier) {
      navigate('/contact?subject=business-tier');
      return;
    }
    
    // Navigate to checkout or subscription page
    navigate(`/checkout?tier=${tierId}&cycle=${billingCycle}`);
  };

  const formatPriceUSD = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getLimitText = (value: number | null, type: string) => {
    if (value === null) return 'Unlimited';
    if (value === 0) return 'Not included';
    return `${value} ${type}`;
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
      answer: "Our Free plan supports up to 50 products — perfect for small shops getting started. Starter plan includes 1,000 products, and Business tier supports unlimited products with custom pricing. You can also track product variants (sizes, colors) as separate SKUs. Need more? Contact us for custom solutions.",
      category: "Product Limits",
      benefit: "Free: 50 SKUs, Starter: 1,000, Business: unlimited"
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
      title: "Protect your inventory investment",
      benefit: "Stop wasting capital on dead stock",
      impact: "Know what to buy and when",
      detailedDescription: "Track slow-movers draining cash, Optimize reorder quantities, Prevent expensive spoilage & waste.",
      category: "Capital Protection",
      visual: "capital-optimization",
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
      icon: Target,
      title: "Dead Stock Liquidation Optimizer",
      benefit: "Automatically identify inventory draining your capital",
      impact: "Flag items with zero sales for 30, 60, or 90 days",
      detailedDescription: "Auto-flag non-movers, Calculate tied-up capital by product, Get liquidation recommendations, Prevent seasonal writeoffs.",
      category: "Capital Recovery",
      visual: "dead-stock-optimizer",
      isUnique: true,
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
    { value: "$2,400", label: "Average Annual Savings", description: "Protect capital from waste & overstock" },
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
      title: "Specialty Coffee & Artisan Goods",
      quote: "StockFlow stopped us from wasting $4,800 annually on expired inventory and overstock. We now invest that capital into bestselling items instead. Our cash tied up in inventory dropped 35%, and we haven't run out of popular items since.",
      avatar: '/Laura.png',
      rating: 5,
      company: "De Koffieboetiek",
      location: "Ghent, Belgium",
      industry: "Specialty Retail",
      savings: `${formatPrice(2400)}/year saved`,
      timeSaved: "8 hours/week",
      specificResults: [
        "$4,800/year waste elimination",
        "35% reduction in capital tied up in stock", 
        "Cash redirected to bestselling products",
        "Zero stockouts on popular items"
      ],
      beforeAfter: {
        before: "$400/month lost to waste, capital tied up in slow-movers",
        after: "Zero waste, 35% less capital in inventory, cash for bestsellers"
      }
    },
    {
      name: "Sophie Martens",
      role: "Owner, Maison Belle Boutique",
      title: "Boutique Fashion & Gifts",
      quote: "StockFlow helped us identify $8,500 worth of slow-moving inventory that was tying up our capital. We cleared it at 30% margin instead of letting it sit for another season. Now we only order what actually sells, freeing up cash for new collections.",
      avatar: '/jan.png',
      rating: 5,
      company: "Maison Belle Boutique",
      location: "Antwerp, Belgium",
      industry: "Fashion & Gifts",
      savings: `${formatPrice(5200)}/year saved`,
      timeSaved: "12 hours/week",
      specificResults: [
        "$8,500 dead stock identified and cleared",
        "30% margin recovered on slow-movers",
        "Cash flow improved by 40%",
        "12 hours/week time savings on inventory"
      ],
      beforeAfter: {
        before: "Capital tied up in unsold stock, guessing what to reorder",
        after: "Data-driven ordering, cash freed for bestsellers, 40% better cash flow"
      }
    },
    {
      name: "Anke Willems",
      role: "Owner, Artisan & Co.",
      title: "Handcrafted Home Goods",
      quote: "We used to over-order seasonal items that would sit unsold for months, tying up €3,200 in capital. StockFlow's alerts help us order just enough to meet demand. That freed-up cash went straight into our best-selling handmade candles and ceramics.",
      avatar: '/anke.png',
      rating: 5,
      company: "Artisan & Co.",
      location: "Bruges, Belgium",
      industry: "Artisan Retail",
      savings: `${formatPrice(1800)}/year saved`,
      timeSaved: "6 hours/week",
      specificResults: [
        "€3,200 capital freed from seasonal overstock",
        "Optimized reorder quantities by product",
        "Cash reinvested in bestselling items",
        "6 hours/week saved on inventory counts"
      ],
      beforeAfter: {
        before: "€3,200 tied up in unsold seasonal stock, guessing reorder amounts",
        after: "Capital freed for bestsellers, data-driven ordering, 6hr/week saved"
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
      tier: "basic", // Now available for all users including free tier
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
      title: "Protect capital tied up in inventory",
      subtitle: "Capital Management",
      desc: "Stop losing money to overstock and spoilage. Know exactly how much to order to maximize cash flow.",
      benefits: [
        "Identify slow-moving stock draining cash",
        "Get alerts for items at risk of expiry",
        "Optimize order quantities to free capital",
        "Track inventory value across locations"
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
    <div className="gradient-background text-gray-900 font-sans">
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
        
        {/* Resource hints managed in index.html to avoid duplicates and stay within recommended limits */}
        
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
        description="Track stock with your phone. Stop stockouts, reduce overstock, count inventory in minutes. Built for small retail stores."
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



      {/* Hero Section - Redesigned according to proposal */}
      <section className="relative py-10 sm:py-14 md:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-white to-blue-50/30">
        {/* Subtle geometric pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(30deg, #2563EB 12%, transparent 12.5%, transparent 87%, #2563EB 87.5%, #2563EB),
              linear-gradient(150deg, #2563EB 12%, transparent 12.5%, transparent 87%, #2563EB 87.5%, #2563EB),
              linear-gradient(30deg, #2563EB 12%, transparent 12.5%, transparent 87%, #2563EB 87.5%, #2563EB),
              linear-gradient(150deg, #2563EB 12%, transparent 12.5%, transparent 87%, #2563EB 87.5%, #2563EB)
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Text Content */}
          <div className="text-center mb-6 sm:mb-10 md:mb-14 lg:mb-16">
          
              {/* Micro-badge for social proof */}
              <FadeInWhenVisible delay={100}>
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                  <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm">
                    Build For SME's
                  </span>
                </div>
              </FadeInWhenVisible>
          
              <BounceInWhenVisible delay={200}>
                <div className="text-center mb-6 sm:mb-10 md:mb-14 lg:mb-16">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-tight px-2">
                Inventory Management That Saves You Money
              </h1>
            </div>
              </BounceInWhenVisible>
              
              <SlideUpWhenVisible delay={400}>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-4xl mx-auto px-4 leading-relaxed">
                  Stop wasting capital on overstock and dead inventory. Track stock, reduce waste, and optimize ordering. All in one simple platform.
                </p>
              </SlideUpWhenVisible>

              
              <ScaleInWhenVisible delay={600}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-stretch sm:items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-4 max-w-md sm:max-w-none mx-auto">
                  <Button
                    onClick={handleLoginClick}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white
                    px-8 py-4 text-base sm:px-10 sm:py-5 sm:text-lg md:px-12 md:py-6 md:text-xl
                    font-semibold rounded-full transform hover:scale-105
                    transition-all duration-300
                    shadow-xl hover:shadow-2xl hover:shadow-blue-500/50
                    ring-2 ring-blue-500/0 focus:ring-4 focus:ring-blue-500/50 focus:outline-none
                    min-h-[52px] sm:min-h-[56px]"
                  >
                    Start For Free
                  </Button>
                  

                </div>
              </ScaleInWhenVisible>
              
              <FadeInWhenVisible delay={800}>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6 justify-center items-center text-xs sm:text-sm text-gray-600 px-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span>Free forever plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Setup in 10 min</span>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
            
          {/* Hero Visual: Dashboard Screenshot */}
          <SlideUpWhenVisible delay={1000}>
            <div className="relative max-w-6xl mx-auto px-2 sm:px-4">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-200">
                {/* Dashboard image */}
                <img
                  src="/dashboard.png"
                  alt="StockFlow dashboard showing inventory management interface with stock levels, analytics, and mobile scanning features"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  width={1200}
                  height={800}
                />
              </div>
            </div>
          </SlideUpWhenVisible>

        </div>
      </section>

      {/* Social Proof Bar - Immediately Below Hero */}
      <section className="py-6 sm:py-8 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center">
              <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 mb-4 sm:mb-6 md:mb-8">
                "Trusted by leading Belgian businesses"
              </p>
              
              {/* Company Logos or Industry Icons */}
              <style>
                {`
                  .trusted-badges {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                  }
                  @media (min-width: 640px) {
                    .trusted-badges {
                      grid-template-columns: repeat(4, 1fr) !important;
                    }
                  }
                `}
              </style>
              <div className="trusted-badges mx-auto">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Retail</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Food & Beverage</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Truck className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Wholesale</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Manufacturing</span>
                </div>
              </div>
              

            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-800 mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-tight px-2">
                Stop Losing Money on Inventory Mistakes
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
                Get a clear picture of your inventory and make better decisions.
              </p>
            </div>
          </FadeInWhenVisible>
          
          {/* 3-Column Problem → Solution Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            {/* Lost Capital */}
            <SlideUpWhenVisible delay={100}>
              <div className="text-center bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                  <Euro className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-red-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Lost Capital</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <p className="text-sm sm:text-base text-gray-700 font-medium mb-2">
                    "€3,200 tied up in slow-moving stock"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Money sitting on shelves instead of working for your business
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm sm:text-base">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Free up cash for bestsellers</span>
                </div>
              </div>
            </SlideUpWhenVisible>
            
            {/* Wasted Time */}
            <SlideUpWhenVisible delay={200}>
              <div className="text-center bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                  <Clock className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-orange-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Wasted Time</h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <p className="text-sm sm:text-base text-gray-700 font-medium mb-2">
                    "8 hours/week counting stock with clipboard"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Manual counting that could be spent serving customers
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm sm:text-base">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Count in 10 minutes with phone</span>
                </div>
              </div>
            </SlideUpWhenVisible>
            
            {/* Guessing Game */}
            <SlideUpWhenVisible delay={300}>
              <div className="text-center bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                  <BarChart3 className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-purple-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Guessing Game</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <p className="text-sm sm:text-base text-gray-700 font-medium mb-2">
                    "Don't know what's selling vs. sitting"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Making reorder decisions without data
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm sm:text-base">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>See exactly what to reorder</span>
                </div>
              </div>
            </SlideUpWhenVisible>
          </div>
        </div>
      </section>

      {/* Key Features Section - Alternating Layout */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-800 mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-tight px-2">
                Everything You Need to Manage Inventory
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
                Keep track of your inventory, see what's selling, and get alerts when you need to reorder.
              </p>

            </div>
          </FadeInWhenVisible>

          {/* Feature 1: Mobile Scanning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            <SlideInWhenVisible direction="right" delay={200}>
              <div className="order-1 lg:order-2">
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    Core Feature
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Scan Barcodes with Phone
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                    Skip the clipboard. Use your phone camera to scan barcodes and update stock from anywhere in your shop.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Works offline</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">No special hardware</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">iOS & Android</span>
                    </div>
                  </div>
                </div>
              </div>
            </SlideInWhenVisible>
            
            <SlideInWhenVisible direction="left" delay={100}>
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg flex items-center justify-center min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]">
                  <img
                    src="/scanner.png"
                    alt="Mobile phone scanning barcodes for inventory management"
                    className="w-full h-auto max-w-[280px] sm:max-w-[320px] lg:max-w-full max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] object-contain rounded-2xl"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
              </div>
            </SlideInWhenVisible>
          </div>

          {/* Feature 2: Dead Stock Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            <SlideInWhenVisible direction="right" delay={100}>
              <div className="order-1">
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                    Unique Feature
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Dead Stock Liquidation Optimizer
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                    Automatically identify inventory draining your capital. Flag items with zero sales for 30, 60, or 90 days.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Auto-flag non-movers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Calculate tied-up capital</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Get liquidation recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
            </SlideInWhenVisible>
            
            <SlideInWhenVisible direction="left" delay={200}>
              <div className="order-2">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 sm:p-8 md:p-12 flex items-center justify-center min-h-[350px] sm:min-h-[400px] lg:min-h-[500px] shadow-lg">
                  <img
                    src="/deadstock.png"
                    alt="Dead stock liquidation optimizer dashboard showing slow-moving inventory"
                    className="w-full h-auto max-w-[280px] sm:max-w-[320px] lg:max-w-full max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] object-contain rounded-2xl"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
              </div>
            </SlideInWhenVisible>
          </div>

          {/* Feature 3: Multi-Location Tracking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <SlideInWhenVisible direction="right" delay={200}>
              <div className="order-1 lg:order-2">
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    Advanced Feature
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Multi-Location Management
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                    Track inventory across multiple stores, warehouses, or stockrooms. See stock levels at each location in real-time.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Real-time stock levels</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Transfer items between locations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Low stock alerts per location</span>
                    </div>
                  </div>
                </div>
              </div>
            </SlideInWhenVisible>
            
            <SlideInWhenVisible direction="left" delay={100}>
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg flex items-center justify-center min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]">
                  <img
                    src="/branches.png"
                    alt="Multi-location inventory tracking across multiple stores"
                    className="w-full h-auto max-w-[280px] sm:max-w-[320px] lg:max-w-full max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] object-contain rounded-2xl"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
              </div>
            </SlideInWhenVisible>
          </div>
        </div>
      </section>

      {/* Start Tracking in 3 Simple Steps - New Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-800 mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-tight px-2">
                Start tracking in 3 simple steps
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-5 md:mb-6 max-w-2xl mx-auto px-4">
                Get up and running in under 10 minutes.
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-semibold text-base sm:text-lg">10 min</span>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Three Steps Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 max-w-6xl mx-auto relative">
            {/* Arrow between Step 1 and 2 - Large Desktop only */}
            <div className="hidden lg:block absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-blue-600 text-white rounded-full p-2.5 lg:p-3 shadow-lg">
                <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
            </div>

            {/* Arrow between Step 2 and 3 - Large Desktop only */}
            <div className="hidden lg:block absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-blue-600 text-white rounded-full p-2.5 lg:p-3 shadow-lg">
                <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
            </div>

            {/* Step 1: Import Products */}
            <FadeInWhenVisible delay={100}>
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col sm:col-span-2 lg:col-span-1">
                {/* Step Number */}
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md">
                    1
                  </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-blue-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                    Import Products
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4 sm:mb-6">
                    Upload Excel or type in your products. Your data imports in seconds.
                  </p>
                </div>

                {/* Footer indicator */}
                <div className="pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">Takes 5 minutes</span>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Step 2: Scan & Count */}
            <FadeInWhenVisible delay={200}>
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                {/* Step Number */}
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md">
                    2
                  </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-blue-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                    Scan & Count
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4 sm:mb-6">
                    Use your phone camera to scan barcodes. Update stock from anywhere in your shop.
                  </p>
                </div>

                {/* Footer indicator */}
                <div className="pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">Works on any phone</span>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Step 3: Track & Optimize */}
            <FadeInWhenVisible delay={300}>
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col sm:col-span-2 lg:col-span-1">
                {/* Step Number */}
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md">
                    3
                  </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-blue-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                    Track & Optimize
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4 sm:mb-6">
                    See low stock alerts, track what's selling, and optimize your inventory automatically.
                  </p>
                </div>

                {/* Footer indicator */}
                <div className="pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">Automatic updates</span>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>

          {/* CTA Button */}
          <FadeInWhenVisible delay={400}>
            <div className="text-center mt-10 sm:mt-12 md:mt-16">
              <Button
                onClick={handleLoginClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 text-base sm:text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Free Today
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-4">
                Free plan forever • Set up in 10 minutes • No credit card
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>


      



      {/* Trust Badges Section */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-8">
                Secure, Reliable, Compliant
              </h3>
              
              <style>
                {`
                  .trust-badges {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                  }
                  @media (min-width: 640px) {
                    .trust-badges {
                      grid-template-columns: repeat(4, 1fr) !important;
                    }
                  }
                `}
              </style>
              <div className="trust-badges mx-auto">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">GDPR Compliant</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">99.9% Uptime</span>
                </div>
                

                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">SSL Encrypted</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Secure Payments</span>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>




          {/* Final Call-to-Action Section */}
          <FadeInWhenVisible delay={600}>
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800  shadow-2xl overflow-hidden">
              <div className="relative px-6 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-14 md:py-16 lg:py-20">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_80%)]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                  {/* Main Headline */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                    Ready to simplify your stock management?
                  </h2>
                  
                  {/* Subheadline */}
                  <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
                    Start your free trial today and see how StockFlow saves you time and money.
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-stretch sm:items-center mb-6 sm:mb-8">
                    <Button
                      onClick={handleLoginClick}
                      className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-50
                      px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-7
                      text-lg sm:text-xl md:text-2xl
                      font-bold rounded-full transform hover:scale-105
                      transition-all duration-300
                      shadow-2xl hover:shadow-3xl
                      ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                      min-h-[56px] sm:min-h-[64px]"
                    >
                      Start For Free
                    </Button>

                  </div>
                  
                  {/* Supporting Text */}
                  <div className="space-y-2">
                    <p className="text-blue-100 text-sm sm:text-base font-medium">
                      No credit card required. Cancel anytime.
                    </p>
                    <p className="text-blue-200/80 text-xs sm:text-sm">
                      Get started in 2 minutes.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </FadeInWhenVisible>





      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-2 sm:px-4">
          <div className="mx-auto max-w-6xl mb-2 sm:mb-3 md:mb-4 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-xl border border-gray-200 p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-xs sm:text-sm text-gray-700 flex-1">
              We use cookies to improve your experience on our website
            </p>
            <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
              <Button 
                variant="outline" 
                className="border-gray-300 text-xs sm:text-sm flex-1 sm:flex-none px-4 py-2 min-h-[40px]" 
                onClick={() => setShowCookieBanner(false)}
              >
                Decline
              </Button>
              <Button 
                className="bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm flex-1 sm:flex-none px-4 py-2 min-h-[40px]" 
                onClick={acceptCookies}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Floating Chat Widget - Separate from logged-in user chat */}
      <FloatingChatWidget alwaysVisible={true} />


  </div>
  );
};
