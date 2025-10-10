import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { Check, Smartphone, Bell, Shield, TrendingUp, Clock, BarChart3, DollarSign, RefreshCw, Settings } from 'lucide-react';
import { usePageRefresh } from '@/hooks/usePageRefresh';

import { StructuredData } from '../../components/StructuredData';
export default function VoorraadbeheerAutomatiseren() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  
  const automationBenefits = [
    {
      title: "Tijdsbesparing",
      description: "Bespaar uren per week op handmatige taken",
      percentage: "70%",
      icon: Clock,
      color: "blue"
    },
    {
      title: "Foutreductie",
      description: "Minimaliseer handmatige invoerfouten",
      percentage: "90%",
      icon: Shield,
      color: "green"
    },
    {
      title: "Realtime inzicht",
      description: "Altijd actuele voorraadgegevens",
      percentage: "100%",
      icon: TrendingUp,
      color: "purple"
    },
    {
      title: "Kostenbesparing",
      description: "Voorkom overstock en tekorten",
      percentage: "25%",
      icon: DollarSign,
      color: "orange"
    }
  ];

  const automationFeatures = [
    {
      title: "Automatische synchronisatie",
      description: "Voorraad wordt automatisch bijgewerkt bij verkoop",
      icon: RefreshCw,
      color: "blue"
    },
    {
      title: "Intelligente meldingen",
      description: "Automatische waarschuwingen bij lage voorraad",
      icon: Bell,
      color: "red"
    },
    {
      title: "Geautomatiseerde rapportages",
      description: "Dagelijkse, wekelijkse en maandelijkse rapporten",
      icon: BarChart3,
      color: "green"
    },
    {
      title: "Integratie met andere systemen",
      description: "Koppeling met boekhouding, webshop en kassa",
      icon: Settings,
      color: "purple"
    },
    {
      title: "Barcode scanning",
      description: "Snelle en accurate voorraad updates",
      icon: Smartphone,
      color: "orange"
    },
    {
      title: "Predictive analytics",
      description: "Voorspel trends en optimaliseer inkoop",
      icon: TrendingUp,
      color: "indigo"
    }
  ];

  const integrationTypes = [
    {
      name: "Webshop integratie",
      description: "Automatische synchronisatie met je e-commerce platform",
      benefits: ["Real-time voorraad updates", "Voorkom nee-verkoop", "Automatische order processing"]
    },
    {
      name: "Boekhouding koppeling",
      description: "Directe koppeling met je boekhoudsoftware",
      benefits: ["Automatische facturering", "Accurate waardering", "Belastingvoordelen"]
    },
    {
      name: "Kassa integratie",
      description: "Synchronisatie met je kassasysteem",
      benefits: ["Directe voorraad updates", "Foutloze verkoopregistratie", "Real-time rapportages"]
    }
  ];

  return (
    <SeoPageLayout
      title="Voorraadbeheer Automatiseren"
    >
      <SEO
        title="Voorraadbeheer Automatiseren | Complete Gids | stockflow"
        description="Voorraadbeheer automatiseren? Complete gids met voordelen, tips en tools om je voorraadbeheer slimmer en effici�nter te maken met automatisering. Ontdek hoe je tijd kunt besparen en fouten kunt voorkomen."
        keywords="voorraadbeheer automatiseren, voorraadbeheer automatisering, voorraadbeheer koppelen, voorraadbeheer integratie, voorraadbeheer software, voorraadbeheer automatiseren tips, voorraadbeheer automatiseren voordelen, voorraadbeheer automatiseren kosten, voorraadbeheer automatiseren implementatie, voorraadbeheer automatiseren software, voorraadbeheer automatiseren webshop, voorraadbeheer automatiseren boekhouding"
        url="https://www.stockflow.be/voorraadbeheer-automatiseren"
        image="/optimized/Inventory-Management.png"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-300 to-cyan-500 text-white py-16 px-6 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Voorraadbeheer Automatiseren
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Door <strong>voorraadbeheer te automatiseren</strong> bespaar je tijd, voorkom je fouten en krijg je realtime inzicht in je voorraad. 
            Ontdek hoe automatisering jouw bedrijf slimmer maakt.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">70% tijdsbesparing</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">90% minder fouten</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">Realtime inzicht</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="text-teal-500 text-3xl mt-1 flex-shrink-0">?</div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Waarom voorraadbeheer automatiseren?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Automatisering van <strong>voorraadbeheer</strong> is geen luxe meer, maar een noodzaak voor moderne bedrijven. 
                Het bespaart tijd, voorkomt fouten en geeft je de controle die je nodig hebt om te groeien. 
                Met de juiste <strong>automatisering tools</strong> kun je je bedrijf naar het volgende niveau tillen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Voordelen van voorraadbeheer automatiseren
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {automationBenefits.map((benefit, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className={`bg-${benefit.color}-100 p-3 rounded-full mx-auto mb-3`}>
                  <benefit.icon className={`w-8 h-8 text-${benefit.color}-600`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{benefit.title}</h3>
                <div className="text-2xl font-bold text-teal-600 mb-2">{benefit.percentage}</div>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Features Section */}
      <div className="bg-gradient-to-br from-teal-300 to-cyan-500 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Automatisering functies
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automationFeatures.map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="flex items-start space-x-3">
                  <feature.icon className={`w-6 h-6 text-${feature.color}-300 mt-1 flex-shrink-0`} />
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-black-300 text-sm opacity-90">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Types Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Integratie mogelijkheden
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {integrationTypes.map((integration, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {integration.name}
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {integration.description}
              </p>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Voordelen:</h4>
                <ul className="space-y-2">
                  {integration.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-teal-600 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Steps */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Stappenplan: Voorraadbeheer automatiseren
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Analyseer huidige processen</h3>
              <p className="text-gray-600">
                Identificeer welke processen geautomatiseerd kunnen worden en waar de meeste tijd wordt verspild.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyan-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Kies de juiste software</h3>
              <p className="text-gray-600">
                Selecteer voorraadbeheer software die past bij je behoeften en integreert met je bestaande systemen.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Implementeer geleidelijk</h3>
              <p className="text-gray-600">
                Start met de belangrijkste processen en breid geleidelijk uit naar meer geavanceerde automatisering.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Return on Investment van automatisering
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-600">Financi�le voordelen</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>25% reductie in voorraadkosten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>70% tijdsbesparing op administratie</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>90% minder fouten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Betere cashflow door geoptimaliseerde inkoop</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Tijdsvoordelen</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Automatische voorraad updates</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Geen handmatige tellingen meer</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Automatische rapportages</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Meer tijd voor strategische taken</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8">
          <div className="text-teal-600 text-4xl mx-auto mb-4">?</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Veelgestelde vragen over automatisering
          </h2>
          <p className="text-gray-600">
            Antwoorden op de meest gestelde vragen over voorraadbeheer automatisering
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Hoeveel kost voorraadbeheer automatisering?
            </h3>
            <p className="text-gray-700">
              De kosten vari�ren afhankelijk van je behoeften. stockflow biedt een gratis versie aan, 
              terwijl concurrenten versies vanaf �29 per maand kosten. De ROI is meestal binnen 3-6 maanden bereikt.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Hoe lang duurt het om voorraadbeheer te automatiseren?
            </h3>
            <p className="text-gray-700 mb-3">
              De implementatie duurt meestal 2-4 weken, afhankelijk van de complexiteit van je processen 
              en de gewenste integraties.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Kan ik mijn bestaande systemen blijven gebruiken?
            </h3>
            <p className="text-gray-700 mb-3">
              Ja, moderne voorraadbeheer software integreert met bestaande systemen zoals boekhouding, 
              webshops en kassasystemen.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Wat als ik technisch niet zo sterk ben?
            </h3>
            <p className="text-gray-700 mb-3">
              <a href="/gratis-stockbeheer" className="text-teal-700 underline font-semibold">
                stockflow is ontworpen voor gebruiksvriendelijkheid
              </a>. 
              Je hebt geen technische kennis nodig om te beginnen.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Kan ik geleidelijk automatiseren?
            </h3>
            <p className="text-gray-700 mb-3">
              Absoluut! Begin met de belangrijkste processen en breid geleidelijk uit. 
              Dit maakt de overstap minder overweldigend.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-teal-300 to-cyan-500 text-white p-8 rounded-lg text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mx-auto mb-4">?</div>
          <h2 className="text-3xl font-bold mb-4">
            Klaar om voorraadbeheer te automatiseren?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Start vandaag nog met geautomatiseerd voorraadbeheer. 
            Bespaar tijd en voorkom fouten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/gratis-stockbeheer" 
              className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis starten
            </a>
            <a 
              href="/voorraadbeheer-software-vergelijken" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
            >
              Software vergelijken
            </a>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Gerelateerde Artikelen</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 transition">
                  Voorraadbeheer Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete gids over professionele voorraadbeheer software.
                </p>
                <div className="text-teal-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/magazijnbeheer" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 transition">
                  Magazijnbeheer Automatiseren
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Automatiseer je warehouse operaties en verhoog efficiency.
                </p>
                <div className="text-teal-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-webshop" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 transition">
                  Webshop Automatisering
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Automatiseer je e-commerce voorraad synchronisatie.
                </p>
                <div className="text-teal-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-kmo" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 transition">
                  Automatisering voor KMO's
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Betaalbare automatisering oplossingen voor kleine bedrijven.
                </p>
                <div className="text-teal-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-excel" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 transition">
                  Van Handmatig naar Geautomatiseerd
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Overstappen van Excel naar geautomatiseerde software.
                </p>
                <div className="text-teal-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/inventory-management-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 transition">
                  Inventory Automation
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  English version - automate your inventory management.
                </p>
                <div className="text-teal-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto mb-8">
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

      {/* Structured Data */}

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {"@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Hoeveel kost voorraadbeheer automatisering?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "De kosten vari�ren afhankelijk van je behoeften. stockflow biedt een gratis versie aan, terwijl premium versies vanaf �29 per maand kosten. De ROI is meestal binnen 3-6 maanden bereikt."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Hoe lang duurt het om voorraadbeheer te automatiseren?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "De implementatie duurt meestal 2-4 weken, afhankelijk van de complexiteit van je processen en de gewenste integraties."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Kan ik mijn bestaande systemen blijven gebruiken?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Ja, moderne voorraadbeheer software integreert met bestaande systemen zoals boekhouding, webshops en kassasystemen."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Wat als ik technisch niet zo sterk ben?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "stockflow is ontworpen voor gebruiksvriendelijkheid. Je hebt geen technische kennis nodig om te beginnen."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Kan ik geleidelijk automatiseren?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Absoluut! Begin met de belangrijkste processen en breid geleidelijk uit. Dit maakt de overstap minder overweldigend."
                    }
                  }
                ]        },        {"@context": "https://schema.org",
                "@type": "Article",
                "headline": "Voorraadbeheer Automatiseren",
                "description": "Voorraadbeheer automatiseren? Complete gids met voordelen, tips en tools om je voorraadbeheer slimmer en effici�nter te maken met automatisering. Ontdek hoe je tijd kunt besparen en fouten kunt voorkomen.",
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
                  "@id": "https://www.stockflow.be/voorraadbeheer-automatiseren"
                }
              }
        ]} />
    </SeoPageLayout>
  );
} 
