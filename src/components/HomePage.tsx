import React, { useState, useRef } from 'react';
import { Header } from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

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
  const { t } = useTranslation();
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
      alert(t('chat.success'));
    } catch (e) {
      alert(t('chat.error'));
    }
  };

  return (
    <>
      <FloatingChatButton onClick={() => setOpen(true)} />
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white w-full md:max-w-md md:rounded-xl shadow-2xl p-6 md:m-0 m-0 rounded-t-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t('chat.title')}</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('chat.email')}</label>
                <Input type="email" {...register('email', { required: true, pattern: /.+@.+\..+/ })} placeholder={t('chat.emailPlaceholder')} />
                {errors.email && <p className="text-xs text-red-600 mt-1">{t('chat.emailError')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('chat.message')}</label>
                <Textarea rows={4} {...register('message', { required: true, minLength: 5 })} placeholder={t('chat.messagePlaceholder')} />
                {errors.message && <p className="text-xs text-red-600 mt-1">{t('chat.messageError')}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('chat.cancel')}</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">{isSubmitting ? t('chat.submitting') : t('chat.submit')}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Carousel component voor mobiele weergave (met ARIA en swipe)
const MobileCarousel = ({ items, renderItem, t }) => {
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
      aria-label={t('accessibility.carousel.label')}
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
            <div key={index} className="w-full flex-shrink-0 px-4" aria-label={`${t('accessibility.carousel.slide')} ${index + 1} ${t('accessibility.carousel.of')} ${items.length}`}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-4 space-x-2" role="tablist" aria-label={t('accessibility.carousel.navigation')}>
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`${t('accessibility.carousel.goTo')} ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            aria-label={t('accessibility.carousel.previous')}
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            aria-label={t('accessibility.carousel.next')}
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
  const { t } = useTranslation();
  
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

  const handlePricingClick = () => {
    logger.info('CTA click', { id: 'pricing' });
    navigate('/pricing');
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
      alert(t('alerts.contactSuccess'));
    } catch (e) {
      alert(t('alerts.contactError'));
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
  const faqData = (() => {
    try {
      const items = t('faq.items', { returnObjects: true });
      if (Array.isArray(items)) {
        return items;
      }
    } catch (error) {
      console.warn('Translation error for faq.items:', error);
    }
    // Fallback data
    return [
      {
        question: t('faq.fallback.items.0.question'),
        answer: t('faq.fallback.items.0.answer')
      },
      {
        question: t('faq.fallback.items.1.question'),
        answer: t('faq.fallback.items.1.answer')
      },
      {
        question: t('faq.fallback.items.2.question'),
        answer: t('faq.fallback.items.2.answer')
      },
      {
        question: t('faq.fallback.items.3.question'),
        answer: t('faq.fallback.items.3.answer')
      },
      {
        question: t('faq.fallback.items.4.question'),
        answer: t('faq.fallback.items.4.answer')
      }
    ];
  })();

  const features = [
    {
      icon: TrendingUp,
      title: t('homepage.features.optimize.title'),
      description: t('homepage.features.optimize.description'),
    },
    {
      icon: Zap,
      title: t('homepage.features.saveTime.title'),
      description: t('homepage.features.saveTime.description'),
    },
    {
      icon: Users,
      title: t('homepage.features.teamwork.title'),
      description: t('homepage.features.teamwork.description'),
    },
    {
      icon: Shield,
      title: t('homepage.features.secure.title'),
      description: t('homepage.features.secure.description'),
    },
  ];
  
  const testimonials = (() => {
    try {
      const items = t('testimonials.items', { returnObjects: true });
      if (Array.isArray(items)) {
        return items.map((testimonial, index) => ({
          ...testimonial,
          avatar: index === 0 ? '/Laura.png' : index === 1 ? '/jan.png' : '/placeholder.svg',
          rating: 5
        }));
      }
    } catch (error) {
      console.warn('Translation error for testimonials.items:', error);
    }
    // Fallback data
    return [
      {
        name: t('testimonials.fallback.items.0.name'),
        role: t('testimonials.fallback.items.0.role'),
        quote: t('testimonials.fallback.items.0.quote'),
        avatar: '/Laura.png',
        rating: 5,
        company: t('testimonials.fallback.items.0.company'),
        location: t('testimonials.fallback.items.0.location'),
        industry: t('testimonials.fallback.items.0.industry'),
        savings: t('testimonials.fallback.items.0.savings'),
        timeSaved: t('testimonials.fallback.items.0.timeSaved')
      },
      {
        name: t('testimonials.fallback.items.1.name'),
        role: t('testimonials.fallback.items.1.role'),
        quote: t('testimonials.fallback.items.1.quote'),
        avatar: '/jan.png',
        rating: 5,
        company: t('testimonials.fallback.items.1.company'),
        location: t('testimonials.fallback.items.1.location'),
        industry: t('testimonials.fallback.items.1.industry'),
        savings: t('testimonials.fallback.items.1.savings'),
        timeSaved: t('testimonials.fallback.items.1.timeSaved')
      },
      {
        name: t('testimonials.fallback.items.2.name'),
        role: t('testimonials.fallback.items.2.role'),
        quote: t('testimonials.fallback.items.2.quote'),
        avatar: '/placeholder.svg',
        rating: 5,
        company: t('testimonials.fallback.items.2.company'),
        location: t('testimonials.fallback.items.2.location'),
        industry: t('testimonials.fallback.items.2.industry'),
        savings: t('testimonials.fallback.items.2.savings'),
        timeSaved: t('testimonials.fallback.items.2.timeSaved')
      }
    ];
  })();

  // Voordelen sectie
  const benefits = (() => {
    try {
      const items = t('benefits.items', { returnObjects: true });
      if (Array.isArray(items)) {
        return items.map((benefit, index) => ({
          icon: index === 0 ? <Euro className="h-8 w-8" /> : index === 1 ? <Clock className="h-8 w-8" /> : <Target className="h-8 w-8" />,
          title: benefit.title,
          description: benefit.description
        }));
      }
    } catch (error) {
      console.warn('Translation error for benefits.items:', error);
    }
    // Fallback data
    return [
      {
        icon: <Euro className="h-8 w-8" />,
        title: t('benefits.fallback.items.0.title'),
        description: t('benefits.fallback.items.0.description')
      },
      {
        icon: <Clock className="h-8 w-8" />,
        title: t('benefits.fallback.items.1.title'),
        description: t('benefits.fallback.items.1.description')
      },
      {
        icon: <Target className="h-8 w-8" />,
        title: t('benefits.fallback.items.2.title'),
        description: t('benefits.fallback.items.2.description')
      }
    ];
  })();

  // --- BEGIN USP DATA ---
  const usps = [
    {
      icon: <Package className="h-8 w-8" />,
      title: t('homepage.usps.0.title'),
      desc: t('homepage.usps.0.desc'),
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: t('homepage.usps.1.title'), 
      desc: t('homepage.usps.1.desc'),
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('homepage.usps.2.title'),
      desc: t('homepage.usps.2.desc'),
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('homepage.usps.3.title'),
      desc: t('homepage.usps.3.desc'),
    },
  ];
  // --- EINDE USP DATA ---

  // --- BEGIN SUBSCRIPTION FEATURES DATA ---
  const subscriptionFeatures = (() => {
    try {
      const items = t('modules.items', { returnObjects: true });
      if (Array.isArray(items)) {
        return items.map((feature, index) => ({
          ...feature,
          icon: index === 0 ? <BarChart3 className="h-12 w-12 text-blue-600" /> : index === 1 ? <Scan className="h-12 w-12 text-green-600" /> : <Truck className="h-12 w-12 text-purple-600" />,
          tier: "groei",
          image: "/placeholder.svg"
        }));
      }
    } catch (error) {
      console.warn('Translation error for modules.items:', error);
    }
    // Fallback data
    return [
      {
        icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
        title: t('modules.fallback.items.0.title'),
        description: t('modules.fallback.items.0.description'),
        features: t('modules.fallback.items.0.features', { returnObjects: true }),
        tier: "groei",
        image: "/placeholder.svg"
      },
      {
        icon: <Scan className="h-12 w-12 text-green-600" />,
        title: t('modules.fallback.items.1.title'),
        description: t('modules.fallback.items.1.description'),
        features: t('modules.fallback.items.1.features', { returnObjects: true }),
        tier: "groei",
        image: "/placeholder.svg"
      },
      {
        icon: <Truck className="h-12 w-12 text-purple-600" />,
        title: t('modules.fallback.items.2.title'),
        description: t('modules.fallback.items.2.description'),
        features: t('modules.fallback.items.2.features', { returnObjects: true }),
        tier: "groei",
        image: "/placeholder.svg"
      }
    ];
  })();
  // --- EINDE SUBSCRIPTION FEATURES DATA ---

  // --- BEGIN CAPABILITIES DATA ---
  const capabilities = [
    {
      icon: <Users className="h-12 w-12" />,
      title: t('homepage.capabilities.0.title'),
      desc: t('homepage.capabilities.0.desc'),
      learnMore: "#",
    },
    {
      icon: <BarChart3 className="h-12 w-12" />,
      title: t('homepage.capabilities.1.title'),
      desc: t('homepage.capabilities.1.desc'),
      learnMore: "#",
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: t('homepage.capabilities.2.title'),
      desc: t('homepage.capabilities.2.desc'),
      learnMore: "#",
    },
  ];
  // --- EINDE CAPABILITIES DATA ---

  // --- BEGIN FEATURE DATA ---
  const landingFeatures = (() => {
    try {
      const items = t('features.items', { returnObjects: true });
      if (Array.isArray(items)) {
        return items.map((feature, index) => ({
          ...feature,
          img: index === 0 ? "/optimized/image.png" : index === 1 ? "/optimized/analytics.png" : "/optimized/mobile.png",
          reverse: index === 1,
          icon: index === 0 ? <Package className="h-12 w-12 text-blue-600" /> : index === 1 ? <BarChart3 className="h-12 w-12 text-green-600" /> : <Smartphone className="h-12 w-12 text-purple-600" />
        }));
      }
    } catch (error) {
      console.warn('Translation error for features.items:', error);
    }
    // Fallback data
    return [
      {
        title: t('features.fallback.items.0.title'),
        desc: t('features.fallback.items.0.desc'),
        img: "/optimized/image.png",
        reverse: false,
        features: t('features.fallback.items.0.features', { returnObjects: true }),
        icon: <Package className="h-12 w-12 text-blue-600" />
      },
      {
        title: t('features.fallback.items.1.title'),
        desc: t('features.fallback.items.1.desc'),
        img: "/optimized/analytics.png",
        reverse: true,
        features: t('features.fallback.items.1.features', { returnObjects: true }),
        icon: <BarChart3 className="h-12 w-12 text-green-600" />
      },
      {
        title: t('features.fallback.items.2.title'),
        desc: t('features.fallback.items.2.desc'),
        img: "/optimized/mobile.png",
        reverse: false,
        features: t('features.fallback.items.2.features', { returnObjects: true }),
        icon: <Smartphone className="h-12 w-12 text-purple-600" />
      }
    ];
  })();
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
      "name": t('structuredData.softwareName'),
      "description": t('structuredData.softwareDescription'),
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
        ...(faqData as any[]).map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": t('structuredData.videoName'),
      "description": t('structuredData.videoDescription'),
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
        title={t('homepage.title')}
        description={t('homepage.subtitle')}
        keywords="warehouse management system, WMS, inventory management, stock control, warehouse software, inventory tracking, warehouse automation, stock management software, warehouse operations, inventory control system, warehouse management, WMS software, inventory management system, stock tracking, warehouse automation, supply chain management, logistics software, warehouse optimization, inventory control, stock management, warehouse efficiency, inventory tracking software, warehouse management solution, stock control system, warehouse operations management, inventory management software, warehouse management platform, stock tracking system, warehouse management tools, inventory management tools, warehouse software solution, stock management platform, warehouse management software, inventory control software, warehouse management system software, WMS platform, warehouse management tools, inventory tracking platform, stock management tools, warehouse optimization software, supply chain software, logistics management, warehouse efficiency software, inventory management platform, stock control software, warehouse operations software, inventory tracking tools, warehouse management solution software, stock management system, warehouse automation software, inventory control platform, warehouse management software solution, WMS software solution, warehouse management platform software, stock tracking platform, warehouse management tools software, inventory management tools software, warehouse software platform, stock management platform software, warehouse management software platform, inventory control software platform, warehouse management system platform, WMS platform software, warehouse management tools platform, inventory tracking platform software, stock management tools platform, warehouse optimization platform, supply chain platform, logistics platform, warehouse efficiency platform, inventory management platform software, stock control platform software, warehouse operations platform software, inventory tracking platform tools, warehouse management solution platform, stock management system platform, warehouse automation platform software, inventory control platform software, warehouse management software platform solution, WMS software platform solution, warehouse management platform solution, stock tracking platform solution, warehouse management tools platform solution, inventory management tools platform solution, warehouse software platform solution, stock management platform solution, warehouse management software platform solution, inventory control software platform solution, warehouse management system platform solution, WMS platform solution, warehouse management tools platform solution, inventory tracking platform solution, stock management tools platform solution, warehouse optimization platform solution, supply chain platform solution, logistics platform solution, warehouse efficiency platform solution, inventory management platform solution, stock control platform solution, warehouse operations platform solution, inventory tracking platform solution, warehouse management solution platform solution, stock management system platform solution, warehouse automation platform solution, inventory control platform solution, warehouse management software platform solution, WMS software platform solution, warehouse management platform solution, stock tracking platform solution, warehouse management tools platform solution, inventory management tools platform solution, warehouse software platform solution, stock management platform solution, warehouse management software platform solution, inventory control software platform solution, warehouse management system platform solution, WMS platform solution, warehouse management tools platform solution, inventory tracking platform solution, stock management tools platform solution, warehouse optimization platform solution, supply chain platform solution, logistics platform solution, warehouse efficiency platform solution, inventory management platform solution, stock control platform solution, warehouse operations platform solution, inventory tracking platform solution, warehouse management solution platform solution, stock management system platform solution, warehouse automation platform solution, inventory control platform solution"
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
                <span className="block text-gray-900">{t('homepage.title')}</span>

              </h1>

              
            </FadeInWhenVisible>

            {/* Subheadline */}
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                {t('homepage.subtitle')}
                <br className="hidden sm:block" />
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
                <span className="text-gray-600 font-medium">{t('socialProof.rating')}</span>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-gray-600">{t('socialProof.users')}</span>
              </div>
            </FadeInWhenVisible>

            {/* CTA Buttons - Clean & Focused */}
            <FadeInWhenVisible>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  id="hero-cta-primary"
                  data-analytics-id="hero-start" 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg w-full sm:w-auto group relative overflow-hidden"
                  onClick={handleLoginClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                  {t('homepage.getStarted')}
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  id="hero-cta-secondary"
                  data-analytics-id="hero-how-it-works" 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 text-lg w-full sm:w-auto group"
                  onClick={handleHowItWorksClick}
                >
                  <Play className="h-5 w-5 mr-2" />
                  {t('homepage.learnMore')}
                </Button>
              </div>
            </FadeInWhenVisible>



            {/* Trust indicators */}
            <FadeInWhenVisible>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8">
                {(() => {
                  try {
                    const items = t('accessibility.trust', { returnObjects: true });
                    if (Array.isArray(items)) {
                      return items.map((trust, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {index === 0 ? <CheckCircle className="h-4 w-4 text-green-600" /> : 
                           index === 1 ? <Zap className="h-4 w-4 text-blue-600" /> :
                           index === 2 ? <Globe className="h-4 w-4 text-purple-600" /> :
                           <Shield className="h-4 w-4 text-green-600" />}
                          <span>{trust}</span>
                        </div>
                      ));
                    }
                  } catch (error) {
                    console.warn('Translation error for accessibility.trust:', error);
                  }
                  // Fallback data
                  return (t('accessibility.trust', { returnObjects: true }) as string[]).map((trust, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {index === 0 ? <CheckCircle className="h-4 w-4 text-green-600" /> : 
                       index === 1 ? <Zap className="h-4 w-4 text-blue-600" /> :
                       index === 2 ? <Globe className="h-4 w-4 text-purple-600" /> :
                       <Shield className="h-4 w-4 text-green-600" />}
                      <span>{trust}</span>
                    </div>
                  ));
                })()}
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
              { icon: Users, value: '32+', label: t('socialProof.users') },
              { icon: Clock, value: '17k+', label: t('stats.hoursSaved') },
              { icon: Package, value: '500k+', label: t('stats.productMovements') },
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
                <span>{t('modules.title')}</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-gray-900">{t('modules.title')}</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                  {t('modules.subtitle')}
                </span>
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('modules.description')}
              </p>
            </FadeInWhenVisible>
          </div>

          {/* Subscription Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {subscriptionFeatures.map((feature, index) => (
              <FadeInWhenVisible key={index}>
                <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${feature.tier === 'groei' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-100'}`}>
                  {feature.tier === 'groei' && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        {feature.icon}
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {feature.tier === 'groei' ? 'Groei Plan' : 'Premium Plan'}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>

                    <div className="space-y-3 mb-8">
                      {feature.features.map((featureItem, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{featureItem}</span>
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
                  {t('modules.cta.title')}
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  {t('modules.cta.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={handleLoginClick}
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    {t('modules.cta.startButton')}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-blue-300 text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                    onClick={handlePricingClick}
                  >
                    {t('modules.cta.pricingButton')}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    onClick={() => scrollToSection('contact-section')}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {t('modules.cta.demoButton')}
                  </Button>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* PRICING SECTIE */}
      <section id="pricing-section" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Euro className="h-4 w-4" />
                <span>{t('pricing.badge')}</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-gray-900">{t('pricing.title')}</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                  {t('pricing.subtitle')}
                </span>
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('pricing.description')}
              </p>
            </FadeInWhenVisible>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Basis Plan */}
            <FadeInWhenVisible>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Package className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.plans.basic.name')}</h3>
                    <p className="text-gray-600 mb-6">{t('pricing.plans.basic.description')}</p>
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900">{t('pricing.plans.basic.price')}</div>
                      <div className="text-sm text-gray-500">{t('pricing.plans.basic.period')}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.products')}</span>
                      <span className="font-medium">{t('pricing.plans.basic.limits.products')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.orders')}</span>
                      <span className="font-medium">{t('pricing.plans.basic.limits.orders')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.users')}</span>
                      <span className="font-medium">{t('pricing.plans.basic.limits.users')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.branches')}</span>
                      <span className="font-medium">{t('pricing.plans.basic.limits.branches')}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {(t('pricing.plans.basic.features', { returnObjects: true }) as string[]).map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-gray-900 hover:bg-gray-800"
                    onClick={handleLoginClick}
                  >
                    {t('pricing.plans.basic.startButton')}
                  </Button>
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Groei Plan */}
            <FadeInWhenVisible>
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-500 ring-4 ring-blue-100 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-900 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    {t('pricing.mostPopular')}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Zap className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.plans.growth.name')}</h3>
                    <p className="text-gray-600 mb-6">{t('pricing.plans.growth.description')}</p>
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900">{t('pricing.plans.growth.price')}</div>
                      <div className="text-sm text-gray-500">{t('pricing.plans.growth.period')}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.products')}</span>
                      <span className="font-medium">{t('pricing.plans.growth.limits.products')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.orders')}</span>
                      <span className="font-medium">{t('pricing.plans.growth.limits.orders')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.users')}</span>
                      <span className="font-medium">{t('pricing.plans.growth.limits.users')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.branches')}</span>
                      <span className="font-medium">{t('pricing.plans.growth.limits.branches')}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {(t('pricing.plans.growth.features', { returnObjects: true }) as string[]).map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handlePricingClick}
                  >
                    {t('pricing.plans.growth.startButton')}
                  </Button>
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Premium Plan */}
            <FadeInWhenVisible>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-purple-200">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                      <Crown className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.plans.premium.name')}</h3>
                    <p className="text-gray-600 mb-6">{t('pricing.plans.premium.description')}</p>
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900">{t('pricing.plans.premium.price')}</div>
                      <div className="text-sm text-gray-500">{t('pricing.plans.premium.period')}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.products')}</span>
                      <span className="font-medium text-green-600">{t('pricing.plans.premium.limits.products')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.orders')}</span>
                      <span className="font-medium text-green-600">{t('pricing.plans.premium.limits.orders')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.users')}</span>
                      <span className="font-medium text-green-600">{t('pricing.plans.premium.limits.users')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('pricing.limits.branches')}</span>
                      <span className="font-medium text-green-600">{t('pricing.plans.premium.limits.branches')}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {(t('pricing.plans.premium.features', { returnObjects: true }) as string[]).map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handlePricingClick}
                  >
                    {t('pricing.plans.premium.startButton')}
                  </Button>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>

          {/* Trial Info */}
          <FadeInWhenVisible>
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">{t('pricing.trial.title')}</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  {t('pricing.trial.description')}
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  {(t('pricing.trial.benefits', { returnObjects: true }) as any[]).map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
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
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 px-4">{t('benefits.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">{t('benefits.subtitle')}</p>
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
              t={t}
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
                <span>{t('badges.features')}</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-gray-900">{t('features.title')}</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                  {t('features.subtitle')}
                </span>
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('features.description')}
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
                      {t('buttons.tryNowFree')}
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
                <span>{t('badges.video')}</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-gray-900">{t('video.title')}</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                  {t('video.subtitle')}
                </span>
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('video.description')}
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
                    {t('video.fallback')}
                  </video>
                </div>
              </div>
              
              {/* Video benefits */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {(() => {
                  try {
                    const benefits = t('videoBenefits', { returnObjects: true });
                    if (Array.isArray(benefits)) {
                      return benefits.map((benefit, index) => (
                        <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                            {index === 0 ? <Clock className="h-6 w-6 text-blue-600" /> : 
                             index === 1 ? <Zap className="h-6 w-6 text-green-600" /> :
                             <Users className="h-6 w-6 text-purple-600" />}
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      ));
                    }
                  } catch (error) {
                    console.warn('Translation error for videoBenefits:', error);
                  }
                  // Fallback data
                  return [
                    { title: "3 minutes", description: "To add your first products" },
                    { title: "Immediate results", description: "See your inventory overview immediately" },
                    { title: "Team ready", description: "Invite your team and start together" }
                  ].map((benefit, index) => (
                    <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                        {index === 0 ? <Clock className="h-6 w-6 text-blue-600" /> : 
                         index === 1 ? <Zap className="h-6 w-6 text-green-600" /> :
                         <Users className="h-6 w-6 text-purple-600" />}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* CTA after video - Enhanced */}
          <FadeInWhenVisible>
            <div className="text-center mt-16">
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 max-w-2xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {t('video.cta.title')}
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  {t('video.cta.description')}
                </p>
                
                <Button 
                  id="video-cta-primary"
                  data-analytics-id="video-cta-primary"
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-blue-900 text-white px-12 py-6 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl text-xl w-full sm:w-auto group mb-6"
                  onClick={handleLoginClick}
                >
                  <Rocket className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                  {t('video.cta.button')}
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                  {(() => {
                    try {
                      const features = t('video.cta.features', { returnObjects: true });
                      if (Array.isArray(features)) {
                        return features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {index === 0 ? <CheckCircle className="h-4 w-4 text-green-600" /> : 
                             index === 1 ? <Zap className="h-4 w-4 text-blue-600" /> :
                             <Shield className="h-4 w-4 text-green-600" />}
                            <span>{feature}</span>
                          </div>
                        ));
                      }
                    } catch (error) {
                      console.warn('Translation error for video.cta.features:', error);
                    }
                    // Fallback data
                    return [
                      "No credit card required",
                      "Direct access", 
                      "100% safe"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {index === 0 ? <CheckCircle className="h-4 w-4 text-green-600" /> : 
                         index === 1 ? <Zap className="h-4 w-4 text-blue-600" /> :
                         <Shield className="h-4 w-4 text-green-600" />}
                        <span>{feature}</span>
                      </div>
                    ));
                  })()}
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
              {t('alerts.cookieConsent')}
            </p>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" className="border-gray-300" onClick={() => setShowCookieBanner(false)}>{t('alerts.cookieDecline')}</Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={acceptCookies}>{t('alerts.cookieAccept')}</Button>
            </div>
          </div>
        </div>
      )}

      {/* EXIT-INTENT POPUP */}
      {showExitIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-label={t('alerts.exitIntent.title')}>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 mx-4">
            <h3 className="text-xl font-bold mb-2">{t('alerts.exitIntent.title')}</h3>
            <p className="text-gray-600 mb-4">{t('alerts.exitIntent.description')}</p>
            <div className="flex gap-2">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 flex-1" onClick={() => { setShowExitIntent(false); handleLoginClick(); }}>{t('alerts.exitIntent.start')}</Button>
              <Button variant="outline" className="flex-1" onClick={() => {
                // Track exit intent decline
                logger.info('Exit intent declined', { 
                  id: 'exit-intent-decline',
                  popup_type: 'exit_intent',
                  action: 'declined'
                });
                setShowExitIntent(false);
              }}>{t('alerts.exitIntent.decline')}</Button>
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
                <span>{t('badges.testimonials')}</span>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="block text-gray-900">{t('testimonials.sectionTitle')}</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                  {t('testimonials.sectionSubtitle')}
                </span>
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('testimonials.sectionDescription')}
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
              t={t}
              renderItem={(testimonial) => (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <OptimizedImage 
                        className="h-12 w-12 rounded-full object-cover border-2 border-blue-100" 
                        src={testimonial.avatar} 
                        alt={`${testimonial.name} - ${testimonial.role}`} 
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
                        <div className="text-xs text-gray-500">Bespaard</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{testimonial.timeSaved}</div>
                        <div className="text-xs text-gray-500">Tijd bespaard</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </section>



      {/* CONTACT SECTIE */}
      <section id="contact-section" className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 px-4">{t('contact.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">{t('contact.subtitle')}</p>
          </div>
          <form onSubmit={handleSubmit(onSubmitContact)} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.name')}</label>
                <Input {...register('name', { required: true, minLength: 2 })} placeholder={t('contact.form.namePlaceholder')} />
                {errors.name && <p className="text-xs text-red-600 mt-1">{t('contact.form.nameError')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.email')}</label>
                <Input type="email" {...register('email', { required: true, pattern: /.+@.+\..+/ })} placeholder={t('contact.form.emailPlaceholder')} />
                {errors.email && <p className="text-xs text-red-600 mt-1">{t('contact.form.emailError')}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.message')}</label>
              <Textarea rows={5} {...register('message', { required: true, minLength: 10 })} placeholder={t('contact.form.messagePlaceholder')} />
              {errors.message && <p className="text-xs text-red-600 mt-1">{t('contact.form.messageError')}</p>}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">
                {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
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
              <span>{t('finalCta.banner')}</span>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              <span className="block">{t('finalCta.title')}</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {t('finalCta.titleHighlight')}
              </span>
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed">
              {t('finalCta.subtitle')}
            </p>
          </FadeInWhenVisible>

          {/* Value proposition */}
          <FadeInWhenVisible>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              {(() => {
                try {
                  const benefits = t('finalCta.benefits', { returnObjects: true });
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
                  console.warn('Translation error for finalCta.benefits:', error);
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                data-analytics-id="final-start" 
                size="lg" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg w-full sm:w-auto group relative overflow-hidden"
                onClick={handleLoginClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                  {t('finalCta.button')}
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
                {t('finalCta.demoButton')}
              </Button>
            </div>
          </FadeInWhenVisible>

          {/* Trust indicators */}
          <FadeInWhenVisible>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80 mb-8">
              {(() => {
                try {
                  const trust = t('accessibility.trust', { returnObjects: true });
                  if (Array.isArray(trust)) {
                    return trust.map((trustItem, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {index === 0 ? <CheckCircle className="h-4 w-4" /> : 
                         index === 1 ? <Clock className="h-4 w-4" /> :
                         index === 2 ? <Shield className="h-4 w-4" /> :
                         <Globe className="h-4 w-4" />}
                        <span>{trustItem}</span>
                      </div>
                    ));
                  }
                } catch (error) {
                  console.warn('Translation error for accessibility.trust:', error);
                }
                // Fallback data
                return [
                  "No credit card required",
                  "Direct access",
                  "GDPR-compliant",
                  "100% safe"
                ].map((trustItem, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index === 0 ? <CheckCircle className="h-4 w-4" /> : 
                     index === 1 ? <Clock className="h-4 w-4" /> :
                     index === 2 ? <Shield className="h-4 w-4" /> :
                     <Globe className="h-4 w-4" />}
                    <span>{trustItem}</span>
                  </div>
                ));
              })()}
            </div>
          </FadeInWhenVisible>

          {/* Urgency element */}
          <FadeInWhenVisible>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Timer className="h-5 w-5 text-yellow-300" />
                <span className="text-yellow-300 font-semibold">{t('finalCta.urgency.title')}</span>
              </div>
              <p className="text-white/90 text-sm">
                {t('finalCta.urgency.description')}
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Social Proof Numbers */}
          <FadeInWhenVisible>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {(() => {
                try {
                  const stats = t('finalCta.stats', { returnObjects: true });
                  if (Array.isArray(stats)) {
                    return stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                        <div className="text-sm text-white/70">{stat.label}</div>
                      </div>
                    ));
                  }
                } catch (error) {
                  console.warn('Translation error for finalCta.stats:', error);
                }
                // Fallback data
                return [
                  { number: "32+", label: "Active SMEs" },
                  { number: "9 hours", label: "Time saved/week" },
                  { number: "4.8/5", label: "Customer satisfaction" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ));
              })()}
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
      {t('footer.tagline')}
    </p>

    <div className="border-t border-gray-700 pt-6">
      <p className="text-gray-500 text-xs md:text-sm">
        &copy; {new Date().getFullYear()} stockflow. All rights reserved. 
        {t('footer.copyright')}
      </p>
    </div>
  </div>
</footer>



    </div>
  );
};
