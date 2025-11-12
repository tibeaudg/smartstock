import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Gauge,
  Layers,
  Shield,
  Star
} from 'lucide-react';

const vergelijking = [
  {
    titel: 'Gebruiksgemak',
    stockflow: 'Intuïtieve interface, mobiele apps en barcode scanning. Geen complexe instellingen nodig.',
    exact: 'Exact Online richt zich op boekhouding en ERP. Voorraadmodules vergen extra training en inrichting.'
  },
  {
    titel: 'Kostenstructuur',
    stockflow: 'Gratis plan tot 30 producten en vaste prijs per maand zonder gebruikerslimiet.',
    exact: 'Licentiekosten lopen op per gebruiker en module. Voor geavanceerd voorraadbeheer zijn extra pakketten nodig.'
  },
  {
    titel: 'Automatisering',
    stockflow: 'Automatische bestellingen, alerts en goedkeuringsflows ingebouwd.',
    exact: 'Automatisering is mogelijk maar vaak via maatwerk of consultants.'
  },
  {
    titel: 'Integraties',
    stockflow: 'Koppelt met Exact Online, Shopify, WooCommerce, Lightspeed en meer.',
    exact: 'Exact biedt eigen integraties maar minder focus op omnichannel voorraadbeheer.'
  },
  {
    titel: 'Support & Lokalisatie',
    stockflow: 'Nederlandstalige ondersteuning, EU-hosting en snelle onboarding.',
    exact: 'Uitgebreide support, maar vaak gericht op finance teams en met langere responstijden.'
  }
];

export default function StockflowVsExactOnlineNl() {
  usePageRefresh();

  return (
    <SeoPageLayout title="StockFlow vs Exact Online">
      <SEO
        title="StockFlow vs Exact Online | Voorraadbeheer voor KMO's"
        description="Ontdek het verschil tussen StockFlow en Exact Online voor voorraadbeheer. Vergelijk gebruiksgemak, kosten en automatisering in het Nederlands."
        keywords="stockflow vs exact online, exact voorraad alternatief, exact online voorraadbeheer, stockflow nederland"
        url="https://www.stockflow.be/stockflow-vs-exact-online-nl"
        locale="nl"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                StockFlow vs Exact Online{' '}
                <span className="text-blue-600">Wat past bij jouw KMO?</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Exact Online is sterk in boekhouding. StockFlow focust op realtime voorraadbeheer voor groeiende teams. Bekijk de belangrijkste verschillen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Probeer StockFlow gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Bekijk prijzen
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">KMO&apos;s in België en Nederland</span>
              </div>
            </div>
            <div>
              <img src="/Inventory-Management.png" alt="StockFlow vs Exact Online" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Vergelijking in een oogopslag</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Categorie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">StockFlow</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Exact Online</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {vergelijking.map((row, index) => (
                  <tr key={index} className="align-top">
                    <td className="px-6 py-5 text-sm font-semibold text-gray-700">{row.titel}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{row.stockflow}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{row.exact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Waarom teams voor StockFlow kiezen</h2>
            <p className="text-lg opacity-90 mb-6">
              StockFlow combineert voorraad, inkoop en fulfilment in één oplossing. Finance kan eenvoudig blijven werken in Exact Online terwijl operations realtime inzicht houdt in de voorraad.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Snelle onboarding, geen consultants nodig.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Volledige traceerbaarheid dankzij mobiel scannen en audit trails.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Automatische herbevoorrading en goedkeuringsflows.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Gebruik StockFlow naast Exact Online voor het beste van twee werelden.</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <h3 className="text-2xl font-semibold">StockFlow in cijfers</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-start gap-2">
                <Gauge className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Implementatie</p>
                <p className="text-xl font-semibold">Binnen 2 weken live</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Clock className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Automatisering</p>
                <p className="text-xl font-semibold">Tot 70% minder administratie</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <BarChart3 className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Integraties</p>
                <p className="text-xl font-semibold">Exact, Shopify, POS & meer</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Layers className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Schaalbaarheid</p>
                <p className="text-xl font-semibold">Meerdere magazijnen & kanalen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Werk samen met finance</h3>
            <p className="text-gray-600">
              Laat finance in Exact Online werken en koppel StockFlow voor realtime voorraad. Gegevens worden automatisch gesynchroniseerd.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Geschikt voor KMO&apos;s</h3>
            <p className="text-gray-600">
              Geen complexe ERP implementatie. StockFlow groeit mee met je team, zonder verrassingen in kosten of contracten.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Plan een gratis proefperiode</h2>
          <p className="text-xl mb-8 opacity-90">
            Ervaar hoe snel je voorraadprocessen kunt automatiseren zonder de complexiteit van een volledig ERP.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}


