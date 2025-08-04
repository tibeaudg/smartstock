import React from 'react';
import { Header } from './Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Package, BarChart3, Users, Shield, CheckCircle, ArrowRight, Check, Mail, Phone, MapPin, TrendingUp, Zap, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { motion } from 'framer-motion';

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

export const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      role: 'Eigenaar, De Koffieboetiek',
      quote: 'Dankzij stockflow heb ik eindelijk een helder overzicht van mijn voorraad. De automatische bestelmeldingen zijn een lifesaver!',
      avatar: '/Laura.png',
    },
    {
      name: 'Tom De Wit',
      role: 'Zaakvoerder, TechOnderdelen BV',
      quote: 'De overstap naar stockflow was de beste beslissing voor ons magazijnbeheer. Het is intuïtief, snel en het team is enorm behulpzaam.',
      avatar: '/jan.png',
    },
     {
      name: 'Anke Willems',
      role: 'Manager, Creatief Atelier',
      quote: 'Als klein bedrijf is het gratis plan perfect voor ons. We kunnen nu veel efficiënter onze materialen beheren. Een absolute aanrader!',
      avatar: '/anke.png',
    },
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
      title: "Krachtig voorraadbeheer",
      desc: "Beheer je producten, locaties en voorraden centraal. Automatiseer bestellingen en voorkom tekorten.",
      img: "/optimized/image.png",
      reverse: false,
    },
    {
      title: "Slimme rapportages",
      desc: "Genereer rapporten en krijg inzicht in trends, zodat je altijd de juiste beslissingen neemt.",
      img: "/optimized/desktop.png",
      reverse: true,
    },
    {
      title: "Mobiel & desktop",
      desc: "Altijd en overal toegang tot je voorraad, op elk apparaat.",
      img: "/optimized/mobile.png",
      reverse: false,
    },
  ];
  // --- EINDE FEATURE DATA ---

  return (
    <div className="bg-white text-gray-900 font-sans">
      <SEO
        title="Gratis Voorraadbeheer voor Zelfstandigen | stockflow"
        description="Eenvoudig, gratis en slim Voorraadbeheer voor zelfstandigen. Probeer stockflow en ontdek de beste Voorraadbeheer app voor Vlaanderen!"
        keywords="Voorraadbeheer, gratis Voorraadbeheer, Voorraadbeheer app, voorraadbeheer, KMO, eenvoudig voorraadbeheer, voorraad app, voorraadbeheer Vlaanderen, voorraadbeheer Gent, voorraadbeheer Brugge, voorraadbeheer Antwerpen"
        url="https://www.stockflow.be/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Voorraadbeheer voor Zelfstandigen",
          "description": "Eenvoudig, gratis en slim Voorraadbeheer voor zelfstandigen. Probeer stockflow en ontdek de beste Voorraadbeheer app voor Vlaanderen!",
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
      />

      {/* HERO SECTION - SocialPilot style */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-center relative overflow-hidden rounded-lg" style={{backgroundImage: 'url(/Inventory-Management.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '60vh'}}>
        <div className="absolute inset-0 bg-white/70 md:bg-white/80"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="block">Het Enige Voorraadbeheer</span>
            <span className="block text-blue-600">Platform Die Je Nodig Hebt</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Start je reis naar een hogere ROI met enterprise-grade mogelijkheden.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-6 md:mb-8 px-4">
            <Button size="lg" className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-700 transition text-base md:text-lg" onClick={handleLoginClick}>
              Start Gratis
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-base md:text-lg" onClick={() => scrollToSection('video-section')}>
              Hoe het werkt
            </Button>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-sm text-gray-500 px-4">
            <span>• 100% Gratis. Voor Altijd.</span>
            <span>• Geen verplichtingen</span>
          </div>
        </div>
      </section>

      {/* TOP-TIER CAPABILITIES - SocialPilot style */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability) => (
              <div key={capability.title} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">{capability.icon}</div>
                <h3 className="text-xl font-bold mb-3">{capability.title}</h3>
                <p className="text-gray-600 mb-4">{capability.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* FEATURES (afwisselend beeld/tekst) */}
      {landingFeatures.map((feature, idx) => (
        <section
          key={feature.title}
          className="max-w-6xl mx-auto px-4 py-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">{feature.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">{feature.desc}</p>
          </div>
          <div className="flex justify-center">
            <img
              src={feature.img}
              alt={feature.title}
              className="rounded-lg w-full max-w-4xl h-80 object-contain"
            />
          </div>
        </section>
      ))}

      {/* VIDEO SECTION */}
      <section id="video-section" className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="block">Hoe Werkt Het?</span>
            <span className="block text-blue-600">Bekijk in 1 Minuut</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Ontdek hoe eenvoudig voorraadbeheer kan zijn met stockflow.
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

      {/* TESTIMONIALS - SocialPilot style */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="block">Hoor Van Onze</span>
              <span className="block text-blue-600">Gebruikers</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <p className="italic mb-6 text-gray-700">"{t.quote}"</p>
                <div className="flex items-center">
                  <img className="h-12 w-12 rounded-full mr-4 object-cover" src={t.avatar} alt={t.name} />
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FINAL CTA - SocialPilot style */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Focus op het Bouwen van Geweldige Bedrijven
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Met de beste mogelijkheden toegankelijk voor iedereen.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition text-lg" onClick={handleLoginClick}>
              Start Gratis
            </Button>

          </div>
        </div>
      </section>

      {/* FOOTER - SocialPilot style */}
      <footer className="bg-gray-900 text-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">stockflow</h3>
              <p className="text-gray-400">
                Eenvoudig en slim Voorraadbeheer voor KMO's en zelfstandigen in Vlaanderen.
              </p>
            </div>


          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};