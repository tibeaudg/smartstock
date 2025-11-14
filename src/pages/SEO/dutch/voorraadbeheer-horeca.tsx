import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';
import { RelatedArticles } from '@/components/seo/RelatedArticles';
import { getRelatedPages } from '@/config/topicClusters';
import { Check, TrendingUp, AlertCircle, BarChart3, Package, Clock, DollarSign, Users, Zap } from 'lucide-react';

const faqData = [
  {
    question: 'Wat is voorraadbeheer in de horeca?',
    answer: 'Voorraadbeheer in de horeca omvat het plannen, registreren en controleren van alle producten die binnenkomen en verbruikt worden. Dit omvat inkoop, opslag & houdbaarheid, verbruik en waste, bestelmomenten & leveranciers, en realtime voorraadniveaus. Het doel is altijd de juiste hoeveelheid producten op het juiste moment hebben — zonder overschot, tekorten of verborgen kosten.'
  },
  {
    question: 'Waarom is goed voorraadbeheer cruciaal voor horeca?',
    answer: 'Een goed ingericht voorraadproces zorgt voor snellere werkprocessen, minder voedselverspilling en derving, lagere kosten en betere marges, minder kapitaal dat vastzit in voorraad, meer rust in de keuken, en betere gastbeleving (nooit meer "sorry, op"). In een sector waar marges dun zijn, maakt dit structureel het verschil.'
  },
  {
    question: 'Hoe helpt StockFlow horecaondernemers?',
    answer: 'StockFlow combineert voorraadbeheer, receptkostprijsberekening en automatische bestellijsten zodat restaurants, cafés en cateringbedrijven direct inzicht hebben in marges en voorraadniveaus. Met realtime dashboards, automatische besteladviezen en mobiele telrondes krijg je volledige controle over je keuken- en drankvoorraden.'
  },
  {
    question: 'Werkt StockFlow met meerdere vestigingen?',
    answer: 'Ja. Met multi-locatie beheer verdeel je voorraad over verschillende keukens, bars of foodtrucks en hou je alles in één dashboard bij. Perfect voor restaurantketens, hotelgroepen of cateringbedrijven met meerdere locaties.'
  },
  {
    question: 'Kan ik leveranciers en bestellingen automatiseren?',
    answer: 'Via slimme bestelpunten (PAR-niveaus) stuurt StockFlow automatisch bestelaanvragen naar je vaste leveranciers wanneer ingrediënten bijna op zijn. Dit voorkomt tekorten en optimaliseert je bestelprocessen.'
  },
  {
    question: 'Is er een mobiele app voor telrondes?',
    answer: 'Met de iOS en Android app voer je telrondes uit, scan je barcodes en noteer je houdbaarheidsdatums direct op de vloer. Geen papieren lijstjes meer nodig — alles wordt realtime gesynchroniseerd.'
  },
  {
    question: 'Wat kost voorraadbeheer voor horeca?',
    answer: 'Je start gratis tot 30 producten. Premium pakketten beginnen vanaf €49/maand inclusief recepturen, kostprijsanalyse en integraties. Geen verborgen kosten of lange contracten.'
  },
  {
    question: 'Hoe verschilt realtime voorraadbeheer van theoretisch verbruik?',
    answer: 'Theoretisch verbruik is altijd foutgevoelig omdat het afhankelijk is van leveringsfouten, fouten in POS-aanslagen, niet-geregistreerd afval, variatie in porties en onnauwkeurige recepturen. Realtime digitaal voorraadbeheer toont exact wat er ligt, wat bijna op is en wat afwijkingen veroorzaakt — zonder dat dit een dagelijkse strijd wordt.'
  }
];

const structuredData = generateComprehensiveStructuredData('software', {
  title: 'Voorraadbeheer Horeca – Complete Gids voor Efficiënt en Duurzaam Voorraadbeheer | Stockflow',
  url: 'https://www.stockflow.be/voorraadbeheer-horeca',
  description:
    'Ontdek hoe je voorraadbeheer in de horeca optimaliseert. Minder verspilling, betere marges en realtime inzicht met moderne voorraadsoftware. Tips, termen en strategieën.',
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
      'Verlies- en verspilling analyse',
      'Realtime voorraadniveaus',
      'Foodcost- en marge-analyses'
    ],
    image: 'https://www.stockflow.be/Inventory-Management.png',
    url: 'https://www.stockflow.be/voorraadbeheer-horeca'
  }
});

