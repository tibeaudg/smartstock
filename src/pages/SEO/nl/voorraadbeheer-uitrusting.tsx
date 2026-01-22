import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Wrench, Package, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerUitrustingPage() {
  const faqData = [
    {
      question: "Wat is uitrusting voorraadbeheer?",
      answer: "Uitrusting voorraadbeheer is het proces van het volgen en beheren van bedrijfsuitrusting zoals machines, gereedschappen en apparatuur. Het helpt bedrijven te weten waar uitrusting zich bevindt, wanneer onderhoud nodig is en welke uitrusting beschikbaar is voor gebruik."
    },
    {
      question: "Waarom hebben bedrijven uitrusting voorraadbeheer software nodig?",
      answer: "Bedrijven hebben uitrusting voorraadbeheer software nodig om uitrusting te volgen over meerdere locaties, onderhoud te plannen, diefstal te voorkomen, uitrustingsgebruik te optimaliseren en onderhoudskosten te beheren."
    }
  ];

  return (
    <SeoPageLayout 
      title="Uitrusting Voorraadbeheer"
      heroTitle="Uitrusting Voorraadbeheer Software"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Uitrusting Voorraadbeheer Software - Volg Machines & Gereedschappen | StockFlow"
        description="Uitrusting voorraadbeheer software voor het volgen van machines, gereedschappen en apparatuur. Onderhoudsplanning, locatietracking en gebruikoptimalisatie. Volledig gratis."
        keywords="uitrusting voorraadbeheer, uitrusting tracking software, machine voorraadbeheer, gereedschap voorraadbeheer, uitrusting beheer software, machine tracking, uitrusting voorraadbeheer software"
        url="https://www.stockflowsystems.com/nl/voorraadbeheer-uitrusting"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/assets-inventory' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraadbeheer-uitrusting' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Uitrusting Voorraadbeheer Software
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Uitrusting voorraadbeheer software voor het volgen van machines, gereedschappen en apparatuur. 
            Onderhoudsplanning, locatietracking en gebruikoptimalisatie. Volledig gratis.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Uitrusting Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt uitrusting voorraadbeheer. Geen creditcard vereist.
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


