import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function StockbeheerSoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat is stockbeheer software?",
      answer: "Stockbeheer software is een digitaal systeem dat helpt bij het beheren van je voorraad. Het houdt bij hoeveel producten je hebt, wanneer je moet bestellen en helpt bij het optimaliseren van je magazijnoperaties."
    },
    {
      question: "Is er gratis stockbeheer software beschikbaar?",
      answer: "Ja, stockflow biedt gratis stockbeheer software voor kleine bedrijven. Je kunt tot 30 producten gratis beheren zonder verborgen kosten of verplichtingen."
    },
    {
      question: "Welke stockbeheer software is het beste voor kleine bedrijven?",
      answer: "Voor kleine bedrijven is stockflow ideaal omdat het gebruiksvriendelijk is, betaalbaar en schaalbaar. Je kunt gratis starten en meegroeien met je bedrijf zonder complexe implementaties."
    },
    {
      question: "Hoe werkt stockbeheer software?",
      answer: "Stockbeheer software werkt door je producten digitaal bij te houden, automatische meldingen te geven bij lage voorraad en real-time inzicht te bieden in je voorraadniveaus en verkopen."
    },
    {
      question: "Kan ik stockbeheer software integreren met mijn bestaande systemen?",
      answer: "Ja, moderne stockbeheer software zoals stockflow kan vaak geïntegreerd worden met boekhoudsoftware, webshops en andere bedrijfssystemen voor een naadloze workflow."
    }
  ];

  return (
    <SeoPageLayout title="Stockbeheer Software voor Kleine Ondernemers">
      <SEO
        title="Gratis Stockbeheer Software voor Kleine Ondernemers | stockflow"
        description="Beheer je voorraad eenvoudig online. Gratis stockbeheer software voor winkels, horeca en zelfstandigen. Start direct met stockflow – geen kosten."
        keywords="stockbeheer software, gratis stockbeheer, voorraadbeheer software, stockbeheer programma, magazijnbeheer software, inventarisatie software, stockbeheer app, voorraadbeheer app, stockflow, gratis voorraadbeheer, KMO software, kleine onderneming software"
        url="https://www.stockflow.be/stockbeheer-software"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-blue-600">Gratis Stockbeheer Software</span> voor kleine ondernemers
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                Beheer je voorraad eenvoudig online met onze gratis stockbeheer software. Perfect voor winkels, horeca en zelfstandigen. Start direct zonder kosten en ervaar hoe gemakkelijk voorraadbeheer kan zijn met de juiste stockbeheer software.
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
                Waarom kiezen voor professionele stockbeheer software?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Stockbeheer software is essentieel voor moderne bedrijven. In plaats van handmatig bijhouden in Excel of op papier, biedt professionele stockbeheer software real-time inzicht, automatische meldingen en geavanceerde rapportage. Dit bespaart tijd, voorkomt fouten en optimaliseert je voorraadniveaus.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Real-time voorraadinzicht</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Bekijk altijd je actuele voorraadniveaus en krijg direct inzicht in welke producten je moet bestellen.</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-green-800 mb-2">Automatische bestelmeldingen</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Krijg automatisch een melding wanneer je voorraad onder het minimum niveau komt.</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-purple-800 mb-2">Geavanceerde rapportage</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Analyseer je voorraadprestaties met gedetailleerde rapporten en inzichten.</p>
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
              <span className="text-blue-600">Functies</span> van onze stockbeheer software
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Ontdek alle mogelijkheden van onze stockbeheer software die speciaal is ontwikkeld voor kleine ondernemers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Barcode Scanning</h3>
              <p className="text-gray-700">
                Scan barcodes met je smartphone of tablet voor snelle en nauwkeurige voorraadupdates. Perfect voor efficiënt magazijnbeheer.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Multi-locatie Support</h3>
              <p className="text-gray-700">
                Beheer voorraad op meerdere locaties vanuit één centrale stockbeheer software. Ideaal voor bedrijven met meerdere vestigingen.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Automatische Rapportage</h3>
              <p className="text-gray-700">
                Krijg automatisch rapporten over je voorraadprestaties, best verkopende producten en voorraadrotatie.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Leverancier Beheer</h3>
              <p className="text-gray-700">
                Houd je leveranciers en hun contactgegevens bij, inclusief bestelgeschiedenis en leveringsprestaties.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Mobiele App</h3>
              <p className="text-gray-700">
                Beheer je voorraad onderweg met onze mobiele app. Beschikbaar voor iOS en Android.
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

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Gratis Stockbeheer Software
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden Vlaamse KMO's die al profiteren van onze stockbeheer software. Begin vandaag nog met het optimaliseren van je voorraadbeheer.
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
            Gratis stockbeheer software voor Vlaamse KMO's.
            Eenvoudig, betrouwbaar en schaalbaar.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Stockbeheer software voor Vlaamse KMO's.
            </p>
          </div>
        </div>
      </footer>

      {/* Schema.org Structured Data */}
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "stockflow Stockbeheer Software",
        "description": "Gratis stockbeheer software voor kleine ondernemers. Beheer je voorraad eenvoudig online.",
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
        "url": "https://www.stockflow.be/stockbeheer-software"
      }`}} />
    </SeoPageLayout>
  );
}
