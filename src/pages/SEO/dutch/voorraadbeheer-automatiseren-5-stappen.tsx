import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { StructuredData } from '@/components/StructuredData';
import {
  Workflow,
  ClipboardCheck,
  Zap,
  Package,
  BarChart3,
  Smartphone,
  ArrowRight,
  Star
} from 'lucide-react';

const stappen = [
  {
    nummer: 'Stap 1',
    titel: 'Analyseer je huidige processen',
    beschrijving:
      'Breng in kaart hoe bestellingen, ontvangsten en tellingen vandaag gebeuren. Noteer bottlenecks, afhankelijkheden van Excel en informatie die ontbreekt.'
  },
  {
    nummer: 'Stap 2',
    titel: 'Centraliseer data in één platform',
    beschrijving:
      'Kies software waar producten, locaties, leveranciers en documenten samenkomen. StockFlow importeert bestaande lijsten zodat iedereen met dezelfde data werkt.'
  },
  {
    nummer: 'Stap 3',
    titel: 'Automatiseer alerts en bestellingen',
    beschrijving:
      'Stel minimum- en maximumvoorraad in, koppel leveranciers en activeer automatische bestellingen of goedkeuringsflows.'
  },
  {
    nummer: 'Stap 4',
    titel: 'Gebruik mobiele apps & barcodes',
    beschrijving:
      'Met mobiele scanning verdwijnen papieren lijsten. Medewerkers voeren tellingen, ontvangsten en transfers realtime uit, ook in het magazijn.'
  },
  {
    nummer: 'Stap 5',
    titel: 'Optimaliseer op basis van rapporten',
    beschrijving:
      'Analyseer rotatie, leverbetrouwbaarheid en voorraadwaarde. Gebruik de inzichten om nieuwe regels of automatiseringen toe te voegen.'
  }
];

