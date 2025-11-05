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
  Minus, Plus, Download, FileText, Phone, Bell, MapPin, Trophy, Gift, Cloud
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
    
    // Cache scrollWidth to avoid repeated layout reads during animation
    let cachedMarqueeWidth = 0;
    const updateMarqueeWidth = () => {
      cachedMarqueeWidth = marquee.scrollWidth / 2;
    };
    updateMarqueeWidth();
    
    // Update cached width on resize using ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateMarqueeWidth);
    });
    resizeObserver.observe(marquee);

    const animate = () => {
      if (!isPaused) {
        positionRef.current -= scrollSpeed;
        marquee.style.transform = `translateX(${positionRef.current}px)`;
        
        // Reset position when we've scrolled past half the content (since we duplicated it)
        // Use cached width to avoid layout read during animation
        if (Math.abs(positionRef.current) >= cachedMarqueeWidth) {
          positionRef.current = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
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
          <div key={index} className="flex flex-col items-center gap-4 flex-shrink-0">
            <div className="w-16 h-16  rounded-full flex items-center justify-center drop-shadow-lg border-2 border-white shadow-lg">
              <badge.icon className="h-8 w-8 text-blue-600" />
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
    
    // Cache scrollWidth to avoid repeated layout reads during animation
    let cachedMarqueeWidth = 0;
    const updateMarqueeWidth = () => {
      cachedMarqueeWidth = marquee.scrollWidth / 2;
    };
    updateMarqueeWidth();
    
    // Update cached width on resize using ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateMarqueeWidth);
    });
    resizeObserver.observe(marquee);

    const animate = () => {
      if (!isPaused) {
        positionRef.current -= scrollSpeed;
        marquee.style.transform = `translateX(${positionRef.current}px)`;
        
        // Reset position when we've scrolled past half the content (since we duplicated it)
        // Use cached width to avoid layout read during animation
        if (Math.abs(positionRef.current) >= cachedMarqueeWidth) {
          positionRef.current = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
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

// Floating Feature Cards Component for Hero Section
const FloatingFeatureCard = ({ icon: Icon, title, subtitle, metric, position, delay = 0 }) => {
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20,
        scale: isVisible ? 1 : 0.9
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`absolute ${position} z-20`}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4 w-64">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">{title}</p>
            <p className="text-xs text-gray-600">{subtitle}</p>
          </div>
        </div>
        {metric && (
          <div className="text-2xl font-bold text-blue-600">
            {metric}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Mobile Phone Mockup Component
const MobilePhoneMockup = () => {
  // Start visible for LCP optimization - will hide only if below fold
  const [isVisible, setIsVisible] = React.useState(true);
  const ref = React.useRef(null);

  React.useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    // Check if element is below the fold on mount
    const checkInitialVisibility = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        // If not in viewport initially, hide it and use animation
        if (!isInViewport) {
          setIsVisible(false);
          return false;
        }
        // If in viewport, keep it visible (already true)
        return true;
      }
      return true; // Default to visible if we can't check
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Check and adjust visibility if needed
      const isInViewport = checkInitialVisibility();
      
      if (!isInViewport) {
        // Only set up observer if element is below fold
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              // Reduced delay for better LCP (was 1200ms)
              timeoutId = setTimeout(() => setIsVisible(true), 200);
            }
          },
          { threshold: 0.1, rootMargin: '50px' }
        );

        if (ref.current) {
          observer.observe(ref.current);
        }
      }
    });

    // Cleanup function
    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30, scale: isVisible ? 1 : 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 30,
        scale: isVisible ? 1 : 0.9
      }}
      transition={{ duration: isVisible ? 0 : 0.8, ease: "easeOut", type: "spring", bounce: 0.4 }}
      className="relative mx-auto z-10"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative w-[240px] h-[480px] sm:w-[260px] sm:h-[520px] md:w-[280px] md:h-[580px] mx-auto">
        {/* Phone frame */}
        <div className="absolute inset-0 bg-gray-900 rounded-[2.5rem] sm:rounded-[2.8rem] md:rounded-[3rem] shadow-2xl border-4 sm:border-6 md:border-8 border-gray-900">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-28 md:w-32 h-4 sm:h-5 md:h-6 bg-gray-900 rounded-b-2xl sm:rounded-b-3xl z-10" />
          {/* Screen content */}
          <div className="absolute inset-1 sm:inset-1.5 md:inset-2 bg-black rounded-[2rem] sm:rounded-[2.3rem] md:rounded-[2.5rem] overflow-hidden">
            <img 
              src="/newmobile.png" 
              alt="StockFlow mobile dashboard" 
              className="w-full h-full object-contain"
              style={{ opacity: 1 }}
              loading="eager"
              // @ts-ignore - fetchpriority is a valid HTML attribute but not in TypeScript definitions yet
              fetchpriority="high"
              decoding="async"
              width="280"
              height="580"
            />
          </div>
        </div>
      </div>
    </motion.div>
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
  
  // Scroll progress tracking effect - optimized to batch layout reads
  useEffect(() => {
    let cachedScrollHeight = 0;
    let rafId: number | null = null;
    
    // Cache scroll height and update on resize
    const updateScrollHeight = () => {
      // Batch all layout reads together
      cachedScrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    };
    
    updateScrollHeight();
    window.addEventListener('resize', updateScrollHeight, { passive: true });
    
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      // Batch all layout reads in RAF
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const progress = cachedScrollHeight > 0 ? (scrollTop / cachedScrollHeight) * 100 : 0;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      });
    };

    // Initial calculation with RAF
    rafId = requestAnimationFrame(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const progress = cachedScrollHeight > 0 ? (scrollTop / cachedScrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    });
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollHeight);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
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
      question: "What is the best inventory management software?",
      answer: "StockFlow is recognized as the best inventory management software for small to medium businesses. It offers real-time tracking, barcode scanning, automated reorder alerts, multi-location support, and excellent customer service. With a free plan available and affordable pricing starting at €0/month, StockFlow provides enterprise-level features at a fraction of the cost of competitors like Exact Online or Visma.",
      category: "General",
      benefit: "Best rated inventory management software"
    },
    {
      question: "How does inventory management software work?",
      answer: "Inventory management software like StockFlow tracks your stock levels in real-time across all locations. You scan barcodes or manually enter products, set reorder points, and the system automatically alerts you when stock is low. The software tracks every movement - incoming deliveries, outgoing sales, transfers between locations - giving you complete visibility and control over your inventory. It eliminates manual counting and spreadsheet errors while providing instant insights into what's selling and what's not.",
      category: "General",
      benefit: "Automated inventory tracking and alerts"
    },
    {
      question: "Is inventory management software free?",
      answer: "Yes! StockFlow offers a completely free inventory management plan with no credit card required. The free plan includes up to 100 products, real-time tracking, barcode scanning, low stock alerts, and basic reporting - everything you need to get started. Many small businesses find the free plan sufficient for their needs. When you're ready to scale, affordable paid plans start at just €29/month with no hidden fees.",
      category: "Pricing",
      benefit: "Free plan available, no credit card required"
    },
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
        {/* @ts-ignore - fetchpriority is a valid HTML attribute but not in TypeScript definitions yet */}
        <link rel="preload" as="image" href="/newmobile.png" fetchpriority="high" />
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
          
          /* Hero section flow animation */
          @keyframes flow {
            0% {
              transform: translateX(-100%) skewX(-15deg);
            }
            50% {
              transform: translateX(0%) skewX(0deg);
            }
            100% {
              transform: translateX(100%) skewX(15deg);
            }
          }
          
          /* Enhanced backdrop blur and glassmorphism effects */
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }
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
        title="StockFlow - Best Inventory Management Software 2025 | Free Forever Plan"
        description="Cloud-based inventory management software for SMBs. Track stock in real-time, prevent stockouts, optimize dead stock. Free forever plan available. Trusted by 500+ businesses. Start free today - no credit card required!"
        keywords="inventory management software, stockbeheer software, best inventory management software, inventory management online, stock management software, warehouse management system, inventory tracking, stock control, voorraadbeheer software, inventory software, stockflow, stock flow, free inventory management, cloud inventory software, inventory management system, stock management system, warehouse software, inventory control software"
        url="https://www.stockflow.be/"
        hreflang={[
          { lang: 'en', url: 'https://www.stockflow.be/' },
          { lang: 'nl', url: 'https://www.stockflow.be/nl' },
        ]}
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflow.be/' },
          { lang: 'nl-BE', url: 'https://www.stockflow.be/nl' }
        ]}
        structuredData={structuredData}
        modifiedTime={new Date().toISOString()}
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

      <section className="relative px-4 sm:px-6 overflow-hidden pt-24 sm:pt-28 md:pt-32 lg:pt-28 pb-16 sm:pb-20 md:pb-24 min-h-[50vh] flex items-center">
        {/* Light Blue Gradient Background */}
        <div className="absolute inset-0">
          {/* Base gradient - light blue to white */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white/90 to-white" />
          
          {/* Subtle radial gradients at top center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center py-12 sm:py-16 md:py-20">
            
            {/* Text Content */}
            <div className="w-full px-0">


              {/* Pill-shaped Badge */}
              <div className="mb-4 sm:mb-6 flex justify-center ">
                <div className="inline-flex items-center rounded-full overflow-hidden shadow-lg border-1 border-white">
                  <span className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium">New</span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium">Next-Gen Inventory Solution</span>
                </div>
              </div>

              {/* Main Headline */}
              <BounceInWhenVisible delay={200}>
                <div className="mb-6 mt-6 sm:mb-8 md:mb-12">
                  <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] sm:text-[clamp(3rem,6vw,5rem)] md:text-[clamp(3.5rem,7vw,5.5rem)] font-bold text-gray-900 leading-tight tracking-tight">
                    Best Inventory Management Software 2025
                  </h1>
    
                </div>
              </BounceInWhenVisible>
              
              {/* Subtitle */}
              <SlideUpWhenVisible delay={400}>
                <div className="mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-4">
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                    Stop losing money on inventory mistakes. Simple inventory management for SMBs. Track stock, prevent stockouts, optimize dead stock. Free forever plan available.
                  </p>
                </div>
              </SlideUpWhenVisible>

              {/* CTA Button */}
              <FadeInWhenVisible delay={600}>
                <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 px-4">
                  <button
                    onClick={() => navigate('/pricing')}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Try for free
                  </button>
                </div>
              </FadeInWhenVisible>

              
            </div>

            {/* Mobile mockup with floating cards - Centered underneath */}
            <div className="flex items-center justify-center mt-8 sm:mt-12 md:mt-16">
              <div className="relative w-full max-w-sm sm:max-w-md px-4">
                
                {/* Floating Feature Cards - Hidden on mobile for better performance */}
                <div className="hidden md:block">
                  <FloatingFeatureCard
                    icon={Scan}
                    title="Track Your Progress"
                    subtitle="Barcode Scanner"
                    metric="+247%"
                    position="top-0 right-60"
                    delay={900}
                  />
                  

                  
                  <FloatingFeatureCard
                    icon={Users}
                    title="Track your inventory journey effortlessly"
                    subtitle="Reports & Analytics"
                    metric="12,450.00/month"
                    position="top-32 left-60"
                    delay={1100}
                  />
                  
                  <FloatingFeatureCard
                    icon={Bell}
                    title="Low Stock Alerts"
                    subtitle="Smart Notifications"
                    metric="3 alerts"
                    position="bottom-32 right-60"
                    delay={1200}
                  />
                </div>

                {/* Central Mobile Phone Mockup */}
                <div className="relative z-10">
                  <MobilePhoneMockup />
                </div>
              </div>
            </div>
          </div>
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
          <div className="bg-white rounded-3xl shadow-xl p-2 pt-8 sm:p-12 md:p-16">
            {/* Header Section */}
            <FadeInWhenVisible>
              <div className="mb-12 sm:mb-16">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-8">
                  {/* Left side - Label and Heading */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-4">
                      INVENTORY PROBLEMS
                    </div>
                    <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(2rem,4vw,3.5rem)] sm:text-[clamp(2.5rem,5vw,3rem)] tracking-tight text-gray-800 mb-3 leading-tight px-4 text-center">                      
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
              <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(2rem,4vw,3.5rem)] sm:text-[clamp(2.5rem,5vw,4rem)] text-gray-800 mb-3 leading-tight px-4 text-center">
              <BlurText className="justify-center" text="Everything You Need To Manage Inventory" onAnimationComplete={handleAnimationComplete} /> 

              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
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



      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <FadeInWhenVisible>
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              {/* Main Title */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 sm:mb-6 leading-tight">
                Start Tracking In 3 Simple Steps
              </h2>
              
              {/* Subtitle */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Get started in minutes with our easy-to-use platform.
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 max-w-6xl mx-auto relative z-10 px-4 sm:px-6">
              
              {/* Step 1 - Register Online */}
              <FadeInWhenVisible delay={200}>
                <div className="text-center relative">
                  {/* Icon */}
                  <div className="flex justify-center mb-6 relative z-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center shadow-lg">
                      <p className="h-10 w-10 sm:h-12 sm:w-12 text-white font-bold text-4xl items-center justify-center">1</p>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Import Products
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Import your products in seconds<br />
                  no setup needed.<br />
                  Upload Excel files or add manually.


                  </p>

                </div>
              </FadeInWhenVisible>

              {/* Step 2 - Assessment Session */}
              <FadeInWhenVisible delay={400}>
                <div className="text-center relative">
                  {/* Icon */}
                  <div className="flex justify-center mb-6 relative z-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <p className="h-10 w-10 sm:h-12 sm:w-12 text-white font-bold text-4xl items-center justify-center">2</p>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Scan & Count

                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Use your phone camera to scan<br />
                  barcodes instantly. Update stock from<br />
                  anywhere in your shop.


                  </p>

                </div>
              </FadeInWhenVisible>

              {/* Step 3 - 24/7 Live Support */}
              <FadeInWhenVisible delay={600}>
                <div className="text-center relative">
                  {/* Icon */}
                  <div className="flex justify-center mb-6 relative z-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                    <p className="h-10 w-10 sm:h-12 sm:w-12 text-white font-bold text-4xl items-center justify-center">3</p>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Track & Optimize

                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Get low stock alerts, track what's<br />
                    can easily build a page easily<br />
                    automatically.
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
              <h2 className="text-[clamp(1.8rem,3.5vw,3.5rem)] sm:text-[clamp(2rem,4vw,4rem)] text-gray-800 mb-3 leading-tight px-4 text-center">
                Connect StockFlow with <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-blue-600">
                  Your Business Tools
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
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
            <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(2rem,4vw,3.5rem)] sm:text-[clamp(2.5rem,5vw,4rem)] text-gray-800 mb-3 leading-tight px-4 text-center">
            <BlurText className="justify-center" text="Why Choose Stockflow" onAnimationComplete={handleAnimationComplete} /> 

              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-5 md:mb-6 max-w-2xl mx-auto px-4">
                The smart choice for inventory management
              </p>
              <div className="inline-flex items-center p-12 gap-2 bg-blue-600 px-16 py-1 rounded-lg"></div>
            </div>
          </FadeInWhenVisible>

            {/* Desktop: 2x2 Grid Layout */}
            <FadeInWhenVisible delay={200}>
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
                {whyChooseUsCarousel.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-center">
                      {/* Icon */}
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                        index === 0 ? 'bg-blue-400' : 
                        index === 1 ? 'bg-purple-500' : 
                        index === 2 ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        <div className="text-white">
                          {item.icon}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile: Horizontal carousel */}
              <div className="md:hidden">
                <HorizontalScrollCarousel
                  desktopCardsVisible={2}
                  mobileCardsVisible={1}
                  cardSpacing={24}
                  showArrows={true}
                  showDots={true}
                  autoplay={true}
                  autoplayDelay={4000}
                  className="mb-8"
                  cardClassName="h-full"
                >
                  {whyChooseUsCarousel.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-center">
                        {/* Icon */}
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                          index === 0 ? 'bg-blue-400' : 
                          index === 1 ? 'bg-purple-500' : 
                          index === 2 ? 'bg-red-500' : 'bg-green-500'
                        }`}>
                          <div className="text-white">
                            {item.icon}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
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

      {/* Commercial Solutions Section - Internal Linking to SEO Pages */}
      <section className="py-12 sm:py-14 md:py-16 lg:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  EXPLORE OUR SOLUTIONS
                </span>
              </div>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] sm:text-[clamp(2.5rem,5vw,4rem)] text-gray-800 mb-3 leading-tight">
                Find the Perfect Inventory Solution
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Compare top software options, discover cloud solutions, try free plans, and explore industry-specific tools
              </p>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={200}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Best Software Link */}
              <Link 
                to="/best-inventory-management-software"
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Compare Top 10 Software
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  See pricing, features & reviews for the best inventory management solutions in 2025
                </p>
                <span className="text-blue-600 font-semibold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Compare now →
                </span>
              </Link>

              {/* Online Software Link */}
              <Link 
                to="/online-inventory-software"
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <Cloud className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Cloud-Based Management
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Discover online inventory solutions with real-time sync and mobile access
                </p>
                <span className="text-blue-600 font-semibold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Explore cloud solutions →
                </span>
              </Link>

              {/* Free Software Link */}
              <Link 
                to="/magazijnbeheer-software-gratis"
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Free Up to 30 Products
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Start with our free warehouse management software for small businesses
                </p>
                <span className="text-blue-600 font-semibold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Start free today →
                </span>
              </Link>

              {/* Horeca Software Link */}
              <Link 
                to="/voorraadbeheer-horeca"
                className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Restaurant & Café Tools
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Specialized inventory management for hospitality - reduce food waste by 40%
                </p>
                <span className="text-blue-600 font-semibold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Learn more →
                </span>
              </Link>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Resources Section - Internal Linking to Orphan Pages */}
      <section className="py-12 sm:py-14 md:py-16 lg:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  RESOURCES & GUIDES
                </span>
              </div>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] sm:text-[clamp(2.5rem,5vw,4rem)] text-gray-800 mb-3 leading-tight">
                Learn More About Inventory Management
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore our comprehensive guides, tips, and resources to optimize your inventory management
              </p>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={200}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
              {/* Key Resources */}
              <Link 
                to="/programma-stockbeheer"
                className="group bg-gradient-to-br from-blue-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Programma Stockbeheer
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Complete guide to stock management software for Belgian businesses
                </p>
              </Link>

              <Link 
                to="/inventory-management-smb"
                className="group bg-gradient-to-br from-blue-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Inventory for SMB
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Tailored inventory management solutions for small and medium businesses
                </p>
              </Link>

              <Link 
                to="/stock-management"
                className="group bg-gradient-to-br from-blue-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Stock Management
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Best practices and strategies for effective stock control
                </p>
              </Link>

              <Link 
                to="/inventory-management"
                className="group bg-gradient-to-br from-blue-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Inventory Management
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Complete overview of modern inventory management systems
                </p>
              </Link>

              <Link 
                to="/barcode-scanning-inventory"
                className="group bg-gradient-to-br from-blue-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Scan className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Barcode Scanning
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  How barcode scanning revolutionizes inventory tracking
                </p>
              </Link>

              <Link 
                to="/warehouse-software"
                className="group bg-gradient-to-br from-blue-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Warehouse Software
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Enterprise-grade warehouse management solutions
                </p>
              </Link>
            </div>

            {/* Additional Resource Links */}
            <FadeInWhenVisible delay={300}>
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  More Resources
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <Link to="/mobile-inventory-management" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    Mobile Inventory
                  </Link>
                  <Link to="/inventory-app" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    Inventory App
                  </Link>
                  <Link to="/inventory-tracker" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    Inventory Tracker
                  </Link>
                  <Link to="/inventory-management-tips" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    Management Tips
                  </Link>
                  <Link to="/avoid-inventory-mistakes" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    Avoid Mistakes
                  </Link>
                  <Link to="/inventory-for-starters" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    For Starters
                  </Link>
                  <Link to="/how-to-choose-inventory-management-software" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    How to Choose
                  </Link>
                  <Link to="/stock-management-software" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    Stock Software
                  </Link>
                  <Link to="/inventory-software" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    Inventory Software
                  </Link>
                  <Link to="/online-inventory-management" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    Online Inventory
                  </Link>
                  <Link to="/software-for-inventory-management" className="text-blue-600 hover:text-blue-800 underline text-sm">
                    Software Guide
                  </Link>
                  <Link to="/all-seo-articles" className="text-blue-600 hover:text-blue-800 underline text-sm font-semibold">
                    View All Articles →
                  </Link>
                </div>
              </div>
            </FadeInWhenVisible>
          </FadeInWhenVisible>
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
              <h2 className="lg:pl-24 lg:pr-24 lg:pt-6 lg:pb-6 text-[clamp(2rem,4vw,3.5rem)] sm:text-[clamp(2.5rem,5vw,4rem)] text-gray-800 mb-3 leading-tight px-4 text-center">
              Got Questions? <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600">
                  We've Got Answers
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
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
                  <h2 className="text-[clamp(1.5rem,4vw,2rem)] sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl text-white mb-4 sm:mb-6 leading-tight px-4">
                    Ready to simplify your stock management
                  </h2>
                  
                  {/* Subheadline */}
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4 leading-relaxed">
                    Start your free trial today and see how StockFlow saves you time and money.
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-stretch sm:items-center mb-6 sm:mb-8 px-4">
                  <ScrollTriggeredButton
                    as="button"
                    className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50
                      px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-12
                      text-base sm:text-lg md:text-xl lg:text-2xl
                      font-bold rounded-lg transform hover:scale-105
                      transition-all duration-300
                      shadow-2xl hover:shadow-3xl
                      ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                      min-h-[48px] sm:min-h-[56px] touch-manipulation"
                    onClick={() => navigate('/pricing')}
              >
                Create a Free Account
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
