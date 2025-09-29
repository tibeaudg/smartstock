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
// import { useWebsiteTracking } from '@/hooks/useWebsiteTracking';
// import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';
import { ConversionTrackingTest } from './ConversionTrackingTest';

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
  
  // Initialize Google Ads tracking on component mount
  React.useEffect(() => {
    // Small delay to ensure gtag is loaded
    const timer = setTimeout(() => {
      GoogleAdsTracking.initializeGoogleAdsTracking();
      
      // Track homepage page view conversion
      GoogleAdsTracking.trackPageViewConversion(
        'homepage',
        1,
        {
          page_type: 'landing_page',
          conversion_type: 'page_view'
        }
      );
    }, 1000);
    
    return () => clearTimeout(timer);
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
    
    // Track Google Ads conversion for registration intent
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
    
    navigate('/auth');
  };

  const handlePricingClick = () => {
    logger.info('CTA click', { id: 'pricing' });
    
    // Track Google Ads conversion for pricing page view
    GoogleAdsTracking.trackPricingViewConversion('homepage_cta');
    
    navigate('/pricing');
  };

  const handleHowItWorksClick = () => {
    logger.info('CTA click', { id: 'how-it-works' });
    
    // Track Google Ads conversion for demo interest
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

  // Enhanced FAQ section - Objection handling and benefit-focused
  const faqData = [
    {
      question: "What if I'm not tech-savvy? Will I be able to use StockFlow?",
      answer: "Absolutely! StockFlow is designed specifically for small business owners, not IT experts. Our customers typically get up and running in under 10 minutes. We provide step-by-step guidance, and if you ever get stuck, our support team responds in under 5 minutes. Most users say it's easier than using Excel.",
      category: "Ease of Use",
      benefit: "No technical skills required"
    },
    {
      question: "How much money will StockFlow actually save my business?",
      answer: "Our customers save an average of €2,400 annually by eliminating stockouts and reducing waste. Laura from De Koffieboetiek saved €400/month just by preventing expired products. Tom from TechOnderdelen BV recovered €15,000 from a single inventory discrepancy. Most businesses see ROI within the first month.",
      category: "ROI & Savings",
      benefit: "Average €2,400 annual savings"
    },
    {
      question: "What if I'm already using Excel or another system?",
      answer: "Perfect! StockFlow imports your existing data in minutes, so you don't lose any historical information. Unlike Excel, you get real-time updates, automatic backups, and mobile access. Many customers keep Excel as backup but use StockFlow as their primary system because it's 10x faster and more accurate.",
      category: "Migration",
      benefit: "Seamless data import and migration"
    },
    {
      question: "Is my business data really secure with StockFlow?",
      answer: "Your data security is our top priority. We use bank-level 256-bit SSL encryption, daily automated backups, and are fully GDPR compliant. Your data is stored in secure European servers and never shared with third parties. We've never had a security breach in our 5+ years of operation.",
      category: "Security",
      benefit: "Bank-level security with GDPR compliance"
    },
    {
      question: "What if I need help or have questions?",
      answer: "We're here for you! Our support team responds in under 5 minutes during business hours, and we offer free onboarding calls to get you started. Unlike big enterprise software, you'll talk to real people who understand small business challenges. No chatbots, no ticket systems - just helpful humans.",
      category: "Support",
      benefit: "Human support in under 5 minutes"
    },
    {
      question: "Can I try StockFlow before committing to anything?",
      answer: "Of course! That's exactly what we recommend. Sign up for free (no credit card required), import a few products, and see how it works for your business. Most customers know within the first week if StockFlow is right for them. If it's not a perfect fit, you can export your data anytime.",
      category: "Free Plan",
      benefit: "Free forever plan with no commitment"
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

  // Benefit-focused features using Feature → Benefit → Impact formula
  const heroFeatures = [
    {
      icon: TrendingUp,
      title: "Never Miss Another Sale",
      benefit: "Stop losing €2,400+ annually to stockouts",
      impact: "Feel confident your bestsellers are always in stock",
      detailedDescription: "Real-time stock tracking across all locations, automated low stock alerts via email & SMS, smart reorder suggestions based on sales patterns, multi-location inventory management.",
      category: "Smart Inventory Management",
      visual: "stockout-prevention",
    },
    {
      icon: Users,
      title: "Turn Data Into Profit",
      benefit: "Increase profits by 15-25% with better decisions",
      impact: "Know exactly which products make you money",
      detailedDescription: "Sales performance analytics in real-time, inventory turnover analysis & insights, profit margin tracking by product, custom reports for better decision making.",
      category: "Advanced Analytics Dashboard",
      visual: "profit-optimization",
    },
    {
      icon: Zap,
      title: "Work From Anywhere",
      benefit: "Save 8 hours per week with mobile efficiency",
      impact: "Manage inventory without being tied to your desk",
      detailedDescription: "Mobile barcode scanning for instant updates, offline functionality - works without internet, push notifications for low stock alerts, touch-friendly interface for all skill levels.",
      category: "Mobile-First Experience",
      visual: "mobile-efficiency",
    },
  ];

  // Secondary features for mid-page detail grid
  const secondaryFeatures = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      benefit: "Your data is safe without the bank-level headaches",
      description: "GDPR compliant with enterprise-grade security that's simple to use.",
      category: "Security & Compliance"
    },
    {
      icon: BarChart3,
      title: "Design Reports in Minutes",
      benefit: "Launch professional reports without touching a line of code",
      description: "Drag-and-drop interface creates beautiful reports that impress stakeholders.",
      category: "Reporting & Analytics"
    },
    {
      icon: Clock,
      title: "We're Always Here",
      benefit: "Get a human on the line in under 5 minutes, 24/7",
      description: "Dedicated customer support that actually helps when you need it.",
      category: "Customer Support"
    },
    {
      icon: Package,
      title: "Works With Everything",
      benefit: "Connect all your tools without the integration headaches",
      description: "Seamless integration with your existing systems and workflows.",
      category: "Integrations"
    }
  ];

  // Data metrics for the features section - focused on key benefits
  const dataMetrics = [
    { value: "€2,400", label: "Average Annual Savings", description: "Stop losing money to stockouts" },
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
    { number: "10,000+", label: "Happy Customers" },
    { number: "98%", label: "Customer Retention" },
    { number: "€2M+", label: "Inventory Value Managed" },
    { number: "4.9/5", label: "Average Rating" }
  ];
  
  const testimonials = [
    {
      name: "Laura Peeters",
      role: "Owner, De Koffieboetiek",
      title: "Coffee Shop Owner",
      quote: "StockFlow's automatic reorder system increased our inventory accuracy by 95% and cut our stockouts by 80% in the first quarter. We went from losing €400/month on expired products to zero waste. The ROI was immediate.",
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
        "€400/month waste elimination",
        "Immediate ROI in first quarter"
      ],
      beforeAfter: {
        before: "Manual tracking, frequent stockouts, €400/month waste",
        after: "95% accuracy, zero waste, automated reorders"
      }
    },
    {
      name: "Tom De Wit",
      role: "Operations Manager, TechOnderdelen BV",
      title: "Electronics Distributor",
      quote: "When we had a critical inventory discrepancy worth €15,000, StockFlow's real-time tracking identified the issue in under 5 minutes. Their support team resolved it completely within 2 hours. We've never had such fast, reliable inventory management.",
      avatar: '/jan.png',
      rating: 5,
      company: "TechOnderdelen BV",
      location: "Antwerp, Belgium",
      industry: "Technology",
      savings: `${formatPrice(5200)}/year saved`,
      timeSaved: "12 hours/week",
      specificResults: [
        "€15,000 discrepancy resolved in 5 minutes",
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
      avatar: '/Laura.png',
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
      title: "Easy Stock Management",
      desc: "Track your inventory with our intuitive interface designed for small businesses.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Real-time Analytics", 
      desc: "Get insights into your stock levels, sales trends, and business performance.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      desc: "Work together with your team on inventory management and order processing.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Reliable",
      desc: "Your data is protected with enterprise-grade security and 99.9% uptime.",
    },
  ];
  // --- EINDE USP DATA ---

  // --- BEGIN SUBSCRIPTION FEATURES DATA ---
  const subscriptionFeatures = [
    {
      icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
      title: "Analytics & Reporting",
      description: "Comprehensive insights into your inventory performance and business metrics.",
      features: [
        "Real-time stock reports",
        "Sales analytics dashboard",
        "Performance metrics",
        "Custom report builder"
      ],
      tier: "growth",
      image: "/placeholder.svg"
    },
    {
      icon: <Scan className="h-12 w-12 text-green-600" />,
      title: "Barcode Scanning",
      description: "Quick and accurate inventory tracking with mobile barcode scanning.",
      features: [
        "Mobile barcode scanner",
        "Batch scanning support",
        "Custom barcode generation",
        "Offline scanning capability"
      ],
      tier: "growth",
      image: "/placeholder.svg"
    },
    {
      icon: <Truck className="h-12 w-12 text-purple-600" />,
      title: "Delivery Management",
      description: "Streamline your delivery process with integrated delivery note management.",
      features: [
        "Incoming delivery notes",
        "Outgoing delivery tracking",
        "Supplier management",
        "Delivery scheduling"
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
      title: "Team Collaboration",
      desc: "Work together with your team on inventory management and order processing.",
      learnMore: "#",
    },
    {
      icon: <BarChart3 className="h-12 w-12" />,
      title: "Advanced Analytics",
      desc: "Get detailed insights into your inventory performance and business metrics.",
      learnMore: "#",
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Secure Platform",
      desc: "Enterprise-grade security with 99.9% uptime guarantee for your business data.",
      learnMore: "#",
    },
  ];
  // --- EINDE CAPABILITIES DATA ---

  // --- BEGIN FEATURE DATA ---
  const landingFeatures = [
    {
      title: "Never Run Out of Stock Again",
      subtitle: "Smart Inventory Management",
      desc: "Stop losing sales to stockouts. StockFlow automatically tracks your inventory and alerts you when to reorder, so you never miss a sale.",
      benefits: [
        "Real-time stock tracking across all locations",
        "Automated low stock alerts via email & SMS",
        "Smart reorder suggestions based on sales patterns",
        "Multi-location inventory management"
      ],
      icon: <Package className="h-8 w-8 text-white" />,
      gradient: "from-blue-500 to-blue-700",
      bgPattern: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500",
      stats: "Save €2,400+ annually",
    },
    {
      title: "Make Data-Driven Decisions",
      subtitle: "Advanced Analytics Dashboard",
      desc: "Turn your inventory data into actionable insights. See exactly which products are your money-makers and optimize your stock levels for maximum profit.",
      benefits: [
        "Sales performance analytics in real-time",
        "Inventory turnover analysis & insights",
        "Profit margin tracking by product",
        "Custom reports for better decision making"
      ],
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      gradient: "from-green-500 to-green-700",
      bgPattern: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-500",
      stats: "Increase profits by 15-25%",
    },
    {
      title: "Manage Inventory Anywhere",
      subtitle: "Mobile-First Experience",
      desc: "Take your inventory management with you. Our mobile app lets you scan barcodes, update stock levels, and manage orders from anywhere.",
      benefits: [
        "Mobile barcode scanning for instant updates",
        "Offline functionality - works without internet",
        "Push notifications for low stock alerts",
        "Touch-friendly interface for all skill levels"
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
      
      // Track Google Ads conversion for lead capture
      GoogleAdsTracking.trackContactFormConversion(
        'email_signup',
        leadEmail,
        5 // Assign value to email signups
      );
      
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
      "name": "StockFlow - Smart Inventory Management",
      "description": "Professional inventory management software for growing businesses. Track stock levels, manage suppliers, and grow your business with our powerful yet simple platform.",
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
          "description": "Free plan - 100% gratis voorraadbeheer voor KMO's",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01"
        },
        {
          "@type": "Offer",
          "price": "29",
          "priceCurrency": "EUR",
          "description": "Growth plan - Advanced features for growing businesses",
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
      "author": {"@type": "Organization", "name": "StockFlow"},
      "publisher": {"@type": "Organization", "name": "StockFlow", "logo": {"@type": "ImageObject", "url": "https://www.stockflow.be/logo.png"}},
      "image": ["https://www.stockflow.be/Inventory-Management.png", "https://www.stockflow.be/optimized/desktop.png"],
      "screenshot": "https://www.stockflow.be/optimized/desktop.png",
      "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/"},
      "featureList": [
        "Real-time inventory tracking",
        "Multi-location support", 
        "Barcode scanning",
        "Automated reorder points",
        "Analytics and reporting",
        "Team collaboration",
        "Mobile app access"
      ]
    },
    // WebPage Schema
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Smart Inventory Management",
      "description": "Track stock levels, manage suppliers, and grow your business with our powerful yet simple inventory management platform.",
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
        title="StockFlow - Stop Losing Money to Stockouts |  SME Inventory Management"
        description="Never run out of stock again. StockFlow automatically tracks your inventory, alerts you when to reorder, and saves  SMEs €2,400+ per year. Built specifically for  small businesses."
        keywords="voorraadbeheer software, stockbeheer software, inventory management Belgium, voorraadbeheer gratis, stockbeheer gratis,  inventory software, SME inventory management, voorraadbeheer KMO, stockbeheer KMO, prevent stockouts, automatic reordering, inventory tracking Belgium, voorraadbeheer app, stockbeheer app,  business software, voorraadbeheer systeem, stockbeheer systeem, inventory management for small business, voorraadbeheer voor kleine bedrijven, stockbeheer voor kleine bedrijven,  ERP alternative, voorraadbeheer versus Excel, stockbeheer versus Excel, automatic inventory alerts, voorraadbeheer automatisering, stockbeheer automatisering,  inventory tracking, voorraadbeheer tracking, stockbeheer tracking, inventory management software Belgium, voorraadbeheer software België, stockbeheer software België, small business inventory, voorraadbeheer kleine onderneming, stockbeheer kleine onderneming,  business tools, voorraadbeheer tools, stockbeheer tools, inventory software for SMEs, voorraadbeheer software KMO, stockbeheer software KMO, prevent stockouts Belgium, voorraadbeheer stockouts voorkomen, stockbeheer stockouts voorkomen, automatic reorder points, voorraadbeheer automatisch bestellen, stockbeheer automatisch bestellen,  inventory management, voorraadbeheer België, stockbeheer België, SME inventory tracking, voorraadbeheer tracking KMO, stockbeheer tracking KMO, inventory alerts Belgium, voorraadbeheer waarschuwingen, stockbeheer waarschuwingen,  small business software, voorraadbeheer kleine bedrijven software, stockbeheer kleine bedrijven software"
        url="https://www.stockflow.be/"
        hreflang={[
          { lang: 'en', url: 'https://www.stockflow.be/' },
          { lang: 'de', url: 'https://www.stockflow.be/de/' },
          { lang: 'fr', url: 'https://www.stockflow.be/fr/' },
          { lang: 'es', url: 'https://www.stockflow.be/es/' },
          { lang: 'it', url: 'https://www.stockflow.be/it/' },
          { lang: 'pl', url: 'https://www.stockflow.be/pl/' },
          { lang: 'hu', url: 'https://www.stockflow.be/hu/' },
          { lang: 'sv', url: 'https://www.stockflow.be/sv/' },
          { lang: 'th', url: 'https://www.stockflow.be/th/' },
          { lang: 'si', url: 'https://www.stockflow.be/si/' },
          { lang: 'ro', url: 'https://www.stockflow.be/ro/' }
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
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50 py-16 md:py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Text Content */}
          <div className="text-center mb-8 md:mb-16">
          
              <BounceInWhenVisible delay={200}>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-light text-gray-800 mb-6 md:mb-8 leading-tight">
                  <span className="block">Stop Losing Money</span>
                  <span className="block text-blue-600">to Stockouts</span>
                </h1>
              </BounceInWhenVisible>
              
              <SlideUpWhenVisible delay={400}>
                <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                  Never run out of stock again. StockFlow automatically tracks your inventory, alerts you when to reorder, and saves SMEs €2,400+ per year.
                </p>
              </SlideUpWhenVisible>
              
              <ScaleInWhenVisible delay={600}>
                <div className="mb-6 md:mb-8">
                <Button
              onClick={handleLoginClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border border-blue-500/20"
            >
              Get Free Forever Plan
            </Button>
                </div>
              </ScaleInWhenVisible>
              
              <FadeInWhenVisible delay={800}>
                <p className="text-sm text-gray-500 mb-2">
                  No credit card needed ♦ Unlimited time on Free plan
                </p>
                <p className="text-xs text-gray-400">
                  Includes a Free Plan for 1 User/100 Products, or Try All Features Free for 14 Days
                </p>
              </FadeInWhenVisible>
            </div>
            
          {/* Video Showcase Below */}
          <SlideUpWhenVisible delay={1000}>
            <div className="relative max-w-5xl mx-auto px-4">
              {/* Video Container */}
              <div className="relative bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                <video
                  className="w-full h-auto"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop&crop=center"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                
                {/* Play Button Overlay (for fallback) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Video Features */}
              <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Real-time updates
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Mobile responsive
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                  Easy integration
                </div>
              </div>
              
              {/* View Demo Button */}
              <div className="mt-8 text-center">
                <Link
                  to="/demo"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 border-2 border-blue-600 hover:border-blue-700 px-8 py-4 rounded-full shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                >
                  View Demo →
                </Link>
              </div>
            </div>
          </SlideUpWhenVisible>
        </div>
      </section>


      {/* Trust Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 font-medium mb-6">
                Trusted by 10,000+ businesses across Europe
              </p>
            </div>
          </FadeInWhenVisible>
          
          <SlideUpWhenVisible delay={200}>
            <div className="flex justify-center items-center w-full">
              <img
                src="/trusted.png"
                alt="Trusted by businesses across Europe"
                className="h-24 md:h-32 w-full object-contain"
                style={{ maxWidth: "200vw" }}
                loading="lazy"
              />
            </div>
          </SlideUpWhenVisible>
          
          <FadeInWhenVisible delay={400}>
            <div className="text-center mt-8">
              <p className="text-xs text-gray-400">
                From small coffee shops to large distributors
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>



      {/* Enhanced Features Section - Benefit-Focused */}
      <section id="features-section" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Compelling Headline */}
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
                How StockFlow Saves You Money
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
                Real businesses save €2,400+ annually. See exactly how StockFlow prevents stockouts, 
                reduces waste, and turns inventory management into profit.
              </p>

            </div>
          </FadeInWhenVisible>
          
          {/* Top 3 Hero Features */}
          <div className="mb-20">
            <Carousel
              itemsPerView={{
                mobile: 1,
                tablet: 2,
                desktop: 3
              }}
              showArrows={true}
              showDots={true}
              autoPlay={false}
              className="px-4"
            >
              {heroFeatures.map((feature, index) => (
                <StaggerInWhenVisible 
                  key={index} 
                  delay={index * 200}
                  staggerDelay={index * 100}
                >
                  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full">
                    {/* Hero Visual */}
                    <div className={`relative h-80 overflow-hidden ${
                      index === 0 ? 'bg-gradient-to-br from-red-500 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                      'bg-gradient-to-br from-blue-500 to-cyan-500'
                    }`}>
                      {/* Device Mockup */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          {/* Laptop Mockup */}
                          <div className="w-64 h-40 bg-gray-800 rounded-lg shadow-2xl transform rotate-3">
                            <div className="w-full h-full bg-white rounded-t-lg p-4">
                              <div className="h-2 bg-gray-200 rounded mb-2"></div>
                              <div className="h-2 bg-gray-200 rounded mb-2 w-3/4"></div>
                              <div className="h-2 bg-gray-200 rounded mb-2 w-1/2"></div>
                              <div className="flex space-x-1 mt-4">
                                <div className="w-8 h-8 bg-green-500 rounded"></div>
                                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                                <div className="w-8 h-8 bg-purple-500 rounded"></div>
                              </div>
                            </div>
                          </div>
                          {/* Mobile Mockup */}
                          <div className="absolute -bottom-4 -right-4 w-16 h-24 bg-gray-800 rounded-lg shadow-xl transform -rotate-12">
                            <div className="w-full h-full bg-white rounded-t-lg p-2">
                              <div className="h-1 bg-gray-200 rounded mb-1"></div>
                              <div className="h-1 bg-gray-200 rounded mb-1 w-2/3"></div>
                              <div className="w-4 h-4 bg-blue-500 rounded mt-2"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating Icons */}
                      <div className="absolute top-4 right-4">
                        <feature.icon className="h-8 w-8 text-white opacity-80" />
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                      {/* Category Badge */}
                      <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        {feature.category}
                      </div>
                      
                      {/* Benefit-Driven Headline */}
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      
                      {/* Benefit Statement */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 mb-4 border border-green-200">
                        <div className="text-base md:text-lg font-semibold text-green-700 mb-1">{feature.benefit}</div>
                        <div className="text-sm text-gray-600">{feature.impact}</div>
                      </div>
                      

                      
                      {/* Feature Highlights */}
                      <div className="space-y-3 mb-6">
                        {feature.detailedDescription.split(', ').slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </StaggerInWhenVisible>
              ))}
            </Carousel>
          </div>

          {/* Mid-Page Detail Grid */}
          <FadeInWhenVisible delay={600}>
            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
                  Built for Small Business Success
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Everything you need to manage inventory like a pro. 
                  No complexity, no unnecessary features, just results.
                </p>
              </div>
              
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
                {secondaryFeatures.map((feature, index) => (
                  <StaggerInWhenVisible key={index} delay={index * 150} staggerDelay={index * 50}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-colors">
                        <feature.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-sm text-blue-600 font-medium mb-3">{feature.benefit}</p>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                    </div>
                  </StaggerInWhenVisible>
                ))}
              </Carousel>
            </div>
          </FadeInWhenVisible>

          {/* Technical Detail Section */}
          <FadeInWhenVisible delay={800}>
            <div className="p-6 md:p-8">
              

              
          <div className="text-center mt-8 md:mt-12">
          <Button
              onClick={handleLoginClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border border-blue-500/20"
            >
              Get Started →
            </Button>
            <p className="text-xs md:text-sm text-gray-500 mt-3">
              No credit card required, start in less than 2 minutes
            </p>

          </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>



      {/* Why Choose Us Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Compelling Headline */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
              Why Choose StockFlow
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Built specifically for small businesses. 
              Simple, powerful, and designed to save you time and money from day one.
            </p>
            
            {/* Trust Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {trustStats.map((stat, index) => (
                <div key={index} className="text-center px-4">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
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

          {/* Human Connection - Founder Story */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                  Founded by Inventory Experts Who Understand Your Pain
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  StockFlow was born from frustration. After years of managing inventory for small businesses, 
                  we were tired of seeing complex, expensive solutions that didn't understand SME needs. 
                  We built StockFlow because we believe every business deserves simple, powerful inventory management.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Community First</h4>
                <p className="text-gray-600">
                  For every new customer, we donate €1 to local business development programs. 
                  We're not just building software—we're building a community.
                </p>
              </div>
            </div>
          </div>

          {/* Clear Call to Action */}
          <div className="text-center mt-12">
            <Button
              onClick={handleLoginClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border border-blue-500/20"
            >
              Get Started →
            </Button>

            <p className="text-sm text-gray-500 mt-2">
              Join 10,000+ businesses already using StockFlow • Setup in 5 minutes
            </p>
          </div>
        </div>
      </section>


      

      {/* Enhanced Testimonials Section */}
      <section id="testimonials-section" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4">
          {/* Compelling Headline */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
              Real Customers, Real Savings
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              See how businesses like yours save €2,400+ annually with StockFlow. 
              Real results from real customers.
            </p>
            

          </div>

          {/* Enhanced Testimonials Grid */}
          <div className="mb-16">
            <Carousel
              itemsPerView={{
                mobile: 1,
                tablet: 2,
                desktop: 3
              }}
              showArrows={true}
              showDots={true}
              autoPlay={false}
              className="px-4"
            >
              {testimonials.map((testimonial, index) => (
                <StaggerInWhenVisible 
                  key={index} 
                  delay={index * 200}
                  staggerDelay={index * 100}
                >
                  <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Rating Stars */}
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">Verified Customer</span>
                  </div>
                  
                  {/* Testimonial Quote */}
                  <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  {/* Enhanced User Info with Photo */}
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-blue-200">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) nextElement.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg" style={{display: 'none'}}>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-blue-600 font-medium">{testimonial.title}</div>
                      <div className="text-sm text-gray-600">{testimonial.company} • {testimonial.location}</div>
                    </div>
                  </div>
                  
                  {/* Industry & Savings */}
                  <div className="flex justify-center items-center pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">{testimonial.industry}</div>
                      <div className="text-lg font-bold text-green-600">{testimonial.savings}</div>
                    </div>
                  </div>
                  </div>
                </StaggerInWhenVisible>
              ))}
            </Carousel>
          </div>

          {/* Social Proof & Case Studies */}
          <div className="p-8 md:p-8">
            

            {/* CTA */}
            <div className="text-center">
            <Button
              onClick={handleLoginClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border border-blue-500/20"
            >
              Get Started →
            </Button>

              <p className="text-sm text-gray-500 mt-2">
                Join thousands of businesses already saving time and money • Free forever plan available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section id="faq-section" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Compelling Headline */}
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
                Common Questions, Clear Answers
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
                Everything you need to know about StockFlow. 
                Get answers to the questions that matter most to your business.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-8">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-1" />
                  <span>5-minute support response</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-500 mr-1" />
                  <span>100% GDPR Compliant</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-purple-500 mr-1" />
                  <span>10,000+ happy customers</span>
                </div>
              </div>
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
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Our team is here to help. Get personalized answers to your specific business questions 
                in under 5 minutes.
              </p>
              
              <div className="flex flex-col gap-4 justify-center max-w-sm mx-auto">
                <Button
                  onClick={() => navigate('/contact')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 w-full"
                >
                  Ask Your Question →
                </Button>
                <Button
                  onClick={() => navigate('/demo')}
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 w-full"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Enterprise Security Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-light text-gray-800 mb-4 md:mb-6">
              Enterprise-grade security
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
              Keep your company's data secure and compliant with industry-leading security standards and certifications.
            </p>
          </FadeInWhenVisible>
          
          {/* Security Certifications */}
          <FadeInWhenVisible delay={200}>
            <div className="mb-8 md:mb-12">
              <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto">
                {/* GDPR */}
                <div className="flex flex-col items-center px-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center mb-3">
                    <div className="text-center">
                      <div className="text-xs font-bold text-gray-800">GDPR</div>
                      <div className="text-xs text-gray-600">Compliant</div>
                    </div>
                  </div>
                </div>

                {/* SOC 2 */}
                <div className="flex flex-col items-center px-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center mb-3">
                    <div className="text-center">
                      <div className="text-xs font-bold text-gray-800">SOC 2</div>
                      <div className="text-xs text-gray-600">Type II</div>
                    </div>
                  </div>
                </div>

                {/* ISO 27001 */}
                <div className="flex flex-col items-center px-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center mb-3">
                    <div className="text-center">
                      <div className="text-xs font-bold text-gray-800">ISO</div>
                      <div className="text-xs text-gray-600">27001</div>
                    </div>
                  </div>
                </div>

                {/* HIPAA */}
                <div className="flex flex-col items-center px-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center mb-3">
                    <div className="text-center">
                      <div className="text-xs font-bold text-gray-800">HIPAA</div>
                      <div className="text-xs text-gray-600">Ready</div>
                    </div>
                  </div>
                                  </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Enhanced Final CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center px-4 relative z-10">
          {/* Main Headline */}
          <BounceInWhenVisible delay={200}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Ready to Stop Losing Money to Stockouts?
            </h2>
          </BounceInWhenVisible>

          {/* Description */}
          <SlideUpWhenVisible delay={400}>
            <p className="text-lg md:text-xl lg:text-2xl text-white mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
              Start your free account today and save €2,400+ per year in lost sales. 
              <span className="text-yellow-300 font-semibold"> No credit card required, setup in 5 minutes.</span>
            </p>
          </SlideUpWhenVisible>

          {/* Primary CTA */}
          <ScaleInWhenVisible delay={600}>
            <div className="mb-6 md:mb-8">
            <Button
              onClick={handleLoginClick}
              className="bg-white hover:bg-blue-700 text-blue-600 px-12 py-6 text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border border-blue-500/20"
            >
              Start Free Today →
            </Button>
            </div>
          </ScaleInWhenVisible>

          {/* Trust Indicators */}
          <SlideUpWhenVisible delay={700}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 max-w-4xl mx-auto">
              <div className="flex items-center justify-center text-white">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-400 mr-2" />
                <span className="text-xs md:text-sm font-medium">No credit card required</span>
              </div>
              <div className="flex items-center justify-center text-white">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-yellow-400 mr-2" />
                <span className="text-xs md:text-sm font-medium">Instant access</span>
              </div>
              <div className="flex items-center justify-center text-white">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-green-400 mr-2" />
                <span className="text-xs md:text-sm font-medium">GDPR-compliant</span>
              </div>
              <div className="flex items-center justify-center text-white">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-400 mr-2" />
                <span className="text-xs md:text-sm font-medium">100% secure</span>
              </div>
            </div>
          </SlideUpWhenVisible>

          {/* Statistics */}
          <SlideUpWhenVisible delay={900}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-lg md:text-4xl font-bold text-white mb-2">10,000+</div>
                <div className="text-sm md:text-lg text-white">Active SMEs</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-4xl font-bold text-white mb-2">8hrs</div>
                <div className="text-sm md:text-lg text-white">Time saved/week</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-4xl font-bold text-white mb-2">4.8/5</div>
                <div className="text-sm md:text-lg text-white">Customer satisfaction</div>
              </div>
            </div>
          </SlideUpWhenVisible>
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




      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Company Logo */}
            <div className="flex items-center">
              <OptimizedImage
                src="/logo.png"
                alt="StockFlow"
                className="h-8 w-auto"
                loading="lazy"
                sizes="32px"
              />
                        </div>
            
            {/* Pages */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-200">Pages</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => scrollToSection('features-section')} 
                  className="block text-gray-400 hover:text-white"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works-section')} 
                  className="block text-gray-400 hover:text-white"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials-section')} 
                  className="block text-gray-400 hover:text-white"
                >
                  Reviews
                </button>
                <button 
                  onClick={() => scrollToSection('faq-section')} 
                  className="block text-gray-400 hover:text-white"
                >
                  FAQs
                </button>
            </div>
                      </div>
            
            {/* Contact */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-200">Contact</h3>
              <div className="space-y-2">
                <Link to="/contact" className="block text-gray-400 hover:text-white">
                  Contact Us
                </Link>
                <Link to="/support" className="block text-gray-400 hover:text-white">
                  Support
                </Link>
                <Link to="/demo" className="block text-gray-400 hover:text-white">
                  Demo
                </Link>
              </div>
            </div>
            
            {/* Socials */}
      <div>
              <h3 className="text-lg font-medium mb-4 text-gray-200">Socials</h3>
              <div className="flex space-x-4">
            <a 
              href="https://www.facebook.com/profile.php?id=61578067034898"
              target="_blank" 
              rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com/stockflow" 
              target="_blank" 
              rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/stockflow" 
              target="_blank" 
              rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://www.instagram.com/stockflowbe"
              target="_blank" 
              rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      
          <div className="border-t border-gray-700 pt-6 text-center">
            <div className="mb-4">
              <p className="text-gray-400 text-sm italic">
                Built by inventory management experts in Belgium to solve the complex challenge of 
                stockouts and overstocking that costs SMEs thousands of euros annually.
              </p>
        </div>
            <p className="text-gray-500 text-sm">
              © 2025 StockFlow. All Rights Reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-sm">
            Privacy Policy
          </Link>
              <Link to="/terms-conditions" className="text-gray-500 hover:text-white text-sm">
            Terms & Conditions
          </Link>
        </div>
    </div>
  </div>
</footer>

  </div>
  );
};
