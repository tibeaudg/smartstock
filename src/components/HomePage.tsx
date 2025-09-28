import React, { useState, useRef, lazy } from 'react';
import { Header } from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

// Enhanced animation components with different effects
  const FadeInWhenVisible = ({ children, delay = 0, direction = 'up' }) => {
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
        className={`transition-all duration-700 ease-out ${
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

const ScaleInWhenVisible = ({ children, delay = 0 }) => {
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
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
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

  // FAQ section data
  const faqData = [
    {
      question: "Is StockFlow really 100% free for SMEs?",
      answer: "Yes, StockFlow is completely free for SMEs. No hidden costs, no limits on users or products. We believe every business should have access to professional inventory management."
    },
    {
      question: "How does the free inventory management program work?",
      answer: "Register your free account, add your products, and start managing your inventory immediately. Our inventory management system is intuitive and requires no technical knowledge."
    },
    {
      question: "Can I use StockFlow on my mobile phone?",
      answer: "Absolutely! Our inventory management app works perfectly on all devices - smartphone, tablet and desktop. Always and everywhere access to your inventory data."
    },
    {
      question: "Is my data safe in the cloud?",
      answer: "Yes, we take the security of your data very seriously. Daily backups, SSL encryption and GDPR compliance ensure that your inventory data is always safe."
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

  // Enhanced features with real StockFlow content
  const features = [
    {
      icon: TrendingUp,
      title: "Never Run Out of Stock Again",
      description: "Stop losing sales to stockouts. StockFlow automatically tracks your inventory and alerts you when to reorder, so you never miss a sale.",
      detailedDescription: "Real-time stock tracking across all locations, automated low stock alerts via email & SMS, smart reorder suggestions based on sales patterns, multi-location inventory management.",
      benefit: "Save €2,400+ annually",
      category: "Smart Inventory Management"
    },
    {
      icon: Users,
      title: "Make Data-Driven Decisions",
      description: "Turn your inventory data into actionable insights. See exactly which products are your money-makers and optimize your stock levels for maximum profit.",
      detailedDescription: "Sales performance analytics in real-time, inventory turnover analysis & insights, profit margin tracking by product, custom reports for better decision making.",
      benefit: "Increase profits by 15-25%",
      category: "Advanced Analytics Dashboard"
    },
    {
      icon: Zap,
      title: "Manage Inventory Anywhere",
      description: "Take your inventory management with you. Our mobile app lets you scan barcodes, update stock levels, and manage orders from anywhere.",
      detailedDescription: "Mobile barcode scanning for instant updates, offline functionality - works without internet, push notifications for low stock alerts, touch-friendly interface for all skill levels.",
      benefit: "Save 8 hours per week",
      category: "Mobile-First Experience"
    },
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

  // Why choose us reasons
  const whyChooseUs = [
    {
      icon: <Euro className="h-8 w-8" />,
      title: "100% Free Forever",
      description: "No hidden costs, no limits. Completely free for SMEs."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Quick Setup",
      description: "Get started in 5 minutes with our intuitive interface."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Built for SMEs",
      description: "Designed specifically for small and medium businesses."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Compliant",
      description: "GDPR compliant with enterprise-grade security."
    }
  ];
  
  const testimonials = [
    {
      name: "Sophie Foster",
      role: "Sales Director, A Place In the Garden",
      quote: "StockFlow has transformed our business operations. We never miss a sale anymore, even when items are out of stock. Our online sales have increased significantly. The system is so user-friendly that our entire team could get started immediately.",
      avatar: '/Laura.png',
      rating: 5,
      company: "A Place In the Garden",
      location: "Belgium",
      industry: "E-commerce",
      savings: `${formatPrice(2400)}/year saved`,
      timeSaved: "8 hours/week"
    },
    {
      name: "Sławomir Tokarski",
      role: "CEO, TTM",
      quote: "With StockFlow our customers can pre-order products, allowing us to capture sales we would otherwise miss. Our revenue has seen a noticeable increase! The integration with our existing systems was seamless and the support is excellent.",
      avatar: '/jan.png',
      rating: 5,
      company: "TTM",
      location: "Belgium",
      industry: "Manufacturing",
      savings: `${formatPrice(5200)}/year saved`,
      timeSaved: "12 hours/week"
    },
    {
      name: "Laura Peeters",
      role: "Owner, De Koffieboetiek - Ghent",
      quote: "Thanks to StockFlow I finally have a clear overview of my inventory. The automatic order notifications are a lifesaver! As an SME, the free plan is perfect for us. We have been able to increase our sales and never have shortages anymore.",
      avatar: '/Laura.png',
      rating: 5,
      company: "De Koffieboetiek",
      location: "Ghent",
      industry: "Hospitality",
      savings: `${formatPrice(1800)}/year saved`,
      timeSaved: "6 hours/week"
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
      {/* Navigation Bar - Sticky */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-3xl flex items-center justify-center mr-3">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-medium text-gray-900">stockflow</span>
      </div>

            {/* Right Side - Navigation Links and Action Buttons */}
            <div className="flex items-center space-x-8">
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/features"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Contact
                </Link>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/demo"
                  className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-3xl font-medium transition-colors"
                >
                  View Demo
                </Link>
                <Button
                  onClick={handleLoginClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-3xl font-medium transition-colors shadow-md"
                >
                  Register/Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video Below */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50 py-32 px-4 mt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Text Content */}
          <div className="text-center mb-16">
          
              <FadeInWhenVisible delay={200}>
                <h1 className="text-5xl md:text-7xl font-light text-gray-800 mb-8 leading-tight">
                  <span className="block">One inventory platform</span>
                  <span className="block">for any kind of business</span>
                </h1>
              </FadeInWhenVisible>
              
              <FadeInWhenVisible delay={400}>
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                  Plan and execute inventory management across retail, wholesale, manufacturing, and e-commerce with a unified, AI-first product suite.
                </p>
              </FadeInWhenVisible>
              
              <FadeInWhenVisible delay={600}>
                <div className="mb-8">
                  <Button
                    onClick={handleLoginClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Get Started →
                  </Button>
                </div>
              </FadeInWhenVisible>
              
              <FadeInWhenVisible delay={800}>
                <p className="text-sm text-gray-500">
                  No credit card needed ♦ Unlimited time on Free plan
                </p>
              </FadeInWhenVisible>
            </div>
            
          {/* Video Showcase Below */}
          <FadeInWhenVisible delay={400}>
            <div className="relative max-w-5xl mx-auto">
              {/* Video Container */}
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
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
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Video Features */}
              <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
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
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors border border-blue-600 hover:border-blue-700 px-6 py-3 rounded-3xl"
                >
                  View Demo →
                </Link>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>


      {/* Trust Bar */}
      <section className="relative">

      </section>



      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
                Solutions for every business
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powered by one platform.
            </p>
          </div>
          </FadeInWhenVisible>
          
          {/* Optimized Features Grid - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.slice(0, 3).map((feature, index) => (
              <FadeInWhenVisible 
                key={index} 
                delay={index * 200}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  {/* Hero Image */}
                  <div className={`relative h-64 overflow-hidden ${
                    index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                    index === 1 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                    'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <feature.icon className="h-16 w-16 mx-auto mb-4 opacity-90" />
                        <div className="inline-block bg-gray-600 text-white px-3 py-1 rounded-full text-sm mb-2">
                          {feature.category}
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                        <div className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                          {feature.benefit}
                        </div>
                      </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    {/* Feature highlights */}
                    <div className="space-y-3 mb-8">
                      {feature.detailedDescription.split(', ').map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center text-sm text-gray-500">
                          <div className="w-2 h-2 rounded-full mr-3 bg-blue-600"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Call to Action */}
          <FadeInWhenVisible delay={600}>
                      <div className="text-center">
              <Button
                onClick={handleLoginClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Get Started Free →
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • Setup in 5 minutes
              </p>
                      </div>
          </FadeInWhenVisible>
        </div>
      </section>



      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
              Why Choose Us Section
              </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make your strengths obvious.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-3xl mb-4">
                  {reason.icon}
              </div>
                <h3 className="text-xl font-medium mb-3 text-gray-900">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
                </div>
            ))}
                </div>
        </div>
      </section>


      

      {/* Review Section */}
      <section id="testimonials-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
              Review Section
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Users can sell your product better than you
            </p>
                    </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                      </div>
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                      </div>
                    </div>
                        </div>
                      ))}
                    </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
              FAQ Section
              </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handle objections before they happen.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-sm border border-gray-200">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <span className="text-2xl">{openFAQ === index ? '−' : '+'}</span>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                      </div>
            ))}
                      </div>
                    </div>
      </section>

      {/* Enterprise Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
              Enterprise-grade security
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Keep your company's data secure and compliant with industry-leading security standards and certifications.
            </p>
          </FadeInWhenVisible>
          
          {/* Security Certifications */}
          <FadeInWhenVisible delay={200}>
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              {/* GDPR */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-800">GDPR</div>
                    <div className="text-xs text-gray-600">Compliant</div>
                        </div>
                </div>
                <span className="text-sm text-gray-600">GDPR</span>
                    </div>

              {/* SOC 2 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-800">SOC 2</div>
                    <div className="text-xs text-gray-600">Type II</div>
                  </div>
                </div>
                <span className="text-sm text-gray-600">SOC 2</span>
          </div>

              {/* ISO 27001 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-800">ISO</div>
                    <div className="text-xs text-gray-600">27001</div>
        </div>
                </div>
                <span className="text-sm text-gray-600">ISO 27001</span>
          </div>

              {/* HIPAA */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-800">HIPAA</div>
                    <div className="text-xs text-gray-600">Ready</div>
              </div>
          </div>
                <span className="text-sm text-gray-600">HIPAA</span>
                </div>
          </div>
          </FadeInWhenVisible>
        
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          {/* Main Headline */}
          <h2 className="text-5xl md:text-7xl font-light text-gray-800 mb-16">
            Ready to Stop Losing Money to Stockouts?
              </h2>
         

            
          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <Button
              onClick={handleLoginClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-medium rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Start Free Today
            </Button>

          </div>


              

        </div>
      </section>

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto max-w-6xl m-4 rounded-3xl bg-white shadow-xl border border-gray-200 p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
            <p className="text-sm text-gray-700">
              We use cookies to improve your experience on our website
            </p>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" className="border-gray-300" onClick={() => setShowCookieBanner(false)}>Decline</Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={acceptCookies}>Accept</Button>
            </div>
          </div>
        </div>
      )}




      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
