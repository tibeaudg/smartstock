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

export default function StockFlowVsSortlyNL() {
  usePageRefresh();

  const comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Gratis Plan Beschikbaar', stockflow: true, competitor: 'Beperkt (14 dagen proef)' },
    { feature: 'Mobiele App', stockflow: true, competitor: true },
    { feature: 'Real-time Synchronisatie', stockflow: true, competitor: true },
    { feature: 'Multi-vestiging Ondersteuning', stockflow: true, competitor: 'Alleen Enterprise' },
    { feature: 'Barcode Scannen', stockflow: true, competitor: true },
    { feature: 'Lage Voorraad Meldingen', stockflow: true, competitor: true },
    { feature: 'Aangepaste Rapporten', stockflow: true, competitor: 'Beperkt' },
    { feature: 'Multi-gebruiker Toegang', stockflow: 'Onbeperkt', competitor: 'Betaalde plannen' },
    { feature: 'API Toegang', stockflow: true, competitor: 'Alleen Enterprise' },
    { feature: 'Europese Data Hosting', stockflow: true, competitor: false },
    { feature: 'Nederlandse Taal Ondersteuning', stockflow: true, competitor: false },
    { feature: 'Vanaf Prijs', stockflow: 'Gratis', competitor: '$29/maand' },
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Betere Prijzen',
      description: 'Start gratis met maximaal 30 producten. Geen creditcard vereist. Sortly rekent minimaal $29/maand.',
    },
    {
      icon: Smartphone,
      title: 'Mobiel-First Design',
      description: 'Volledige mobiele app met offline modus. Beheer voorraad vanaf elke locatie.',
    },
    {
      icon: Shield,
      title: 'Europese Privacy',
      description: 'AVG-compliant met data hosting in Europa. Jouw gegevens blijven beschermd.',
    },
    {
      icon: Users,
      title: 'Onbeperkt Gebruikers',
      description: 'Voeg je hele team toe zonder per-gebruiker kosten. Samenwerken zonder grenzen.',
    },
    {
      icon: Zap,
      title: 'Snellere Setup',
      description: 'Binnen enkele minuten aan de slag, niet uren. Geen complexe configuratie nodig.',
    },
    {
      icon: TrendingUp,
      title: 'Beter voor Groei',
      description: 'Schaal naadloos mee terwijl je groeit. Geen geforceerde upgrades of verborgen kosten.',
    },
  ];

  return (
    <SeoPageLayout title="StockFlow vs Sortly">
      <SEO
        title="StockFlow vs Sortly: Welke Voorraadbeheer Software is Beter in 2025?"
        description="Vergelijk StockFlow en Sortly voorraadbeheer software. Bekijk functies, prijzen, en waarom StockFlow de betere keuze is voor KMO's. Start vandaag gratis."
        keywords="stockflow vs sortly, sortly alternatief, voorraadbeheer software vergelijking, sortly vs stockflow, beste voorraad app, gratis voorraad software"
        url="https://www.stockflow.be/nl/stockflow-vs-sortly"
        hreflang={[
          { lang: "nl", url: "https://www.stockflow.be/nl/stockflow-vs-sortly" },
          { lang: "en", url: "https://www.stockflow.be/stockflow-vs-sortly" }
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              StockFlow vs Sortly: <span className="text-blue-600">De Complete Vergelijking</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Keuze maken tussen StockFlow en Sortly voor voorraadbeheer? 
              Ontdek waarom duizenden bedrijven kiezen voor StockFlow vanwege betere prijzen, 
              een gratis plan, en krachtige functies.
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
                Bekijk Prijzen
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
              <span className="text-sm text-gray-600">500+ Tevreden Bedrijven</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Snelle Vergelijking: StockFlow vs Sortly
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Beide zijn solide voorraadbeheer oplossingen, maar StockFlow biedt betere waarde 
            voor kleine tot middelgrote bedrijven met zijn gratis tier en Europese data hosting.
          </p>
          <ComparisonTable 
            competitorName="Sortly" 
            features={comparisonFeatures}
          />
        </div>
      </section>

      {/* Why Choose StockFlow */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Waarom Kiezen voor StockFlow in Plaats van Sortly?
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
            Prijzen: StockFlow vs Sortly
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-blue-500 rounded-lg p-8 bg-blue-50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">StockFlow</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">Gratis</div>
                <p className="text-gray-600">Tot 30 producten</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Onbeperkte gebruikers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Mobiele app inbegrepen</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Real-time synchronisatie</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Barcode scannen</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Geen creditcard vereist</span>
                </li>
              </ul>
              <Link 
                to="/auth"
                className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Gratis
              </Link>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Sortly</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$29/mnd</div>
                <p className="text-gray-600">Alleen 14 dagen proef</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Beperkte gebruikers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Mobiele app inbegrepen</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Cloud synchronisatie</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Barcode scannen</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Creditcard vereist</span>
                </li>
              </ul>
              <div className="block w-full text-center bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
                Vanaf $29/mnd
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Migration Guide */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Hoe Overstappen van Sortly naar StockFlow
          </h2>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Exporteer je data uit Sortly</h3>
                  <p className="text-gray-600">
                    Exporteer je voorraadgegevens als CSV vanuit Sortly's exportfunctie.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Maak een StockFlow account</h3>
                  <p className="text-gray-600">
                    Maak je gratis StockFlow account aan - geen creditcard nodig.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Importeer je data</h3>
                  <p className="text-gray-600">
                    Gebruik onze CSV import tool om je voorraadgegevens snel over te zetten.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Start met voorraadbeheer</h3>
                  <p className="text-gray-600">
                    Je bent klaar! Download de mobiele app en begin met tracken.
                  </p>
                </div>
              </div>
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
              <h3 className="font-semibold text-lg mb-2">Is StockFlow echt gratis?</h3>
              <p className="text-gray-600">
                Ja! StockFlow is gratis voor maximaal 30 producten met onbeperkt gebruikers. 
                Geen creditcard vereist, geen proefperiode - het is voor altijd gratis.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Kan ik data importeren vanuit Sortly?</h3>
              <p className="text-gray-600">
                Ja, je kunt je data exporteren uit Sortly als CSV en importeren in StockFlow 
                met onze CSV import functie.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Heeft StockFlow een mobiele app?</h3>
              <p className="text-gray-600">
                Ja! StockFlow heeft volledig uitgeruste mobiele apps voor iOS en Android met offline ondersteuning, 
                barcode scannen, en real-time synchronisatie.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Waar worden mijn gegevens opgeslagen?</h3>
              <p className="text-gray-600">
                StockFlow host alle data in Europese datacenters, wat zorgt voor AVG-compliance 
                en data soevereiniteit. Sortly slaat data op in de VS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar om Over te Stappen naar StockFlow?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij honderden bedrijven die overstapten van Sortly naar StockFlow. 
            Start vandaag gratis - geen creditcard vereist.
          </p>
          <Link 
            to="/auth" 
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Start Gratis Proefperiode
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "StockFlow vs Sortly: Complete Vergelijking 2025",
          "description": "Vergelijk StockFlow en Sortly voorraadbeheer software. Functies, prijzen, en migratie gids.",
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
        })
      }} />
    </SeoPageLayout>
  );
}

