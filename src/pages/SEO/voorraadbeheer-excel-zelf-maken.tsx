import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function VoorraadbeheerExcelZelfMaken() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Kan ik voorraadbeheer excel zelf maken?",
      answer: "Ja, je kunt zeker voorraadbeheer excel zelf maken! Met de juiste kennis en tools kun je een professioneel voorraadbeheer systeem in Excel opzetten. Wij bieden stapsgewijze instructies en templates om je te helpen."
    },
    {
      question: "Welke Excel-functies heb ik nodig voor voorraadbeheer?",
      answer: "Voor voorraadbeheer excel zelf maken heb je basis Excel-functies nodig zoals SUM, IF, VLOOKUP, en datumfuncties. Ook zijn draaitabellen en grafieken handig voor rapportages. Wij leren je alle benodigde functies."
    },
    {
      question: "Hoe lang duurt het om voorraadbeheer excel zelf te maken?",
      answer: "Met onze stapsgewijze handleiding kun je een basis voorraadbeheer systeem in Excel binnen 2-3 uur opzetten. Voor een uitgebreid systeem met alle functies heb je ongeveer een dag nodig."
    },
    {
      question: "Is het moeilijk om voorraadbeheer excel zelf te maken?",
      answer: "Nee, voorraadbeheer excel zelf maken is niet moeilijk als je de juiste stappen volgt. Wij bieden een eenvoudige handleiding die geschikt is voor beginners. Geen programmeerkennis vereist."
    },
    {
      question: "Welke voordelen heeft voorraadbeheer excel zelf maken?",
      answer: "Voorraadbeheer excel zelf maken geeft je volledige controle over je systeem, bespaart geld op dure software en leert je waardevolle Excel-vaardigheden. Je kunt het systeem precies aanpassen aan jouw behoeften."
    }
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer Excel Zelf Maken - Stapsgewijze Handleiding">
      <SEO
        title="Voorraadbeheer Excel Zelf Maken | Stapsgewijze Handleiding | stockflow"
        description="Leer hoe je voorraadbeheer excel zelf kunt maken. Stapsgewijze handleiding met formules, functies en templates. Gratis tutorial voor beginners."
        keywords="voorraadbeheer excel zelf maken, voorraadbeheer excel maken, voorraadbeheer excel stappenplan, voorraadbeheer excel handleiding, voorraadbeheer excel tutorial, voorraadbeheer excel formules, voorraadbeheer excel functies, voorraadbeheer excel beginners, voorraadbeheer excel opzetten, voorraadbeheer excel maken KMO, voorraadbeheer excel maken kleine onderneming, voorraadbeheer excel maken horeca"
        url="https://www.stockflow.be/voorraadbeheer-excel-zelf-maken"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-600">Voorraadbeheer Excel Zelf Maken</span> - Complete Handleiding
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Leer hoe je voorraadbeheer excel zelf kunt maken met onze stapsgewijze handleiding. 
                Ontdek welke Excel-functies je nodig hebt, hoe je formules opzet en hoe je een professioneel voorraadbeheer systeem bouwt. 
                Perfect voor KMO's en kleine ondernemingen die willen besparen op dure software.
              </p>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://rompslomp.nl/hs-fs/hubfs/voorraadbeheer.jpg?width=1200&height=800&name=voorraadbeheer.jpg" 
                  alt="Voorraadbeheer Excel Zelf Maken" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Excel Zelf Maken Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.greatplacetowork.ca/images/Asset_3.webp" 
                  alt="Excel Voorraadbeheer Zelf Maken" 
                  className="w-full h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Waarom voorraadbeheer excel zelf maken?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Voorraadbeheer excel zelf maken biedt vele voordelen ten opzichte van dure software. 
                Je krijgt volledige controle over je systeem, bespaart honderden euro's en leert waardevolle Excel-vaardigheden. 
                Bovendien kun je het systeem precies aanpassen aan jouw specifieke behoeften.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Kostenbesparing</h3>
                  <p className="text-gray-700">Voorraadbeheer excel zelf maken kost alleen je tijd. Geen dure software licenties of abonnementen nodig.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Volledige controle</h3>
                  <p className="text-gray-700">Je hebt volledige controle over alle functies en kunt het systeem precies aanpassen aan jouw behoeften.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Excel-vaardigheden</h3>
                  <p className="text-gray-700">Door voorraadbeheer excel zelf te maken leer je waardevolle Excel-vaardigheden die je ook voor andere doeleinden kunt gebruiken.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-start">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">
                Stapsgewijze handleiding: voorraadbeheer excel zelf maken
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Volg deze stappen om voorraadbeheer excel zelf te maken:
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">Stap 1: Basis structuur opzetten</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Begin met het maken van de basis kolommen: Product ID, Productnaam, Categorie, Voorraad, Minimum voorraad, 
                    Maximum voorraad, Prijs en Leverancier. Dit vormt de basis van je voorraadbeheer excel systeem.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">Stap 2: Formules toevoegen</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Voeg formules toe voor automatische berekeningen: voorraadwaarde (voorraad × prijs), 
                    bestelpuntmeldingen (IF-functie) en voorraadstatus. Deze formules maken je voorraadbeheer excel systeem intelligent.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">Stap 3: Voorraadbewegingen registreren</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Maak een aparte werkblad voor voorraadbewegingen met datum, product, type beweging (in/uit), 
                    hoeveelheid en nieuwe voorraad. Koppel dit aan je hoofdtabel met VLOOKUP functies.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-xl font-bold mb-3">Stap 4: Rapportages maken</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Maak draaitabellen en grafieken voor inzicht in voorraadniveaus, voorraadrotatie en 
                    bestelgeschiedenis. Deze rapportages helpen je bij het nemen van beslissingen.
                  </p>
                </div>
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://valuechain.be/media/images/20232316226515_shutterstock-1106078390.width-1292.webp" 
                  alt="Excel Stappenplan" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Excel Functions Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Belangrijke Excel-functies voor voorraadbeheer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Basis functies</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>SUM:</strong> Voorraad totalen berekenen</li>
                <li><strong>IF:</strong> Bestelpuntmeldingen maken</li>
                <li><strong>VLOOKUP:</strong> Productgegevens opzoeken</li>
                <li><strong>COUNTIF:</strong> Producten tellen per categorie</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Geavanceerde functies</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>SUMIF:</strong> Voorraadwaardes per categorie</li>
                <li><strong>INDEX/MATCH:</strong> Flexibele opzoekingen</li>
                <li><strong>DATEDIF:</strong> Voorraadrotatie berekenen</li>
                <li><strong>PivotTables:</strong> Dynamische rapportages</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Voordelen</span> van voorraadbeheer excel zelf maken
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Kostenbesparing</h3>
              <p className="text-gray-700">
                Bespaar honderden euro's op dure voorraadbeheer software. Voorraadbeheer excel zelf maken kost alleen je tijd 
                en Excel heb je waarschijnlijk al.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Volledige controle</h3>
              <p className="text-gray-700">
                Je hebt volledige controle over alle functies en kunt het systeem precies aanpassen aan jouw specifieke behoeften 
                en werkwijze.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Excel-vaardigheden</h3>
              <p className="text-gray-700">
                Door voorraadbeheer excel zelf te maken leer je waardevolle Excel-vaardigheden die je ook voor andere 
                bedrijfsprocessen kunt gebruiken.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Geen afhankelijkheid</h3>
              <p className="text-gray-700">
                Je bent niet afhankelijk van externe softwareleveranciers of internetverbindingen. 
                Je systeem werkt altijd, ook offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Template Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Download Onze Gratis Excel Template
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Wil je niet helemaal voorraadbeheer excel zelf maken? Download onze gratis template en pas deze aan aan jouw behoeften.
          </p>
          <Link
            to="/voorraadbeheer-excel-template-gratis"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-lg inline-block"
          >
            Download Gratis Template
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Begin Vandaag Met Voorraadbeheer Excel Zelf Maken
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden bedrijven die al profiteren van zelfgemaakte voorraadbeheer excel systemen. 
            Begin vandaag nog en bespaar honderden euro's op dure software.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Start Gratis Nu
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">Gratis handleiding • Geen creditcard vereist • Direct toegang</p>
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
            De beste handleiding voor voorraadbeheer excel zelf maken voor Vlaamse KMO's.
            Stapsgewijs, eenvoudig en kostenefficiënt.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Voorraadbeheer excel zelf maken voor Vlaamse KMO's.
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
        "@type": "Article",
        "headline": "Voorraadbeheer Excel Zelf Maken - Stapsgewijze Handleiding",
        "description": "Leer hoe je voorraadbeheer excel zelf kunt maken. Stapsgewijze handleiding met formules, functies en templates. Gratis tutorial voor beginners.",
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
          "@id": "https://www.stockflow.be/voorraadbeheer-excel-zelf-maken"
        },
        "datePublished": "2024-06-01",
        "dateModified": "2024-12-19"
      }`}} />
    </SeoPageLayout>
  );
}
