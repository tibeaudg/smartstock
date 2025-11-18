import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

import { StructuredData } from '@/components/StructuredData';
export default function VoorraadbeheerApp() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat is een voorraadbeheer app?",
      answer: "Een voorraadbeheer app is een mobiele applicatie waarmee je je voorraad kunt beheren vanaf je smartphone of tablet. Met Stockflow kun je overal en altijd je voorraad controleren, bestellingen plaatsen en voorraadbewegingen registreren."
    },
    {
      question: "Is de voorraadbeheer app gratis?",
      answer: "Ja, Stockflow biedt een gratis voorraadbeheer app aan. Je kunt tot 30 producten gratis beheren zonder verborgen kosten. Perfect om te testen of een voorraadbeheer app iets voor jou is."
    },
    {
      question: "Werkt de voorraadbeheer app offline?",
      answer: "Onze voorraadbeheer app werkt online en synchroniseert automatisch met je account. Dit zorgt ervoor dat je altijd de meest recente gegevens hebt, waar je ook bent."
    },
    {
      question: "Kan ik de voorraadbeheer app thuis gebruiken?",
      answer: "Absoluut! Onze voorraadbeheer app is perfect geschikt voor thuisgebruik. Veel kleine ondernemers en zelfstandigen gebruiken de app om hun thuisvoorraad te beheren."
    },
    {
      question: "Welke functies heeft de voorraadbeheer app?",
      answer: "De voorraadbeheer app bevat alle essentiÃ«le functies: voorraad bijhouden, bestellingen plaatsen, barcode scannen, voorraadbewegingen registreren en real-time inzicht in je voorraadniveaus."
    }
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer App - Mobiel Voorraadbeheer">
      <SEO
        title="Voorraadbeheer App 2025 - Voorraadbeheer App 2025"
        description="Ontdek hoe voorraadbeheer app uw processen te automatiseren. Ontdek hoe voorraadbeheer app de beste software te kiezen. Ontdek. Start vandaag gratis. StockFl..."
        keywords="voorraadbeheer app, voorraadbeheer app gratis, app voorraadbeheer thuis, mobiel voorraadbeheer, voorraadbeheer app download, voorraadbeheer app android, voorraadbeheer app iphone, voorraadbeheer app tablet, voorraadbeheer app barcode, voorraadbeheer app offline, stockflow app, voorraadbeheer software app, voorraadbeheer app KMO, voorraadbeheer app horeca, voorraadbeheer app webshop"
        url="https://www.stockflow.be/voorraadbeheer-app"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-600">Voorraadbeheer App</span> voor mobiel beheer
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Ontdek de kracht van mobiel voorraadbeheer met onze voorraadbeheer app. Beheer je voorraad overal en altijd vanaf je smartphone of tablet. 
                Met barcode scanning, real-time synchronisatie en een gebruiksvriendelijke interface maakt onze voorraadbeheer app voorraadbeheer eenvoudig en efficiÃ«nt. 
                Perfect voor KMO's, horeca, webshops en detailhandel.
              </p>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.warehousingandfulfillment.com/wp-content/uploads/2020/04/Barcode-Scanning-Technologies.jpg" 
                  alt="Voorraadbeheer App" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Voorraadbeheer App Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.greatplacetowork.ca/images/Asset_3.webp" 
                  alt="Mobiel Voorraadbeheer" 
                  className="w-full h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Waarom kiezen voor een voorraadbeheer app?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Een voorraadbeheer app biedt flexibiliteit en efficiÃ«ntie die traditionele systemen niet kunnen bieden. 
                Met een voorraadbeheer app kun je je voorraad beheren waar je ook bent, zonder gebonden te zijn aan een computer. 
                Dit is vooral waardevol voor bedrijven met meerdere Locationss of medewerkers die vaak onderweg zijn.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Mobiele toegang tot je voorraad</h3>
                  <p className="text-gray-700">Met onze voorraadbeheer app heb je altijd toegang tot je voorraadgegevens, of je nu in het magazijn, op de beurs of thuis bent.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Barcode scanning functionaliteit</h3>
                  <p className="text-gray-700">Scan barcodes direct met je smartphone camera voor snelle en nauwkeurige voorraadregistratie.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Real-time synchronisatie</h3>
                  <p className="text-gray-700">Alle wijzigingen in de voorraadbeheer app worden direct gesynchroniseerd met je hoofdsysteem.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-start">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">
                Functies van onze voorraadbeheer app
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Onze voorraadbeheer app bevat alle essentiÃ«le functies die je nodig hebt voor efficiÃ«nt voorraadbeheer:
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">1. Barcode scanning:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Gebruik de camera van je smartphone om barcodes te scannen voor snelle productidentificatie en voorraadregistratie. 
                    Deze functie maakt onze voorraadbeheer app bijzonder efficiÃ«nt voor magazijnoperaties.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">2. Real-time voorraadoverzicht:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Bekijk altijd je actuele voorraadniveaus, bestellingen en voorraadbewegingen in real-time. 
                    De voorraadbeheer app toont je direct welke producten op voorraad zijn en welke besteld moeten worden.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">3. Offline functionaliteit:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Werk ook zonder internetverbinding en synchroniseer later wanneer je weer online bent. 
                    Dit maakt onze voorraadbeheer app betrouwbaar in alle situaties.
                  </p>
                </div>
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://valuechain.be/media/images/20232316226515_shutterstock-1106078390.width-1292.webp" 
                  alt="Voorraadbeheer App Features" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Voordelen</span> van onze voorraadbeheer app
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Verhoogde efficiÃ«ntie</h3>
              <p className="text-gray-700">
                Met onze voorraadbeheer app kun je tot 50% sneller werken dan met traditionele methoden. 
                Barcode scanning en mobiele toegang maken voorraadbeheer veel efficiÃ«nter en nauwkeuriger.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Flexibiliteit en mobiliteit</h3>
              <p className="text-gray-700">
                Beheer je voorraad waar je ook bent. Of je nu in het magazijn, op de beurs of thuis werkt, 
                onze voorraadbeheer app geeft je altijd toegang tot je voorraadgegevens.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Kostenbesparing</h3>
              <p className="text-gray-700">
                Door fouten te voorkomen en processen te optimaliseren kan onze voorraadbeheer app je helpen 
                tot 30% te besparen op voorraadkosten en operationele uitgaven.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Betere klantenservice</h3>
              <p className="text-gray-700">
                Met real-time voorraadinformatie kun je klanten direct informeren over beschikbaarheid 
                en levertijden, wat resulteert in tevredener klanten en meer verkopen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Onze Voorraadbeheer App
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden bedrijven die al profiteren van mobiel voorraadbeheer. 
            Download onze voorraadbeheer app en begin vandaag nog met het optimaliseren van je voorraadbeheer.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Download Voorraadbeheer App
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">Gratis download • Geen creditcard vereist • Direct toegang</p>
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
            De beste voorraadbeheer app voor Vlaamse KMO's.
            Mobiel, efficiÃ«nt en gebruiksvriendelijk.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Voorraadbeheer app voor Vlaamse KMO's.
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
        {"@context": "https://schema.org",
                "@type": "Article",
                "headline": "Voorraadbeheer App - Mobiel Voorraadbeheer",
                "description": "Ontdek de beste voorraadbeheer app voor je bedrijf. Mobiel voorraadbeheer met barcode scanning, real-time synchronisatie en gratis starten.",
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
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://www.stockflow.be/voorraadbeheer-app"
                },
                "datePublished": "2024-06-01",
                "dateModified": "2024-12-19"        }      ]} />
    </SeoPageLayout>
  );
}


