import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Users, Package, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerLeveranciersPage() {
  const faqData = [
    {
      question: "Wat is leveranciers voorraadbeheer?",
      answer: "Leveranciers voorraadbeheer is het proces van het beheren van leveranciersrelaties en inkooporders in combinatie met voorraadbeheer. Het helpt bedrijven leveranciers te beheren, inkooporders te volgen, leveranciersprestaties te monitoren en voorraadniveaus te optimaliseren op basis van leveranciersgegevens."
    },
    {
      question: "Waarom hebben bedrijven leveranciers voorraadbeheer software nodig?",
      answer: "Bedrijven hebben leveranciers voorraadbeheer software nodig om leveranciersrelaties te beheren, inkooporders te automatiseren, leveranciersprestaties te monitoren, voorraadniveaus te optimaliseren op basis van leveranciersgegevens en inkoopprocessen te stroomlijnen."
    }
  ];

  return (
    <SeoPageLayout 
      title="Leveranciers Voorraadbeheer"
      heroTitle="Leveranciers Voorraadbeheer Software"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Leveranciers Voorraadbeheer Software - Beheer Leveranciers & Inkoop | StockFlow"
        description="Leveranciers voorraadbeheer software voor het beheren van leveranciersrelaties en inkooporders. Automatiseer inkoopprocessen, monitor leveranciersprestaties en optimaliseer voorraadniveaus. Volledig gratis."
        keywords="leveranciers voorraadbeheer, leveranciers beheer software, inkoop voorraadbeheer, leveranciers voorraad software, leveranciersbeheer voorraad, inkooporder beheer, leveranciers voorraadbeheer software"
        url="https://www.stockflowsystems.com/nl/voorraadbeheer-leveranciers"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/suppliers' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraadbeheer-leveranciers' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Leveranciers Voorraadbeheer Software
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Leveranciers voorraadbeheer software voor het beheren van leveranciersrelaties en inkooporders. 
            Automatiseer inkoopprocessen, monitor leveranciersprestaties en optimaliseer voorraadniveaus. Volledig gratis.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Leveranciers Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt leveranciers voorraadbeheer. Geen creditcard vereist.
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


