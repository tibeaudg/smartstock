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
import { supabase } from '@/integrations/supabase/client';
// import { useWebsiteTracking } from '@/hooks/useWebsiteTracking';
// import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';
import { ConversionTrackingTest } from './ConversionTrackingTest';
import { SavingsCalculator } from './SavingsCalculator';
import Footer from './Footer';
import { ContactForm } from './ContactForm';



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
  
  // Pricing-related state and hooks
  const { user } = useAuth();
  const { pricingTiers, isLoading, error: subscriptionError } = useSubscription();
  
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

  // FAQ accordion state
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  // Pricing toggle state
  const [isYearly, setIsYearly] = useState(false);







  const handleLoginClick = async () => {
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
    
    // If user is already logged in (has session), go directly to dashboard
    // But first check if session is valid
    if (user) {
      console.log('[HomePage] User already logged in, checking session...');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('[HomePage] Valid session found, navigating to dashboard');
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error('[HomePage] Session check failed:', error);
      }
    }
    
    navigate('/pricing');
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


  // Integration partners
  const integrationPartners = [
    { name: "Partner 1", logo: "/placeholder.svg" },
    { name: "Partner 2", logo: "/placeholder.svg" },
    { name: "Partner 3", logo: "/placeholder.svg" },
    { name: "Partner 4", logo: "/placeholder.svg" },
    { name: "Partner 5", logo: "/placeholder.svg" }
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
            "item": "https://www.stockflow.be/",
            "image": "https://www.stockflow.be/logo.png"
          }
        ]
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.stockflow.be/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
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
      "name": "StockFlow Inventory Management Demo - Mobile Scanning Tutorial",
      "description": "See how StockFlow helps small retail shops manage inventory efficiently. Watch a complete walkthrough of mobile barcode scanning, stock tracking, and dead stock alerts.",
      "thumbnailUrl": ["https://www.stockflow.be/Inventory-Management.png"],
      "uploadDate": "2024-01-01",
      "contentUrl": "https://www.stockflow.be/intro_vid.mp4",
      "embedUrl": "https://www.stockflow.be/intro_vid.mp4",
      "duration": "PT3M30S",
      "keywords": "inventory management, barcode scanning, retail software, stock tracking",
      "genre": "Educational",
      "publisher": {
        "@type": "Organization",
        "name": "StockFlow",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.stockflow.be/logo.png",
          "width": 200,
          "height": 60
        }
      },
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "http://schema.org/WatchAction",
        "userInteractionCount": 1250
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
    // Review Schema for testimonials
    {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "SoftwareApplication",
        "name": "StockFlow"
      },
      "author": {
        "@type": "Person",
        "name": "Laura Peeters"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "StockFlow stopped us from wasting $4,800 annually on expired inventory and overstock. We now invest that capital into bestselling items instead."
    },
    {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "SoftwareApplication",
        "name": "StockFlow"
      },
      "author": {
        "@type": "Person",
        "name": "Sophie Martens"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "StockFlow helped us identify $8,500 worth of slow-moving inventory. We cleared it at 30% margin instead of letting it sit for another season."
    },
    // LocalBusiness Schema
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "StockFlow - Retail Inventory Software",
      "description": "Mobile inventory management software for small retail shops, local stores, and boutiques. Track stock with your phone.",
      "url": "https://www.stockflow.be",
      "logo": "https://www.stockflow.be/logo.png",
      "image": "https://www.stockflow.be/Inventory-Management.png",
      "telephone": "+32-123-456-789",
      "email": "info@stockflow.be",
      "priceRange": "Free - €29/month",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BE",
        "addressLocality": "Belgium"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "50.8503",
        "longitude": "4.3517"
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
      "openingHours": "Mo-Fr 09:00-17:00",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      }
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
        
        {/* Additional Meta Tags - Core meta tags handled by SEO component */}
        <meta name="application-name" content="StockFlow" />
        <meta name="apple-mobile-web-app-title" content="StockFlow" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="color-scheme" content="light" />
        
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
        title="StockFlow - Cloud-based Inventory & Warehouse Management Platform"
        description="Track stock with your phone. Stop stockouts, reduce overstock, count inventory in minutes. Built for small retail stores."
        keywords="stockflow, stock flow, stockflow app, stockflow software, stockflow inventory, retail inventory management, inventory for retail shops, retail stock management, small retail inventory, shop inventory software, retail store inventory, inventory tracking for retailers, retail inventory app, barcode scanning retail, mobile inventory retail, shop floor inventory, backroom inventory tracking, retail stock control, point of sale inventory, POS inventory integration, retail inventory system, small shop inventory, local store inventory, boutique inventory management, independent retailer inventory, retail inventory software, multi-location retail inventory, inventory management for stores, retail stocktaking, retail inventory counting, retail reorder alerts, retail stock alerts, prevent stockouts retail, reduce overstock retail, retail cash flow, retail inventory free, free retail inventory software, inventory app for shops, retail business software, small business retail inventory, inventory for small retailers, retail inventory Belgium, shop inventory management, store stock management, retail merchandise tracking, retail product tracking, inventory management small retail"
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
      <section className="relative py-10 sm:py-14 md:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-blue-50/30 to-white">
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
                  <h1 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,5rem)] font-light text-gray-800 mb-3 leading-tight px-2">
                  <strong className="text-blue-600">Cloud‑based</strong> Inventory & Warehouse <strong className="text-blue-600">Management</strong> Platform
              </h1>
            </div>
              </BounceInWhenVisible>
              
              <SlideUpWhenVisible delay={400}>
                  <p className="lg:pb-12 text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-4xl mx-auto px-4 leading-relaxed">
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
      <section className="py-6 sm:py-8 md:py-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center">

              
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
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center drop-shadow-lg border border-gray-200">
                    <Building className="h-8 w-8 text-gray-600 " />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Retail</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center drop-shadow-lg border border-gray-200">
                    <Package className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Food & Beverage</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center drop-shadow-lg border border-gray-200">
                    <Truck className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Wholesale</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center drop-shadow-lg border border-gray-200">
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
            <h2 className="font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight px-2">
                Stop Losing Money On<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Inventory Mistakes
                </span>
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
              <div className="text-center bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
              <div className="text-center bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
              <div className="text-center bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
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
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-16 sm:mb-20 md:mb-24 lg:mb-28">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  POWERFUL FEATURES
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight px-2">
                Everything You Need To<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Manage Inventory
                </span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                Keep track of your inventory, see what's selling, and get alerts when you need to reorder.
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Feature 1: Mobile Scanning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center mb-16 sm:mb-20 md:mb-24 lg:mb-28">
            <SlideInWhenVisible direction="right" delay={200}>
              <div className="order-1 lg:order-2">
                <div className="space-y-5 sm:space-y-6 md:space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wide shadow-md">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Core Feature
                  </div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-gray-900 mb-4">
                      Scan Barcodes with Phone
                    </h3>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6"></div>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
                    Skip the clipboard. Use your phone camera to scan barcodes and update stock from anywhere in your shop.
                  </p>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-900 font-medium text-lg">Works offline</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-900 font-medium text-lg">No special hardware</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-900 font-medium text-lg">iOS & Android</span>
                    </div>
                  </div>
                </div>
              </div>
            </SlideInWhenVisible>
            
            <SlideInWhenVisible direction="left" delay={100}>
              <div className="order-2 lg:order-1">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl border border-blue-200/50 flex items-center justify-center min-h-[400px] sm:min-h-[450px] lg:min-h-[550px]">
                    <img
                      src="/scanner.png"
                      alt="Mobile phone scanning barcodes for inventory management"
                      className="w-full h-auto max-w-[300px] sm:max-w-[340px] lg:max-w-full max-h-[320px] sm:max-h-[380px] lg:max-h-[450px] object-contain rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width={800}
                      height={600}
                    />
                  </div>
                </div>
              </div>
            </SlideInWhenVisible>
          </div>

          {/* Feature 2: Dead Stock Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center mb-16 sm:mb-20 md:mb-24 lg:mb-28">
            <SlideInWhenVisible direction="right" delay={100}>
              <div className="order-1">
                <div className="space-y-5 sm:space-y-6 md:space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold uppercase tracking-wide shadow-md">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Unique Feature
                  </div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-gray-900 mb-4">
                      Dead Stock Liquidation Optimizer
                    </h3>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-6"></div>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
                    Automatically identify inventory draining your capital. Flag items with zero sales for 30, 60, or 90 days.
                  </p>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-900 font-medium text-lg">Auto-flag non-movers</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-900 font-medium text-lg">Calculate tied-up capital</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-900 font-medium text-lg">Get liquidation recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
            </SlideInWhenVisible>
            
            <SlideInWhenVisible direction="left" delay={200}>
              <div className="order-2">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl border border-purple-200/50 flex items-center justify-center min-h-[400px] sm:min-h-[450px] lg:min-h-[550px]">
                    <img
                      src="/deadstock.png"
                      alt="Dead stock liquidation optimizer dashboard showing slow-moving inventory"
                      className="w-full h-auto max-w-[300px] sm:max-w-[340px] lg:max-w-full max-h-[320px] sm:max-h-[380px] lg:max-h-[450px] object-contain rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width={800}
                      height={600}
                    />
                  </div>
                </div>
              </div>
            </SlideInWhenVisible>
          </div>

          {/* Feature 3: Multi-Location Tracking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <SlideInWhenVisible direction="right" delay={200}>
              <div className="order-1 lg:order-2">
                <div className="space-y-5 sm:space-y-6 md:space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold uppercase tracking-wide shadow-md">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Advanced Feature
                  </div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-gray-900 mb-4">
                      Multi-Location Management
                    </h3>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6"></div>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
                    Track inventory across multiple stores, warehouses, or stockrooms. See stock levels at each location in real-time.
                  </p>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-900 font-medium text-lg">Real-time stock levels</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-900 font-medium text-lg">Transfer items between locations</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-900 font-medium text-lg">Low stock alerts per location</span>
                    </div>
                  </div>
                </div>
              </div>
            </SlideInWhenVisible>
            
            <SlideInWhenVisible direction="left" delay={100}>
              <div className="order-2 lg:order-1">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl border border-green-200/50 flex items-center justify-center min-h-[400px] sm:min-h-[450px] lg:min-h-[550px]">
                    <img
                      src="/branches.png"
                      alt="Multi-location inventory tracking across multiple stores"
                      className="w-full h-auto max-w-[300px] sm:max-w-[340px] lg:max-w-full max-h-[320px] sm:max-h-[380px] lg:max-h-[450px] object-contain rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width={800}
                      height={600}
                    />
                  </div>
                </div>
              </div>
            </SlideInWhenVisible>
          </div>
        </div>
      </section>

      {/* Start Tracking in 3 Simple Steps - New Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-gradient-to-b from-blue-50/30 to-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight px-2">
                Start Tracking<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  in 3 Simple Steps
                </span>
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



      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  WHY STOCKFLOW
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight px-2">
                Why Choose<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  StockFlow
                </span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                The smart choice for inventory management
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Why Choose Us Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
            {whyChooseUs.map((reason, index) => (
              <ScaleInWhenVisible key={index} delay={index * 100}>
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 h-full">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                    {reason.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    {reason.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </ScaleInWhenVisible>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  FREQUENTLY ASKED QUESTIONS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight px-2">
                Got Questions?<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  We've Got Answers
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Everything you need to know about StockFlow
              </p>
            </div>
          </FadeInWhenVisible>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <FadeInWhenVisible key={index} delay={index * 50}>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        {faq.question}
                      </h3>
                      {faq.benefit && (
                        <p className="text-sm text-blue-600 font-medium">
                          {faq.benefit}
                        </p>
                      )}
                    </div>
                    <div className={`flex-shrink-0 transform transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`}>
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  
                  {/* Answer (collapsible) */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFAQ === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-base text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* CTA after FAQ */}
          <FadeInWhenVisible delay={400}>
            <div className="text-center mt-12 sm:mt-16">
              <p className="text-lg text-gray-600 mb-6">
                Still have questions? We're here to help!
              </p>
              <Button
                onClick={() => navigate('/contact')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Contact Support
              </Button>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>


      



      {/* Trust Badges Section */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center">

              
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

      <Footer />

      {/* Floating Chat Widget - Separate from logged-in user chat */}


  </div>
  );
};
