import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Wrench, Package, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerHvacPage() {
  const faqData = [
    {
      question: "Wat is HVAC voorraadbeheer?",
      answer: "HVAC voorraadbeheer is gespecialiseerd voorraadbeheer voor verwarming, ventilatie en airconditioning bedrijven. Het helpt HVAC aannemers onderdelen, gereedschappen en uitrusting te volgen over meerdere projectlocaties, onderhoud te plannen en voorraadniveaus te optimaliseren."
    },
    {
      question: "Waarom hebben HVAC bedrijven voorraadbeheer software nodig?",
      answer: "HVAC bedrijven hebben voorraadbeheer software nodig om onderdelen over meerdere projectlocaties te volgen, servicevoertuigen te beheren, onderhoud te plannen, voorraadtekorten te voorkomen die projecten vertragen en kosten per project nauwkeurig te berekenen."
    }
  ];

  return (
    <SeoPageLayout 
      title="HVAC Voorraadbeheer"
      heroTitle="HVAC Voorraadbeheer Software voor Aannemers"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="HVAC Voorraadbeheer Software voor Aannemers | StockFlow"
        description="Gespecialiseerde HVAC voorraadbeheer software. Volg onderdelen, gereedschappen en uitrusting over meerdere projectlocaties. Optimaliseer voorraadniveaus en voorkom projectvertragingen."
        keywords="HVAC voorraadbeheer, HVAC voorraad software, HVAC aannemer voorraadbeheer, verwarming ventilatie voorraadbeheer, airconditioning voorraadbeheer, HVAC stockbeheer"
        url="https://www.stockflowsystems.com/nl/industries/voorraadbeheer-hvac"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/hvac-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/industries/voorraadbeheer-hvac' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            HVAC Voorraadbeheer Software voor Aannemers
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Gespecialiseerde HVAC voorraadbeheer software. Volg onderdelen, gereedschappen en uitrusting over 
            meerdere projectlocaties. Optimaliseer voorraadniveaus en voorkom projectvertragingen.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis HVAC Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt HVAC voorraadbeheer. Geen creditcard vereist.
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

