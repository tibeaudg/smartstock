import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, TrendingUp, Clock, Shield, Users, Zap, DollarSign, BarChart3, Package, Smartphone } from 'lucide-react';
import { RelatedArticles } from '@/components/seo/RelatedArticles';
import { TopicClusterNav } from '@/components/seo/TopicClusterNav';
import { dutchMainCluster, getRelatedPages } from '@/config/topicClusters';

import { StructuredData } from '../../components/StructuredData';
export default function VoorraadbeheerSoftware() {
  usePageRefresh();
  
  // Get related pages from topic cluster
  const relatedPages = getRelatedPages('/voorraadbeheer-software', 6);
  
  const faqData = [
    {
      question: "Wat is voorraadbeheer software?",
      answer: "Voorraadbeheer software is een digitaal systeem dat helpt bij het beheren van je voorraad. Het houdt bij hoeveel producten je hebt, wanneer je moet bestellen en helpt bij het optimaliseren van je magazijnoperaties. Het is essentieel voor moderne bedrijven die professioneel willen groeien."
    },
    {
      question: "Is er gratis voorraadbeheer software beschikbaar?",
      answer: "Ja, stockflow biedt gratis voorraadbeheer software voor kleine bedrijven. Je kunt tot 30 producten gratis beheren zonder verborgen kosten of verplichtingen. Perfect om mee te starten en te groeien."
    },
    {
      question: "Welke voorraadbeheer software is het beste voor kleine bedrijven?",
      answer: "Voor kleine bedrijven en KMO's is stockflow ideaal omdat het gebruiksvriendelijk is, betaalbaar en schaalbaar. Je kunt gratis starten en meegroeien met je bedrijf zonder complexe implementaties. Speciaal ontworpen voor de Nederlandse en Vlaamse markt."
    },
    {
      question: "Hoe werkt voorraadbeheer software?",
      answer: "Voorraadbeheer software werkt door je producten digitaal bij te houden, automatische meldingen te geven bij lage voorraad en real-time inzicht te bieden in je voorraadniveaus en verkopen. Het integreert met je bestaande systemen zoals webshops en boekhoudsoftware."
    },
    {
      question: "Kan ik voorraadbeheer software integreren met mijn bestaande systemen?",
      answer: "Ja, moderne voorraadbeheer software zoals stockflow kan vaak geïntegreerd worden met boekhoudsoftware, webshops en andere bedrijfssystemen voor een naadloze workflow. Dit bespaart tijd en voorkomt dubbele invoer."
    },
    {
      question: "Wat kost goede voorraadbeheer software?",
      answer: "De kosten variëren. Stockflow biedt een volledig gratis versie voor tot 30 producten. Premium plannen starten vanaf €29 per maand voor meer geavanceerde functies en onbeperkt producten. Veel goedkoper en effectiever dan blijven werken met Excel."
    },
    {
      question: "Is voorraadbeheer software geschikt voor mijn bedrijfstype?",
      answer: "Voorraadbeheer software is geschikt voor vrijwel elk bedrijf met fysieke producten: webshops, retail, wholesale, horeca, productie en meer. Of je nu 10 of 10.000 producten hebt, moderne software schaalt mee met je behoeften."
    },
    {
      question: "Hoe lang duurt het om voorraadbeheer software te implementeren?",
      answer: "Met gebruiksvriendelijke software zoals stockflow kun je binnen 1-2 dagen volledig operationeel zijn. Je importeert je producten, configureert basis instellingen en traint je team. Geen lange implementatietrajecten of dure consultants nodig."
    },
    {
      question: "Wat is het verschil tussen voorraadbeheer en magazijnbeheer software?",
      answer: "Voorraadbeheer richt zich op 'wat en hoeveel' je hebt, terwijl magazijnbeheer ook focust op 'waar' producten zijn in je warehouse. Moderne software zoals stockflow combineert beide functies voor complete controle."
    },
    {
      question: "Kan ik automatisch voorraad laten bestellen?",
      answer: "Ja, goede voorraadbeheer software kan je waarschuwen bij lage voorraad en zelfs automatisch bestelsuggesties doen. Dit voorkomt dat je producten uitverkocht raakt en optimaliseert je voorraadniveaus."
    }
  ];

  const keyFeatures = [
    {
      icon: BarChart3,
      title: "Real-time Voorraadinzicht",
      description: "Bekijk altijd je actuele voorraadniveaus en krijg direct inzicht in welke producten je moet bestellen."
    },
    {
      icon: Zap,
      title: "Automatische Bestelmeldingen",
      description: "Krijg automatisch een melding wanneer je voorraad onder het minimum niveau komt."
    },
    {
      icon: TrendingUp,
      title: "Geavanceerde Rapportage",
      description: "Analyseer je voorraadprestaties met gedetailleerde rapporten en inzichten."
    },
    {
      icon: Smartphone,
      title: "Barcode Scanning",
      description: "Scan barcodes met je smartphone of tablet voor snelle en nauwkeurige voorraadupdates."
    },
    {
      icon: Package,
      title: "Multi-Locatie Support",
      description: "Beheer voorraad op meerdere locaties vanuit één centrale software."
    },
    {
      icon: Users,
      title: "Team Samenwerking",
      description: "Werk samen met je team met verschillende gebruikersrollen en permissies."
    }
  ];

  const industryUseCases = [
    {
      title: "KMO's & Kleine Bedrijven",
      description: "Betaalbare en schaalbare oplossingen",
      link: "/voorraadbeheer-kmo",
      benefits: ["Start gratis", "Groei mee", "Geen complexiteit"]
    },
    {
      title: "Webshops & E-commerce",
      description: "Real-time synchronisatie met je online winkel",
      link: "/voorraadbeheer-webshop",
      benefits: ["Multi-channel", "Automatische sync", "Prevent stockouts"]
    },
    {
      title: "Magazijnen & Warehouses",
      description: "Optimaliseer je warehouse operaties",
      link: "/magazijnbeheer",
      benefits: ["Locatie tracking", "Picking workflows", "Shipping integratie"]
    },
    {
      title: "Retail & Winkels",
      description: "POS integratie en multi-locatie beheer",
      link: "/voorraadbeheer-software",
      benefits: ["Kassa koppeling", "Meerdere winkels", "Live updates"]
    }
  ];

  const painPoints = [
    {
      pain: "Excel wordt te ingewikkeld en foutgevoelig",
      solution: "Overstap naar professionele software die automatisch werkt"
    },
    {
      pain: "Geen real-time inzicht in voorraadniveaus",
      solution: "Live dashboard met actuele voorraad op alle locaties"
    },
    {
      pain: "Te veel tijd kwijt aan handmatig tellen",
      solution: "Automatische tracking met barcode scanning"
    },
    {
      pain: "Producten lopen onverwacht uit voorraad",
      solution: "Automatische bestelmeldingen en safety stock alerts"
    },
    {
      pain: "Te veel voorraad bindt kapitaal",
      solution: "Data-driven inkoopbeslissingen en voorraad optimalisatie"
    },
    {
      pain: "Geen overzicht over meerdere locaties",
      solution: "Centraal beheer van alle vestigingen in één systeem"
    }
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer Software voor KMO's">
      <SEO
        title="Voorraadbeheer Software | Gratis Starten | Professioneel & Gebruiksvriendelijk | stockflow"
        description="Complete voorraadbeheer software voor moderne bedrijven. Van KMO tot webshop - beheer je voorraad professioneel. Start gratis, geen creditcard nodig. 500+ tevreden gebruikers."
        keywords="voorraadbeheer software, gratis voorraadbeheer, stockbeheer software, voorraadbeheer programma, magazijnbeheer software, inventarisatie software, voorraadbeheer app, stockbeheer app, stockflow, gratis stockbeheer, KMO software, kleine onderneming software, voorraad software, inventory software"
        url="https://www.stockflow.be/voorraadbeheer-software"
        locale="nl"
        alternateLanguages={[
          { lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-software' },
          { lang: 'en-US', url: 'https://www.stockflow.be/inventory-management-software' }
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                #1 Voorraadbeheer Software in België & Nederland
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Voorraadbeheer Software die <span className="text-yellow-300">Echt Werkt</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Van kleine ondernemer tot groeiende webshop - beheer je voorraad professioneel met software 
                die is ontworpen voor <strong>jouw</strong> succes. Start gratis en ervaar het verschil.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition text-center"
                >
                  Start Gratis Nu
                </Link>
                <Link
                  to="/demo"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition text-center"
                >
                  Bekijk Demo
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Geen creditcard nodig
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Setup in 5 minuten
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  500+ tevreden gebruikers
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Waarom Stockflow?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-400 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Gratis Starten</div>
                    <div className="text-blue-100 text-sm">Tot 30 producten, geen verborgen kosten</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-400 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Super Gebruiksvriendelijk</div>
                    <div className="text-blue-100 text-sm">Je bent binnen 1 dag operationeel</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-400 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Groeit Mee</div>
                    <div className="text-blue-100 text-sm">Van 30 tot 10.000 producten zonder te switchen</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Voorraadbeheer Software Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Wat is Voorraadbeheer Software?
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Voorraadbeheer software is een digitaal systeem dat je helpt om je voorraad efficiënt te beheren. 
              In plaats van handmatig bijhouden in Excel of op papier, krijg je met professionele software 
              real-time inzicht in je voorraadniveaus, automatische bestelmeldingen en geavanceerde analyses.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Voor moderne bedrijven - of je nu een <Link to="/voorraadbeheer-kmo" className="text-blue-600 font-semibold hover:underline">KMO</Link> runt, 
              een <Link to="/voorraadbeheer-webshop" className="text-blue-600 font-semibold hover:underline">webshop</Link> beheert, 
              of een <Link to="/magazijnbeheer" className="text-blue-600 font-semibold hover:underline">magazijn</Link> optimaliseert - 
              is voorraadbeheer software niet meer weg te denken. Het bespaart tijd, voorkomt fouten en helpt je groeien.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Veel bedrijven beginnen met <Link to="/voorraadbeheer-excel" className="text-blue-600 font-semibold hover:underline">voorraadbeheer in Excel</Link>, 
              maar al snel blijkt dat handmatig beheer te tijdrovend en foutgevoelig is. 
              Door je <Link to="/voorraadbeheer-automatiseren" className="text-blue-600 font-semibold hover:underline">voorraadbeheer te automatiseren</Link> met 
              professionele software, win je niet alleen tijd maar verhoog je ook de nauwkeurigheid en winstgevendheid van je bedrijf.
            </p>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Herken je Deze <span className="text-red-600">Uitdagingen</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Waarom blijven werken met oude methodes als er betere oplossingen zijn?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {painPoints.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="mb-4">
                  <div className="text-red-600 font-semibold mb-2 text-sm">❌ Probleem</div>
                  <p className="text-gray-800 font-medium">{item.pain}</p>
                </div>
                <div>
                  <div className="text-green-600 font-semibold mb-2 text-sm">✅ Oplossing</div>
                  <p className="text-gray-700 text-sm">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-blue-600">Krachtige Functies</span> voor Modern Voorraadbeheer
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Alle tools die je nodig hebt om je voorraad professioneel te beheren
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Use Cases */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Voorraadbeheer Software voor <span className="text-blue-600">Elk Bedrijfstype</span>
            </h2>
            <p className="text-lg text-gray-600">
              Of je nu een KMO, webshop, magazijn of retail bedrijf runt - we hebben de perfecte oplossing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="md:col-span-2 grid md:grid-cols-2 gap-8">
              {industryUseCases.map((useCase, index) => (
                <Link 
                  key={index} 
                  to={useCase.link}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition group"
                >
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{useCase.description}</p>
                  <div className="space-y-2">
                    {useCase.benefits.map((benefit, bIndex) => (
                      <div key={bIndex} className="flex items-center text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600 mr-2" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-blue-600 font-semibold text-sm group-hover:underline">
                    Lees meer →
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Topic Cluster Navigation - Sidebar */}
            <div className="lg:block hidden">
              <TopicClusterNav 
                cluster={dutchMainCluster} 
                currentPath="/voorraadbeheer-software"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Excel vs Software Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Voorraadbeheer in <span className="text-red-600">Excel</span> vs <span className="text-green-600">Software</span>
            </h2>
            <p className="text-lg text-gray-600">
              Veel bedrijven beginnen met Excel, maar hier zijn de beperkingen
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-red-900">Voorraadbeheer in Excel</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-700">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Handmatige updates, geen real-time data</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Geen automatische meldingen</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Foutgevoelig bij handmatige invoer</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Moeilijk samenwerken met team</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Geen barcode scanning</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Beperkte rapportage mogelijkheden</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border-2 border-green-600">
              <h3 className="text-2xl font-bold mb-6 text-green-900">Voorraadbeheer Software</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Real-time updates</strong> automatisch</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Automatische bestelmeldingen</strong></span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>99.9% nauwkeurig</strong> met barcode scanning</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Team samenwerking</strong> ingebouwd</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Mobiele barcode scanner</strong> app</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Geavanceerde analytics</strong> en rapporten</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/voorraadbeheer-excel"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Lees Volledige Vergelijking →
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wat Levert Voorraadbeheer Software Op?
            </h2>
            <p className="text-xl opacity-90">
              Concrete besparingen en resultaten die bedrijven behalen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl text-center">
              <Clock className="w-12 h-12 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">70%</div>
              <div className="text-lg">Tijdsbesparing</div>
              <div className="text-sm opacity-75 mt-2">Op voorraad administratie</div>
            </div>

            <div className="bg-white/10 backdrop-blur p-6 rounded-xl text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-lg">Kostenbesparing</div>
              <div className="text-sm opacity-75 mt-2">Minder overstock & dead stock</div>
            </div>

            <div className="bg-white/10 backdrop-blur p-6 rounded-xl text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">15-20%</div>
              <div className="text-lg">Omzetgroei</div>
              <div className="text-sm opacity-75 mt-2">Betere beschikbaarheid</div>
            </div>

            <div className="bg-white/10 backdrop-blur p-6 rounded-xl text-center">
              <Shield className="w-12 h-12 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">90%</div>
              <div className="text-lg">Minder Fouten</div>
              <div className="text-sm opacity-75 mt-2">Door automatisering</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur p-8 rounded-xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">Rekenvoorbeeld</h3>
            <p className="text-lg mb-4">
              Een gemiddeld bedrijf bespaart <strong>10-15 uur per week</strong> op voorraadtaken. 
              Bij een uurtarief van €50 is dat <strong>€2.000-3.000 per maand</strong>.
            </p>
            <p className="text-lg">
              Daarnaast bespaar je <strong>€1.000-2.000 per maand</strong> door betere voorraad optimalisatie 
              (minder overstock, minder stockouts).
            </p>
            <div className="mt-6 p-4 bg-yellow-400/20 rounded-lg text-center">
              <div className="text-3xl font-bold mb-2">€3.000 - €5.000</div>
              <div>Gemiddelde maandelijkse besparing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hoe Implementeer je Voorraadbeheer Software?
            </h2>
            <p className="text-lg text-gray-600">
              In 3 simpele stappen ben je operationeel
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Setup & Configuratie</h3>
              <p className="text-gray-600 mb-4">
                Maak een gratis account, importeer je producten en configureer basis instellingen. 
                Je data vanuit <Link to="/voorraadbeheer-excel" className="text-blue-600 hover:underline">Excel</Link> is 
                eenvoudig te importeren.
              </p>
              <div className="text-sm text-gray-500">⏱️ 1-2 uur</div>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Training & Integratie</h3>
              <p className="text-gray-600 mb-4">
                Train je team (super gebruiksvriendelijk!) en koppel eventuele integraties zoals webshop of boekhouding. 
                Leer hoe je <Link to="/voorraadbeheer-automatiseren" className="text-blue-600 hover:underline">processen automatiseert</Link>.
              </p>
              <div className="text-sm text-gray-500">⏱️ 2-4 uur</div>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Live Gaan!</h3>
              <p className="text-gray-600 mb-4">
                Start met live voorraadbeheer en ervaar direct de voordelen. Blijf optimaliseren en uitbreiden 
                naar meer geavanceerde features naarmate je groeit.
              </p>
              <div className="text-sm text-gray-500">⏱️ Vanaf dag 1 productief</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-blue-600">Voordelen</span> van Professionele Voorraadbeheer Software
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Tijdbesparing</h3>
              <p className="text-gray-700">
                Bespaar tot 70% tijd op voorraadbeheer door automatisering en real-time inzicht. 
                Geen handmatige tellingen meer nodig, geen dubbele invoer in verschillende systemen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Kostenreductie</h3>
              <p className="text-gray-700">
                Voorkom overstock en tekorten door betere planning. Dit kan je tot 25% besparen op 
                voorraadkosten. Minder kapitaal vast in voorraad betekent betere cashflow.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Foutreductie</h3>
              <p className="text-gray-700">
                Elimineer menselijke fouten door geautomatiseerde processen en real-time synchronisatie 
                tussen alle systemen. Barcode scanning geeft 99.9% nauwkeurigheid.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Schaalbaarheid</h3>
              <p className="text-gray-700">
                Groei mee met je bedrijf. Van 30 producten tot duizenden - onze voorraadbeheer software 
                schaalt automatisch mee. Geen systeem wisseling nodig bij groei.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klaar om te Starten met Professioneel Voorraadbeheer?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij 500+ bedrijven die al profiteren van stockflow. 
            Start gratis en ervaar direct het verschil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
            >
              Start Gratis Account
            </Link>
            <Link
              to="/demo"
              className="border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition"
            >
              Bekijk Demo
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Geen creditcard vereist
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Direct toegang
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Nederlandse support
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Veelgestelde Vragen</h2>
            <p className="text-lg text-gray-600">
              Alles wat je moet weten over voorraadbeheer software
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Ontdek Meer over Voorraadbeheer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-kmo" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer voor KMO's
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Betaalbare en schaalbare oplossingen speciaal voor kleine bedrijven en KMO's.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-webshop" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer voor Webshops
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Real-time synchronisatie en multi-channel voorraad voor e-commerce bedrijven.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/magazijnbeheer" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Magazijnbeheer Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Optimaliseer je warehouse operaties met picking, packing en shipping integratie.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-excel" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Van Excel naar Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Ontdek waarom Excel beperkt is en hoe je eenvoudig overschakelt naar software.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-automatiseren" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer Automatiseren
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete gids om je voorraadbeheer te automatiseren en 70% tijd te besparen.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/inventory-management-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  English version - professional inventory management for growing businesses.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      <RelatedArticles 
        articles={relatedPages}
        title="Ontdek Meer over Voorraadbeheer"
        language="nl"
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/logo.png"
            alt="stockflow"
            className="h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            De beste gratis voorraadbeheer software voor KMO's, webshops en groeiende bedrijven. 
            Eenvoudig, betrouwbaar en schaalbaar.
          </p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
              Voorraadbeheer software voor moderne bedrijven.
            </p>
          </div>
        </div>
      </footer>

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

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {"@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "stockflow Voorraadbeheer Software",
                "description": "Complete voorraadbeheer software voor moderne bedrijven. Van KMO tot webshop - beheer je voorraad professioneel.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web, iOS, Android",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "EUR"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "stockflow",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.stockflow.be/logo.png"
                  }
                },
                "url": "https://www.stockflow.be/voorraadbeheer-software"
        },
        {"@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.stockflow.be"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Voorraadbeheer Software",
                    "item": "https://www.stockflow.be/voorraadbeheer-software"
                  }
                ]
              }
        ]} />
    </SeoPageLayout>
  );
}
