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

  const pricingPlans = [
    {
      name: 'Free',
      price: '€0',
      period: '/maand',
      description: 'Perfect voor freelancers en starters.',
      features: ['Tot 30 producten', 'Basis voorraadvolging', 'Community ondersteuning'],
      popular: false,
    },
    {
      name: 'Starter',
      price: '€4',
      period: '/maand',
      description: 'Voor kleine bedrijven die willen groeien.',
      features: ['Tot 150 producten', 'Geavanceerde analyses', 'Prioritaire e-mailondersteuning'],
      popular: false,
    },
    {
      name: 'Business',
      price: '€12',
      period: '/maand',
      description: 'Ideaal voor gevestigde KMO\'s.',
      features: ['Tot 500 producten', 'Uitgebreide rapportage', 'Telefonische ondersteuning'],
      popular: false,
    },
    {
      name: 'Enterprise',
      price: '€39',
      period: '/maand',
      description: 'Voor bedrijven met complexe noden.',
      features: ['Onbeperkt', 'Persoonlijke onboarding', 'Premium support'],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <SEO
        title="Stockbeheer voor KMO's en Zelfstandigen | stockflow"
        description="Eenvoudig, gratis en slim stockbeheer voor KMO's en zelfstandigen. Probeer stockflow en ontdek de beste stockbeheer app voor Vlaanderen!"
        keywords="stockbeheer, gratis stockbeheer, stockbeheer app, voorraadbeheer, KMO, eenvoudig voorraadbeheer, voorraad app, voorraadbeheer Vlaanderen, voorraadbeheer Gent, voorraadbeheer Brugge, voorraadbeheer Antwerpen"
        url="https://www.stockflow.be/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Stockbeheer voor KMO's en Zelfstandigen",
          "description": "Eenvoudig, gratis en slim stockbeheer voor KMO's en zelfstandigen. Probeer stockflow en ontdek de beste stockbeheer app voor Vlaanderen!",
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
      {/* Hero Section */}
      <section className="relative pt-12 pb-5 lg:pt-48 lg:pb-44 text-center overflow-hidden bg-gray-50" style={{backgroundImage: 'url(/Inventory-Management.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
         <div className="absolute inset-0 bg-white/70" style={{backdropFilter: 'blur(0px)'}}></div>
         <div className="relative px-4 sm:px-6 lg:px-8 z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
               <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                  Stockbeheer voor KMO's en zelfstandigen
               </h1>
               <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10">
                  stockflow is de meest intuïtieve <strong>stockbeheer app</strong> voor KMO's in Vlaanderen. Krijg volledige controle over je voorraad, bespaar kosten en maak slimmere beslissingen.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg transition-transform transform hover:scale-105" onClick={handleLoginClick}>
                     Start Gratis in 1 Minuut <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => scrollToSection('features')}>
                     Ontdek de voordelen
                  </Button>
               </div>
            </motion.div>
         </div>
      </section>
      {/* Interne links naar SEO-pagina's */}
      <nav className="max-w-3xl mx-auto mt-8 mb-4 flex flex-wrap gap-2 justify-center">
        <Link to="/voorraadbeheer-tips" className="text-blue-700 underline">Voorraadbeheer tips</Link>
        <Link to="/magazijnbeheer-tips" className="text-blue-700 underline">Magazijnbeheer tips</Link>
        <Link to="/voorraadbeheer-software-vergelijken" className="text-blue-700 underline">Software vergelijken</Link>
        <Link to="/voorraadbeheer-webshop" className="text-blue-700 underline">Voorraadbeheer webshop</Link>
        <Link to="/voorraadbeheer-fouten-voorkomen" className="text-blue-700 underline">Fouten voorkomen</Link>
        <Link to="/voorraadbeheer-automatiseren" className="text-blue-700 underline">Automatiseren</Link>
        <Link to="/inventarisatie-tips" className="text-blue-700 underline">Inventarisatie tips</Link>
        <Link to="/voorraadbeheer-horeca" className="text-blue-700 underline">Voorraadbeheer horeca</Link>
        <Link to="/voorraadbeheer-excel-vs-software" className="text-blue-700 underline">Excel vs. software</Link>
        <Link to="/voorraadbeheer-voor-starters" className="text-blue-700 underline">Voorraadbeheer voor starters</Link>
        <Link to="/mobiel-voorraadbeheer" className="text-blue-700 underline">Mobiel voorraadbeheer</Link>
      </nav>
      {/* Trusted By Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold text-gray-500 tracking-wider">Vertrouwd door honderden bedrijven in vlaanderen</p>
            <motion.div 
              className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
                <div className="col-span-1 flex justify-center py-2"><img className="h-20" src="/ronde.png" alt="Logo klant voorraadbeheer stockflow ronde" /></div>
                <div className="col-span-1 flex justify-center py-2"><img className="h-20" src="/vlaanderen.png" alt="Logo klant voorraadbeheer stockflow vlaanderen" /></div>
                <div className="col-span-1 flex justify-center py-2"><img className="h-20" src="/tom.png" alt="Logo klant voorraadbeheer stockflow tom" /></div>
                <div className="col-span-1 flex justify-center py-2"><img className="h-20" src="/del.png" alt="Logo klant voorraadbeheer stockflow del" /></div>
                <div className="col-span-1 flex justify-center py-2 hidden lg:flex"><img className="h-20" src="standaard.png" alt="Company Logo 5" /></div>
            </motion.div>
        </div>
      </div>
      
      {/* Features/Benefits Section */}
      <section id="features" className="py-20 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible>
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">De juiste tools voor een vlekkeloze stockflow</h2>
                  <p className="max-w-3xl mx-auto text-xl text-gray-600">
                     Alles wat je nodig hebt om je voorraadbeheer te transformeren van een last naar een strategisch voordeel.
                  </p>
               </div>
            </FadeInWhenVisible>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {features.map((feature, index) => (
                 <FadeInWhenVisible key={index}>
                    <Card className="text-left bg-white border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                       <CardHeader>
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                             <feature.icon className="h-6 w-6 text-blue-600" aria-label={feature.title} />
                          </div>
                          <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                       </CardHeader>
                       <CardContent>
                          <p className="text-gray-600">{feature.description}</p>
                       </CardContent>
                    </Card>
                 </FadeInWhenVisible>
               ))}
            </div>
         </div>
      </section>

      {/* Video: Hoe het werkt */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Hoe werkt het?</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8">Bekijk in 1 minuut hoe eenvoudig voorraadbeheer kan zijn met stockflow.</p>
            <div className="flex justify-center">
              <video controls poster="/Inventory-Management.png" className="rounded-xl shadow-lg w-full max-w-2xl">
                <source src="/intro_vid.mp4" type="video/mp4" />
                Je browser ondersteunt deze video niet.
              </video>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Wat onze klanten zeggen</h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600">
                Echte verhalen van ondernemers zoals jij.
              </p>
            </div>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInWhenVisible key={index}>
                <Card className="bg-gray-50 border-0 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <img className="h-12 w-12 rounded-full mr-4 object-cover" src={testimonial.avatar} alt={`Klantreview ${testimonial.name} voorraadbeheer`} />
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Kies het plan dat bij je past</h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600">
                Start gratis, en upgrade wanneer jij er klaar voor bent. Simpel en transparant.
              </p>
            </div>
          </FadeInWhenVisible>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            {pricingPlans.map((plan, index) => (
              <FadeInWhenVisible key={index}>
                <Card className={`text-center transition-all duration-300 ${plan.popular ? 'border-2 border-blue-600 scale-105 shadow-2xl' : 'border-gray-200 bg-white'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Meest Gekozen
                      </span>
                    </div>
                  )}
                  <CardHeader className="pt-10">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 ml-1">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2 h-12">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <ul className="space-y-4 mb-8 text-left">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-white">
          <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
              <FadeInWhenVisible>
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                      <span className="block">Klaar om je voorraadbeheer te vereenvoudigen?</span>
                  </h2>
                  <p className="mt-4 text-lg leading-6 text-gray-600">
                      Creëer vandaag nog je gratis account. Geen creditcard nodig, geen verplichtingen.
                  </p>
                  <Button size="lg" className="mt-8 w-full sm:w-auto text-xl px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg transition-transform transform hover:scale-105" onClick={handleLoginClick}>
                      Transformeer je Stockbeheer
                  </Button>
              </FadeInWhenVisible>
          </div>
      </section>

            {/* Contactformulier onderaan */}
            <section className="bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Contacteer ons</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">Naam</label>
              <Input id="contact-name" name="name" type="text" autoComplete="name" required className="mt-1" />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">E-mail</label>
              <Input id="contact-email" name="email" type="email" autoComplete="email" required className="mt-1" />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">Bericht</label>
              <Textarea id="contact-message" name="message" rows={5} required className="mt-1" />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white py-3">Verstuur</Button>
            </div>
          </form>
        </div>
      </section>




      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              <div className="space-y-8 xl:col-span-1">
                  <h3 className="text-2xl font-bold">stockflow</h3>
                  <p className="text-gray-400 text-base">
                      Eenvoudig en slim stockbeheer voor KMO's en zelfstandigen in Vlaanderen.
                  </p>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                  <div className="md:grid md:grid-cols-2 md:gap-8">
                      <div>
                          <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Product</h4>
                          <ul className="mt-4 space-y-4">
                              <li><Link to="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="text-base text-gray-400 hover:text-white">Voordelen</Link></li>
                              <li><Link to="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="text-base text-gray-400 hover:text-white">Prijzen</Link></li>
                              <li><Link to="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }} className="text-base text-gray-400 hover:text-white">Klanten</Link></li>
                          </ul>
                      </div>
                      <div className="mt-12 md:mt-0">
                          <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Bedrijf</h4>
                          <ul className="mt-4 space-y-4">
                              <li><Link to="/over-ons" className="text-base text-gray-400 hover:text-white">Over Ons</Link></li>
                              <li><Link to="/blog" className="text-base text-gray-400 hover:text-white">Blog</Link></li>
                              <li><Link to="/contact" className="text-base text-gray-400 hover:text-white">Contact</Link></li>
                          </ul>
                      </div>
                  </div>
                  <div className="md:grid md:grid-cols-2 md:gap-8">
                      <div>
                          <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Wettelijk</h4>
                          <ul className="mt-4 space-y-4">
                              <li><Link to="/privacybeleid" className="text-base text-gray-400 hover:text-white">Privacybeleid</Link></li>
                              <li><Link to="/gebruiksvoorwaarden" className="text-base text-gray-400 hover:text-white">Gebruiksvoorwaarden</Link></li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
              <p className="text-base text-gray-400 text-center">&copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>


    </div>
  );
};