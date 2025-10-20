import React, { useState, useRef, lazy } from 'react';
import { Header } from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Carousel from './ui/carousel';
import BlurText from "./BlurText";
import AnimatedContent from './AnimatedContent'
import AnimatedList from './AnimatedList'
import ScrollStack, { ScrollStackItem } from './ScrollStack'
import GlareHover from './GlareHover'
import GradualBlur from './GradualBlur'
import StarBorder from './StarBorder'






import { 
  Package, BarChart3, Users, Shield, Check, TrendingUp, Zap, Star, Clock, Euro, Target, 
  ChevronLeft, ChevronRight, Scan, Truck, ArrowRight, Play, Award, Globe, Smartphone, 
  CheckCircle, Rocket, Crown, Sparkles, Timer, Facebook, Twitter, Linkedin, Instagram,
  Repeat, Camera, Building, ShoppingCart, CreditCard, Mail, Utensils, Coffee, 
  Wrench, Hammer, Heart, Stethoscope, BookOpen, Gamepad2, Car, Plane, 
  Shirt, Laptop, Home, Briefcase, Music, Paintbrush
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { logger } from '../lib/logger';
import { generateComprehensiveStructuredData } from '../lib/structuredData';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/useWindowSize';
import { supabase } from '@/integrations/supabase/client';
// import { useWebsiteTracking } from '@/hooks/useWebsiteTracking';
// import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';
import Footer from './Footer';

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

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
      className={`transition-all duration-500 ease-out ${
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

// Auto-scrolling horizontal marquee component for industry badges
const IndustryBadgeMarquee = ({ badges, speed = 30 }) => {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef(null);
  const positionRef = useRef(0);

  // Duplicate badges for seamless scrolling
  const duplicatedBadges = [...badges, ...badges];

  React.useEffect(() => {
    if (!marqueeRef.current) return;

    const marquee = marqueeRef.current;
    let animationId;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (!isPaused) {
        positionRef.current -= scrollSpeed;
        marquee.style.transform = `translateX(${positionRef.current}px)`;
        
        // Reset position when we've scrolled past half the content (since we duplicated it)
        const marqueeWidth = marquee.scrollWidth / 2; // Half because we duplicated
        if (Math.abs(positionRef.current) >= marqueeWidth) {
          positionRef.current = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused]);

  return (
    <div className="relative overflow-hidden py-4 w-full">
      <div 
        ref={marqueeRef}
        className="flex gap-8 items-center whitespace-nowrap"
        style={{ width: 'max-content' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedBadges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center drop-shadow-lg border-2 border-white shadow-lg hover:scale-105 transition-transform duration-200">
              <badge.icon className="h-8 w-8 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center whitespace-nowrap">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Gradient fade edges */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

// Industry badges data with expanded niches (all blue as requested)
const industryBadges = [
  { icon: Building, label: 'Retail' },
  { icon: Package, label: 'Food & Beverage' },
  { icon: Truck, label: 'Wholesale' },
  { icon: BarChart3, label: 'Manufacturing' },
  { icon: Utensils, label: 'Restaurants' },
  { icon: Coffee, label: 'Cafes' },
  { icon: Stethoscope, label: 'Healthcare' },
  { icon: Heart, label: 'Pharmacy' },
  { icon: Car, label: 'Automotive' },
  { icon: Wrench, label: 'Hardware' },
  { icon: Shirt, label: 'Fashion' },
  { icon: BookOpen, label: 'Education' },
  { icon: Gamepad2, label: 'Electronics' },
  { icon: Laptop, label: 'IT Services' },
  { icon: Home, label: 'Furniture' },
  { icon: Briefcase, label: 'Office Supplies' },
  { icon: Music, label: 'Entertainment' },
  { icon: Paintbrush, label: 'Arts & Crafts' }
];

export const HomePage = () => {
  const navigate = useNavigate();
  
  // Pricing-related state and hooks
  const { user } = useAuth();
  
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
  
  // FAQ search state
  const [faqSearchTerm, setFaqSearchTerm] = useState('');
  
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  
  // Screen size detection
  const [isMobile, setIsMobile] = useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
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

  // Modal functions
  const openModal = (imageSrc: string) => {
    setModalImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage('');
  };

  // Filter FAQ data based on search term
  const filteredFaqData = faqSearchTerm
    ? faqData.filter(faq => 
        faq.question.toLowerCase().includes(faqSearchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(faqSearchTerm.toLowerCase()) ||
        (faq.benefit && faq.benefit.toLowerCase().includes(faqSearchTerm.toLowerCase()))
      )
    : faqData;

  // Feature tabs data
  const featuresData = [
    {
      id: 'mobile-scanning',
      title: 'Scanning',
      subtitle: 'Scan Barcodes with Phone',
      badge: 'Core Feature',
      badgeColor: 'from-blue-500 to-blue-600',
      description: 'Skip the clipboard. Use your phone camera to scan barcodes and update stock from anywhere in your shop.',
      benefits: [
        'Works offline',
        'No special hardware',
        'iOS & Android'
      ],
      image: '/scanner.png',
      imageAlt: 'Mobile phone scanning barcodes for inventory management',
      bgGradient: 'from-blue-50 via-blue-100 to-blue-50',
      glowColor: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-200/50'
    },
    {
      id: 'dead-stock',
      title: 'Optimizer',
      subtitle: 'Dead Stock Liquidation Optimizer',
      badge: 'Unique Feature',
      badgeColor: 'from-blue-500 to-blue-600',
      description: 'Automatically identify inventory draining your capital. Flag items with zero sales for 30, 60, or 90 days.',
      benefits: [
        'Auto-flag non-movers',
        'Calculate tied-up capital',
        'Get liquidation recommendations'
      ],
      image: '/deadstock.png',
      imageAlt: 'Dead stock liquidation optimizer dashboard showing slow-moving inventory',
      bgGradient: 'from-blue-50 via-blue-100 to-blue-50',
      glowColor: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-200/50'
    },
    {
      id: 'multi-location',
      title: 'Multi-Location',
      subtitle: 'Multi-Location Management',
      badge: 'Advanced Feature',
      badgeColor: 'from-green-500 to-emerald-600',
      description: 'Track inventory across multiple stores, warehouses, or stockrooms. See stock levels at each location in real-time.',
      benefits: [
        'Real-time stock levels',
        'Transfer items between locations',
        'Low stock alerts per location'
      ],
      image: '/branches.png',
      imageAlt: 'Multi-location inventory tracking across multiple stores',
      bgGradient: 'from-green-50 via-green-100 to-emerald-50',
      glowColor: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-200/50'
    }
  ];


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
      "description": "Cloud-based Inventory Management Platform for SMEs",
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
      "description": "Cloud-based Inventory Management Platform for SMEs",
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
    <div className="gradient-background text-gray-900 font-sans" style={{position: 'relative', overflow: 'hidden'}}>
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
        title="StockFlow - Cloud-based Inventory Management Platform"
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
      <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >
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
                  <BlurText className="justify-center" text="Cloud‑based Inventory Management Platform" onComplete={handleAnimationComplete} /> 
                  </h1>
          
            </div>
              </BounceInWhenVisible>
              
              <SlideUpWhenVisible delay={400}>
                  <p className=" text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-4xl mx-auto px-4 leading-relaxed">
                    Stop wasting capital on overstock and dead inventory. Track stock, reduce waste, and optimize ordering. All in one simple platform.
                </p>
              </SlideUpWhenVisible>

              
          {/* CTA */}
          <FadeInWhenVisible delay={700}>
            <div className="text-center mt-6 mb-6 sm:mt-6">
              
            <StarBorder
              as="button"
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700
                px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-7
                text-lg sm:text-xl md:text-2xl
                font-bold rounded-lg transform hover:scale-105
                transition-all duration-300
                shadow-2xl hover:shadow-3xl
                ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                min-h-[56px] sm:min-h-[64px]"
              color="cyan"
              speed="5s"

            
                onClick={() => navigate('/pricing')}
                >
              
                Create a Free Account
              </StarBorder>
            </div>
          </FadeInWhenVisible>
              
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
            
          {/* Hero Visual: Responsive Dashboard Images */}
          <SlideUpWhenVisible delay={1000}>
            <div className="relative max-w-6xl mx-auto px-2 sm:px-4">
              {/* Mobile Image - Only visible on mobile */}
              {isMobile && (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200">
                  <img
                    src="/mobile.png"
                    alt="StockFlow mobile dashboard showing inventory management on mobile"
                    className="w-full h-auto object-contain cursor-pointer hover:opacity-95 transition-opacity"
                    loading="lazy"
                    onClick={() => openModal('/mobile.png')}
                    width={400}
                    height={600}
                  />
                  {/* Mobile overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-semibold text-sm">
                      Mobile Dashboard
                    </h3>
                    <p className="text-white/80 text-xs">
                      Inventory management on the go with your phone
                    </p>
                  </div>
                </div>
              )}

              {/* Desktop Image - Only visible on desktop */}
              {!isMobile && (
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-200">
                  <img
                    src="/dashboard.png"
                    alt="StockFlow desktop dashboard showing inventory management interface"
                    className="w-full h-auto object-contain cursor-pointer hover:opacity-95 transition-opacity"
                    loading="lazy"
                    onClick={() => openModal('/dashboard.png')}
                    width={1200}
                    height={800}
                  />
                  {/* Desktop overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white font-semibold text-base">
                      Desktop Dashboard
                    </h3>
                    <p className="text-white/80 text-sm">
                      Full-featured inventory management on desktop
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SlideUpWhenVisible>

        </div>
      </section>
      </AnimatedContent>




      {/* Social Proof Bar - Immediately Below Hero */}
      <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >

      <section className="py-6 sm:py-8 md:py-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center">

              
              {/* Industry Badge Marquee */}
              <IndustryBadgeMarquee badges={industryBadges} speed={40} />
              

            </div>
          </FadeInWhenVisible>
        </div>
      </section>
      </AnimatedContent>

      {/* Problem → Solution Section */}
      <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,5rem)] font-light text-gray-800 mb-3 leading-tight px-2">
            <BlurText className="justify-center" text="Stop Losing Money On Inventory Mistakes!" onComplete={handleAnimationComplete} /> 

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
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                  <BarChart3 className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-blue-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Guessing Game</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
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
          {/* CTA */}
          <FadeInWhenVisible delay={700}>
            <div className="text-center mt-12 sm:mt-16">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700
                px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-7
                text-lg sm:text-xl md:text-2xl
                font-bold rounded-lg transform hover:scale-105
                transition-all duration-300
                shadow-2xl hover:shadow-3xl
                ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                min-h-[56px] sm:min-h-[64px]"       
                onClick={() => navigate('/pricing')}
              >
                Create a Free Account
              </Button>
              <p className="text-sm text-gray-500 mt-4">No credit card required</p>
            </div>
          </FadeInWhenVisible>
      </section>
      </AnimatedContent>


      <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >
      {/* Key Features Section - Alternating Layout */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 ">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-16 sm:mb-20 md:mb-24 lg:mb-28">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  POWERFUL FEATURES
                </span>
              </div>
              <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,5rem)] font-light text-gray-800 mb-3 leading-tight px-2">
              <BlurText className="justify-center" text="Everything You Need To Manage Inventory" onComplete={handleAnimationComplete} /> 

              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                Keep track of your inventory, see what's selling, and get alerts when you need to reorder.
              </p>
            </div>
          </FadeInWhenVisible>

          <ScrollStack useWindowScroll={true}>
            {featuresData.map((feature, index) => {
              // Alternating layout: even indices have content left, odd indices have content right
              const isEvenIndex = index % 2 === 0;
              const contentOrder = isEvenIndex ? "order-1" : "order-1 lg:order-2";
              const imageOrder = isEvenIndex ? "order-2 lg:order-1" : "order-2";
              
              return (
                <ScrollStackItem 
                  key={feature.id}
                  itemClassName={`bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center h-full">
                    {/* Feature Content */}
                    <div className={`${contentOrder} space-y-6 sm:space-y-8`}>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.badgeColor} text-white text-xs font-bold uppercase tracking-wide shadow-md`}>
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        {feature.badge}
                      </div>
                      
                      <div>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-gray-900 mb-4">
                          {feature.subtitle}
                        </h3>
                        <div className={`w-20 h-1.5 bg-gradient-to-r ${feature.badgeColor} rounded-full mb-6`}></div>
                      </div>

                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                        {feature.description}
                      </p>

                      <div className="space-y-4">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-gray-900 font-medium text-md">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Feature Image */}
                    <div className={imageOrder}>
                      <div className="relative group">
                        <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-r ${feature.glowColor}`}></div>
                        <div className={`relative p-8 sm:p-10 md:p-12 ${feature.borderColor} bg-white rounded-3xl flex items-center justify-center min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]`}>
                          <img
                            src={feature.image}
                            alt={feature.imageAlt}
                            className="w-full h-auto max-w-[250px] sm:max-w-[300px] lg:max-w-[350px] object-contain rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            width={600}
                            height={400}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollStackItem>
              );
            })}
          </ScrollStack>
          
          {/* CTA */}
          <FadeInWhenVisible delay={700}>
            <div className="text-center mt-12 sm:mt-16">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700
                px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-7
                text-lg sm:text-xl md:text-2xl
                font-bold rounded-lg transform hover:scale-105
                transition-all duration-300
                shadow-2xl hover:shadow-3xl
                ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                min-h-[56px] sm:min-h-[64px]"       
                onClick={() => navigate('/pricing')}
              >
                Create a Free Account
              </Button>
              <p className="text-sm text-gray-500 mt-4">No credit card required</p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
