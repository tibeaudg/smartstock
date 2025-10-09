import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages', 'SEO', 'regions');

// Ensure directory exists
if (!fs.existsSync(PAGES_DIR)) {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
}

// Import region data (we'll read the TypeScript file and parse it)
const BELGIUM_DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'regions', 'belgium.ts');
const belgiumDataContent = fs.readFileSync(BELGIUM_DATA_PATH, 'utf8');

// Parse data (simplified - in production you'd use a proper TS parser)
// For now, we'll define the data directly in the script
const belgiumCountry = {
  name: 'België',
  slug: 'belgie',
  description: 'België telt meer dan 1,5 miljoen ondernemingen, waarvan 99% KMO\'s zijn. Van retail in Antwerpen tot horeca in Brugge, van logistiek in Limburg tot technologie in Leuven - Belgische bedrijven hebben nood aan efficiënt voorraadbeheer.',
  totalBusinesses: 1500000,
  kmoPercentage: 99,
  keyIndustries: ['Retail', 'Horeca', 'Logistiek', 'E-commerce', 'Productie', 'Bouw']
};

const provinces = [
  {
    name: 'Oost-Vlaanderen',
    slug: 'oost-vlaanderen',
    capital: 'Gent',
    population: 1525255,
    keyIndustries: ['Textiel', 'Logistiek', 'Retail', 'Horeca', 'E-commerce'],
    economicProfile: 'Oost-Vlaanderen is een dynamische provincie met sterke retail, horeca en logistieke sector. De haven van Gent en de uitgebreide transportsector maken voorraadbeheer cruciaal.',
    majorCities: ['Gent', 'Aalst', 'Sint-Niklaas', 'Dendermonde', 'Oudenaarde']
  },
  {
    name: 'West-Vlaanderen',
    slug: 'west-vlaanderen',
    capital: 'Brugge',
    population: 1195796,
    keyIndustries: ['Toerisme', 'Horeca', 'Retail', 'Voedingsindustrie', 'Productie'],
    economicProfile: 'West-Vlaanderen combineert toerisme met sterke productiesector. Kusttoerisme, horeca in steden als Brugge en Kortrijk, en voedingsproductie domineren.',
    majorCities: ['Brugge', 'Kortrijk', 'Oostende', 'Roeselare', 'Ieper']
  },
  {
    name: 'Antwerpen',
    slug: 'antwerpen-provincie',
    capital: 'Antwerpen',
    population: 1857986,
    keyIndustries: ['Havenlogistiek', 'Diamant', 'Retail', 'E-commerce', 'Mode'],
    economicProfile: 'De provincie Antwerpen, met de grootste haven van Europa, is economisch centrum voor logistiek, diamanthandel en internationale trade. Sterke retail en e-commerce sector.',
    majorCities: ['Antwerpen', 'Mechelen', 'Turnhout', 'Mol', 'Lier']
  },
  {
    name: 'Limburg',
    slug: 'limburg',
    capital: 'Hasselt',
    population: 877370,
    keyIndustries: ['Logistiek', 'Retail', 'Productie', 'Bouw', 'Fruitteelt'],
    economicProfile: 'Limburg kent sterke logistieke sector dankzij centrale ligging. Fruitteelt, retail en productie zijn belangrijke pijlers met groeiende e-commerce sector.',
    majorCities: ['Hasselt', 'Genk', 'Tongeren', 'Sint-Truiden', 'Beringen']
  },
  {
    name: 'Vlaams-Brabant',
    slug: 'vlaams-brabant',
    capital: 'Leuven',
    population: 1146175,
    keyIndustries: ['Technologie', 'Farma', 'Logistiek', 'Retail', 'Horeca'],
    economicProfile: 'Vlaams-Brabant, met universitaire stad Leuven, combineert technologie en farma met sterke logistieke sector rondom Brussel. Groeiende e-commerce en retail.',
    majorCities: ['Leuven', 'Vilvoorde', 'Tienen', 'Aarschot', 'Halle']
  }
];

