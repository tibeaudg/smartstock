import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function VoorraadbeheerWebshop() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat is voorraadbeheer voor webshops?",
      answer: "Voorraadbeheer voor webshops is het beheren van je online voorraad om ervoor te zorgen dat je klanten altijd kunnen bestellen wat ze willen. Het omvat real-time voorraadupdates, automatische bestelmeldingen en integratie met je webshop."
    },
    {
      question: "Waarom is voorraadbeheer belangrijk voor webshops?",
      answer: "Voorraadbeheer is cruciaal voor webshops omdat het voorkomt dat klanten producten bestellen die niet op voorraad zijn. Dit voorkomt teleurstellingen, verhoogt klantentevredenheid en voorkomt verlies van omzet."
    },
    {
      question: "Hoe kan voorraadbeheer software helpen voor webshops?",
      answer: "Voorraadbeheer software helpt webshops door automatische voorraadupdates, real-time synchronisatie met je webshop, automatische bestelmeldingen en gedetailleerde rapportages over je best verkopende producten."
    },
    {
      question: "Is er speciale voorraadbeheer software voor webshops?",
      answer: "Ja, stockflow biedt specifieke functies voor webshops zoals real-time synchronisatie, automatische voorraadupdates en integratie met populaire webshop platforms. Dit maakt het ideaal voor e-commerce bedrijven."
    },
    {
      question: "Hoe voorkom ik uitverkochte producten in mijn webshop?",
      answer: "Door gebruik te maken van voorraadbeheer software kun je uitverkochte producten voorkomen door automatische meldingen bij lage voorraad, real-time voorraadupdates en betere planning van je bestellingen."
    }
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer voor Webshops">
      <SEO
        title="Voorraadbeheer Webshop 2024 | Voorkom Uitverkochte Producten & Verhoog Omzet | stockflow"
        description="🛒 Webshop voorraadbeheer software die uitverkochte producten voorkomt. Real-time sync, automatische updates & omzet optimalisatie. Gratis starten!"
        keywords="voorraadbeheer webshop, webshop voorraadbeheer, voorraadbeheer e-commerce, webshop software, e-commerce software, uitverkochte producten voorkomen, real-time voorraad, webshop automatisering, stockflow, gratis voorraadbeheer webshop, webshop optimalisatie"
        url="https://www.stockflow.be/voorraadbeheer-webshop"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-blue-600">Voorraadbeheer voor Webshops</span> - Voorkom uitverkochte producten, verhoog omzet
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                Optimaliseer je webshop voorraadbeheer met onze gratis software. Voorkom uitverkochte producten, verhoog je omzet en verbeter je klantentevredenheid. Speciaal ontwikkeld voor e-commerce bedrijven om je voorraadbeheer naar het volgende niveau te tillen.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Ook interessant: <Link to="/nl/voorraadbeheer-voor-starters" className="text-blue-600 hover:underline">Voorraadbeheer voor Starters</Link>, <Link to="/nl/mobiel-voorraadbeheer" className="text-blue-600 hover:underline">Mobiel Voorraadbeheer</Link>, of <Link to="/nl" className="text-blue-600 hover:underline">ontdek alle oplossingen</Link>.
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
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Webshop Voorraadbeheer" 
                  className="w-full max-w-sm sm:max-w-md lg:w-96 h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Webshop Voorraadbeheer Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="E-commerce Platform" 
                  className="w-full h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                Waarom is voorraadbeheer cruciaal voor webshops?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Voorraadbeheer voor webshops is essentieel voor het succes van je e-commerce bedrijf. Je moet ervoor zorgen dat je klanten altijd kunnen bestellen wat ze willen, zonder teleurstellingen door uitverkochte producten. Goed voorraadbeheer verhoogt je omzet, verbetert klantentevredenheid en voorkomt verlies van verkoopkansen.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Voorkom uitverkochte producten</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Houd real-time voorraad bij en voorkom dat klanten producten bestellen die niet op voorraad zijn.</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-green-800 mb-2">Verhoog je omzet</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Door betere voorraadbeheer kun je meer verkopen en je omzet verhogen met tot 30%.</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-purple-800 mb-2">Verbeter klantentevredenheid</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Klanten zijn tevreden wanneer ze kunnen bestellen wat ze willen, wanneer ze het willen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Webshop Specific Features Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Speciale functies</span> voor webshop voorraadbeheer
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Ontdek de webshop-specifieke functies die je voorraadbeheer naar het volgende niveau tillen
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Real-time Synchronisatie</h3>
              <p className="text-gray-700">
                Synchroniseer je voorraad in real-time met je webshop. Elke verkoop wordt direct bijgewerkt in je voorraadbeheer systeem.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Automatische Voorraadupdates</h3>
              <p className="text-gray-700">
                Je voorraad wordt automatisch bijgewerkt bij elke verkoop, retour of aanpassing. Geen handmatige updates meer nodig.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Bestelmeldingen</h3>
              <p className="text-gray-700">
                Krijg automatische meldingen wanneer je voorraad onder het minimum niveau komt, zodat je op tijd kunt bestellen.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Verkooprapportages</h3>
              <p className="text-gray-700">
                Analyseer je best verkopende producten, seizoenspatronen en trends om je voorraad te optimaliseren.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Multi-Locations Support</h3>
              <p className="text-gray-700">
                Beheer voorraad op meerdere Locationss en synchroniseer alles met je webshop voor een naadloze ervaring.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Integratie Mogelijkheden</h3>
              <p className="text-gray-700">
                Integreer met populaire webshop platforms zoals Shopify, WooCommerce en Magento voor een naadloze workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Webshop Tips Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Praktische tips</span> voor webshop voorraadbeheer
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">1. Stel realistische voorraadniveaus in</h3>
              <p className="text-gray-700">
                Bepaal voor elk product het minimum niveau (wanneer je moet bestellen) en maximum niveau (hoeveel je maximaal wilt hebben) om tekorten en overstock te voorkomen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">2. Monitor je best verkopende producten</h3>
              <p className="text-gray-700">
                Houd bij welke producten het best verkopen en zorg dat je daar altijd voldoende voorraad van hebt. Dit voorkomt verlies van omzet.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">3. Gebruik seizoensgebonden planning</h3>
              <p className="text-gray-700">
                Pas je voorraad aan op basis van seizoenen en trends. Plan je bestellingen op basis van verwachte verkoop en seizoenspatronen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">4. Automatiseer je processen</h3>
              <p className="text-gray-700">
                Gebruik voorraadbeheer software om je processen te automatiseren. Dit voorkomt fouten en bespaart tijd.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Webshop Voorraadbeheer
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden webshop eigenaren die al profiteren van onze voorraadbeheer software. Begin vandaag nog met het optimaliseren van je webshop voorraadbeheer.
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
            Voorraadbeheer software speciaal voor webshops.
            Voorkom uitverkochte producten, verhoog omzet.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Voorraadbeheer voor webshops.
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
        "headline": "Voorraadbeheer voor Webshops: Tips & Gratis Software",
        "description": "Optimaliseer je webshop voorraadbeheer met onze gratis software. Voorkom uitverkochte producten, verhoog omzet en verbeter klantentevredenheid.",
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
          "@id": "https://www.stockflow.be/voorraadbeheer-webshop"
        },
        "datePublished": "2024-06-01",
        "dateModified": "2024-12-19"
      }`}} />
    </SeoPageLayout>
  );
}