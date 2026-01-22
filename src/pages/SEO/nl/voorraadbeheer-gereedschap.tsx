import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Hammer, Package, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerGereedschapPage() {
  const faqData = [
    {
      question: "Wat is gereedschap voorraadbeheer?",
      answer: "Gereedschap voorraadbeheer is het proces van het volgen en beheren van gereedschappen en handgereedschap. Het helpt bedrijven te weten welke gereedschappen beschikbaar zijn, waar ze zich bevinden, wie ze gebruikt en wanneer onderhoud of vervanging nodig is."
    },
    {
      question: "Waarom hebben bedrijven gereedschap voorraadbeheer software nodig?",
      answer: "Bedrijven hebben gereedschap voorraadbeheer software nodig om gereedschapdiefstal te voorkomen, gereedschapsgebruik te optimaliseren, onderhoud te plannen, gereedschapskosten te beheren en ervoor te zorgen dat gereedschappen beschikbaar zijn wanneer ze nodig zijn."
    }
  ];

  return (
    <SeoPageLayout 
      title="Gereedschap Voorraadbeheer"
      heroTitle="Gereedschap Voorraadbeheer Software"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Gereedschap Voorraadbeheer Software - Volg Gereedschappen & Handgereedschap | StockFlow"
        description="Gereedschap voorraadbeheer software voor het volgen van gereedschappen en handgereedschap. Voorkom diefstal, optimaliseer gebruik en plan onderhoud. Volledig gratis."
        keywords="gereedschap voorraadbeheer, gereedschap tracking software, handgereedschap voorraadbeheer, gereedschap beheer software, gereedschap tracking, gereedschap voorraadbeheer software"
        url="https://www.stockflowsystems.com/nl/voorraadbeheer-gereedschap"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/assets-inventory' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraadbeheer-gereedschap' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Gereedschap Voorraadbeheer Software
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Gereedschap voorraadbeheer software voor het volgen van gereedschappen en handgereedschap. 
            Voorkom diefstal, optimaliseer gebruik en plan onderhoud. Volledig gratis.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Gereedschap Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt gereedschap voorraadbeheer. Geen creditcard vereist.
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