</AnimatedContent>


<AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >
      {/* Start Tracking in 3 Simple Steps - New Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-gradient-to-b from-blue-50/30 to-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,5rem)] font-light text-gray-800 mb-3 leading-tight px-2">
            <BlurText className="justify-center" text="Start Tracking In 3 Simple Steps" onComplete={handleAnimationComplete} /> 

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

          {/* Three Steps - Mobile Carousel / Desktop Grid */}
          {useIsMobile() ? (
            // Mobile Carousel
            <div className="max-w-md mx-auto">
              <MobileCarousel
                items={[
                  {
                    stepNumber: 1,
                    icon: <Package className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-blue-600" />,
                    title: "Import Products",
                    description: "Upload Excel or type in your products. Your data imports in seconds.",
                    footerIcon: <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />,
                    footerText: "Takes 5 minutes"
                  },
                  {
                    stepNumber: 2,
                    icon: <Smartphone className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-blue-600" />,
                    title: "Scan & Count",
                    description: "Use your phone camera to scan barcodes. Update stock from anywhere in your shop.",
                    footerIcon: <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />,
                    footerText: "Works on any phone"
                  },
                  {
                    stepNumber: 3,
                    icon: <Target className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-blue-600" />,
                    title: "Track & Optimize",
                    description: "See low stock alerts, track what's selling, and optimize your inventory automatically.",
                    footerIcon: <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />,
                    footerText: "Automatic updates"
                  }
                ]}
                renderItem={(item: any) => (
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
                    {/* Step Number */}
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {item.stepNumber}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 text-center leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer indicator */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        {item.footerIcon}
                        <span className="font-medium text-sm">{item.footerText}</span>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          ) : (
            // Desktop Grid
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
          )}

          {/* CTA */}
          <FadeInWhenVisible delay={700}>
            <div className="text-center mt-12 sm:mt-16">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700
                px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-7
                text-lg sm:text-xl md:text-2xl
                font-bold rounded-lg transform hover:scale-105
                transition-all duration-300
                shadow-2xl hover:shadow-3xl
                ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                min-h-[56px] sm:min-h-[64px]"       
                onClick={() => navigate('/pricing')}
              >
                Create a Free Account
              </Button>
              <p className="text-sm text-gray-500 mt-4">No credit card required</p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
      </AnimatedContent>


      <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >
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
              <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,5rem)] font-light text-gray-800 mb-3 leading-tight px-2">
              <BlurText className="justify-center" text="Why Choose Stockflow" onComplete={handleAnimationComplete} /> 

              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                The smart choice for inventory management
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Why Choose Us - Mobile Carousel / Desktop Grid */}
          {/* Mobile Carousel - Only visible on mobile */}
          <div className="md:hidden">
            <MobileCarousel 
              items={whyChooseUs}
              renderItem={(reason, index) => (
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
              )}
            />
          </div>

          {/* Desktop Grid - Only visible on desktop */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
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
          {/* CTA */}
          <FadeInWhenVisible delay={700}>
            <div className="text-center mt-12 sm:mt-16">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700
                px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-7
                text-lg sm:text-xl md:text-2xl
                font-bold rounded-lg transform hover:scale-105
                transition-all duration-300
                shadow-2xl hover:shadow-3xl
                ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                min-h-[56px] sm:min-h-[64px]"       
                onClick={() => navigate('/pricing')}
              >
                Create a Free Account
              </Button>
              <p className="text-sm text-gray-500 mt-4">No credit card required</p>
            </div>
          </FadeInWhenVisible>
      </section>
      </AnimatedContent>

      <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >
      {/* Integrations Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  CONNECT YOUR TOOLS
                </span>
              </div>
              <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-light text-gray-800 mb-3 leading-tight px-2">
                Connect StockFlow with <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Your Business Tools
                </span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                Seamlessly integrate with your existing systems and streamline your workflow
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Integration Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Shopify */}
            <FadeInWhenVisible delay={100}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Shopify</h3>
                    <p className="text-sm text-gray-600">E-commerce platform</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Import your Shopify products and sync inventory levels automatically.</p>
                <div className="flex items-center justify-between">
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Square */}
            <FadeInWhenVisible delay={200}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Square</h3>
                    <p className="text-sm text-gray-600">POS system</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Sync your Square POS sales data and manage multi-location inventory.</p>
                <div className="flex items-center justify-between">

                </div>
              </div>
            </FadeInWhenVisible>

            {/* WooCommerce */}
            <FadeInWhenVisible delay={300}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">WooCommerce</h3>
                    <p className="text-sm text-gray-600">WordPress e-commerce</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Connect your WordPress store and automate inventory management.</p>
                <div className="flex items-center justify-between">
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Mailchimp */}
            <FadeInWhenVisible delay={400}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Mailchimp</h3>
                    <p className="text-sm text-gray-600">Email marketing</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Sync customer data and create targeted email campaigns.</p>
                <div className="flex items-center justify-between">

                </div>
              </div>
            </FadeInWhenVisible>

            {/* QuickBooks */}
            <FadeInWhenVisible delay={500}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">QuickBooks</h3>
                    <p className="text-sm text-gray-600">Accounting software</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Sync financial data and streamline your accounting workflow.</p>
                <div className="flex items-center justify-between">
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Zapier */}
            <FadeInWhenVisible delay={600}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-yellow-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Zapier</h3>
                    <p className="text-sm text-gray-600">Automation platform</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Connect with 5000+ apps and automate your workflows.</p>
                <div className="flex items-center justify-between">
                </div>
              </div>
            </FadeInWhenVisible>
          </div>

          {/* CTA */}
          <FadeInWhenVisible delay={700}>
            <div className="text-center mt-12 sm:mt-16">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700
                px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-7
                text-lg sm:text-xl md:text-2xl
                font-bold rounded-lg transform hover:scale-105
                transition-all duration-300
                shadow-2xl hover:shadow-3xl
                ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                min-h-[56px] sm:min-h-[64px]"       
                onClick={() => navigate('/pricing')}
              >
                Create a Free Account
              </Button>
              <p className="text-sm text-gray-500 mt-4">No credit card required</p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
      </AnimatedContent>


      <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >
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
              <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,5rem)] font-light text-gray-800 mb-3 leading-tight px-2">
              Got Questions? <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600">
                  We've Got Answers
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Everything you need to know about StockFlow
              </p>
            </div>
          </FadeInWhenVisible>

          {/* FAQ Search Bar */}
          <FadeInWhenVisible delay={100}>
            <div className="max-w-md mx-auto mb-8 sm:mb-10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={faqSearchTerm}
                  onChange={(e) => setFaqSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                />
                {faqSearchTerm && (
                  <button
                    onClick={() => setFaqSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Search Results Info */}
          {faqSearchTerm && (
            <FadeInWhenVisible delay={150}>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  {filteredFaqData.length > 0 
                    ? `Found ${filteredFaqData.length} FAQ${filteredFaqData.length === 1 ? '' : 's'} matching "${faqSearchTerm}"`
                    : `No FAQs found matching "${faqSearchTerm}"`
                  }
                </p>
              </div>
            </FadeInWhenVisible>
          )}

          {/* FAQ - Mobile Carousel / Desktop Accordion */}
          {/* Mobile Carousel - Only visible on mobile */}
          <div className="md:hidden">
            {filteredFaqData.length > 0 ? (
              <MobileCarousel 
                items={filteredFaqData}
                renderItem={(faq, index) => (
                <FadeInWhenVisible key={index} delay={index * 50}>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    {/* Question Header */}
                    <div className="px-6 py-5">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      {faq.benefit && (
                        <p className="text-sm text-blue-600 font-medium mb-3">
                          {faq.benefit}
                        </p>
                      )}
                    </div>
                  
                  </div>
                </FadeInWhenVisible>
                )}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No FAQs found matching your search.</p>
              </div>
            )}
          </div>

          {/* Desktop Accordion - Only visible on desktop */}
          <div className="hidden md:block space-y-4">
            {filteredFaqData.length > 0 ? (
              filteredFaqData.map((faq, index) => (
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
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No FAQs found matching your search.</p>
              </div>
            )}
          </div>

          {/* CTA after FAQ */}
          <FadeInWhenVisible delay={400}>
            <div className="text-center mt-12 sm:mt-16">
              <p className="text-lg text-gray-600 mb-6">
                Still have questions? We're here to help!
              </p>
              <Button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700
                px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-7
                text-lg sm:text-xl md:text-2xl
                font-bold rounded-lg transform hover:scale-105
                transition-all duration-300
                shadow-2xl hover:shadow-3xl
                ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                min-h-[56px] sm:min-h-[64px]"       
              >
                Contact Support
              </Button>
            </div>
          </FadeInWhenVisible>

        </div>
      </section>
      </AnimatedContent>


      


      <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >
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
      </AnimatedContent>



      <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >
          {/* Final Call-to-Action Section */}
          <FadeInWhenVisible delay={600}>
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800  shadow-2xl overflow-hidden">
              <div className="relative px-6 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-14 md:py-16 lg:py-20">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_80%)]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                
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
                      font-bold rounded-lg transform hover:scale-105
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
          </AnimatedContent>

      <Footer />

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={modalImage}
              alt="StockFlow dashboard enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Floating Chat Widget - Separate from logged-in user chat */}

      {/* Viewport-wide GradualBlur effect */}
      <GradualBlur
        target="window"
        position="bottom"
        height="8rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential={true}
        opacity={0.8}
      />

  </div>
  );
};
