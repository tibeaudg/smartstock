import React from 'react';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { Check, Star, Smartphone, Bell, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Utensils, Coffee, ChefHat, Clock, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/Header';
import Footer from '../../components/Footer';

export default function VoorraadbeheerHoreca() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  
  const horecaTypes = [
    {
      name: "Restaurants",
      description: "Beheer ingrediënten, dranken en voorraad",
      features: ["Ingrediënten tracking", "Recept integratie", "Leverancier management"],
      icon: Utensils,
      color: "red"
    },
    {
      name: "Cafés",
      description: "Focus op dranken en snacks",
      features: ["Dranken voorraad", "Snack management", "Dagelijkse controle"],
      icon: Coffee,
      color: "orange"
    },
    {
      name: "Bakkerijen",
      description: "Beheer meel, ingrediënten en eindproducten",
      features: ["Ingrediënten tracking", "Productie planning", "Houdbaarheid controle"],
      icon: ChefHat,
      color: "yellow"
    }
  ];

  const challenges = [
    {
      title: "Houdbaarheid beheer",
      description: "Voorkom verspilling door houdbaarheidsdata te tracken en meldingen in te stellen.",
      icon: Clock,
      color: "green"
    },
    {
      title: "Seizoensinvloeden",
      description: "Pas je voorraad aan aan seizoensgebonden vraag en beschikbaarheid.",
      icon: TrendingUp,
      color: "blue"
    },
    {
      title: "Voedselveiligheid",
      description: "Zorg voor traceerbaarheid en houdbaarheidscontrole volgens HACCP richtlijnen.",
      icon: Shield,
      color: "purple"
    },
    {
      title: "Dagelijkse controle",
      description: "Controleer dagelijks je voorraad om tekorten en overstock te voorkomen.",
      icon: AlertTriangle,
      color: "red"
    }
  ];

  const benefits = [
    "Voorkom verspilling en bespaar kosten",
    "Altijd voldoen aan voedselveiligheidseisen",
    "Eenvoudige dagelijkse controle",
    "Automatische meldingen bij lage voorraad",
    "Betere inkoop door inzicht in verbruik",
    "HACCP compliant voorraadbeheer",
    "Mobiele toegang voor keukenpersoneel",
    "Integratie met leveranciers mogelijk"
  ];

  return (
    <SeoPageLayout
      title="Voorraadbeheer voor Horeca"
      image="/optimized/Inventory-Management.png"
    >
      <SEO
        title="Voorraadbeheer voor Horeca | Restaurant & Café Stockbeheer | stockflow"
        description="Voorraadbeheer voor horeca: complete gids voor restaurants, cafés en bakkers. Ontdek hoe je eenvoudig je horeca voorraad beheert, verspilling voorkomt en voldoet aan voedselveiligheidseisen."
        keywords="voorraadbeheer horeca, horeca voorraad, voorraadbeheer restaurant, voorraadbeheer café, voorraadbeheer bakker, horeca voorraad app, restaurant voorraadbeheer, café voorraadbeheer, bakker voorraadbeheer, horeca stockbeheer, voorraadbeheer keuken, horeca voorraad management, voorraadbeheer horeca software, horeca voorraad optimalisatie, voedselveiligheid voorraadbeheer, HACCP voorraadbeheer"
        url="https://www.stockflow.be/voorraadbeheer-horeca"
        image="/optimized/Inventory-Management.png"
      />

      <Header 
        simplifiedNav={false}
        hideNotifications={true}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-300 to-orange-500 text-white py-16 px-6 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Voorraadbeheer voor Horeca
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Goed <strong>voorraadbeheer</strong> is onmisbaar in de <strong>horeca</strong>. 
            Met deze complete gids houd je eenvoudig je voorraad bij in je restaurant, café of bakkerij.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">Voedselveiligheid</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">Verspilling voorkomen</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">HACCP compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="text-yellow-500 text-3xl mt-1 flex-shrink-0">?</div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Waarom voorraadbeheer voor horeca?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                In de horeca is <strong>voorraadbeheer</strong> cruciaal voor succes. Je moet verspilling voorkomen, 
                voedselveiligheid garanderen en altijd de juiste ingrediënten beschikbaar hebben. 
                Met moderne <strong>horeca voorraad software</strong> wordt dit eenvoudig en efficiënt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Horeca Types Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Voorraadbeheer per horeca type
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {horecaTypes.map((type, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`bg-${type.color}-100 p-3 rounded-full`}>
                  <type.icon className={`w-6 h-6 text-${type.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    {type.name}
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {type.description}
                  </p>
                  <ul className="space-y-2">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges Section */}
      <div className="bg-gradient-to-br from-yellow-300 to-orange-500 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Uitdagingen in horeca voorraadbeheer
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="flex items-start space-x-3">
                  <challenge.icon className={`w-6 h-6 text-${challenge.color}-300 mt-1 flex-shrink-0`} />
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-black-300 text-sm opacity-90">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Voordelen van horeca voorraadbeheer
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

      {/* Best Practices Section */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Best practices voor horeca voorraadbeheer
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-600">Dagelijkse routines</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Controleer voorraad bij opening en sluiting</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Update houdbaarheidsdata dagelijks</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Registreer verbruik per dag</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Plan bestellingen op basis van verbruik</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Wekelijkse controle</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Analyseer verkoopcijfers</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Controleer leveranciers en prijzen</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Plan menu's op basis van voorraad</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Evalueer verspilling en optimaliseer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Steps */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Stappenplan: Horeca voorraadbeheer implementeren
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-yellow-600">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Inventarisatie</h3>
            <p className="text-gray-600">
              Maak een complete lijst van alle ingrediënten, dranken en voorraad.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-600">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Digitaliseren</h3>
            <p className="text-gray-600">
              Voer alle data in een voorraadbeheer systeem in.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Procedures</h3>
            <p className="text-gray-600">
              Stel dagelijkse en wekelijkse controle procedures in.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto mb-12 bg-gray-100">
        <div className="text-center mb-8 max-w-5xl mx-auto p-6 m-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Veelgestelde vragen over horeca voorraadbeheer
          </h2>
          <p className="text-gray-600">
            Antwoorden op de meest gestelde vragen van horeca ondernemers
          </p>
        </div>
        
        <div className="space-y-6 m-12 pb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Hoe voorkom ik verspilling in mijn restaurant?
            </h3>
            <p className="text-gray-700">
              Door dagelijkse voorraadcontrole, houdbaarheidsdata bijhouden en verbruik te analyseren 
              kun je verspilling minimaliseren. Gebruik een voorraadbeheer systeem met automatische meldingen.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Moet ik HACCP procedures volgen voor voorraadbeheer?
            </h3>
            <p className="text-gray-700 mb-3">
              Ja, HACCP is verplicht in de horeca. Een goed voorraadbeheer systeem helpt je 
              aan de vereisten te voldoen door traceerbaarheid en houdbaarheidscontrole.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Hoe vaak moet ik mijn voorraad controleren?
            </h3>
            <p className="text-gray-700 mb-3">
              Dagelijks bij opening en sluiting voor kritieke items, wekelijks voor de volledige voorraad. 
              Gebruik automatische meldingen voor lage voorraad.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Kan ik voorraadbeheer automatiseren in mijn restaurant?
            </h3>
            <p className="text-gray-700 mb-3">
              Ja, moderne voorraadbeheer software kan veel processen automatiseren. 
              <a href="/voorraadbeheer-automatiseren" className="text-yellow-700 underline font-semibold">
                Lees meer over voorraadbeheer automatiseren
              </a>.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Welke software is geschikt voor kleine horeca?
            </h3>
            <p className="text-gray-700 mb-3">
              stockflow is perfect voor kleine horeca vanwege de eenvoudige interface, 
              mobiele toegang en betaalbare prijzen. Je kunt gratis beginnen en meegroeien.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-yellow-300 to-orange-500 text-white p-8 rounded-lg text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Klaar om je horeca voorraad te optimaliseren?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Start vandaag nog met professioneel horeca voorraadbeheer. 
            Voorkom verspilling en voldoe aan voedselveiligheidseisen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/gratis-stockbeheer" 
              className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis starten
            </a>
            <a 
              href="/voorraadbeheer-tips" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors"
            >
              Meer tips lezen
            </a>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-3xl font-bold mb-6 mt-6 text-center text-gray-800">
          Meer lezen over horeca voorraadbeheer?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/voorraadbeheer-tips" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-yellow-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                Voorraadbeheer tips
              </h3>
              <p className="text-gray-600 text-sm">
                Praktische tips voor efficiënt voorraadbeheer en kostenbesparing.
              </p>
            </div>
          </Link>
          <Link to="/voorraadbeheer-automatiseren" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-yellow-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                Voorraadbeheer automatiseren
              </h3>
              <p className="text-gray-600 text-sm">
                Ontdek hoe je voorraadbeheer kunt automatiseren voor je horeca.
              </p>
            </div>
          </Link>
          <Link to="/voorraadbeheer-software-vergelijken" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-yellow-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
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
            "name": "Hoe voorkom ik verspilling in mijn restaurant?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Door dagelijkse voorraadcontrole, houdbaarheidsdata bijhouden en verbruik te analyseren kun je verspilling minimaliseren. Gebruik een voorraadbeheer systeem met automatische meldingen."
            }
          },
          {
            "@type": "Question",
            "name": "Moet ik HACCP procedures volgen voor voorraadbeheer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja, HACCP is verplicht in de horeca. Een goed voorraadbeheer systeem helpt je aan de vereisten te voldoen door traceerbaarheid en houdbaarheidscontrole."
            }
          },
          {
            "@type": "Question",
            "name": "Hoe vaak moet ik mijn voorraad controleren?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dagelijks bij opening en sluiting voor kritieke items, wekelijks voor de volledige voorraad. Gebruik automatische meldingen voor lage voorraad."
            }
          },
          {
            "@type": "Question",
            "name": "Kan ik voorraadbeheer automatiseren in mijn restaurant?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja, moderne voorraadbeheer software kan veel processen automatiseren."
            }
          },
          {
            "@type": "Question",
            "name": "Welke software is geschikt voor kleine horeca?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "stockflow is perfect voor kleine horeca vanwege de eenvoudige interface, mobiele toegang en betaalbare prijzen. Je kunt gratis beginnen en meegroeien."
            }
          }
        ]
      }`}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Voorraadbeheer voor Horeca",
        "description": "Voorraadbeheer voor horeca: complete gids voor restaurants, cafés en bakkers. Ontdek hoe je eenvoudig je horeca voorraad beheert, verspilling voorkomt en voldoet aan voedselveiligheidseisen.",
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
          "@id": "https://www.stockflow.be/voorraadbeheer-horeca"
        }
      }`}} />
      <Footer />
    </SeoPageLayout>
  );
}
