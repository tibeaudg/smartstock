import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

export default function MagazijnbeheerSoftware() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat is magazijnbeheer software?",
      answer: "Magazijnbeheer software is een digitaal systeem dat helpt bij het beheren van je magazijn en voorraad. Het houdt bij hoeveel producten je hebt, waar ze zich bevinden, wanneer je moet bestellen en helpt bij het optimaliseren van je magazijnoperaties."
    },
    {
      question: "Is er gratis magazijnbeheer software beschikbaar?",
      answer: "Ja, StockFlow biedt gratis magazijnbeheer software voor kleine bedrijven. Je kunt tot 30 producten gratis beheren zonder verborgen kosten of verplichtingen."
    },
    {
      question: "Welke magazijnbeheer software is het beste voor kleine bedrijven?",
      answer: "Voor kleine bedrijven is StockFlow ideaal omdat het gebruiksvriendelijk is, betaalbaar en schaalbaar. Je kunt gratis starten en meegroeien met je bedrijf zonder complexe implementaties."
    },
    {
      question: "Hoe werkt magazijnbeheer software?",
      answer: "Magazijnbeheer software werkt door je producten digitaal bij te houden, automatische meldingen te geven bij lage voorraad en real-time inzicht te bieden in je voorraadniveaus, locaties en verkopen."
    },
    {
      question: "Kan ik magazijnbeheer software integreren met mijn bestaande systemen?",
      answer: "Ja, moderne magazijnbeheer software zoals StockFlow kan vaak geÃ¯ntegreerd worden met boekhoudsoftware, webshops en andere bedrijfssystemen voor een naadloze workflow."
    }
  ];

  const structuredData = generateComprehensiveStructuredData('software', {
    title: "Gratis Magazijnbeheer Software voor KMO's | StockFlow",
    url: "https://www.stockflow.be/magazijnbeheer-software",
    description: "Eenvoudig magazijnbeheer software voor kleine bedrijven. Beheer voorraad, leveringen en producten in Ã©Ã©n online dashboard. Gratis te proberen.",
    breadcrumbs: [
      { name: "Home", url: "https://www.stockflow.be/", position: 1 },
      { name: "Magazijnbeheer Software", url: "https://www.stockflow.be/magazijnbeheer-software", position: 2 }
    ],
    faqData: faqData,
    softwareData: {
      name: "StockFlow Magazijnbeheer Software",
      description: "Eenvoudig magazijnbeheer software voor kleine bedrijven. Beheer je magazijn en voorraad online met real-time inzicht.",
      category: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      price: "0",
      currency: "EUR",
      rating: {
        value: "4.8",
        count: "127"
      },
      features: [
        "Real-time voorraad tracking",
        "Barcode scanning",
        "Multi-locatie ondersteuning",
        "Magazijn overzicht",
        "Automatische herbestelling",
        "Rapportage en analytics",
        "Team samenwerking",
        "Mobiele app toegang"
      ],
      image: "https://www.stockflow.be/Inventory-Management.png",
      url: "https://www.stockflow.be/magazijnbeheer-software"
    }
  });

  return (
    <SeoPageLayout title="Magazijnbeheer Software voor Kleine Bedrijven">
      <SEO
        title="Magazijnbeheer Software 2025 | Gratis Plan + Bespaar 35% | StockFlow #1"
        description="ðŸ† #1 Magazijnbeheer software voor KMO's 2025. Real-time tracking, barcode scanning, automatische workflows. Bespaar 35% kosten & 15 uur/week! GRATIS plan - geen creditcard. Vertrouwd door 1.000+ bedrijven. Start nu gratis!"
        keywords="magazijnbeheer software, voorraadbeheer software, warehouse management, stockbeheer software, gratis magazijnbeheer, KMO software, magazijnbeheer software gratis, beste magazijnbeheer software, magazijnbeheer software voor kleine bedrijven, online magazijnbeheer"
        url="https://www.stockflow.be/magazijnbeheer-software"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-white py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-blue-600">Magazijnbeheer Software</span> 2025: #1 voor KMO's | Bespaar 35% + 15 uur/week
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                ðŸ† Ontdek de #1 beste magazijnbeheer software voor kleine bedrijven in 2025. Beheer voorraad, leveringen en producten in Ã©Ã©n online dashboard. 
                Real-time inzicht, barcode scanning, multi-locatie support en automatische meldingen. Bespaar 35% kosten & 15 uur/week! 
                Vertrouwd door 1.000+ bedrijven. GRATIS te proberen - geen creditcard vereist!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-center"
                >
                  Start Gratis Nu
                </Link>
                <Link
                  to="/stockbeheer-software"
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
                >
                  Meer Informatie
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-4">
                Zie ook: <Link to="/software-stockbeheer" className="text-blue-600 hover:underline">Software Stockbeheer</Link> • <Link to="/stockbeheer-programma" className="text-blue-600 hover:underline">Stockbeheer Programma</Link> • <Link to="/voorraadbeheer-software" className="text-blue-600 hover:underline">Voorraadbeheer Software</Link>
              </p>
            </div>
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.warehousingandfulfillment.com/wp-content/uploads/2020/04/Barcode-Scanning-Technologies.jpg" 
                  alt="Magazijnbeheer Software" 
                  className="w-full max-w-sm sm:max-w-md lg:w-96 h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Magazijnbeheer Software Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://valuechain.be/media/images/20232316226515_shutterstock-1106078390.width-1292.webp" 
                  alt="Modern Magazijn" 
                  className="w-full h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                Waarom kiezen voor professionele magazijnbeheer software?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Magazijnbeheer software is essentieel voor moderne bedrijven met fysieke voorraad. In plaats van handmatig bijhouden in Excel of op papier, biedt professionele magazijnbeheer software real-time inzicht, locatiebeheer, automatische meldingen en geavanceerde rapportage. Dit bespaart tijd, voorkomt fouten en optimaliseert je magazijnoperaties.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Real-time magazijninzicht</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Bekijk altijd je actuele voorraadniveaus per locatie en krijg direct inzicht in welke producten waar staan.</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-green-800 mb-2">Multi-locatie support</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Beheer meerdere magazijnen of vestigingen vanuit Ã©Ã©n centraal systeem.</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-purple-800 mb-2">Automatische processen</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Automatiseer inkomende en uitgaande goederenstromen voor maximale efficiÃ«ntie.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Functies</span> van onze magazijnbeheer software
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Ontdek alle mogelijkheden van onze magazijnbeheer software die speciaal is ontwikkeld voor kleine ondernemers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Barcode Scanning</h3>
              <p className="text-gray-700">
                Scan barcodes met je smartphone of tablet voor snelle en nauwkeurige voorraadupdates. Perfect voor efficiÃ«nt magazijnbeheer.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Multi-Locatie Support</h3>
              <p className="text-gray-700">
                Beheer voorraad op meerdere magazijnen vanuit Ã©Ã©n centrale magazijnbeheer software. Ideaal voor bedrijven met meerdere vestigingen.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Automatische Rapportage</h3>
              <p className="text-gray-700">
                Krijg automatisch rapporten over je magazijnprestaties, voorraadrotatie en efficiÃ«ntie.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Goederenstromen</h3>
              <p className="text-gray-700">
                Track inkomende en uitgaande goederenstromen met gedetailleerde leveringsbonnen en documenten.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Mobiele App</h3>
              <p className="text-gray-700">
                Beheer je magazijn onderweg met onze mobiele app. Beschikbaar voor iOS en Android.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Integratie Mogelijkheden</h3>
              <p className="text-gray-700">
                Integreer met je bestaande boekhoudsoftware, webshop of andere bedrijfssystemen voor een naadloze workflow.
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
              <span className="text-blue-600">Voordelen</span> van professionele magazijnbeheer software
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Tijdbesparing</h3>
              <p className="text-gray-700">
                Bespaar tot 70% tijd op magazijnbeheer door automatisering en real-time inzicht. Geen handmatige tellingen meer nodig.
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
                Groei mee met je bedrijf. Van 30 producten tot duizenden - onze magazijnbeheer software schaalt automatisch mee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Gratis Magazijnbeheer Software
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden KMO's die al profiteren van onze magazijnbeheer software. Begin vandaag nog met het optimaliseren van je magazijnbeheer.
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
            <h2 className="text-3xl font-bold mb-4">Veelgestelde vragen over magazijnbeheer software</h2>
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
            alt="StockFlow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Gratis magazijnbeheer software voor KMO's.
            Eenvoudig, betrouwbaar en schaalbaar.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. Alle rechten voorbehouden.
              Magazijnbeheer software voor KMO's.
            </p>
          </div>
        </div>
      </footer>

    </SeoPageLayout>
  );
}



