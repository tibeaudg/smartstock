import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Gem, Package, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerJuwelierPage() {
  const faqData = [
    {
      question: "Wat is juwelier voorraadbeheer?",
      answer: "Juwelier voorraadbeheer is gespecialiseerd voorraadbeheer voor juweliers en sieradenwinkels. Het helpt juweliers waardevolle sieraden te volgen, serienummers te beheren, certificaten te koppelen, voorraadniveaus te optimaliseren en diefstal te voorkomen."
    },
    {
      question: "Waarom hebben juweliers gespecialiseerd voorraadbeheer nodig?",
      answer: "Juweliers hebben gespecialiseerd voorraadbeheer nodig omdat sieraden hoogwaardige items zijn die serienummer tracking, certificaatbeheer, waardetracking en verhoogde beveiliging vereisen. Generieke voorraadbeheer systemen kunnen deze unieke vereisten niet aan."
    }
  ];

  return (
    <SeoPageLayout 
      title="Juwelier Voorraadbeheer"
      heroTitle="Juwelier Voorraadbeheer Software voor Sieradenwinkels"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Juwelier Voorraadbeheer Software voor Sieradenwinkels | StockFlow"
        description="Gespecialiseerde juwelier voorraadbeheer software. Volg waardevolle sieraden, beheer serienummers en certificaten, voorkom diefstal. Volledig gratis."
        keywords="juwelier voorraadbeheer, sieraden voorraadbeheer, juwelier voorraad software, sieradenwinkel voorraadbeheer, juwelier voorraadbeheer software, sieraden stockbeheer, juwelier voorraadtracking"
        url="https://www.stockflowsystems.com/nl/industries/voorraadbeheer-juwelier"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/jewelry-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/industries/voorraadbeheer-juwelier' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Juwelier Voorraadbeheer Software voor Sieradenwinkels
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Gespecialiseerde juwelier voorraadbeheer software. Volg waardevolle sieraden, beheer serienummers 
            en certificaten, voorkom diefstal. Volledig gratis.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Juwelier Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt juwelier voorraadbeheer. Geen creditcard vereist.
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

