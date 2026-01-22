import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Truck, Package, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerDistributiePage() {
  const faqData = [
    {
      question: "Wat is distributie voorraadbeheer?",
      answer: "Distributie voorraadbeheer is gespecialiseerd voorraadbeheer voor distributiebedrijven die producten distribueren naar retailers, groothandels of eindklanten. Het omvat voorraadbeheer over meerdere distributiecentra, ordervervulling optimalisatie en transportbeheer."
    },
    {
      question: "Waarom hebben distributiebedrijven voorraadbeheer software nodig?",
      answer: "Distributiebedrijven hebben voorraadbeheer software nodig om voorraad over meerdere distributiecentra te volgen, ordervervulling te optimaliseren, transportroutes te beheren, voorraadniveaus te optimaliseren en distributie-efficiëntie te verbeteren."
    }
  ];

  return (
    <SeoPageLayout 
      title="Distributie Voorraadbeheer"
      heroTitle="Distributie Voorraadbeheer Software"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Distributie Voorraadbeheer Software - Optimaliseer Distributie | StockFlow"
        description="Distributie voorraadbeheer software voor distributiebedrijven. Beheer voorraad over meerdere distributiecentra, optimaliseer ordervervulling en verbeter distributie-efficiëntie. Volledig gratis."
        keywords="distributie voorraadbeheer, distributie voorraad software, distributiecentrum voorraadbeheer, distributie voorraadbeheer software, distributie stockbeheer, distributie voorraadtracking"
        url="https://www.stockflowsystems.com/nl/voorraadbeheer-distributie"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/wholesaler-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraadbeheer-distributie' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Distributie Voorraadbeheer Software
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Distributie voorraadbeheer software voor distributiebedrijven. Beheer voorraad over meerdere 
            distributiecentra, optimaliseer ordervervulling en verbeter distributie-efficiëntie. Volledig gratis.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Distributie Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt distributie voorraadbeheer. Geen creditcard vereist.
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