// City data structure
const citiesByProvince = {
  'oost-vlaanderen': [
    { name: 'Gent', slug: 'gent', population: 262219, emphasis: 'Gent is economisch hart van Oost-Vlaanderen met sterke retail in het centrum, uitgebreide horeca sector en belangrijke haven. Veel KMO\'s in logistiek en e-commerce hebben hier baat bij professioneel voorraadbeheer.' },
    { name: 'Aalst', slug: 'aalst', population: 88000, emphasis: 'Aalst kent sterke retail sector en groeiende logistieke bedrijven. Centrale ligging maakt voorraadbeheer cruciaal voor distributie en groothandel.' },
    { name: 'Sint-Niklaas', slug: 'sint-niklaas', population: 78000, emphasis: 'Sint-Niklaas is belangrijke retailstad met grootste marktplein van België. Groeiende e-commerce vraagt om efficiënt voorraadbeheer.' },
    { name: 'Dendermonde', slug: 'dendermonde', population: 46000, emphasis: 'Dendermonde combineert historische handel met moderne retail. Voedingsindustrie en horeca hebben nood aan nauwkeurig voorraadbeheer.' },
    { name: 'Wetteren', slug: 'wetteren', population: 26000, emphasis: 'Wetteren groeit als voorstad van Gent met diverse KMO-sector die profiteert van slim voorraadbeheer.' },
    { name: 'Lochristi', slug: 'lochristi', population: 22000, emphasis: 'Lochristi staat bekend om tuinbouw en sierteelt waar seizoensgebonden voorraadbeheer cruciaal is.' },
    { name: 'Eeklo', slug: 'eeklo', population: 20500, emphasis: 'Eeklo is regionaal centrum voor Meetjesland met retail die baat heeft bij efficiënt voorraadbeheer.' },
    { name: 'Oudenaarde', slug: 'oudenaarde', population: 31000, emphasis: 'Oudenaarde combineert textieltraditie met wielertoerisme, waar horeca voorraadbeheer essentieel is.' },
    { name: 'Geraardsbergen', slug: 'geraardsbergen', population: 33500, emphasis: 'Geraardsbergen kent voedingsindustrie waar nauwkeurig voorraadbeheer van ingrediënten cruciaal is.' },
    { name: 'Ninove', slug: 'ninove', population: 39000, emphasis: 'Ninove heeft diverse productiesector met logistieke bedrijven die profiteren van real-time voorraadbeheer.' },
    { name: 'Zottegem', slug: 'zottegem', population: 26500, emphasis: 'Zottegem combineert productie met retail en diensten. Diverse KMO\'s hebben baat bij flexibel voorraadbeheer.' },
    { name: 'Hamme', slug: 'hamme', population: 25000, emphasis: 'Hamme kent fruitteelt waar seizoensvoorraad perfect moet worden getimed met voorraadbeheer software.' }
  ],
  'west-vlaanderen': [
    { name: 'Brugge', slug: 'brugge', population: 118000, emphasis: 'Brugge is toeristisch centrum met uitgebreide horeca waar voorraadbeheer cruciaal is voor dagelijkse operaties en seizoenspieken.' },
    { name: 'Kortrijk', slug: 'kortrijk', population: 76000, emphasis: 'Kortrijk is economisch centrum met sterke retail en technologie waar modern voorraadbeheer standaard is.' },
    { name: 'Oostende', slug: 'oostende', population: 71000, emphasis: 'Oostende combineert badtoerisme met haven. Seizoensgebonden horeca en retail hebben flexibel voorraadbeheer nodig.' },
    { name: 'Roeselare', slug: 'roeselare', population: 63000, emphasis: 'Roeselare is retailcentrum met voedingsindustrie waar voorraadrotatie en traceerbaarheid belangrijk zijn.' },
    { name: 'Ieper', slug: 'ieper', population: 35000, emphasis: 'Ieper leeft van WO I toerisme. Horeca en retail hebben seizoensgebonden voorraadbeheer nodig.' },
    { name: 'Waregem', slug: 'waregem', population: 37000, emphasis: 'Waregem combineert textieltraditie met moderne retail waar efficiënt voorraadbeheer essentieel is.' },
    { name: 'Knokke-Heist', slug: 'knokke-heist', population: 34000, emphasis: 'Knokke-Heist is exclusieve badplaats met luxe retail waar nauwkeurig voorraadbeheer van premium producten cruciaal is.' },
    { name: 'Menen', slug: 'menen', population: 33000, emphasis: 'Menen profiteert van grenshandel waar internationale voorraadstromen goed moeten worden beheerd.' },
    { name: 'Izegem', slug: 'izegem', population: 27000, emphasis: 'Izegem staat bekend om schoenenproductie waar voorraad van componenten en eindproducten complex is.' },
    { name: 'Harelbeke', slug: 'harelbeke', population: 28000, emphasis: 'Harelbeke is centrum voor vloerbedekking met productie die vraagt om nauwkeurig voorraadbeheer.' },
    { name: 'Poperinge', slug: 'poperinge', population: 20000, emphasis: 'Poperinge is hopstad met landbouw en toerisme waar seizoensvoorraad goed moet worden beheerd.' },
    { name: 'Tielt', slug: 'tielt', population: 20000, emphasis: 'Tielt is regionaal centrum met retail die profiteert van real-time voorraadinzicht.' },
    { name: 'Diksmuide', slug: 'diksmuide', population: 16500, emphasis: 'Diksmuide combineert WO I toerisme met landbouw waar seizoensgebonden voorraadbeheer belangrijk is.' }
  ],
  'antwerpen-provincie': [
    { name: 'Antwerpen', slug: 'antwerpen', population: 530000, emphasis: 'Antwerpen is economisch hart met grootste haven van Europa. Van diamanthandel tot mode en retail - voorraadbeheer is hier essentieel voor duizenden bedrijven.' },
    { name: 'Mechelen', slug: 'mechelen', population: 86000, emphasis: 'Mechelen groeit als retailstad met logistiek door centrale ligging. Real-time voorraadbeheer is cruciaal voor distributie.' },
    { name: 'Turnhout', slug: 'turnhout', population: 45000, emphasis: 'Turnhout is centrum van Kempen met grafische industrie waar materiaalvoorraad nauwkeurig moet worden gevolgd.' },
    { name: 'Mol', slug: 'mol', population: 37000, emphasis: 'Mol combineert technologie met toerisme waar diverse sectoren baat hebben bij flexibel voorraadbeheer.' },
    { name: 'Geel', slug: 'geel', population: 40000, emphasis: 'Geel is regionaal centrum Kempen met retail en diensten die profiteren van efficiënt voorraadbeheer.' },
    { name: 'Heist-op-den-Berg', slug: 'heist-op-den-berg', population: 43000, emphasis: 'Heist-op-den-Berg groeit met retail en logistiek. Ligging vraagt om professioneel voorraadbeheer.' },
    { name: 'Lier', slug: 'lier', population: 35500, emphasis: 'Lier combineert historisch centrum met moderne retail waar voorraadbeheer helpt bij efficiëntie.' },
    { name: 'Mortsel', slug: 'mortsel', population: 25500, emphasis: 'Mortsel is Antwerpse voorstad met sterke retail die profiteert van slim voorraadbeheer.' },
    { name: 'Boom', slug: 'boom', population: 18000, emphasis: 'Boom leeft van evenementen zoals Tomorrowland. Horeca heeft seizoensgebonden voorraadbeheer nodig.' },
    { name: 'Brasschaat', slug: 'brasschaat', population: 38000, emphasis: 'Brasschaat is welvarende voorstad met retail en diensten die baat hebben bij modern voorraadbeheer.' },
    { name: 'Duffel', slug: 'duffel', population: 17500, emphasis: 'Duffel kent productie en logistiek waar real-time voorraadinzicht cruciaal is.' },
    { name: 'Schoten', slug: 'schoten', population: 34000, emphasis: 'Schoten groeit als Antwerpse voorstad met retail die profiteert van efficiënt voorraadbeheer.' }
  ],
  'limburg': [
    { name: 'Hasselt', slug: 'hasselt', population: 78000, emphasis: 'Hasselt is modestad en shoppingcentrum waar retail en fashion voorraadbeheer essentieel is voor trends en collecties.' },
    { name: 'Genk', slug: 'genk', population: 66000, emphasis: 'Genk transformeerde naar logistiek centrum. Distributie en e-commerce bedrijven hebben hier nood aan professioneel voorraadbeheer.' },
    { name: 'Tongeren', slug: 'tongeren', population: 31000, emphasis: 'Tongeren heeft beroemde antiekmarkt en toerisme waar unieke voorraad goed moet worden gevolgd.' },
    { name: 'Sint-Truiden', slug: 'sint-truiden', population: 41000, emphasis: 'Sint-Truiden is fruitcentrum waar seizoensproducten en voedingsindustrie vraagt om nauwkeurig voorraadbeheer.' },
    { name: 'Beringen', slug: 'beringen', population: 46000, emphasis: 'Beringen transformeerde naar retail en recreatie waar voorraadbeheer helpt bij efficiëntie.' },
    { name: 'Bilzen', slug: 'bilzen', population: 32000, emphasis: 'Bilzen combineert fruitteelt met wijnbouw waar seizoensvoorraad perfect moet worden beheerd.' },
    { name: 'Lommel', slug: 'lommel', population: 35000, emphasis: 'Lommel combineert productie met toerisme waar diverse bedrijven profiteren van flexibel voorraadbeheer.' },
    { name: 'Heusden-Zolder', slug: 'heusden-zolder', population: 32000, emphasis: 'Heusden-Zolder transformeert naar retail en logistiek waar modern voorraadbeheer standaard wordt.' }
  ],
  'vlaams-brabant': [
    { name: 'Leuven', slug: 'leuven', population: 102000, emphasis: 'Leuven is universitaire stad met technologie, farma en levendige horeca. Innovatieve bedrijven kiezen hier voor modern voorraadbeheer.' },
    { name: 'Vilvoorde', slug: 'vilvoorde', population: 46000, emphasis: 'Vilvoorde is logistiek centrum aan kanaal. E-commerce distributie en groothandel hebben hier real-time voorraadbeheer nodig.' },
    { name: 'Tienen', slug: 'tienen', population: 34000, emphasis: 'Tienen kent voedingsindustrie met suikertraditie waar ingrediënten en eindproducten nauwkeurig moeten worden gevolgd.' },
    { name: 'Aarschot', slug: 'aarschot', population: 30000, emphasis: 'Aarschot is regionaal centrum met diverse KMO-sector die profiteert van toegankelijk voorraadbeheer.' },
    { name: 'Diest', slug: 'diest', population: 24000, emphasis: 'Diest combineert toerisme met retail waar seizoensgebonden voorraadbeheer belangrijk is.' },
    { name: 'Halle', slug: 'halle', population: 40000, emphasis: 'Halle groeit als Brusselse voorstad met logistiek en retail waar efficiënt voorraadbeheer cruciaal is.' },
    { name: 'Zaventem', slug: 'zaventem', population: 32000, emphasis: 'Zaventem leeft van luchthaven met internationale logistiek waar complex voorraadbeheer standaard is.' },
    { name: 'Grimbergen', slug: 'grimbergen', population: 37500, emphasis: 'Grimbergen kent brouwerijtraditie en groeiende retail waar voorraadbeheer helpt bij efficiëntie.' },
    { name: 'Dilbeek', slug: 'dilbeek', population: 43000, emphasis: 'Dilbeek is welvarende voorstad met retail en diensten die baat hebben bij modern voorraadbeheer.' },
    { name: 'Tervuren', slug: 'tervuren', population: 21500, emphasis: 'Tervuren combineert toerisme met retail waar seizoensgebonden voorraad goed moet worden beheerd.' }
  ]
};

