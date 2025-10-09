import SEO from '../../../components/SEO';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import RegionalPageLayout from '@/components/regional/RegionalPageLayout';
import RegionalHero from '@/components/regional/RegionalHero';
import RegionalFeatures from '@/components/regional/RegionalFeatures';
import RegionalStats from '@/components/regional/RegionalStats';
import RegionalFAQ from '@/components/regional/RegionalFAQ';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { generateRegionalStructuredData, generateBreadcrumbStructuredData } from '@/utils/regionalStructuredData';

export default function VoorraadbeheerSoftwareBelgie() {
  usePageRefresh();

  const structuredData = generateRegionalStructuredData({
    locationName: 'België',
    locationType: 'country',
    areaServed: ["Oost-Vlaanderen","West-Vlaanderen","Antwerpen","Limburg","Vlaams-Brabant"]
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.stockflow.be' },
    { name: 'België', url: 'https://www.stockflow.be/voorraadbeheer-software-belgie' }
  ]);

  const stats = [
    { label: 'Actieve Bedrijven', value: '1.5M+', description: 'Ondernemingen in België' },
    { label: 'KMO's', value: '99%', description: 'Zijn kleine en middelgrote bedrijven' },
    { label: 'Sectoren', value: '6+', description: 'Belangrijke industrieën' },
    { label: 'Klantrating', value: '4.9/5', description: 'Gemiddelde tevredenheid' }
  ];

  const faqs = [
  {
    "question": "Waarom is voorraadbeheer software belangrijk voor bedrijven in België?",
    "answer": "Bedrijven in België hebben baat bij voorraadbeheer software omdat het real-time inzicht geeft in voorraadniveaus, automatische bestellingen mogelijk maakt, en verspilling voorkomt. Dit bespaart tijd en geld, vooral voor KMO's."
  },
  {
    "question": "Is StockFlow geschikt voor kleine bedrijven in België?",
    "answer": "Absoluut! StockFlow is speciaal ontworpen voor KMO's in België. We bieden een gratis plan tot 30 producten, waarna je kunt opschalen naarmate je groeit. Geen complexe setup, geen dure investeringen."
  },
  {
    "question": "Kan ik StockFlow gebruiken met meerdere vestigingen in België?",
    "answer": "Ja, StockFlow ondersteunt multi-vestiging beheer. Of je nu meerdere winkels in België hebt of ook elders in België, je beheert alles vanuit één centraal systeem met real-time synchronisatie."
  },
  {
    "question": "Hoe snel kan ik starten met voorraadbeheer in België?",
    "answer": "Je kunt binnen 5 minuten starten! Registreer gratis, voeg je producten toe (handmatig of via import), en je bent klaar. Geen training nodig dankzij onze intuïtieve interface."
  },
  {
    "question": "Biedt StockFlow lokale support voor bedrijven in België?",
    "answer": "Ja, we bieden Nederlandstalige support voor alle Belgische klanten, inclusief België. Ons team begrijpt de lokale business cultuur en helpt je graag verder."
  }
];

  return (
    <RegionalPageLayout>
      <SEO
        title="Voorraadbeheer Software België | StockFlow voor Belgische KMO's"
        description="Populaire voorraadbeheer software voor Belgische KMO's. Gebruikt door bedrijven in heel Vlaanderen. ✓ Gratis tot 30 producten ✓ Nederlandse interface"
        keywords="voorraadbeheer software belgië, voorraad beheer belgie, stockbeheer software belgië, inventory management belgium, KMO software belgië"
        url="https://www.stockflow.be/voorraadbeheer-software-belgie"
      />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <RegionalHero
        locationName="België"
        locationType="country"
        description="België telt meer dan 1,5 miljoen ondernemingen, waarvan 99% KMO's zijn. Van retail in Antwerpen tot horeca in Brugge, van logistiek in Limburg tot technologie in Leuven - Belgische bedrijven hebben nood aan efficiënt voorraadbeheer."
        stats={{
          businesses: 1500000,
          kmoPercentage: 99
        }}
      />

      <RegionalFeatures
        locationName="België"
        emphasis="Speciaal ontworpen voor Belgische KMO's. Van Antwerpen tot West-Vlaanderen, van Leuven tot Limburg - duizenden bedrijven vertrouwen op StockFlow voor hun dagelijks voorraadbeheer."
      />

      <RegionalStats
        locationName="België"
        stats={stats}
        industries={["Retail","Horeca","Logistiek","E-commerce","Productie","Bouw"]}
      />

      {/* Provincial Links Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Voorraadbeheer per <span className="text-blue-600">Provincie</span>
          </h2>
          <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            Ontdek hoe bedrijven in jouw provincie StockFlow gebruiken voor hun voorraadbeheer
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/voorraadbeheer-software-oost-vlaanderen"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">Oost-Vlaanderen</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Oost-Vlaanderen is een dynamische provincie met sterke retail, horeca en logistieke sector. De haven van Gent en de uitg...</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Textiel</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Logistiek</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Retail</span>
              </div>
            </Link>
            <Link
              to="/voorraadbeheer-software-west-vlaanderen"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">West-Vlaanderen</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600 mb-3">West-Vlaanderen combineert toerisme met sterke productiesector. Kusttoerisme, horeca in steden als Brugge en Kortrijk, e...</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Toerisme</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Horeca</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Retail</span>
              </div>
            </Link>
            <Link
              to="/voorraadbeheer-software-antwerpen-provincie"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">Antwerpen</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600 mb-3">De provincie Antwerpen, met de grootste haven van Europa, is economisch centrum voor logistiek, diamanthandel en interna...</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Havenlogistiek</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Diamant</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Retail</span>
              </div>
            </Link>
            <Link
              to="/voorraadbeheer-software-limburg"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">Limburg</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Limburg kent sterke logistieke sector dankzij centrale ligging. Fruitteelt, retail en productie zijn belangrijke pijlers...</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Logistiek</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Retail</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Productie</span>
              </div>
            </Link>
            <Link
              to="/voorraadbeheer-software-vlaams-brabant"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">Vlaams-Brabant</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Vlaams-Brabant, met universitaire stad Leuven, combineert technologie en farma met sterke logistieke sector rondom Bruss...</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Technologie</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Farma</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Logistiek</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <RegionalFAQ
        locationName="België"
        faqs={faqs}
      />

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar om te starten met voorraadbeheer?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij duizenden Belgische bedrijven die al StockFlow gebruiken
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Bekijk Prijzen
            </Link>
          </div>
        </div>
      </section>
    </RegionalPageLayout>
  );
}