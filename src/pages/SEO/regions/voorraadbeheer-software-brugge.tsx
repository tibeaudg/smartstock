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

export default function VoorraadbeheerSoftwareBrugge() {
  usePageRefresh();

  const testimonials = getRandomTestimonials('brugge', 2);

  const structuredData = generateRegionalStructuredData({
    locationName: 'Brugge',
    locationType: 'city',
    region: 'West-Vlaanderen',
    areaServed: ['Brugge', 'West-Vlaanderen']
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.stockflow.be' },
    { name: 'België', url: 'https://www.stockflow.be/voorraadbeheer-software-belgie' },
    { name: 'West-Vlaanderen', url: 'https://www.stockflow.be/voorraadbeheer-software-west-vlaanderen' },
    { name: 'Brugge', url: 'https://www.stockflow.be/voorraadbeheer-software-brugge' }
  ]);

  const stats = [
    { label: 'Inwoners', value: '118.000', description: 'Mensen in Brugge' },
    { label: 'Provincie', value: 'West-Vlaanderen', description: 'Deel van West-Vlaanderen' },
    { label: 'Lokale KMO's', value: '1000+', description: 'Actieve bedrijven' },
    { label: 'Klantrating', value: '4.9/5', description: 'Gemiddelde tevredenheid' }
  ];

  const faqs = [
  {
    "question": "Waarom is voorraadbeheer software belangrijk voor bedrijven in Brugge?",
    "answer": "Bedrijven in Brugge hebben baat bij voorraadbeheer software omdat het real-time inzicht geeft in voorraadniveaus, automatische bestellingen mogelijk maakt, en verspilling voorkomt. Dit bespaart tijd en geld, vooral voor KMO's."
  },
  {
    "question": "Is StockFlow geschikt voor kleine bedrijven in Brugge?",
    "answer": "Absoluut! StockFlow is speciaal ontworpen voor KMO's in Brugge. We bieden een gratis plan tot 30 producten, waarna je kunt opschalen naarmate je groeit. Geen complexe setup, geen dure investeringen."
  },
  {
    "question": "Kan ik StockFlow gebruiken met meerdere vestigingen in Brugge?",
    "answer": "Ja, StockFlow ondersteunt multi-vestiging beheer. Of je nu meerdere winkels in Brugge hebt of ook elders in België, je beheert alles vanuit één centraal systeem met real-time synchronisatie."
  },
  {
    "question": "Hoe snel kan ik starten met voorraadbeheer in Brugge?",
    "answer": "Je kunt binnen 5 minuten starten! Registreer gratis, voeg je producten toe (handmatig of via import), en je bent klaar. Geen training nodig dankzij onze intuïtieve interface."
  },
  {
    "question": "Biedt StockFlow lokale support voor bedrijven in Brugge?",
    "answer": "Ja, we bieden Nederlandstalige support voor alle Belgische klanten, inclusief Brugge. Ons team begrijpt de lokale business cultuur en helpt je graag verder."
  },
  {
    "question": "Welke sectoren in Brugge gebruiken StockFlow?",
    "answer": "StockFlow wordt gebruikt door retail, horeca, productie, e-commerce, bouw en vele andere sectoren in Brugge. Onze software is flexibel genoeg voor alle types voorraad."
  }
];

  return (
    <RegionalPageLayout>
      <SEO
        title="Voorraadbeheer Software Brugge | Voor bedrijven in Brugge"
        description="Voorraadbeheer software voor bedrijven in Brugge. Brugge is toeristisch centrum met uitgebreide horeca waar voorraadbeheer cruciaal is voor dagelijkse operaties en seizoenspieken. ✓ Gratis tot 30 producten ✓ Nederlandse support"
        keywords="voorraadbeheer brugge, voorraad beheer Brugge, stockbeheer Brugge, inventory Brugge"
        url="https://www.stockflow.be/voorraadbeheer-software-brugge"
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
        locationName="Brugge"
        locationType="city"
        description="Brugge is toeristisch centrum met uitgebreide horeca waar voorraadbeheer cruciaal is voor dagelijkse operaties en seizoenspieken."
        stats={{
          population: 118000
        }}
      />

      <RegionalFeatures
        locationName="Brugge"
        emphasis="Speciaal voor Brugge: real-time voorraadbeheer dat aansluit bij de lokale business dynamiek."
      />

      <RegionalStats
        locationName="Brugge"
        stats={stats}
      />

      {testimonials.length > 0 && (
        <RegionalTestimonials
          testimonials={testimonials}
          locationName="Brugge"
        />
      )}

      {/* Local Business Types */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Geschikt voor <span className="text-blue-600">alle sectoren</span> in Brugge
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
        locationName="Brugge"
        faqs={faqs}
      />

      {/* Breadcrumb Navigation */}
      <section className="py-8 px-4 bg-white border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/voorraadbeheer-software-belgie" className="hover:text-blue-600">België</Link>
            <span>›</span>
            <Link to="/voorraadbeheer-software-west-vlaanderen" className="hover:text-blue-600">West-Vlaanderen</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Brugge</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start vandaag in Brugge
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