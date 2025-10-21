import React, { useState, useRef, lazy, useEffect } from 'react';
import Header from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Carousel, { CarouselItem } from './Carousel';
import HorizontalScrollCarousel from './HorizontalScrollCarousel';
import BlurText from "./BlurText";
import AnimatedList from './AnimatedList'
import GlareHover from './GlareHover'
import GradualBlur from './GradualBlur'
import ScrollTriggeredButton from './ScrollTriggeredButton'
import Stepper, { Step } from './Stepper';






import { 
  Package, BarChart3, Users, Shield, Check, TrendingUp, Zap, Star, Clock, Euro, Target, 
  ChevronLeft, ChevronRight, Scan, Truck, ArrowRight, Play, Award, Globe, Smartphone, 
  CheckCircle, Rocket, Crown, Sparkles, Timer, Facebook, Twitter, Linkedin, Instagram,
  Repeat, Camera, Building, ShoppingCart, CreditCard, Mail, Utensils, Coffee, 
  Wrench, Hammer, Heart, Stethoscope, BookOpen, Gamepad2, Car, Plane, 
  Shirt, Laptop, Home, Briefcase, Music, Paintbrush, Upload, FileSpreadsheet, 
  Minus, Plus, Download, FileText, Phone
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
import { Card } from './ui/card';

  const handleAnimationComplete = () => {
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

// Auto-scrolling horizontal marquee component for integration cards
const IntegrationCardMarquee = ({ cards, speed = 60 }) => {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef(null);
  const positionRef = useRef(0);

  // Duplicate cards for seamless scrolling
  const duplicatedCards = [...cards, ...cards];

  React.useEffect(() => {
    if (!marqueeRef.current) return;

    const marquee = marqueeRef.current;
    let animationId;
    const scrollSpeed = speed / 200; // Convert speed parameter to pixels per frame

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
  }, [isPaused, speed]);

  return (
    <div className="relative overflow-hidden py-4 w-full">
      <div 
        ref={marqueeRef}
        className="flex gap-6 items-stretch whitespace-nowrap"
        style={{ width: 'max-content' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedCards.map((card, index) => (
          <div key={index} className="flex-shrink-0 w-72 sm:w-80">
            {card}
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

// Integration cards data
const integrationCardsData = [
  {
    icon: ShoppingCart,
    title: 'Shopify',
    subtitle: 'E-commerce platform',
    colorClass: 'hover:border-green-300',
    iconBgClass: 'bg-green-100',
    iconColorClass: 'text-green-600'
  },
  {
    icon: CreditCard,
    title: 'Square',
    subtitle: 'POS system',
    colorClass: 'hover:border-blue-300',
    iconBgClass: 'bg-blue-100',
    iconColorClass: 'text-blue-600'
  },
  {
    icon: Globe,
    title: 'WooCommerce',
    subtitle: 'WordPress e-commerce',
    colorClass: 'hover:border-purple-300',
    iconBgClass: 'bg-purple-100',
    iconColorClass: 'text-purple-600'
  },
  {
    icon: Mail,
    title: 'Mailchimp',
    subtitle: 'Email marketing',
    colorClass: 'hover:border-orange-300',
    iconBgClass: 'bg-orange-100',
    iconColorClass: 'text-orange-600'
  },
  {
    icon: BarChart3,
    title: 'QuickBooks',
    subtitle: 'Accounting software',
    colorClass: 'hover:border-blue-300',
    iconBgClass: 'bg-blue-100',
    iconColorClass: 'text-blue-600'
  },
  {
    icon: Zap,
    title: 'Zapier',
    subtitle: 'Automation platform',
    colorClass: 'hover:border-yellow-300',
    iconBgClass: 'bg-yellow-100',
    iconColorClass: 'text-yellow-600'
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  
  // Pricing-related state and hooks
  const { user } = useAuth();
  
  // Scroll progress tracking state
  const [scrollProgress, setScrollProgress] = useState(0);
  
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
  
  // FAQ selected state for AnimatedList
  const [selectedFAQ, setSelectedFAQ] = useState<number>(-1);
  
  
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
  
  // Scroll progress tracking effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    // Initial calculation
    handleScroll();
    
    // Add scroll event listener with throttling for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
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

  // Inventory problems for carousel
  const inventoryProblemsCarousel: CarouselItem[] = [
    {
      id: 1,
      title: "Lost Capital",
      description: "€3,200 tied up in slow-moving stock. Money sitting on shelves instead of working for your business.",
      icon: <Euro className="h-8 w-8" />
    },
    {
      id: 2,
      title: "Wasted Time", 
      description: "8 hours/week counting stock with clipboard. Manual counting that could be spent serving customers.",
      icon: <Clock className="h-8 w-8" />
    },
    {
      id: 3,
      title: "Guessing Game",
      description: "Don't know what's selling vs. sitting. Making reorder decisions without data.",
      icon: <BarChart3 className="h-8 w-8" />
    }
  ];

  // Why choose us for carousel
  const whyChooseUsCarousel: CarouselItem[] = [
    {
      id: 1,
      title: "Don't Wait, Start Now",
      description: "Unlike competitors with complex onboarding, our patented Smart Setup gets you running in minutes, not days. See results from day one.",
      icon: <Zap className="h-6 w-6" />
    },
    {
      id: 2,
      title: "Built Exclusively for SMEs",
      description: "We don't try to serve everyone. Our deep expertise in small business inventory means we understand your challenges better than enterprise-focused solutions.",
      icon: <Target className="h-6 w-6" />
    },
    {
      id: 3,
      title: "100% Satisfaction Guarantee",
      description: "We stand behind our work. If you're not completely satisfied with StockFlow, we'll refund your subscription and help you migrate your data.",
      icon: <Shield className="h-6 w-6" />
    },
    {
      id: 4,
      title: "Proprietary AI-Powered Insights",
      description: "Leverage our exclusive machine learning algorithms to optimize your inventory 24/7, something manual tracking simply can't match.",
      icon: <Rocket className="h-6 w-6" />
    }
  ];

  // Feature cards for "Everything You Need" section
  const featureCards = [
    {
      id: 1,
      title: "Scan Barcodes with Phone",
      description: "Skip the clipboard. Use your phone camera to scan barcodes and update stock from anywhere in your shop.",
      badge: "Core Feature",
      icon: <Scan className="h-8 w-8 text-white" />,
      details: ["Works offline", "No special hardware", "iOS & Android"]
    },
    {
      id: 2,
      title: "Dead Stock Liquidation Optimizer",
      description: "Automatically identify inventory draining your capital. Flag items with zero sales for 30, 60, or 90 days.",
      badge: "Unique Feature",
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      details: ["Automatic detection", "Custom thresholds", "Revenue optimization"]
    },
    {
      id: 3,
      title: "Multi-Location Management",
      description: "Track inventory across multiple stores, warehouses, or stockrooms. See stock levels at each location in real-time.",
      badge: "Advanced Feature",
      icon: <Building className="h-8 w-8 text-white" />,
      details: ["Real-time stock levels", "Transfer items between locations", "Low stock alerts per location"]
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
      />



      {/* Scroll Progress Tracker */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-blue-50/30 to-white pt-20 sm:pt-24 md:pt-28 lg:pt-24">
        {/* Subtle geometric pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] "
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
          <div className="text-center mb-6 sm:mb-10 md:mb-14 lg:mb-16 mt-20">
          
              {/* Micro-badge for social proof */}
              <FadeInWhenVisible delay={100}>
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                  <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm">
                    Build For SMB's
                  </span>
                </div>
              </FadeInWhenVisible>
          
              <BounceInWhenVisible delay={200}>
                <div className="text-center mb-6 sm:mb-10 md:mb-14 lg:mb-16">
                  <h1 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,4rem)] font-light text-gray-800 mb-3 leading-tight px-2">
                  <BlurText className="justify-center" text="Cloud‑based Inventory Management Platform" onAnimationComplete={handleAnimationComplete} /> 
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
              
            <ScrollTriggeredButton
              as="button"
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700
                px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-4
                text-lg sm:text-xl md:text-2xl
                font-bold rounded-lg transform hover:scale-105
                transition-all duration-300
                shadow-2xl hover:shadow-3xl
                ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none"
              onClick={() => navigate('/pricing')}
            >
              Create a Free Account
              </ScrollTriggeredButton>
            </div>
          </FadeInWhenVisible>
              
              <FadeInWhenVisible delay={800}>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6 justify-center items-center text-xs sm:text-sm text-gray-600 px-4 pb-24">
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




      {/* Social Proof Bar - Immediately Below Hero */}


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



      <section className="py-12 sm:py-14 md:py-16 lg:py-18 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main White Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 md:p-16">
            {/* Header Section */}
            <FadeInWhenVisible>
              <div className="mb-12 sm:mb-16">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-8">
                  {/* Left side - Label and Heading */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-4">
                      INVENTORY PROBLEMS
                    </div>
                    <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,4rem)] font-light text-gray-800 mb-3 leading-tight px-2">                      
                      <BlurText className="justify-center" text="Stop Losing Money On Inventory Mistakes!" onAnimationComplete={handleAnimationComplete} />
                    </h2>
                  </div>
                  <div className="flex lg:max-w-lg justify-center items-center">
                    <p className="text-base justify-center text-center sm:text-lg text-gray-600 leading-relaxed">
                      Get a clear picture of your inventory and make better decisions with real-time insights and automated tracking.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
            
            {/* Features Section */}
            <FadeInWhenVisible delay={200}>
              {/* Desktop: Three column grid */}
              <div className="hidden md:grid md:grid-cols-3 md:gap-8 lg:gap-12">
                {inventoryProblemsCarousel.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 border-2 border-blue-500 rounded-xl flex items-center justify-center bg-transparent">
                        <div className="[&>svg]:text-blue-500 text-blue-500">
                          {item.icon}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-center">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile: Horizontal carousel */}
              <div className="md:hidden">
                <HorizontalScrollCarousel
                  desktopCardsVisible={3}
                  mobileCardsVisible={1}
                  cardSpacing={24}
                  showArrows={true}
                  showDots={true}
                  autoplay={true}
                  autoplayDelay={4000}
                  className="mb-8"
                  cardClassName="h-full"
                >
                  {inventoryProblemsCarousel.map((item, index) => (
                    <div
                      key={item.id}
                      className="text-center"
                    >
                      {/* Icon */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-14 h-14 border-2 border-blue-500 rounded-xl flex items-center justify-center bg-transparent">
                          <div className="[&>svg]:text-blue-500 text-blue-500">
                            {item.icon}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm text-left">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </HorizontalScrollCarousel>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>






      {/* Everything You Need Section */}
      <section className="py-12 sm:py-14 md:py-16 lg:py-18 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  POWERFUL FEATURES
                </span>
              </div>
              <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,4rem)] font-light text-gray-800 mb-3 leading-tight px-2">
              <BlurText className="justify-center" text="Everything You Need To Manage Inventory" onAnimationComplete={handleAnimationComplete} /> 

              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                Keep track of your inventory, see what's selling, and get alerts when you need to reorder.
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Features - Desktop Grid / Mobile Carousel */}
          <FadeInWhenVisible delay={200}>
            {/* Desktop: Full width grid showing all cards */}
            <div className="hidden md:grid md:grid-cols-3 md:gap-8 lg:gap-10 mb-8">
              {featureCards.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 h-full flex flex-col shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {/* Badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 w-fit">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    {feature.badge}
                  </div>

                  {/* Icon */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-6 flex-1 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Details */}
                    <div className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile: Horizontal carousel */}
            <div className="md:hidden">
              <HorizontalScrollCarousel
                desktopCardsVisible={3}
                mobileCardsVisible={1}
                cardSpacing={24}
                showArrows={true}
                showDots={true}
                autoplay={false}
                className="mb-8"
                cardClassName="h-full"
              >
                {featureCards.map((feature, index) => (
                  <div
                    key={feature.id}
                    className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 w-fit">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {feature.badge}
                    </div>

                    {/* Icon */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        {feature.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-6 flex-1 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                      
                      {/* Details */}
                      <div className="space-y-2">
                        {feature.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </HorizontalScrollCarousel>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>






      {/* Why Travelers Love Booking With Us - Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <FadeInWhenVisible>
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              {/* Main Title */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Why Travelers Love Booking With Us
              </h2>
              
              {/* Subtitle */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Develop a tailored content roadmap aligned with your brand goals.
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Three Steps with Connecting Line */}
          <div className="relative">
            {/* Horizontal connecting line for desktop */}
            <div className="hidden lg:block absolute top-10 left-1/2 transform -translate-x-1/2 w-full max-w-3xl mt-2 z-0">
              <div className="border-t-2 border-dashed border-gray-300"></div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto relative z-10">
              
              {/* Step 1 - Register Online */}
              <FadeInWhenVisible delay={200}>
                <div className="text-center relative">
                  {/* Icon */}
                  <div className="flex justify-center mb-6 relative z-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center shadow-lg">
                      <p className="h-10 w-10 sm:h-12 sm:w-12 text-white">1</p>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Register Online
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    With lots of unique blocks, you<br />
                    can easily build a page easily<br />
                    without any coding
                  </p>

                  {/* Vertical connecting line for mobile */}
                  <div className="lg:hidden absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gray-300"></div>
                </div>
              </FadeInWhenVisible>

              {/* Step 2 - Assessment Session */}
              <FadeInWhenVisible delay={400}>
                <div className="text-center relative">
                  {/* Icon */}
                  <div className="flex justify-center mb-6 relative z-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Assessment Session
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    With lots of unique blocks, you<br />
                    can easily build a page easily<br />
                    without any coding
                  </p>

                  {/* Vertical connecting line for mobile */}
                  <div className="lg:hidden absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gray-300"></div>
                </div>
              </FadeInWhenVisible>

              {/* Step 3 - 24/7 Live Support */}
              <FadeInWhenVisible delay={600}>
                <div className="text-center relative">
                  {/* Icon */}
                  <div className="flex justify-center mb-6 relative z-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <Phone className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    24/7 Live Support
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    With lots of unique blocks, you<br />
                    can easily build a page easily<br />
                    without any coding.
                  </p>
                </div>
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </section>



      
      {/* Integrations Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  CONNECT YOUR TOOLS
                </span>
              </div>
              <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-light text-gray-800 mb-3 leading-tight px-2">
                Connect StockFlow with <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-blue-600">
                  Your Business Tools
                </span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                Seamlessly integrate with your existing systems and streamline your workflow
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Integration Cards Marquee */}
          <FadeInWhenVisible delay={100}>
            <IntegrationCardMarquee 
              speed={420}
              cards={integrationCardsData.map((card, index) => (
                <div key={index} className={`bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 ${card.colorClass} hover:shadow-lg transition-all duration-300 h-full`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 ${card.iconBgClass} rounded-xl flex items-center justify-center`}>
                      <card.icon className={`h-6 w-6 ${card.iconColorClass}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            />
          </FadeInWhenVisible>        
        </div>
      </section>







      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-14 md:py-16 lg:py-18 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main White Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 md:p-16">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,4rem)] font-light text-gray-800 mb-3 leading-tight px-2">
            <BlurText className="justify-center" text="Why Choose Stockflow" onAnimationComplete={handleAnimationComplete} /> 

              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-5 md:mb-6 max-w-2xl mx-auto px-4">
                The smart choice for inventory management
              </p>
              <div className="inline-flex items-center p-12 gap-2 bg-blue-600 px-16 py-1 rounded-lg"></div>
            </div>
          </FadeInWhenVisible>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
              {/* Left Column - Feature Cards */}
              <div className="flex flex-col h-full">
                <FadeInWhenVisible delay={200}>
                  <div className="space-y-6 h-full">
                    {whyChooseUsCarousel.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon with colored background */}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            index === 0 ? 'bg-blue-400' : 
                            index === 1 ? 'bg-purple-500' : 
                            index === 2 ? 'bg-red-500' : 'bg-green-500'
                          }`}>
                            <div className="text-white [&>svg]:text-white">
                              {item.icon}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </FadeInWhenVisible>
                
            {/* CTA */}
            <FadeInWhenVisible delay={700}>
              <div className="text-center mt-16 mb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                  <ScrollTriggeredButton
                    as="button"
                    className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700
                      px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-4
                      text-lg sm:text-xl md:text-2xl
                      font-bold rounded-lg transform hover:scale-105
                      transition-all duration-300
                      shadow-2xl hover:shadow-3xl
                      ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none"
                    onClick={() => navigate('/pricing')}
                  >
                    Get Started Today
                  </ScrollTriggeredButton>
                  
                </div>
                
                <div className="mt-6 space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    Get up and running in under 10 minutes. No tech skills required.
                  </p>
                </div>
              </div>
            </FadeInWhenVisible>
              </div>

              {/* Right Column - Image */}
              {!isMobile && (
                <div className="flex flex-col h-full">
                  <FadeInWhenVisible delay={400}>
                    <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-gray-200 relative flex">
                      <img
                        src="/mobile.png"
                        alt="StockFlow Dashboard - Modern inventory management interface showing real-time analytics, product tracking, and business insights"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {/* Optional overlay or badge */}
                      <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-10">
                        Live Demo
                      </div>
                    </div>
                  </FadeInWhenVisible>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  FREQUENTLY ASKED QUESTIONS
                </span>
              </div>
              <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(3rem,5vw,4rem)] font-light text-gray-800 mb-3 leading-tight px-2">
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

          {/* Desktop AnimatedList FAQ - Only visible on desktop */}
          <div className="hidden md:block">
            {filteredFaqData.length > 0 ? (
              <div className="flex gap-8">
                <div className="flex-1">
                  <AnimatedList
                    items={filteredFaqData}
                    onItemSelect={(item, index) => {
                      setSelectedFAQ(selectedFAQ === index ? -1 : index);
                      setOpenFAQ(index);
                    }}
                    showGradients={true}
                    enableArrowNavigation={true}
                    displayScrollbar={true}
                    isFAQMode={true}
                    selectedFAQIndex={selectedFAQ === -1 ? undefined : selectedFAQ}
                    onFAQSelect={(index) => {
                      setSelectedFAQ(selectedFAQ === index ? -1 : index);
                      setOpenFAQ(index);
                    }}
                    className="w-full"
                  />
                </div>
                
                {/* FAQ Answer Panel */}
                {selectedFAQ >= 0 && filteredFaqData[selectedFAQ] && (
                  <div className="flex-1">
                    <FadeInWhenVisible delay={100}>
                      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 sticky top-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {filteredFaqData[selectedFAQ].question}
                        </h3>
                        {filteredFaqData[selectedFAQ].benefit && (
                          <p className="text-sm text-blue-600 font-medium mb-4">
                            {filteredFaqData[selectedFAQ].benefit}
                          </p>
                        )}
                        <p className="text-base text-gray-600 leading-relaxed">
                          {filteredFaqData[selectedFAQ].answer}
                        </p>
                      </div>
                    </FadeInWhenVisible>
                  </div>
                )}
              </div>
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
                  <ScrollTriggeredButton
                    as="button"
                    className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50
                      px-10 py-5 sm:px-12 sm:py-6 md:px-14 md:py-4
                      text-lg sm:text-xl md:text-2xl
                      font-bold rounded-lg transform hover:scale-105
                      transition-all duration-300
                      shadow-2xl hover:shadow-3xl
                      ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none"
                    onClick={() => navigate('/pricing')}
              >
                Start Importing
                </ScrollTriggeredButton>

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

  </div>
  );
};