const faqData = [
  {
    question: 'Hoe lang duurt het om voorraadbeheer te automatiseren?',
    answer:
      'Veel KMOs zetten de basis binnen twee weken. Start met één proces (bijvoorbeeld inkoop) en breid daarna uit naar productie, verkoop en service.'
  },
  {
    question: 'Kan ik StockFlow koppelen aan mijn webshop of boekhouding?',
    answer:
      'Ja. StockFlow integreert met onder meer Shopify, WooCommerce, Exact Online en Lightspeed POS. Hierdoor blijven bestellingen en voorraad synchroon.'
  },
  {
    question: 'Heb ik speciale scanners nodig?',
    answer:
      'Nee. De mobiele apps van StockFlow werken met de camera van je smartphone. Voor intensief gebruik kun je optioneel Bluetooth scanners koppelen.'
  },
    {
      question: 'Wat als mijn team liever stap voor stap automatiseert?',
      answer:
        'Geen probleem. Je activeert functies wanneer je er klaar voor bent. Start bijvoorbeeld met automatische alerts en voeg later geavanceerde workflows toe. StockFlow is modulair opgebouwd, zodat je kunt groeien in je eigen tempo.'
    },
    {
      question: 'Wat zijn de voordelen van geautomatiseerd voorraadbeheer?',
      answer: 'Geautomatiseerd voorraadbeheer biedt vele voordelen: 70% tijdsbesparing op administratie, 25% kostenreductie door betere planning, 90% minder fouten door automatisering, real-time inzicht altijd en overal, automatische bestelmeldingen, en betere klanttevredenheid door minder stockouts. De ROI is meestal binnen de eerste maand zichtbaar.'
    },
    {
      question: 'Hoe begin ik met voorraadbeheer automatiseren?',
      answer: 'Begin met deze stappen: 1) Analyseer je huidige processen en identificeer bottlenecks, 2) Kies gebruiksvriendelijke software zoals StockFlow, 3) Importeer je bestaande voorraaddata, 4) Stel automatische meldingen in, 5) Train je team. Start klein met één proces en breid geleidelijk uit. StockFlow biedt een gratis plan om te beginnen.'
    },
    {
      question: 'Welke processen kan ik automatiseren in voorraadbeheer?',
      answer: 'Je kunt automatiseren: voorraadupdates bij verkopen/inkopen, bestelmeldingen bij lage voorraad, voorraadsynchronisatie tussen kanalen, rapportage generatie, cycle counting planning, leverancierscommunicatie, en data-import/export. Moderne software zoals StockFlow biedt al deze automatiseringen in één platform.'
    },
    {
      question: 'Hoeveel tijd bespaar ik met geautomatiseerd voorraadbeheer?',
      answer: 'Bedrijven besparen gemiddeld 10-15 uur per week door automatisering. Dit komt door: geen handmatige tellingen meer, automatische voorraadupdates, geautomatiseerde bestellingen, en real-time synchronisatie. Veel bedrijven zien 70% tijdsbesparing op voorraadadministratie, waardoor ze kunnen focussen op groei.'
    },
    {
      question: 'Is voorraadbeheer automatiseren duur?',
      answer: 'Nee, automatiseren hoeft niet duur te zijn. StockFlow biedt een volledig gratis plan voor tot 30 producten, perfect om te starten. Premium plannen beginnen vanaf €29 per maand. De besparingen (tijd en kosten) zijn meestal veel hoger dan de investering. De ROI is meestal binnen de eerste maand zichtbaar.'
    },
    {
      question: 'Kan ik voorraadbeheer automatiseren zonder technische kennis?',
      answer: 'Ja! Moderne voorraadbeheer software zoals StockFlow is speciaal ontworpen voor niet-technische gebruikers. De interface is intuïtief, setup is eenvoudig, en je hebt geen programmeerkennis nodig. De meeste bedrijven zijn binnen 1-2 dagen operationeel zonder IT-ondersteuning.'
    },
    {
      question: 'Wat is het verschil tussen handmatig en geautomatiseerd voorraadbeheer?',
      answer: 'Handmatig voorraadbeheer betekent: Excel bijhouden, handmatig tellen, vergeten bestellingen, en foutgevoelige processen. Geautomatiseerd voorraadbeheer betekent: real-time tracking, automatische updates, slimme bestelmeldingen, en 90% minder fouten. Automatisering bespaart tijd, geld en voorkomt problemen.'
    },
    {
      question: 'Hoe automatiseer ik bestellingen in voorraadbeheer?',
      answer: 'Automatiseer bestellingen door: bestelpunten in te stellen (minimum voorraadniveaus), automatische meldingen te activeren, leveranciers te koppelen, en waar mogelijk automatische bestelsuggesties te gebruiken. StockFlow berekent optimale bestelpunten op basis van historische data en stuurt automatische meldingen wanneer je moet bestellen.'
    },
    {
      question: 'Kan ik voorraadbeheer automatiseren met Excel?',
      answer: 'Excel heeft beperkte automatisering mogelijkheden. Je kunt formules gebruiken, maar echte automatisering (real-time updates, automatische meldingen, multi-user toegang) vereist gespecialiseerde software. StockFlow biedt echte automatisering die Excel niet kan bieden, en importeert je bestaande Excel-data eenvoudig.'
    },
    {
      question: 'Wat zijn de risico\'s van niet-automatiseren?',
      answer: 'Zonder automatisering loop je risico op: stockouts door vergeten bestellingen, overstock door slechte planning, handmatige invoerfouten, tijdverspilling op administratie, en verouderde informatie. Deze problemen kosten bedrijven gemiddeld 10-20% van hun voorraadwaarde per jaar. Automatisering voorkomt deze risico\'s.'
    }
  ];

