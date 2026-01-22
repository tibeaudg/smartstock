import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  BarChart3,
  CheckCircle,
  Star,
  ShoppingCart,
  Store,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  Smartphone
} from 'lucide-react';

export default function VoorraadbeheerRetailPage() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  const faqData = [
    {
      question: "Waarom hebben kleine retailwinkels voorraadbeheer software nodig?",
      answer: "Kleine retailwinkels staan voor unieke uitdagingen zoals beperkte opslagruimte, seizoensgebonden vraagfluctuaties en krappe winstmarges. Voorraadbeheer software helpt voorraadtekorten tijdens piekseizoenen te voorkomen, vermindert overvoorraad kosten en biedt real-time inzichten om betere inkoopbeslissingen te maken."
    },
    {
      question: "Hoe kan retail voorraadbeheer helpen met seizoensgebonden vraag?",
      answer: "Retail voorraadbeheer software volgt historische verkoopgegevens om seizoensgebonden vraagpatronen te voorspellen. Het helpt u voorbereiden op drukke periodes door voorraadniveaus te optimaliseren, trending producten te identificeren en ervoor te zorgen dat u voldoende voorraad heeft zonder overvoorraad."
    },
    {
      question: "Welke functies zijn het belangrijkst voor kleine retailwinkels?",
      answer: "Belangrijke functies zijn barcode scanning voor snelle updates, real-time voorraadtracking, lage voorraad waarschuwingen, verkooprapportage, leveranciersbeheer en mobiele toegang. Deze functies helpen kleine winkels concurreren met grotere retailers terwijl efficiëntie wordt behouden."
    },
    {
      question: "Kan retail voorraadbeheer integreren met mijn kassasysteem?",
      answer: "Ja, moderne voorraadbeheer systemen zoals StockFlow kunnen integreren met de meeste kassasystemen om automatisch voorraadniveaus bij te werken wanneer verkopen plaatsvinden. Dit zorgt ervoor dat uw voorraad altijd nauwkeurig is en vermindert handmatige tellingen."
    },
    {
      question: "Hoeveel kunnen kleine retailwinkels besparen met voorraadbeheer?",
      answer: "Kleine retailwinkels besparen doorgaans 15-30% op voorraadkosten door overvoorraad te verminderen, voorraadtekorten te voorkomen en inkoop te optimaliseren. Dit vertaalt zich naar duizenden euro's besparing per jaar, waardoor de ROI zeer aantrekkelijk is voor kleine bedrijven."
    }
  ];

  const structuredData = generateSeoPageStructuredData({
    title: "Retail Voorraadbeheer Software voor Kleine Winkels",
    description: "Complete retail voorraadbeheer oplossing voor kleine winkels. Volg voorraad, voorkom voorraadtekorten en verhoog winsten met real-time voorraadcontrole.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Retail Voorraadbeheer",
      description: "Complete retail voorraadbeheer oplossing voor kleine winkels. Volg voorraad, voorkom voorraadtekorten en verhoog winsten met real-time voorraadcontrole.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      features: [
        "Real-time voorraadtracking",
        "Barcode scanning",
        "Lage voorraad waarschuwingen",
        "Verkoop analytics",
        "Leveranciersbeheer",
        "Mobiele toegang"
      ],
      url: location.pathname
    },
    pageType: 'software',
    includeWebSite: false
  });

  const features = [
    {
      icon: ShoppingCart,
      title: "Real-time Voorraadtracking",
      description: "Zie voorraadniveaus onmiddellijk bijwerken wanneer verkopen plaatsvinden. Weet precies wat er beschikbaar is, niet morgenochtend."
    },
    {
      icon: Smartphone,
      title: "Mobiele Barcode Scanning",
      description: "Gebruik de camera van uw telefoon om barcodes te scannen. Tel 100 items in 3 minuten in plaats van 30. Geen speciale hardware nodig."
    },
    {
      icon: AlertTriangle,
      title: "Lage Voorraad Waarschuwingen",
      description: "Ontvang automatische meldingen wanneer voorraad laag is. Voorkom voorraadtekorten en gemiste verkopen."
    },
    {
      icon: BarChart3,
      title: "Verkoop Analytics",
      description: "Krijg inzichten in bestsellers, langzaam bewegende items en seizoensgebonden trends om betere inkoopbeslissingen te maken."
    }
  ];

  return (
    <SeoPageLayout 
      title="Retail Voorraadbeheer"
      heroTitle="Retail Voorraadbeheer Software voor Kleine Winkels"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Retail Voorraadbeheer Software voor Kleine Winkels | StockFlow"
        description="Complete retail voorraadbeheer oplossing voor kleine winkels. Volg voorraad, voorkom voorraadtekorten en verhoog winsten met real-time voorraadcontrole."
        keywords="retail voorraadbeheer, retail voorraad software, kleine winkel voorraadbeheer, retail voorraadbeheer software, winkel voorraadbeheer, retail stockbeheer, retail voorraadtracking, kleine retail voorraadbeheer"
        url="https://www.stockflowsystems.com/nl/industries/voorraadbeheer-retail"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/retail-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/industries/voorraadbeheer-retail' }
        ]}
        structuredData={structuredData}
      />

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Retail Voorraadbeheer Functies
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Alles wat u nodig heeft om uw retailwinkel efficiënt te beheren
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
            Start Vandaag Met Gratis Retail Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt retail voorraadbeheer. Geen creditcard vereist.
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


