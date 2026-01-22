import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { Package, QrCode, MapPin, BarChart3, Shield, Clock, TrendingUp, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerAssetsPage() {
  const faqData = [
    {
      question: "Wat is assets voorraadbeheer?",
      answer: "Assets voorraadbeheer is een systeem voor het volgen, monitoren en beheren van fysieke assets (uitrusting, machines, gereedschappen, voertuigen, IT-assets) gedurende hun levenscyclus. In tegenstelling tot productvoorraad richt assets voorraad zich op vaste activa die worden gebruikt in operaties in plaats van verkocht."
    },
    {
      question: "Wat is het verschil tussen assets voorraad en productvoorraad?",
      answer: "Productvoorraad volgt items die u verkoopt aan klanten (voorraad die omloopt). Assets voorraad volgt vaste activa die u gebruikt om uw bedrijf te runnen (uitrusting, voertuigen, machines). Productvoorraad richt zich op hoeveelheden en verkopen, terwijl assets voorraad zich richt op asset levenscyclus, onderhoud, afschrijving en naleving."
    },
    {
      question: "Welke assets moeten worden gevolgd in een voorraadsysteem?",
      answer: "Assets die moeten worden gevolgd zijn: uitrusting en machines, voertuigen, IT-hardware (computers, servers, printers), gereedschappen, meubilair en kantoorapparatuur, en andere vaste activa die worden gebruikt in bedrijfsoperaties. StockFlow ondersteunt zowel product- als asset tracking in één platform."
    },
    {
      question: "Kan assets voorraadbeheer software onderhoud plannen?",
      answer: "Ja, moderne assets voorraadbeheer software zoals StockFlow kan onderhoud plannen, onderhoudsgeschiedenis bijhouden, onderhoudswaarschuwingen sturen en onderhoudskosten volgen. Dit helpt assets in goede staat te houden en verlengt hun levensduur."
    }
  ];

  return (
    <SeoPageLayout 
      title="Assets Voorraadbeheer"
      heroTitle="Assets Voorraadbeheer Software"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Assets Voorraadbeheer Software - Volg Uitrusting & Gereedschappen | StockFlow"
        description="Assets voorraadbeheer software voor het volgen van uitrusting, machines, gereedschappen en voertuigen. Onderhoudsplanning, locatietracking en levenscyclusbeheer. Volledig gratis."
        keywords="assets voorraadbeheer, asset tracking software, uitrusting voorraadbeheer, gereedschap voorraadbeheer, asset beheer software, uitrusting tracking, asset voorraadbeheer software"
        url="https://www.stockflowsystems.com/nl/voorraadbeheer-assets"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/assets-inventory' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraadbeheer-assets' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Assets Voorraadbeheer Software
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Assets voorraadbeheer software voor het volgen van uitrusting, machines, gereedschappen en voertuigen. 
            Onderhoudsplanning, locatietracking en levenscyclusbeheer. Volledig gratis.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Package, title: "Asset Tracking", description: "Volg alle assets met barcode/QR scanning" },
              { icon: Clock, title: "Onderhoudsplanning", description: "Plan en volg onderhoud voor alle assets" },
              { icon: MapPin, title: "Locatietracking", description: "Weet altijd waar uw assets zich bevinden" }
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
            Start Vandaag Met Gratis Assets Voorraadbeheer
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt assets voorraadbeheer. Geen creditcard vereist.
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

