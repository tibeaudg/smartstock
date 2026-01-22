import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Truck, Package, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerLogistiekPage() {
  const faqData = [
    {
      question: "Wat is logistiek voorraadbeheer?",
      answer: "Logistiek voorraadbeheer is gespecialiseerd voorraadbeheer voor logistieke en distributiebedrijven. Het helpt logistieke bedrijven voorraad te beheren over meerdere magazijnen, distributiecentra en transportroutes, ordervervulling te optimaliseren en supply chain efficiëntie te verbeteren."
    },
    {
      question: "Waarom hebben logistieke bedrijven voorraadbeheer software nodig?",
      answer: "Logistieke bedrijven hebben voorraadbeheer software nodig om voorraad over meerdere locaties te volgen, ordervervulling te optimaliseren, transportroutes te beheren, voorraadniveaus te optimaliseren en supply chain zichtbaarheid te verbeteren."
    }
  ];

  return (
    <SeoPageLayout 
      title="Logistiek Voorraadbeheer"
      heroTitle="Logistiek Voorraadbeheer Software voor Distributie"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Logistiek Voorraadbeheer Software voor Distributie | StockFlow"
        description="Gespecialiseerde logistiek voorraadbeheer software. Beheer voorraad over meerdere magazijnen en distributiecentra. Optimaliseer ordervervulling en verbeter supply chain efficiëntie."
        keywords="logistiek voorraadbeheer, logistiek voorraad software, distributie voorraadbeheer, logistiek voorraadbeheer software, supply chain voorraadbeheer, distributiecentrum voorraadbeheer"
        url="https://www.stockflowsystems.com/nl/industries/voorraadbeheer-logistiek"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/logistics-inventory-management-software' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/industries/voorraadbeheer-logistiek' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Logistiek Voorraadbeheer Software voor Distributie
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Gespecialiseerde logistiek voorraadbeheer software. Beheer voorraad over meerdere magazijnen en 
            distributiecentra. Optimaliseer ordervervulling en verbeter supply chain efficiëntie.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Logistiek Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt logistiek voorraadbeheer. Geen creditcard vereist.
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


