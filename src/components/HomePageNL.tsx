import React, { useState, useRef } from 'react';
import { Header } from './HeaderPublic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, BarChart3, Users, Shield, Check, TrendingUp, Zap, Star, Clock, Euro, Target, 
  ChevronLeft, ChevronRight, Scan, Truck, ArrowRight, Play, Award, Globe, Smartphone, 
  CheckCircle, Rocket, Crown, Sparkles, Timer, Building
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import OptimizedImage from '@/components/OptimizedImage';
import { Helmet } from 'react-helmet-async';
import { logger } from '../lib/logger';
import { useCurrency } from '@/hooks/useCurrency';
import { generateComprehensiveStructuredData } from '../lib/structuredData';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';
import Footer from './Footer';
import { FloatingChatWidget } from './FloatingChatWidget';

// Animation Components
const FadeInWhenVisible = ({ children, delay = 0, direction = 'up', duration = 700 }) => {
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

export const HomePageNL = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  usePageRefresh();

  // Initialize tracking
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const timer = setTimeout(() => {
        try {
          GoogleAdsTracking.initializeGoogleAdsTracking();
          GoogleAdsTracking.trackPageViewConversion('homepage-nl', 1, {
            page_type: 'landing_page',
            language: 'nl',
            conversion_type: 'page_view'
          });
        } catch (error) {
          // Silently fail
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLoginClick = () => {
    logger.info('CTA click NL', { id: 'start-nu' });
    try {
      GoogleAdsTracking.trackCustomConversion(
        'start_now_click_nl',
        'AW-17574614935',
        1,
        {
          cta_location: 'hero_section',
          language: 'nl',
          conversion_type: 'registration_intent'
        }
      );
    } catch (error) {
      // Silently fail
    }
    navigate('/auth');
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

  // FAQ Data in Dutch
  const faqData = [
    {
      question: "Werkt StockFlow met mijn kassasysteem?",
      answer: "Ja! StockFlow integreert met de meeste moderne kassasystemen zoals Square, Shopify POS, Lightspeed en Clover. Je kunt StockFlow ook standalone gebruiken — veel retailers gebruiken het om magazijnvoorraad bij te houden terwijl hun kassa de winkel beheert. We bieden CSV export/import voor synchronisatie. Heb je een specifiek kassasysteem? Neem contact op en we bevestigen de compatibiliteit."
    },
    {
      question: "Kan ik voorraad bijhouden over meerdere locaties?",
      answer: "Absoluut! Je kunt voorraad beheren over meerdere winkellocaties, magazijnen of opslagruimtes. Zie voorraadniveaus per locatie in real-time, verplaats artikelen tussen locaties en ontvang voorraadwaarschuwingen per locatie. Perfect als je een hoofdwinkel plus opslagruimte hebt, of meerdere winkellocaties. Beschikbaar in Growth en Premium abonnementen."
    },
    {
      question: "Hoeveel producten (SKU's) kan ik bijhouden?",
      answer: "Ons gratis abonnement ondersteunt tot 50 producten — perfect voor kleine winkels die beginnen. Het Starter-abonnement bevat 1.000 producten, en Business tier ondersteunt onbeperkt producten met aangepaste prijzen. Je kunt ook productvarianten (maten, kleuren) bijhouden als aparte SKU's. Meer nodig? Neem contact op voor maatwerk."
    },
    {
      question: "Wat zijn jullie supporttijden?",
      answer: "Ons supportteam is beschikbaar maandag-vrijdag 8:00-20:00 uur en zaterdag 9:00-17:00 uur (CET). We reageren binnen 5 minuten op e-mails en chat tijdens kantooruren. Hulp nodig buiten deze uren? Ons helpcentrum heeft stapsgewijze handleidingen en je kunt altijd een gesprek inplannen. We bieden ook gratis onboardingsessies."
    },
    {
      question: "Helpen jullie mij met opstarten? Ik ben niet zo technisch.",
      answer: "Ja, we begeleiden je bij elke stap! Elke nieuwe klant krijgt een gratis 30 minuten onboardinggesprek waar we helpen met het importeren van producten, scannen instellen en meldingen configureren. We hebben ook videotutorials en live chatsupport. De meeste winkeleigenaren zijn binnen 10 minuten volledig ingesteld. Als je vastloopt, zijn we direct bereikbaar — echte mensen, geen bots."
    },
    {
      question: "Kan ik gratis proberen?",
      answer: "Absoluut! Schrijf je in voor ons gratis abonnement — geen creditcard vereist. Je krijgt 100 producten voor altijd, perfect om te testen. Probeer het een week met je echte producten. Als het niet past, kun je je gegevens exporteren en op elk moment annuleren. De meeste retailers weten binnen 3 dagen of StockFlow voor hen werkt."
    }
  ];

  // Structured data for Dutch homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "StockFlow - Gratis Voorraadbeheer Software voor KMO's",
    "description": "Professionele voorraadbeheer software speciaal voor Belgische en Nederlandse KMO's. Beheer je voorraad eenvoudig met barcodescanner, real-time inzicht en automatische bestellingen.",
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
    <>
      <Helmet>
        <html lang="nl" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <SEO
        title="StockFlow - Gratis Voorraadbeheer Software voor KMO's in België"
        description="Professionele voorraadbeheer software speciaal voor Belgische en Nederlandse KMO's. Beheer je voorraad eenvoudig met barcodescanner, real-time inzicht en automatische bestellingen. Start gratis!"
        keywords="voorraadbeheer, voorraadbeheer software, stockbeheer, voorraad app, magazijnbeheer, KMO software België, gratis voorraadbeheer, barcode scanner, voorraad systeem"
        url="https://www.stockflow.be/nl"
        canonical="https://www.stockflow.be/nl"
      />

      <Header />
      <FloatingChatWidget />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInWhenVisible>
              <div className="text-center lg:text-left">
                <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Gratis voor altijd · Geen creditcard vereist
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Professioneel <span className="text-blue-600">Voorraadbeheer</span> voor elke KMO
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                  Beheer je voorraad eenvoudig met onze gebruiksvriendelijke software. 
                  Van <Link to="/nl/voorraadbeheer-bakkerij" className="text-blue-600 hover:underline font-semibold">bakkerijen</Link> tot <Link to="/nl/voorraadbeheer-horeca" className="text-blue-600 hover:underline font-semibold">horeca</Link>, 
                  van <Link to="/nl/voorraadbeheer-webshop" className="text-blue-600 hover:underline font-semibold">webshops</Link> tot detailhandel.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Button 
                    onClick={handleLoginClick}
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-xl"
                  >
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Gratis Nu
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('features')}
                    size="lg" 
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Bekijk Demo
                  </Button>
                </div>
                <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>100% Gratis starten</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Nederlandse support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Direct inzetbaar</span>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={200}>
              <div className="relative">
                <OptimizedImage
                  src="/dashboard.png"
                  alt="StockFlow Voorraadbeheer Dashboard"
                  className="rounded-xl shadow-2xl"
                  width={800}
                  height={600}
                  loading="eager"
                />
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white py-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-6">
            Vertrouwd door honderden KMO's in België en Nederland
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <div className="text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="text-xs text-gray-600">500+ Bedrijven</span>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="text-xs text-gray-600">2000+ Gebruikers</span>
            </div>
            <div className="text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="text-xs text-gray-600">4.8/5 Sterren</span>
            </div>
            <div className="text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="text-xs text-gray-600">100% Veilig</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Alles wat je nodig hebt voor <span className="text-blue-600">voorraadbeheer</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Van <Link to="/nl/voorraadbeheer-automatiseren" className="text-blue-600 hover:underline">automatische bestellingen</Link> tot <Link to="/nl/mobiel-voorraadbeheer" className="text-blue-600 hover:underline">mobiel scannen</Link> — 
                alles om je voorraad optimaal te beheren.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <ScaleInWhenVisible delay={100}>
              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Scan className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Barcode Scanner</CardTitle>
                  <CardDescription>
                    Scan producten met je smartphone. Ideaal voor <Link to="/nl/voorraadbeheer-voor-starters" className="text-blue-600 hover:underline">starters</Link> en gevorderden.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Scan producten in/uit met je camera</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Automatische voorraadmutaties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Geen extra hardware nodig</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScaleInWhenVisible>

            {/* Feature 2 */}
            <ScaleInWhenVisible delay={200}>
              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Real-time Inzicht</CardTitle>
                  <CardDescription>
                    Volg je voorraad live. Zie exact wat je hebt, waar en wanneer je moet bestellen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Live voorraadstatus per product</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Voorraadwaarschuwingen en alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Gedetailleerde rapporten en analyses</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScaleInWhenVisible>

            {/* Feature 3 */}
            <ScaleInWhenVisible delay={300}>
              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Multi-locatie Support</CardTitle>
                  <CardDescription>
                    Beheer voorraad over meerdere winkels, magazijnen of opslagruimtes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Onbeperkt aantal locaties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Voorraad verplaatsen tussen locaties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Per locatie voorraadniveaus</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScaleInWhenVisible>

            {/* Feature 4 */}
            <ScaleInWhenVisible delay={100}>
              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Automatische Bestellingen</CardTitle>
                  <CardDescription>
                    Laat je voorraad zichzelf beheren met slimme automatisering.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Automatische bestelvoorstellen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Minimum voorraadniveaus instellen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>E-mail notificaties bij lage voorraad</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScaleInWhenVisible>

            {/* Feature 5 */}
            <ScaleInWhenVisible delay={200}>
              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Mobiele App</CardTitle>
                  <CardDescription>
                    Beheer je voorraad overal, altijd. Perfect voor onderweg.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>iOS en Android apps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Offline modus beschikbaar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Synchroniseert automatisch</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScaleInWhenVisible>

            {/* Feature 6 */}
            <ScaleInWhenVisible delay={300}>
              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">100% Veilig</CardTitle>
                  <CardDescription>
                    Je gegevens zijn veilig met enterprise-grade beveiliging.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>SSL versleuteling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Dagelijkse backups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>GDPR compliant</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScaleInWhenVisible>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Perfect voor elke <span className="text-blue-600">branche</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                StockFlow past zich aan jouw bedrijf aan, van kleine startups tot grote ondernemingen.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/nl/voorraadbeheer-horeca" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-400">
                <CardHeader>
                  <div className="text-4xl mb-4">🍽️</div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">Horeca</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Beheer ingrediënten, recepten en leveringen. Ideaal voor restaurants, cafés en catering.
                  </p>
                  <div className="mt-4 text-blue-600 font-semibold flex items-center gap-2">
                    Meer info <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/nl/voorraadbeheer-bakkerij" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-400">
                <CardHeader>
                  <div className="text-4xl mb-4">🥖</div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">Bakkerij</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Track grondstoffen, productie en verse producten. Voorkom verspilling en optimaliseer productie.
                  </p>
                  <div className="mt-4 text-blue-600 font-semibold flex items-center gap-2">
                    Meer info <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/nl/voorraadbeheer-webshop" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-400">
                <CardHeader>
                  <div className="text-4xl mb-4">🛒</div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">Webshop</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Synchroniseer voorraad met je webshop. Voorkom uitverkochte producten en teleurgestelde klanten.
                  </p>
                  <div className="mt-4 text-blue-600 font-semibold flex items-center gap-2">
                    Meer info <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/nl/voorraadbeheer-voor-starters" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-400">
                <CardHeader>
                  <div className="text-4xl mb-4">🚀</div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">Starters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Begin met eenvoudige voorraadbeheer. Schaalbaar naarmate je groeit, zonder complexiteit.
                  </p>
                  <div className="mt-4 text-blue-600 font-semibold flex items-center gap-2">
                    Meer info <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Section: Excel vs StockFlow */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Waarom <span className="text-blue-600">StockFlow</span> kiezen?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                Vergelijk met traditionele methodes en zie het verschil.
              </p>
              <Link to="/nl/voorraadbeheer-excel-vs-software" className="text-blue-600 hover:underline font-semibold">
                Lees de volledige vergelijking →
              </Link>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeInWhenVisible direction="left">
              <Card className="border-2 border-gray-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="text-3xl">📊</span>
                    Excel / Handmatig
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs">✗</span>
                      </div>
                      <span className="text-gray-700">Handmatige invoer kost veel tijd</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs">✗</span>
                      </div>
                      <span className="text-gray-700">Geen real-time updates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs">✗</span>
                      </div>
                      <span className="text-gray-700">Risico op fouten en dubbel werk</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs">✗</span>
                      </div>
                      <span className="text-gray-700">Geen mobiele toegang</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs">✗</span>
                      </div>
                      <span className="text-gray-700">Moeilijk om te delen met team</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible direction="right">
              <Card className="border-2 border-blue-500 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-blue-600">Aanbevolen</Badge>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="text-3xl">⚡</span>
                    StockFlow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700"><strong>Automatische updates</strong> - bespaart uren per week</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700"><strong>Real-time synchronisatie</strong> tussen alle apparaten</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700"><strong>Barcode scanning</strong> voor snelle invoer</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700"><strong>Mobiele app</strong> voor onderweg</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700"><strong>Team samenwerking</strong> met gebruikersrollen</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button 
                      onClick={handleLoginClick}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      size="lg"
                    >
                      Start Nu Gratis <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Internal Links / Resources Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Ontdek meer over <span className="text-blue-600">voorraadbeheer</span>
              </h2>
              <p className="text-lg text-gray-600">
                Leer hoe je je voorraad optimaal beheert met onze uitgebreide gidsen en tips.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/nl/voorraadbeheer-tips" className="group">
              <Card className="hover:shadow-lg transition-all duration-300 h-full border-2 hover:border-blue-300">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Voorraadbeheer Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Praktische tips om je voorraad efficiënter te beheren en kosten te besparen.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/nl/voorraadbeheer-automatiseren" className="group">
              <Card className="hover:shadow-lg transition-all duration-300 h-full border-2 hover:border-blue-300">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Automatiseren
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Ontdek hoe je voorraadbeheer automatiseert en tijd bespaart met slimme software.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/nl/voorraadbeheer-fouten-voorkomen" className="group">
              <Card className="hover:shadow-lg transition-all duration-300 h-full border-2 hover:border-blue-300">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Fouten Voorkomen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Leer de meest voorkomende voorraadfouten en hoe je ze voorkomt.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/nl/voorraadbeheer-software-vergelijken" className="group">
              <Card className="hover:shadow-lg transition-all duration-300 h-full border-2 hover:border-blue-300">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Software Vergelijken
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Vergelijk verschillende voorraadbeheer oplossingen en maak de juiste keuze.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/nl/mobiel-voorraadbeheer" className="group">
              <Card className="hover:shadow-lg transition-all duration-300 h-full border-2 hover:border-blue-300">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Mobiel Voorraadbeheer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Beheer je voorraad onderweg met mobiele apps en cloud-oplossingen.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/nl/gratis-voorraadbeheer" className="group">
              <Card className="hover:shadow-lg transition-all duration-300 h-full border-2 hover:border-blue-300">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <Euro className="h-5 w-5" />
                    Gratis Voorraadbeheer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Ontdek gratis voorraadbeheer oplossingen en start zonder kosten.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Veelgestelde <span className="text-blue-600">vragen</span>
              </h2>
              <p className="text-lg text-gray-600">
                Antwoorden op de meest gestelde vragen over voorraadbeheer.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <ScaleInWhenVisible key={index} delay={index * 50}>
                <Card className="border-2 hover:border-blue-300 transition-colors">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                      <ChevronRight 
                        className={`h-5 w-5 text-blue-600 transition-transform ${
                          openFAQ === index ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </CardHeader>
                  {openFAQ === index && (
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              </ScaleInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInWhenVisible>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Klaar om te starten?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Sluit je aan bij honderden KMO's die al profiteren van professioneel voorraadbeheer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleLoginClick}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Gratis Nu
              </Button>
              <Button 
                onClick={() => navigate('/contact')}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
              >
                Neem Contact Op
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              Geen creditcard vereist · Direct toegang · Nederlandse support
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePageNL;
