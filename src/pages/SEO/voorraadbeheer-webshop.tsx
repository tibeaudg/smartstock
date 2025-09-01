import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { Globe, ShoppingCart, Settings, Bell, Shield, BarChart3, TrendingUp } from 'lucide-react';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function VoorraadbeheerWebshop() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Waarom is voorraadbeheer voor webshops belangrijk?",
      answer: "Voorraadbeheer voor webshops is cruciaal om nee-verkoop te voorkomen, klanttevredenheid te verhogen en dubbele administratie te vermijden. Het zorgt voor automatische synchronisatie tussen je webshop en magazijn."
    },
    {
      question: "Welke webshop platforms ondersteunt voorraadbeheer?",
      answer: "Voorraadbeheer voor webshops ondersteunt alle populaire platforms: WooCommerce, Shopify, Magento, en andere e-commerce systemen. De integratie zorgt voor automatische synchronisatie van voorraad."
    },
    {
      question: "Hoe voorkom ik nee-verkoop in mijn webshop?",
      answer: "Door automatische synchronisatie tussen je voorraadbeheer systeem en webshop. Voorraadbeheer voor webshops zorgt ervoor dat je webshop altijd de juiste voorraad toont en automatische meldingen geeft bij lage voorraad."
    },
    {
      question: "Kan ik multi-channel verkoop beheren met voorraadbeheer?",
      answer: "Ja, voorraadbeheer voor webshops ondersteunt multi-channel verkoop. Je kunt voorraad beheren voor webshop, marktplaats, fysieke verkoop en andere kanalen vanuit ��n systeem."
    }
  ];

  const integrations = [
    {
      name: "WooCommerce",
      description: "Perfect voor WordPress webshops",
      features: ["Automatische synchronisatie", "Real-time voorraad updates", "Order integratie"],
      icon: Globe
    },
    {
      name: "Shopify",
      description: "Ideaal voor groeiende webshops",
      features: ["API integratie", "Automatische meldingen", "Multi-channel support"],
      icon: ShoppingCart
    },
    {
      name: "Magento",
      description: "Voor enterprise webshops",
      features: ["Geavanceerde integratie", "Custom workflows", "Multi-store support"],
      icon: Settings
    }
  ];

  const challenges = [
    {
      title: "Nee-verkoop voorkomen",
      description: "Automatische synchronisatie zorgt ervoor dat je webshop altijd de juiste voorraad toont.",
      icon: Bell,
      color: "red"
    },
    {
      title: "Dubbele administratie",
      description: "E�n systeem voor zowel je webshop als je magazijn voorkomt fouten.",
      icon: Shield,
      color: "blue"
    },
    {
      title: "Voorraad optimalisatie",
      description: "Analyseer je verkoopcijfers om je inkoop te optimaliseren.",
      icon: BarChart3,
      color: "green"
    },
    {
      title: "Multi-channel verkoop",
      description: "Beheer voorraad voor webshop, marktplaats en fysieke verkoop.",
      icon: TrendingUp,
      color: "purple"
    }
  ];

  const benefits = [
    "Automatische synchronisatie tussen webshop en magazijn",
    "Real-time voorraad updates",
    "Voorkom nee-verkoop en klachten",
    "Bespaar tijd op administratie",
    "Betere klanttevredenheid",
    "Geoptimaliseerde inkoop",
    "Multi-channel voorraadbeheer",
    "Automatische meldingen bij lage voorraad"
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer voor Webshops">
      <SEO
        title="Voorraadbeheer voor Webshops | E-commerce Stockbeheer | stockflow"
        description="Voorraadbeheer voor webshops: complete gids met integraties en automatisering. Ontdek hoe je als e-commerce ondernemer je webshopvoorraad effici�nt beheert en nee-verkoop voorkomt."
        keywords="voorraadbeheer webshop, e-commerce voorraad, webshop voorraadbeheer, voorraad integratie, voorraad automatiseren, webshop voorraad app, e-commerce stockbeheer, webshop voorraad synchronisatie, voorraadbeheer e-commerce, webshop voorraad optimalisatie, voorraadbeheer online shop, e-commerce voorraadbeheer software, webshop voorraad management, voorraadbeheer webshop integratie"
        url="https://www.stockflow.be/voorraadbeheer-webshop"
      />

      {/* Hero Section - Split Layout */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-600">Voorraadbeheer voor Webshops</span> - Complete gids
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Als webshop is goed voorraadbeheer essentieel. Met de juiste tools en integraties voorkom je nee-verkoop en houd je altijd zicht op je voorraad. Voorraadbeheer voor webshops zorgt voor automatische synchronisatie tussen je webshop en magazijn.
              </p>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className=" rounded-lg text-center">
                <img 
                  src="https://rompslomp.nl/hs-fs/hubfs/voorraadbeheer.jpg?width=1200&height=800&name=voorraadbeheer.jpg" 
                  alt="Voorraadbeheer voor Webshops" 
                  className="w-96 h-96 mx-auto object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Voorraadbeheer voor Webshops Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className=" rounded-lg text-center">
                <img 
                  src="https://www.greatplacetowork.ca/images/Asset_3.webp" 
                  alt="E-commerce Team" 
                  className="w-full h-96 mx-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                Waarom voorraadbeheer voor webshops?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Voorraadbeheer voor webshops is cruciaal voor het succes van e-commerce ondernemingen. Het voorkomt nee-verkoop, verhoogt klanttevredenheid en elimineert dubbele administratie. Met automatische synchronisatie tussen je webshop en magazijn werk je effici�nter.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Voorkom nee-verkoop met voorraadbeheer voor webshops</h3>
                  <p className="text-gray-700">Voorraadbeheer voor webshops helpt je om <span className="text-blue-600 font-semibold">nee-verkoop</span> te voorkomen door automatische synchronisatie tussen webshop en magazijn.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Automatische synchronisatie</h3>
                  <p className="text-gray-700">Voorraadbeheer voor webshops zorgt voor real-time updates tussen je webshop en magazijn systeem.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Multi-channel verkoop beheren</h3>
                  <p className="text-gray-700">Voorraadbeheer voor webshops ondersteunt verkoop via meerdere kanalen vanuit ��n systeem.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 items-start">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">
                Voorraadbeheer voor webshops - Platform integraties
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Voorraadbeheer voor webshops ondersteunt alle populaire e-commerce platforms:
              </p>
              
              <div className="space-y-6">
                {integrations.slice(0, 2).map((integration, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold mb-3">{integration.name}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {integration.description} - {integration.features.join(', ')}
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
                  alt="Webshop Integratie" 
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
                  alt="E-commerce Magazijn" 
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-6">
                Implementeer voorraadbeheer voor webshops stap voor stap
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Begin met het koppelen van je webshop aan je voorraadbeheer systeem. Configureer automatische synchronisatie en stel meldingen in voor lage voorraad. Voorraadbeheer voor webshops is geschikt voor bedrijven van alle groottes.
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
              <span className="text-blue-600">Voordelen</span> van voorraadbeheer voor webshops
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Automatische synchronisatie</h3>
              <p className="text-gray-700">
                Voorraadbeheer voor webshops zorgt voor automatische synchronisatie tussen je webshop en magazijn. Real-time updates voorkomen nee-verkoop en zorgen voor betere klanttevredenheid.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Multi-channel verkoop beheren</h3>
              <p className="text-gray-700">
                Voorraadbeheer voor webshops ondersteunt verkoop via meerdere kanalen. Beheer voorraad voor webshop, marktplaats, fysieke verkoop en andere kanalen vanuit ��n systeem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Voorraadbeheer voor Webshops
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden Vlaamse webshop ondernemers die al profiteren van professioneel voorraadbeheer voor webshops zonder kosten.
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
            Voorraadbeheer voor webshops - Complete gids voor Vlaamse e-commerce ondernemingen.
            Eenvoudig, veilig en zonder verborgen kosten.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Voorraadbeheer voor webshops voor Vlaamse KMO's.
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
        "headline": "Voorraadbeheer voor Webshops | E-commerce Stockbeheer",
        "description": "Voorraadbeheer voor webshops: complete gids met integraties en automatisering. Ontdek hoe je als e-commerce ondernemer je webshopvoorraad effici�nt beheert en nee-verkoop voorkomt.",
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
