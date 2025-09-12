import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function VoorraadbeheerExcel() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Kan ik voorraadbeheer doen in Excel?",
      answer: "Ja, je kunt voorraadbeheer in Excel doen, maar het heeft beperkingen. Excel is geschikt voor kleine bedrijven met weinig producten, maar voor groeiende bedrijven is gespecialiseerde voorraadbeheer software veel efficiënter."
    },
    {
      question: "Wat zijn de nadelen van voorraadbeheer in Excel?",
      answer: "Excel heeft geen real-time updates, geen automatische meldingen, beperkte rapportage en is gevoelig voor fouten. Het is ook moeilijk om met meerdere mensen tegelijk te werken en mist geavanceerde functies zoals barcode scanning."
    },
    {
      question: "Is er een gratis Excel template voor voorraadbeheer?",
      answer: "Ja, er zijn verschillende Excel templates beschikbaar, maar ze hebben allemaal dezelfde beperkingen als Excel zelf. Voor betere resultaten raden we aan om over te stappen naar gespecialiseerde voorraadbeheer software zoals stockflow."
    },
    {
      question: "Wanneer moet ik overstappen van Excel naar voorraadbeheer software?",
      answer: "Overstappen is aan te raden wanneer je meer dan 50 producten hebt, met meerdere mensen werkt, real-time updates nodig hebt, of geavanceerde rapportage wilt. Ook als je veel tijd verliest aan handmatige updates."
    },
    {
      question: "Kan ik mijn Excel data importeren in voorraadbeheer software?",
      answer: "Ja, de meeste voorraadbeheer software, inclusief stockflow, ondersteunt het importeren van Excel data. Dit maakt de overstap veel eenvoudiger en je verliest geen historische data."
    }
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer in Excel vs Software">
      <SEO
        title="Voorraadbeheer in Excel vs Software: Wat is Beter? | stockflow"
        description="Vergelijk voorraadbeheer in Excel met gespecialiseerde software. Ontdek waarom Excel beperkt is en hoe software je tijd bespaart. Gratis Excel template beschikbaar."
        keywords="voorraadbeheer excel, stockbeheer excel, voorraadbeheer in excel, excel voorraadbeheer, voorraadbeheer excel template, gratis excel template, voorraadbeheer software vs excel, excel vs software, stockflow, voorraadbeheer software"
        url="https://www.stockflow.be/voorraadbeheer-excel"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-blue-600">Voorraadbeheer in Excel</span> vs Software: Wat is beter?
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                Vergelijk voorraadbeheer in Excel met gespecialiseerde software. Ontdek waarom Excel beperkt is en hoe voorraadbeheer software je tijd bespaart, fouten voorkomt en je bedrijf laat groeien. Download ook onze gratis Excel template.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-center"
                >
                  Probeer Software Gratis
                </Link>
                <Link
                  to="/voorraadbeheer-excel-template-gratis"
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
                >
                  Download Excel Template
                </Link>
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Excel vs Software" 
                  className="w-full max-w-sm sm:max-w-md lg:w-96 h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Vergelijking</span> Excel vs Voorraadbeheer Software
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Ontdek de belangrijkste verschillen tussen voorraadbeheer in Excel en gespecialiseerde software
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Excel Column */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-red-600">Voorraadbeheer in Excel</h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-red-800">Voordelen</h4>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Bekend en toegankelijk</li>
                    <li>• Geen extra kosten</li>
                    <li>• Flexibel aanpasbaar</li>
                    <li>• Geschikt voor kleine bedrijven</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-red-800">Nadelen</h4>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Geen real-time updates</li>
                    <li>• Gevoelig voor fouten</li>
                    <li>• Beperkte rapportage</li>
                    <li>• Geen automatische meldingen</li>
                    <li>• Moeilijk om samen te werken</li>
                    <li>• Geen barcode scanning</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Software Column */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-green-600">Voorraadbeheer Software</h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800">Voordelen</h4>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Real-time updates</li>
                    <li>• Automatische meldingen</li>
                    <li>• Geavanceerde rapportage</li>
                    <li>• Barcode scanning</li>
                    <li>• Multi-user toegang</li>
                    <li>• Mobiele app</li>
                    <li>• Integratie mogelijkheden</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800">Nadelen</h4>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Leercurve voor nieuwe gebruikers</li>
                    <li>• Maandelijkse kosten (meestal)</li>
                    <li>• Internetverbinding vereist</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When to Switch Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                Wanneer moet je overstappen van Excel naar software?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Excel is prima voor kleine bedrijven met weinig producten, maar er komt een moment dat je moet overstappen naar gespecialiseerde voorraadbeheer software. Hier zijn de belangrijkste signalen:
              </p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Je hebt meer dan 50 producten</h3>
                  <p className="text-sm text-gray-700">Excel wordt onoverzichtelijk en foutgevoelig bij grote aantallen producten.</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Meerdere mensen werken met de data</h3>
                  <p className="text-sm text-gray-700">Excel is niet geschikt voor gelijktijdige toegang door meerdere gebruikers.</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Je verliest veel tijd aan handmatige updates</h3>
                  <p className="text-sm text-gray-700">Software automatiseert veel processen en bespaart je uren per week.</p>
                </div>
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Business Growth" 
                  className="w-full h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits of Software Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Voordelen</span> van voorraadbeheer software
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Tijdbesparing</h3>
              <p className="text-gray-700">
                Bespaar tot 70% tijd op voorraadbeheer door automatisering. Geen handmatige updates meer nodig, automatische meldingen en real-time synchronisatie.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Foutreductie</h3>
              <p className="text-gray-700">
                Elimineer menselijke fouten door geautomatiseerde processen. Barcode scanning voorkomt verkeerde productregistraties.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Betere Rapportage</h3>
              <p className="text-gray-700">
                Krijg gedetailleerde rapporten over voorraadprestaties, best verkopende producten en voorraadrotatie. Inzichten die Excel niet kan bieden.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Schaalbaarheid</h3>
              <p className="text-gray-700">
                Groei mee met je bedrijf. Van 30 producten tot duizenden - software schaalt automatisch mee zonder prestatieverlies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Klaar om te Overstappen van Excel naar Software?
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Probeer stockflow gratis en ervaar het verschil. Importeer je Excel data en begin direct met efficiënter voorraadbeheer.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Start Gratis Nu
            </Link>
            <Link
              to="/voorraadbeheer-excel-template-gratis"
              className="border border-blue-600 text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-base md:text-lg"
            >
              Download Excel Template
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
            Voorraadbeheer software vs Excel.
            Kies voor efficiëntie en groei.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Voorraadbeheer software voor Vlaamse KMO's.
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
        "headline": "Voorraadbeheer in Excel vs Software: Wat is Beter?",
        "description": "Vergelijk voorraadbeheer in Excel met gespecialiseerde software. Ontdek waarom Excel beperkt is en hoe software je tijd bespaart.",
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
          "@id": "https://www.stockflow.be/voorraadbeheer-excel"
        },
        "datePublished": "2024-06-01",
        "dateModified": "2024-12-19"
      }`}} />
    </SeoPageLayout>
  );
}