// Generate FAQ data
function generateFAQs(locationName, locationType) {
  const baseFAQs = [
    {
      question: `Waarom is voorraadbeheer software belangrijk voor bedrijven in ${locationName}?`,
      answer: `Bedrijven in ${locationName} hebben baat bij voorraadbeheer software omdat het real-time inzicht geeft in voorraadniveaus, automatische bestellingen mogelijk maakt, en verspilling voorkomt. Dit bespaart tijd en geld, vooral voor KMO's.`
    },
    {
      question: `Is StockFlow geschikt voor kleine bedrijven in ${locationName}?`,
      answer: `Absoluut! StockFlow is speciaal ontworpen voor KMO's in ${locationName}. We bieden een gratis plan tot 30 producten, waarna je kunt opschalen naarmate je groeit. Geen complexe setup, geen dure investeringen.`
    },
    {
      question: `Kan ik StockFlow gebruiken met meerdere vestigingen in ${locationName}?`,
      answer: `Ja, StockFlow ondersteunt multi-vestiging beheer. Of je nu meerdere winkels in ${locationName} hebt of ook elders in België, je beheert alles vanuit één centraal systeem met real-time synchronisatie.`
    },
    {
      question: `Hoe snel kan ik starten met voorraadbeheer in ${locationName}?`,
      answer: `Je kunt binnen 5 minuten starten! Registreer gratis, voeg je producten toe (handmatig of via import), en je bent klaar. Geen training nodig dankzij onze intuïtieve interface.`
    },
    {
      question: `Biedt StockFlow lokale support voor bedrijven in ${locationName}?`,
      answer: `Ja, we bieden Nederlandstalige support voor alle Belgische klanten, inclusief ${locationName}. Ons team begrijpt de lokale business cultuur en helpt je graag verder.`
    }
  ];

  if (locationType === 'city') {
    baseFAQs.push({
      question: `Welke sectoren in ${locationName} gebruiken StockFlow?`,
      answer: `StockFlow wordt gebruikt door retail, horeca, productie, e-commerce, bouw en vele andere sectoren in ${locationName}. Onze software is flexibel genoeg voor alle types voorraad.`
    });
  }

  return baseFAQs;
}

