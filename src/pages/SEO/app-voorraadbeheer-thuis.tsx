import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

import { StructuredData } from '../../components/StructuredData';
export default function AppVoorraadbeheerThuis() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Kan ik een voorraadbeheer app thuis gebruiken?",
      answer: "Ja, onze voorraadbeheer app is perfect geschikt voor thuisgebruik. Veel kleine ondernemers, zelfstandigen en zelfs particulieren gebruiken de app om hun thuisvoorraad te beheren. De app is gebruiksvriendelijk en vereist geen technische kennis."
    },
    {
      question: "Is de app voorraadbeheer thuis gratis?",
      answer: "Ja, je kunt gratis starten met onze app voorraadbeheer thuis. Beheer tot 30 producten zonder kosten. Dit is perfect om te testen of de app iets voor jou is voordat je besluit om uit te breiden."
    },
    {
      question: "Welke functies heeft de app voor thuisgebruik?",
      answer: "De app voorraadbeheer thuis bevat alle essentiële functies: voorraad bijhouden, bestellingen plaatsen, barcode scannen, voorraadbewegingen registreren en real-time inzicht in je voorraadniveaus. Perfect voor thuisgebruik."
    },
    {
      question: "Kan ik de app gebruiken voor mijn thuisbedrijf?",
      answer: "Absoluut! Onze app voorraadbeheer thuis is ideaal voor thuisbedrijven, webshops, ambachtelijke bedrijven en kleine ondernemingen die vanuit huis werken. De app groeit mee met je bedrijf."
    },
    {
      question: "Hoe installeer ik de app voorraadbeheer thuis?",
      answer: "De app voorraadbeheer thuis is een web-app die je direct kunt gebruiken in je browser. Geen installatie nodig - gewoon inloggen en beginnen. Werkt op alle apparaten: computer, tablet en smartphone."
    }
  ];

  return (
    <SeoPageLayout title="App Voorraadbeheer Thuis - Voorraadbeheer voor Thuisbedrijven">
      <SEO
        title="App Voorraadbeheer Thuis Gratis | Voorraadbeheer voor Thuisbedrijven | stockflow"
        description="Ontdek de beste app voorraadbeheer thuis voor je thuisbedrijf. Eenvoudig voorraadbeheer voor kleine ondernemingen, webshops en thuisbedrijven. Gratis starten!"
        keywords="app voorraadbeheer thuis, voorraadbeheer app thuis, voorraadbeheer thuis, app voorraadbeheer thuis gratis, voorraadbeheer thuisbedrijf, voorraadbeheer app thuisbedrijf, voorraadbeheer thuis onderneming, voorraadbeheer app thuis installeren, voorraadbeheer app thuis download, voorraadbeheer app thuis gratis, voorraadbeheer app thuis KMO, voorraadbeheer app thuis webshop, voorraadbeheer app thuis horeca, voorraadbeheer app thuis detailhandel"
        url="https://www.stockflow.be/app-voorraadbeheer-thuis"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-600">App Voorraadbeheer Thuis</span> voor je thuisbedrijf
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Ontdek de perfecte app voorraadbeheer thuis voor je thuisbedrijf, webshop of kleine onderneming. 
                Onze app voorraadbeheer thuis maakt voorraadbeheer eenvoudig en efficiënt, speciaal ontwikkeld voor thuisbedrijven. 
                Beheer je voorraad vanuit je woonkamer, garage of thuiswerkplek met onze gebruiksvriendelijke app voorraadbeheer thuis.
              </p>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://rompslomp.nl/hs-fs/hubfs/voorraadbeheer.jpg?width=1200&height=800&name=voorraadbeheer.jpg" 
                  alt="App Voorraadbeheer Thuis" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is App Voorraadbeheer Thuis Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.greatplacetowork.ca/images/Asset_3.webp" 
                  alt="Thuisbedrijf Voorraadbeheer" 
                  className="w-full h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Waarom een app voorraadbeheer thuis voor je thuisbedrijf?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Een app voorraadbeheer thuis is de perfecte oplossing voor thuisbedrijven die hun voorraad professioneel willen beheren. 
                Onze app voorraadbeheer thuis combineert de eenvoud van thuisgebruik met de kracht van professioneel voorraadbeheer. 
                Perfect voor webshops, ambachtelijke bedrijven, consultants en andere thuisbedrijven.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Eenvoudig thuisgebruik</h3>
                  <p className="text-gray-700">Onze app voorraadbeheer thuis is speciaal ontworpen voor thuisgebruik. Geen complexe systemen - gewoon inloggen en beginnen met voorraadbeheer.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Kostenbesparend voor thuisbedrijven</h3>
                  <p className="text-gray-700">Geen dure software of hardware nodig. Onze app voorraadbeheer thuis werkt op je bestaande apparaten en is betaalbaar voor kleine ondernemingen.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Flexibiliteit voor thuiswerk</h3>
                  <p className="text-gray-700">Beheer je voorraad wanneer het jou uitkomt. Onze app voorraadbeheer thuis past zich aan aan jouw werkritme en thuiswerkschema.</p>
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
                Functies van onze app voorraadbeheer thuis
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Onze app voorraadbeheer thuis bevat alle functies die je nodig hebt voor professioneel voorraadbeheer vanuit huis:
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">1. Eenvoudige thuisinstallatie:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Geen complexe installatie nodig. Onze app voorraadbeheer thuis is een web-app die je direct kunt gebruiken in je browser. 
                    Werkt op alle apparaten die je thuis hebt: computer, tablet en smartphone.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">2. Voorraadbeheer voor thuisbedrijven:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Speciaal ontwikkeld voor thuisbedrijven met functies die passen bij kleinschalige operaties. 
                    Beheer je voorraad efficiënt zonder de complexiteit van grote bedrijfssystemen.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">3. Barcode scanning voor thuisgebruik:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Gebruik je smartphone camera om barcodes te scannen. Perfect voor thuisbedrijven die producten verkopen 
                    en hun voorraad nauwkeurig willen bijhouden.
                  </p>
                </div>
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://valuechain.be/media/images/20232316226515_shutterstock-1106078390.width-1292.webp" 
                  alt="App Voorraadbeheer Thuis Features" 
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
              <span className="text-blue-600">Voordelen</span> van onze app voorraadbeheer thuis
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Perfect voor thuisbedrijven</h3>
              <p className="text-gray-700">
                Onze app voorraadbeheer thuis is speciaal ontwikkeld voor thuisbedrijven. 
                Eenvoudig te gebruiken, betaalbaar en schaalbaar met je bedrijf mee.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Geen dure investeringen</h3>
              <p className="text-gray-700">
                Geen dure software of hardware nodig. Onze app voorraadbeheer thuis werkt op je bestaande apparaten 
                en heeft geen verborgen kosten.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Flexibiliteit voor thuiswerk</h3>
              <p className="text-gray-700">
                Beheer je voorraad wanneer het jou uitkomt. Onze app voorraadbeheer thuis past zich aan 
                aan jouw werkritme en thuiswerkschema.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Professioneel voorraadbeheer</h3>
              <p className="text-gray-700">
                Ondanks de eenvoud biedt onze app voorraadbeheer thuis alle functies die je nodig hebt 
                voor professioneel voorraadbeheer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Voor welke thuisbedrijven is onze app geschikt?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Webshops</h3>
              <p className="text-gray-700">
                Perfect voor webshops die vanuit huis werken. Beheer je productvoorraad, 
                bestellingen en voorraadbewegingen met onze app voorraadbeheer thuis.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Ambachtelijke bedrijven</h3>
              <p className="text-gray-700">
                Voor ambachtelijke bedrijven die materialen en producten moeten bijhouden. 
                Onze app voorraadbeheer thuis helpt je om overzicht te houden.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Consultants</h3>
              <p className="text-gray-700">
                Voor consultants die materialen of producten verkopen. 
                Onze app voorraadbeheer thuis maakt voorraadbeheer eenvoudig en professioneel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Onze App Voorraadbeheer Thuis
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden thuisbedrijven die al profiteren van onze app voorraadbeheer thuis. 
            Begin vandaag nog met professioneel voorraadbeheer vanuit huis.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Start Gratis Nu
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">Gratis starten • Geen creditcard vereist • Direct toegang</p>
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
            De beste app voorraadbeheer thuis voor Vlaamse thuisbedrijven.
            Eenvoudig, betaalbaar en professioneel.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              App voorraadbeheer thuis voor Vlaamse thuisbedrijven.
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
                "headline": "App Voorraadbeheer Thuis - Voorraadbeheer voor Thuisbedrijven",
                "description": "Ontdek de beste app voorraadbeheer thuis voor je thuisbedrijf. Eenvoudig voorraadbeheer voor kleine ondernemingen, webshops en thuisbedrijven. Gratis starten!",
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
                  "@id": "https://www.stockflow.be/app-voorraadbeheer-thuis"
                },
                "datePublished": "2024-06-01",
                "dateModified": "2024-12-19"        }      ]} />
    </SeoPageLayout>
  );
}
