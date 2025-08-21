import React from 'react';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import Footer from '../../components/Footer';
import { Globe, ShoppingCart, Settings, Bell, Shield, BarChart3, TrendingUp, Check } from 'lucide-react';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Header } from '@/components/Header';

export default function VoorraadbeheerWebshop() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  
  const integrations = [
    {
      name: "WooCommerce",
      description: "Perfect voor WordPress webshops",
      features: ["Automatische synchronisatie", "Real-time voorraad updates", "Order integratie"],
      icon: Globe
    },
    {
      name: "Shopify",
      description: "Ideaal voor groeiende webshops",
      features: ["API integratie", "Automatische meldingen", "Multi-channel support"],
      icon: ShoppingCart
    },
    {
      name: "Magento",
      description: "Voor enterprise webshops",
      features: ["Geavanceerde integratie", "Custom workflows", "Multi-store support"],
      icon: Settings
    }
  ];

  const challenges = [
    {
      title: "Nee-verkoop voorkomen",
      description: "Automatische synchronisatie zorgt ervoor dat je webshop altijd de juiste voorraad toont.",
      icon: Bell,
      color: "red"
    },
    {
      title: "Dubbele administratie",
      description: "EÃ©n systeem voor zowel je webshop als je magazijn voorkomt fouten.",
      icon: Shield,
      color: "blue"
    },
    {
      title: "Voorraad optimalisatie",
      description: "Analyseer je verkoopcijfers om je inkoop te optimaliseren.",
      icon: BarChart3,
      color: "green"
    },
    {
      title: "Multi-channel verkoop",
      description: "Beheer voorraad voor webshop, marktplaats en fysieke verkoop.",
      icon: TrendingUp,
      color: "purple"
    }
  ];

  const benefits = [
    "Automatische synchronisatie tussen webshop en magazijn",
    "Real-time voorraad updates",
    "Voorkom nee-verkoop en klachten",
    "Bespaar tijd op administratie",
    "Betere klanttevredenheid",
    "Geoptimaliseerde inkoop",
    "Multi-channel voorraadbeheer",
    "Automatische meldingen bij lage voorraad"
  ];

  return (
    <SeoPageLayout
      title="Voorraadbeheer voor Webshops"
      image="/optimized/Inventory-Management.png"
    >
      <SEO
        title="Voorraadbeheer voor Webshops | E-commerce Stockbeheer | stockflow"
        description="Voorraadbeheer voor webshops: complete gids met integraties en automatisering. Ontdek hoe je als e-commerce ondernemer je webshopvoorraad efficiÃ«nt beheert en nee-verkoop voorkomt."
        keywords="voorraadbeheer webshop, e-commerce voorraad, webshop voorraadbeheer, voorraad integratie, voorraad automatiseren, webshop voorraad app, e-commerce stockbeheer, webshop voorraad synchronisatie, voorraadbeheer e-commerce, webshop voorraad optimalisatie, voorraadbeheer online shop, e-commerce voorraadbeheer software, webshop voorraad management, voorraadbeheer webshop integratie"
        url="https://www.stockflow.be/voorraadbeheer-webshop"
        image="/optimized/Inventory-Management.png"
      />
      <Header 
        simplifiedNav={false}
        hideNotifications={true}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-300 to-red-500 text-white py-16 px-6 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Voorraadbeheer voor Webshops
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Als <strong>webshop</strong> is goed <strong>voorraadbeheer</strong> essentieel. 
            Met de juiste tools en integraties voorkom je nee-verkoop en houd je altijd zicht op je voorraad.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">Webshop integratie</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">Automatische sync</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">Nee-verkoop voorkomen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Waarom voorraadbeheer voor webshops?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                E-commerce ondernemers hebben unieke uitdagingen op het gebied van <strong>voorraadbeheer</strong>. 
                Je moet real-time synchroniseren tussen je webshop en magazijn, nee-verkoop voorkomen en 
                klanten altijd de juiste informatie geven. Met de juiste <strong>webshop integratie</strong> 
                wordt dit eenvoudig en efficiÃ«nt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Uitdagingen voor webshop voorraadbeheer
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {challenges.map((challenge, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`bg-${challenge.color}-100 p-3 rounded-full`}>
                  <challenge.icon className={`w-6 h-6 text-${challenge.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="bg-gradient-to-br from-orange-300 to-red-500 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Webshop integraties
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <integration.icon className="w-8 h-8 text-orange mr-3" />
                  <h3 className="text-xl font-semibold text-black">{integration.name}</h3>
                </div>
                <p className="text-black text-sm mb-4 opacity-90">{integration.description}</p>
                <ul className="space-y-2">
                  {integration.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-black text-sm">
                      <Check className="w-4 h-4 text-orange-300 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Voordelen van webshop voorraadbeheer
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <h3 className="text-sm font-semibold text-gray-800">{benefit}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Stappenplan: Webshop voorraadbeheer implementeren
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Stap 1: Kies je platform</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 mr-3">1</div>
                  <span>Bepaal welk e-commerce platform je gebruikt</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 mr-3">2</div>
                  <span>Controleer welke integraties beschikbaar zijn</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 mr-3">3</div>
                  <span>Test de integratie in een testomgeving</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Stap 2: Configureer synchronisatie</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 mr-3">4</div>
                  <span>Stel automatische synchronisatie in</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 mr-3">5</div>
                  <span>Configureer meldingen bij lage voorraad</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 mr-3">6</div>
                  <span>Test de volledige workflow</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Best practices voor webshop voorraadbeheer
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-600">Wat je wel moet doen</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Real-time synchronisatie instellen</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Automatische meldingen configureren</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Regelmatig voorraadcontroles uitvoeren</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Analyseer verkoopcijfers voor optimalisatie</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Wat je moet vermijden</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Check className="text-red-500 mr-3 mt-0.5"></Check>
                <span>Handmatige voorraad updates</span>
              </li>
              <li className="flex items-start">
                <Check className="text-red-500 mr-3 mt-0.5"></Check>
                <span>Geen backup van voorraadgegevens</span>
              </li>
              <li className="flex items-start">
                <Check className="text-red-500 mr-3 mt-0.5"></Check>
                <span>Geen monitoring van voorraadniveaus</span>
              </li>
              <li className="flex items-start">
                <Check className="text-red-500 mr-3 mt-0.5"></Check>
                <span>Geen integratie tussen systemen</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8">
          <div className="text-orange-600 text-4xl mx-auto mb-4">?</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Veelgestelde vragen over webshop voorraadbeheer
          </h2>
          <p className="text-gray-600">
            Antwoorden op de meest gestelde vragen van e-commerce ondernemers
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Hoe werkt webshop voorraad synchronisatie?
            </h3>
            <p className="text-gray-700">
              Via API integraties synchroniseert je voorraadbeheer systeem automatisch met je webshop. 
              Wanneer een bestelling binnenkomt, wordt de voorraad direct aangepast. 
              Dit voorkomt nee-verkoop en dubbele administratie.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Welke webshop platforms ondersteunt stockflow?
            </h3>
            <p className="text-gray-700 mb-3">
              stockflow integreert met alle populaire e-commerce platforms zoals WooCommerce, 
              Shopify, Magento en meer. Bekijk onze <a href="/voorraadbeheer-software-vergelijken" className="text-orange-700 underline font-semibold">
                complete vergelijking
              </a> voor meer details.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Hoe voorkom ik nee-verkoop in mijn webshop?
            </h3>
            <p className="text-gray-700 mb-3">
              Door automatische synchronisatie en real-time voorraad updates toon je klanten altijd 
              de juiste beschikbaarheid. Stel ook meldingen in bij lage voorraad zodat je tijdig kunt bijbestellen.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Kan ik voorraadbeheer automatiseren voor mijn webshop?
            </h3>
            <p className="text-gray-700 mb-3">
              Ja, met moderne voorraadbeheer software kun je veel processen automatiseren. 
              <a href="/voorraadbeheer-automatiseren" className="text-orange-700 underline font-semibold">
                Lees meer over voorraadbeheer automatiseren
              </a>.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Wat als ik meerdere verkoopkanalen heb?
            </h3>
            <p className="text-gray-700 mb-3">
              stockflow ondersteunt multi-channel voorraadbeheer. Je kunt voorraad beheren voor 
              webshop, marktplaats, fysieke verkoop en meer vanuit kassa systeem.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-orange-300 to-red-500 text-white p-8 rounded-lg text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Klaar om je webshop voorraad te optimaliseren?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Start vandaag nog met professioneel webshop voorraadbeheer. 
            Voorkom nee-verkoop en groei je e-commerce bedrijf.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/gratis-stockbeheer" 
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis starten
            </a>
            <a 
              href="/voorraadbeheer-automatiseren" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Meer over automatiseren
            </a>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="max-w-4xl mx-auto mb-8 mt-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Meer lezen over webshop voorraadbeheer?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/voorraadbeheer-automatiseren" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-orange-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Voorraadbeheer automatiseren
              </h3>
              <p className="text-gray-600 text-sm">
                Ontdek hoe je voorraadbeheer kunt automatiseren voor je webshop.
              </p>
            </div>
          </Link>
          <Link to="/voorraadbeheer-tips" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-orange-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Voorraadbeheer tips
              </h3>
              <p className="text-gray-600 text-sm">
                Praktische tips voor efficiÃ«nt voorraadbeheer en kostenbesparing.
              </p>
            </div>
          </Link>
          <Link to="/voorraadbeheer-software-vergelijken" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-orange-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Software vergelijken
              </h3>
              <p className="text-gray-600 text-sm">
                Vergelijk verschillende voorraadbeheer software oplossingen.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Hoe werkt webshop voorraad synchronisatie?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Via API integraties synchroniseert je voorraadbeheer systeem automatisch met je webshop. Wanneer een bestelling binnenkomt, wordt de voorraad direct aangepast. Dit voorkomt nee-verkoop en dubbele administratie."
            }
          },
          {
            "@type": "Question",
            "name": "Welke webshop platforms ondersteunt stockflow?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "stockflow integreert met alle populaire e-commerce platforms zoals WooCommerce, Shopify, Magento en meer."
            }
          },
          {
            "@type": "Question",
            "name": "Hoe voorkom ik nee-verkoop in mijn webshop?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Door automatische synchronisatie en real-time voorraad updates toon je klanten altijd de juiste beschikbaarheid. Stel ook meldingen in bij lage voorraad zodat je tijdig kunt bijbestellen."
            }
          },
          {
            "@type": "Question",
            "name": "Kan ik voorraadbeheer automatiseren voor mijn webshop?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja, met moderne voorraadbeheer software kun je veel processen automatiseren."
            }
          },
          {
            "@type": "Question",
            "name": "Wat als ik meerdere verkoopkanalen heb?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "stockflow ondersteunt multi-channel voorraadbeheer. Je kunt voorraad beheren voor webshop, marktplaats, fysieke verkoop en meer vanuit kassa systeem."
            }
          }
        ]
      }`}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Voorraadbeheer voor Webshops",
        "description": "Voorraadbeheer voor webshops: complete gids met integraties en automatisering. Ontdek hoe je als e-commerce ondernemer je webshopvoorraad efficiÃ«nt beheert en nee-verkoop voorkomt.",
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
        "datePublished": "2024-01-01",
        "dateModified": "2024-12-19",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/voorraadbeheer-webshop"
        }
      }`}} />
      <Footer />
    </SeoPageLayout>
  );
} 