// Generate page template
function generateCountryPage() {
  const location = belgiumCountry;
  const faqs = generateFAQs(location.name, 'country');
  
  return `import SEO from '../../../components/SEO';
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
    locationName: '${location.name}',
    locationType: 'country',
    areaServed: ${JSON.stringify(provinces.map(p => p.name))}
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.stockflow.be' },
    { name: '${location.name}', url: 'https://www.stockflow.be/voorraadbeheer-software-belgie' }
  ]);

  const stats = [
    { label: 'Actieve Bedrijven', value: '1.5M+', description: 'Ondernemingen in België' },
    { label: 'KMO\'s', value: '99%', description: 'Zijn kleine en middelgrote bedrijven' },
    { label: 'Sectoren', value: '${location.keyIndustries.length}+', description: 'Belangrijke industrieën' },
    { label: 'Klantrating', value: '4.9/5', description: 'Gemiddelde tevredenheid' }
  ];

  const faqs = ${JSON.stringify(faqs, null, 2)};

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
        locationName="${location.name}"
        locationType="country"
        description="${location.description}"
        stats={{
          businesses: ${location.totalBusinesses},
          kmoPercentage: ${location.kmoPercentage}
        }}
      />

      <RegionalFeatures
        locationName="${location.name}"
        emphasis="Speciaal ontworpen voor Belgische KMO's. Van Antwerpen tot West-Vlaanderen, van Leuven tot Limburg - duizenden bedrijven vertrouwen op StockFlow voor hun dagelijks voorraadbeheer."
      />

      <RegionalStats
        locationName="${location.name}"
        stats={stats}
        industries={${JSON.stringify(location.keyIndustries)}}
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
            ${provinces.map(province => `<Link
              to="/voorraadbeheer-software-${province.slug}"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">${province.name}</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600 mb-3">${province.economicProfile.substring(0, 120)}...</p>
              <div className="flex flex-wrap gap-2">
                ${province.keyIndustries.slice(0, 3).map(industry => `<span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">${industry}</span>`).join('\n                ')}
              </div>
            </Link>`).join('\n            ')}
          </div>
        </div>
      </section>

      <RegionalFAQ
        locationName="${location.name}"
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
}`;
}

