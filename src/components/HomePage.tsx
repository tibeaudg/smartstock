import React, { useState, useRef, useEffect } from 'react';
import Header from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Carousel, { CarouselItem } from './Carousel';
import HorizontalScrollCarousel from './HorizontalScrollCarousel';
import BlurText from "./BlurText";
import AnimatedList from './AnimatedList'
import ScrollTriggeredButton from './ScrollTriggeredButton'
import Stepper, { Step } from './Stepper';

import { 
  Package, BarChart3, Zap, 
  ChevronLeft, ChevronRight, Scan, Truck, ArrowLeft, ArrowRight, Play, Award, Globe, 
  CheckCircle, Rocket, Crown, Sparkles, Timer, Facebook, Twitter, Linkedin, Instagram,
  Repeat, Camera, Building, ShoppingCart, CreditCard, Mail, Utensils, Upload, FileSpreadsheet, 

} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { Helmet } from 'react-helmet-async';
import { logger } from '../lib/logger';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Footer from './Footer';
import { motion } from 'framer-motion';
import {
  Carousel as UICarousel,
  type CarouselApi,
  CarouselContent as UICarouselContent,
  CarouselItem as UICarouselItem,
} from "@/components/ui/carousel";



import { HeroSection } from "@/components/ui/hero-section-1"
import { PlatformPreviewSection } from "./PlatformPreviewSection";
import { CustomerLogos } from "./trust/CustomerLogos";
import { ReviewBadges } from "./trust/ReviewBadges";
import { TestimonialQuotes } from "./trust/TestimonialQuotes";
import { CaseStudyThumbnails } from "./trust/CaseStudyThumbnails";





export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items: Gallery4Item[];
}

const data = [
  {
    id: "inventory-management",
    title: "Inventory Management",
    description:
      "Manage, organize, and track all inventory in real time with centralized StockFlow dashboards built for growing teams.",
    href: "/inventory-management",
    image:
    "/InventoryManagement.png", 
  },
  {
    id: "supplies-tracking",
    title: "Supplies Tracking",
    description:
      "Track materials, consumables, and parts with ease using mobile scanning and automated replenishment rules.",
    href: "/suppliers",
    image:
    "/SuppliesTracking.png", 
  },
  {
    id: "asset-tracking",
    title: "Asset Tracking",
    description:
      "Keep tabs on critical tools, equipment, and spare parts with digital audit trails and location history.",
    href: "/asset-tracking",
    image:
    "/AssetTracking.png", 
  },
  {
    id: "construction",
    title: "Construction Inventory",
    description:
      "Monitor job-site inventory from anywhere with real-time transfers between yards, trucks, and projects.",
    href: "/contractor-inventory-management",
    image:
    "/ConstructionInventory.png", 
  },
  {
    id: "electrical",
    title: "Electrical Contractors",
    description:
      "Stay on top of electrical supplies across teams with van stock visibility and job-ready kitting.",
    href: "/electrical-inventory-management",
    image:
    "/ElectricalInventory.png", 
  },
  {
    id: "medical",
    title: "Healthcare & Medical",
    description:
      "Track medical supplies with full traceability, consumption logging, and expiration alerts in StockFlow.",
    href: "/medical-inventory-management",
    image:
      "/HealthcareInventory.png", 
  },

  {
    id: "warehouse",
    title: "Warehouse Operations",
    description:
      "Run smart warehouse operations with automation, barcode workflows, and accurate cycle counting.",
    href: "/warehouse-inventory-management",
    image:
      "/WarehouseInventory.png", 
  },
  {
    id: "education",
    title: "Education & Schools",
    description:
      "Effortlessly manage school inventory and supplies, from classrooms to district-wide distribution.",
    href: "/education-inventory-management",
    image:
      "/education.png", 
  },
];

const Gallery4 = ({
  items = data,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mb-8 w-full flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="hidden shrink-0 gap-2 md:flex justify-center items-center bg-gray-100 rounded-2xl p-2 w-full max-w-xs mx-auto">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <UICarousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <UICarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <UICarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
              >
                <a href={item.href} className="group rounded-xl">
                  <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 h-full bg-[linear-gradient(hsl(var(--primary)/0),hsl(var(--primary)/0.4),hsl(var(--primary)/0.8)_100%)] mix-blend-multiply" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8">
                      <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                        {item.title}
                      </div>
                      <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9">
                        {item.description}
                      </div>
                      <div className="flex items-center text-sm">
                        Read more{" "}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              </UICarouselItem>
            ))}
          </UICarouselContent>
        </UICarousel>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery4 };





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

