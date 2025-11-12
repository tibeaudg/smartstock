import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';

const faqData = [
  {
    question: 'Hoe helpt StockFlow horecaondernemers?',
    answer: 'StockFlow combineert voorraadbeheer, receptkostprijsberekening en automatische bestellijsten zodat restaurants, cafÃ©s en cateringbedrijven direct inzicht hebben in marges en voorraadniveaus.'
  },
  {
    question: 'Werkt StockFlow met meerdere vestigingen?',
    answer: 'Ja. Met multi-locatie beheer verdeel je voorraad over verschillende keukens, bars of foodtrucks en hou je alles in Ã©Ã©n dashboard bij.'
  },
  {
    question: 'Kan ik leveranciers en bestellingen automatiseren?',
    answer: 'Via slimme bestelpunten stuurt StockFlow automatisch bestelaanvragen naar je vaste leveranciers wanneer ingrediÃ«nten bijna op zijn.'
  },
  {
    question: 'Is er een mobiele app voor telrondes?',
    answer: 'Met de iOS en Android app voer je telrondes uit, scan je barcodes en noteer je houdbaarheidsdatums direct op de vloer.'
  },
  {
    question: 'Wat kost voorraadbeheer voor horeca?',
    answer: 'Je start gratis tot 30 producten. Premium pakketten beginnen vanaf €49/maand inclusief recepturen, kostprijsanalyse en integraties.'
  }
];

const structuredData = generateComprehensiveStructuredData('software', {
  title: 'Voorraadbeheer Horeca | StockFlow',
  url: 'https://www.stockflow.be/voorraadbeheer-horeca',
  description:
    'Voorraadbeheer software voor horeca: beheer recepten, kostprijzen en leveranciers in Ã©Ã©n systeem. Verlaag voedselverspilling en verhoog marges.',
  breadcrumbs: [
    { name: 'Home', url: 'https://www.stockflow.be/', position: 1 },
    { name: 'Voorraadbeheer Software', url: 'https://www.stockflow.be/voorraadbeheer-software', position: 2 },
    { name: 'Voorraadbeheer Horeca', url: 'https://www.stockflow.be/voorraadbeheer-horeca', position: 3 }
  ],
  faqData,
  softwareData: {
    name: 'StockFlow Horeca',
    description: 'Voorraadbeheer software voor horeca met receptbeheer, kostprijsanalyse en multi-locatie ondersteuning.',
    category: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    price: '0',
    currency: 'EUR',
    rating: {
      value: '4.9',
      count: '212'
    },
    features: [
      'Recept- en menu engineering',
      'Automatische bestelpunten',
      'Multi-locatie voorraad',
      'Mobiele telrondes',
      'Barcode & QR scanning',
      'Verlies- en verspilling analyse'
    ],
    image: 'https://www.stockflow.be/Inventory-Management.png',
    url: 'https://www.stockflow.be/voorraadbeheer-horeca'
  }
});

export default function VoorraadbeheerHorecaPage() {
  usePageRefresh();

  return (
    <SeoPageLayout title="Voorraadbeheer voor Horeca">
      <SEO
        title="Voorraadbeheer Horeca 2025 | StockFlow"
        description="Digitaliseer je horecavoorraden met StockFlow. Receptbeheer, kostprijsanalyse, houdbaarheid en bestellingen in Ã©Ã©n dashboard. Start gratis."
        keywords="voorraadbeheer horeca, horeca software voorraad, receptbeheer software, kostprijs horeca, voorraad app horeca, voorraadbeheer restaurant, voorraadbeheer keuken, food cost software"
        url="https://www.stockflow.be/voorraadbeheer-horeca"
        structuredData={structuredData}
        locale="nl"
        alternateLanguages={[{ lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-horeca' }, { lang: 'en-US', url: 'https://www.stockflow.be/inventory-for-hospitality' }]}
      />

      <section className="bg-orange-50 border border-orange-100 rounded-3xl px-6 sm:px-10 py-12 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-orange-700 bg-white/70 px-3 py-1 rounded-full">
              ðŸ½ï¸ Horeca Voorraadbeheer
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
              Minder verspilling, hogere marges met StockFlow voor horeca
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mt-5 leading-relaxed">
              Monitor voorraad van frigo tot tapinstallatie, zie realtime kostprijzen per gerecht en automatiseer bestellingen. StockFlow geeft horecaondernemers volledige controle over ingrediÃ«nten, menu’s en marge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/auth" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg text-center">
                Start Gratis
              </Link>
              <Link to="/demo" className="border border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold px-6 py-3 rounded-lg text-center">
                Vraag een Horeca Demo aan
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">Voor restaurants, cafÃ©s, catering & dark kitchens • Beschikbaar in het Nederlands en Frans</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <h2 className="text-lg font-semibold text-gray-900">Belangrijkste functies</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>âœ… Receptuur en kostprijs per gerecht</li>
              <li>âœ… Houdbaarheid- en allergenenbeheer</li>
              <li>âœ… Team-app voor telrondes & barcodes</li>
              <li>âœ… Automatische besteladviezen per leverancier</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-16 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Complete oplossing voor food cost & voorraad</h2>
          <p className="text-gray-700 leading-relaxed">
            StockFlow koppelt aankoop, voorraad en verkoop zodat je exact weet welke gerechten winstgevend zijn. Plan menu’s, analyseer verspilling en link alles met kassasystemen. Perfect voor drukke horecateams die snel willen schakelen.
          </p>
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Real-time dashboards</h3>
              <p className="text-sm text-gray-600 mt-2">Bekijk voorraadwaardes, marge per gerecht en verwachte tekorten in Ã©Ã©n overzicht.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Integraties met POS & boekhouding</h3>
              <p className="text-sm text-gray-600 mt-2">Synchroniseer verkoopdata vanuit Lightspeed, Toast of Deliverect en stuur facturen naar Exact of Sage.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Voorraadcontrole per zone</h3>
              <p className="text-sm text-gray-600 mt-2">Beheer koelcellen, bar, dry-storage en terrace voorraad met zone-specifieke minimums.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900">Resultaten bij horecaklanten</h3>
          <ul className="mt-5 space-y-3 text-sm text-gray-700">
            <li>• 28% minder voedselverspilling na 60 dagen</li>
            <li>• 4 uur minder telwerk per week</li>
            <li>• 18% hogere brutomarge op topgerechten</li>
            <li>• 100% inzicht in allergenen en traceerbaarheid</li>
          </ul>
          <Link to="/case-studies" className="inline-flex mt-6 text-orange-600 font-semibold hover:underline">
            Lees klantverhalen →
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 mt-16 bg-orange-600 text-white rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-bold">Optimaliseer je horeca voorraad vandaag</h2>
        <p className="mt-4 text-base sm:text-lg opacity-90">
          Zet StockFlow in voor je keuken, bar of catering en volg voorraad realtime. Gratis proefperiode zonder creditcard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/auth" className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg shadow">
            Start Gratis
          </Link>
          <Link to="/demo" className="border border-white text-white font-semibold px-6 py-3 rounded-lg">
            Plan een demo
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">Veelgestelde vragen</h2>
        <div className="mt-8 space-y-4">
          {faqData.map((item, index) => (
            <details key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <summary className="font-semibold text-gray-900 cursor-pointer">{item.question}</summary>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </SeoPageLayout>
  );
}




