import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Gift, Zap, Shield, Users, TrendingUp, Star, BarChart3, Smartphone, Calculator, Package } from 'lucide-react';

export default function BoekhoudprogrammaMetVoorraadbeheer() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat is een boekhoudprogramma met voorraadbeheer?",
      answer: "Een boekhoudprogramma met voorraadbeheer is een geïntegreerd systeem dat zowel je boekhouding als je voorraadbeheer combineert in één platform. Dit betekent dat je facturen, kosten en inkomsten automatisch kunt koppelen aan je voorraadbewegingen, wat zorgt voor nauwkeurige financiële rapportages en efficiënt voorraadbeheer."
    },
    {
      question: "Waarom zou ik kiezen voor een boekhoudprogramma met voorraadbeheer?",
      answer: "Een boekhoudprogramma met voorraadbeheer bespaart je tijd en voorkomt fouten door automatische synchronisatie tussen je voorraad en boekhouding. Je hoeft niet meer handmatig gegevens over te typen tussen systemen, en je krijgt altijd nauwkeurige financiële rapportages die rekening houden met je voorraadkosten en -waarden."
    },
    {
      question: "Is een boekhoudprogramma met voorraadbeheer geschikt voor kleine bedrijven?",
      answer: "Ja, een boekhoudprogramma met voorraadbeheer is perfect voor kleine bedrijven en KMO's. Het helpt je om professioneel te werken zonder de complexiteit van grote ERP-systemen. Je kunt beginnen met de basis functies en uitbreiden naarmate je bedrijf groeit."
    },
    {
      question: "Kan ik mijn bestaande boekhouding importeren in een boekhoudprogramma met voorraadbeheer?",
      answer: "Ja, de meeste boekhoudprogramma's met voorraadbeheer ondersteunen import van bestaande boekhoudgegevens. Je kunt je huidige facturen, klanten, leveranciers en voorraadgegevens importeren, zodat je niet opnieuw hoeft te beginnen."
    },
    {
      question: "Hoe veilig is mijn financiële data in een boekhoudprogramma met voorraadbeheer?",
      answer: "Een goed boekhoudprogramma met voorraadbeheer gebruikt enterprise-grade beveiliging met SSL-versleuteling, dagelijkse back-ups en GDPR-compliance. Je financiële data is altijd veilig en beschermd tegen verlies. We nemen de veiligheid van jouw bedrijfsgegevens zeer serieus."
    }
  ];

  const features = [
    {
      icon: Calculator,
      title: "Geïntegreerde Boekhouding",
      description: "Beheer je facturen, kosten en inkomsten direct gekoppeld aan je voorraadbewegingen."
    },
    {
      icon: Package,
      title: "Voorraadbeheer",
      description: "Beheer je voorraad efficiënt met real-time inzicht in stockniveaus en automatische bestelmeldingen."
    },
    {
      icon: BarChart3,
      title: "Financiële Rapportages",
      description: "Krijg direct inzicht in je winstgevendheid, voorraadkosten en cashflow met uitgebreide rapportages."
    },
    {
      icon: Zap,
      title: "Automatische Synchronisatie",
      description: "Voorraadbewegingen worden automatisch gekoppeld aan je boekhouding voor nauwkeurige financiële rapportages."
    },
    {
      icon: Shield,
      title: "Veilig & Betrouwbaar",
      description: "Enterprise-grade beveiliging met dagelijkse back-ups. Je financiële data is altijd veilig in de cloud."
    },
    {
      icon: Users,
      title: "Team Samenwerking",
      description: "Werk samen met je team in het boekhoudprogramma met voorraadbeheer. Verschillende gebruikersrollen mogelijk."
    }
  ];

  const benefits = [
    "Geen dubbele administratie meer",
    "Automatische synchronisatie tussen voorraad en boekhouding",
    "Nauwkeurige financiële rapportages",
    "Tijd besparen door geïntegreerd systeem",
    "Minder fouten door automatische koppelingen",
    "Real-time inzicht in winstgevendheid",
    "Eenvoudige facturering gekoppeld aan voorraad",
    "Professionele boekhouding zonder complexiteit"
  ];

  const integrationFeatures = [
    {
      title: "Facturering",
      description: "Maak facturen direct gekoppeld aan je voorraad. Voorraad wordt automatisch afgetrokken bij verkoop.",
      icon: "📄"
    },
    {
      title: "Inkoop",
      description: "Registreer inkoopfacturen en koppel deze aan je voorraad. Voorraad wordt automatisch bijgewerkt.",
      icon: "🛒"
    },
    {
      title: "Voorraadwaardering",
      description: "Automatische berekening van voorraadwaarde en kostprijs van verkochte goederen.",
      icon: "💰"
    },
    {
      title: "Rapportages",
      description: "Financiële rapportages die rekening houden met je voorraadkosten en -waarden.",
      icon: "📊"
    }
  ];

  return (
    <SeoPageLayout title="Boekhoudprogramma met Voorraadbeheer - Geïntegreerd Systeem">
      <SEO
        title="Boekhoudprogramma met Voorraadbeheer | Geïntegreerd Systeem | stockflow"
        description="Ontdek het beste boekhoudprogramma met voorraadbeheer voor Vlaamse KMO's. Geïntegreerd systeem dat boekhouding en voorraadbeheer combineert. Start vandaag!"
        keywords="boekhoudprogramma met voorraadbeheer, boekhouding voorraadbeheer, geïntegreerd boekhoudsysteem, boekhoudprogramma voorraad, boekhouding stockbeheer, boekhoudprogramma KMO, boekhouding kleine bedrijven, boekhoudprogramma belgië, boekhouding vlaanderen, boekhoudprogramma horeca, boekhouding webshop, boekhoudprogramma detailhandel, boekhouding starters, boekhoudprogramma stockflow"
        url="https://www.stockflow.be/boekhoudprogramma-met-voorraadbeheer"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Boekhoudprogramma met Voorraadbeheer</span>
                <span className="block text-emerald-100">Geïntegreerd Systeem</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Het enige boekhoudprogramma met voorraadbeheer dat specifiek ontwikkeld is voor Vlaamse bedrijven. 
                Combineer je boekhouding en voorraadbeheer in één geïntegreerd systeem voor maximale efficiëntie.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Geïntegreerd</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Automatisch</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Real-time</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Professioneel</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition text-center"
                >
                  Start Gratis Nu
                </Link>
                <Link
                  to="/demo-aanvragen"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition text-center"
                >
                  Demo Aanvragen
                </Link>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/optimized/desktop.png" 
                alt="Boekhoudprogramma met Voorraadbeheer" 
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Waarom kiezen voor een <span className="text-emerald-600">boekhoudprogramma met voorraadbeheer?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Het enige boekhoudprogramma met voorraadbeheer dat alles biedt wat je nodig hebt voor professioneel bedrijfsbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-emerald-600">Voordelen</span> van een boekhoudprogramma met voorraadbeheer
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Een boekhoudprogramma met voorraadbeheer is specifiek ontwikkeld voor Vlaamse KMO's. 
                Ontdek waarom honderden bedrijven al kiezen voor een geïntegreerd systeem.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-emerald-800">Voor Starters</h3>
                  <ul className="space-y-3">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-emerald-800">Voor Groeiende Bedrijven</h3>
                  <ul className="space-y-3">
                    {benefits.slice(4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/optimized/image.png" 
                alt="Boekhoudprogramma Interface" 
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Integration Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Hoe werkt de <span className="text-emerald-600">integratie</span> tussen boekhouding en voorraadbeheer?
            </h2>
            <p className="text-lg text-gray-600">
              Ontdek hoe een boekhoudprogramma met voorraadbeheer je bedrijfsprocessen automatiseert
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Hoe werkt een <span className="text-emerald-600">boekhoudprogramma met voorraadbeheer?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Start binnen 5 minuten met professioneel geïntegreerd bedrijfsbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Account Aanmaken</h3>
              <p className="text-gray-600">
                Maak in 2 minuten een gratis account aan. Geen creditcard nodig, geen verplichtingen.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Systeem Inrichten</h3>
              <p className="text-gray-600">
                Stel je boekhouding en voorraadbeheer in. Importeer bestaande gegevens en begin direct.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Geïntegreerd Beheren</h3>
              <p className="text-gray-600">
                Beheer je boekhouding en voorraad in één systeem. Alles wordt automatisch gesynchroniseerd.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Waarom kiezen <span className="text-emerald-600">3200+ Vlaamse KMO's</span> voor een boekhoudprogramma met voorraadbeheer?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "Het beste boekhoudprogramma met voorraadbeheer dat ik ooit heb gebruikt. Alles in één systeem!"
              </p>
              <div className="font-bold">Laura Peeters</div>
              <div className="text-sm text-gray-500">Eigenaar, De Koffieboetiek - Gent</div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "Eindelijk geen dubbele administratie meer. Het boekhoudprogramma met voorraadbeheer is fantastisch!"
              </p>
              <div className="font-bold">Tom De Wit</div>
              <div className="text-sm text-gray-500">Zaakvoerder, TechOnderdelen BV - Antwerpen</div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "Als klein bedrijf is dit boekhoudprogramma met voorraadbeheer perfect. Aanrader!"
              </p>
              <div className="font-bold">Anke Willems</div>
              <div className="text-sm text-gray-500">Manager, Creatief Atelier - Brugge</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Veelgestelde vragen over een <span className="text-emerald-600">boekhoudprogramma met voorraadbeheer</span>
            </h2>
            <p className="text-lg text-gray-600">
              Alles wat je moet weten over een geïntegreerd boekhoudsysteem
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Een Boekhoudprogramma met Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij honderden Vlaamse KMO's die al profiteren van een geïntegreerd systeem. 
            Geen dubbele administratie meer, alles in één platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition text-center"
            >
              Start Gratis Nu
            </Link>
            <Link
              to="/demo-aanvragen"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition text-center"
            >
              Demo Aanvragen
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-75">
            Geen creditcard vereist • Direct toegang • Nederlandse support
          </p>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Meer lezen over boekhouding en voorraadbeheer?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-emerald-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Voorraadbeheer Software
                </h3>
                <p className="text-gray-600 text-sm">
                  Ontdek alle functies van onze voorraadbeheer software en hoe het je bedrijf kan helpen.
                </p>
              </div>
            </Link>
            <Link to="/gratis-voorraadbeheer" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-emerald-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Gratis Voorraadbeheer
                </h3>
                <p className="text-gray-600 text-sm">
                  Alles over gratis voorraadbeheer voor KMO's en hoe je kunt starten.
                </p>
              </div>
            </Link>
            <Link to="/voorraadbeheer-tips" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-emerald-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Voorraadbeheer Tips
                </h3>
                <p className="text-gray-600 text-sm">
                  Praktische tips voor efficiënt voorraadbeheer en kostenbesparing.
                </p>
              </div>
            </Link>
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
            Het beste boekhoudprogramma met voorraadbeheer voor Vlaamse KMO's. 
            Geïntegreerd, efficiënt en professioneel.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Boekhoudprogramma met voorraadbeheer voor Vlaamse KMO's.
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
        "name": "stockflow - Boekhoudprogramma met Voorraadbeheer",
        "description": "Het beste boekhoudprogramma met voorraadbeheer voor Vlaamse KMO's. Geïntegreerd systeem dat boekhouding en voorraadbeheer combineert voor maximale efficiëntie.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": "100% gratis boekhoudprogramma met voorraadbeheer voor KMO's"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "32"
        },
        "author": {"@type": "Organization", "name": "stockflow"},
        "publisher": {"@type": "Organization", "name": "stockflow", "logo": {"@type": "ImageObject", "url": "https://www.stockflow.be/logo.png"}},
        "image": "https://www.stockflow.be/optimized/desktop.png",
        "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/boekhoudprogramma-met-voorraadbeheer"}
      }`}} />
    </SeoPageLayout>
  );
}
