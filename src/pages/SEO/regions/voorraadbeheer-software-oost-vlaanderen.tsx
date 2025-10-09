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

export default function VoorraadbeheerSoftwareOostVlaanderen() {
  usePageRefresh();

  const testimonials = getTestimonialsByProvince('oost-vlaanderen');

  const structuredData = generateRegionalStructuredData({
    locationName: 'Oost-Vlaanderen',
    locationType: 'province',
    region: 'Oost-Vlaanderen',
    areaServed: ["Gent","Aalst","Sint-Niklaas","Dendermonde","Wetteren","Lochristi","Eeklo","Oudenaarde","Geraardsbergen","Ninove","Zottegem","Hamme"]
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.stockflow.be' },
    { name: 'België', url: 'https://www.stockflow.be/voorraadbeheer-software-belgie' },
    { name: 'Oost-Vlaanderen', url: 'https://www.stockflow.be/voorraadbeheer-software-oost-vlaanderen' }
  ]);

  const stats = [
    { label: 'Inwoners', value: '1.5M', description: 'Mensen in Oost-Vlaanderen' },
    { label: 'Hoofdstad', value: 'Gent', description: 'Provinciale hoofdstad' },
    { label: 'Sectoren', value: '5+', description: 'Belangrijke industrieën' },
    { label: 'Klantrating', value: '4.9/5', description: 'Gemiddelde tevredenheid' }
  ];

  const faqs = [
  {
    "question": "Waarom is voorraadbeheer software belangrijk voor bedrijven in Oost-Vlaanderen?",
    "answer": "Bedrijven in Oost-Vlaanderen hebben baat bij voorraadbeheer software omdat het real-time inzicht geeft in voorraadniveaus, automatische bestellingen mogelijk maakt, en verspilling voorkomt. Dit bespaart tijd en geld, vooral voor KMO's."
  },
  {
    "question": "Is StockFlow geschikt voor kleine bedrijven in Oost-Vlaanderen?",
    "answer": "Absoluut! StockFlow is speciaal ontworpen voor KMO's in Oost-Vlaanderen. We bieden een gratis plan tot 30 producten, waarna je kunt opschalen naarmate je groeit. Geen complexe setup, geen dure investeringen."
  },
  {
    "question": "Kan ik StockFlow gebruiken met meerdere vestigingen in Oost-Vlaanderen?",
    "answer": "Ja, StockFlow ondersteunt multi-vestiging beheer. Of je nu meerdere winkels in Oost-Vlaanderen hebt of ook elders in België, je beheert alles vanuit één centraal systeem met real-time synchronisatie."
  },
  {
    "question": "Hoe snel kan ik starten met voorraadbeheer in Oost-Vlaanderen?",
    "answer": "Je kunt binnen 5 minuten starten! Registreer gratis, voeg je producten toe (handmatig of via import), en je bent klaar. Geen training nodig dankzij onze intuïtieve interface."
  },
  {
    "question": "Biedt StockFlow lokale support voor bedrijven in Oost-Vlaanderen?",
    "answer": "Ja, we bieden Nederlandstalige support voor alle Belgische klanten, inclusief Oost-Vlaanderen. Ons team begrijpt de lokale business cultuur en helpt je graag verder."
  }
];

  return (
    <RegionalPageLayout>
      <SEO
        title="Voorraadbeheer Software Oost-Vlaanderen | StockFlow"
        description="Populaire voorraadbeheer software voor Oost-Vlaanderen. Veel gebruikt door bedrijven in Gent, Aalst, Sint-Niklaas en meer. ✓ Gratis tot 30 producten"
        keywords="voorraadbeheer software oost-vlaanderen, voorraad oost-vlaanderen, stockbeheer oost-vlaanderen, inventory Oost-Vlaanderen"
        url="https://www.stockflow.be/voorraadbeheer-software-oost-vlaanderen"
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
        locationName="Oost-Vlaanderen"
        locationType="province"
        description="Oost-Vlaanderen is een dynamische provincie met sterke retail, horeca en logistieke sector. De haven van Gent en de uitgebreide transportsector maken voorraadbeheer cruciaal."
        stats={{
          population: 1525255
        }}
      />

      <RegionalFeatures
        locationName="Oost-Vlaanderen"
        emphasis="Veel gebruikt door bedrijven in Gent, Aalst, Sint-Niklaas en andere steden. Oost-Vlaanderen heeft een sterke textiel sector waar voorraadbeheer essentieel is."
      />

      <RegionalStats
        locationName="Oost-Vlaanderen"
        stats={stats}
        industries={["Textiel","Logistiek","Retail","Horeca","E-commerce"]}
      />

      {testimonials.length > 0 && (
        <RegionalTestimonials
          testimonials={testimonials.slice(0, 3)}
          locationName="Oost-Vlaanderen"
        />
      )}

      {/* City Links Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Voorraadbeheer per <span className="text-blue-600">Stad</span> in Oost-Vlaanderen
          </h2>
          <p className="text-center text-lg text-gray-700 mb-12">
            Ontdek specifieke informatie voor jouw stad
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/voorraadbeheer-software-gent"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Gent</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">262.219 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-aalst"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Aalst</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">88.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-sint-niklaas"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Sint-Niklaas</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">78.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-dendermonde"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Dendermonde</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">46.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-wetteren"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Wetteren</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">26.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-lochristi"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Lochristi</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">22.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-eeklo"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Eeklo</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">20.500 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-oudenaarde"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Oudenaarde</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">31.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-geraardsbergen"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Geraardsbergen</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">33.500 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-ninove"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Ninove</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">39.000 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-zottegem"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Zottegem</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">26.500 inwoners</p>
            </Link>
            <Link
              to="/voorraadbeheer-software-hamme"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Hamme</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">25.000 inwoners</p>
            </Link>
          </div>
        </div>
      </section>

      <RegionalFAQ
        locationName="Oost-Vlaanderen"
        faqs={faqs}
      />

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start vandaag met voorraadbeheer in Oost-Vlaanderen
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