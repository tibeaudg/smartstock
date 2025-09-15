import React, { useState, useRef } from 'react';
import { Header } from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, BarChart3, Users, Shield, Check, TrendingUp, Zap, Star, Clock, Euro, Target, 
  ChevronLeft, ChevronRight, Scan, Truck, ArrowRight, Play, Award, Globe, Smartphone, 
  CheckCircle, MessageCircle, Rocket, Crown, Sparkles, Timer 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { motion } from 'framer-motion';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import OptimizedImage from '@/components/OptimizedImage';
import { Helmet } from 'react-helmet-async';
import { logger } from '../lib/logger';
import { useForm } from 'react-hook-form';
import { FloatingChatButton } from './FloatingChatButton';
import { useWebsiteTracking } from '@/hooks/useWebsiteTracking';

// Een herbruikbare component voor fade-in animaties bij het scrollen
const FadeInWhenVisible = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Floating chat inline component
const FloatingChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<{ email: string; message: string }>({
    defaultValues: { email: '', message: '' }
  });

  const onSubmit = async (values: { email: string; message: string }) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Website chat', email: values.email, message: values.message })
      });
      if (!res.ok) throw new Error('failed');
      reset();
      setOpen(false);
      alert('Bedankt! We reageren snel via e-mail.');
    } catch (e) {
      alert('Versturen mislukt. Probeer opnieuw.');
    }
  };

  return (
    <>
      <FloatingChatButton onClick={() => setOpen(true)} />
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white w-full md:max-w-md md:rounded-xl shadow-2xl p-6 md:m-0 m-0 rounded-t-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Stel je vraag</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <Input type="email" {...register('email', { required: true, pattern: /.+@.+\..+/ })} placeholder="jij@bedrijf.be" />
                {errors.email && <p className="text-xs text-red-600 mt-1">Geldig e-mailadres vereist.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Je vraag</label>
                <Textarea rows={4} {...register('message', { required: true, minLength: 5 })} placeholder="Schrijf hier je vraag..." />
                {errors.message && <p className="text-xs text-red-600 mt-1">Gelieve je vraag in te geven.</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuleren</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">{isSubmitting ? 'Verzenden...' : 'Verzenden'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Carousel component voor mobiele weergave (met ARIA en swipe)
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
      aria-label="Testimonials en voordelen carousel"
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
            <div key={index} className="w-full flex-shrink-0 px-4" aria-label={`Slide ${index + 1} van ${items.length}`}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-4 space-x-2" role="tablist" aria-label="Carrousel navigatie">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Ga naar slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            aria-label="Vorige slide"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            aria-label="Volgende slide"
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
  
  // Gebruik de page refresh hook
  usePageRefresh();
  
  // Gebruik website tracking
  useWebsiteTracking();

  // Cookie consent & exit-intent state
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cookie_consent') !== 'accepted';
    } catch {
      return true;
    }
  });
  const [showExitIntent, setShowExitIntent] = useState<boolean>(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('exit_intent_shown') === 'true';
    } catch {
      return false;
    }
  });

  const handleLoginClick = () => {
    logger.info('CTA click', { id: 'start-now' });
    navigate('/auth');
  };

  const handleHowItWorksClick = () => {
    logger.info('CTA click', { id: 'how-it-works' });
    scrollToSection('video-section');
  };

  // Exit-intent listener
  React.useEffect(() => {
    if (hasShownExitIntent) return;
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
        try { sessionStorage.setItem('exit_intent_shown', 'true'); } catch {}
      }
    };
    document.addEventListener('mouseout', onMouseLeave);
    return () => document.removeEventListener('mouseout', onMouseLeave);
  }, [hasShownExitIntent]);

  const acceptCookies = () => {
    try { localStorage.setItem('cookie_consent', 'accepted'); } catch {}
    setShowCookieBanner(false);
  };

  // Contact form logic
  type ContactFormValues = { name: string; email: string; message: string };
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    defaultValues: { name: '', email: '', message: '' }
  });
  const onSubmitContact = async (values: ContactFormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!res.ok) throw new Error('Failed to send');
      reset();
      logger.info('Contact message sent', { email: values.email });
      alert('Bedankt! We nemen spoedig contact op.');
    } catch (e) {
      alert('Verzenden mislukt. Probeer opnieuw.');
    }
  };

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

  // FAQ sectie data
  const faqData = [
    {
      question: "Is stockflow echt 100% gratis voor KMO's in Vlaanderen?",
      answer: "Ja, stockflow is volledig gratis voor Vlaamse KMO's. Geen verborgen kosten, geen limieten op gebruikers of producten. Wij geloven dat elk bedrijf toegang moet hebben tot professioneel voorraadbeheer."
    },
    {
      question: "Hoe werkt het gratis voorraadbeheer programma?",
      answer: "Registreer je gratis account, voeg je producten toe, en begin direct met het beheren van je voorraad. Ons voorraadbeheersysteem is intuïtief en vereist geen technische kennis."
    },
    {
      question: "Kan ik stockflow gebruiken op mijn mobiele telefoon?",
      answer: "Absoluut! Onze voorraadbeheer app werkt perfect op alle apparaten - smartphone, tablet en desktop. Altijd en overal toegang tot je voorraadgegevens."
    },
    {
      question: "Is mijn data veilig in de cloud?",
      answer: "Ja, wij nemen de veiligheid van jouw data zeer serieus. Dagelijkse back-ups, SSL-versleuteling en GDPR-compliance zorgen ervoor dat jouw voorraadgegevens altijd veilig zijn."
    },
    {
      question: "Hoe verschilt stockflow van andere voorraadbeheer software?",
      answer: "Stockflow is specifiek ontwikkeld voor Vlaamse KMO's, volledig gratis, en biedt alle essentiële functies zonder complexiteit. Geen dure licenties of verborgen kosten zoals bij Odoo of Exact."
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Optimaliseer je Cashflow',
      description: 'Voorkom overbodige voorraad en dode stock. Krijg precies inzicht in wat je nodig hebt, wanneer je het nodig hebt.',
    },
    {
      icon: Zap,
      title: 'Bespaar Tijd en Verminder Fouten',
      description: 'Automatiseer bestellingen en minimaliseer handmatige tellingen. Focus op groei, niet op administratie.',
    },
    {
      icon: Users,
      title: 'Naadloze Teamsamenwerking',
      description: 'Werk efficiënt samen met je team dankzij duidelijke gebruikersrollen en realtime data-updates.',
    },
    {
      icon: Shield,
      title: 'Veilig en Altijd Beschikbaar',
      description: 'Jouw data is veilig in de cloud. Altijd en overal toegankelijk, met dagelijkse back-ups.',
    },
  ];
  
  const testimonials = [
    {
      name: 'Laura Peeters',
      role: 'Eigenaar, De Koffieboetiek - Gent',
      quote: 'Dankzij stockflow heb ik eindelijk een helder overzicht van mijn voorraad. De automatische bestelmeldingen zijn een lifesaver! Als Vlaamse KMO is het gratis plan perfect voor ons.',
      avatar: '/Laura.png',
      rating: 5,
      company: 'De Koffieboetiek',
      location: 'Gent',
      industry: 'Horeca',
      savings: '€2.400/jaar bespaard',
      timeSaved: '8 uur/week'
    },
    {
      name: 'Tom De Wit',
      role: 'Zaakvoerder, TechOnderdelen BV - Antwerpen',
      quote: 'De overstap naar stockflow was de beste beslissing voor ons magazijnbeheer. Het is intuïtief, snel en het team is enorm behulpzaam. Eindelijk een voorraadbeheer programma dat echt werkt.',
      avatar: '/jan.png',
      rating: 5,
      company: 'TechOnderdelen BV',
      location: 'Antwerpen',
      industry: 'Technologie',
      savings: '€5.200/jaar bespaard',
      timeSaved: '12 uur/week'
    },
     {
      name: 'Anke Willems',
      role: 'Manager, Creatief Atelier - Brugge',
      quote: 'Als klein bedrijf is het gratis plan perfect voor ons. We kunnen nu veel efficiënter onze materialen beheren. Een absolute aanrader voor elke Vlaamse KMO!',
      avatar: '/placeholder.svg',
      rating: 5,
      company: 'Creatief Atelier',
      location: 'Brugge',
      industry: 'Creatief',
      savings: '€1.800/jaar bespaard',
      timeSaved: '6 uur/week'
    },
  ];

  // Voordelen sectie
  const benefits = [
    {
      icon: <Euro className="h-8 w-8" />,
      title: "100% Gratis Voor Altijd",
      description: "Geen verborgen kosten, geen limieten. Volledig gratis voorraadbeheer voor Vlaamse KMO's."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Direct Aan de Slag",
      description: "Geen complexe setup of training nodig. Begin binnen 5 minuten met je voorraadbeheer."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Specifiek voor Vlaamse KMO's",
      description: "Ontwikkeld met de behoeften van Vlaamse bedrijven in gedachten. Nederlandse support en lokale expertise."
    }
  ];

  // --- BEGIN USP DATA ---
  const usps = [
    {
      icon: <Package className="h-8 w-8" />,
      title: "Eenvoudig plannen",
      desc: "Plan en publiceer voorraadupdates in seconden.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Realtime inzicht", 
      desc: "Direct overzicht van je voorraad en prestaties.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Samenwerken",
      desc: "Werk moeiteloos samen met je team.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Veilig & betrouwbaar",
      desc: "Jouw data is altijd veilig en beschermd.",
    },
  ];
  // --- EINDE USP DATA ---

  // --- BEGIN MODULES DATA ---
  const modules = [
    {
      icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
      title: "Geavanceerde Analytics",
      description: "AI-gedreven inzichten, voorspellingen en real-time dashboards voor optimale besluitvorming.",
      features: [
        "AI-voorspellingen voor voorraadbehoeften",
        "Real-time dashboards en rapporten",
        "Custom export naar Excel/PDF",
        "API toegang voor integraties"
      ],
      popular: false,
      image: "/placeholder.svg"
    },
    {
      icon: <Scan className="h-12 w-12 text-green-600" />,
      title: "Barcode Scanner",
      description: "Scan producten direct in en uit met je smartphone. Perfect voor snelle voorraadupdates.",
      features: [
        "Mobiele barcode scanning",
        "Automatische productherkenning",
        "Bulk import/export",
        "Offline synchronisatie"
      ],
      popular: true,
      image: "/placeholder.svg"
    },
    {
      icon: <Truck className="h-12 w-12 text-purple-600" />,
      title: "Leveringsbonnen Beheer",
      description: "Volledig beheer van inkomende en uitgaande leveringsbonnen met automatische updates.",
      features: [
        "PDF upload en verwerking",
        "Automatische voorraad updates",
        "Custom leveringsbon templates",
        "Bulk import/export functionaliteit"
      ],
      popular: false,
      image: "/placeholder.svg"
    }
  ];
  // --- EINDE MODULES DATA ---

  // --- BEGIN CAPABILITIES DATA ---
  const capabilities = [
    {
      icon: <Users className="h-12 w-12" />,
      title: "Samenwerking",
      desc: "Werk efficiënt samen met je team.",
      learnMore: "#",
    },
    {
      icon: <BarChart3 className="h-12 w-12" />,
      title: "Rapportages",
      desc: "Krijg inzicht in trends en prestaties.",
      learnMore: "#",
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Veiligheid",
      desc: "Jouw data is veilig in de cloud.",
      learnMore: "#",
    },
  ];
  // --- EINDE CAPABILITIES DATA ---

  // --- BEGIN FEATURE DATA ---
  const landingFeatures = [
    {
      title: "Krachtig voorraadbeheer voor KMO's",
      desc: "Beheer je producten, locaties en voorraden centraal. Automatiseer bestellingen en voorkom tekorten. Specifiek ontwikkeld voor Vlaamse bedrijven.",
      img: "/optimized/image.png",
      reverse: false,
      features: [
        "Centraal productbeheer",
        "Automatische bestelmeldingen", 
        "Multi-locatie ondersteuning",
        "Real-time voorraad updates"
      ],
      icon: <Package className="h-12 w-12 text-blue-600" />
    },
    {
      title: "Slimme rapportages en inzichten",
      desc: "Genereer rapporten en krijg inzicht in trends, zodat je altijd de juiste beslissingen neemt voor je voorraadbeheer.",
      img: "/optimized/analytics.png",
      reverse: true,
      features: [
        "AI-gedreven voorspellingen",
        "Custom dashboards",
        "Export naar Excel/PDF",
        "Trend analyse"
      ],
      icon: <BarChart3 className="h-12 w-12 text-green-600" />
    },
    {
      title: "Mobiel & desktop voorraadbeheer",
      desc: "Altijd en overal toegang tot je voorraad, op elk apparaat. Perfect voor ondernemers die onderweg zijn.",
      img: "/optimized/mobile.png",
      reverse: false,
      features: [
        "Responsive design",
        "Offline synchronisatie",
        "Barcode scanning",
        "Push notificaties"
      ],
      icon: <Smartphone className="h-12 w-12 text-purple-600" />
    },
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
      setLeadStatus('success');
      setLeadEmail('');
    } catch (err) {
      setLeadStatus('error');
    }
  };

  // Structured data uitbreiden (SoftwareApplication + FAQPage + VideoObject)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "stockflow - Gratis Voorraadbeheer",
      "description": "Gratis voorraadbeheer programma voor Vlaamse KMO's. Eenvoudig, veilig en zonder verborgen kosten.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "100% gratis voorraadbeheer voor KMO's"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150"
      },
      "author": {"@type": "Organization", "name": "stockflow"},
      "publisher": {"@type": "Organization", "name": "stockflow", "logo": {"@type": "ImageObject", "url": "https://www.stockflow.be/logo.png"}},
      "image": "https://www.stockflow.be/Inventory-Management.png",
      "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/"}
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        ...faqData.map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "Introductievideo Stockflow",
      "description": "Uitleg over hoe stockflow werkt voor Vlaamse KMO's.",
      "thumbnailUrl": ["https://www.stockflow.be/Inventory-Management.png"],
      "uploadDate": "2024-01-01",
      "contentUrl": "https://www.stockflow.be/intro_vid.mp4",
      "embedUrl": "https://www.stockflow.be/intro_vid.mp4"
    }
  ];

  return (
    <div className="bg-white text-gray-900 font-sans">
      <Helmet>
        <link rel="preload" as="image" href="/Inventory-Management.png" />
        <link rel="preload" as="image" href="/logo.png" />
      </Helmet>
      <SEO
        title="Gratis Voorraadbeheer voor KMO's in Vlaanderen | stockflow"
        description="Ontdek het beste gratis voorraadbeheer programma voor Vlaamse KMO's. Eenvoudig, gratis en slim voorraadbeheer zonder verborgen kosten. Start vandaag nog!"
        keywords="software voorraadbeheer, magazijn software, gratis voorraadbeheer, voorraadbeheer programma, voorraadbeheersysteem, stockbeheer software, voorraadbeheer software, voorraadbeheer KMO, voorraadbeheer Vlaanderen, voorraadbeheer Gent, gratis stockbeheer, voorraad app, magazijnbeheer, software magazijnbeheer, software stockbeheer, voorraadbeheer app, gratis voorraadbeheer app, gratis voorraadbeheer software, programma stockbeheer gratis, stockbeheer app, magazijnbeheer software gratis, voorraad software gratis, boekhoudprogramma met voorraadbeheer, voorraadbeheer app gratis, gratis voorraadbeheer app download, gratis voorraadbeheer software download, programma stockbeheer gratis download, stockbeheer app gratis, magazijnbeheer software gratis download, voorraad software gratis download, boekhoudprogramma voorraadbeheer gratis"
        url="https://www.stockflow.be/"
        structuredData={structuredData}
      />
      <Header 
        onLoginClick={handleLoginClick}
        onNavigate={scrollToSection}
        simplifiedNav={false}
        hideNotifications={true}
      />

      {/* SOCIAL PROOF HEADER */}
      <div className="bg-blue-50 border border-blue-100 text-blue-900 text-sm md:text-base py-2 md:py-3">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <span><strong>32+</strong> zelfstandigen en KMO's gebruiken stockflow dagelijks</span>
        </div>
      </div>

      {/* HERO SECTION - Geoptimaliseerd voor conversie */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-24">
          <div className="text-center">


            {/* Main headline */}
            <FadeInWhenVisible>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-gray-900">Gratis Voorraadbeheer</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                  voor KMO's in Vlaanderen
                </span>
              </h1>
            </FadeInWhenVisible>

            {/* Subheadline */}
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Het enige voorraadbeheer programma dat <strong>100% gratis</strong> is voor Vlaamse KMO's. 
                <br className="hidden sm:block" />
                Geen verborgen kosten, geen limieten, direct aan de slag.
              </p>
            </FadeInWhenVisible>

            {/* Social proof */}
            <FadeInWhenVisible>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">4.8/5 gebaseerd op 15+ reviews</span>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-gray-600">32+ actieve gebruikers</span>
              </div>
            </FadeInWhenVisible>

            {/* CTA Buttons */}
            <FadeInWhenVisible>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  data-analytics-id="hero-start" 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg w-full sm:w-auto group relative overflow-hidden"
                  onClick={handleLoginClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                  Probeer Gratis Zonder Verplichtingen
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  data-analytics-id="hero-how-it-works" 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 text-lg w-full sm:w-auto group"
                  onClick={handleHowItWorksClick}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Bekijk Demo
                </Button>
              </div>
            </FadeInWhenVisible>



            {/* Trust indicators */}
            <FadeInWhenVisible>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Geen creditcard vereist</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span>Direct toegang</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-600" />
                  <span>Nederlandse support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>GDPR-compliant</span>
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Hero image/demo */}
            <FadeInWhenVisible>
              <div className="relative max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden">
                    <OptimizedImage 
                      className="w-full h-auto object-cover" 
                      src="optimized/desktop.png" 
                      alt="Stockflow Dashboard Screenshot" 
                    />
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* KENGETALLEN / SOCIAL PROOF STRIP */}
      <section id="stats-section" className="bg-white py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 divide-x-0 md:divide-x md:divide-dashed md:divide-gray-200">
            {[
              { icon: Users, value: '32+', label: "zelfstandigen & KMO's" },
              { icon: Clock, value: '17k+', label: 'uren bespaard' },
              { icon: Package, value: '500k+', label: 'productbewegingen' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center md:px-6">
                <s.icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2 sm:mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-extrabold tracking-tight text-blue-700">{s.value}</div>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-700 font-medium text-center leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES SECTIE - Nieuwe features */}
      <section id="modules-section" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Nieuwe Modules Beschikbaar</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-gray-900">Uitbreid je Voorraadbeheer</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                  met Krachtige Modules
                </span>
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Start gratis en voeg modules toe wanneer je ze nodig hebt. 
                Elke module is ontworpen om je voorraadbeheer naar het volgende niveau te tillen.
              </p>
            </FadeInWhenVisible>
          </div>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {modules.map((module, index) => (
              <FadeInWhenVisible key={index}>
                <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${module.popular ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-100'}`}>
                  {module.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-900 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Meest Populair
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        {module.icon}
                      </div>
                      <div className="text-right">
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{module.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{module.description}</p>

                    <div className="space-y-3 mb-8">
                      {module.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* CTA voor modules */}
          <FadeInWhenVisible>
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Klaar om je Voorraadbeheer te Optimaliseren?
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Start gratis en voeg modules toe wanneer je ze nodig hebt. 
                  Geen langetermijncontracten, geen verborgen kosten.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={handleLoginClick}
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Start Gratis Account
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    onClick={() => scrollToSection('contact-section')}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Vraag Demo Aan
                  </Button>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* VOORDELEN SECTIE - Compact op mobiel */}
      <section id="benefits-section" className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 px-4">Waarom KMO's in Vlaanderen Kiezen voor stockflow</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">Het beste gratis voorraadbeheer programma, specifiek ontwikkeld voor Vlaamse bedrijven</p>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <FadeInWhenVisible key={index}>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-blue-600 mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <MobileCarousel 
              items={benefits}
              renderItem={(benefit, index) => (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-blue-600 mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              )}
            />
          </div>
        </div>
      </section>


      {/* FEATURES - Enhanced with animations */}
      <section id="features-section" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Award className="h-4 w-4" />
                <span>Alle Features Inbegrepen</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-gray-900">Alles wat je nodig hebt</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                  voor Perfect Voorraadbeheer
                </span>
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Van basis voorraadbeheer tot geavanceerde analytics - stockflow heeft alles wat je KMO nodig heeft om te groeien.
              </p>
            </FadeInWhenVisible>
          </div>

          {landingFeatures.map((feature, idx) => (
            <div
              key={feature.title}
              className={`mb-16 md:mb-24 ${
                feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
              } flex flex-col items-center`}
            >
              <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                {/* Content */}
                <div className={`text-center md:text-left ${feature.reverse ? 'md:order-2' : 'md:order-1'}`}>
                  <FadeInWhenVisible>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
                      {feature.icon}
                    </div>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                      {feature.title}
                    </h3>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {feature.desc}
                    </p>
                  </FadeInWhenVisible>
                  
                  {/* Feature list */}
                  <FadeInWhenVisible>
                    <div className="space-y-4 mb-8">
                      {feature.features.map((feat, featIdx) => (
                        <div key={featIdx} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-gray-700 font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </FadeInWhenVisible>

                  <FadeInWhenVisible>
                    <Button 
                      className="bg-gradient-to-r from-blue-500 to-blue-900 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      onClick={handleLoginClick}
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      Probeer Nu Gratis
                    </Button>
                  </FadeInWhenVisible>
                </div>

                {/* Image */}
                <div className={`${feature.reverse ? 'md:order-1' : 'md:order-2'}`}>
                  <FadeInWhenVisible>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-gray-100">
                        <OptimizedImage
                          src={feature.img}
                          alt={`${feature.title} - Voorraadbeheer voor KMO's`}
                          className="rounded-xl w-full h-64 sm:h-80 object-contain"
                          useModernFormats={false}
                        />
                      </div>
                      
                      {/* Floating elements */}
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </FadeInWhenVisible>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO SECTION - Enhanced with better presentation */}
      <section id="video-section" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <FadeInWhenVisible>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Play className="h-4 w-4" />
                <span>Zie stockflow in Actie</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-gray-900">Hoe Werkt</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                  Stockflow?
                </span>
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Ontdek hoe eenvoudig voorraadbeheer kan zijn met stockflow. 
                Bekijk hoe Vlaamse KMO's hun voorraad beheren in minder dan 3 minuten.
              </p>
            </FadeInWhenVisible>
          </div>

          <FadeInWhenVisible>
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <video 
                    controls 
                    poster="/Inventory-Management.png" 
                    className="w-full h-full object-cover"
                    preload="none"
                    onPlay={() => logger.info('Video play', { id: 'intro-video' })}
                  >
                    <source src="/intro_vid.mp4" type="video/mp4" />
                    Je browser ondersteunt deze video niet.
                  </video>
                </div>
              </div>
              
              {/* Video benefits */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: <Clock className="h-6 w-6 text-blue-600" />, title: "3 minuten", desc: "Om je eerste producten toe te voegen" },
                  { icon: <Zap className="h-6 w-6 text-green-600" />, title: "Direct resultaat", desc: "Zie meteen je voorraad overzicht" },
                  { icon: <Users className="h-6 w-6 text-purple-600" />, title: "Team klaar", desc: "Nodig je team uit en begin samen" }
                ].map((benefit, index) => (
                  <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* CTA after video - Enhanced */}
          <FadeInWhenVisible>
            <div className="text-center mt-16">
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 max-w-2xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Klaar om te Starten?
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Sluit je aan bij 32+ Vlaamse KMO's die al profiteren van gratis voorraadbeheer
                </p>
                
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-blue-900 text-white px-12 py-6 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl text-xl w-full sm:w-auto group mb-6"
                  onClick={handleLoginClick}
                >
                  <Rocket className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                  Probeer Gratis Zonder Verplichtingen
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Geen creditcard vereist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span>Direct toegang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>100% veilig</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* COOKIE CONSENT BANNER */}
      {showCookieBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto max-w-6xl m-4 rounded-lg bg-white shadow-xl border border-gray-200 p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
            <p className="text-sm text-gray-700">
              We gebruiken cookies om je ervaring te verbeteren en anonieme statistieken te verzamelen. Door te accepteren ga je akkoord met ons gebruik van cookies.
            </p>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" className="border-gray-300" onClick={() => setShowCookieBanner(false)}>Weiger</Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={acceptCookies}>Accepteer</Button>
            </div>
          </div>
        </div>
      )}

      {/* EXIT-INTENT POPUP */}
      {showExitIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-label="Blijf op de hoogte popup">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 mx-4">
            <h3 className="text-xl font-bold mb-2">Nog twijfels? Probeer stockflow gratis</h3>
            <p className="text-gray-600 mb-4">Geen creditcard vereist. Zie in 2 minuten hoe je voorraadbeheer eenvoudiger wordt.</p>
            <div className="flex gap-2">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 flex-1" onClick={() => { setShowExitIntent(false); handleLoginClick(); }}>Start nu gratis</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowExitIntent(false)}>Nee bedankt</Button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CHAT BUTTON + INLINE POPUP */}
      <FloatingChat />

      {/* TESTIMONIALS - Enhanced with metrics */}
      <section id="testimonials-section" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4" />
                <span>4.8/5 Sterren van Tevreden Klanten</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-gray-900">Vlaamse KMO's Vertellen</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                  Over hun Succes
                </span>
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Ontdek hoe Vlaamse bedrijven hun voorraadbeheer hebben getransformeerd en duizenden euro's besparen.
              </p>
            </FadeInWhenVisible>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((t, index) => (
              <FadeInWhenVisible key={t.name}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Header with avatar and rating */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <OptimizedImage 
                        className="h-12 w-12 rounded-full object-cover border-2 border-blue-100" 
                        src={t.avatar} 
                        alt={`${t.name} - ${t.role}`} 
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
                        <div className="text-xs text-gray-500">Kosten bespaard</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{t.timeSaved}</div>
                        <div className="text-xs text-gray-500">Tijd bespaard</div>
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
              renderItem={(t) => (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <OptimizedImage 
                        className="h-12 w-12 rounded-full object-cover border-2 border-blue-100" 
                        src={t.avatar} 
                        alt={`${t.name} - ${t.role}`} 
                      />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{t.name}</div>
                        <div className="text-sm text-gray-500">{t.role}</div>
                        <div className="text-xs text-blue-600 font-medium">{t.company}</div>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6 text-sm">"{t.quote}"</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{t.savings}</div>
                        <div className="text-xs text-gray-500">Bespaard</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{t.timeSaved}</div>
                        <div className="text-xs text-gray-500">Tijd bespaard</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Social proof stats */}
          <FadeInWhenVisible>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Gemiddelde Resultaten van Onze Klanten
                </h3>
                <p className="text-gray-600">
                  Vlaamse KMO's die stockflow gebruiken zien significante verbeteringen
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { icon: <Euro className="h-8 w-8 text-green-600" />, value: '€3.200', label: 'Gemiddeld bespaard per jaar' },
                  { icon: <Clock className="h-8 w-8 text-blue-600" />, value: '9 uur', label: 'Tijd bespaard per week' },
                  { icon: <TrendingUp className="h-8 w-8 text-purple-600" />, value: '23%', label: 'Verhoogde efficiëntie' },
                  { icon: <Shield className="h-8 w-8 text-orange-600" />, value: '99.9%', label: 'Uptime garantie' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* FAQ SECTIE - Compact op mobiel */}
      <section id="faq-section" className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-4">
              <span className="block">Veelgestelde Vragen Over</span>
              <span className="block text-blue-600">Gratis Voorraadbeheer</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">Alles wat je moet weten over stockflow voor Vlaamse KMO's</p>
          </div>
          
          {/* Desktop FAQ */}
          <div className="md:space-y-6">
            {faqData.map((faq, index) => (
              <FadeInWhenVisible key={index}>
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Mobile FAQ Carousel */}
          <div className="md:hidden">
            <MobileCarousel 
              items={faqData}
              renderItem={(faq, index) => (
                <Card className="shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </CardContent>
                </Card>
              )}
            />
          </div>
        </div>
      </section>

      {/* CONTACT SECTIE */}
      <section id="contact-section" className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 px-4">Vragen? Neem contact op</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">We antwoorden meestal binnen 1 werkdag.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmitContact)} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                <Input {...register('name', { required: true, minLength: 2 })} placeholder="Jouw naam" />
                {errors.name && <p className="text-xs text-red-600 mt-1">Gelieve je naam in te vullen.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <Input type="email" {...register('email', { required: true, pattern: /.+@.+\..+/ })} placeholder="jij@bedrijf.be" />
                {errors.email && <p className="text-xs text-red-600 mt-1">Geef een geldig e-mailadres op.</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Je vraag</label>
              <Textarea rows={5} {...register('message', { required: true, minLength: 10 })} placeholder="Stel hier je vraag..." />
              {errors.message && <p className="text-xs text-red-600 mt-1">Gelieve je vraag te beschrijven.</p>}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">
                {isSubmitting ? 'Verzenden...' : 'Verzenden'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* FINAL CTA - Enhanced for maximum conversion */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-900 py-16 md:py-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
          <FadeInWhenVisible>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Rocket className="h-4 w-4" />
              <span>32+ Vlaamse KMO's zijn al gestart</span>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              <span className="block">Klaar om je Voorraadbeheer</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                te Transformeren?
              </span>
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed">
              Sluit je aan bij honderden Vlaamse KMO's die al profiteren van professioneel voorraadbeheer zonder kosten. 
              <br className="hidden sm:block" />
              Start vandaag nog en zie direct resultaat.
            </p>
          </FadeInWhenVisible>

          {/* Value proposition */}
          <FadeInWhenVisible>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              {[
                { icon: <Zap className="h-6 w-6" />, text: "Start binnen 2 minuten" },
                { icon: <Shield className="h-6 w-6" />, text: "100% veilig en gratis" },
                { icon: <Users className="h-6 w-6" />, text: "Nederlandse support" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center gap-3 text-white/90">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </FadeInWhenVisible>

          {/* CTA Buttons */}
          <FadeInWhenVisible>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                data-analytics-id="final-start" 
                size="lg" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg w-full sm:w-auto group relative overflow-hidden"
                onClick={handleLoginClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                Probeer Gratis Zonder Verplichtingen
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                data-analytics-id="final-demo" 
                size="lg" 
                variant="outline" 
                className="border-2 bg-gradient-to-r from-blue-500 to-blue-900 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg w-full sm:w-auto group"
                onClick={handleHowItWorksClick}
              >
                <Play className="h-5 w-5 mr-2" />
                Bekijk Demo
              </Button>
            </div>
          </FadeInWhenVisible>

          {/* Trust indicators */}
          <FadeInWhenVisible>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Geen creditcard vereist</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Direct toegang</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>GDPR-compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Nederlandse support</span>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Urgency element */}
          <FadeInWhenVisible>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Timer className="h-5 w-5 text-yellow-300" />
                <span className="text-yellow-300 font-semibold">Beperkte Tijd</span>
              </div>
              <p className="text-white/90 text-sm">
                Start vandaag en krijg <strong>gratis onboarding support</strong> ter waarde van €200. 
                Deze aanbieding is geldig voor de eerste 50 nieuwe gebruikers deze maand.
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Social Proof Numbers */}
          <FadeInWhenVisible>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { number: "32+", label: "Actieve KMO's" },
                { number: "€3.200", label: "Gemiddeld bespaard/jaar" },
                { number: "9 uur", label: "Tijd bespaard/week" },
                { number: "4.8/5", label: "Klanttevredenheid" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeInWhenVisible>
        </div>
      </section>




<footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <OptimizedImage
      src="/logo.png"
      alt="stockflow"
      className="h-10 md:h-12 mx-auto mb-6"
    />
    <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
      Het beste gratis voorraadbeheerprogramma voor Vlaamse KMO's. 
      Eenvoudig, veilig en zonder verborgen kosten.
    </p>

    <div className="border-t border-gray-700 pt-6">
      <p className="text-gray-500 text-xs md:text-sm">
        &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
        Gratis voorraadbeheer voor Vlaamse KMO's.
      </p>
    </div>
  </div>
</footer>



    </div>
  );
};
