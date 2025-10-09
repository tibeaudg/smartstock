import SEO from '../../../components/SEO';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import RegionalPageLayout from '@/components/regional/RegionalPageLayout';
import RegionalHero from '@/components/regional/RegionalHero';
import RegionalFeatures from '@/components/regional/RegionalFeatures';
import RegionalStats from '@/components/regional/RegionalStats';
import RegionalTestimonials from '@/components/regional/RegionalTestimonials';
import RegionalFAQ from '@/components/regional/RegionalFAQ';
import { getRandomTestimonials } from '@/data/regions/testimonials';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { generateRegionalStructuredData, generateBreadcrumbStructuredData } from '@/utils/regionalStructuredData';

export default function VoorraadbeheerSoftwareEeklo() {
  usePageRefresh();

  const testimonials = getRandomTestimonials('eeklo', 2);

  const structuredData = generateRegionalStructuredData({
    locationName: 'Eeklo',
    locationType: 'city',
    region: 'Oost-Vlaanderen',
    areaServed: ['Eeklo', 'Oost-Vlaanderen']
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.stockflow.be' },
    { name: 'België', url: 'https://www.stockflow.be/voorraadbeheer-software-belgie' },
    { name: 'Oost-Vlaanderen', url: 'https://www.stockflow.be/voorraadbeheer-software-oost-vlaanderen' },
    { name: 'Eeklo', url: 'https://www.stockflow.be/voorraadbeheer-software-eeklo' }
  ]);

  const stats = [
    { label: 'Inwoners', value: '20.500', description: 'Mensen in Eeklo' },
    { label: 'Provincie', value: 'Oost-Vlaanderen', description: 'Deel van Oost-Vlaanderen' },
    { label: 'Lokale KMO's', value: '1000+', description: 'Actieve bedrijven' },
    { label: 'Klantrating', value: '4.9/5', description: 'Gemiddelde tevredenheid' }
  ];

  const faqs = [
  {
    "question": "Waarom is voorraadbeheer software belangrijk voor bedrijven in Eeklo?",
    "answer": "Bedrijven in Eeklo hebben baat bij voorraadbeheer software omdat het real-time inzicht geeft in voorraadniveaus, automatische bestellingen mogelijk maakt, en verspilling voorkomt. Dit bespaart tijd en geld, vooral voor KMO's."
  },
  {
    "question": "Is StockFlow geschikt voor kleine bedrijven in Eeklo?",
    "answer": "Absoluut! StockFlow is speciaal ontworpen voor KMO's in Eeklo. We bieden een gratis plan tot 30 producten, waarna je kunt opschalen naarmate je groeit. Geen complexe setup, geen dure investeringen."
  },
  {
    "question": "Kan ik StockFlow gebruiken met meerdere vestigingen in Eeklo?",
    "answer": "Ja, StockFlow ondersteunt multi-vestiging beheer. Of je nu meerdere winkels in Eeklo hebt of ook elders in België, je beheert alles vanuit één centraal systeem met real-time synchronisatie."
  },
  {
    "question": "Hoe snel kan ik starten met voorraadbeheer in Eeklo?",
    "answer": "Je kunt binnen 5 minuten starten! Registreer gratis, voeg je producten toe (handmatig of via import), en je bent klaar. Geen training nodig dankzij onze intuïtieve interface."
  },
  {
    "question": "Biedt StockFlow lokale support voor bedrijven in Eeklo?",
    "answer": "Ja, we bieden Nederlandstalige support voor alle Belgische klanten, inclusief Eeklo. Ons team begrijpt de lokale business cultuur en helpt je graag verder."
  },
  {
    "question": "Welke sectoren in Eeklo gebruiken StockFlow?",
    "answer": "StockFlow wordt gebruikt door retail, horeca, productie, e-commerce, bouw en vele andere sectoren in Eeklo. Onze software is flexibel genoeg voor alle types voorraad."
  }
];

  return (
    <RegionalPageLayout>
      <SEO
        title="Voorraadbeheer Software Eeklo | Voor bedrijven in Eeklo"
        description="Voorraadbeheer software voor bedrijven in Eeklo. Eeklo is regionaal centrum voor Meetjesland met retail die baat heeft bij efficiënt voorraadbeheer. ✓ Gratis tot 30 producten ✓ Nederlandse support"
        keywords="voorraadbeheer eeklo, voorraad beheer Eeklo, stockbeheer Eeklo, inventory Eeklo"
        url="https://www.stockflow.be/voorraadbeheer-software-eeklo"
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
        locationName="Eeklo"
        locationType="city"
        description="Eeklo is regionaal centrum voor Meetjesland met retail die baat heeft bij efficiënt voorraadbeheer."
        stats={{
          population: 20500
        }}
      />

      <RegionalFeatures
        locationName="Eeklo"
        emphasis="Speciaal voor Eeklo: real-time voorraadbeheer dat aansluit bij de lokale business dynamiek."
      />

      <RegionalStats
        locationName="Eeklo"
        stats={stats}
      />

      {testimonials.length > 0 && (
        <RegionalTestimonials
          testimonials={testimonials}
          locationName="Eeklo"
        />
      )}

      {/* Local Business Types */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Geschikt voor <span className="text-blue-600">alle sectoren</span> in Eeklo
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">Retail & Winkels</h3>
              <p className="text-sm text-gray-600">Kledingwinkels, speciaalzaken, conceptstores</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">Horeca</h3>
              <p className="text-sm text-gray-600">Restaurants, cafés, cateringbedrijven</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">Productie</h3>
              <p className="text-sm text-gray-600">Ambachtelijke producenten, bakkerijen</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">E-commerce</h3>
              <p className="text-sm text-gray-600">Webshops, online retailers, dropshippers</p>
            </div>
          </div>
        </div>
      </section>

      <RegionalFAQ
        locationName="Eeklo"
        faqs={faqs}
      />

      {/* Breadcrumb Navigation */}
      <section className="py-8 px-4 bg-white border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/voorraadbeheer-software-belgie" className="hover:text-blue-600">België</Link>
            <span>›</span>
            <Link to="/voorraadbeheer-software-oost-vlaanderen" className="hover:text-blue-600">Oost-Vlaanderen</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Eeklo</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start vandaag in Eeklo
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij lokale bedrijven die al StockFlow gebruiken
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-xl"
          >
            Start Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-6 text-sm opacity-75">
            Gratis tot 30 producten • Geen creditcard vereist • Setup in 5 minuten
          </p>
        </div>
      </section>
    </RegionalPageLayout>
  );
}