import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Utensils, Coffee, ChefHat } from 'lucide-react';

export default function VoorraadbeheerHoreca() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Waarom is voorraadbeheer voor horeca belangrijk?",
      answer: "Voorraadbeheer voor horeca is cruciaal om verspilling te voorkomen, kosten te besparen en te voldoen aan voedselveiligheidseisen. Het helpt je om houdbaarheidsdata te tracken, seizoensinvloeden te beheren en dagelijkse controle te optimaliseren."
    },
    {
      question: "Welke horeca types kunnen profiteren van voorraadbeheer?",
      answer: "Alle horeca types kunnen profiteren: restaurants (ingredi�nten en dranken), caf�s (dranken en snacks), bakkerijen (meel en ingredi�nten), en andere horeca ondernemingen. Voorraadbeheer voor horeca is geschikt voor elke grootte."
    },
    {
      question: "Hoe voorkom ik verspilling in de horeca?",
      answer: "Door houdbaarheidsdata te tracken, automatische meldingen in te stellen, dagelijkse controle te implementeren en seizoensinvloeden te beheren. Voorraadbeheer voor horeca helpt je om verspilling te minimaliseren en kosten te besparen."
    },
    {
      question: "Is voorraadbeheer voor horeca HACCP compliant?",
      answer: "Ja, moderne voorraadbeheer voor horeca oplossingen zijn HACCP compliant. Ze bieden traceerbaarheid, houdbaarheidscontrole en voedselveiligheid functies die voldoen aan de wettelijke eisen voor horeca ondernemingen."
    }
  ];

  const horecaTypes = [
    {
      name: "Restaurants",
      description: "Beheer ingredi�nten, dranken en voorraad",
      features: ["Ingredi�nten tracking", "Recept integratie", "Leverancier management"],
      icon: Utensils,
      color: "red"
    },
    {
      name: "Caf�s",
      description: "Focus op dranken en snacks",
      features: ["Dranken voorraad", "Snack management", "Dagelijkse controle"],
      icon: Coffee,
      color: "orange"
    },
    {
      name: "Bakkerijen",
      description: "Beheer meel, ingredi�nten en eindproducten",
      features: ["Ingredi�nten tracking", "Productie planning", "Houdbaarheid controle"],
      icon: ChefHat,
      color: "yellow"
    }
  ];



  return (
    <SeoPageLayout title="Voorraadbeheer voor Horeca">
      <SEO
        title="Voorraadbeheer voor Horeca | Restaurant & Caf� Stockbeheer | stockflow"
        description="Voorraadbeheer voor horeca: complete gids voor restaurants, caf�s en bakkers. Ontdek hoe je eenvoudig je horeca voorraad beheert, verspilling voorkomt en voldoet aan voedselveiligheidseisen."
        keywords="voorraadbeheer horeca, horeca voorraad, voorraadbeheer restaurant, voorraadbeheer caf�, voorraadbeheer bakker, horeca voorraad app, restaurant voorraadbeheer, caf� voorraadbeheer, bakker voorraadbeheer, horeca stockbeheer, voorraadbeheer keuken, horeca voorraad management, voorraadbeheer horeca software, horeca voorraad optimalisatie, voedselveiligheid voorraadbeheer, HACCP voorraadbeheer"
        url="https://www.stockflow.be/voorraadbeheer-voor-horeca"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-600">Voorraadbeheer voor Horeca</span> - Complete gids
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Voorraadbeheer voor horeca is essentieel voor restaurants, caf�s en bakkers. Ontdek hoe je eenvoudig je horeca voorraad beheert, verspilling voorkomt en voldoet aan voedselveiligheidseisen. Met voorraadbeheer voor horeca kun je kosten besparen, voedselveiligheid garanderen en je dagelijkse operaties optimaliseren.
              </p>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className=" rounded-lg text-center">
                <img 
                  src="https://rompslomp.nl/hs-fs/hubfs/voorraadbeheer.jpg?width=1200&height=800&name=voorraadbeheer.jpg" 
                  alt="Voorraadbeheer voor Horeca" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Voorraadbeheer voor Horeca Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className=" rounded-lg text-center">
                <img 
                  src="https://www.greatplacetowork.ca/images/Asset_3.webp" 
                  alt="Horeca Team" 
                  className="w-full h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Waarom voorraadbeheer voor horeca?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Voorraadbeheer voor horeca is cruciaal voor het succes van restaurants, caf�s en bakkerijen. Het helpt je om verspilling te voorkomen, kosten te besparen en te voldoen aan voedselveiligheidseisen. Met de juiste voorraadbeheer voor horeca oplossing kun je je dagelijkse operaties optimaliseren.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Voorkom verspilling met voorraadbeheer voor horeca</h3>
                  <p className="text-gray-700">Voorraadbeheer voor horeca helpt je om <span className="text-blue-600 font-semibold">verspilling</span> te minimaliseren door houdbaarheidsdata te tracken en automatische meldingen in te stellen.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Voedselveiligheid garanderen</h3>
                  <p className="text-gray-700">Voorraadbeheer voor horeca zorgt voor traceerbaarheid en houdbaarheidscontrole volgens HACCP richtlijnen.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Dagelijkse controle optimaliseren</h3>
                  <p className="text-gray-700">Voorraadbeheer voor horeca maakt dagelijkse controle eenvoudiger en effici�nter voor je keukenpersoneel.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horeca Types Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-start">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">
                Voorraadbeheer voor horeca - Verschillende types
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Voorraadbeheer voor horeca is geschikt voor alle horeca ondernemingen. Ontdek hoe verschillende types kunnen profiteren:
              </p>
              
              <div className="space-y-6">
                {horecaTypes.slice(0, 2).map((type, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold mb-3">{type.name}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {type.description} - {type.features.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className=" rounded-lg text-center">
                <img 
                  src="https://www.warehousingandfulfillment.com/wp-content/uploads/2020/04/Barcode-Scanning-Technologies.jpg" 
                  alt="Horeca Voorraad" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Starting with Stock Management Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Side - Large Image */}
            <div className="lg:col-span-2">
              <div className=" rounded-lg">
                <img 
                  src="https://valuechain.be/media/images/20232316226515_shutterstock-1106078390.width-1292.webp" 
                  alt="Horeca Keuken" 
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-6">
                Implementeer voorraadbeheer voor horeca stap voor stap
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Begin met het tracken van je belangrijkste ingredi�nten en dranken. Voeg geleidelijk meer producten toe en implementeer houdbaarheidscontrole. Voorraadbeheer voor horeca is geschikt voor bedrijven van alle groottes en kan direct worden toegepast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Voordelen</span> van voorraadbeheer voor horeca
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Kostenbesparing voor horeca</h3>
              <p className="text-gray-700">
                Voorraadbeheer voor horeca helpt je om verspilling te voorkomen en tot 30% te besparen op voorraadkosten. Door betere planning en controle van houdbaarheidsdata minimaliseer je verliezen en optimaliseer je je inkoop.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Voedselveiligheid en HACCP compliance</h3>
              <p className="text-gray-700">
                Voorraadbeheer voor horeca zorgt voor volledige traceerbaarheid en houdbaarheidscontrole. Voldoe aan HACCP richtlijnen en garandeer voedselveiligheid voor je klanten en inspecteurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Voorraadbeheer voor Horeca
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden Vlaamse horeca ondernemingen die al profiteren van professioneel voorraadbeheer voor horeca zonder kosten.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Start Gratis Nu
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">Geen creditcard vereist � Direct toegang � Nederlandse support</p>
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
            Voorraadbeheer voor horeca - Complete gids voor Vlaamse horeca ondernemingen.
            Eenvoudig, veilig en zonder verborgen kosten.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Voorraadbeheer voor horeca voor Vlaamse KMO's.
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
        "headline": "Voorraadbeheer voor Horeca | Restaurant & Caf� Stockbeheer",
        "description": "Voorraadbeheer voor horeca: complete gids voor restaurants, caf�s en bakkers. Ontdek hoe je eenvoudig je horeca voorraad beheert, verspilling voorkomt en voldoet aan voedselveiligheidseisen.",
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
          "@id": "https://www.stockflow.be/voorraadbeheer-voor-horeca"
        },
        "datePublished": "2024-06-01",
        "dateModified": "2024-12-19"
      }`}} />
    </SeoPageLayout>
  );
}