export default function VoorraadbeheerAutomatiseren5Stappen() {
  usePageRefresh();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Voorraadbeheer Automatiseren in 5 Stappen 2025",
      "description": "Leer hoe je voorraadbeheer automatiseert in 5 eenvoudige stappen. Complete gids met praktische tips. Bespaar 70% tijd, 25% kosten.",
      "image": "https://www.stockflowsystems.com/Inventory-Management.png",
      "author": {
        "@type": "Organization",
        "name": "StockFlow"
      },
      "publisher": {
        "@type": "Organization",
        "name": "StockFlow",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.stockflowsystems.com/logo.png"
        }
      },
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.stockflowsystems.com/voorraadbeheer-automatiseren-5-stappen"
      },
      "inLanguage": "nl"
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Voorraadbeheer Automatiseren in 5 Stappen",
      "description": "Stap-voor-stap gids om voorraadbeheer te automatiseren",
      "step": stappen.map((stap, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": stap.titel,
        "text": stap.beschrijving
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.stockflowsystems.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Voorraadbeheer Automatiseren",
          "item": "https://www.stockflowsystems.com/voorraadbeheer-automatiseren-5-stappen"
        }
      ]
    }
  ];

  return (
    <SeoPageLayout 
      title="Voorraadbeheer Automatiseren in 5 Stappen"
      heroTitle="Voorraadbeheer Automatiseren in 5 Stappen"
      updatedDate="3/12/2025"
      faqData={faqData}
    >
      <SEO
        title="Voorraadbeheer Automatiseren in 5 Stappen 2025 | StockFlow"
        description="Leer hoe je voorraadbeheer automatiseert in 5 eenvoudige stappen. Complete gids met praktische tips. Bespaar 70% tijd, 25% kosten. Start gratis vandaag - geen creditcard vereist."
        keywords="voorraadbeheer automatiseren, voorraad automatiseren stappen, voorraad software workflow, stockflow automatisering"
        url="https://www.stockflowsystems.com/voorraadbeheer-automatiseren-5-stappen"
        locale="nl"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>              <p className="text-xl text-gray-600 mb-8">
                Minder manuele taken, minder fouten en altijd inzicht in je voorraad. Ontdek hoe je met StockFlow snel en gecontroleerd automatiseert.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Start gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Bekijk pakketten
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">500+ automatiserende KMO&apos;s</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="Voorraadbeheer automatiseren"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-6">
          {stappen.map((stap, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold">{stap.nummer}</p>
              <h2 className="text-2xl font-semibold mt-2 mb-3">{stap.titel}</h2>
              <p className="text-gray-600">{stap.beschrijving}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Workflow,
              titel: 'Slimme workflows',
              tekst: 'Bepaal wie stappen moet goedkeuren en automatiseer herhalende taken.'
            },
            {
              icon: Package,
              titel: 'Volledige traceerbaarheid',
              tekst: 'Van inkomende levering tot uitgaande order: alles is gedocumenteerd.'
            },
            {
              icon: BarChart3,
              titel: 'Realtime rapporten',
              tekst: 'Zie voorraadwaarde, rotatie en forecast zonder Excel formules.'
            },
            {
              icon: Zap,
              titel: 'Automatische alerts',
              tekst: 'Ontvang notificaties bij lage voorraad, vervaldatums of vertragingen.'
            },
            {
              icon: ClipboardCheck,
              titel: 'Gestandaardiseerde tellingen',
              tekst: 'Plan cycle counts en regenereer tellingen automatisch per locatie.'
            },
            {
              icon: Smartphone,
              titel: 'Mobiele apps',
              tekst: 'Scan barcodes, registreer inkomende goederen en verwerk tellingen onderweg.'
            }
          ].map((item, index) => (
            <div key={index} className="bg-white/10 border border-white/20 rounded-xl p-6">
              <item.icon className="h-10 w-10 text-white mb-4" />
              <h3 className="text-xl font-semibold mb-2">{item.titel}</h3>
              <p className="text-sm opacity-90">{item.tekst}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Automatiseer je voorraadbeheer vandaag</h2>
          <p className="text-xl mb-8 opacity-90">
            Start met het gratis plan, nodig je team uit en activeer stap voor stap de automatiseringen die het verschil maken.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}


