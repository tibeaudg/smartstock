import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import {
  Globe,
  ShoppingBag,
  Zap,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

export default function VoorraadbeheerEcommercePage() {
  const faqData = [
    {
      question: "Wat is e-commerce voorraadbeheer software?",
      answer: "E-commerce voorraadbeheer software is een platform dat bedrijven helpt online winkeloperaties te beheren, inclusief voorraadbeheer, orderverwerking, klantenbeheer en verkoopanalytics. Het integreert met e-commerce platforms zoals Shopify, WooCommerce en Amazon om gecentraliseerd beheer van online bedrijfsoperaties te bieden."
    },
    {
      question: "Wat is multi-platform voorraadbeheer?",
      answer: "Multi-platform voorraadbeheer is de mogelijkheid om voorraad te beheren over meerdere verkoopkanalen en e-commerce platforms (zoals Shopify, Amazon, eBay, WooCommerce) vanuit één systeem. Dit zorgt ervoor dat voorraadniveaus gesynchroniseerd zijn over alle platforms, voorkomt oververkoop en behoudt nauwkeurige voorraadtellingen."
    },
    {
      question: "Waarom heb ik e-commerce voorraadbeheer software nodig?",
      answer: "E-commerce voorraadbeheer software helpt online winkels: oververkoop over kanalen voorkomen, voorraad in real-time synchroniseren, bestellingen efficiënt beheren, verkopen over platforms volgen, herbestellen automatiseren en operaties schalen. Zonder dit wordt voorraad beheren over meerdere platforms foutgevoelig en tijdrovend."
    },
    {
      question: "Hoe werkt multi-platform voorraadbeheer?",
      answer: "Multi-platform voorraadbeheer werkt door verbinding te maken met meerdere e-commerce platforms via API's, voorraadniveaus in real-time te synchroniseren, voorraad bij te werken over alle kanalen wanneer producten worden verkocht, en een gecentraliseerd dashboard te bieden om voorraad te beheren over alle platforms."
    },
    {
      question: "Kan voorraadbeheer software integreren met meerdere e-commerce platforms?",
      answer: "Ja, StockFlow integreert met meerdere e-commerce platforms inclusief Shopify, WooCommerce, Amazon, BigCommerce, Wix en meer. Dit stelt u in staat om voorraad te beheren over al uw verkoopkanalen vanuit één systeem, waardoor nauwkeurige voorraadniveaus worden gegarandeerd en oververkoop wordt voorkomen."
    }
  ];

  const features = [
    {
      icon: Globe,
      title: "Multi-Platform Synchronisatie",
      description: "Synchroniseer voorraad over Shopify, Amazon, WooCommerce en andere e-commerce platforms in real-time."
    },
    {
      icon: ShoppingBag,
      title: "E-commerce Integratie",
      description: "Integreer met grote e-commerce platforms en marktplaatsen voor naadloos voorraadbeheer."
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Automatische voorraadupdates over alle platforms wanneer producten worden verkocht of opnieuw worden aangevuld."
    },
    {
      icon: TrendingUp,
      title: "Geünificeerd Dashboard",
      description: "Beheer alle e-commerce voorraad vanuit één gecentraliseerd dashboard, ongeacht platform."
    }
  ];

  return (
    <SeoPageLayout 
      title="E-commerce Voorraadbeheer"
      heroTitle="E-commerce Voorraadbeheer: Multi-Platform Oplossing"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="E-commerce Voorraadbeheer 2026 - Voorkom Oververkoop, Bespaar 20+ Uren/Week | StockFlow"
        description="Complete e-commerce voorraadbeheer 2026. Multi-channel synchronisatie, real-time updates, voorkom oververkoop. Integreer Shopify, Amazon, WooCommerce. Bespaar 20+ uur/week, 99%+ nauwkeurigheid. Gratis plan beschikbaar."
        keywords="e-commerce voorraadbeheer, e-commerce voorraad software, multi-platform voorraadbeheer, cross-platform voorraadbeheer, e-commerce voorraadbeheer software, online winkel voorraadbeheer, e-commerce stockbeheer, multi-channel voorraadbeheer"
        url="https://www.stockflowsystems.com/nl/industries/voorraadbeheer-ecommerce"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/ecommerce-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/industries/voorraadbeheer-ecommerce' }
        ]}
      />

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              E-commerce Voorraadbeheer Functies
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Beheer voorraad over meerdere e-commerce platforms vanuit één systeem
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
            Start Vandaag Met Gratis E-commerce Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt e-commerce voorraadbeheer. Geen creditcard vereist.
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

