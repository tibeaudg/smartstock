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

export default function VoorraadbeheerSoftwareAntwerpen() {
  usePageRefresh();

  const testimonials = getTestimonialsByProvince('antwerpen-provincie');

  const structuredData = generateRegionalStructuredData({
    locationName: 'Antwerpen',
    locationType: 'province',
    region: 'Antwerpen',
    areaServed: ["Antwerpen","Mechelen","Turnhout","Mol","Geel","Heist-op-den-Berg","Lier","Mortsel","Boom","Brasschaat","Duffel","Schoten"]
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.stockflow.be' },
    { name: 'België', url: 'https://www.stockflow.be/voorraadbeheer-software-belgie' },
    { name: 'Antwerpen', url: 'https://www.stockflow.be/voorraadbeheer-software-antwerpen-provincie' }
  ]);

  const stats = [
    { label: 'Inwoners', value: '1.9M', description: 'Mensen in Antwerpen' },
    { label: 'Hoofdstad', value: 'Antwerpen', description: 'Provinciale hoofdstad' },
    { label: 'Sectoren', value: '5+', description: 'Belangrijke industrieën' },
    { label: 'Klantrating', value: '4.9/5', description: 'Gemiddelde tevredenheid' }
  ];

  const faqs = [
  {
    "question": "Waarom is voorraadbeheer software belangrijk voor bedrijven in Antwerpen?",
    "answer": "Bedrijven in Antwerpen hebben baat bij voorraadbeheer software omdat het real-time inzicht geeft in voorraadniveaus, automatische bestellingen mogelijk maakt, en verspilling voorkomt. Dit bespaart tijd en geld, vooral voor KMO's."
  },
  {
    "question": "Is StockFlow geschikt voor kleine bedrijven in Antwerpen?",
    "answer": "Absoluut! StockFlow is speciaal ontworpen voor KMO's in Antwerpen. We bieden een gratis plan tot 30 producten, waarna je kunt opschalen naarmate je groeit. Geen complexe setup, geen dure investeringen."
  },
  {
    "question": "Kan ik StockFlow gebruiken met meerdere vestigingen in Antwerpen?",
    "answer": "Ja, StockFlow ondersteunt multi-vestiging beheer. Of je nu meerdere winkels in Antwerpen hebt of ook elders in België, je beheert alles vanuit één centraal systeem met real-time synchronisatie."
  },
  {
    "question": "Hoe snel kan ik starten met voorraadbeheer in Antwerpen?",
    "answer": "Je kunt binnen 5 minuten starten! Registreer gratis, voeg je producten toe (handmatig of via import), en je bent klaar. Geen training nodig dankzij onze intuïtieve interface."
  },
  {
    "question": "Biedt StockFlow lokale support voor bedrijven in Antwerpen?",
    "answer": "Ja, we bieden Nederlandstalige support voor alle Belgische klanten, inclusief Antwerpen. Ons team begrijpt de lokale business cultuur en helpt je graag verder."
  }
];

  return (
    <RegionalPageLayout>
      <SEO
        title="Voorraadbeheer Software Antwerpen | StockFlow"
        description="Populaire voorraadbeheer software voor Antwerpen. Veel gebruikt door bedrijven in Antwerpen, Mechelen, Turnhout en meer. ✓ Gratis tot 30 producten"
        keywords="voorraadbeheer software antwerpen-provincie, voorraad antwerpen-provincie, stockbeheer antwerpen-provincie, inventory Antwerpen"
        url="https://www.stockflow.be/voorraadbeheer-software-antwerpen-provincie"
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
        locationName="Antwerpen"
        locationType="province"
        description="De provincie Antwerpen, met de grootste haven van Europa, is economisch centrum voor logistiek, diamanthandel en internationale trade. Sterke retail en e-commerce sector."
        stats={{
          population: 1857986
        }}
      />

      <RegionalFeatures
        locationName="Antwerpen"
        emphasis="Veel gebruikt door bedrijven in Antwerpen, Mechelen, Turnhout en andere steden. Antwerpen heeft een sterke havenlogistiek sector waar voorraadbeheer essentieel is."
      />

      <RegionalStats
        locationName="Antwerpen"
        stats={stats}
        industries={["Havenlogistiek","Diamant","Retail","E-commerce","Mode"]}
      />

      {testimonials.length > 0 && (
        <RegionalTestimonials
          testimonials={testimonials.slice(0, 3)}
          locationName="Antwerpen"
        />
      )}

      {/* City Links Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Voorraadbeheer per <span className="text-blue-600">Stad</span> in Antwerpen
          </h2>
          <p className="text-center text-lg text-gray-700 mb-12">
            Ontdek specifieke informatie voor jouw stad
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/voorraadbeheer-software-antwerpen"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Antwerpen</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">530.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-mechelen"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Mechelen</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">86.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-turnhout"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Turnhout</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">45.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-mol"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Mol</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">37.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-geel"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Geel</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">40.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-heist-op-den-berg"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Heist-op-den-Berg</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">43.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-lier"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Lier</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">35.500 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-mortsel"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Mortsel</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">25.500 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-boom"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Boom</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">18.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-brasschaat"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Brasschaat</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">38.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-duffel"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Duffel</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">17.500 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-schoten"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Schoten</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">34.000 inwoners</p>
            </Link>
          </div>
        </div>
      </section>

      <RegionalFAQ
        locationName="Antwerpen"
        faqs={faqs}
      />

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start vandaag met voorraadbeheer in Antwerpen
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