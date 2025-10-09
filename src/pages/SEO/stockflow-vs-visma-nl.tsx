import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import ComparisonTable, { ComparisonFeature } from '@/components/ComparisonTable';
import { 
  ArrowRight, 
  CheckCircle, 
  DollarSign, 
  Smartphone, 
  Zap,
  Shield,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';
import { generateFAQSchema, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from '@/lib/structuredData';

export default function StockFlowVsVismaNL() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Gratis Plan Beschikbaar', stockflow: true, competitor: false },
    { feature: 'Mobiele App', stockflow: true, competitor: 'Beperkt' },
    { feature: 'Real-time Synchronisatie', stockflow: true, competitor: true },
    { feature: 'Multi-vestiging Ondersteuning', stockflow: true, competitor: 'Alleen Enterprise' },
    { feature: 'Barcode Scannen', stockflow: true, competitor: true },
    { feature: 'Lage Voorraad Meldingen', stockflow: true, competitor: true },
    { feature: 'Aangepaste Rapporten', stockflow: true, competitor: 'Beperkt' },
    { feature: 'Multi-gebruiker Toegang', stockflow: 'Onbeperkt', competitor: 'Betaalde tiers' },
    { feature: 'API Toegang', stockflow: true, competitor: 'Alleen Enterprise' },
    { feature: 'Belgische Markt Focus', stockflow: true, competitor: 'Noordse focus' },
    { feature: 'Nederlandse Taal Ondersteuning', stockflow: true, competitor: 'Beperkt' },
    { feature: 'Startprijs', stockflow: 'Gratis', competitor: '€50+/maand' },
  ];

  const faqData = [
    {
      question: "Wat is het belangrijkste verschil tussen StockFlow en Visma?",
      answer: "StockFlow biedt een gratis plan en is specifiek ontworpen voor Belgische en Nederlandse KMO's met volledige native taalondersteuning. Visma richt zich vooral op Noordse markten met hogere prijzen vanaf €50+/maand en beperkte ondersteuning voor Belgische bedrijven."
    },
    {
      question: "Is StockFlow beter dan Visma voor kleine bedrijven?",
      answer: "Voor kleine bedrijven in België en Nederland is StockFlow vaak de betere keuze vanwege het gratis tier, lokale support, volledige Nederlandse interface en functies specifiek ontworpen voor KMO's. Visma is doorgaans duurder en geoptimaliseerd voor grotere Noordse ondernemingen."
    },
    {
      question: "Kan ik migreren van Visma naar StockFlow?",
      answer: "Ja, u kunt gemakkelijk migreren van Visma naar StockFlow. Ons team kan u helpen met het importeren van uw productgegevens, klanten en voorraadhistorie. Het migratieproces duurt meestal minder dan een dag voor de meeste bedrijven."
    },
    {
      question: "Heeft StockFlow dezelfde functies als Visma?",
      answer: "StockFlow biedt alle essentiële voorraadbeheer functies inclusief multi-locatie ondersteuning, barcode scannen, real-time tracking en geavanceerde rapportage. Hoewel Visma meer enterprise-gerichte functies heeft, biedt StockFlow alles wat KMO's nodig hebben voor een fractie van de kosten."
    },
    {
      question: "Hoeveel kan ik besparen door over te stappen van Visma naar StockFlow?",
      answer: "De meeste kleine bedrijven besparen €600-1200 per jaar door over te stappen van Visma naar StockFlow. Met ons gratis plan voor maximaal 30 producten en premium plannen vanaf €29/maand zijn de besparingen aanzienlijk vergeleken met Visma's €50+/maand startprijs."
    }
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Betere Prijzen',
      description: 'Start gratis met maximaal 30 producten. Premium plannen vanaf €29/maand. Visma rekent minimaal €50+/maand.',
    },
    {
      icon: Shield,
      title: 'Belgische Focus',
      description: 'Ontworpen voor Belgische en Nederlandse bedrijven met lokale support en compliance. Visma richt zich op Noordse markten.',
    },
    {
      icon: Smartphone,
      title: 'Superieure Mobiele App',
      description: 'Volledig functionele mobiele app met offline modus. Beheer voorraad overal, altijd.',
    },
    {
      icon: Users,
      title: 'Onbeperkt Gebruikers',
      description: 'Voeg uw hele team toe zonder kosten per gebruiker. Werk samen zonder extra kosten.',
    },
    {
      icon: Zap,
      title: 'Snellere Implementatie',
      description: 'Start in enkele minuten met onze intuïtieve interface. Geen complexe ERP implementatie vereist.',
    },
    {
      icon: TrendingUp,
      title: 'Beter voor KMO\'s',
      description: 'Speciaal gebouwd voor kleine en middelgrote bedrijven. Niet over-engineered voor enterprises.',
    },
  ];

  // Structured Data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.stockflow.be', position: 1 },
    { name: 'Vergelijkingen', url: 'https://www.stockflow.be', position: 2 },
    { name: 'StockFlow vs Visma', url: 'https://www.stockflow.be/nl/stockflow-vs-visma', position: 3 }
  ]);

  const faqSchema = generateFAQSchema(faqData);

  const softwareSchema = generateSoftwareApplicationSchema({
    name: 'StockFlow - Voorraadbeheer',
    description: 'Gratis voorraadbeheer software voor Belgische en Nederlandse KMO\'s',
    category: 'BusinessApplication',
    operatingSystem: 'Web Browser, iOS, Android',
    price: '0',
    currency: 'EUR',
    rating: { value: '4.8', count: '32' },
    url: 'https://www.stockflow.be',
    image: 'https://www.stockflow.be/Inventory-Management.png'
  });

  return (
    <SeoPageLayout title="StockFlow vs Visma">
      <SEO
        title="StockFlow vs Visma: Welke is Beter voor Belgische KMO's in 2025?"
        description="Vergelijk StockFlow en Visma voorraadbeheer software. Bekijk functies, prijzen en waarom StockFlow de betere keuze is voor Belgische bedrijven. Start vandaag gratis."
        keywords="stockflow vs visma, visma alternatief, voorraadbeheer België, visma vs stockflow, gratis voorraadbeheer software, Belgische voorraadbeheer software"
        url="https://www.stockflow.be/nl/stockflow-vs-visma"
        locale="nl"
        hreflang={[
          { lang: "en", url: "https://www.stockflow.be/stockflow-vs-visma" },
          { lang: "nl", url: "https://www.stockflow.be/nl/stockflow-vs-visma" }
        ]}
        structuredData={[breadcrumbSchema, faqSchema, softwareSchema]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              StockFlow vs Visma: <span className="text-blue-600">De Complete Vergelijking</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Keuze maken tussen StockFlow en Visma voor voorraadbeheer? 
              Ontdek waarom Belgische bedrijven kiezen voor StockFlow vanwege betere prijzen, 
              lokale support en KMO-gerichte functies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Probeer StockFlow Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/pricing" 
                className="inline-flex items-center justify-center bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Bekijk Prijzen
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Gratis</div>
              <div className="text-gray-600">StockFlow Startprijs</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">€50+</div>
              <div className="text-gray-600">Visma Startprijs</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">€600+</div>
              <div className="text-gray-600">Jaarlijkse Besparing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Functie-voor-Functie <span className="text-blue-600">Vergelijking</span>
            </h2>
            <p className="text-xl text-gray-600">
              Zie hoe StockFlow en Visma scoren op belangrijke functies
            </p>
          </div>
          
          <ComparisonTable 
            features={comparisonFeatures}
            competitorName="Visma"
          />
        </div>
      </section>

      {/* Why Choose StockFlow */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Waarom Belgische Bedrijven Kiezen voor <span className="text-blue-600">StockFlow</span>
            </h2>
            <p className="text-xl text-gray-600">
              Gebouwd voor de Belgische en Nederlandse markten met lokale ondersteuning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prijs <span className="text-blue-600">Vergelijking</span>
            </h2>
            <p className="text-xl text-gray-600">
              Transparante prijzen die u geld besparen
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* StockFlow Pricing */}
            <div className="border-4 border-blue-600 rounded-lg p-8 bg-blue-50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">StockFlow</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">Gratis - €29</div>
                <div className="text-gray-600">per maand</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Gratis tier: Tot 30 producten</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Premium: €29/maand onbeperkt producten</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Onbeperkt gebruikers inbegrepen</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Mobiele app inbegrepen</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Nederlandse taal ondersteuning</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span>Belgische klantenondersteuning</span>
                </li>
              </ul>
              <Link 
                to="/auth"
                className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Gratis Proefperiode
              </Link>
            </div>

            {/* Visma Pricing */}
            <div className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Visma</h3>
                <div className="text-4xl font-bold text-gray-700 mb-2">€50+</div>
                <div className="text-gray-600">per maand (minimum)</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Geen gratis tier</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Vanaf €50+/maand</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Kosten per gebruiker</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Mobiele app extra kosten</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Beperkte Nederlandse support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  <span>Noordse-gerichte ondersteuning</span>
                </li>
              </ul>
              <a 
                href="https://www.visma.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Bezoek Visma
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Veelgestelde <span className="text-blue-600">Vragen</span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-gray-900">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Klaar om over te Stappen van Visma?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit u aan bij honderden Belgische bedrijven die tijd en geld besparen met StockFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/auth"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Gratis Proefperiode
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Contact Verkoop
            </Link>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}

