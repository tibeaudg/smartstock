import React, { useState, useRef } from 'react';
import { Header } from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Package, BarChart3, Users, Shield, Check, TrendingUp, Zap, Star, Clock, Euro, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { motion } from 'framer-motion';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import OptimizedImage from '@/components/OptimizedImage';
import { Helmet } from 'react-helmet-async';
import { logger } from '../lib/logger';
import { useForm } from 'react-hook-form';
import { FloatingChatButton } from './FloatingChatButton';

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
    },
    {
      name: 'Tom De Wit',
      role: 'Zaakvoerder, TechOnderdelen BV - Antwerpen',
      quote: 'De overstap naar stockflow was de beste beslissing voor ons magazijnbeheer. Het is intuïtief, snel en het team is enorm behulpzaam. Eindelijk een voorraadbeheer programma dat echt werkt.',
      avatar: '/jan.png',
      rating: 5,
    },
     {
      name: 'Anke Willems',
      role: 'Manager, Creatief Atelier - Brugge',
      quote: 'Als klein bedrijf is het gratis plan perfect voor ons. We kunnen nu veel efficiënter onze materialen beheren. Een absolute aanrader voor elke Vlaamse KMO!',
      avatar: '/placeholder.svg',
      rating: 5,
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
    },
    {
      title: "Slimme rapportages en inzichten",
      desc: "Genereer rapporten en krijg inzicht in trends, zodat je altijd de juiste beslissingen neemt voor je voorraadbeheer.",
      img: "/optimized/desktop.png",
      reverse: true,
    },
    {
      title: "Mobiel & desktop voorraadbeheer",
      desc: "Altijd en overal toegang tot je voorraad, op elk apparaat. Perfect voor ondernemers die onderweg zijn.",
      img: "/optimized/mobile.png",
      reverse: false,
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
        keywords="software voorraadbeheer, magazijn software, gratis voorraadbeheer, voorraadbeheer programma, voorraadbeheersysteem, stockbeheer software, voorraadbeheer software, voorraadbeheer KMO, voorraadbeheer Vlaanderen, voorraadbeheer Gent, gratis stockbeheer, voorraad app, magazijnbeheer, software magazijnbeheer, software stockbeheer, voorraadbeheer app"
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

      {/* HERO SECTION - Geoptimaliseerd voor SEO */}
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-20 text-center relative overflow-hidden rounded-lg" style={{backgroundImage: 'url(/Inventory-Management.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '50vh'}}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/85 md:from-white/70 md:to-white/85"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight px-2">
            <span className="block">Gratis Voorraadbeheer</span>
            <span className="block text-blue-600">voor KMO's in Vlaanderen</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Het enige voorraadbeheer programma dat 100% gratis is voor Vlaamse KMO's. Geen verborgen kosten, geen limieten.
          </p>
          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-600">4.8/5 gebaseerd op 15+ reviews</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 md:mb-8 px-4">
            <Button data-analytics-id="hero-start" size="lg" className="bg-blue-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base md:text-lg w-full sm:w-auto" onClick={handleLoginClick}>
              Start Nu Gratis!
            </Button>
            <Button data-analytics-id="hero-how-it-works" size="lg" variant="outline" className="border-blue-600 text-blue-600 px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-sm sm:text-base md:text-lg w-full sm:w-auto" onClick={handleHowItWorksClick}>
              Hoe werkt het?
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-4">Geen creditcard vereist • Direct toegang • Nederlandse support</p>

          {leadStatus === 'success' && (
            <p className="text-green-600 text-sm mt-2">Dank je! We sturen de demo zo naar je inbox.</p>
          )}
          {leadStatus === 'error' && (
            <p className="text-red-600 text-sm mt-2">Controleer je e-mailadres en probeer opnieuw.</p>
          )}
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 text-xs text-gray-600 px-4">
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-blue-600" /> GDPR-compliant</div>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-blue-600" /> SSL-versleuteling</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-600" /> Dagelijkse back-ups</div>
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


      {/* FEATURES - Responsive layout */}
      <section id="features-section" className="py-12 md:py-20">
        {landingFeatures.map((feature, idx) => (
          <div
            key={feature.title}
            className={`max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-20 ${
              feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
            } flex flex-col items-center`}
          >
            <div className="text-center md:text-left mb-6 sm:mb-8 md:mb-0 md:w-1/2 md:pr-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 px-4 md:px-0">{feature.title}</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed px-4 md:px-0">{feature.desc}</p>
            </div>
            <div className="md:w-1/2 w-full px-4 md:px-0">
              <OptimizedImage
                src={feature.img}
                alt={`${feature.title} - Voorraadbeheer voor KMO's`}
                className="rounded-lg w-full max-w-sm sm:max-w-md mx-auto h-48 sm:h-64 md:h-80 object-contain"
                useModernFormats={false}
              />
            </div>
          </div>
        ))}
      </section>

      {/* VIDEO SECTION - Compact op mobiel */}
      <section id="video-section" className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 px-4">
            <span className="block">Hoe Werkt</span>
            <span className="block text-blue-600">Stockflow?</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Ontdek hoe eenvoudig voorraadbeheer kan zijn met stockflow. Bekijk hoe Vlaamse KMO's hun voorraad beheren.
          </p>
          <div className="flex justify-center px-4">
            <video 
              controls 
              poster="/Inventory-Management.png" 
              className="rounded-lg shadow-lg w-full max-w-2xl sm:max-w-3xl"
              preload="none"
              onPlay={() => logger.info('Video play', { id: 'intro-video' })}
            >
              <source src="/intro_vid.mp4" type="video/mp4" />
              Je browser ondersteunt deze video niet.
            </video>
          </div>
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

      {/* TESTIMONIALS - Carousel op mobiel */}
      <section id="testimonials-section" className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-4">
              <span className="block">Vlaamse KMO's Vertellen</span>
              <span className="block text-blue-600">Over stockflow</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">Ontdek waarom honderden Vlaamse bedrijven kiezen voor gratis voorraadbeheer</p>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="italic mb-6 text-gray-700">"{t.quote}"</p>
                <div className="flex items-center">
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <MobileCarousel 
              items={testimonials}
              renderItem={(t) => (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="italic mb-4 text-gray-700 text-sm">"{t.quote}"</p>
                  <div className="flex items-center">
                    <OptimizedImage className="h-10 w-10 rounded-full mr-3 object-cover" src={t.avatar} alt={`${t.name} - ${t.role}`} />
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
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

      {/* FINAL CTA - Compact op mobiel */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 px-4">
            Start Vandaag Nog Met Gratis Voorraadbeheer
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 opacity-90 px-4">
            Sluit je aan bij honderden Vlaamse KMO's die al profiteren van professioneel voorraadbeheer zonder kosten.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button data-analytics-id="final-start" size="lg" className="bg-blue-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-sm sm:text-base md:text-lg w-full sm:w-auto" onClick={handleLoginClick}>
              Start Nu Gratis!
            </Button>
          </div>
          <p className="text-xs sm:text-sm mt-4 opacity-75 px-4">Geen creditcard vereist • Direct toegang • Nederlandse support</p>
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
