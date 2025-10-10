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
  Target,
  Star
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function StockFlowVsExactOnlineNL() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Gratis Plan Beschikbaar', stockflow: true, competitor: false },
    { feature: 'Mobiele App', stockflow: true, competitor: 'Beperkt' },
    { feature: 'Gemakkelijke Setup', stockflow: true, competitor: false },
    { feature: 'KMO-gericht', stockflow: true, competitor: false },
    { feature: 'Barcode Scannen', stockflow: true, competitor: 'Extra module' },
    { feature: 'Real-time Voorraad', stockflow: true, competitor: true },
    { feature: 'Multi-vestiging Ondersteuning', stockflow: true, competitor: true },
    { feature: 'Boekhoud Integratie', stockflow: 'Via API', competitor: 'Ingebouwd' },
    { feature: 'Leercurve', stockflow: 'Eenvoudig', competitor: 'Steil' },
    { feature: 'Nederlandse Taal', stockflow: true, competitor: true },
    { feature: 'Vanaf Prijs', stockflow: 'Gratis', competitor: '€255/maand' },
    { feature: 'Contract Vereist', stockflow: false, competitor: true },
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Veel Lagere Kosten',
      description: 'Start gratis vs €255/maand voor Exact Online. Bespaar duizenden euro\'s per jaar op voorraadbeheer.',
    },
    {
      icon: Zap,
      title: 'Simpel & Snel',
      description: 'Binnen minuten opgezet, niet weken. Geen complexe training of consultants nodig.',
    },
    {
      icon: Target,
      title: 'Gemaakt voor KMO\'s',
      description: 'Specifiek ontworpen voor kleine bedrijven. Geen afgeslankte enterprise oplossing.',
    },
    {
      icon: Smartphone,
      title: 'Echte Mobiele Ervaring',
      description: 'Volledig uitgeruste mobiele app. Exact Online mobiel is beperkt vergeleken met desktop.',
    },
    {
      icon: Users,
      title: 'Geen Verborgen Kosten',
      description: 'Transparante prijzen zonder verrassingen. Exact Online heeft veel extra modules en toeslagen.',
    },
    {
      icon: Shield,
      title: 'Flexibel & Wendbaar',
      description: 'Geen langetermijncontracten. Stop wanneer je wilt. Exact vereist meestal jaarcontracten.',
    },
  ];

  return (
    <SeoPageLayout title="StockFlow vs Exact Online">
      <SEO
        title="StockFlow vs Exact Online: Betaalbaar Voorraad Alternatief 2025"
        description="Vergelijk StockFlow en Exact Online voor voorraadbeheer. StockFlow biedt dezelfde functies voor een fractie van de kosten. Perfect voor KMO's. Start gratis."
        keywords="stockflow vs exact online, exact online alternatief, voorraadbeheer software, goedkoop exact alternatief, voorraadbeheer kmo"
        url="https://www.stockflow.be/nl/stockflow-vs-exact-online"
        hreflang={[
          { lang: "nl", url: "https://www.stockflow.be/nl/stockflow-vs-exact-online" },
          { lang: "en", url: "https://www.stockflow.be/stockflow-vs-exact-online" }
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              StockFlow vs Exact Online: <span className="text-blue-600">Het Betaalbare Alternatief</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Krachtig voorraadbeheer zonder het enterprise prijskaartje. 
              StockFlow biedt de functies die KMO's nodig hebben, gratis in plaats van €255/maand.
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
                className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Vergelijk Prijzen
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">5.0/5</span>
              </div>
              <span className="text-sm text-gray-600">|</span>
              <span className="text-sm text-gray-600">Vertrouwd door 500+ Bedrijven</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Difference Highlight */}
      <section className="py-12 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">€0</div>
              <p className="text-lg">StockFlow Startprijs</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">vs</div>
              <p className="text-lg opacity-90">Vergelijk</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">€255/mnd</div>
              <p className="text-lg">Exact Online Minimum</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Functievergelijking: StockFlow vs Exact Online
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Exact Online is een uitgebreid ERP-systeem, maar voor pure voorraadbeheer 
            levert StockFlow wat KMO's echt nodig hebben zonder de complexiteit en kosten.
          </p>
          <ComparisonTable 
            competitorName="Exact Online" 
            features={comparisonFeatures}
          />
        </div>
      </section>

      {/* Why Choose StockFlow */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Waarom Kleine Bedrijven Kiezen voor StockFlow in Plaats van Exact Online
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Echte Kostenvergelijking: StockFlow vs Exact Online
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-blue-500 rounded-lg p-8 bg-blue-50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">StockFlow</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">€0</div>
                <p className="text-gray-600">Voor altijd gratis tot 30 producten</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Volledig voorraadbeheer</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Mobiele app inbegrepen</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Barcode scannen</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Multi-vestiging ondersteuning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Geen setup kosten</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Geen contracten</span>
                </li>
              </ul>
              <Link 
                to="/auth"
                className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Nu Gratis
              </Link>
              <p className="text-center text-sm text-gray-600 mt-4">
                <strong>Jaarlijkse besparing:</strong> €3.060+ vergeleken met Exact Online
              </p>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Exact Online</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">€255/mnd</div>
                <p className="text-gray-600">Minimum voor voorraadmodule</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Volledig ERP-systeem</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Beperkte mobiele functies</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Barcode (extra kosten)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Multi-vestiging (hoger plan)</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Implementatiekosten</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Meestal jaarcontract</span>
                </li>
              </ul>
              <div className="block w-full text-center bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
                Vanaf €255/maand
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Plus implementatie & training kosten
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Choose Each */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Welke Oplossing Past bij Jou?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Kies StockFlow als je:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Alleen voorraadbeheer nodig hebt (niet volledige ERP)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Een klein tot middelgroot bedrijf bent</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Meteen wilt starten zonder complexe setup</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Een echte mobiel-first oplossing nodig hebt</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Langetermijncontracten wilt vermijden</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Een beperkt budget hebt</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Kies Exact Online als je:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Een compleet ERP-systeem nodig hebt (boekhouding, salarisadministratie, CRM)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Een grotere onderneming bent met complexe behoeften</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Budget hebt voor implementatieconsultants</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Diepe boekhoudintegratie nodig hebt</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Tijd kunt investeren in training en setup</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Exact al gebruikt voor boekhouding</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Veelgestelde Vragen
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Kan StockFlow Exact Online vervangen voor voorraad?</h3>
              <p className="text-gray-600">
                Voor voorraadbeheer specifiek, ja. StockFlow biedt alle voorraad functies 
                die KMO's nodig hebben van Exact Online. Als je echter een volledige ERP 
                (boekhouding, salarisadministratie, etc.) nodig hebt, is Exact Online uitgebreider.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Kan ik StockFlow integreren met mijn boekhoudsoftware?</h3>
              <p className="text-gray-600">
                Ja, StockFlow biedt API-toegang voor integratie met boekhoudsoftware. Je kunt ook 
                data exporteren naar Excel/CSV voor handmatige imports.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Hoeveel kan ik besparen door over te stappen naar StockFlow?</h3>
              <p className="text-gray-600">
                Exact Online begint bij €255/maand (€3.060/jaar). StockFlow is gratis voor kleine bedrijven 
                of begint bij veel lagere prijzen, waardoor je potentieel duizenden euro's per jaar bespaart.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Is StockFlow even betrouwbaar als Exact Online?</h3>
              <p className="text-gray-600">
                Ja. StockFlow gebruikt enterprise-grade infrastructuur met 99.9% uptime, automatische backups, 
                en Europese data hosting. We zijn gebouwd specifiek voor betrouwbaarheid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bespaar Duizenden Euro's op Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Krijg de voorraad functies die je nodig hebt zonder het enterprise prijskaartje. 
            Start vandaag gratis - geen creditcard of contract vereist.
          </p>
          <Link 
            to="/auth" 
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Probeer StockFlow Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
                  "@context": "https://schema.org",
                  "@type": "Article",
                  "headline": "StockFlow vs Exact Online: Betaalbaar Voorraad Alternatief 2025",
                  "description": "Vergelijk StockFlow en Exact Online voor voorraadbeheer. Bekijk functies, prijzen, en waarom StockFlow beter is voor KMO's.",
                  "author": {
                    "@type": "Organization",
                    "name": "StockFlow"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "StockFlow",
                    "logo": {
                      "@type": "ImageObject",
                      "url": "https://www.stockflow.be/logo.png"
                    }
                  },
                  "datePublished": "2025-01-01",
                  "dateModified": "2025-01-01",
                  "inLanguage": "nl"
                }
      ]} />
    </SeoPageLayout>
  );
}

