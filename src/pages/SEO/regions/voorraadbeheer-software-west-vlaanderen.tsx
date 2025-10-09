import SEO from '../../../components/SEO';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import RegionalPageLayout from '@/components/regional/RegionalPageLayout';
import RegionalHero from '@/components/regional/RegionalHero';
import RegionalFeatures from '@/components/regional/RegionalFeatures';
import RegionalStats from '@/components/regional/RegionalStats';
import RegionalTestimonials from '@/components/regional/RegionalTestimonials';
import RegionalFAQ from '@/components/regional/RegionalFAQ';
import { getTestimonialsByProvince } from '@/data/regions/testimonials';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { generateRegionalStructuredData, generateBreadcrumbStructuredData } from '@/utils/regionalStructuredData';

export default function VoorraadbeheerSoftwareWestVlaanderen() {
  usePageRefresh();

  const testimonials = getTestimonialsByProvince('west-vlaanderen');

  const structuredData = generateRegionalStructuredData({
    locationName: 'West-Vlaanderen',
    locationType: 'province',
    region: 'West-Vlaanderen',
    areaServed: ["Brugge","Kortrijk","Oostende","Roeselare","Ieper","Waregem","Knokke-Heist","Menen","Izegem","Harelbeke","Poperinge","Tielt","Diksmuide"]
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.stockflow.be' },
    { name: 'België', url: 'https://www.stockflow.be/voorraadbeheer-software-belgie' },
    { name: 'West-Vlaanderen', url: 'https://www.stockflow.be/voorraadbeheer-software-west-vlaanderen' }
  ]);

  const stats = [
    { label: 'Inwoners', value: '1.2M', description: 'Mensen in West-Vlaanderen' },
    { label: 'Hoofdstad', value: 'Brugge', description: 'Provinciale hoofdstad' },
    { label: 'Sectoren', value: '5+', description: 'Belangrijke industrieën' },
    { label: 'Klantrating', value: '4.9/5', description: 'Gemiddelde tevredenheid' }
  ];

  const faqs = [
  {
    "question": "Waarom is voorraadbeheer software belangrijk voor bedrijven in West-Vlaanderen?",
    "answer": "Bedrijven in West-Vlaanderen hebben baat bij voorraadbeheer software omdat het real-time inzicht geeft in voorraadniveaus, automatische bestellingen mogelijk maakt, en verspilling voorkomt. Dit bespaart tijd en geld, vooral voor KMO's."
  },
  {
    "question": "Is StockFlow geschikt voor kleine bedrijven in West-Vlaanderen?",
    "answer": "Absoluut! StockFlow is speciaal ontworpen voor KMO's in West-Vlaanderen. We bieden een gratis plan tot 30 producten, waarna je kunt opschalen naarmate je groeit. Geen complexe setup, geen dure investeringen."
  },
  {
    "question": "Kan ik StockFlow gebruiken met meerdere vestigingen in West-Vlaanderen?",
    "answer": "Ja, StockFlow ondersteunt multi-vestiging beheer. Of je nu meerdere winkels in West-Vlaanderen hebt of ook elders in België, je beheert alles vanuit één centraal systeem met real-time synchronisatie."
  },
  {
    "question": "Hoe snel kan ik starten met voorraadbeheer in West-Vlaanderen?",
    "answer": "Je kunt binnen 5 minuten starten! Registreer gratis, voeg je producten toe (handmatig of via import), en je bent klaar. Geen training nodig dankzij onze intuïtieve interface."
  },
  {
    "question": "Biedt StockFlow lokale support voor bedrijven in West-Vlaanderen?",
    "answer": "Ja, we bieden Nederlandstalige support voor alle Belgische klanten, inclusief West-Vlaanderen. Ons team begrijpt de lokale business cultuur en helpt je graag verder."
  }
];

  return (
    <RegionalPageLayout>
      <SEO
        title="Voorraadbeheer Software West-Vlaanderen | StockFlow"
        description="Populaire voorraadbeheer software voor West-Vlaanderen. Veel gebruikt door bedrijven in Brugge, Kortrijk, Oostende en meer. ✓ Gratis tot 30 producten"
        keywords="voorraadbeheer software west-vlaanderen, voorraad west-vlaanderen, stockbeheer west-vlaanderen, inventory West-Vlaanderen"
        url="https://www.stockflow.be/voorraadbeheer-software-west-vlaanderen"
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
        locationName="West-Vlaanderen"
        locationType="province"
        description="West-Vlaanderen combineert toerisme met sterke productiesector. Kusttoerisme, horeca in steden als Brugge en Kortrijk, en voedingsproductie domineren."
        stats={{
          population: 1195796
        }}
      />

      <RegionalFeatures
        locationName="West-Vlaanderen"
        emphasis="Veel gebruikt door bedrijven in Brugge, Kortrijk, Oostende en andere steden. West-Vlaanderen heeft een sterke toerisme sector waar voorraadbeheer essentieel is."
      />

      <RegionalStats
        locationName="West-Vlaanderen"
        stats={stats}
        industries={["Toerisme","Horeca","Retail","Voedingsindustrie","Productie"]}
      />

      {testimonials.length > 0 && (
        <RegionalTestimonials
          testimonials={testimonials.slice(0, 3)}
          locationName="West-Vlaanderen"
        />
      )}

      {/* City Links Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Voorraadbeheer per <span className="text-blue-600">Stad</span> in West-Vlaanderen
          </h2>
          <p className="text-center text-lg text-gray-700 mb-12">
            Ontdek specifieke informatie voor jouw stad
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/voorraadbeheer-software-brugge"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Brugge</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">118.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-kortrijk"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Kortrijk</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">76.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-oostende"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Oostende</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">71.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-roeselare"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Roeselare</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">63.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-ieper"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Ieper</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">35.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-waregem"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Waregem</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">37.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-knokke-heist"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Knokke-Heist</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">34.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-menen"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Menen</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">33.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-izegem"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Izegem</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">27.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-harelbeke"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Harelbeke</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">28.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-poperinge"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Poperinge</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">20.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-tielt"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Tielt</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">20.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-diksmuide"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Diksmuide</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">16.500 inwoners</p>
            </Link>
          </div>
        </div>
      </section>

      <RegionalFAQ
        locationName="West-Vlaanderen"
        faqs={faqs}
      />

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start vandaag met voorraadbeheer in West-Vlaanderen
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Gratis tot 30 producten. Geen creditcard vereist.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </RegionalPageLayout>
  );
}