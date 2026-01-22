import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Building2, Shield, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerOverheidPage() {
  const faqData = [
    {
      question: "Wat is overheid voorraadbeheer?",
      answer: "Overheid voorraadbeheer is gespecialiseerd voorraadbeheer voor overheidsinstellingen en publieke organisaties. Het helpt overheidsorganisaties voorraden, assets en uitrusting te volgen, naleving te garanderen, audit trails te behouden en publieke middelen efficiënt te beheren."
    },
    {
      question: "Waarom hebben overheidsinstellingen voorraadbeheer software nodig?",
      answer: "Overheidsinstellingen hebben voorraadbeheer software nodig om publieke middelen te beheren, naleving te garanderen, audit trails te behouden, transparantie te bieden, voorraadkosten te optimaliseren en verantwoording te verbeteren."
    }
  ];

  return (
    <SeoPageLayout 
      title="Overheid Voorraadbeheer"
      heroTitle="Overheid Voorraadbeheer Software voor Publieke Organisaties"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Overheid Voorraadbeheer Software voor Publieke Organisaties | StockFlow"
        description="Gespecialiseerde overheid voorraadbeheer software. Beheer publieke middelen, garandeer naleving en behoud audit trails. Volledig gratis."
        keywords="overheid voorraadbeheer, publieke organisatie voorraadbeheer, overheid voorraad software, publieke sector voorraadbeheer, overheid voorraadbeheer software, publieke organisatie stockbeheer"
        url="https://www.stockflowsystems.com/nl/industries/voorraadbeheer-overheid"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/government-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/industries/voorraadbeheer-overheid' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Overheid Voorraadbeheer Software voor Publieke Organisaties
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Gespecialiseerde overheid voorraadbeheer software. Beheer publieke middelen, garandeer naleving 
            en behoud audit trails. Volledig gratis.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Overheid Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt overheid voorraadbeheer. Geen creditcard vereist.
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

