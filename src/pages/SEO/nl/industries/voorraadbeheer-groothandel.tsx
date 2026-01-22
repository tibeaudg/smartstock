import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import { Package, TrendingUp, Truck, BarChart3, Users, Zap, CheckCircle, Star } from 'lucide-react';

export default function VoorraadbeheerGroothandelPage() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  const faqData = [
    {
      question: "Wat is groothandel voorraadbeheer?",
      answer: "Groothandel voorraadbeheer is een gespecialiseerd systeem voor het beheren van grote volumes producten, het volgen van voorraad over meerdere magazijnen, het afhandelen van bulkbestellingen, het beheren van leveranciersrelaties en het optimaliseren van voorraadomzet. Het is ontworpen voor bedrijven die producten in grote hoeveelheden kopen en verkopen aan retailers en andere bedrijven."
    },
    {
      question: "Waarom hebben groothandels en distributeurs voorraadbeheer software nodig?",
      answer: "Groothandels en distributeurs hebben voorraadbeheer software nodig om hoogvolume transacties af te handelen, meerdere magazijnen te beheren, voorraad over locaties te volgen, voorraadniveaus te optimaliseren, voorraadtekorten te voorkomen, voorraadkosten te verlagen, leveranciersrelaties te beheren en ordervervullingsprocessen te stroomlijnen."
    },
    {
      question: "Welke functies moet groothandel voorraadbeheer software hebben?",
      answer: "De beste groothandel voorraadbeheer software moet multi-magazijn ondersteuning, bulk orderverwerking, geavanceerde rapportage en analytics, leveranciersbeheer, inkooporderbeheer, geautomatiseerde herbestelpunt, voorraadomzet tracking, batchverwerking en integratie met boekhoud- en verzendsystemen omvatten."
    },
    {
      question: "Hoe verschilt groothandel voorraadbeheer van retail voorraadbeheer?",
      answer: "Groothandel voorraadbeheer handelt veel grotere volumes af, richt zich op bulk transacties, beheert meerdere magazijnen, volgt leveranciersrelaties, verwerkt grote inkooporders en optimaliseert voorraadomzetsnelheden. Retail voorraadbeheer richt zich doorgaans op individuele winkel locaties en kleinere hoeveelheden."
    },
    {
      question: "Kan groothandel voorraad software voorraad volgen over meerdere magazijnen?",
      answer: "Ja, StockFlow ondersteunt multi-magazijn voorraadbeheer, waardoor groothandels en distributeurs voorraad kunnen volgen over onbeperkte magazijnlocaties. U kunt voorraadniveaus op elke locatie zien, voorraad tussen magazijnen overbrengen en real-time zichtbaarheid krijgen in al uw voorraad."
    }
  ];

  const structuredData = generateSeoPageStructuredData({
    title: "Groothandel Voorraadbeheer Software voor Distributie",
    description: "Complete groothandel voorraadbeheer oplossing voor distributeurs. Beheer grote volumes, meerdere magazijnen en optimaliseer voorraadomzet met real-time tracking.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Groothandel Voorraadbeheer",
      description: "Complete groothandel voorraadbeheer oplossing voor distributeurs. Beheer grote volumes, meerdere magazijnen en optimaliseer voorraadomzet.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      features: [
        "Multi-magazijn beheer",
        "Bulk orderverwerking",
        "Voorraadomzet tracking",
        "Geavanceerde analytics",
        "Leveranciersbeheer",
        "Geautomatiseerd herbestellen"
      ],
      url: location.pathname
    },
    pageType: 'software',
    includeWebSite: false
  });

  const features = [
    {
      icon: Package,
      title: "Multi-Magazijn Beheer",
      description: "Volg voorraad over meerdere magazijnen en distributiecentra met real-time zichtbaarheid in voorraadniveaus op elke locatie."
    },
    {
      icon: TrendingUp,
      title: "Voorraadomzet Tracking",
      description: "Monitor voorraadomzetsnelheden, identificeer langzaam bewegende voorraad en optimaliseer inkoopbeslissingen op basis van verkoopsnelheid."
    },
    {
      icon: Truck,
      title: "Bulk Orderverwerking",
      description: "Handel grote volume bestellingen efficiënt af met batchverwerking, geautomatiseerde vervulling en gestroomlijnd orderbeheer."
    },
    {
      icon: BarChart3,
      title: "Geavanceerde Analytics",
      description: "Krijg gedetailleerde inzichten in verkooptrends, vraagvoorspelling, leveranciersprestaties en voorraadoptimalisatie mogelijkheden."
    }
  ];

  return (
    <SeoPageLayout 
      title="Groothandel Voorraadbeheer"
      heroTitle="Groothandel Voorraadbeheer Software voor Distributie"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Groothandel Voorraadbeheer Software voor Distributie | StockFlow"
        description="Complete groothandel voorraadbeheer oplossing voor distributeurs. Beheer grote volumes, meerdere magazijnen en optimaliseer voorraadomzet met real-time tracking."
        keywords="groothandel voorraadbeheer, groothandel voorraad software, distributeur voorraadbeheer, groothandel voorraadbeheer software, bulk voorraadbeheer, groothandel stockbeheer, multi-magazijn voorraadbeheer, groothandel voorraadtracking"
        url="https://www.stockflowsystems.com/nl/industries/voorraadbeheer-groothandel"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/wholesaler-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/industries/voorraadbeheer-groothandel' }
        ]}
        structuredData={structuredData}
      />

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Groothandel Voorraadbeheer Functies
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Alles wat u nodig heeft om grote volumes efficiënt te beheren
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
            Start Vandaag Met Gratis Groothandel Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt groothandel voorraadbeheer. Geen creditcard vereist.
          </p>
          <Link 
            to="/auth" 
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Gratis Met StockFlow →
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}

