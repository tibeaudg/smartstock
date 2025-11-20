import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  FileSpreadsheet,
  Laptop,
  Workflow,
  AlertTriangle,
  BarChart3,
  Users,
  ArrowRight,
  Star
} from 'lucide-react';

export default function ExcelVsVoorraadbeheerSoftware() {
  usePageRefresh();

  const voordelen = [
    {
      icon: Workflow,
      title: 'Realtime processen',
      description:
        'Met voorraadbeheer software worden bestellingen, leveringen en voorraadmutaties automatisch verwerkt. Excel blijft afhankelijk van handmatig invoeren.'
    },
    {
      icon: AlertTriangle,
      title: 'Minder fouten',
      description:
        'Voorkom foutieve formules of verouderde versies. StockFlow geeft waarschuwingen, audit trails en machtigingen per gebruiker.'
    },
    {
      icon: BarChart3,
      title: 'Inzicht en rapportage',
      description:
        'Dashboards tonen marges, rotatie en forecast. Excel vraagt om zelf rapportages te bouwen en te onderhouden.'
    },
    {
      icon: Users,
      title: 'Samenwerken',
      description:
        'Werk gelijktijdig met magazijn, aankoop en finance in één platform. In Excel kunnen tabellen snel conflicteren of overschreven worden.'
    }
  ];

  const faqData = [
    {
      question: 'Wanneer is Excel voldoende?',
      answer:
        'Voor een eenvoudige stocklijst met een beperkt assortiment kan Excel tijdelijk volstaan. Zodra je meerdere locaties, medewerkers of bestelprocessen hebt, wordt software efficiënter en veiliger.'
    },
    {
      question: 'Wat kost voorraadbeheer software?',
      answer:
        'StockFlow heeft een gratis plan tot 30 producten en groeiplannen vanaf €29 per maand. Je betaalt geen extra licenties per gebruiker.'
    },
    {
      question: 'Kan ik mijn Excel-data importeren?',
      answer:
        'Ja. Upload je huidige Excel-bestanden en StockFlow zet producten, leveranciers en voorraadstanden automatisch over.'
    },
    {
      question: 'Hoe snel kan ik starten?',
      answer:
        'De meeste bedrijven zijn binnen één dag live. Dankzij mobiele apps en barcode scanning voer je tellingen en ontvangsten digitaal uit.'
    }
  ];

  return (
    <SeoPageLayout 
      title="Excel vs Voorraadbeheer Software"
      heroTitle="Excel vs Voorraadbeheer Software"
      updatedDate="20/11/2025"
      faqData={faqData}
    >
      <SEO
        title="Excel Vs Voorraadbeheer Software 2025 - Excel Vs Voorraad..."
        description="Bekijk hoe excel vs voorraadbeheer software uw voorraadbeheer te optimaliseren. Ontdek hoe excel vs voorraadbeheer software uw voorraadbeheer te optimalisere..."
        keywords="excel voorraadbeheer, excel vs software, voorraadbeheer software vergelijken, stockflow excel import"
        url="https://www.stockflow.be/excel-vs-voorraadbeheer-software"
        locale="nl"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Excel vs Voorraadbeheer Software{' '}
                <span className="text-blue-600">Wat past bij jouw KMO?</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Veel bedrijven starten met Excel. Maar zodra het assortiment groeit, meerdere collega&apos;s samenwerken of je live voorraad nodig hebt, blijft software betrouwbaarder. Bekijk de verschillen.
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
                  Bekijk prijzen
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
                <span className="text-sm text-gray-600">500+ Belgische en Nederlandse KMO&apos;s</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="Excel versus voorraadbeheer software"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <FileSpreadsheet className="h-10 w-10 text-blue-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Wanneer Excel werkt</h2>
              <p className="text-gray-600">
                • Klein assortiment en beperkt aantal orders<br />
                • Geen nood aan realtime voorraad per locatie<br />
                • Eén persoon beheert het bestand<br />
                • Geen barcode scanning of mobiele tellingen nodig
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <Laptop className="h-10 w-10 text-blue-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Wanneer software beter is</h2>
              <p className="text-gray-600">
                • Meerdere magazijnen of verkooppunten<br />
                • Integraties met webshop of boekhouding<br />
                • Teamwerk met duidelijke rechten<br />
                • Automatische besteladviezen en alerts
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Waarom KMO&apos;s kiezen voor StockFlow
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {voordelen.map((item, index) => (
              <div key={index} className="bg-white/10 border border-white/20 rounded-xl p-6">
                <item.icon className="h-10 w-10 text-white mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm opacity-90">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Veelgestelde vragen</h2>
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-3">{item.vraag}</h3>
                <p className="text-gray-600">{item.antwoord}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stap vandaag over naar StockFlow</h2>
          <p className="text-xl mb-8 opacity-90">
            Importeer je Excel-bestand, nodig je team uit en ervaar realtime voorraadbeheer zonder spreadsheets.
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


