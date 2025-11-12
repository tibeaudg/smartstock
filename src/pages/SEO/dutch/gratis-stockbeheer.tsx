import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { Check, Smartphone, Zap, Shield, Users, TrendingUp, Gift } from 'lucide-react';
import { usePageRefresh } from '@/hooks/usePageRefresh';

import { StructuredData } from '@/components/StructuredData';
export default function GratisStockbeheer() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const features = [
    {
      icon: Gift,
      title: "Gratis voor 30 producten",
      description: "Beheer tot 30 verschillende producten volledig gratis zonder verborgen kosten."
    },
    {
      icon: Smartphone,
      title: "Mobiele app",
      description: "Beheer je voorraad vanaf je smartphone, tablet of computer."
    },
    {
      icon: Zap,
      title: "Direct starten",
      description: "Geen installatie nodig, direct online beschikbaar."
    },
    {
      icon: Shield,
      title: "Veilige data",
      description: "Je gegevens worden veilig opgeslagen in de cloud."
    },
    {
      icon: Users,
      title: "Team samenwerking",
      description: "Werk samen met je team aan voorraadbeheer."
    },
    {
      icon: TrendingUp,
      title: "Schaalbaar",
      description: "Upgrade eenvoudig wanneer je bedrijf groeit."
    }
  ];

  const benefits = [
    "Geen verborgen kosten of verplichtingen",
    "Direct starten, geen installatie nodig",
    "Gebruiksvriendelijke mobiele app",
    "Real-time synchronisatie",
    "Automatische meldingen bij lage voorraad",
    "Professionele rapportages",
    "Integratie met boekhouding mogelijk",
    "24/7 toegang vanaf overal"
  ];

  return (
    <SeoPageLayout
      title="Voorraadbeheer: Gratis Stockbeheer App voor KMO's"
    >
      <SEO
        title="Gratis Stockbeheer Software voor Kleine Ondernemers | stockflow"
        description="Beheer je voorraad eenvoudig online. Gratis stockbeheer software voor winkels, horeca en zelfstandigen. Start direct met stockflow – geen kosten."
        keywords="gratis stockbeheer, gratis voorraadbeheer, stockbeheer app gratis, voorraadbeheer gratis, gratis stockbeheer software, gratis voorraadbeheer app, stockbeheer zonder kosten, voorraadbeheer KMO, gratis voorraadbeheer software, stockbeheer starters, voorraadbeheer kleine bedrijven, gratis stockbeheer app, voorraadbeheer app gratis, stockflow gratis, gratis voorraadbeheer programma"
        url="https://www.stockflow.be/gratis-stockbeheer"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-300 to-emerald-500 text-white py-16 px-6 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Gratis Stockbeheer App voor KMO's
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Start vandaag nog met <strong>professioneel voorraadbeheer</strong> zonder kosten. 
            Beheer tot 30 producten gratis met stockflow en groei mee met je bedrijf.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">✓ 100% Gratis</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">✓ Direct starten</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">✓ Geen verplichtingen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="text-green-500 text-3xl mt-1 flex-shrink-0">ðŸŽ</div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Waarom gratis stockbeheer voor KMO's?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Veel kleine bedrijven en starters denken dat professioneel <strong>voorraadbeheer</strong> 
                duur is. Met stockflow kun je gratis beginnen en ervaren hoe eenvoudig en efficiÃ«nt 
                modern <strong>stockbeheer</strong> kan zijn. Perfect voor KMO's die willen groeien 
                zonder grote investeringen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Wat krijg je met gratis stockbeheer?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-green-300 to-emerald-500 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-green-600 text-4xl mx-auto mb-4">ðŸ’Ž</div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              Voordelen van gratis stockbeheer
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-black">
                Voor starters
              </h3>
              <ul className="space-y-3 text-black">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-black">
                Voor groeiende bedrijven
              </h3>
              <ul className="space-y-3 text-black">
                {benefits.slice(4).map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How to Start Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Hoe start je met gratis stockbeheer?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Account aanmaken</h3>
            <p className="text-gray-600">
              Maak in 2 minuten een gratis account aan. Geen creditcard nodig.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Producten toevoegen</h3>
            <p className="text-gray-600">
              Voeg je eerste producten toe en begin met voorraadbeheer.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Direct gebruiken</h3>
            <p className="text-gray-600">
              Begin direct met voorraadbeheer en ervaar het verschil.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Gratis vs Betaalde Stockbeheer Software
          </h2>
          
          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold mb-4 text-green-800">Gratis Versie</h3>
              <div className="text-3xl font-bold text-green-600 mb-4">$0/maand</div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Onbeperkte producten</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Mobiele app</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Basis rapportages</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8">
          <div className="text-green-600 text-4xl mx-auto mb-4">â“</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Veelgestelde vragen over gratis stockbeheer
          </h2>
          <p className="text-gray-600">
            Antwoorden op de meest gestelde vragen
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Is gratis stockbeheer echt gratis?
            </h3>
            <p className="text-gray-700">
              Ja, stockflow biedt een volledig gratis versie aan voor maximaal 30 producten. 
              Er zijn geen verborgen kosten of verplichtingen. Je kunt altijd gratis blijven gebruiken.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Wat als ik meer dan 30 producten heb?
            </h3>
            <p className="text-gray-700 mb-3">
              Je kunt eenvoudig upgraden naar de premium versie voor $29 per maand. 
              Deze geeft je toegang tot onbeperkte producten en extra functies.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Kan ik mijn data exporteren?
            </h3>
            <p className="text-gray-700 mb-3">
              Ja, je kunt altijd je data exporteren in verschillende formaten. 
              Je bent nooit vastgeklonken aan stockflow.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Is mijn data veilig?
            </h3>
            <p className="text-gray-700 mb-3">
              Absoluut. We gebruiken enterprise-grade beveiliging en je data wordt 
              regelmatig geback-upt. Je privacy is onze prioriteit.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Kan ik gratis stockbeheer testen?
            </h3>
            <p className="text-gray-700 mb-3">
              Ja, je kunt direct beginnen zonder verplichtingen. 
              Maak een gratis account aan en test alle functies.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-green-300 to-emerald-500 text-white p-8 rounded-lg text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mx-auto mb-4">ðŸš€</div>
          <h2 className="text-3xl font-bold mb-4">
            Klaar om gratis te starten?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Maak vandaag nog een gratis account aan en ervaar professioneel voorraadbeheer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/" 
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis account aanmaken
            </a>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 mt-10">
          Meer lezen over stockbeheer?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/voorraadbeheer-voor-starters" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-green-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                Voorraadbeheer voor starters
              </h3>
              <p className="text-gray-600 text-sm">
                Een complete gids voor het opzetten van voorraadbeheer in je bedrijf.
              </p>
            </div>
          </Link>
          <Link to="/voorraadbeheer-tips" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-green-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                Voorraadbeheer tips
              </h3>
              <p className="text-gray-600 text-sm">
                Praktische tips voor efficiÃ«nt voorraadbeheer en kostenbesparing.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Structured Data */}

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {"@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Is gratis stockbeheer echt gratis?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Ja, stockflow biedt een volledig gratis versie aan voor maximaal 30 producten. Er zijn geen verborgen kosten of verplichtingen. Je kunt altijd gratis blijven gebruiken."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Wat als ik meer dan 30 producten heb?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Je kunt eenvoudig upgraden naar de premium versie voor $29 per maand. Deze geeft je toegang tot onbeperkte producten en extra functies."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Kan ik mijn data exporteren?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Ja, je kunt altijd je data exporteren in verschillende formaten. Je bent nooit vastgeklonken aan stockflow."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is mijn data veilig?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Absoluut. We gebruiken enterprise-grade beveiliging en je data wordt regelmatig geback-upt. Je privacy is onze prioriteit."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Kan ik gratis stockbeheer testen?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Ja, je kunt direct beginnen zonder verplichtingen. Maak een gratis account aan en test alle functies."
                    }
                  }
                ]        },        {"@context": "https://schema.org",
                "@type": "Article",
                "headline": "Gratis Stockbeheer App voor KMO's",
                "description": "Ontdek gratis stockbeheer voor KMO's. Beheer tot 30 producten gratis met stockflow. Professioneel voorraadbeheer zonder kosten, perfect voor starters en kleine bedrijven.",
                "image": "https://www.stockflow.be/logo.png",
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
                  "@id": "https://www.stockflow.be/gratis-stockbeheer"
                }
              }
        ]} />
    </SeoPageLayout>
  );
} 