function generateProvincePage(province) {
  const cities = citiesByProvince[province.slug] || [];
  const faqs = generateFAQs(province.name, 'province');
  
  return `import SEO from '../../../components/SEO';
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

export default function VoorraadbeheerSoftware${province.name.replace(/[^a-zA-Z]/g, '')}() {
  usePageRefresh();

  const testimonials = getTestimonialsByProvince('${province.slug}');

  const structuredData = generateRegionalStructuredData({
    locationName: '${province.name}',
    locationType: 'province',
    region: '${province.name}',
    areaServed: ${JSON.stringify(cities.map(c => c.name))}
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.stockflow.be' },
    { name: 'België', url: 'https://www.stockflow.be/voorraadbeheer-software-belgie' },
    { name: '${province.name}', url: 'https://www.stockflow.be/voorraadbeheer-software-${province.slug}' }
  ]);

  const stats = [
    { label: 'Inwoners', value: '${(province.population / 1000000).toFixed(1)}M', description: 'Mensen in ${province.name}' },
    { label: 'Hoofdstad', value: '${province.capital}', description: 'Provinciale hoofdstad' },
    { label: 'Sectoren', value: '${province.keyIndustries.length}+', description: 'Belangrijke industrieën' },
    { label: 'Klantrating', value: '4.9/5', description: 'Gemiddelde tevredenheid' }
  ];

  const faqs = ${JSON.stringify(faqs, null, 2)};

  return (
    <RegionalPageLayout>
      <SEO
        title="Voorraadbeheer Software ${province.name} | StockFlow"
        description="Populaire voorraadbeheer software voor ${province.name}. Veel gebruikt door bedrijven in ${province.majorCities.slice(0, 3).join(', ')} en meer. ✓ Gratis tot 30 producten"
        keywords="voorraadbeheer software ${province.slug}, voorraad ${province.slug}, stockbeheer ${province.slug}, inventory ${province.name}"
        url="https://www.stockflow.be/voorraadbeheer-software-${province.slug}"
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
        locationName="${province.name}"
        locationType="province"
        description="${province.economicProfile}"
        stats={{
          population: ${province.population}
        }}
      />

      <RegionalFeatures
        locationName="${province.name}"
        emphasis="Veel gebruikt door bedrijven in ${province.majorCities.slice(0, 3).join(', ')} en andere steden. ${province.name} heeft een sterke ${province.keyIndustries[0].toLowerCase()} sector waar voorraadbeheer essentieel is."
      />

      <RegionalStats
        locationName="${province.name}"
        stats={stats}
        industries={${JSON.stringify(province.keyIndustries)}}
      />

      {testimonials.length > 0 && (
        <RegionalTestimonials
          testimonials={testimonials.slice(0, 3)}
          locationName="${province.name}"
        />
      )}

      {/* City Links Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Voorraadbeheer per <span className="text-blue-600">Stad</span> in ${province.name}
          </h2>
          <p className="text-center text-lg text-gray-700 mb-12">
            Ontdek specifieke informatie voor jouw stad
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${cities.map(city => `<Link
              to="/voorraadbeheer-software-${city.slug}"
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">${city.name}</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-sm text-gray-600">${city.population.toLocaleString('nl-BE')} inwoners</p>
            </Link>`).join('\n            ')}
          </div>
        </div>
      </section>

      <RegionalFAQ
        locationName="${province.name}"
        faqs={faqs}
      />

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start vandaag met voorraadbeheer in ${province.name}
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
}`;
}

