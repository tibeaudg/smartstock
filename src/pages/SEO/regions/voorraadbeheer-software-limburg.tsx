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

export default function VoorraadbeheerSoftwareLimburg() {
  usePageRefresh();

  const testimonials = getTestimonialsByProvince('limburg');

  const structuredData = generateRegionalStructuredData({
    locationName: 'Limburg',
    locationType: 'province',
    region: 'Limburg',
    areaServed: ["Hasselt","Genk","Tongeren","Sint-Truiden","Beringen","Bilzen","Lommel","Heusden-Zolder"]
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.stockflow.be' },
    { name: 'België', url: 'https://www.stockflow.be/voorraadbeheer-software-belgie' },
    { name: 'Limburg', url: 'https://www.stockflow.be/voorraadbeheer-software-limburg' }
  ]);

  const stats = [
    { label: 'Inwoners', value: '0.9M', description: 'Mensen in Limburg' },
    { label: 'Hoofdstad', value: 'Hasselt', description: 'Provinciale hoofdstad' },
    { label: 'Sectoren', value: '5+', description: 'Belangrijke industrieën' },
    { label: 'Klantrating', value: '4.9/5', description: 'Gemiddelde tevredenheid' }
  ];

  const faqs = [
  {
    "question": "Waarom is voorraadbeheer software belangrijk voor bedrijven in Limburg?",
    "answer": "Bedrijven in Limburg hebben baat bij voorraadbeheer software omdat het real-time inzicht geeft in voorraadniveaus, automatische bestellingen mogelijk maakt, en verspilling voorkomt. Dit bespaart tijd en geld, vooral voor KMO's."
  },
  {
    "question": "Is StockFlow geschikt voor kleine bedrijven in Limburg?",
    "answer": "Absoluut! StockFlow is speciaal ontworpen voor KMO's in Limburg. We bieden een gratis plan tot 30 producten, waarna je kunt opschalen naarmate je groeit. Geen complexe setup, geen dure investeringen."
  },
  {
    "question": "Kan ik StockFlow gebruiken met meerdere vestigingen in Limburg?",
    "answer": "Ja, StockFlow ondersteunt multi-vestiging beheer. Of je nu meerdere winkels in Limburg hebt of ook elders in België, je beheert alles vanuit één centraal systeem met real-time synchronisatie."
  },
  {
    "question": "Hoe snel kan ik starten met voorraadbeheer in Limburg?",
    "answer": "Je kunt binnen 5 minuten starten! Registreer gratis, voeg je producten toe (handmatig of via import), en je bent klaar. Geen training nodig dankzij onze intuïtieve interface."
  },
  {
    "question": "Biedt StockFlow lokale support voor bedrijven in Limburg?",
    "answer": "Ja, we bieden Nederlandstalige support voor alle Belgische klanten, inclusief Limburg. Ons team begrijpt de lokale business cultuur en helpt je graag verder."
  }
];

  return (
    <RegionalPageLayout>
      <SEO
        title="Voorraadbeheer Software Limburg | StockFlow"
        description="Populaire voorraadbeheer software voor Limburg. Veel gebruikt door bedrijven in Hasselt, Genk, Tongeren en meer. ✓ Gratis tot 30 producten"
        keywords="voorraadbeheer software limburg, voorraad limburg, stockbeheer limburg, inventory Limburg"
        url="https://www.stockflow.be/voorraadbeheer-software-limburg"
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
        locationName="Limburg"
        locationType="province"
        description="Limburg kent sterke logistieke sector dankzij centrale ligging. Fruitteelt, retail en productie zijn belangrijke pijlers met groeiende e-commerce sector."
        stats={{
          population: 877370
        }}
      />

      <RegionalFeatures
        locationName="Limburg"
        emphasis="Veel gebruikt door bedrijven in Hasselt, Genk, Tongeren en andere steden. Limburg heeft een sterke logistiek sector waar voorraadbeheer essentieel is."
      />

      <RegionalStats
        locationName="Limburg"
        stats={stats}
        industries={["Logistiek","Retail","Productie","Bouw","Fruitteelt"]}
      />

      {testimonials.length > 0 && (
        <RegionalTestimonials
          testimonials={testimonials.slice(0, 3)}
          locationName="Limburg"
        />
      )}

      {/* City Links Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Voorraadbeheer per <span className="text-blue-600">Stad</span> in Limburg
          </h2>
          <p className="text-center text-lg text-gray-700 mb-12">
            Ontdek specifieke informatie voor jouw stad
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/voorraadbeheer-software-hasselt"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Hasselt</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">78.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-genk"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Genk</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">66.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-tongeren"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Tongeren</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">31.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-sint-truiden"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Sint-Truiden</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">41.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-beringen"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Beringen</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">46.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-bilzen"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Bilzen</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">32.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-lommel"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Lommel</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">35.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-heusden-zolder"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Heusden-Zolder</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">32.000 inwoners</p>
            </Link>
          </div>
        </div>
      </section>

      <RegionalFAQ
        locationName="Limburg"
        faqs={faqs}
      />

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start vandaag met voorraadbeheer in Limburg
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