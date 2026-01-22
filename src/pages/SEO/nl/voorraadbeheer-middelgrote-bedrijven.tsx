import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Building2, TrendingUp, CheckCircle, Zap } from 'lucide-react';

export default function VoorraadbeheerMiddelgroteBedrijvenPage() {
  const faqData = [
    {
      question: "Wat is voorraadbeheer voor middelgrote bedrijven?",
      answer: "Voorraadbeheer voor middelgrote bedrijven is voorraadbeheer software die is geschaald voor groeiende bedrijven met meerdere locaties, hogere voorraadvolumes en complexere operaties. Het biedt geavanceerde functies zoals multi-locatie tracking, geavanceerde analytics en integraties terwijl het betaalbaar en gebruiksvriendelijk blijft."
    },
    {
      question: "Waarom hebben middelgrote bedrijven voorraadbeheer software nodig?",
      answer: "Middelgrote bedrijven hebben voorraadbeheer software nodig om operaties te schalen zonder proportioneel personeel toe te voegen, voorraad over meerdere locaties te beheren, geavanceerde analytics te gebruiken voor betere beslissingen, processen te automatiseren en efficiëntie te verbeteren terwijl ze groeien."
    },
    {
      question: "Is voorraadbeheer software schaalbaar voor middelgrote bedrijven?",
      answer: "Ja, moderne voorraadbeheer software zoals StockFlow is volledig schaalbaar en groeit met uw bedrijf. Het ondersteunt bedrijven van 10 producten tot 100.000+ producten, meerdere locaties, onbeperkte gebruikers en geavanceerde functies zonder verborgen kosten of beperkingen."
    }
  ];

  return (
    <SeoPageLayout 
      title="Voorraadbeheer Middelgrote Bedrijven"
      heroTitle="Voorraadbeheer Software voor Middelgrote Bedrijven"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Voorraadbeheer Software voor Middelgrote Bedrijven | StockFlow"
        description="Voorraadbeheer software speciaal ontworpen voor middelgrote bedrijven. Multi-locatie tracking, geavanceerde analytics, schaalbaarheid. Volledig gratis voor altijd."
        keywords="voorraadbeheer middelgrote bedrijven, middelgrote bedrijf voorraad software, MKB voorraadbeheer, middelgrote onderneming voorraadbeheer, voorraadbeheer software middelgrote bedrijven, middelgrote bedrijf stockbeheer"
        url="https://www.stockflowsystems.com/nl/voorraadbeheer-middelgrote-bedrijven"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/inventory-management-software' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraadbeheer-middelgrote-bedrijven' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Voorraadbeheer Software voor Middelgrote Bedrijven
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Voorraadbeheer software speciaal ontworpen voor middelgrote bedrijven. Multi-locatie tracking, 
            geavanceerde analytics, schaalbaarheid. Volledig gratis voor altijd.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Building2, title: "Schaalbaar", description: "Groeit met uw bedrijf zonder beperkingen" },
              { icon: TrendingUp, title: "Geavanceerde Analytics", description: "Data-gedreven beslissingen voor groei" },
              { icon: Zap, title: "Multi-Locatie", description: "Beheer voorraad over meerdere locaties" }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Voorraadbeheer voor Middelgrote Bedrijven
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt voorraadbeheer voor middelgrote bedrijven. Geen creditcard vereist.
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


