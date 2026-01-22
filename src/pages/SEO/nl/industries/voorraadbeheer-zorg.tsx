import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config/topicClusters';
import {
  Stethoscope,
  Shield,
  Calendar,
  CheckCircle,
  Package,
  AlertTriangle,
  Smartphone,
  BarChart3,
  FileText,
  Thermometer
} from 'lucide-react';

export default function VoorraadbeheerZorgPage() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbPath(location.pathname).map((item, index) => ({
    name: item.name,
    url: item.path,
    position: index + 1
  }));

  const faqData = [
    {
      question: "Wat is zorg voorraadbeheer?",
      answer: "Zorg voorraadbeheer is het proces van het volgen van medische voorraden, apparaten en uitrusting met functies zoals vervaldatum tracking, lot/serienummer tracing en regelgevingsnaleving. Het helpt zorginstellingen nauwkeurige voorraadrecords te behouden, verspilling van verlopen voorraad te voorkomen, regelgevingsnaleving te garanderen en medische apparaten te volgen voor FDA traceerbaarheid."
    },
    {
      question: "Waarom is vervaldatum tracking belangrijk voor zorg voorraad?",
      answer: "Vervaldatum tracking is cruciaal voor zorg voorraad om patiëntveiligheid en regelgevingsnaleving te garanderen. Zorg voorraadbeheer software volgt vervaldatums, stuurt waarschuwingen voordat items verlopen en helpt faciliteiten items te gebruiken voordat ze verlopen, waardoor verspilling wordt verminderd en naleving van zorgregelgeving wordt gegarandeerd."
    },
    {
      question: "Hoe helpt zorg voorraad software met FDA naleving?",
      answer: "Zorg voorraad software biedt volledige traceerbaarheid via lot- en serienummer tracking, wat vereist is voor FDA naleving. Het behoudt gedetailleerde records van apparaatgeschiedenis, volgt recalls en genereert nalevingsrapporten. Dit zorgt ervoor dat zorginstellingen elk medisch apparaat kunnen traceren naar zijn bron."
    },
    {
      question: "Kan zorg voorraad software lot- en serienummers volgen?",
      answer: "Ja, moderne zorg voorraadbeheer systemen volgen zowel lotnummers als serienummers voor complete traceerbaarheid. Dit is essentieel voor FDA naleving, recallbeheer en kwaliteitscontrole. StockFlow volgt lot/serienummers gedurende de hele voorraadlevenscyclus."
    },
    {
      question: "Hoe vermindert zorg voorraadbeheer verspilling van verlopen voorraad?",
      answer: "Door vervaldatums te volgen en geautomatiseerde waarschuwingen te sturen, helpt zorg voorraad software faciliteiten items te gebruiken voordat ze verlopen. First-in-first-out (FIFO) workflows zorgen ervoor dat oudere items eerst worden gebruikt, waardoor verspilling van verlopen voorraad wordt verminderd."
    }
  ];

  const structuredData = generateSeoPageStructuredData({
    title: "Zorg Voorraadbeheer Software voor Gezondheidszorg",
    description: "Zorg voorraadbeheer software voor zorginstellingen. Volg medische voorraden met vervaldatums, lot/serienummers en FDA naleving.",
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: "StockFlow - Zorg Voorraadbeheer",
      description: "Zorg voorraadbeheer software voor zorginstellingen. Volg medische voorraden met vervaldatums, lot/serienummers en FDA naleving.",
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      features: [
        "Vervaldatum tracking",
        "Lot/serienummer tracing",
        "FDA nalevingsrapportage",
        "Recallbeheer",
        "Temperatuur monitoring",
        "Regelgevingsnaleving"
      ],
      url: location.pathname
    },
    pageType: 'software',
    includeWebSite: false
  });

  const features = [
    {
      icon: Calendar,
      title: "Vervaldatum Tracking",
      description: "Volg vervaldatums van medische voorraden en ontvang waarschuwingen voordat items verlopen."
    },
    {
      icon: FileText,
      title: "Lot/Serienummer Tracing",
      description: "Volledige traceerbaarheid met lot- en serienummer tracking voor FDA naleving."
    },
    {
      icon: Shield,
      title: "FDA Naleving",
      description: "Genereer nalevingsrapporten en volg medische apparaten voor regelgevingsnaleving."
    },
    {
      icon: Thermometer,
      title: "Temperatuur Monitoring",
      description: "Monitor temperatuur voor koude opslag van temperatuurgevoelige medische voorraden."
    }
  ];

  return (
    <SeoPageLayout 
      title="Zorg Voorraadbeheer"
      heroTitle="Zorg Voorraadbeheer Software voor Gezondheidszorg"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Zorg Voorraadbeheer Software voor Gezondheidszorg | StockFlow"
        description="Zorg voorraadbeheer software voor zorginstellingen. Volg medische voorraden met vervaldatums, lot/serienummers en FDA naleving."
        keywords="zorg voorraadbeheer, medisch voorraadbeheer, ziekenhuis voorraadbeheer, zorg voorraad software, medische voorraadbeheer software, ziekenhuis voorraadbeheer software, zorg voorraadbeheer systeem, medische voorraad tracking"
        url="https://www.stockflowsystems.com/nl/industries/voorraadbeheer-zorg"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/medical-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/industries/voorraadbeheer-zorg' }
        ]}
        structuredData={structuredData}
      />

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Zorg Voorraadbeheer Functies
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Gespecialiseerde functies voor zorginstellingen en medische praktijken
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
            Start Vandaag Met Gratis Zorg Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt zorg voorraadbeheer. Geen creditcard vereist.
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