export default function VoorraadbeheerHorecaPage() {
  usePageRefresh();
  const relatedPages = getRelatedPages('/voorraadbeheer-horeca', 6);

  return (
    <SeoPageLayout title="Voorraadbeheer voor Horeca">
      <SEO
        title="Voorraadbeheer Horeca – Complete Gids voor Efficiënt en Duurzaam Voorraadbeheer | Stockflow"
        description="Ontdek hoe je voorraadbeheer in de horeca optimaliseert. Minder verspilling, betere marges en realtime inzicht met moderne voorraadsoftware. Tips, termen en strategieën."
        keywords="voorraadbeheer horeca, horeca voorraad, horeca voorraadbeheer software, horeca inventaris, foodcost, keukenvoorraad, restaurant voorraadbeheer, derving horeca, voorraadbeheersysteem horeca, voedselverspilling horeca, horeca marge, kostprijs horeca"
        url="https://www.stockflow.be/voorraadbeheer-horeca"
        structuredData={structuredData}
        locale="nl"
        alternateLanguages={[{ lang: 'nl-BE', url: 'https://www.stockflow.be/voorraadbeheer-horeca' }, { lang: 'en-US', url: 'https://www.stockflow.be/inventory-for-hospitality' }]}
      />

      {/* Hero Section */}
      <section className="bg-orange-50 border border-orange-100 rounded-3xl px-6 sm:px-10 py-12 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-orange-700 bg-white/70 px-3 py-1 rounded-full">
              🍽️ Horeca Voorraadbeheer
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
              Voorraadbeheer in de Horeca: Complete Gids voor Efficiëntie, Minder Verspilling & Betere Marges
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mt-5 leading-relaxed">
              Voorraadbeheer in de horeca is één van de meest bepalende factoren voor je winstgevendheid — en toch blijft het voor veel restaurants, cafés en hotelkeukens een blinde vlek. Met moderne tools en slimme processen kun je dit volledig omdraaien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/auth" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg text-center transition-colors">
                Start Gratis
              </Link>
-
            </div>
            <p className="text-xs text-gray-500 mt-4">Voor restaurants, cafés, catering & dark kitchens • Beschikbaar in het Nederlands en Frans</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Belangrijkste functies</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span>Receptuur en kostprijs per gerecht</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span>Houdbaarheid- en allergenenbeheer</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span>Team-app voor telrondes & barcodes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span>Automatische besteladviezen per leverancier</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span>Realtime voorraadniveaus en dashboards</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* What is Voorraadbeheer Section */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Wat is voorraadbeheer in de horeca?</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Voorraadbeheer in de horeca omvat het <strong>plannen, registreren en controleren</strong> van alle producten die binnenkomen en verbruikt worden. Denk aan:
          </p>
          <ul className="grid md:grid-cols-2 gap-4 mb-8 list-none">
            <li className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <Package className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Inkoop</h3>
                <p className="text-sm text-gray-600">Gestructureerde aankopen bij leveranciers</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <Clock className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Opslag & houdbaarheid</h3>
                <p className="text-sm text-gray-600">Organisatie en FIFO-principes</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <BarChart3 className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Verbruik en waste</h3>
                <p className="text-sm text-gray-600">Tracking van consumptie en verspilling</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <Zap className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Bestelmomenten & leveranciers</h3>
                <p className="text-sm text-gray-600">Automatische besteladviezen</p>
              </div>
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-lg">
            Het doel: <strong>altijd de juiste hoeveelheid producten op het juiste moment</strong> — zonder overschot, tekorten of verborgen kosten.
          </p>
        </div>
      </section>

      {/* Why Important Section */}
      <section className="max-w-6xl mx-auto px-4 mt-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Waarom goed voorraadbeheer cruciaal is</h2>
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          Een goed ingericht voorraadproces zorgt voor:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-200">
            <TrendingUp className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Snellere werkprocessen</h3>
            <p className="text-sm text-gray-600">Minder tijd verspild aan zoeken en tellen</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-200">
            <AlertCircle className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Minder voedselverspilling</h3>
            <p className="text-sm text-gray-600">Betere controle op houdbaarheid en derving</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-200">
            <DollarSign className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Lagere kosten en betere marges</h3>
            <p className="text-sm text-gray-600">Optimalisatie van foodcost percentages</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-200">
            <Package className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Minder kapitaal vast in voorraad</h3>
            <p className="text-sm text-gray-600">Efficiëntere cashflow management</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-200">
            <Users className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Meer rust in de keuken</h3>
            <p className="text-sm text-gray-600">Geen stress meer over tekorten</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-200">
            <Check className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Betere gastbeleving</h3>
            <p className="text-sm text-gray-600">Nooit meer "sorry, op"</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg mt-8 font-semibold">
          In een sector waar marges dun zijn, maakt dit structureel het verschil.
        </p>
      </section>

      {/* Key Components Section */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Belangrijke onderdelen van horeca voorraadbeheer</h2>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">1</span>
              Inzicht in je voorraadniveaus
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Je moet op elk moment weten <strong>wat je hebt, waar het ligt en hoe lang het houdbaar is</strong>. Zeker bij bederfelijke producten is dit cruciaal. Met <Link to="/voorraadbeheer-software" className="text-orange-600 hover:underline font-semibold">voorraadbeheer software</Link> krijg je realtime inzicht in al je voorraadniveaus.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">2</span>
              Verbruiks- en afvalanalyse
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Dagelijks of wekelijks inzicht in consumptie laat je zien:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Wat populair is</li>
              <li>Wat te veel wordt ingekocht</li>
              <li>Waar verspilling ontstaat</li>
              <li>Of porties consistent zijn</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Dit helpt je om <Link to="/voorraadbeheer-fouten-voorkomen" className="text-orange-600 hover:underline font-semibold">veelgemaakte fouten te voorkomen</Link> en je processen te optimaliseren.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">3</span>
              Bestelpunten (PAR-niveaus) instellen
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Met minimale en maximale niveaus (PAR) bestel je precies op tijd bij. Dit voorkomt zowel tekorten als overbestellingen. <Link to="/voorraadbeheer-automatiseren-5-stappen" className="text-orange-600 hover:underline font-semibold">Automatiseer je bestelprocessen</Link> voor nog meer efficiëntie.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">4</span>
              Leveranciersbeheer
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Gestructureerde ontvangst van leveringen voorkomt manco's, overdatumproduct, factuur-fouten en onvolledige of verkeerde producten. Dit bespaart tijd en voorkomt dure fouten.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">5</span>
              Realtime rapportage
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Moderne horeca werkt niet meer met papieren lijstjes — digitale systemen geven direct inzicht zodat je sneller beslissingen kunt nemen. Met <Link to="/mobiel-voorraadbeheer" className="text-orange-600 hover:underline font-semibold">mobiel voorraadbeheer</Link> kun je overal en altijd je voorraad beheren.
            </p>
          </div>
        </div>
      </section>

      {/* Practical Tips Section */}
      <section className="max-w-6xl mx-auto px-4 mt-16 bg-gray-50 rounded-3xl p-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Praktische tips voor beter voorraadbeheer (die echt werken)</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Maak het een teamsport
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Betrek keuken én bediening. Iedereen moet verspilling, fouten of afwijkingen kunnen melden. Dit creëert een cultuur van verantwoordelijkheid en zorgt voor betere resultaten.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Tel regelmatig
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Dagelijks voor bederfelijke of dure producten, wekelijks voor de volledige inventaris. Regelmatige tellingen voorkomen verrassingen en helpen je trends te identificeren.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Organiseer je opslagruimte
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Een gestructureerd magazijn = minder fouten. Denk aan schappen per categorie, FIFO (First In, First Out), labeling en een vaste looproute. Dit bespaart tijd en voorkomt fouten.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Registreer omzet en verbruik elke dag
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Zo zie je trends en kun je tijdig bijsturen. Dagelijkse registratie geeft je de data die je nodig hebt om slimme beslissingen te nemen. <Link to="/voorraadbeheer-tips" className="text-orange-600 hover:underline font-semibold">Meer tips voor voorraadbeheer</Link>.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 md:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Houd reservevoorraden slim bij
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Voor snelverbruikers is een buffer handig — zonder dat er producten verlopen. Bepaal per product wat een veilige buffer is en monitor dit regelmatig.
            </p>
          </div>
        </div>
      </section>

      {/* Theoretical vs Realtime Section */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Theoretisch verbruik vs realtime voorraadbeheer</h2>
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8 mb-8">
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Veel restaurants proberen te werken met <strong>theoretische voorraad</strong>: het verschil tussen wat binnenkomt, wat verkocht wordt, en wat volgens recepturen verbruikt zou moeten zijn.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Maar dit is <strong>altijd foutgevoelig</strong>, omdat het afhankelijk is van:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Leveringsfouten</li>
            <li>Fouten in POS-aanslagen</li>
            <li>Niet-geregistreerd afval</li>
            <li>Variatie in porties</li>
            <li>Onnauwkeurige recepturen</li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-lg font-semibold">
            Het resultaat: je moet alsnog handmatig controleren.
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Realtime digitaal voorraadbeheer pakt dat anders aan:</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            Je ziet exact wat er ligt, wat bijna op is en wat afwijkingen veroorzaakt — zonder dat dit een dagelijkse strijd wordt. Met <Link to="/voorraadbeheer-software" className="text-orange-600 hover:underline font-semibold">moderne voorraadbeheer software</Link> zoals StockFlow krijg je realtime inzicht en automatische updates bij verkoop en productie.
          </p>
        </div>
      </section>

      {/* Software Benefits Section */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Voorraadbeheer software voor horeca: waarom het het verschil maakt</h2>
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          Digitale tools zoals StockFlow automatiseren het volledige proces:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <BarChart3 className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Realtime inzicht in je voorraad</h3>
            <p className="text-sm text-gray-600">Altijd weten wat je hebt, waar het ligt en hoeveel het waard is</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <Zap className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Automatische updates</h3>
            <p className="text-sm text-gray-600">Bij verkoop en productie wordt je voorraad automatisch bijgewerkt</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <Package className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Besteladvies op basis van verbruik</h3>
            <p className="text-sm text-gray-600">Slimme suggesties wanneer je moet bestellen en hoeveel</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <DollarSign className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Foodcost- en marge-analyses</h3>
            <p className="text-sm text-gray-600">Inzicht in winstgevendheid per gerecht en ingrediënt</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <Users className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Labeling, mise-en-place, menubeheer</h3>
            <p className="text-sm text-gray-600">Alles wat je nodig hebt voor een professionele keuken</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <Check className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Minder fouten, minder administratie</h3>
            <p className="text-sm text-gray-600">Meer controle met minder werk dankzij automatisering</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg font-semibold">
          Het resultaat: je hoeft niet langer te vertrouwen op theoretische berekeningen of rommelige papieren lijstjes.
        </p>
      </section>

      {/* Common Mistakes Section */}
      <section className="max-w-6xl mx-auto px-4 mt-16 bg-red-50 border border-red-200 rounded-3xl p-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Veelgemaakte fouten in horeca voorraadbeheer</h2>
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          Deze fouten kosten je dagelijks geld. Herken je ze?
        </p>
        <ul className="space-y-4 mb-8">
          <li className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <strong className="text-gray-900">Geen vaste voorraadtellers of tellmomenten</strong>
              <p className="text-sm text-gray-600 mt-1">Zonder structuur verlies je snel het overzicht</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <strong className="text-gray-900">Producten zonder categorie of structuur in de opslag</strong>
              <p className="text-sm text-gray-600 mt-1">Chaos in je magazijn = tijdverspilling en fouten</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <strong className="text-gray-900">Geen registratie van afval</strong>
              <p className="text-sm text-gray-600 mt-1">Verspilling blijft onzichtbaar en kost je geld</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <strong className="text-gray-900">Onrealistische portiegroottes</strong>
              <p className="text-sm text-gray-600 mt-1">Leidt tot verkeerde berekeningen en verlies</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <strong className="text-gray-900">Geen koppeling met POS en keukenprocessen</strong>
              <p className="text-sm text-gray-600 mt-1">Handmatige invoer = fouten en tijdverlies</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <strong className="text-gray-900">Te grote bestellingen "voor de zekerheid"</strong>
              <p className="text-sm text-gray-600 mt-1">Kapitaal vastzetten en risico op verlies</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <strong className="text-gray-900">Gebrek aan zicht op voorraadwaarde</strong>
              <p className="text-sm text-gray-600 mt-1">Cashflowproblemen door onzichtbare kosten</p>
            </div>
          </li>
        </ul>
        <div className="bg-white rounded-xl p-6 border border-orange-200">
          <p className="text-gray-700 leading-relaxed font-semibold">
            Door dit te automatiseren met <Link to="/voorraadbeheer-fouten-voorkomen" className="text-orange-600 hover:underline">goede voorraadbeheer software</Link> haal je onmiddellijk winst binnen.
          </p>
        </div>
      </section>

      {/* Impact on Margins Section */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Impact op je marges</h2>
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-8 mb-8">
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Elke dag worden er in horeca keukens producten weggegooid zonder dat iemand het doorheeft. Een paar euro hier, vijf euro daar, en op het einde van de maand loopt dit op tot honderden of duizenden euro's.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Voorraadbeheer helpt je:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-gray-900">ROI per ingrediënt te begrijpen</strong>
                <p className="text-sm text-gray-600 mt-1">Weten welke producten het meest winstgevend zijn</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-gray-900">Hoog- en laagverbruikers te identificeren</strong>
                <p className="text-sm text-gray-600 mt-1">Optimaliseer je inkoopstrategie</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-gray-900">Dure producten beter te controleren</strong>
                <p className="text-sm text-gray-600 mt-1">Minder verlies op hoogwaardige ingrediënten</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-gray-900">Derving terug te dringen</strong>
                <p className="text-sm text-gray-600 mt-1">Minder producten verloren door slecht beheer</p>
              </div>
            </div>
            <div className="flex items-start gap-3 md:col-span-2">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-gray-900">Foodcost percentages consistent te houden</strong>
                <p className="text-sm text-gray-600 mt-1">Voorspelbare winstgevendheid en betere planning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4 mt-16 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Complete oplossing voor food cost & voorraad</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            StockFlow koppelt aankoop, voorraad en verkoop zodat je exact weet welke gerechten winstgevend zijn. Plan menu's, analyseer verspilling en link alles met kassasystemen. Perfect voor drukke horecateams die snel willen schakelen.
          </p>
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Real-time dashboards</h3>
              <p className="text-sm text-gray-600">Bekijk voorraadwaardes, marge per gerecht en verwachte tekorten in één overzicht.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Integraties met POS & boekhouding</h3>
              <p className="text-sm text-gray-600">Synchroniseer verkoopdata vanuit Lightspeed, Toast of Deliverect en stuur facturen naar Exact of Sage.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Voorraadcontrole per zone</h3>
              <p className="text-sm text-gray-600">Beheer koelcellen, bar, dry-storage en terrace voorraad met zone-specifieke minimums.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultaten bij horecaklanten</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>28% minder voedselverspilling na 60 dagen</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>4 uur minder telwerk per week</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>18% hogere brutomarge op topgerechten</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>100% inzicht in allergenen en traceerbaarheid</span>
            </li>
          </ul>
          <Link to="/case-studies" className="inline-flex mt-6 text-orange-600 font-semibold hover:underline">
            Lees klantverhalen →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 mt-16 bg-orange-600 text-white rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Tijd om serieus aan de slag te gaan met voorraadbeheer</h2>
        <p className="mt-4 text-base sm:text-lg opacity-90 mb-2">
          Voorraadbeheer is misschien niet het meest sexy onderdeel van horeca, maar het is wél één van de meest winstgevende verbeterpunten. Door je processen te digitaliseren, creëer je:
        </p>
        <ul className="text-left max-w-2xl mx-auto mt-6 space-y-2 opacity-90">
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>Minder verspilling</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>Meer marge</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>Meer rust in de keuken</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>Betere gastbeleving</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>Beter inzicht in de gezondheid van je zaak</span>
          </li>
        </ul>
        <p className="mt-6 text-base sm:text-lg opacity-90 mb-6">
          Wil je ontdekken hoe StockFlow je kan helpen om je voorraadbeheer te automatiseren? Start vandaag nog.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth" className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-50 transition-colors">
            Start Gratis
          </Link>
      
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">Veelgestelde vragen over voorraadbeheer in de horeca</h2>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <details key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <summary className="font-semibold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors">{item.question}</summary>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related Articles Section */}
      {relatedPages.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-16 mb-16">
          <RelatedArticles 
            articles={relatedPages} 
            title="Meer lezen over voorraadbeheer?"
            language="nl"
          />
        </section>
      )}
    </SeoPageLayout>
  );
}
