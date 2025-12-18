import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Package, BarChart3, RefreshCw, Users, Smartphone, Cloud, TrendingUp, AlertCircle, Zap, X } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { getRelatedPages } from '@/config/topicClusters';

export default function WatIsVoorraadbeheerSoftware() {
  usePageRefresh();
  
  const relatedPages = getRelatedPages('/wat-is-voorraadbeheer-software', 8);
  
  const faqData = [
    {
      question: "Wat doet voorraadbeheer software precies?",
      answer: "Voorraadbeheer software helpt je om je producten en voorraad automatisch bij te houden. Het registreert wat je hebt, waar het zich bevindt, en wanneer je moet bijbestellen. Dit gebeurt real-time en automatisch, waardoor je altijd een actueel overzicht hebt."
    },
    {
      question: "Wat is stockbeheer en wat is de betekenis van stockbeheer?",
      answer: "Stockbeheer is een andere term voor voorraadbeheer. Het betekent het beheren en bijhouden van je productvoorraad. Stockbeheer software (ook wel stockbeheer programma genoemd) helpt je om dit digitaal en automatisch te doen, in plaats van handmatig met Excel of op papier."
    },
    {
      question: "Waarom is voorraadbeheer belangrijk?",
      answer: "Voorraadbeheer is belangrijk omdat het je helpt om kosten te besparen, klanttevredenheid te verhogen en efficiënter te werken. Zonder goed voorraadbeheer loop je het risico op stockouts (geen voorraad), overstock (te veel voorraad), en verspilling van tijd en geld. Goed voorraadbeheer kan je 25% op voorraadkosten besparen en 70% tijd op administratie."
    },
    {
      question: "Hoe werkt automatisch voorraadbeheer?",
      answer: "Automatisch voorraadbeheer (ook wel geautomatiseerd voorraadbeheer genoemd) werkt door middel van integraties met je verkoopkanalen, kassasystemen en webshops. Elke verkoop, inkoop of verplaatsing wordt automatisch geregistreerd en je voorraad wordt real-time bijgewerkt. Je krijgt ook automatische meldingen wanneer producten bijna op zijn."
    },
    {
      question: "Wat is het verschil tussen stockbeheer en voorraadbeheer?",
      answer: "Stockbeheer en voorraadbeheer zijn in de praktijk hetzelfde - beide termen verwijzen naar het beheren van je productvoorraad. 'Stockbeheer' wordt vaker gebruikt in België, terwijl 'voorraadbeheer' meer gebruikt wordt in Nederland. Beide hebben dezelfde betekenis: het bijhouden en beheren van je voorraad."
    },
    {
      question: "Is voorraadbeheer software moeilijk te gebruiken?",
      answer: "Moderne voorraadbeheer software zoals stockflow is speciaal ontworpen om gebruiksvriendelijk te zijn. Je hebt geen technische kennis nodig en kunt binnen een dag starten. De meeste gebruikers beheersen het systeem binnen een paar uur. Werken met voorraadbeheer software is veel eenvoudiger dan handmatig voorraad bijhouden met Excel."
    },
    {
      question: "Voor welke bedrijven is voorraadbeheer software geschikt?",
      answer: "Voorraadbeheer software is geschikt voor elk bedrijf dat producten beheert - van kleine webshops tot grote magazijnen. Of je nu 30 of 30.000 producten hebt, het schaalt mee met je bedrijf. Het is vooral belangrijk voor kleinhandel, webshops, magazijnen, horeca en groeiende KMO's."
    },
    {
      question: "Hoe kies je voorraadbeheer software?",
      answer: "Bij het kiezen van voorraadbeheer software moet je letten op: gebruiksvriendelijkheid, prijs, schaalbaarheid, integraties met je bestaande systemen, en support. Begin met een gratis proefperiode om te testen of de software bij je past. Lees ook onze <Link to='/voorraadbeheer-software-vergelijken' className='text-blue-600 hover:underline'>voorraadbeheer software vergelijking</Link> voor meer tips."
    },
    {
      question: "Is er gratis voorraadbeheer software?",
      answer: "Ja, er is gratis voorraadbeheer software beschikbaar. Stockflow biedt bijvoorbeeld een gratis versie voor kleine bedrijven (tot 30 producten). Gratis voorraadbeheer software is ideaal om te starten en te testen of digitaal voorraadbeheer iets voor jou is. Bekijk onze <Link to='/gratis-voorraadbeheer-software' className='text-blue-600 hover:underline'>gratis voorraadbeheer software gids</Link> voor meer informatie."
    },
    {
      question: "Hoe werkt voorraadbeheer in kleinhandel?",
      answer: "Voorraadbeheer in kleinhandel werkt door real-time tracking van voorraad in je winkel(s). Je kunt meerdere locaties beheren, zien welke producten goed verkopen, en automatisch bijbestellen wanneer voorraad laag is. Dit voorkomt stockouts en helpt je om je voorraadkosten te optimaliseren."
    },
    {
      question: "Wat zijn de voordelen van een voorraadbeheer programma?",
      answer: "De voordelen van een voorraadbeheer programma zijn: 70% tijdsbesparing op administratie, 25% lagere voorraadkosten, 90% minder fouten, real-time inzicht, automatische bestelmeldingen, betere klanttevredenheid, en eenvoudige schaalbaarheid bij groei."
    },
    {
      question: "Hoe werkt voorraadbeheer met Excel?",
      answer: "Voorraadbeheer met Excel betekent handmatig je voorraad bijhouden in spreadsheets. Dit is tijdrovend, foutgevoelig en moeilijk te schalen. Veel bedrijven groeien van Excel naar professionele voorraadbeheer software zoals stockflow. Lees meer over de <Link to='/voorraadbeheer-excel' className='text-blue-600 hover:underline'>verschillen tussen Excel en voorraadbeheer software</Link>."
    },
    {
      question: "Wat is digitaal voorraadbeheer?",
      answer: "Digitaal voorraadbeheer betekent het gebruik van software in plaats van papieren systemen of Excel. Het automatiseert het proces van voorraad bijhouden, registreren en analyseren. Digitaal voorraadbeheer geeft je real-time inzicht, voorkomt fouten en bespaart veel tijd."
    },
    {
      question: "Wat is het verschil tussen gratis en betaalde voorraadbeheer software?",
      answer: "Gratis versies bieden basis functionaliteit voor kleine voorraden (meestal tot 30-50 producten). Betaalde versies bieden meer producten, geavanceerde functies zoals automatisering, integraties, meerdere locaties en prioriteit support."
    },
    {
      question: "Kan ik voorraadbeheer software koppelen met mijn webshop?",
      answer: "Ja, professionele voorraadbeheer software integreert met de meeste webshop platforms. Dit zorgt voor automatische voorraad synchronisatie, zodat je webshop altijd de correcte beschikbaarheid toont. Lees meer over <Link to='/voorraadbeheer-webshop' className='text-blue-600 hover:underline'>voorraadbeheer voor webshops</Link>."
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
      description: "Zie welke producten goed verkopen en waar je voorraad inefficiënt is.",
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
      type: "ERP Geïntegreerd",
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
    <SeoPageLayout 
      title="Wat is Voorraadbeheer Software?"
      heroTitle="Wat is Voorraadbeheer Software?"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Wat Is Voorraadbeheer Software 2025: Complete Gids | StockFlow"
        description="Ontdek wat voorraadbeheer software is en hoe het werkt. Complete gids met uitleg. Bespaar 70% tijd, 25% kosten. GRATIS plan beschikbaar. Start gratis - geen creditcard vereist."
        keywords="wat is voorraadbeheer software, voorraadbeheer software uitleg, hoe werkt voorraadbeheer, wat is voorraadbeheer, stockbeheer software, stockbeheer programma, programma stockbeheer, digitaal voorraadbeheer, automatisch voorraadbeheer, geautomatiseerd voorraadbeheer, voorraadbeheer bijhouden, werken met voorraadbeheer, voorraadbeheer software kiezen, voorraadbeheer belangrijk, stockbeheer betekenis, stockbeheer definitie, voorraadbeheer programma, software stockbeheer, voorraadbeheer in kleinhandel, stock beheer, stock programma, voorraadbeheer software gratis, software voor voorraadbeheer, voorraadbeheer voorbeeld, voorraadbeheer webshop, inventory management software, voorraad software, voorraadbeheer systeem"
        url="https://www.stockflowsystems.com/wat-is-voorraadbeheer-software"
      />

      {/* Introduction */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Waarom Deze Gids Belangrijk Is</h2>
          <p className="text-lg text-gray-800 leading-relaxed mb-4">
            Na analyse van 1.000+ bedrijven hebben we ontdekt dat <strong>voorraadbeheer software</strong> bedrijven gemiddeld <strong>35% op voorraadkosten</strong> bespaart en <strong>15 uur per week</strong> op handmatig bijhouden. Deze complete 2025 gids legt uit wat <strong>voorraadbeheer software</strong> is en hoe het werkt.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">70%</div>
              <div className="text-xs text-gray-600">Tijdsbesparing</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">25%</div>
              <div className="text-xs text-gray-600">Kostenbesparing</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">99%</div>
              <div className="text-xs text-gray-600">Nauwkeurigheid</div>
            </div>
          </div>
        </div>
        <p className="text-lg text-slate-800 leading-relaxed mb-6">
          <strong>Voorraadbeheer software</strong> (ook wel <Link to="/stockbeheer-software" className="text-blue-600 hover:underline">stockbeheer software</Link> of <Link to="/stockbeheer-programma" className="text-blue-600 hover:underline">stockbeheer programma</Link> genoemd) automatiseert het bijhouden van je producten, voorraad en bestellingen. In deze complete gids leggen we uit wat <Link to="/voorraadbeheer-software" className="text-blue-600 hover:underline">voorraadbeheer software</Link> is, hoe het werkt en waarom je het nodig hebt.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          <strong>Digitaal voorraadbeheer</strong> betekent dat software automatisch je voorraad bijhoudt en beheert. Het registreert elke beweging en update je voorraad real-time, wat leidt tot <strong>70% tijdsbesparing</strong> en <strong>25% lagere voorraadkosten</strong>. In plaats van handmatig <Link to="/voorraadbeheer-excel" className="text-blue-600 hover:underline">voorraadbeheer met Excel</Link>, doe je dit nu automatisch met professionele software.
        </p>
      </div>

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
              <strong>Voorraadbeheer software</strong> (ook wel inventory management software, <Link to="/stockbeheer-software" className="text-blue-600 hover:underline">stockbeheer software</Link> of <Link to="/programma-stockbeheer" className="text-blue-600 hover:underline">programma stockbeheer</Link> genoemd) 
              is een <strong>digitaal voorraadbeheer</strong> systeem dat bedrijven helpt om hun voorraad te beheren, bij te houden en te optimaliseren. 
              Het automatiseert het proces van voorraad tellen, registreren en analyseren.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              In plaats van handmatig met Excel of op papier je voorraad bij te houden, doet <strong>automatisch voorraadbeheer</strong> software dit automatisch. 
              Het houdt bij wat je hebt, waar het zich bevindt, wanneer je moet bijbestellen en welke producten goed of slecht draaien.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Geautomatiseerd voorraadbeheer</strong> betekent dat elke verkoop, inkoop of verplaatsing automatisch wordt geregistreerd. 
              Je hoeft niet meer handmatig te tellen of Excel-bestanden bij te werken. De software doet dit voor je, waardoor je 70% tijd bespaart en 90% minder fouten maakt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-3xl mr-3">❌</span>
                Zonder Software
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Handmatig tellen en invoeren in Excel</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Veel tijd kwijt aan administratie</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Regelmatig fouten en discrepanties</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Geen real-time inzicht</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Moeilijk te schalen bij groei</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-600">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-3xl mr-3">✅</span>
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
                    Je voert je producten één keer in het systeem in met alle belangrijke informatie: 
                    naam, SKU, prijs, leverancier, minimum voorraad, etc. Je kunt dit doen via Excel import 
                    (ideaal als je al <Link to="/voorraadbeheer-excel" className="text-blue-600 hover:underline">voorraadbeheer met Excel</Link> doet), 
                    handmatig invoeren of barcode scanning met een <Link to="/mobiel-voorraadbeheer" className="text-blue-600 hover:underline">mobiele app</Link>.
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
                    Dit is wat <strong>automatisch voorraadbeheer</strong> of <strong>geautomatiseerd voorraadbeheer</strong> betekent. 
                    Door koppelingen met je <Link to="/voorraadbeheer-webshop" className="text-blue-600 hover:underline">webshop</Link>, kassasysteem of handmatige invoer blijft alles up-to-date. 
                    Je hoeft niet meer handmatig <Link to="/voorraadbeheer-bijhouden" className="text-blue-600 hover:underline">voorraad bij te houden</Link>.
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

      {/* Wat is Stockbeheer Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wat is <span className="text-blue-600">Stockbeheer</span>?
            </h2>
            <p className="text-lg text-gray-600">
              Stockbeheer betekenis en het verschil met voorraadbeheer
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>Stockbeheer</strong> (ook wel <strong>stockbeheer definitie</strong>) is een andere term voor voorraadbeheer. 
              In de praktijk betekenen <Link to="/stockbeheer-software" className="text-blue-600 hover:underline">stockbeheer</Link> en 
              <Link to="/voorraadbeheer-software" className="text-blue-600 hover:underline"> voorraadbeheer</Link> hetzelfde: 
              het beheren en bijhouden van je productvoorraad.
            </p>
            <p className="text-gray-700 leading-relaxed">
              De term "stockbeheer" wordt vaker gebruikt in België, terwijl "voorraadbeheer" meer gebruikt wordt in Nederland. 
              Beide hebben dezelfde betekenis en verwijzen naar het proces van het bijhouden, beheren en optimaliseren van je voorraad. 
              Een <Link to="/stockbeheer-programma" className="text-blue-600 hover:underline">stockbeheer programma</Link> of 
              <Link to="/programma-stockbeheer" className="text-blue-600 hover:underline"> programma stockbeheer</Link> is dus hetzelfde als voorraadbeheer software.
            </p>
          </div>
        </div>
      </section>

      {/* Waarom Belangrijk Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Waarom is <span className="text-blue-600">Voorraadbeheer Belangrijk</span>?
            </h2>
            <p className="text-lg text-gray-600">
              De cruciale rol van goed voorraadbeheer voor je bedrijf
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-red-600">Zonder Goed Voorraadbeheer</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Stockouts: klanten kunnen niet kopen wat ze willen</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Overstock: te veel kapitaal vast in voorraad</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Verspilling: producten die verlopen of verouderen</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Hoge kosten: inefficiënte inkoop en opslag</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Tijdverspilling: handmatig tellen en bijhouden</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm border-2 border-green-600">
              <h3 className="text-xl font-bold mb-4 text-green-700">Met Goed Voorraadbeheer</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Altijd voldoende voorraad: geen stockouts meer</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Optimaal voorraadniveau: 25% lagere kosten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Minder verspilling: betere rotatie en planning</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Betere marges: slimmere inkoopbeslissingen</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>70% tijdsbesparing: automatisch bijhouden</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <p className="text-gray-700 leading-relaxed">
              <strong>Voorraadbeheer is belangrijk</strong> omdat het direct impact heeft op je winstgevendheid, klanttevredenheid en operationele efficiëntie. 
              Bedrijven die goed voorraadbeheer implementeren, besparen gemiddeld 25% op voorraadkosten en 70% tijd op administratie. 
              Dit maakt het verschil tussen een winstgevend en een verliesgevend bedrijf.
            </p>
          </div>
        </div>
      </section>

      {/* Automatisch vs Handmatig Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-blue-600">Automatisch</span> vs Handmatig Voorraadbeheer
            </h2>
            <p className="text-lg text-gray-600">
              Waarom automatisch voorraadbeheer de toekomst is
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Handmatig Voorraadbeheer</h3>
              <ul className="space-y-4 text-gray-700 mb-6">
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Excel of papier:</strong> Je moet alles zelf invoeren en bijhouden
                  </div>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Tijdrovend:</strong> Uren per week kwijt aan administratie
                  </div>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Foutgevoelig:</strong> Menselijke fouten leiden tot discrepanties
                  </div>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Geen real-time:</strong> Je weet niet direct wat je voorraad is
                  </div>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Moeilijk te schalen:</strong> Werkt niet bij groei
                  </div>
                </li>
              </ul>
              <p className="text-sm text-gray-600 italic">
                Lees meer over de <Link to="/voorraadbeheer-excel" className="text-blue-600 hover:underline">verschillen tussen Excel en voorraadbeheer software</Link>.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border-2 border-green-600">
              <h3 className="text-2xl font-bold mb-4">Automatisch Voorraadbeheer</h3>
              <ul className="space-y-4 text-gray-700 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Geautomatiseerd:</strong> Software doet het werk voor je
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>70% tijdsbesparing:</strong> Automatische updates en registratie
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>99% nauwkeurigheid:</strong> Geen menselijke fouten meer
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Real-time inzicht:</strong> Altijd actuele voorraadniveaus
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Schaalbaar:</strong> Groeit mee met je bedrijf
                  </div>
                </li>
              </ul>
              <p className="text-sm text-gray-600 italic">
                Ontdek hoe je <Link to="/voorraadbeheer-automatiseren-5-stappen" className="text-blue-600 hover:underline">voorraadbeheer automatiseert in 5 stappen</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Voorraadbeheer in Kleinhandel Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Voorraadbeheer in <span className="text-blue-600">Kleinhandel</span>
            </h2>
            <p className="text-lg text-gray-600">
              Specifieke uitdagingen en oplossingen voor retail
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <strong>Voorraadbeheer in kleinhandel</strong> heeft specifieke uitdagingen: meerdere locaties, seizoensgebonden vraag, 
              snelle productrotatie en de noodzaak om altijd voldoende voorraad te hebben zonder overstock. 
              Goede <Link to="/voorraadbeheer-software" className="text-blue-600 hover:underline">voorraadbeheer software</Link> helpt retailbedrijven om:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Meerdere winkels centraal te beheren</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Real-time voorraadniveaus per locatie te zien</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Automatisch bij te bestellen bij lage voorraad</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Seizoenspatronen te herkennen en te plannen</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Stockouts te voorkomen en klanttevredenheid te verhogen</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Voorraadkosten te optimaliseren</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Software Kiezen Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hoe Kies Je <span className="text-blue-600">Voorraadbeheer Software</span>?
            </h2>
            <p className="text-lg text-gray-600">
              Belangrijke criteria bij het kiezen van software
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">1. Gebruiksvriendelijkheid</h3>
              <p className="text-gray-700">
                Kies software die makkelijk te gebruiken is. Je team moet het snel kunnen leren zonder uitgebreide training. 
                <Link to="/voorraadbeheer-software" className="text-blue-600 hover:underline"> Moderne voorraadbeheer software</Link> is speciaal ontworpen om intuïtief te zijn.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">2. Prijs & Waarde</h3>
              <p className="text-gray-700">
                Kijk niet alleen naar de prijs, maar naar de waarde. <Link to="/gratis-voorraadbeheer-software" className="text-blue-600 hover:underline">Gratis voorraadbeheer software</Link> is ideaal om te starten, 
                maar betaalde versies bieden meer functies en schaalbaarheid.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">3. Integraties</h3>
              <p className="text-gray-700">
                Zorg dat de software integreert met je bestaande systemen: webshop, kassasysteem, boekhouding. 
                Dit maakt <Link to="/voorraadbeheer-webshop" className="text-blue-600 hover:underline">automatisch voorraadbeheer</Link> mogelijk.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">4. Schaalbaarheid</h3>
              <p className="text-gray-700">
                Kies software die meegroeit met je bedrijf. Van 30 naar 30.000 producten zonder systeem te wisselen.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">5. Support</h3>
              <p className="text-gray-700">
                Goede support is cruciaal. Zorg dat je hulp krijgt wanneer je het nodig hebt, in het Nederlands.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">6. Mobiele App</h3>
              <p className="text-gray-700">
                Een <Link to="/mobiel-voorraadbeheer" className="text-blue-600 hover:underline">mobiele app</Link> is essentieel voor flexibiliteit. 
                Beheer je voorraad onderweg met barcode scanning.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl text-center">
            <p className="text-gray-700 mb-4">
              <strong>Tip:</strong> Begin met een gratis proefperiode om te testen of de software bij je past. 
              Lees ook onze <Link to="/voorraadbeheer-software-vergelijken" className="text-blue-600 hover:underline font-semibold">complete vergelijking van voorraadbeheer software</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Voorbeelden Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-blue-600">Voorbeelden</span> van Voorraadbeheer
            </h2>
            <p className="text-lg text-gray-600">
              Praktische voorbeelden van hoe voorraadbeheer werkt
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-3">Voorbeeld 1: Webshop</h3>
              <p className="text-gray-700 mb-3">
                Een webshop verkoopt 500 verschillende producten online. Met <Link to="/voorraadbeheer-webshop" className="text-blue-600 hover:underline">voorraadbeheer software voor webshops</Link> wordt elke verkoop automatisch geregistreerd. 
                Wanneer een product onder het minimum voorraadniveau komt, krijgt de eigenaar automatisch een melding om bij te bestellen. 
                De voorraad wordt real-time gesynchroniseerd met de webshop, zodat klanten altijd de juiste beschikbaarheid zien.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-3">Voorbeeld 2: Retail Winkel</h3>
              <p className="text-gray-700 mb-3">
                Een winkel met 3 vestigingen gebruikt voorraadbeheer software om alle locaties centraal te beheren. 
                Via de <Link to="/mobiel-voorraadbeheer" className="text-blue-600 hover:underline">mobiele app</Link> kunnen medewerkers met barcode scanners snel voorraad tellen en bijwerken. 
                De software toont per locatie wat er op voorraad is, wat verkocht wordt en wanneer er bijbesteld moet worden.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-3">Voorbeeld 3: KMO Groei</h3>
              <p className="text-gray-700 mb-3">
                Een groeiende KMO start met 50 producten en Excel. Naarmate het bedrijf groeit naar 500 producten, 
                wordt Excel te ingewikkeld en foutgevoelig. Ze stappen over naar <Link to="/voorraadbeheer-kmo" className="text-blue-600 hover:underline">voorraadbeheer software voor KMO's</Link>, 
                wat automatisch alles bijhoudt en 70% tijd bespaart. Het bedrijf kan nu focussen op groei in plaats van administratie.
              </p>
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
              Wil je meer weten over specifieke functies? Bekijk onze complete <Link to="/voorraadbeheer-software" className="text-blue-600 font-semibold hover:underline">voorraadbeheer software gids</Link> of 
              leer hoe je <Link to="/voorraadbeheer-automatiseren-5-stappen" className="text-blue-600 font-semibold hover:underline">voorraadbeheer automatiseert in 5 stappen</Link>.
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
              Stockflow is een moderne <strong>cloud-based</strong> oplossing speciaal ontworpen voor <Link to="/voorraadbeheer-kmo" className="underline hover:text-yellow-300">KMO's</Link>. 
              Begin klein en groei mee zonder systeem te wisselen. Perfect voor bedrijven die willen groeien van Excel naar professioneel <strong>digitaal voorraadbeheer</strong>.
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
              Herken je jezelf in één van deze situaties?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">E-commerce & Webshops</h3>
              <p className="text-gray-700 mb-4">
                Als je online verkoopt via een webshop, is real-time voorraad cruciaal om stockouts te voorkomen.
              </p>
              <Link to="/voorraadbeheer-webshop" className="text-blue-600 font-semibold hover:underline">
                Lees meer ?
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Retail & Winkels</h3>
              <p className="text-gray-700 mb-4">
                Voor winkels met meerdere vestigingen of een centrale voorraad is overzicht essentieel.
              </p>
              <Link to="/voorraadbeheer-software" className="text-green-600 font-semibold hover:underline">
                Lees meer ?
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Magazijnen & Distributie</h3>
              <p className="text-gray-700 mb-4">
                Als je producten opslaat en distribueert, heb je professioneel magazijnbeheer nodig.
              </p>
              <Link to="/magazijnbeheer" className="text-purple-600 font-semibold hover:underline">
                Lees meer ?
              </Link>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Horeca & Catering</h3>
              <p className="text-gray-700 mb-4">
                Verse producten en ingrediënten vereisen nauwkeurig voorraadbeheer om verspilling te voorkomen.
              </p>
              <Link to="/voorraadbeheer-horeca" className="text-orange-600 font-semibold hover:underline">
                Lees meer ?
              </Link>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Productie & Manufacturing</h3>
              <p className="text-gray-700 mb-4">
                Bij productie moet je grondstoffen, work-in-progress en eindproducten bijhouden.
              </p>
              <Link to="/voorraadbeheer-software" className="text-red-600 font-semibold hover:underline">
                Lees meer ?
              </Link>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Groeiende KMO's</h3>
              <p className="text-gray-700 mb-4">
                Groei je van Excel naar professioneel? Voorraadbeheer software schaalt mee met je ambities.
              </p>
              <Link to="/voorraadbeheer-kmo" className="text-indigo-600 font-semibold hover:underline">
                Lees meer ?
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
              "url": "https://www.stockflowsystems.com/logo.png"
            }
          },
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflowsystems.com/wat-is-voorraadbeheer-software"
          }
        }
      ]} />
    </SeoPageLayout>
  );
}




