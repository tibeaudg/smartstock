import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

import { StructuredData } from '../../components/StructuredData';
export default function VoorraadbeheerExcelTemplateGratis() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat is een voorraadbeheer excel template?",
      answer: "Een voorraadbeheer excel template is een vooraf opgezette Excel-werkmap met formules en functies om je voorraad te beheren. Het bevat kolommen voor producten, voorraadniveaus, bestellingen en automatische berekeningen."
    },
    {
      question: "Is de voorraadbeheer excel template gratis?",
      answer: "Ja, wij bieden een gratis voorraadbeheer excel template aan die je direct kunt downloaden en gebruiken. Geen verborgen kosten of abonnementen - gewoon gratis downloaden en beginnen."
    },
    {
      question: "Kan ik de excel template aanpassen aan mijn behoeften?",
      answer: "Absoluut! Onze voorraadbeheer excel template is volledig aanpasbaar. Je kunt kolommen toevoegen, formules wijzigen en de template aanpassen aan jouw specifieke voorraadbeheer behoeften."
    },
    {
      question: "Welke functies heeft de gratis excel template?",
      answer: "Onze gratis voorraadbeheer excel template bevat: automatische voorraadberekeningen, bestelpuntmeldingen, voorraadwaardering, voorraadbewegingen registratie en eenvoudige rapportages."
    },
    {
      question: "Is de excel template geschikt voor kleine bedrijven?",
      answer: "Ja, onze voorraadbeheer excel template is speciaal ontwikkeld voor kleine bedrijven en KMO's. Eenvoudig te gebruiken, geen technische kennis vereist en perfect voor kleinschalige voorraadbeheer."
    }
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer Excel Template Gratis - Download Nu">
      <SEO
        title="Voorraadbeheer Excel Template Gratis | Download Voorraadbeheer Excel | stockflow"
        description="Download onze gratis voorraadbeheer excel template. Eenvoudig voorraadbeheer met Excel, automatische berekeningen en bestelpuntmeldingen. Gratis download!"
        keywords="voorraadbeheer excel template gratis, gratis voorraadbeheer excel template, voorraadbeheer excel template download, voorraadbeheer excel template gratis download, voorraadbeheer excel template KMO, voorraadbeheer excel template kleine onderneming, voorraadbeheer excel template horeca, voorraadbeheer excel template webshop, voorraadbeheer excel template detailhandel, voorraadbeheer excel template zelf maken, voorraadbeheer excel template aanpassen, voorraadbeheer excel template formules"
        url="https://www.stockflow.be/voorraadbeheer-excel-template-gratis"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-600">Voorraadbeheer Excel Template</span> Gratis Download
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Download onze gratis voorraadbeheer excel template en begin vandaag nog met professioneel voorraadbeheer. 
                Onze voorraadbeheer excel template bevat automatische berekeningen, bestelpuntmeldingen en is volledig aanpasbaar. 
                Perfect voor KMO's, kleine ondernemingen en starters die willen beginnen met voorraadbeheer.
              </p>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.warehousingandfulfillment.com/wp-content/uploads/2020/04/Barcode-Scanning-Technologies.jpg" 
                  alt="Voorraadbeheer Excel Template" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Excel Template Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.greatplacetowork.ca/images/Asset_3.webp" 
                  alt="Excel Voorraadbeheer" 
                  className="w-full h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Waarom kiezen voor een voorraadbeheer excel template?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Een voorraadbeheer excel template biedt de perfecte balans tussen eenvoud en functionaliteit. 
                Met onze gratis voorraadbeheer excel template kun je direct beginnen zonder dure software of complexe systemen. 
                Excel is vertrouwd, flexibel en krachtig genoeg voor de meeste voorraadbeheer behoeften.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Vertrouwde Excel-interface</h3>
                  <p className="text-gray-700">Onze voorraadbeheer excel template gebruikt de vertrouwde Excel-interface die iedereen kent. Geen leercurve nodig - direct aan de slag.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Automatische berekeningen</h3>
                  <p className="text-gray-700">De voorraadbeheer excel template bevat slimme formules die automatisch voorraadniveaus, waardes en bestelpuntmeldingen berekenen.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Volledig aanpasbaar</h3>
                  <p className="text-gray-700">Pas de voorraadbeheer excel template aan aan jouw specifieke behoeften. Voeg kolommen toe, wijzig formules en maak het helemaal jouw eigen.</p>
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
                Functies van onze gratis voorraadbeheer excel template
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Onze gratis voorraadbeheer excel template bevat alle essentiële functies voor professioneel voorraadbeheer:
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">1. Automatische voorraadberekeningen:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    De voorraadbeheer excel template berekent automatisch je huidige voorraadniveaus, voorraadwaardes en voorraadrotatie. 
                    Geen handmatige berekeningen meer nodig - alles wordt automatisch bijgewerkt.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">2. Bestelpuntmeldingen:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Stel minimum voorraadniveaus in en de voorraadbeheer excel template waarschuwt je automatisch wanneer je moet bestellen. 
                    Nooit meer tekorten door vergeten bestellingen.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">3. Voorraadbewegingen registratie:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Registreer alle inkomende en uitgaande voorraadbewegingen. De voorraadbeheer excel template houdt bij 
                    wanneer producten binnenkomen, verkopen en andere voorraadbewegingen.
                  </p>
                </div>
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://valuechain.be/media/images/20232316226515_shutterstock-1106078390.width-1292.webp" 
                  alt="Excel Template Features" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Download Onze Gratis Voorraadbeheer Excel Template
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Klik op de knop hieronder om onze gratis voorraadbeheer excel template te downloaden. 
            Geen registratie vereist - direct downloaden en beginnen.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Wat krijg je in de download?</h3>
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Voorraadbeheer excel template (.xlsx bestand)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Gebruikershandleiding (PDF)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Voorbeelddata om mee te beginnen</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Video tutorial</span>
              </li>
            </ul>
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-lg inline-block"
            >
              Download Gratis Excel Template
            </Link>
            <p className="text-sm mt-4 text-gray-600">Geen registratie vereist • Direct downloaden • 100% gratis</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Voordelen</span> van onze excel template
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Kostenbesparend</h3>
              <p className="text-gray-700">
                Geen dure software nodig. Onze gratis voorraadbeheer excel template werkt met Excel dat je waarschijnlijk al hebt. 
                Bespaar honderden euro's op voorraadbeheer software.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Direct aan de slag</h3>
              <p className="text-gray-700">
                Download, open en begin. Geen installatie, geen training, geen complexe setup. 
                Onze voorraadbeheer excel template is direct klaar voor gebruik.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Volledig aanpasbaar</h3>
              <p className="text-gray-700">
                Pas de voorraadbeheer excel template aan aan jouw specifieke behoeften. 
                Voeg kolommen toe, wijzig formules en maak het helemaal jouw eigen.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Professionele resultaten</h3>
              <p className="text-gray-700">
                Ondanks de eenvoud biedt onze voorraadbeheer excel template alle functies die je nodig hebt 
                voor professioneel voorraadbeheer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Download Vandaag Onze Gratis Voorraadbeheer Excel Template
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden bedrijven die al profiteren van onze gratis voorraadbeheer excel template. 
            Begin vandaag nog met professioneel voorraadbeheer.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Download Gratis Nu
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">100% gratis • Geen registratie • Direct downloaden</p>
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
            De beste gratis voorraadbeheer excel template voor Vlaamse KMO's.
            Eenvoudig, professioneel en volledig gratis.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Voorraadbeheer excel template voor Vlaamse KMO's.
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
          "headline": "Voorraadbeheer Excel Template Gratis - Download Nu",
          "description": "Download onze gratis voorraadbeheer excel template. Eenvoudig voorraadbeheer met Excel, automatische berekeningen en bestelpuntmeldingen. Gratis download!",
          "image": "https://www.stockflow.be/logo.png",
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
            "@id": "https://www.stockflow.be/voorraadbeheer-excel-template-gratis"
          },
          "datePublished": "2024-06-01",
          "dateModified": "2024-12-19"
        }
      ]} />
    </SeoPageLayout>
  );
}
