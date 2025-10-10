import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

import { StructuredData } from '../../components/StructuredData';
export default function VoorraadbeheerHoreca() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat is voorraadbeheer voor horeca?",
      answer: "Voorraadbeheer voor horeca is het beheren van voedsel, dranken en andere benodigdheden in restaurants, cafés en hotels. Het omvat het bijhouden van houdbaarheidsdata, het voorkomen van verspilling en het optimaliseren van menuplanning."
    },
    {
      question: "Waarom is voorraadbeheer belangrijk voor horeca?",
      answer: "Voorraadbeheer is cruciaal voor horeca omdat het verspilling voorkomt, kosten bespaart en ervoor zorgt dat je altijd de juiste ingrediënten beschikbaar hebt. Het helpt ook bij het voldoen aan voedselveiligheidsregelgeving."
    },
    {
      question: "Hoe kan voorraadbeheer software helpen in de horeca?",
      answer: "Voorraadbeheer software helpt horeca-ondernemers door automatische meldingen bij lage voorraad, houdbaarheidsdata bij te houden, menuplanning te optimaliseren en verspilling te minimaliseren."
    },
    {
      question: "Is er speciale voorraadbeheer software voor horeca?",
      answer: "Ja, stockflow biedt specifieke functies voor horeca zoals houdbaarheidsdata tracking, menuplanning en integratie met leveranciers. Dit maakt het ideaal voor restaurants, cafés en hotels."
    },
    {
      question: "Hoe voorkom ik verspilling in mijn horeca-bedrijf?",
      answer: "Door gebruik te maken van voorraadbeheer software kun je verspilling voorkomen door betere planning, houdbaarheidsdata bij te houden en automatische meldingen te krijgen wanneer producten bijna verlopen."
    }
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer voor Horeca">
      <SEO
        title="Voorraadbeheer Horeca 2024 | Voorkom Verspilling & Bespaar 20% | stockflow"
        description="⭐ Horeca voorraadbeheer software die verspilling voorkomt. Houdbaarheidsdata tracking, menuplanning & automatische meldingen. Gratis starten!"
        keywords="voorraadbeheer horeca, horeca voorraadbeheer, voorraadbeheer restaurant, voorraadbeheer café, voorraadbeheer hotel, horeca software, restaurant software, voedselverspilling voorkomen, menuplanning, houdbaarheidsdata, stockflow, gratis voorraadbeheer horeca"
        url="https://www.stockflow.be/voorraadbeheer-horeca"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-blue-600">Voorraadbeheer Horeca 2024</span> | Voorkom Verspilling & Bespaar 20%
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                ⭐ Horeca voorraadbeheer software die verspilling voorkomt. Houdbaarheidsdata tracking, menuplanning & automatische meldingen. Bespaar tot 20% op voedselkosten. Perfect voor restaurants, cafés en hotels. Gratis starten!
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Bekijk ook: <Link to="/nl/voorraadbeheer-bakkerij" className="text-blue-600 hover:underline">Voorraadbeheer voor Bakkerijen</Link>, <Link to="/nl/voorraadbeheer-tips" className="text-blue-600 hover:underline">Voorraadbeheer Tips</Link>, of <Link to="/nl" className="text-blue-600 hover:underline">terug naar homepage</Link>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-center"
                >
                  Start Gratis Nu
                </Link>
                <Link
                  to="/nl/voorraadbeheer-software"
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
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Horeca Voorraadbeheer" 
                  className="w-full max-w-sm sm:max-w-md lg:w-96 h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Horeca Voorraadbeheer Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Restaurant Keuken" 
                  className="w-full h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                Waarom is voorraadbeheer cruciaal voor horeca?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Voorraadbeheer voor horeca is complexer dan in andere sectoren. Je moet rekening houden met houdbaarheidsdata, seizoensgebonden producten, menuplanning en voedselveiligheid. Goed voorraadbeheer voorkomt verspilling, bespaart kosten en zorgt ervoor dat je klanten altijd de beste kwaliteit krijgen.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Voorkom voedselverspilling</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Houd houdbaarheidsdata bij en krijg meldingen voordat producten verlopen, zodat je verspilling kunt voorkomen.</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-green-800 mb-2">Optimaliseer menuplanning</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Plan je menu's op basis van beschikbare ingrediënten en voorkom tekorten tijdens service.</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-purple-800 mb-2">Bespaar op kosten</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Door betere planning en minder verspilling kun je tot 20% besparen op je inkoopkosten.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horeca Specific Features Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Speciale functies</span> voor horeca voorraadbeheer
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Ontdek de horeca-specifieke functies die je voorraadbeheer naar het volgende niveau tillen
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Houdbaarheidsdata Tracking</h3>
              <p className="text-gray-700">
                Houd de houdbaarheidsdata van al je producten bij en krijg automatische meldingen voordat ze verlopen. Voorkom verspilling en voedselveiligheidsproblemen.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Menuplanning Integratie</h3>
              <p className="text-gray-700">
                Plan je menu's op basis van beschikbare ingrediënten en voorkom tekorten tijdens service. Optimaliseer je recepten en kosten.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Seizoensgebonden Planning</h3>
              <p className="text-gray-700">
                Plan je voorraad op basis van seizoenen en trends. Pas je menu's aan op basis van beschikbaarheid en prijzen van ingrediënten.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Leverancier Beheer</h3>
              <p className="text-gray-700">
                Houd je leveranciers bij en vergelijk prijzen. Optimaliseer je bestelprocessen en onderhandel betere deals.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Kostenanalyse</h3>
              <p className="text-gray-700">
                Analyseer je voedselkosten per gerecht en optimaliseer je winstmarges. Houd je budgetten bij en identificeer besparingsmogelijkheden.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Mobiele App</h3>
              <p className="text-gray-700">
                Beheer je voorraad onderweg met onze mobiele app. Perfect voor chefs en managers die altijd toegang nodig hebben tot hun voorraadgegevens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Horeca Tips Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Praktische tips</span> voor horeca voorraadbeheer
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">1. Organiseer je koeling volgens FIFO</h3>
              <p className="text-gray-700">
                Gebruik het "First In, First Out" principe. Plaats nieuwe producten achter de oude om verspilling te voorkomen en voedselveiligheid te waarborgen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">2. Stel minimum- en maximumvoorraad in</h3>
              <p className="text-gray-700">
                Bepaal voor elk product het minimum niveau (wanneer je moet bestellen) en maximum niveau (hoeveel je maximaal wilt hebben) om tekorten en overstock te voorkomen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">3. Houd rekening met seizoenen</h3>
              <p className="text-gray-700">
                Pas je voorraad aan op basis van seizoenen en lokale evenementen. Plan je menu's op basis van beschikbaarheid en prijzen van ingrediënten.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">4. Train je personeel</h3>
              <p className="text-gray-700">
                Zorg dat al je medewerkers weten hoe ze de voorraadbeheer software moeten gebruiken. Dit voorkomt fouten en zorgt voor consistente data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Horeca Voorraadbeheer
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden horeca-ondernemers die al profiteren van onze voorraadbeheer software. Begin vandaag nog met het optimaliseren van je horeca voorraadbeheer.
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
            Voorraadbeheer software speciaal voor horeca.
            Voorkom verspilling, bespaar kosten.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Voorraadbeheer voor horeca.
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
          "headline": "Voorraadbeheer voor Horeca: Tips & Gratis Software",
          "description": "Optimaliseer je horeca voorraadbeheer met onze gratis software. Voorkom verspilling, bespaar kosten en verbeter je menuplanning.",
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
            "@id": "https://www.stockflow.be/voorraadbeheer-horeca"
          },
          "datePublished": "2024-06-01",
          "dateModified": "2024-12-19"
        }
      ]} />
    </SeoPageLayout>
  );
}