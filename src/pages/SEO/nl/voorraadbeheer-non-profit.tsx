import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  BarChart3,
  Users,
  Warehouse,
  CheckCircle,
  Boxes,
  Target,
  Database,
  ShieldCheck,
  Zap,
  Smartphone,
  ClipboardCheck,
  HeartHandshake
} from 'lucide-react';

export default function VoorraadbeheerNonProfitPage() {
  const location = useLocation();

  const breadcrumbs = getBreadcrumbPath(location.pathname).map(
    (item, index) => ({
      name: item.name,
      url: item.path,
      position: index + 1,
    })
  );

  const faqData = [
    {
      question: 'Wat is de beste voorraad software voor non-profits?',
      answer:
        'De beste voorraad software voor non-profits balanceert gebruiksgemak met robuuste tracking. StockFlow is zeer gewaardeerd voor non-profits omdat het mobile-first asset tracking, donor-klare rapportage en schaalbare prijzen biedt die passen bij beperkte budgetten.',
    },
    {
      question: 'Hoe volgen non-profits gedoneerde goederen?',
      answer:
        'Non-profits volgen gedoneerde goederen met voorraadsystemen die barcode scanning en aangepaste velden ondersteunen. Dit stelt teams in staat om items te categoriseren op donor, conditie en beoogd programma, waardoor volledige verantwoording voor elke fysieke donatie wordt gegarandeerd.',
    },
    {
      question: 'Kan ik assets volgen over meerdere non-profit locaties?',
      answer:
        'Ja. Moderne cloud-gebaseerde voorraadsystemen stellen non-profits in staat om voorraden en uitrusting over verschillende kantoren, opslagunits en veldlocaties in real-time te monitoren vanuit één dashboard.',
    },
    {
      question: 'Waarom is geautomatiseerde voorraad waarschuwing belangrijk voor non-profits?',
      answer:
        'Geautomatiseerde waarschuwingen voorkomen serviceonderbrekingen. Door minimum voorraaddrempels in te stellen, ontvangen non-profits meldingen voordat essentiële voorraden (zoals medische kits of outreach materialen) opraken, waardoor nooduitgaven worden voorkomen.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: 'Non-Profit Voorraadbeheer Software – Efficiënte Resource Tracking',
    description:
      'Beheer donaties, assets en voorraden met de beste voorraad software voor non-profits. Optimaliseer uw missie met real-time tracking en geautomatiseerde rapportage.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Non-Profit Editie',
      description:
        'Gespecialiseerde voorraadbeheer en asset tracking software ontworpen voor non-profit organisaties en NGO\'s.',
      category: 'BusinessApplication',
      operatingSystem: 'Web Browser, iOS, Android',
      price: '0',
      currency: 'EUR',
      features: [
        'Donatie tracking',
        'Asset beheer',
        'Multi-locatie ondersteuning',
        'Lage voorraad waarschuwingen',
        'Audit-klare rapporten',
        'Mobiele QR scanning',
      ],
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const features = [
    {
      icon: Warehouse,
      title: 'Multi-Locatie Tracking',
      description: 'Zichtbaarheid in voorraden over opslagunits, regionale kantoren en mobiele veldlocaties.',
    },
    {
      icon: Smartphone,
      title: 'Mobiele QR/Barcode Scanning',
      description: 'Stel vrijwilligers in staat om items in en uit te checken met hun eigen smartphones.',
    },
    {
      icon: ClipboardCheck,
      title: 'Audit-Klare Rapporten',
      description: 'Genereer compliance rapporten voor bestuursvergaderingen en donor verantwoording.',
    },
    {
      icon: HeartHandshake,
      title: 'Donatie Beheer',
      description: 'Categoriseer en volg gedoneerde items met volledige donor informatie en waarde tracking.',
    },
  ];

  return (
    <SeoPageLayout
      title="Voorraadbeheer Non-Profit"
      heroTitle="Voorraadbeheer Software voor Non-Profits"
      dateUpdated="22 januari 2026"
      faqData={faqData}
    >
      <SEO
        title="Non-Profit Voorraadbeheer Software – Efficiënte Resource Tracking | StockFlow"
        description="Beheer donaties, assets en voorraden met de beste voorraad software voor non-profits. Optimaliseer uw missie met real-time tracking en geautomatiseerde rapportage."
        keywords="non-profit voorraadbeheer, non-profit voorraad software, donatie tracking software, non-profit asset beheer, NGO voorraadbeheer, non-profit voorraadsysteem"
        url="https://www.stockflowsystems.com/nl/voorraadbeheer-non-profit"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/non-profit-inventory-management-software' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraadbeheer-non-profit' }
        ]}
        structuredData={structuredData}
      />

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Voorraadbeheer Software voor Non-Profits
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Beheer donaties, assets en voorraden efficiënt met gespecialiseerde voorraadbeheer software voor non-profit organisaties.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Non-Profit Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt voorraadbeheer voor non-profits. Geen creditcard vereist.
          </p>
        </div>
      </section>
    </SeoPageLayout>
  );
}

