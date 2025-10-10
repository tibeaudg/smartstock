import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useStructuredData, createFAQStructuredData, createArticleStructuredData } from '@/hooks/useStructuredData';
import { Check, TrendingUp, Clock, Shield, Users, Zap, DollarSign, BarChart3 } from 'lucide-react';

export default function VoorraadbeheerKMO() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Waarom hebben KMO's specifieke voorraadbeheer software nodig?",
      answer: "KMO's hebben vaak beperkte resources en tijd. Voorraadbeheer software voor KMO's is ontworpen om snel te implementeren, betaalbaar te zijn en mee te groeien met je bedrijf. Het biedt krachtige functies zonder onnodige complexiteit die alleen grote bedrijven nodig hebben."
    },
    {
      question: "Wat kost voorraadbeheer software voor KMO's?",
      answer: "Stockflow biedt een volledig gratis versie voor KMO's tot 30 producten. Voor groeiende KMO's starten betaalde plannen vanaf €29 per maand. Dit maakt het toegankelijk voor bedrijven van elke grootte zonder grote initiële investering."
    },
    {
      question: "Hoe snel kan een KMO voorraadbeheer software implementeren?",
      answer: "De meeste KMO's kunnen binnen 1-2 dagen volledig operationeel zijn met voorraadbeheer software. Stockflow is speciaal ontworpen voor snelle implementatie zonder technische kennis. Je kunt direct starten zonder lange training of complexe setup."
    },
    {
      question: "Is voorraadbeheer software schaalbaar voor groeiende KMO's?",
      answer: "Ja, goede voorraadbeheer software groeit mee met je KMO. Je kunt starten met basis functies en geleidelijk uitbreiden met meer geavanceerde features zoals multi-locatie beheer, automatisering en integraties naarmate je bedrijf groeit."
    },
    {
      question: "Welke ROI kunnen KMO's verwachten van voorraadbeheer software?",
      answer: "KMO's zien gemiddeld 70% tijdsbesparing op voorraadtaken, 25% reductie in voorraadkosten en 15-20% omzetgroei door betere beschikbaarheid. De meeste KMO's verdienen hun investering binnen 3-6 maanden terug."
    }
  ];

  // Add structured data using the hook
  useStructuredData([
    createFAQStructuredData(faqData),
    createArticleStructuredData({
      headline: "Voorraadbeheer Software voor KMO's",
      description: "Betaalbare en gebruiksvriendelijke voorraadbeheer software speciaal voor KMO's en kleine ondernemingen. Start gratis en groei mee.",
      url: "https://www.stockflow.be/voorraadbeheer-kmo"
    })
  ]);

  const kmoFeatures = [
    {
      icon: DollarSign,
      title: "Betaalbaar & Transparant",
      description: "Begin gratis of kies een betaalbaar plan zonder verborgen kosten. Perfect voor KMO budgets.",
      color: "green"
    },
    {
      icon: Clock,
      title: "Snel te Implementeren",
      description: "Start binnen 1 dag. Geen lange implementatie of dure consultants nodig.",
      color: "blue"
    },
    {
      icon: Users,
      title: "Eenvoudig voor het Team",
      description: "Intuïtieve interface die iedereen kan gebruiken. Minimale training vereist.",
      color: "purple"
    },
    {
      icon: TrendingUp,
      title: "Groeit Mee",
      description: "Schaalbaar van 10 tot 10.000 producten. Groei zonder systeem te wisselen.",
      color: "orange"
    },
    {
      icon: Shield,
      title: "Betrouwbaar & Veilig",
      description: "Enterprise beveiliging ook voor kleine bedrijven. Je data is altijd veilig.",
      color: "red"
    },
    {
      icon: Zap,
      title: "Automatisering",
      description: "Automatische bestelmeldingen en voorraad updates besparen uren per week.",
      color: "yellow"
    }
  ];

  const kmoChallenges = [
    {
      challenge: "Beperkte tijd en resources",
      solution: "Automatiseer repetitieve taken en bespaar 70% tijd op voorraadbeheer"
    },
    {
      challenge: "Groeiende voorraad complexiteit",
      solution: "Schaalbare software die meegroeit zonder extra complexiteit"
    },
    {
      challenge: "Foutgevoelige handmatige processen",
      solution: "Elimineer 90% van de fouten met geautomatiseerd voorraadbeheer"
    },
    {
      challenge: "Beperkt budget",
      solution: "Begin gratis en upgrade alleen wanneer je het nodig hebt"
    },
    {
      challenge: "Geen technische expertise",
      solution: "Gebruiksvriendelijke software zonder IT-kennis vereist"
    },
    {
      challenge: "Voorraad over meerdere locaties",
      solution: "Centraal beheer van alle vestigingen in één systeem"
    }
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer Software voor KMO's">
      <SEO
        title="Voorraadbeheer Software voor KMO's | Betaalbaar & Schaalbaar | stockflow"
        description="Voorraadbeheer software speciaal voor KMO's en kleine ondernemingen. Start gratis, implementeer in 1 dag en bespaar 70% tijd. Perfect voor groeiende bedrijven."
        keywords="voorraadbeheer kmo, voorraadbeheer kleine onderneming, voorraadbeheer software kmo, kmo voorraadbeheer, stockbeheer kmo, voorraadbeheer mkb, voorraadbeheer voor kleine bedrijven, betaalbaar voorraadbeheer, voorraadbeheer starters"
        url="https://www.stockflow.be/voorraadbeheer-kmo"
        hreflang={[
          { lang: "nl", url: "https://www.stockflow.be/voorraadbeheer-kmo" },
          { lang: "en", url: "https://www.stockflow.be/inventory-management-sme" }
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Speciaal voor KMO's & Kleine Ondernemingen
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Voorraadbeheer Software voor <span className="text-yellow-300">KMO's</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Betaalbare en gebruiksvriendelijke <Link to="/voorraadbeheer-software" className="underline hover:text-yellow-300">voorraadbeheer software</Link> die perfect is afgestemd op de behoeften van KMO's. 
                Begin gratis, implementeer in 1 dag en bespaar direct tijd en geld.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition text-center"
                >
                  Start Gratis voor KMO's
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
                  Gratis tot 30 producten
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Setup in 1 dag
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Geen creditcard nodig
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Waarom 500+ KMO's kiezen voor stockflow</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-400 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">70% Tijdsbesparing</div>
                    <div className="text-blue-100 text-sm">Minder tijd aan administratie</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-400 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">25% Kostenbesparing</div>
                    <div className="text-blue-100 text-sm">Op voorraad gerelateerde kosten</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-400 rounded-full p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Direct Implementeren</div>
                    <div className="text-blue-100 text-sm">Start binnen 1-2 dagen</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why KMOs Need This Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Waarom hebben <span className="text-blue-600">KMO's</span> specifieke voorraadbeheer software nodig?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Als KMO heb je unieke uitdagingen. Je moet snel schakelen, met beperkte resources werken en toch professioneel blijven groeien. 
              Standaard voorraadbeheer software is vaak te complex of te duur. Stockflow is anders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kmoFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KMO Challenges Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Van <span className="text-red-600">Uitdaging</span> naar <span className="text-green-600">Oplossing</span>
            </h2>
            <p className="text-lg text-gray-600">
              Herken je deze uitdagingen? Ontdek hoe voorraadbeheer software voor KMO's deze problemen oplost.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kmoChallenges.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-4">
                  <div className="text-red-600 font-semibold mb-2">❌ {item.challenge}</div>
                </div>
                <div>
                  <div className="text-green-600 font-semibold mb-2">✅ Oplossing:</div>
                  <p className="text-gray-700 text-sm">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Different KMO Types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Voorraadbeheer voor <span className="text-blue-600">Jouw Type KMO</span>
            </h2>
            <p className="text-lg text-gray-600">
              Of je nu een webshop runt, een magazijn beheert of producten verkoopt - we hebben de perfecte oplossing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Webshop KMO's</h3>
              <p className="text-gray-700 mb-4">
                Als KMO met een <Link to="/voorraadbeheer-webshop" className="text-blue-600 font-semibold hover:underline">webshop</Link> is 
                real-time voorraad synchronisatie cruciaal. Voorkom uitverkochte producten en teleurgestelde klanten met automatische updates.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Real-time synchronisatie met je webshop platform</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Automatische voorraad updates bij elke verkoop</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Multi-channel voorraadbeheer</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Magazijn KMO's</h3>
              <p className="text-gray-700 mb-4">
                Voor KMO's met een of meerdere magazijnen is efficiënt <Link to="/magazijnbeheer" className="text-purple-600 font-semibold hover:underline">magazijnbeheer</Link> essentieel. 
                Optimaliseer je magazijnoperaties en bespaar ruimte en tijd.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Multi-locatie voorraad beheer</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Barcode scanning voor snelle verwerking</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Magazijn locatie tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Retail KMO's</h3>
              <p className="text-gray-700 mb-4">
                Retail KMO's hebben snelle, betrouwbare voorraad informatie nodig. Koppel je kassa systeem en houd real-time inzicht in je voorraad.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">POS integratie voor directe updates</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Meerdere winkels centraal beheren</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Seizoens voorraad planning</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Groeiende KMO's</h3>
              <p className="text-gray-700 mb-4">
                Groei je van Excel naar professionele software? Door je <Link to="/voorraadbeheer-automatiseren" className="text-orange-600 font-semibold hover:underline">voorraadbeheer te automatiseren</Link> win 
                je tijd voor groei in plaats van administratie.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Eenvoudige data import vanuit <Link to="/voorraadbeheer-excel" className="text-orange-600 hover:underline">Excel</Link></span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Schaalbaar zonder systeem te wisselen</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Automatische processen vanaf dag 1</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Van Start tot <span className="text-blue-600">Succes</span> in 3 Stappen
            </h2>
            <p className="text-lg text-gray-600">
              Implementeer voorraadbeheer software als KMO zonder stress of lange implementatietijd
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Dag 1: Setup</h3>
              <p className="text-gray-600 mb-4">
                Maak een gratis account, importeer je producten en configureer basis instellingen. Duurt minder dan 2 uur.
              </p>
              <div className="text-sm text-gray-500">⏱️ 1-2 uur</div>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Dag 2-3: Training</h3>
              <p className="text-gray-600 mb-4">
                Train je team met onze intuïtieve interface. Video tutorials en live support beschikbaar.
              </p>
              <div className="text-sm text-gray-500">⏱️ 2-4 uur</div>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Dag 4+: Live!</h3>
              <p className="text-gray-600 mb-4">
                Start met live voorraadbeheer. Koppel integraties en automatiseer meer naarmate je comfortabel bent.
              </p>
              <div className="text-sm text-gray-500">⏱️ Continue verbetering</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wat Levert het <span className="text-green-600">Op</span> voor je KMO?
            </h2>
            <p className="text-lg text-gray-600">
              Concrete resultaten die KMO's behalen met voorraadbeheer software
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">70%</div>
              <div className="text-gray-700 font-semibold mb-2">Tijdsbesparing</div>
              <p className="text-sm text-gray-600">Op voorraad administratie en tellingen</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
              <div className="text-gray-700 font-semibold mb-2">Kostenbesparing</div>
              <p className="text-sm text-gray-600">Minder overstock en dead stock</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">15-20%</div>
              <div className="text-gray-700 font-semibold mb-2">Omzetgroei</div>
              <p className="text-sm text-gray-600">Door betere product beschikbaarheid</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">3-6</div>
              <div className="text-gray-700 font-semibold mb-2">Maanden ROI</div>
              <p className="text-sm text-gray-600">Verdien investering snel terug</p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Reken het Zelf Uit</h3>
                <p className="mb-4">
                  Een gemiddelde KMO bespaart <strong>10-15 uur per week</strong> op voorraadbeheer taken. 
                  Bij een uurtarief van €50 is dat <strong>€2.000-3.000 per maand</strong> aan besparingen.
                </p>
                <p className="text-blue-100 text-sm">
                  De gratis versie kost €0. Premium plannen starten vanaf €29/maand. 
                  De ROI spreekt voor zich.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">€2.500</div>
                  <div className="text-blue-100 mb-4">Gemiddelde maandelijkse besparing</div>
                  <div className="text-sm opacity-90">
                    Gebaseerd op 12.5 uur tijdsbesparing × €50/uur + 
                    €1.000 voorraadkosten reductie
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing for KMOs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transparante <span className="text-blue-600">Prijzen</span> voor KMO's
            </h2>
            <p className="text-lg text-gray-600">
              Geen verborgen kosten, geen verrassingen. Start gratis en upgrade wanneer je groeit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">Gratis</div>
                <div className="text-gray-600 text-sm">Voor altijd</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Tot 30 producten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">1 locatie</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Basis rapportages</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
              <Link
                to="/auth"
                className="block w-full bg-gray-100 text-center py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Start Gratis
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xl border-4 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Populair
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Growth</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">€29</div>
                <div className="text-gray-600 text-sm">per maand</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Onbeperkt producten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">5 locaties</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Geavanceerde rapportages</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Prioriteit support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">API toegang</span>
                </li>
              </ul>
              <Link
                to="/auth"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start 14 Dagen Gratis
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">Custom</div>
                <div className="text-gray-600 text-sm">Op maat</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Alles van Growth</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Onbeperkt locaties</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Dedicated support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm">Custom integraties</span>
                </li>
              </ul>
              <Link
                to="/contact"
                className="block w-full bg-gray-100 text-center py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Neem Contact Op
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klaar om Je KMO naar het Volgende Niveau te Tillen?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij 500+ KMO's die al profiteren van professioneel voorraadbeheer. 
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
              Setup in 1 dag
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
              Veelgestelde vragen over voorraadbeheer software voor KMO's
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
          <h2 className="text-3xl font-bold mb-8 text-center">Gerelateerde Artikelen</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer Software Overzicht
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete gids over professionele voorraadbeheer software en functies.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-automatiseren" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer Automatiseren
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Bespaar 70% tijd door je voorraadbeheer te automatiseren.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-excel" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Van Excel naar Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Waarom Excel beperkt is en hoe je eenvoudig overschakelt.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-webshop" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Voorraadbeheer voor Webshops
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Specialiseer je e-commerce voorraad met real-time sync.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/magazijnbeheer" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Magazijnbeheer Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Optimaliseer je magazijnoperaties en multi-locatie beheer.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/inventory-management-software" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  English version of our inventory management solutions.
                </p>
                <div className="text-blue-600 text-sm font-semibold">Read more →</div>
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
            Voorraadbeheer software speciaal ontwikkeld voor Vlaamse en Nederlandse KMO's. 
            Betaalbaar, gebruiksvriendelijk en schaalbaar.
          </p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
              Voorraadbeheer software voor KMO's.
            </p>
          </div>
        </div>
      </footer>
    </SeoPageLayout>
  );
}

