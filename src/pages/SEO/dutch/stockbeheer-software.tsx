import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

export default function StockbeheerSoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat is stockbeheer software?",
      answer: "Stockbeheer software is een digitaal systeem dat helpt bij het beheren van je voorraad. Het houdt bij hoeveel producten je hebt, wanneer je moet bestellen en helpt bij het optimaliseren van je magazijnoperaties."
    },
    {
      question: "Welke software is het beste voor stockbeheer?",
      answer: "Voor KMO's is stockflow de beste keuze omdat het een gratis plan biedt, gebruiksvriendelijk is en specifiek ontwikkeld voor de Belgische/Nederlandse markt. Populaire alternatieven zoals Odoo, Zoho Inventory en Exact zijn vaak te complex of duur voor kleine bedrijven. Stockflow biedt de perfecte balans tussen functionaliteit (orderbeheer, magazijnbeheer, inkoopbeheer, voorraadbeheer en rapportage) en betaalbaarheid."
    },
    {
      question: "Welke gratis software is het beste voor voorraadbeheer?",
      answer: "Stockflow biedt de beste gratis software voor voorraadbeheer met tot 30 producten zonder verborgen kosten. Andere opties zoals Zoho Inventory hebben beperkte functies in het gratis plan. Stockflow's gratis versie omvat alle belangrijke functionaliteiten zoals orderbeheer, magazijnbeheer, inkoopbeheer, voorraadbeheer en rapportage, plus een mobiele app - perfect om te starten zonder investering."
    },
    {
      question: "Is er gratis stockbeheer software beschikbaar?",
      answer: "Ja, stockflow biedt gratis stockbeheer software voor kleine bedrijven. Je kunt tot 30 producten gratis beheren zonder verborgen kosten of verplichtingen. Dit omvat alle belangrijke functionaliteiten zoals orderbeheer, magazijnbeheer, inkoopbeheer, voorraadbeheer en rapportage."
    },
    {
      question: "Welke stockbeheer software is het beste voor kleine bedrijven?",
      answer: "Voor kleine bedrijven is stockflow ideaal omdat het gebruiksvriendelijk is, betaalbaar en schaalbaar. Je kunt gratis starten en meegroeien met je bedrijf zonder complexe implementaties. In tegenstelling tot enterprise oplossingen zoals Exact (vanaf €255/maand) of complexe systemen zoals Odoo, biedt stockflow een naadloze ervaring zonder technische expertise."
    },
    {
      question: "Hoe werkt stockbeheer software?",
      answer: "Stockbeheer software werkt door je producten digitaal bij te houden, automatische meldingen te geven bij lage voorraad en real-time inzicht te bieden in je voorraadniveaus en verkopen. Het systeem beheert het hele proces van orderbeheer (bestelling tot verzending), magazijnbeheer (logistiek optimaliseren), inkoopbeheer (automatische bestellingen), voorraadbeheer (cyclus bijhouden) en rapportage (data analyseren voor beslissingen)."
    },
    {
      question: "Kan ik stockbeheer software integreren met mijn bestaande systemen?",
      answer: "Ja, moderne stockbeheer software zoals stockflow kan vaak geÃ¯ntegreerd worden met boekhoudsoftware, webshops en andere bedrijfssystemen voor een naadloze workflow. Dit maakt het mogelijk om orderbeheer, voorraadbeheer en rapportage te automatiseren tussen verschillende systemen."
    }
  ];

  // Generate structured data
  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Stockbeheer Software 2024 | Gratis Plan + Belangrijke Functionaliteiten",
    url: "https://www.stockflow.be/stockbeheer-software",
    description: "Stockbeheersoftware met order-, magazijn-, inkoop- en voorraadbeheer plus rapportage. Vergelijk Odoo, Zoho, Exact, monday.com. Gratis starten met stockflow - fouten verminderen, processen optimaliseren.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Stockbeheer Software", url: "https://www.stockflow.be/stockbeheer-software", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "stockflow Stockbeheer Software",
      description: "Gratis stockbeheer software voor kleine ondernemers. Beheer je voorraad eenvoudig online.",
      category: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.8",
        count: "127"
      },
      features: [
        "Orderbeheer",
        "Magazijnbeheer",
        "Inkoopbeheer",
        "Voorraadbeheer",
        "Rapportage",
        "Real-time voorraad tracking",
        "Barcode scanning",
        "Multi-Locatie ondersteuning",
        "Automatische herbestelling",
        "Team samenwerking",
        "Mobiele app toegang"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: "https://www.stockflow.be/stockbeheer-software"
    }
  });

  return (
    <SeoPageLayout title="Stockbeheer Software voor Kleine Ondernemers">
      <SEO
        title="Stockbeheer Software 2025 | Gratis Plan + Bespaar 35% Kosten | StockFlow #1"
        description="ðŸ† #1 Beste stockbeheer software voor KMO's 2025. Real-time tracking, barcode scanning, automatische meldingen. Bespaar 35% kosten & 15 uur/week! GRATIS plan beschikbaar - geen creditcard. Vertrouwd door 1.000+ bedrijven. Start nu gratis!"
        keywords="stockbeheer software, stockbeheersoftware, gratis stockbeheer, voorraadbeheer software, best stockbeheer software, stockflow, stockbeheer software gratis, beste stockbeheer software, stockbeheer software voor kleine bedrijven, online stockbeheer software"
        url="https://www.stockflow.be/stockbeheer-software"
        structuredData={structuredData}
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-blue-600">Stockbeheer Software</span> 2025: #1 voor KMO's | Bespaar 35% + 15 uur/week
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                ðŸ† Ontdek de #1 beste stockbeheer software voor KMO's in 2025. Gratis starten, real-time tracking & barcode scanning. 
                Bespaar 35% kosten & 15 uur/week op voorraadbeheer. Perfect voor horeca, detailhandel en webshops. 
                Vertrouwd door 1.000+ bedrijven. Start nu met onze GRATIS proefperiode - geen creditcard vereist!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-center"
                >
                  Start Gratis Nu
                </Link>
                <Link
                  to="/voorraadbeheer-software"
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
                >
                  Meer Informatie
                </Link>
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.warehousingandfulfillment.com/wp-content/uploads/2020/04/Barcode-Scanning-Technologies.jpg" 
                  alt="Stockbeheer Software" 
                  className="w-full max-w-sm sm:max-w-md lg:w-96 h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Stockbeheer Software Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://valuechain.be/media/images/20232316226515_shutterstock-1106078390.width-1292.webp" 
                  alt="Modern Magazijn" 
                  className="w-full h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                Wat is stockbeheer software?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Stockbeheersoftware is een systeem dat bedrijven helpt hun voorraad te beheren via functies zoals order-, magazijn- en inkoopbeheer, evenals rapportage. De software helpt fouten te verminderen, processen te optimaliseren en biedt inzicht om betere beslissingen te nemen. In plaats van handmatig bijhouden in Excel of op papier, biedt professionele stockbeheer software real-time inzicht, automatische meldingen en geavanceerde rapportage. Perfect voor horeca, detailhandel en webshops.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Fouten verminderen</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Automatisering elimineert menselijke fouten en voorkomt voorraadtekorten of overstock situaties.</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-green-800 mb-2">Processen optimaliseren</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Streamline je hele voorraadproces van bestelling tot verzending met geautomatiseerde workflows.</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-purple-800 mb-2">Inzicht voor betere beslissingen</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Analyseer voorraadgegevens met gedetailleerde rapporten om onderbouwde beslissingen te nemen over je voorraad.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Belangrijke functionaliteiten Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Belangrijke functionaliteiten</span> van stockbeheer software
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Stockbeheer software biedt essentiÃ«le functies om je voorraad optimaal te beheren
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold mb-3 text-blue-900">Orderbeheer</h3>
              <p className="text-gray-700">
                Beheer het hele proces van bestelling tot verzending. Volg orders in real-time, automatiseer orderverwerking en zorg voor een soepele workflow van klantbestelling tot levering.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold mb-3 text-green-900">Magazijnbeheer</h3>
              <p className="text-gray-700">
                Organiseer en optimaliseer de magazijnlogistiek. Beheer locaties, tracking van artikelen en efficiÃ«nte picking- en packingprocessen voor optimale magazijnoperaties.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-semibold mb-3 text-purple-900">Inkoopbeheer</h3>
              <p className="text-gray-700">
                Automatiseert bestellingen wanneer de voorraad laag is. Stel minimumvoorraadniveaus in en ontvang automatische meldingen wanneer je moet bijbestellen bij leveranciers.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <h3 className="text-xl font-semibold mb-3 text-orange-900">Voorraadbeheer</h3>
              <p className="text-gray-700">
                Houd de gehele voorraadcyclus bij, van inkoop tot verkoop. Real-time tracking, voorraadmutaties, batch- en serienummerbeheer en accurate voorraadniveaus op elk moment.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-xl font-semibold mb-3 text-indigo-900">Rapportage</h3>
              <p className="text-gray-700">
                Analyseer voorraadgegevens om beslissingen te onderbouwen. Gedetailleerde rapporten over voorraadwaarde, omzet, bestverkopende producten en voorraadrotatie voor data-driven beslissingen.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Integratie & Automatisering</h3>
              <p className="text-gray-700">
                Koppel met boekhoudsoftware, webshops en andere systemen. Automatiseer workflows en synchroniseer data in real-time voor een naadloze bedrijfsvoering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Geavanceerde functies</span> van onze stockbeheer software
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Naast de belangrijkste functionaliteiten biedt stockflow aanvullende geavanceerde functies speciaal ontwikkeld voor kleine ondernemers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Barcode Scanning</h3>
              <p className="text-gray-700">
                Scan barcodes met je smartphone of tablet voor snelle en nauwkeurige voorraadupdates. Perfect voor efficiÃ«nt magazijnbeheer en orderbeheer.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Multi-Locatie Beheer</h3>
              <p className="text-gray-700">
                Beheer voorraad op meerdere locaties vanuit Ã©Ã©n centrale stockbeheer software. Ideaal voor bedrijven met meerdere vestigingen of magazijnen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Geavanceerde Rapportage & Analytics</h3>
              <p className="text-gray-700">
                Krijg automatisch rapporten over je voorraadprestaties, best verkopende producten en voorraadrotatie voor data-driven beslissingen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Automatisch Inkoopbeheer</h3>
              <p className="text-gray-700">
                Stel minimumvoorraadniveaus in en ontvang automatische bestelmeldingen. Automatiseer je inkoopbeheer voor optimale voorraadniveaus.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Mobiele App</h3>
              <p className="text-gray-700">
                Beheer je voorraad onderweg met onze mobiele app. Beschikbaar voor iOS en Android. Perfect voor magazijnbeheer op locatie.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Integratie Mogelijkheden</h3>
              <p className="text-gray-700">
                Integreer met je bestaande boekhoudsoftware, webshop of andere bedrijfssystemen voor een naadloze workflow en geautomatiseerde orderbeheer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Voordelen</span> van professionele stockbeheer software
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Tijdbesparing</h3>
              <p className="text-gray-700">
                Bespaar tot 70% tijd op voorraadbeheer door automatisering en real-time inzicht. Geen handmatige tellingen meer nodig.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Kostenreductie</h3>
              <p className="text-gray-700">
                Voorkom overstock en tekorten door betere planning. Dit kan je tot 25% besparen op voorraadkosten.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Foutreductie</h3>
              <p className="text-gray-700">
                Elimineer menselijke fouten door geautomatiseerde processen en real-time synchronisatie tussen alle systemen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Schaalbaarheid</h3>
              <p className="text-gray-700">
                Groei mee met je bedrijf. Van 30 producten tot duizenden - onze stockbeheer software schaalt automatisch mee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Software Alternatives Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Voorbeelden van populaire stockbeheer software</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Er zijn verschillende stockbeheer software oplossingen beschikbaar. Hier zijn enkele populaire opties:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Odoo</h3>
              <p className="text-sm text-gray-600 mb-3">Open source ERP- en CRM-pakket</p>
              <p className="text-sm text-gray-700">
                Een uitgebreide open source oplossing met veel modules, maar kan complex zijn voor kleine bedrijven en vereist vaak technische expertise.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Zoho Inventory</h3>
              <p className="text-sm text-gray-600 mb-3">Gratis voorraadbeheersoftware voor groeiende bedrijven</p>
              <p className="text-sm text-gray-700">
                Goede optie met gratis versie, maar beperkte functies in het gratis plan en kan duur worden bij schalen.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Exact</h3>
              <p className="text-sm text-gray-600 mb-3">Online voorraadbeheer met apps en WMS-mogelijkheden</p>
              <p className="text-sm text-gray-700">
                Krachtige enterprise oplossing, maar vaak te duur en complex voor kleine KMO's. Start vanaf €255/maand.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">monday.com</h3>
              <p className="text-sm text-gray-600 mb-3">Flexibele tool met breed scala aan toepassingen</p>
              <p className="text-sm text-gray-700">
                Flexibele workflow tool, maar niet specifiek gebouwd voor stockbeheer en kan duur zijn voor kleine teams.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Stockpilot</h3>
              <p className="text-sm text-gray-600 mb-3">Multichannel business beheer</p>
              <p className="text-sm text-gray-700">
                Gericht op multichannel verkoop, maar minder geschikt voor lokale Belgische/Nederlandse bedrijven.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Silvasoft</h3>
              <p className="text-sm text-gray-600 mb-3">Betaalbare online oplossing voor webshops</p>
              <p className="text-sm text-gray-700">
                Betaalbare optie vanaf €5,45/maand, maar vooral gericht op webshops en minder geschikt voor traditionele retail.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-8 mt-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  SF
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-900 mb-3">Waarom stockflow de beste keuze is voor KMO's</h3>
                <p className="text-gray-700 mb-4">
                  Terwijl andere stockbeheer software oplossingen vaak duur zijn of te complex voor kleine bedrijven, biedt stockflow de perfecte balans tussen functionaliteit, gebruiksvriendelijkheid en betaalbaarheid.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">✓ 100% Gratis plan</h4>
                    <p className="text-sm text-gray-600">Start gratis met tot 30 producten - geen verborgen kosten of verplichtingen</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">✓ Gebruiksvriendelijk</h4>
                    <p className="text-sm text-gray-600">Geen technische expertise nodig - start direct zonder complexe implementatie</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">✓ Belgische/Nederlandse focus</h4>
                    <p className="text-sm text-gray-600">Ontwikkeld voor de Belgische en Nederlandse markt met lokale support</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">✓ Mobiel-first</h4>
                    <p className="text-sm text-gray-600">Volledige mobiele app voor iOS en Android - beheer je voorraad overal</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to="/auth"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Start Gratis Met StockFlow
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Gratis Stockbeheer Software
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden KMO's die al profiteren van onze stockbeheer software. Begin vandaag nog met het optimaliseren van je voorraadbeheer.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Start Gratis Nu
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">Geen creditcard vereist • Direct toegang • Nederlandse support</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-1 h-16 bg-blue-600 mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold mb-4">FAQ</h2>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img
            src="/logo.png"
            alt="stockflow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Gratis stockbeheer software voor KMO's.
            Eenvoudig, betrouwbaar en schaalbaar.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Stockbeheer software voor KMO's.
            </p>
          </div>
        </div>
      </footer>

    </SeoPageLayout>
  );
}


