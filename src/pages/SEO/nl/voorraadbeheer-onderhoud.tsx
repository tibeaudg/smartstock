import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Wrench, Calendar, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerOnderhoudPage() {
  const faqData = [
    {
      question: "Wat is onderhoud voorraadbeheer?",
      answer: "Onderhoud voorraadbeheer is het proces van het beheren van onderhoudsvoorraden zoals reserveonderdelen, smeermiddelen, filters en andere onderhoudsmaterialen. Het helpt bedrijven onderhoudsvoorraden te volgen, onderhoud te plannen en ervoor te zorgen dat benodigde onderdelen beschikbaar zijn wanneer onderhoud nodig is."
    },
    {
      question: "Waarom hebben bedrijven onderhoud voorraadbeheer software nodig?",
      answer: "Bedrijven hebben onderhoud voorraadbeheer software nodig om onderhoudsvoorraden te optimaliseren, onderhoudskosten te beheren, downtime te voorkomen door beschikbaarheid van reserveonderdelen te garanderen en onderhoudsplanning te verbeteren."
    }
  ];

  return (
    <SeoPageLayout 
      title="Onderhoud Voorraadbeheer"
      heroTitle="Onderhoud Voorraadbeheer Software"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Onderhoud Voorraadbeheer Software - Beheer Onderhoudsvoorraden | StockFlow"
        description="Onderhoud voorraadbeheer software voor het beheren van onderhoudsvoorraden zoals reserveonderdelen en smeermiddelen. Optimaliseer onderhoudskosten en voorkom downtime. Volledig gratis."
        keywords="onderhoud voorraadbeheer, onderhoudsvoorraden beheer, reserveonderdelen voorraadbeheer, onderhoud voorraad software, MRO voorraadbeheer, onderhoud voorraadbeheer software"
        url="https://www.stockflowsystems.com/nl/voorraadbeheer-onderhoud"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/inventory-management-software' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraadbeheer-onderhoud' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Onderhoud Voorraadbeheer Software
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Onderhoud voorraadbeheer software voor het beheren van onderhoudsvoorraden zoals reserveonderdelen 
            en smeermiddelen. Optimaliseer onderhoudskosten en voorkom downtime. Volledig gratis.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Onderhoud Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt onderhoud voorraadbeheer. Geen creditcard vereist.
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

