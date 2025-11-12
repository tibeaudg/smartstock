import React, { useState } from 'react';
import Header from './HeaderPublic';
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
import { SavingsCalculator } from './SavingsCalculator';
import Footer from './Footer';
import { ContactForm } from './ContactForm';

// SEO-rich text content component to improve text-to-code ratio
const SEOTextContent = () => (
  <section className="py-16 px-4 bg-white">
    <div className="max-w-4xl mx-auto prose prose-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        Professioneel Voorraadbeheer voor Moderne Bedrijven
      </h2>
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        StockFlow is dé toonaangevende voorraadbeheer software voor KMO's, kleine ondernemingen en groeiende bedrijven in België en Nederland. 
        Onze cloud-based oplossing maakt professioneel voorraadbeheer toegankelijk voor elk bedrijf, ongeacht de grootte. 
        Met real-time inzicht in je voorraadniveaus, automatische bestelmeldingen en geavanceerde rapportage tools 
        help je je bedrijf efficiënter te werken en sneller te groeien.
      </p>
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Of je nu een webshop runt, een retailwinkel beheert, of een magazijn optimaliseert - StockFlow biedt de tools 
        die je nodig hebt om je voorraad onder controle te houden. Van barcode scanning tot multi-locatie beheer, 
        van automatische voorraad updates tot gedetailleerde analyses - alles wat je nodig hebt in één gebruiksvriendelijk platform.
      </p>
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Meer dan 500 bedrijven vertrouwen op StockFlow voor hun dagelijkse voorraadbeheer. Ze besparen gemiddeld 70% tijd 
        op voorraadtaken en reduceren hun voorraadkosten met 25%. Door betere planning en real-time inzicht voorkom je 
        stockouts en overstock, wat direct bijdraagt aan een betere cashflow en hogere winstmarges.
      </p>
      <h3 className="text-2xl font-bold mb-4 text-gray-900 mt-8">
        Waarom Kiezen voor StockFlow?
      </h3>
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        In tegenstelling tot traditionele voorraadbeheer systemen die complex en duur zijn, biedt StockFlow een 
        gebruiksvriendelijke en betaalbare oplossing. Je kunt gratis starten met tot 30 producten en meegroeien 
        zonder te hoeven wisselen van platform. Onze software is speciaal ontworpen voor de Belgische en Nederlandse markt, 
        met ondersteuning voor lokale talen, valuta's en bedrijfspraktijken.
      </p>
      <p className="text-lg text-gray-700 leading-relaxed">
        StockFlow integreert naadloos met populaire e-commerce platforms, boekhoudsoftware en andere bedrijfssystemen. 
        Dit betekent dat je niet hoeft te werken met meerdere losse systemen - alles komt samen in één centraal platform. 
        Met onze mobiele app kun je ook onderweg je voorraad beheren, producten scannen en bestellingen verwerken.
      </p>
    </div>
  </section>
);



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

