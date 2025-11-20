import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
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
      'Geen probleem. Je activeert functies wanneer je er klaar voor bent. Start bijvoorbeeld met automatische alerts en voeg later geavanceerde workflows toe.'
  }
];

export default function VoorraadbeheerAutomatiseren5Stappen() {
  usePageRefresh();

  return (
    <SeoPageLayout 
      title="Voorraadbeheer Automatiseren in 5 Stappen"
      heroTitle="Voorraadbeheer Automatiseren in 5 Stappen"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Voorraadbeheer Automatiseren 5 Stappen 2025"
        description="Bekijk hoe voorraadbeheer automatiseren 5 stappen uw voorraadbeheer te optimaliseren. Ontdek hoe voorraadbeheer automatiseren 5 stappen uw voorraadbeheer te ..."
        keywords="voorraadbeheer automatiseren, voorraad automatiseren stappen, voorraad software workflow, stockflow automatisering"
        url="https://www.stockflow.be/voorraadbeheer-automatiseren-5-stappen"
        locale="nl"
      />

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


