import React, { useState } from 'react';
import { Header } from './Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Package, BarChart3, Users, Shield, CheckCircle, ArrowRight, Check, Mail, Phone, MapPin, TrendingUp, Zap, Star, Clock, Euro, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { motion } from 'framer-motion';
import { usePageRefresh } from '@/hooks/usePageRefresh';

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

// Carousel component voor mobiele weergave
const MobileCarousel = ({ items, renderItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
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

  const handleLoginClick = () => {
    navigate('/auth');
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
      avatar: '/anke.png',
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

  return (
    <div className="bg-white text-gray-900 font-sans">
      <SEO
        title="Gratis Voorraadbeheer voor KMO's in Vlaanderen | stockflow"
        description="Ontdek het beste gratis voorraadbeheer programma voor Vlaamse KMO's. Eenvoudig, gratis en slim voorraadbeheer zonder verborgen kosten. Start vandaag nog!"
        keywords="gratis voorraadbeheer, voorraadbeheer programma, voorraadbeheersysteem, stockbeheer app, voorraadbeheer software, voorraadbeheer KMO, voorraadbeheer Vlaanderen, voorraadbeheer Gent, voorraadbeheer Brugge, voorraadbeheer Antwerpen, gratis stockbeheer, voorraad app, magazijnbeheer"
        url="https://www.stockflow.be/"
        structuredData={{
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
        }}
      />
      <Header 
        onLoginClick={handleLoginClick}
        onNavigate={scrollToSection}
        simplifiedNav={false}
        hideNotifications={true}
      />

      {/* HERO SECTION - Geoptimaliseerd voor SEO */}
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-20 text-center relative overflow-hidden rounded-lg" style={{backgroundImage: 'url(/Inventory-Management.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '50vh'}}>
        <div className="absolute inset-0 bg-white/70 md:bg-white/80"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="block">Gratis Voorraadbeheer</span>
            <span className="block text-blue-600">voor KMO's in Vlaanderen</span>
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Het enige voorraadbeheer programma dat 100% gratis is voor Vlaamse KMO's. Geen verborgen kosten, geen limieten.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-6 md:mb-8 px-4">
            <Button size="lg" className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-700 transition text-base md:text-lg" onClick={handleLoginClick}>
              Start Gratis Nu
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-base md:text-lg" onClick={() => scrollToSection('video-section')}>
              Hoe werkt het?
            </Button>
          </div>
        </div>
      </section>

      {/* VOORDELEN SECTIE - Compact op mobiel */}
      <section id="benefits-section" className="bg-blue-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Waarom KMO's in Vlaanderen Kiezen voor stockflow</h2>
            <p className="text-base md:text-lg text-gray-600">Het beste gratis voorraadbeheer programma, specifiek ontwikkeld voor Vlaamse bedrijven</p>
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
            className={`max-w-6xl mx-auto px-4 py-12 md:py-20 ${
              feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
            } flex flex-col items-center`}
          >
            <div className="text-center md:text-left mb-8 md:mb-0 md:w-1/2 md:pr-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{feature.title}</h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">{feature.desc}</p>
            </div>
            <div className="md:w-1/2">
              <img
                src={feature.img}
                alt={`${feature.title} - Voorraadbeheer voor KMO's`}
                className="rounded-lg w-full max-w-md mx-auto h-64 md:h-80 object-contain"
              />
            </div>
          </div>
        ))}
      </section>

      {/* VIDEO SECTION - Compact op mobiel */}
      <section id="video-section" className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            <span className="block">Hoe Werkt Gratis</span>
            <span className="block text-blue-600">Voorraadbeheer?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
            Ontdek hoe eenvoudig voorraadbeheer kan zijn met stockflow. Bekijk hoe Vlaamse KMO's hun voorraad beheren.
          </p>
          <div className="flex justify-center">
            <video 
              controls 
              poster="/Inventory-Management.png" 
              className="rounded-lg shadow-lg w-full max-w-3xl"
            >
              <source src="/intro_vid.mp4" type="video/mp4" />
              Je browser ondersteunt deze video niet.
            </video>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Carousel op mobiel */}
      <section id="testimonials-section" className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="block">Vlaamse KMO's Vertellen</span>
              <span className="block text-blue-600">Over stockflow</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600">Ontdek waarom honderden Vlaamse bedrijven kiezen voor gratis voorraadbeheer</p>
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
                  <img className="h-12 w-12 rounded-full mr-4 object-cover" src={t.avatar} alt={`${t.name} - ${t.role}`} />
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
                    <img className="h-10 w-10 rounded-full mr-3 object-cover" src={t.avatar} alt={`${t.name} - ${t.role}`} />
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="block">Veelgestelde Vragen Over</span>
              <span className="block text-blue-600">Gratis Voorraadbeheer</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600">Alles wat je moet weten over stockflow voor Vlaamse KMO's</p>
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

      {/* FINAL CTA - Compact op mobiel */}
      <section className="bg-blue-600 text-white py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Nog Met Gratis Voorraadbeheer
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden Vlaamse KMO's die al profiteren van professioneel voorraadbeheer zonder kosten.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition text-base md:text-lg" onClick={handleLoginClick}>
              Start Gratis Nu
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">Geen creditcard vereist • Direct toegang • Nederlandse support</p>
        </div>
      </section>




<footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <img
      src="/logo.png"
      alt="stockflow"
      className="h-10 md:h-12 mx-auto mb-6"
    />
    <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
      Het beste gratis voorraadbeheerprogramma voor Vlaamse KMO's. 
      Eenvoudig, veilig en zonder verborgen kosten.
    </p>

    <div className="flex justify-center space-x-10 mb-10">
      <Link
        to="/voorraadbeheer-tips"
        className="text-blue-400 hover:text-blue-300 text-sm md:text-base transition-colors duration-200"
      >
        Tips
      </Link>
      <Link
        to="/voorraadbeheer-software-vergelijken"
        className="text-blue-400 hover:text-blue-300 text-sm md:text-base transition-colors duration-200"
      >
        Vergelijking
      </Link>
    </div>

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