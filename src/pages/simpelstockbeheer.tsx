import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SeoPageLayout from '../components/SeoPageLayout';
import { Check, Star, Smartphone, Bell, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function SimpelStockbeheer() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  
  const features = [
    {
      icon: Smartphone,
      title: "Mobiel en Desktop",
      description: "Gebruik stockflow op je smartphone, tablet of computer"
    },
    {
      icon: Zap,
      title: "Direct Starten",
      description: "Geen installatie nodig, direct online beginnen"
    },
    {
      icon: Shield,
      title: "Veilig en Betrouwbaar",
      description: "Je data wordt veilig opgeslagen in de cloud"
    },
    {
      icon: Users,
      title: "Team Samenwerking",
      description: "Werk samen met je team in real-time"
    },
    {
      icon: TrendingUp,
      title: "Automatische Rapportages",
      description: "Krijg inzicht in je voorraad trends"
    },
    {
      icon: Clock,
      title: "Realtime Updates",
      description: "Altijd actuele voorraad informatie"
    }
  ];

  const benefits = [
    "Bespaar tijd door geautomatiseerde processen",
    "Voorkom voorraad tekorten en overbestellingen",
    "Verbeter je cashflow door betere voorraad planning",
    "Verklein je administratieve last",
    "Krijg professionele inzichten in je voorraad"
  ];

  const steps = [
    {
      step: "1",
      title: "Account Aanmaken",
      description: "Maak gratis een account aan op stockflow.be"
    },
    {
      step: "2", 
      title: "Producten Toevoegen",
      description: "Voeg je producten toe of importeer ze uit Excel"
    },
    {
      step: "3",
      title: "Team Uitnodigen",
      description: "Nodig je teamleden uit om samen te werken"
    },
    {
      step: "4",
      title: "Beginnen met Beheren",
      description: "Start direct met professioneel voorraadbeheer"
    }
  ];

  const faqData = [
    {
      question: "Is stockflow echt gratis?",
      answer: "Ja, stockflow biedt een gratis plan aan voor kleine bedrijven. Je kunt direct beginnen zonder creditcard."
    },
    {
      question: "Kan ik stockflow op mijn smartphone gebruiken?",
      answer: "Absoluut! stockflow werkt perfect op alle apparaten: smartphone, tablet en computer."
    },
    {
      question: "Hoe veilig is mijn data?",
      answer: "Je data wordt veilig opgeslagen in de cloud met enterprise-grade beveiliging en regelmatige backups."
    },
    {
      question: "Kan ik mijn bestaande voorraad importeren?",
      answer: "Ja, je kunt je voorraad importeren uit Excel of CSV bestanden."
    },
    {
      question: "Is er ondersteuning beschikbaar?",
      answer: "Ja, we bieden gratis email ondersteuning en uitgebreide documentatie."
    },
    {
      question: "Kan ik stockflow uitproberen zonder verplichting?",
      answer: "Ja, je kunt stockflow 14 dagen gratis uitproberen zonder verplichting."
    }
  ];

  const relatedArticles = [
    {
      title: "Voorraadbeheer Tips",
      url: "/voorraadbeheer-tips",
      description: "Beste tips voor efficiÃ«nt voorraadbeheer"
    },
    {
      title: "Gratis Stockbeheer",
      url: "/gratis-stockbeheer", 
      description: "Ontdek gratis voorraadbeheer oplossingen"
    },
    {
      title: "Voorraadbeheer voor Starters",
      url: "/voorraadbeheer-voor-starters",
      description: "Complete gids voor beginners"
    }
  ];

  return (
    <SeoPageLayout
      title="Simpel Stockbeheer voor KMO's en Zelfstandigen"
      image="/optimized/Inventory-Management.png"
    >
      <SEO
        title="Simpel Stockbeheer voor KMO's en Zelfstandigen | Eenvoudig Voorraadbeheer | stockflow"
        description="Simpel stockbeheer voor KMO's en zelfstandigen. Beheer je voorraad eenvoudig online met stockflow. Direct starten, geen installatie nodig. Gratis te proberen!"
        keywords="simpel stockbeheer, voorraadbeheer, stockbeheer, KMO, eenvoudig voorraadbeheer, voorraad app, voorraadbeheer Vlaanderen, simpel stockbeheer app, voorraadbeheer kleine bedrijven, voorraadbeheer zelfstandigen, voorraadbeheer online, voorraadbeheer software, voorraadbeheer gratis, voorraadbeheer mobiel, voorraadbeheer desktop"
        url="https://www.stockflow.be/simpelstockbeheer"
        image="/optimized/Inventory-Management.png"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simpel Stockbeheer voor KMO's en Zelfstandigen
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Beheer je voorraad eenvoudig online met stockflow. Direct starten, geen installatie nodig. 
            Perfect voor kleine bedrijven en zelfstandigen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis Starten
            </Link>
            <Link 
              to="/demo" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Demo Bekijken
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Waarom Kiezen voor Simpel Stockbeheer?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Op zoek naar <strong>simpel stockbeheer</strong> dat werkt voor jouw bedrijf? stockflow biedt een 
              gebruiksvriendelijke oplossing waarmee je snel en efficiÃ«nt je voorraad beheert, zonder gedoe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Voor KMO's en Zelfstandigen</h3>
              <p className="text-gray-600 mb-4">
                Of je nu een kleine ondernemer bent of een groeiende KMO, onze app helpt je om altijd 
                overzicht te houden over je producten, bestellingen en leveringen.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  <span>Direct inzicht in je voorraad, waar je ook bent</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  <span>Automatische meldingen bij lage voorraad</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  <span>Mobiel en desktop te gebruiken</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  <span>Gratis te proberen, geen creditcard nodig</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Direct Starten</h3>
              <p className="text-gray-600 mb-4">
                Geen complexe installaties of lange implementatietijden. Met stockflow begin je direct 
                met professioneel voorraadbeheer.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-semibold">1</div>
                  <span>Account aanmaken (2 minuten)</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-semibold">2</div>
                  <span>Producten toevoegen</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-semibold">3</div>
                  <span>Beginnen met beheren</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Krachtige Features voor Simpel Gebruik</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Alle tools die je nodig hebt voor professioneel voorraadbeheer, eenvoudig gepresenteerd.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <feature.icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Voordelen van Simpel Stockbeheer</h2>
            <p className="text-lg text-gray-600">
              Ontdek hoe simpel stockbeheer je bedrijf kan transformeren
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Tijdbesparing</h3>
              <p className="text-gray-600 mb-4">
                Automatiseer repetitieve taken en focus je op wat echt belangrijk is voor je bedrijf.
              </p>
              <ul className="space-y-2">
                {benefits.slice(0, 2).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 mt-1" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Kostenbesparing</h3>
              <p className="text-gray-600 mb-4">
                Voorkom dure fouten en optimaliseer je voorraad voor maximale winst.
              </p>
              <ul className="space-y-2">
                {benefits.slice(2).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 mt-1" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Start Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start Vandaag Nog Gratis</h2>
            <p className="text-lg text-gray-600">
              In 4 eenvoudige stappen begin je met professioneel voorraadbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Gift className="mr-2" size={20} />
              Gratis Account Aanmaken
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Veelgestelde Vragen</h2>
            <p className="text-lg text-gray-600">
              Antwoorden op de meest gestelde vragen over simpel stockbeheer
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Klaar om te Starten?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Probeer stockflow nu gratis uit en ervaar zelf het gemak van <strong>eenvoudig stockbeheer</strong>. 
            Geen installatie, direct starten!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis Proberen
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Opnemen
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Meer Informatie</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((article, index) => (
              <Link 
                key={index} 
                to={article.url}
                className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <h3 className="text-lg font-semibold mb-2 text-blue-600">{article.title}</h3>
                <p className="text-gray-600 text-sm">{article.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          ${faqData.map(faq => `{
            "@type": "Question",
            "name": "${faq.question}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${faq.answer}"
            }
          }`).join(',')}
        ]
      }`}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Simpel Stockbeheer voor KMO's en Zelfstandigen",
        "description": "Simpel stockbeheer voor KMO's en zelfstandigen. Beheer je voorraad eenvoudig online met stockflow. Direct starten, geen installatie nodig. Gratis te proberen!",
        "image": "https://www.stockflow.be/optimized/Inventory-Management.png",
        "author": {
          "@type": "Organization",
          "name": "stockflow"
        },
        "publisher": {
          "@type": "Organization",
          "name": "stockflow",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.stockflow.be/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/simpelstockbeheer"
        },
        "datePublished": "2024-06-01",
        "dateModified": "2024-12-19"
      }`}} />
    </SeoPageLayout>
  );
} 
