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
    titel: 'Focus van het platform',
    stockflow: 'StockFlow is gebouwd voor voorraadbeheer, fulfilment en operationele teams.',
    visma: 'Visma ERP richt zich op finance en administratie. Voorraadmodules zijn aanvullend en complexer.'
  },
  {
    titel: 'Implementatie',
    stockflow: 'Snelle onboarding, volledig in de cloud. Geen consultants vereist.',
    visma: 'Implementeer je meestal met partners en maatwerk. Duurt langer en vergt hogere investering.'
  },
  {
    titel: 'Kosten',
    stockflow: 'Transparante maandprijzen. Vrij aantal gebruikers en locaties.',
    visma: 'Licenties per module, gebruiker en soms per vestiging. Kosten lopen snel op.'
  },
  {
    titel: 'Automatisering',
    stockflow: 'Automatische alerts, workflows en integraties met webshop, POS en boekhouding.',
    visma: 'Automatisering mogelijk maar vaak via maatwerk of aanvullende licenties.'
  },
  {
    titel: 'Ondersteuning',
    stockflow: 'Nederlandstalige support, EU-hosting en directe toegang tot productteam.',
    visma: 'Ondersteuning verloopt via partners of tickets met langere wachttijden.'
  }
];

export default function StockflowVsVismaNl() {
  usePageRefresh();

  return (
    <SeoPageLayout title="StockFlow vs Visma">
      <SEO
        title="StockFlow vs Visma | Voorraadbeheer vergelijking"
        description="Vergelijk StockFlow met Visma voor voorraadbeheer. Ontdek het verschil in implementatie, prijs en automatisering voor KMO’s."
        keywords="stockflow vs visma, visma voorraad alternatief, visma voorraadbeheer, stockflow nederland"
        url="https://www.stockflow.be/stockflow-vs-visma-nl"
        locale="nl"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                StockFlow vs Visma{' '}
                <span className="text-blue-600">Kies de juiste oplossing</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Visma biedt krachtige ERP-functies. StockFlow richt zich op snel, flexibel voorraadbeheer voor KMO&apos;s die willen groeien zonder zware implementatie.
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
                <span className="text-sm text-gray-600">KMO&apos;s in retail, productie en groothandel</span>
              </div>
            </div>
            <div>
              <img src="/Inventory-Management.png" alt="StockFlow vs Visma" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Belangrijkste verschillen</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Categorie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">StockFlow</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Visma</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {vergelijking.map((row, index) => (
                  <tr key={index} className="align-top">
                    <td className="px-6 py-5 text-sm font-semibold text-gray-700">{row.titel}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{row.stockflow}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{row.visma}</td>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Waarom kiezen voor StockFlow?</h2>
            <p className="text-lg opacity-90 mb-6">
              StockFlow automatiseert voorraad, inkoop en fulfilment. Perfect voor bedrijven die snelheid en flexibiliteit belangrijk vinden, zonder zware ERP-structuren.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Snel live en makkelijk te beheren door je eigen team.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Mobiele apps en barcode scanning voor realtime zichtbaarheid.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>Integraties met boekhouding, webshop en logistiek.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                <span>EU-hosting, GDPR compliance en Nederlandstalige ondersteuning.</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <h3 className="text-2xl font-semibold">StockFlow in cijfers</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-start gap-2">
                <Gauge className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Implementatie</p>
                <p className="text-xl font-semibold">2-3 weken</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Clock className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Bespaarde tijd</p>
                <p className="text-xl font-semibold">Tot 70% minder manueel werk</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <BarChart3 className="h-8 w-8 text-white/80" />
                <p className="text-sm uppercase tracking-wide text-white/70">Integraties</p>
                <p className="text-xl font-semibold">E-commerce, logistiek & finance</p>
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
            <h3 className="text-xl font-semibold mb-3">StockFlow naast Visma gebruiken?</h3>
            <p className="text-gray-600">
              Veel bedrijven combineren StockFlow voor operations met Visma voor boekhouding. Dankzij integraties hou je beide systemen synchroon.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Migratie zonder hoofdpijn</h3>
            <p className="text-gray-600">
              Importeer producten, leveranciers en voorraadstanden via Excel. Ons team begeleidt de overstap stap voor stap.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Plan vandaag je gratis proefperiode</h2>
          <p className="text-xl mb-8 opacity-90">
            Ervaar hoe StockFlow voorraadprocessen moderniseert zonder complexe ERP-implementatie.
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