export const HomePageNL = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();

  const handleLoginClick = () => {
    logger.info('CTA click NL', { id: 'start-nu' });
    
    navigate('/pricing');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 64;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Structured data for Dutch homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "StockFlow - Voorraadbeheer Software voor KMO's",
    "description": "Professionele voorraadbeheer software voor Belgische KMO's. Beheer voorraad, bespaar geld en optimaliseer bestellingen. Alles in één eenvoudig platform.",
    "url": "https://www.stockflow.be/nl",
    "inLanguage": "nl-BE",
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflow.be/logo.png"
      }
    }
  };

  return (
    <div>
      <Helmet>
        <html lang="nl" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <SEO
        title="Voorraadbeheer Software: Gratis Starten | StockFlow 2025"
        description="Bespaar 20% op kosten & voorkom verspilling! Professionele voorraadbeheer software voor KMO's. Real-time tracking, barcode scanning, automatische meldingen. 500+ Belgische bedrijven gebruiken StockFlow. Start gratis nu - geen creditcard vereist!"
        keywords="voorraadbeheer, voorraadbeheer software, voorraad beheren, magazijnbeheer, KMO software België, voorraad optimalisatie, barcode scanner"
        url="https://www.stockflow.be/nl"
      />

      <Header />

      {/* Hero Section */}
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
                    Gemaakt voor KMO's
                  </span>
                </div>
              </FadeInWhenVisible>
          
              <BounceInWhenVisible delay={200}>
                <div className="text-center mb-6 sm:mb-10 md:mb-14 lg:mb-16">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-light text-gray-800 mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-tight px-2">
                    Voorraadbeheer dat je Geld Bespaart
                  </h1>
            </div>
              </BounceInWhenVisible>
              
              <SlideUpWhenVisible delay={400}>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-4xl mx-auto px-4 leading-relaxed">
                  Stop met kapitaal verspillen aan overstock en dode voorraad. Volg je voorraad, verminder verspilling en optimaliseer bestellingen. Alles in één eenvoudig platform.
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
                    Start Gratis
                  </Button>
                  

                </div>
              </ScaleInWhenVisible>
              
              <FadeInWhenVisible delay={800}>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6 justify-center items-center text-xs sm:text-sm text-gray-600 px-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span>Geen creditcard</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span>Gratis voor altijd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Klaar in 10 min</span>
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
                  alt="StockFlow dashboard met voorraadbeheer interface, voorraadniveaus, analyses en mobiele scanfuncties"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </SlideUpWhenVisible>

        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-6 sm:py-8 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center">
              <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 mb-4 sm:mb-6 md:mb-8">
                "Vertrouwd door toonaangevende Belgische bedrijven"
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
                  <span className="text-sm font-medium text-gray-700">Horeca</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Truck className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Groothandel</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Productie</span>
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
                Stop met Geld Verliezen door Voorraadfouten
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
                Krijg een duidelijk overzicht van je voorraad en neem betere beslissingen.
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
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Verloren Kapitaal</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <p className="text-sm sm:text-base text-gray-700 font-medium mb-2">
                    "€3.200 vast in langzaam bewegende voorraad"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Geld dat op de plank ligt in plaats van voor je bedrijf te werken
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm sm:text-base">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Maak geld vrij voor bestsellers</span>
                </div>
              </div>
            </SlideUpWhenVisible>
            
            {/* Wasted Time */}
            <SlideUpWhenVisible delay={200}>
              <div className="text-center bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                  <Clock className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-orange-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Verspilde Tijd</h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <p className="text-sm sm:text-base text-gray-700 font-medium mb-2">
                    "8 uur/week voorraad tellen met klembord"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Handmatig tellen terwijl je klanten zou kunnen helpen
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm sm:text-base">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Tel in 10 minuten met je telefoon</span>
                </div>
              </div>
            </SlideUpWhenVisible>
            
            {/* Guessing Game */}
            <SlideUpWhenVisible delay={300}>
              <div className="text-center bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                  <BarChart3 className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-purple-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Gissen</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <p className="text-sm sm:text-base text-gray-700 font-medium mb-2">
                    "Weet niet wat verkoopt vs. wat blijft liggen"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Bestel beslissingen nemen zonder gegevens
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm sm:text-base">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Zie precies wat je moet bestellen</span>
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
                Alles wat je Nodig Hebt voor Voorraadbeheer
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
                Houd je voorraad bij, zie wat verkoopt en ontvang waarschuwingen wanneer je moet bestellen.
              </p>

            </div>
          </FadeInWhenVisible>

          {/* Feature 1: Mobile Scanning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            <SlideInWhenVisible direction="right" delay={200}>
              <div className="order-1 lg:order-2">
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    Kernfunctie
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Scan Barcodes met je Telefoon
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                    Laat het klembord achterwege. Gebruik je telefoon camera om barcodes te scannen en voorraad bij te werken vanuit elke hoek van je winkel.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Werkt offline</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Geen speciale hardware nodig</span>
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
                    alt="Mobiele telefoon scant barcodes voor voorraadbeheer"
                    className="w-full h-auto max-w-[280px] sm:max-w-[320px] lg:max-w-full max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] object-contain rounded-2xl"
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
                    Unieke Functie
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Dode Voorraad Liquidatie Optimizer
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                    Identificeer automatisch voorraad die je kapitaal opeet. Markeer artikelen met nul verkopen gedurende 30, 60 of 90 dagen.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Automatische markering niet-bewegers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Bereken vastgezet kapitaal</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Ontvang liquidatieaanbevelingen</span>
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
                    alt="Dode voorraad liquidatie optimizer dashboard met langzaam bewegende voorraad"
                    className="w-full h-auto max-w-[280px] sm:max-w-[320px] lg:max-w-full max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] object-contain rounded-2xl"
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
                    Geavanceerde Functie
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Multi-Locatie Beheer
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                    Volg voorraad over meerdere winkels, magazijnen of opslagruimtes. Zie voorraadniveaus per locatie in real-time.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Real-time voorraadniveaus</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Verplaats artikelen tussen locaties</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Lage voorraad waarschuwingen per locatie</span>
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
                    alt="Multi-locatie voorraadbeheer over meerdere winkels"
                    className="w-full h-auto max-w-[280px] sm:max-w-[320px] lg:max-w-full max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] object-contain rounded-2xl"
                  />
                </div>
              </div>
            </SlideInWhenVisible>
          </div>
        </div>
      </section>

      {/* Start Tracking in 3 Simple Steps */}
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
                Start met bijhouden in 3 eenvoudige stappen
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-5 md:mb-6 max-w-2xl mx-auto px-4">
                Klaar om te gebruiken in minder dan 10 minuten.
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
                    Importeer Producten
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4 sm:mb-6">
                    Upload Excel of typ je producten in. Je gegevens worden in seconden geïmporteerd.
                  </p>
                </div>

                {/* Footer indicator */}
                <div className="pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">Duurt 5 minuten</span>
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
                    Scannen & Tellen
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4 sm:mb-6">
                    Gebruik je telefoon camera om barcodes te scannen. Werk voorraad bij vanuit elke hoek van je winkel.
                  </p>
                </div>

                {/* Footer indicator */}
                <div className="pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">Werkt op elke telefoon</span>
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
                    Bijhouden & Optimaliseren
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed mb-4 sm:mb-6">
                    Zie waarschuwingen voor lage voorraad, volg wat verkoopt en optimaliseer je voorraad automatisch.
                  </p>
                </div>

                {/* Footer indicator */}
                <div className="pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">Automatische updates</span>
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
                Start Vandaag Gratis
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-4">
                Gratis plan voor altijd • Klaar in 10 minuten • Geen creditcard
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Resources & Learning Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Ontdek Meer over Voorraadbeheer
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Leer hoe je je voorraad optimaliseert met onze uitgebreide gidsen en resources
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <SlideUpWhenVisible delay={100}>
              <Link
                to="/voorraadbeheer-software"
                className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-200"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Package className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                  Voorraadbeheer Software
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Complete gids over voorraadbeheer software voor moderne bedrijven. Van KMO tot webshop.
                </p>
                <div className="flex items-center text-blue-600 font-semibold">
                  <span>Lees meer</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </SlideUpWhenVisible>

            <SlideUpWhenVisible delay={200}>
              <Link
                to="/voorraadbeheer-kmo"
                className="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-200"
              >
                <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition">
                  Voorraadbeheer voor KMO
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Betaalbare voorraadbeheer oplossingen speciaal ontworpen voor kleine en middelgrote ondernemingen.
                </p>
                <div className="flex items-center text-purple-600 font-semibold">
                  <span>Ontdek meer</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </SlideUpWhenVisible>

            <SlideUpWhenVisible delay={300}>
              <Link
                to="/magazijnbeheer-software"
                className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-200"
              >
                <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Truck className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition">
                  Magazijnbeheer Software
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Professionele magazijnbeheer software voor optimale controle over je warehouse operaties.
                </p>
                <div className="flex items-center text-green-600 font-semibold">
                  <span>Bekijk oplossing</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </SlideUpWhenVisible>

            <SlideUpWhenVisible delay={400}>
              <Link
                to="/voorraadbeheer-horeca"
                className="group bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-200"
              >
                <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <Building className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition">
                  Voorraadbeheer Horeca
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Speciaal voor restaurants, cafés en hotels. Beheer ingrediënten en voorraad effectief.
                </p>
                <div className="flex items-center text-orange-600 font-semibold">
                  <span>Meer info</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </SlideUpWhenVisible>

            <SlideUpWhenVisible delay={500}>
              <Link
                to="/voorraadbeheer-webshop"
                className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-indigo-200"
              >
                <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition">
                  Voorraadbeheer Webshop
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Integreer je online winkel met professioneel voorraadbeheer voor naadloze e-commerce.
                </p>
                <div className="flex items-center text-indigo-600 font-semibold">
                  <span>Lees verder</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </SlideUpWhenVisible>

            <SlideUpWhenVisible delay={600}>
              <Link
                to="/voorraadbeheer-tips"
                className="group bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-pink-200"
              >
                <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition">
                  Voorraadbeheer Tips
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Praktische tips en best practices om je voorraadbeheer te verbeteren en kosten te besparen.
                </p>
                <div className="flex items-center text-pink-600 font-semibold">
                  <span>Bekijk tips</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </SlideUpWhenVisible>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <FadeInWhenVisible delay={200}>
            <ContactForm />
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-8">
                Veilig, Betrouwbaar, Compliant
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
                  <span className="text-sm font-medium text-gray-700">SSL Versleuteld</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Veilige Betalingen</span>
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
                Klaar om je voorraadbeheer te vereenvoudigen?
              </h2>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
                Start vandaag je gratis proefversie en ontdek hoe StockFlow je tijd en geld bespaart.
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
                  Start Gratis
                </Button>

              </div>
              
              {/* Supporting Text */}
              <div className="space-y-2">
                <p className="text-blue-100 text-sm sm:text-base font-medium">
                  Geen creditcard vereist. Altijd annuleren.
                </p>
                <p className="text-blue-200/80 text-xs sm:text-sm">
                  Klaar om te gebruiken in 2 minuten.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInWhenVisible>

      {/* SEO-rich text content for better text-to-code ratio */}
      <SEOTextContent />

      <Footer />

      {/* Floating Chat Widget - Separate from logged-in user chat */}

  </div>
  );
};

export default HomePageNL;