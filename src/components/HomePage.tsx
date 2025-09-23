import React, { useState, useRef, lazy } from 'react';
import { Header } from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, BarChart3, Users, Shield, Check, TrendingUp, Zap, Star, Clock, Euro, Target, 
  ChevronLeft, ChevronRight, Scan, Truck, ArrowRight, Play, Award, Globe, Smartphone, 
  CheckCircle, Rocket, Crown, Sparkles, Timer, Facebook, Twitter, Linkedin, Instagram,
  Repeat,
  Camera
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { motion } from 'framer-motion';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import OptimizedImage from '@/components/OptimizedImage';
import { Helmet } from 'react-helmet-async';
import { logger } from '../lib/logger';
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

// Optimized fade-in component with reduced motion support
const FadeInWhenVisible = ({ children, delay = 0 }) => {
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
    <div ref={ref} className={isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}>
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
      question: "Is StockFlow really 100% free for SMEs in Flanders?",
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
    },
    {
      question: "How does StockFlow differ from other inventory management software?",
      answer: "StockFlow is specifically developed for SMEs, completely free, and offers all essential functions without complexity. No expensive licenses or hidden costs like with Odoo or Exact."
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Optimize Your Cashflow",
      description: "Prevent excess inventory and dead stock. Get precise insight into what you need, when you need it.",
    },
    {
      icon: Zap,
      title: "Save Time and Reduce Errors",
      description: "Automate orders and minimize manual counts. Focus on growth, not administration.",
    },
    {
      icon: Users,
      title: "Seamless Team Collaboration",
      description: "Work efficiently with your team thanks to clear user roles and real-time data updates.",
    },
    {
      icon: Shield,
      title: "Safe and Always Available",
      description: "Your data is safe in the cloud. Always and everywhere accessible, with daily backups.",
    },
  ];
  
  const testimonials = [
    {
      name: "Laura Peeters",
      role: "Owner, De Koffieboetiek - Ghent",
      quote: "Thanks to StockFlow I finally have a clear overview of my inventory. The automatic order notifications are a lifesaver! As an SME, the free plan is perfect for us.",
      avatar: '/Laura.png',
      rating: 5,
      company: "De Koffieboetiek",
      location: "Ghent",
      industry: "Hospitality",
      savings: "€2,400/year saved",
      timeSaved: "8 hours/week"
    },
    {
      name: "Tom De Wit",
      role: "Manager, TechOnderdelen BV - Antwerp",
      quote: "The switch to StockFlow was the best decision for our warehouse management. It's intuitive, fast and the team is very helpful. Finally an inventory management program that really works.",
      avatar: '/jan.png',
      rating: 5,
      company: "TechOnderdelen BV",
      location: "Antwerp",
      industry: "Technology",
      savings: "€5,200/year saved",
      timeSaved: "12 hours/week"
    },
    {
      name: "Anke Willems",
      role: "Manager, Creatief Atelier - Bruges",
      quote: "As a small business, the free plan is perfect for us. We can now manage our materials much more efficiently. An absolute recommendation for every SME!",
      avatar: '/placeholder.svg',
      rating: 5,
      company: "Creatief Atelier",
      location: "Bruges",
      industry: "Creative",
      savings: "€1,800/year saved",
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
      title: "Smart Inventory Management",
      desc: "Take control of your stock with our intuitive inventory management system designed for growing businesses.",
      img: "/optimized/image.png",
      imgMobile: "/optimized/image-mobile.png",
      reverse: false,
      features: [
        "Real-time stock tracking",
        "Automated low stock alerts",
        "Multi-location support",
        "Barcode scanning integration"
      ],
      icon: <Package className="h-12 w-12 text-blue-600" />
    },
    {
      title: "Advanced Analytics Dashboard",
      desc: "Make data-driven decisions with comprehensive analytics and reporting tools for your inventory performance.",
      img: "/optimized/analytics.png",
      imgMobile: "/optimized/analytics-mobile.png",
      reverse: true,
      features: [
        "Sales performance metrics",
        "Inventory turnover analysis",
        "Profit margin tracking",
        "Custom report generation"
      ],
      icon: <BarChart3 className="h-12 w-12 text-green-600" />
    },
    {
      title: "Mobile-First Experience",
      desc: "Manage your inventory on the go with our mobile-optimized interface that works seamlessly across all devices.",
      img: "/optimized/mobile.png",
      imgMobile: "/optimized/mobile-mobile.png",
      reverse: false,
      features: [
        "Mobile barcode scanning",
        "Offline functionality",
        "Push notifications",
        "Touch-friendly interface"
      ],
      icon: <Smartphone className="h-12 w-12 text-purple-600" />
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
      "priceRange": "€€"
    }
  ];

  return (
    <div className="bg-white text-gray-900 font-sans" style={{
      /* 
      CUSTOM HEADER SIZES - Adjust these values to change header font sizes
      Values are in rem units (1rem = 16px typically)
      Example: '10rem' = 160px, '8rem' = 128px, '6rem' = 96px
      */
      '--hero-header-size': '10rem',        // "Smart Inventory Management" - Hero section
      '--features-header-size': '8rem',     // "Features - Everything You Need"  
      '--demo-header-size': '8rem',         // "See It In Action - Watch Our Demo"
      '--testimonials-header-size': '8rem', // "Users Tell About Their Success"
      '--use-cases-header-size': '8rem', // "Smarter inventory management for e-commerce, warehouses and physical stores"
      '--cta-header-size': '10rem'          // "Get Started Free" - Final CTA
    } as React.CSSProperties}>
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
        title="Smart Inventory Management - For Growing Businesses | StockFlow"
        description="Track stock levels, manage suppliers, and grow your business with our powerful yet simple inventory management platform."
        keywords="free inventory management software, stock management software, inventory tracking software, warehouse management system, WMS software, stock control software, inventory management system, warehouse software, stock tracking, inventory control, warehouse management, stock management, inventory tracking, warehouse automation, stock management software, warehouse operations, inventory control system, warehouse management software, WMS platform, stock management platform, inventory management platform, warehouse management solution, stock control system, warehouse operations management, inventory management software, warehouse management platform, stock tracking system, warehouse management tools, inventory management tools, warehouse software solution, stock management platform, warehouse management software, inventory control software, warehouse management system software, WMS platform, warehouse management tools, inventory tracking platform, stock management tools, warehouse optimization software, supply chain software, logistics management, warehouse efficiency software, inventory management platform, stock control software, warehouse operations software, inventory tracking tools, warehouse management solution software, stock management system, warehouse automation software, inventory control platform, warehouse management software solution, WMS software solution, warehouse management platform software, stock tracking platform, warehouse management tools software, inventory management tools software, warehouse software platform, stock management platform software, warehouse management software platform, inventory control software platform, warehouse management system platform, WMS platform software, warehouse management tools platform, inventory tracking platform software, stock management tools platform, warehouse optimization platform, supply chain platform, logistics platform, warehouse efficiency platform, inventory management platform software, stock control platform software, warehouse operations platform software, inventory tracking platform tools, warehouse management solution platform, stock management system platform, warehouse automation platform software, inventory control platform software, warehouse management software platform solution, WMS software platform solution, warehouse management platform solution, stock tracking platform solution, warehouse management tools platform solution, inventory management tools platform solution, warehouse software platform solution, stock management platform solution, warehouse management software platform solution, inventory control software platform solution, warehouse management system platform solution, WMS platform solution, warehouse management tools platform solution, inventory tracking platform solution, stock management tools platform solution, warehouse optimization platform solution, supply chain platform solution, logistics platform solution, warehouse efficiency platform solution, inventory management platform solution, stock control platform solution, warehouse operations platform solution, inventory tracking platform solution, warehouse management solution platform solution, stock management system platform solution, warehouse automation platform solution, inventory control platform solution"
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
        onLoginClick={handleLoginClick}
        onNavigate={scrollToSection}
        simplifiedNav={false}
        hideNotifications={true}
      />

      {/* SUBHEADER - Rating & Social Proof */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">4.9/5 rating</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
            <span className="text-sm font-medium text-gray-600">500+ happy users</span>
          </div>
        </div>
      </div>

      {/* Hero Section - Optimized for Mobile */}
      <section 
        className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 bg-gradient-to-br from-blue-500 to-blue-900 min-h-screen flex items-center"
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-white order-1 lg:order-1 text-center lg:text-left">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-200 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Trusted by 500+ businesses
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="block">StockFlow Inventory</span>
                <span className="block">Management</span>
                <span className="block text-blue-300 mt-2">for growing businesses</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The only inventory management software that makes <strong>100% automatic decisions</strong> for small businesses. Stop manual tracking, prevent stockouts, and grow your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 lg:py-5 rounded-xl font-bold text-base sm:text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl text-center flex items-center justify-center"
                >
                  Start Your Free Trial
                </Link>
                <Link
                  to="/demo"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 lg:py-5 rounded-xl font-bold text-base sm:text-lg lg:text-xl transition-all duration-300 text-center flex items-center justify-center"
                >
                  Watch 2-Min Demo
                </Link>
              </div>

              {/* Live Inventory Dashboard - Mobile Version (Hidden on desktop) */}
              <div className="lg:hidden relative mb-6 sm:mb-8 max-w-md mx-auto">
                <div className="relative bg-white rounded-2xl shadow-2xl p-3 sm:p-4">
                  {/* Demo Interface Mockup */}
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="font-semibold text-gray-800 text-xs sm:text-sm">Live Inventory Dashboard</h3>
                      <div className="flex space-x-1 sm:space-x-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Mock Dashboard Content */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                        <div className="text-green-600 font-bold text-sm sm:text-base">1,247</div>
                        <div className="text-green-600 text-xs sm:text-sm">Products in Stock</div>
                      </div>
                      <div className="bg-orange-100 p-2 sm:p-3 rounded-lg">
                        <div className="text-orange-600 font-bold text-sm sm:text-base">23</div>
                        <div className="text-orange-600 text-xs sm:text-sm">Low Stock Alert</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-black flex items-center justify-between p-1.5 sm:p-2 bg-white rounded">
                        <span className="text-xs sm:text-sm">📱 Smartphone Case</span>
                        <span className="text-xs bg-orange-100 text-orange-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Reorder</span>
                      </div>
                      <div className="text-black flex items-center justify-between p-1.5 sm:p-2 bg-white rounded">
                        <span className="text-xs sm:text-sm">💻 Laptop Charger</span>
                        <span className="text-xs bg-green-100 text-green-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">In Stock</span>
                      </div>
                      <div className="text-black flex items-center justify-between p-1.5 sm:p-2 bg-white rounded">
                        <span className="text-xs sm:text-sm">🎧 Wireless Headphones</span>
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Out of Stock</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Success Badge */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-green-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg animate-bounce">
                    ✓ Auto-Reorder Active
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6 text-blue-200">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">14-day free trial</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Setup in 5 minutes</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Visual Demo (Desktop only) */}
            <div className="hidden lg:block relative order-1 lg:order-2 mb-6 lg:mb-0">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto lg:max-w-none">
                {/* Demo Interface Mockup */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 text-base">Live Inventory Dashboard</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Mock Dashboard Content */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <div className="text-green-600 font-bold text-lg">1,247</div>
                      <div className="text-green-600 text-sm">Products in Stock</div>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <div className="text-orange-600 font-bold text-lg">23</div>
                      <div className="text-orange-600 text-sm">Low Stock Alert</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm">📱 Smartphone Case</span>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Reorder</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm">💻 Laptop Charger</span>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">In Stock</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm">🎧 Wireless Headphones</span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Out of Stock</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Success Badge */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
                  ✓ Auto-Reorder Active
                </div>
              </div>
              
              {/* Background Decorative Elements - Hidden on mobile for better performance */}
              <div className="hidden sm:block absolute -z-10 top-5 left-5 sm:top-10 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-blue-400/20 rounded-full blur-xl"></div>
              <div className="hidden sm:block absolute -z-10 bottom-5 right-5 sm:bottom-10 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-purple-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>


      {/* KENGETALLEN / SOCIAL PROOF STRIP */}
      <section id="stats-section" className="bg-white py-6 sm:py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 divide-x divide-dashed divide-gray-200">
            {[
              { icon: Users, value: '500+', label: 'Happy Users' },
              { icon: Clock, value: '17k+', label: 'Hours Saved' },
              { icon: Package, value: '500k+', label: 'Product Movements' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center px-2 sm:px-4 lg:px-6">
                <s.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-gray-400 mb-1 sm:mb-2 md:mb-3" />
                <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold tracking-tight text-blue-700">{s.value}</div>
                <div className="mt-1 text-xs sm:text-sm md:text-base text-gray-700 font-medium text-center leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Enhanced Social Proof Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
          <FadeInWhenVisible>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Trusted by Growing Businesses</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="features-header font-bold mb-4 sm:mb-6 px-4">
                <span className="block text-gray-900">Trusted by Growing Businesses</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                Across Industries
                </span>
              </h2>
            </FadeInWhenVisible>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join hundreds of small businesses that have transformed their inventory management and saved thousands of euros
            </p>
          </div>



          
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {testimonials.map((t, index) => (
              <FadeInWhenVisible key={t.name}>
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Header with avatar and rating */}
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <OptimizedImage 
                        className="h-12 w-12 rounded-full object-cover border-2 border-blue-100" 
                        src={t.avatar} 
                        alt={`${t.name} - ${t.role}`}
                        loading="lazy"
                        decoding="async"
                        sizes="48px"
                        onLoad={(e) => {
                          e.currentTarget.classList.add('loaded');
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{t.name}</div>
                        <div className="text-sm text-gray-500">{t.role}</div>
                        <div className="text-xs text-blue-600 font-medium">{t.company} • {t.location}</div>
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed mb-6">"{t.quote}"</p>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{t.savings}</div>
                        <div className="text-xs text-gray-500">Costs saved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{t.timeSaved}</div>
                        <div className="text-xs text-gray-500">Time saved</div>
                      </div>
                    </div>
                  </div>

                  {/* Industry badge */}
                  <div className="px-6 pb-4">
                    <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {t.industry}
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden mb-16">
            <MobileCarousel 
              items={testimonials}
              renderItem={(testimonial) => (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <OptimizedImage 
                        className="h-12 w-12 rounded-full object-cover border-2 border-blue-100" 
                        src={testimonial.avatar} 
                        alt={`${testimonial.name} - ${testimonial.role}`}
                        loading="lazy"
                        decoding="async"
                        sizes="48px"
                        onLoad={(e) => {
                          e.currentTarget.classList.add('loaded');
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                        <div className="text-xs text-blue-600 font-medium">{testimonial.company}</div>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6 text-sm">"{testimonial.quote}"</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{testimonial.savings}</div>
                        <div className="text-xs text-gray-500">Saved per month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{testimonial.timeSaved}</div>
                        <div className="text-xs text-gray-500">Hours saved per week</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Security Badges */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6">Trusted and Secure</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="font-medium">SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-6 h-6 text-purple-600" />
                <span className="font-medium">SOC 2 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      


      {/* FEATURES - Enhanced with animations */}
      <section id="features-section" className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <FadeInWhenVisible>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Features</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="features-header font-bold mb-4 sm:mb-6 px-4">
                <span className="block text-gray-900">How StockFlow Solves</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                Your Biggest Inventory Problems
                </span>
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Powerful inventory management features that help you stay organized, save time, and grow your business.
              </p>
            </FadeInWhenVisible>
          </div>

          {landingFeatures.map((feature, idx) => (
            <div
              key={feature.title}
              className={`mb-12 sm:mb-16 md:mb-24 ${
                feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
              } flex flex-col items-center`}
            >
              <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center max-w-6xl mx-auto">
                {/* Content */}
                <div className={`text-center md:text-left ${feature.reverse ? 'md:order-2' : 'md:order-1'}`}>
                  <FadeInWhenVisible>
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                      {feature.icon}
                    </div>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 px-4">
                      {feature.title}
                    </h3>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
                      {feature.desc}
                    </p>
                  </FadeInWhenVisible>
                  
                  {/* Feature list */}
                  <FadeInWhenVisible>
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 px-4">
                      {feature.features.map((feat, featIdx) => (
                        <div key={featIdx} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm sm:text-base text-gray-700 font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </FadeInWhenVisible>


                </div>

                {/* Image */}
                <div className={`${feature.reverse ? 'md:order-1' : 'md:order-2'} px-4`}>
                  <FadeInWhenVisible>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
                        <OptimizedImage
                          src={feature.img}
                          srcSet={`
                            ${feature.imgMobile} 768w,
                            ${feature.img} 1024w
                          `}
                          alt={`${feature.title} - Voorraadbeheer voor KMO's`}
                          className="rounded-lg sm:rounded-xl w-full h-48 sm:h-64 md:h-80 object-contain"
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onLoad={(e) => {
                            e.currentTarget.classList.add('loaded');
                          }}
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      
                      {/* Floating elements */}
                      <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                        <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-8 h-8 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                        <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                    </div>
                  </FadeInWhenVisible>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      
      {/* FEATURES SECTIE - Everything You Need */}
      <section id="features-section" className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {subscriptionFeatures.map((feature, index) => (
              <FadeInWhenVisible key={index}>
                <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${feature.tier === 'groei' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-100'}`}>
                  {feature.tier === 'groei' && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    </div>
                  )}
                  
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-xl">
                        {feature.icon}
                      </div>
                      <div className="text-right">
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{feature.description}</p>

                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      {feature.features.map((featureItem, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 sm:gap-3">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-700">{featureItem}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden mb-12 sm:mb-16">
            <MobileCarousel 
              items={subscriptionFeatures}
              renderItem={(feature) => (
                <div className={`relative bg-white rounded-2xl shadow-lg border-2 ${feature.tier === 'groei' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-100'} mx-2`}>
                  {feature.tier === 'groei' && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        {feature.icon}
                      </div>
                      <div className="text-right">
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">{feature.description}</p>

                    <div className="space-y-3 mb-8">
                      {feature.features.map((featureItem, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-base text-gray-700">{featureItem}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}
            />
          </div>


        </div>
      </section>


            {/* Use Cases Section */}
            <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
          <FadeInWhenVisible>
              <h2 className="features-header font-bold mb-4 sm:mb-6 px-4">
                <span className="block text-gray-900">For small and growing businesses</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                Across Industries
                </span>
              </h2>
            </FadeInWhenVisible>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <MobileCarousel 
              items={useCases}
              renderItem={(useCase) => (
                <div className="bg-white p-6 rounded-lg shadow-lg text-center mx-2">
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </div>
              )}
            />
          </div>
        </div>
      </section>


      {/* Demo Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Demo Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Camera className="w-4 h-4 mr-2" />
                Interactive Demo Available
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                See StockFlow in Action
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Watch our 2-minute demo and discover how StockFlow can transform your inventory management. See real features, real results, and real savings.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Live inventory tracking demonstration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Barcode scanning in real-time</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Automatic reorder point setup</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Mobile app walkthrough</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Demo Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                {/* Demo Video Placeholder */}
                <div className="bg-gray-900 rounded-xl aspect-video mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">

                      <h3 className="text-xl font-bold mb-2 mt-32">Demo Video</h3>
                      <p className="text-blue-100">2-minute walkthrough</p>
                    </div>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link
                      to="/demo"
                      className="w-20 h-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl"
                    >
                      <div className="w-0 h-0 border-l-[12px] border-l-blue-600 border-y-[8px] border-y-transparent ml-1"></div>
                    </Link>
                  </div>
                </div>
                
                {/* Demo Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2min</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">Free</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">Live</div>
                    <div className="text-sm text-gray-600">Demo</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                ✓ No Signup Required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COOKIE CONSENT BANNER */}
      {showCookieBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto max-w-6xl m-4 rounded-lg bg-white shadow-xl border border-gray-200 p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
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


      {/* FINAL CTA - Enhanced for maximum conversion */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-900 py-12 sm:py-16 md:py-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6">
          <FadeInWhenVisible>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <Rocket className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Get Started Free</span>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <h2 className="cta-header font-bold mb-4 sm:mb-6 text-white leading-tight px-4">
              <span className="block">Ready to Transform Your Inventory Management?</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Start for free today
              </span>
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed px-4">
              Get Started Free and see how StockFlow can help your business.
            </p>
          </FadeInWhenVisible>

          {/* Value proposition */}
          <FadeInWhenVisible>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto">
              {(() => {
                try {
                  const benefits = [
                    "Start within 2 minutes",
                    "100% safe and free",
                    "Professional support"
                  ];
                  if (Array.isArray(benefits)) {
                    return benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center justify-center gap-3 text-white/90">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          {index === 0 ? <Zap className="h-6 w-6" /> : 
                           index === 1 ? <Shield className="h-6 w-6" /> :
                           <Users className="h-6 w-6" />}
                        </div>
                        <span className="font-medium">{benefit}</span>
                      </div>
                    ));
                  }
                } catch (error) {
                  console.warn('Translation error for benefits:', error);
                }
                // Fallback data
                return [
                  "Start within 2 minutes",
                  "100% safe and free",
                  "Professional support"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center justify-center gap-3 text-white/90">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      {index === 0 ? <Zap className="h-6 w-6" /> : 
                       index === 1 ? <Shield className="h-6 w-6" /> :
                       <Users className="h-6 w-6" />}
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ));
              })()}
            </div>
          </FadeInWhenVisible>

          {/* CTA Buttons */}
          <FadeInWhenVisible>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
              <Button 
                data-analytics-id="final-start" 
                size="lg" 
                className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl text-sm sm:text-lg w-full sm:w-auto group relative overflow-hidden"
                onClick={handleLoginClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Rocket className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-bounce" />
                    Get Started Free
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </FadeInWhenVisible>

          {/* Trust indicators */}
          <FadeInWhenVisible>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/80 mb-6 sm:mb-8 px-4">
              {(() => {
                try {
                  const trust = [
                    "No credit card required",
                    "Instant access",
                    "GDPR-compliant",
                    "100% secure"
                  ];
                  if (Array.isArray(trust)) {
                    return trust.map((trustItem, index) => (
                      <div key={index} className="flex items-center gap-1 sm:gap-2">
                        {index === 0 ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> : 
                         index === 1 ? <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> :
                         index === 2 ? <Shield className="h-3 w-3 sm:h-4 sm:w-4" /> :
                         <Globe className="h-3 w-3 sm:h-4 sm:w-4" />}
                        <span>{trustItem}</span>
                      </div>
                    ));
                  }
                } catch (error) {
                  console.warn('Translation error for trust:', error);
                }
                // Fallback data
                return [
                  "No credit card required",
                  "Instant access",
                  "GDPR-compliant",
                  "100% secure"
                ].map((trustItem, index) => (
                  <div key={index} className="flex items-center gap-1 sm:gap-2">
                    {index === 0 ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> : 
                     index === 1 ? <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> :
                     index === 2 ? <Shield className="h-3 w-3 sm:h-4 sm:w-4" /> :
                     <Globe className="h-3 w-3 sm:h-4 sm:w-4" />}
                    <span>{trustItem}</span>
                  </div>
                ));
              })()}
            </div>
          </FadeInWhenVisible>

          {/* Urgency element */}
          <FadeInWhenVisible>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto border border-white/20">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
                <span className="text-yellow-300 font-semibold text-sm sm:text-base">Get started today and save hours every week with our inventory management system</span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm">
                Get started today and save hours every week with our inventory management system
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Social Proof Numbers */}
          <FadeInWhenVisible>
            <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-3xl mx-auto">
              {(() => {
                try {
                  const stats = [
                    { number: "500+", label: "Active SMEs" },
                    { number: "9 hours", label: "Time saved/week" },
                    { number: "4.8/5", label: "Customer satisfaction" }
                  ];
                  if (Array.isArray(stats)) {
                    return stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1">{stat.number}</div>
                        <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
                      </div>
                    ));
                  }
                } catch (error) {
                    console.warn('Translation error for stats:', error);
                }
                // Fallback data
                return [
                  { number: "500+", label: "Active SMEs" },
                  { number: "9 hours", label: "Time saved/week" },
                  { number: "4.8/5", label: "Customer satisfaction" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
                  </div>
                ));
              })()}
            </div>
          </FadeInWhenVisible>
        </div>
      </section>




<footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Company Info */}
      <div>
        <OptimizedImage
          src="/logo.png"
          alt="stockflow"
          className="h-10 md:h-12 mb-6"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 40px, 48px"
          onLoad={(e) => {
            e.currentTarget.classList.add('loaded');
          }}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
          Smart inventory management for growing businesses
        </p>
        
        {/* Social Media Follow Buttons */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-3">
            <a 
              href="https://www.facebook.com/profile.php?id=61578067034898"
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com/stockflow" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-lg transition-colors"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/stockflow" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg transition-colors"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://www.instagram.com/stockflowbe"
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-lg transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        
      </div>
      
      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="space-y-2">
          <button 
            onClick={() => scrollToSection('video-section')} 
            className="block text-gray-400 hover:text-white underline cursor-pointer"
          >
            Demo
          </button>
          <button 
            onClick={() => scrollToSection('contact-section')} 
            className="block text-gray-400 hover:text-white underline cursor-pointer"
          >
            Contact
          </button>
          <Link to="/auth" className="block text-gray-400 hover:text-white underline">
            Login
          </Link>
          <Link to="/pricing" className="block text-gray-400 hover:text-white underline">
            Pricing
          </Link>
        </div>
      </div>
      
      {/* Resources */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Resources</h3>
        <div className="space-y-2">
          <button 
            onClick={() => scrollToSection('features-section')} 
            className="block text-gray-400 hover:text-white underline cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('testimonials-section')} 
            className="block text-gray-400 hover:text-white underline cursor-pointer"
          >
            Case Studies
          </button>
          <button 
            onClick={() => scrollToSection('contact-section')} 
            className="block text-gray-400 hover:text-white underline cursor-pointer"
          >
              Support
          </button>
          <Link to="/auth" className="block text-gray-400 hover:text-white underline">
            Get Started
          </Link>
        </div>
      </div>
      
      {/* Legal & Company Links */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Legal & Company</h3>
        <div className="space-y-2">
          <Link to="/privacy-policy" className="block text-gray-400 hover:text-white underline">
            Privacy Policy
          </Link>
          <Link to="/terms-conditions" className="block text-gray-400 hover:text-white underline">
            Terms & Conditions
          </Link>
          <Link to="/about" className="block text-gray-400 hover:text-white underline">
            About
          </Link>
          <Link to="/contact" className="block text-gray-400 hover:text-white underline">
            Contact
          </Link>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-700 pt-6 text-center">
      <p className="text-gray-500 text-xs md:text-sm">
        &copy; {new Date().getFullYear()} stockflow. All rights reserved. 
      </p>
    </div>
  </div>
</footer>

  </div>
  );
};