function generateCityPage(city, provinceName, provinceSlug) {
  const faqs = generateFAQs(city.name, 'city');
  
  return `import SEO from '../../../components/SEO';
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

export default function VoorraadbeheerSoftware${city.name.replace(/[^a-zA-Z]/g, '')}() {
  usePageRefresh();

  const testimonials = getRandomTestimonials('${city.slug}', 2);

  const structuredData = generateRegionalStructuredData({
    locationName: '${city.name}',
    locationType: 'city',
    region: '${provinceName}',
    areaServed: ['${city.name}', '${provinceName}']
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.stockflow.be' },
    { name: 'België', url: 'https://www.stockflow.be/voorraadbeheer-software-belgie' },
    { name: '${provinceName}', url: 'https://www.stockflow.be/voorraadbeheer-software-${provinceSlug}' },
    { name: '${city.name}', url: 'https://www.stockflow.be/voorraadbeheer-software-${city.slug}' }
  ]);

  const stats = [
    { label: 'Inwoners', value: '${city.population.toLocaleString('nl-BE')}', description: 'Mensen in ${city.name}' },
    { label: 'Provincie', value: '${provinceName}', description: 'Deel van ${provinceName}' },
    { label: 'Lokale KMO\'s', value: '1000+', description: 'Actieve bedrijven' },
    { label: 'Klantrating', value: '4.9/5', description: 'Gemiddelde tevredenheid' }
  ];

  const faqs = ${JSON.stringify(faqs, null, 2)};

  return (
    <RegionalPageLayout>
      <SEO
        title="Voorraadbeheer Software ${city.name} | Voor bedrijven in ${city.name}"
        description="Voorraadbeheer software voor bedrijven in ${city.name}. ${city.emphasis} ✓ Gratis tot 30 producten ✓ Nederlandse support"
        keywords="voorraadbeheer ${city.slug}, voorraad beheer ${city.name}, stockbeheer ${city.name}, inventory ${city.name}"
        url="https://www.stockflow.be/voorraadbeheer-software-${city.slug}"
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
        locationName="${city.name}"
        locationType="city"
        description="${city.emphasis}"
        stats={{
          population: ${city.population}
        }}
      />

      <RegionalFeatures
        locationName="${city.name}"
        emphasis="Speciaal voor ${city.name}: real-time voorraadbeheer dat aansluit bij de lokale business dynamiek."
      />

      <RegionalStats
        locationName="${city.name}"
        stats={stats}
      />

      {testimonials.length > 0 && (
        <RegionalTestimonials
          testimonials={testimonials}
          locationName="${city.name}"
        />
      )}

      {/* Local Business Types */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Geschikt voor <span className="text-blue-600">alle sectoren</span> in ${city.name}
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
        locationName="${city.name}"
        faqs={faqs}
      />

      {/* Breadcrumb Navigation */}
      <section className="py-8 px-4 bg-white border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/voorraadbeheer-software-belgie" className="hover:text-blue-600">België</Link>
            <span>›</span>
            <Link to="/voorraadbeheer-software-${provinceSlug}" className="hover:text-blue-600">${provinceName}</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">${city.name}</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start vandaag in ${city.name}
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
}`;
}

