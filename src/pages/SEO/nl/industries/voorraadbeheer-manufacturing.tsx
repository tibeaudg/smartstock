import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Factory, Package, BarChart3, CheckCircle, Zap } from 'lucide-react';

export default function VoorraadbeheerManufacturingPage() {
  const faqData = [
    {
      question: "Wat is productie voorraadbeheer?",
      answer: "Productie voorraadbeheer is een gespecialiseerd systeem voor het beheren van grondstoffen, onderdelen, werk-in-proces (WIP) en eindproducten in productieomgevingen. Het omvat stuklijst (BOM) beheer, productieplanning, materiaalvereistenplanning (MRP) en integratie met productiesystemen."
    },
    {
      question: "Waarom hebben fabrikanten gespecialiseerd voorraadbeheer nodig?",
      answer: "Fabrikanten hebben gespecialiseerd voorraadbeheer nodig omdat productieprocessen unieke vereisten hebben zoals stuklijstbeheer, werk-in-proces tracking, grondstofplanning, productieplanning en integratie met productiesystemen. Generieke voorraadbeheer systemen kunnen deze complexiteit niet aan."
    },
    {
      question: "Wat is het verschil tussen productie voorraadbeheer en retail voorraadbeheer?",
      answer: "Productie voorraadbeheer richt zich op grondstoffen, onderdelen en werk-in-proces die worden gebruikt om producten te maken, terwijl retail voorraadbeheer zich richt op eindproducten die worden verkocht. Productie voorraadbeheer omvat stuklijstbeheer, productieplanning en MRP, terwijl retail voorraadbeheer zich richt op verkoop en distributie."
    },
    {
      question: "Kan productie voorraadbeheer software integreren met MRP systemen?",
      answer: "Ja, moderne productie voorraadbeheer software zoals StockFlow integreert met MRP (Materiaalvereistenplanning) systemen om productieplanning te optimaliseren, grondstofvereisten te berekenen en productieprocessen te stroomlijnen."
    }
  ];

  return (
    <SeoPageLayout 
      title="Productie Voorraadbeheer"
      heroTitle="Productie Voorraadbeheer Software voor Fabrikanten"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Productie Voorraadbeheer Software voor Fabrikanten | StockFlow"
        description="Gespecialiseerde productie voorraadbeheer software voor fabrikanten. Beheer grondstoffen, stuklijsten, werk-in-proces en eindproducten met real-time tracking en MRP integratie."
        keywords="productie voorraadbeheer, manufacturing voorraadbeheer, fabrikant voorraadbeheer, productie voorraad software, manufacturing voorraad software, productie voorraadbeheer software, stuklijst beheer, MRP voorraadbeheer"
        url="https://www.stockflowsystems.com/nl/industries/voorraadbeheer-manufacturing"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/manufacturing-inventory-management-software' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/industries/voorraadbeheer-manufacturing' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Productie Voorraadbeheer Software voor Fabrikanten
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Gespecialiseerde productie voorraadbeheer software voor fabrikanten. Beheer grondstoffen, stuklijsten, 
            werk-in-proces en eindproducten met real-time tracking en MRP integratie.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Productie Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt productie voorraadbeheer. Geen creditcard vereist.
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