// Auto-scrolling horizontal marquee component for integration cards
const IntegrationCardMarquee = ({ cards, speed = 600 }) => {
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
  







  // Retailer-focused FAQ section
  const faqData = [
    {
      question: "What is the best inventory management software?",
      answer: "StockFlow is recognized as the best inventory management software for small to medium businesses. It offers real-time tracking, barcode scanning, automated reorder alerts, multi-location support, and excellent customer service. StockFlow is completely free forever with all features included - no credit card required, no subscriptions, no hidden fees.",
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
      answer: "Yes! StockFlow is completely free forever with no credit card required. All features are included - unlimited products, unlimited users, unlimited branches, unlimited orders, real-time tracking, barcode scanning, low stock alerts, advanced reporting, API access, and priority support. Everything you need is included at no cost.",
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
      answer: "StockFlow is completely free with unlimited everything - unlimited products, unlimited users, unlimited branches, and unlimited orders. All features are included at no cost. You can track product variants (sizes, colors) as separate SKUs with no limits. No credit card required, no subscriptions, no hidden fees.",
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
      answer: "Absolutely! StockFlow is completely free forever — no credit card required, no subscriptions, no hidden fees. All features are included with unlimited usage. Try it with your actual products - if it doesn't fit your shop, you can export your data anytime. Most retailers know within 3 days if StockFlow works for them.",
      category: "Free Forever",
      benefit: "Completely free forever, no commitment"
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
        "name": "Tom Demuynck"
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
    <div className="bg-white text-gray-900 font-sans" style={{position: 'relative'}}>
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
        title="Free Inventory Management — StockFlow | Barcode, Mobile, Reporting"
        description="Free inventory management software with barcode scanning, mobile access & reporting. Track stock in real-time, prevent stockouts, save 35% costs. Start free - no credit card!"
        keywords="inventory management software, stockbeer software, best inventory management software, inventory management online, stock management software, warehouse management system, inventory tracking, stock control, voorraadbeheer software, inventory software, stockflow, stock flow, free inventory management, cloud inventory software, inventory management system, stock management system, warehouse software, inventory control software"
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


        <HeroSection />

      {/* Customer Logos Section */}
      <CustomerLogos 
        variant="marquee" 
        heading="Trusted by leading businesses"
      />

      {/* Review Badges Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <ReviewBadges variant="horizontal" />
          </div>
        </div>
      </section>

            



      {/* Everything You Need Section */}
      <section className="py-12 sm:py-14 md:py-16 lg:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  Powerful Features
                </span>
              </div>
              <h2 className="max-w-4xl mx-auto text-balance text-5xl sm:text-6xl md:text-7xl lg:text-6xl leading-none font-bold"> Everything You Need to Manage Inventory 
                
              </h2> 

              <p className="text-md pt-4 text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                Keep track of your inventory, see what's selling, and get alerts when you need to reorder.
              </p>
            </div>

          {/* Features - Desktop Grid / Mobile Carousel */}
            {/* Desktop: Full width grid showing all cards */}
            <div className="hidden md:grid md:grid-cols-3 md:gap-8 lg:gap-10 mb-8">
              {featureCards.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 h-full flex flex-col shadow-lg border border-gray-200 hover:shadow-xl  hover:scale-105"
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
                    className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-lg border border-gray-200 hover:shadow-xl "
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
        </div>
      </section>

      {/* Platform Preview Section */}
      <PlatformPreviewSection />

      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              {/* Main Title */}
              <h2 className="max-w-3xl mx-auto text-balance text-5xl sm:text-6xl md:text-6xl lg:text-6xl leading-none font-bold">
                Start Tracking In 3 Simple Steps
              </h2>
              
              {/* Subtitle */}
              <p className="text-md pt-4 text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                  Get started in minutes with our easy-to-use platform.
              </p>
            </div>

          {/* Three Steps with Connecting Line */}
          <div className="relative">
            {/* Horizontal connecting line for desktop */}
            <div className="hidden lg:block absolute top-10 left-1/2 transform -translate-x-1/2 w-full max-w-3xl mt-2 z-0">
              <div className="border-t-2 border-dashed border-gray-300"></div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 max-w-6xl mx-auto relative z-10 px-4 sm:px-6">
              
              {/* Step 1 - Register Online */}
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

              {/* Step 2 - Assessment Session */}
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

              {/* Step 3 - 24/7 Live Support */}
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
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quotes Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="max-w-3xl mx-auto text-balance text-4xl sm:text-5xl md:text-6xl leading-none font-bold text-center mb-4">
              What Our Customers Say
            </h2>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              See how businesses are saving time and money with StockFlow
            </p>
          </div>
          <TestimonialQuotes 
            variant="carousel" 
            maxQuotes={3}
            showRating={true}
            showSavings={true}
          />
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white ">
        <h2 className="max-w-3xl mx-auto text-balance text-5xl sm:text-6xl md:text-6xl lg:text-6xl leading-none font-bold text-center">
          Case Studies
        </h2>
        <p className="text-md pt-4 text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed text-center">
          See how StockFlow equips inventory teams to prevent stockouts, boost accuracy, and automate replenishment across retail, wholesale, manufacturing, and eCommerce operations.
        </p>

<Gallery4  
  items={data as Gallery4Item[]}
/>
      </section>





      
      {/* Integrations Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  CONNECT YOUR TOOLS
                </span>
              </div>
              <h2 className="max-w-3xl mx-auto text-balance text-5xl sm:text-6xl md:text-6xl lg:text-6xl leading-none font-bold text-center">
                Connect with Your Tools<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-blue-600">
                  
                </span>
              </h2>
              <p className="text-md pt-4 text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                Seamlessly integrate with your existing systems and streamline your workflow
              </p>
            </div>

          {/* Integration Cards Marquee */}
            <IntegrationCardMarquee 
              speed={420}
              cards={integrationCardsData.map((card, index) => (
                <div key={index} className={`bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 ${card.colorClass} hover:shadow-lg  h-full`}>
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
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  FAQs
                </span>
              </div>
              <h2 className="max-w-3xl mx-auto text-balance text-5xl sm:text-6xl md:text-6xl lg:text-6xl leading-none font-bold text-center">
              Got Questions? <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600">
                  We've Got Answers
                </span>
              </h2>
              <p className="text-md pt-4 text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                Everything you need to know about StockFlow
              </p>
            </div>

          {/* FAQ Search Bar */}
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

          {/* Search Results Info */}
          {faqSearchTerm && (
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  {filteredFaqData.length > 0 
                    ? `Found ${filteredFaqData.length} FAQ${filteredFaqData.length === 1 ? '' : 's'} matching "${faqSearchTerm}"`
                    : `No FAQs found matching "${faqSearchTerm}"`
                  }
                </p>
              </div>
          )}

          {/* FAQ - Mobile Carousel / Desktop Accordion */}
          {/* Mobile Carousel - Only visible on mobile */}
          <div className="md:hidden">
            {filteredFaqData.length > 0 ? (
              <MobileCarousel 
                items={filteredFaqData}
                renderItem={(faq, index) => (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl h-full">
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
                
                shadow-2xl hover:shadow-3xl
                ring-0 focus:ring-4 focus:ring-white/50 focus:outline-none
                min-h-[56px] sm:min-h-[64px]"       
              >
                Contact Support
              </Button>
            </div>

        </div>
      </section>





          {/* Final Call-to-Action Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800  shadow-2xl overflow-hidden">
              <div className="relative px-6 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-14 md:py-16 lg:py-20">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_80%)]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                  {/* Main Headline */}
                  <h2 className="max-w-3xl mx-auto text-balance text-5xl sm:text-6xl md:text-6xl lg:text-6xl leading-none font-bold text-center text-white">
                    Ready to simplify your stock management?
                  </h2>
                  
                  {/* Subheadline */}
                  <p className="text-md pt-4 pb-8 text-blue-100 max-w-3xl mx-auto px-4 leading-relaxed">
                    Get started free today - no credit card required, all features included forever.
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-stretch sm:items-center mb-6 sm:mb-8 px-4">
                  <ScrollTriggeredButton
                    as="button"
                    className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50
                      px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-12
                      text-base sm:text-lg md:text-xl lg:text-2xl
                      font-bold rounded-lg transform hover:scale-105
                      
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