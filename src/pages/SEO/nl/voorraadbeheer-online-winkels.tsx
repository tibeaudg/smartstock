import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { ShoppingBag, Globe, Zap, CheckCircle } from 'lucide-react';

export default function VoorraadbeheerOnlineWinkelsPage() {
  const faqData = [
    {
      question: "Waarom hebben online winkels voorraadbeheer software nodig?",
      answer: "Online winkels hebben voorraadbeheer software nodig om oververkoop te voorkomen, voorraad over meerdere verkoopkanalen te synchroniseren, real-time voorraadniveaus te behouden, ordervervulling te automatiseren en operaties te schalen zonder proportioneel personeel toe te voegen."
    },
    {
      question: "Hoe voorkomt voorraadbeheer software oververkoop voor online winkels?",
      answer: "Voorraadbeheer software voorkomt oververkoop door voorraadniveaus over alle platforms in real-time te synchroniseren, automatisch voorraad bij te werken wanneer producten worden verkocht, voorraad te reserveren wanneer bestellingen worden geplaatst en gecentraliseerde voorraadcontrole te bieden."
    },
    {
      question: "Kan voorraadbeheer software integreren met Shopify, Amazon en andere platforms?",
      answer: "Ja, StockFlow integreert met meerdere e-commerce platforms inclusief Shopify, WooCommerce, Amazon, BigCommerce, Wix en meer. Dit stelt u in staat om voorraad te beheren over al uw verkoopkanalen vanuit één systeem."
    },
    {
      question: "Hoe snel synchroniseert voorraad over platforms?",
      answer: "Met StockFlow synchroniseert voorraad over platforms in real-time (binnen seconden). Wanneer een product op één platform wordt verkocht, worden voorraadniveaus automatisch bijgewerkt op alle verbonden platforms."
    }
  ];

  return (
    <SeoPageLayout 
      title="Voorraadbeheer Online Winkels"
      heroTitle="Voorraadbeheer Software voor Online Winkels"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Voorraadbeheer Software voor Online Winkels | Multi-Platform | StockFlow"
        description="Voorraadbeheer software voor online winkels. Synchroniseer voorraad over Shopify, Amazon, WooCommerce en andere platforms. Voorkom oververkoop, bespaar 20+ uur/week. Volledig gratis."
        keywords="online winkel voorraadbeheer, e-commerce voorraadbeheer, online winkel voorraad software, webwinkel voorraadbeheer, online shop voorraadbeheer, e-commerce voorraadbeheer software, online winkel stockbeheer"
        url="https://www.stockflowsystems.com/nl/voorraadbeheer-online-winkels"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/ecommerce-inventory-management' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraadbeheer-online-winkels' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Voorraadbeheer Software voor Online Winkels
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Voorraadbeheer software voor online winkels. Synchroniseer voorraad over Shopify, Amazon, WooCommerce 
            en andere platforms. Voorkom oververkoop, bespaar 20+ uur/week.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Globe, title: "Multi-Platform Sync", description: "Synchroniseer voorraad over alle verkoopkanalen" },
              { icon: ShoppingBag, title: "Voorkom Oververkoop", description: "Real-time updates voorkomen oververkoop" },
              { icon: Zap, title: "Automatisering", description: "Automatiseer ordervervulling en herbestellen" }
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
            Start Vandaag Met Gratis Voorraadbeheer voor Online Winkels
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt voorraadbeheer voor online winkels. Geen creditcard vereist.
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


