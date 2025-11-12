import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Package, BarChart3, RefreshCw, Users, Smartphone, Cloud, TrendingUp, AlertCircle, Zap } from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
export default function WatIsVoorraadbeheerSoftware() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat doet voorraadbeheer software precies?",
      answer: "Voorraadbeheer software helpt je om je producten en voorraad automatisch bij te houden. Het registreert wat je hebt, waar het zich bevindt, en wanneer je moet bijbestellen. Dit gebeurt real-time en automatisch, waardoor je altijd een actueel overzicht hebt."
    },
    {
      question: "Is voorraadbeheer software moeilijk te gebruiken?",
      answer: "Moderne voorraadbeheer software zoals stockflow is speciaal ontworpen om gebruiksvriendelijk te zijn. Je hebt geen technische kennis nodig en kunt binnen een dag starten. De meeste gebruikers beheersen het systeem binnen een paar uur."
    },
    {
      question: "Voor welke bedrijven is voorraadbeheer software geschikt?",
      answer: "Voorraadbeheer software is geschikt voor elk bedrijf dat producten beheert - van kleine webshops tot grote magazijnen. Of je nu 30 of 30.000 producten hebt, het schaalt mee met je bedrijf."
    },
    {
      question: "Wat is het verschil tussen gratis en betaalde voorraadbeheer software?",
      answer: "Gratis versies bieden basis functionaliteit voor kleine voorraden (meestal tot 30-50 producten). Betaalde versies bieden meer producten, geavanceerde functies zoals automatisering, integraties, meerdere locaties en prioriteit support."
    },
    {
      question: "Kan ik voorraadbeheer software koppelen met mijn webshop?",
      answer: "Ja, professionele voorraadbeheer software integreert met de meeste webshop platforms. Dit zorgt voor automatische voorraad synchronisatie, zodat je webshop altijd de correcte beschikbaarheid toont."
    }
  ];

  const keyFeatures = [
    {
      icon: Package,
      title: "Real-time Voorraad Tracking",
      description: "Zie altijd exact wat je op voorraad hebt, waar het zich bevindt en wat de waarde is.",
      color: "blue"
    },
    {
      icon: RefreshCw,
      title: "Automatische Updates",
      description: "Bij elke verkoop of inkoop wordt je voorraad automatisch bijgewerkt.",
      color: "green"
    },
    {
      icon: AlertCircle,
      title: "Lage Voorraad Waarschuwingen",
      description: "Krijg automatisch meldingen wanneer producten bijna op zijn.",
      color: "orange"
    },
    {
      icon: BarChart3,
      title: "Rapportages & Inzichten",
      description: "Zie welke producten goed verkopen en waar je voorraad inefficiÃ«nt is.",
      color: "purple"
    },
    {
      icon: Users,
      title: "Multi-user Toegang",
      description: "Meerdere teamleden kunnen tegelijk werken met verschillende toegangsrechten.",
      color: "red"
    },
    {
      icon: Smartphone,
      title: "Mobiele App",
      description: "Beheer je voorraad onderweg met een mobiele app en barcode scanning.",
      color: "indigo"
    }
  ];

  const softwareTypes = [
    {
      type: "Cloud-based Software",
      description: "Online toegankelijk via browser of app, geen installatie nodig",
      bestFor: "KMO's en groeiende bedrijven die flexibiliteit willen",
      icon: Cloud
    },
    {
      type: "ERP GeÃ¯ntegreerd",
      description: "Voorraadbeheer als onderdeel van een groter bedrijfssysteem",
      bestFor: "Grote bedrijven met complexe processen",
      icon: Package
    },
    {
      type: "Standalone Software",
      description: "Dedicated voorraadbeheer oplossing met focus op voorraad",
      bestFor: "Bedrijven die vooral voorraad willen optimaliseren",
      icon: TrendingUp
    },
    {
      type: "Branche-specifiek",
      description: "Gespecialiseerd voor bepaalde sectoren (retail, horeca, productie)",
      bestFor: "Bedrijven met specifieke industrie-eisen",
      icon: Zap
    }
  ];

  const benefits = [
    "Bespaar 70% tijd op voorraad administratie",
    "Verminder voorraadkosten met 25% door slimmer inkopen",
    "Elimineer 90% van handmatige fouten",
    "Verbeter klanttevredenheid door minder stockouts",
    "Real-time inzicht in je voorraadwaarde",
    "Automatiseer repetitieve taken",
    "Beter voorspellen van vraag en seizoenen",
    "Eenvoudig schaalbaar bij groei"
  ];

  return (
    <SeoPageLayout title="Wat is Voorraadbeheer Software?">
      <SEO
        title="Wat is Voorraadbeheer Software en Hoe Werkt Het? | Uitleg & Gids | stockflow"
        description="Ontdek wat voorraadbeheer software is, hoe het werkt en waarom elk bedrijf met voorraad het nodig heeft. Complete uitleg met voorbeelden en praktische tips."
        keywords="wat is voorraadbeheer software, voorraadbeheer software uitleg, hoe werkt voorraadbeheer, inventory management software, voorraad software, stockbeheer software, voorraadbeheer systeem"
        url="https://www.stockflow.be/wat-is-voorraadbeheer-software"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Complete Uitleg & Gids
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Wat is <span className="text-yellow-300">Voorraadbeheer Software</span> en Hoe Werkt Het?
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Voorraadbeheer software automatiseert het bijhouden van je producten, voorraad en bestellingen. 
                In deze gids leggen we uit wat het is, hoe het werkt en waarom je het nodig hebt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition text-center"
                >
                  Start Gratis Trial
                </Link>
 
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Geen creditcard nodig
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Setup in 1 dag
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  14 dagen gratis
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">In het kort</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="font-semibold mb-2">ðŸŽ¯ Wat het is</div>
                  <p className="text-blue-100 text-sm">Software die automatisch je voorraad bijhoudt en beheert</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="font-semibold mb-2">âš™ï¸ Hoe het werkt</div>
                  <p className="text-blue-100 text-sm">Registreert elke beweging en update je voorraad real-time</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="font-semibold mb-2">ðŸ’° Wat het oplevert</div>
                  <p className="text-blue-100 text-sm">70% tijdsbesparing en 25% lagere voorraadkosten</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Definition Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wat is <span className="text-blue-600">Voorraadbeheer Software</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Een duidelijke definitie en uitleg
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl mb-12">
            <h3 className="text-2xl font-bold mb-4">Definitie</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <strong>Voorraadbeheer software</strong> (ook wel inventory management software of stockbeheer software genoemd) 
              is een digitaal systeem dat bedrijven helpt om hun voorraad te beheren, bij te houden en te optimaliseren. 
              Het automatiseert het proces van voorraad tellen, registreren en analyseren.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In plaats van handmatig met Excel of op papier je voorraad bij te houden, doet de software dit automatisch. 
              Het houdt bij wat je hebt, waar het zich bevindt, wanneer je moet bijbestellen en welke producten goed of slecht draaien.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-3xl mr-3">âŒ</span>
                Zonder Software
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">â€¢</span>
                  <span>Handmatig tellen en invoeren in Excel</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">â€¢</span>
                  <span>Veel tijd kwijt aan administratie</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">â€¢</span>
                  <span>Regelmatig fouten en discrepanties</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">â€¢</span>
                  <span>Geen real-time inzicht</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">â€¢</span>
                  <span>Moeilijk te schalen bij groei</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-600">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-3xl mr-3">âœ…</span>
                Met Software
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span>Automatische voorraad updates</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span>Bespaar 70% tijd op administratie</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span>99% nauwkeurigheid zonder fouten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span>Real-time inzicht altijd en overal</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span>Schaalt mee met je groei</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hoe <span className="text-blue-600">Werkt</span> Voorraadbeheer Software?
            </h2>
            <p className="text-lg text-gray-600">
              Het proces in 4 eenvoudige stappen
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Producten Registreren</h3>
                  <p className="text-gray-700 mb-3">
                    Je voert je producten Ã©Ã©n keer in het systeem in met alle belangrijke informatie: 
                    naam, SKU, prijs, leverancier, minimum voorraad, etc. Je kunt dit doen via Excel import, 
                    handmatig invoeren of barcode scanning.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Product info</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Excel import</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Barcode scanning</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Automatisch Bijhouden</h3>
                  <p className="text-gray-700 mb-3">
                    Elke keer dat je iets verkoopt, ontvangt of verplaatst, registreert de software dit automatisch. 
                    Door koppelingen met je webshop, kassasysteem of handmatige invoer blijft alles up-to-date.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Real-time updates</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Integraties</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Automatisch</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Inzichten & Waarschuwingen</h3>
                  <p className="text-gray-700 mb-3">
                    De software analyseert je voorraad en geeft waarschuwingen wanneer producten bijna op zijn. 
                    Je krijgt inzichten in welke producten goed verkopen, wat te lang blijft liggen en wat je voorraadwaarde is.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">Lage voorraad alerts</span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">Analyses</span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">Rapportages</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Optimaliseren & Voorspellen</h3>
                  <p className="text-gray-700 mb-3">
                    Op basis van historische data helpt de software je om beter in te kopen, seizoenspatronen te herkennen 
                    en je voorraad te optimaliseren. Je voorkomt zowel tekorten als overstock.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">Voorspellingen</span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">Optimalisatie</span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">Trends</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Belangrijkste <span className="text-blue-600">Functies</span>
            </h2>
            <p className="text-lg text-gray-600">
              Wat moet goede voorraadbeheer software kunnen?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Wil je meer weten over specifieke functies? Bekijk onze complete <Link to="/voorraadbeheer-software" className="text-blue-600 font-semibold hover:underline">voorraadbeheer software gids</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Waarom Je Voorraadbeheer Software Nodig Hebt
            </h2>
            <p className="text-xl opacity-90">
              De belangrijkste voordelen voor jouw bedrijf
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur p-4 rounded-lg">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/auth"
              className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
            >
              Probeer Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Types of Software Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Verschillende <span className="text-blue-600">Types</span> Voorraadbeheer Software
            </h2>
            <p className="text-lg text-gray-600">
              Kies de juiste oplossing voor jouw situatie
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {softwareTypes.map((type, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <type.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{type.type}</h3>
                    <p className="text-gray-700 mb-3">{type.description}</p>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-semibold text-blue-900 mb-1">Best voor:</div>
                      <div className="text-sm text-gray-700">{type.bestFor}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">Stockflow: Cloud-based & Schaalbaar</h3>
            <p className="text-lg mb-6 opacity-90">
              Stockflow is een moderne cloud-based oplossing speciaal ontworpen voor <Link to="/voorraadbeheer-kmo" className="underline hover:text-yellow-300">KMO's</Link>. 
              Begin klein en groei mee zonder systeem te wisselen.
            </p>

          </div>
        </div>
      </section>

      {/* Who Needs It Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wie Heeft <span className="text-blue-600">Voorraadbeheer Software</span> Nodig?
            </h2>
            <p className="text-lg text-gray-600">
              Herken je jezelf in Ã©Ã©n van deze situaties?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">E-commerce & Webshops</h3>
              <p className="text-gray-700 mb-4">
                Als je online verkoopt via een webshop, is real-time voorraad cruciaal om stockouts te voorkomen.
              </p>
              <Link to="/voorraadbeheer-webshop" className="text-blue-600 font-semibold hover:underline">
                Lees meer â†’
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Retail & Winkels</h3>
              <p className="text-gray-700 mb-4">
                Voor winkels met meerdere vestigingen of een centrale voorraad is overzicht essentieel.
              </p>
              <Link to="/voorraadbeheer-software" className="text-green-600 font-semibold hover:underline">
                Lees meer â†’
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Magazijnen & Distributie</h3>
              <p className="text-gray-700 mb-4">
                Als je producten opslaat en distribueert, heb je professioneel magazijnbeheer nodig.
              </p>
              <Link to="/magazijnbeheer" className="text-purple-600 font-semibold hover:underline">
                Lees meer â†’
              </Link>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Horeca & Catering</h3>
              <p className="text-gray-700 mb-4">
                Verse producten en ingrediÃ«nten vereisen nauwkeurig voorraadbeheer om verspilling te voorkomen.
              </p>
              <Link to="/voorraadbeheer-horeca" className="text-orange-600 font-semibold hover:underline">
                Lees meer â†’
              </Link>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Productie & Manufacturing</h3>
              <p className="text-gray-700 mb-4">
                Bij productie moet je grondstoffen, work-in-progress en eindproducten bijhouden.
              </p>
              <Link to="/voorraadbeheer-software" className="text-red-600 font-semibold hover:underline">
                Lees meer â†’
              </Link>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Groeiende KMO's</h3>
              <p className="text-gray-700 mb-4">
                Groei je van Excel naar professioneel? Voorraadbeheer software schaalt mee met je ambities.
              </p>
              <Link to="/voorraadbeheer-kmo" className="text-indigo-600 font-semibold hover:underline">
                Lees meer â†’
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klaar om te Beginnen met <span className="text-blue-600">Voorraadbeheer Software</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start vandaag nog gratis met stockflow. Geen creditcard nodig, setup in minder dan een uur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
            >
              Start je gratis proefperiode
            </Link>

          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              14 dagen gratis trial
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Setup in 1 dag
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Nederlandse support
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Veelgestelde Vragen</h2>
            <p className="text-lg text-gray-600">
              Alles wat je moet weten over voorraadbeheer software
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Gerelateerde Artikelen</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Complete Voorraadbeheer Software Gids
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Diepgaande uitleg over alle functies en mogelijkheden.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-automatiseren-5-stappen" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer Automatiseren in 5 Stappen
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Praktische gids om te starten met automatisering.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-kmo" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer voor KMO's
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Specifieke oplossingen voor kleine en middelgrote bedrijven.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer â†’</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/logo.png"
            alt="stockflow"
            className="h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Moderne voorraadbeheer software voor bedrijven die willen groeien. 
            Automatiseer je voorraad en bespaar tijd.
          </p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
              Voorraadbeheer Software & Inventory Management.
            </p>
          </div>
        </div>
      </footer>

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Wat is Voorraadbeheer Software en Hoe Werkt Het?",
          "description": "Complete uitleg over wat voorraadbeheer software is, hoe het werkt en waarom je het nodig hebt. Met praktische voorbeelden en tips.",
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
          "dateModified": "new Date().toISOString().split('T')[0]",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflow.be/wat-is-voorraadbeheer-software"
          }
        }
      ]} />
    </SeoPageLayout>
  );
}