// Generate all pages
console.log('🚀 Generating Belgian Regional SEO Pages...\n');

let created = 0;
let skipped = 0;

// 1. Generate country page
const countryFileName = 'voorraadbeheer-software-belgie.tsx';
const countryFilePath = path.join(PAGES_DIR, countryFileName);
if (!fs.existsSync(countryFilePath)) {
  fs.writeFileSync(countryFilePath, generateCountryPage(), 'utf8');
  console.log(`✅ Created: ${countryFileName}`);
  created++;
} else {
  console.log(`⏭️  Skipped: ${countryFileName} (already exists)`);
  skipped++;
}

// 2. Generate province pages
for (const province of provinces) {
  const provinceFileName = `voorraadbeheer-software-${province.slug}.tsx`;
  const provinceFilePath = path.join(PAGES_DIR, provinceFileName);
  
  if (!fs.existsSync(provinceFilePath)) {
    fs.writeFileSync(provinceFilePath, generateProvincePage(province), 'utf8');
    console.log(`✅ Created: ${provinceFileName}`);
    created++;
  } else {
    console.log(`⏭️  Skipped: ${provinceFileName} (already exists)`);
    skipped++;
  }
}

// 3. Generate city pages
for (const province of provinces) {
  const cities = citiesByProvince[province.slug] || [];
  
  for (const city of cities) {
    const cityFileName = `voorraadbeheer-software-${city.slug}.tsx`;
    const cityFilePath = path.join(PAGES_DIR, cityFileName);
    
    if (!fs.existsSync(cityFilePath)) {
      fs.writeFileSync(cityFilePath, generateCityPage(city, province.name, province.slug), 'utf8');
      console.log(`✅ Created: ${cityFileName}`);
      created++;
    } else {
      console.log(`⏭️  Skipped: ${cityFileName} (already exists)`);
      skipped++;
    }
  }
}

console.log(`\n✨ Generation Complete!`);
console.log(`   Created: ${created} pages`);
console.log(`   Skipped: ${skipped} pages`);
console.log(`   Total:   ${created + skipped} pages`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Run the script with: node scripts/generate-regional-seo-pages.mjs`);
console.log(`   2. Add routes to App.tsx`);
console.log(`   3. Update sitemap generation`);
console.log(`   4. Test the pages`);

