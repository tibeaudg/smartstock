
import { StockManagementApp } from '@/components/StockManagementApp';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import SocialShare from '@/components/SocialShare';

const Index = () => {
  // Structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Stockflow - Gratis Voorraadbeheer",
    "description": "Ontdek Stockflow: dé oplossing voor eenvoudig en gratis voorraadbeheer. Automatiseer, bespaar tijd en krijg direct inzicht. Probeer gratis!",
    "url": "https://stockflow.app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "description": "Gratis voorraadbeheer software"
    },
    "provider": {
      "@type": "Organization",
      "name": "Stockflow",
      "url": "https://stockflow.app",
      "logo": "https://stockflow.app/logo.png"
    },
    "featureList": [
      "Voorraadbeheer",
      "Automatisering", 
      "KMO ondersteuning",
      "Magazijnbeheer",
      "Inventaris optimalisatie"
    ],
    "screenshot": "https://stockflow.app/Inventory-Management.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  };

  return (
    <>
      <SEO
        title="Stockflow - Gratis Voorraadbeheer"
        description="Ontdek Stockflow: dé oplossing voor eenvoudig en gratis voorraadbeheer. Automatiseer, bespaar tijd en krijg direct inzicht. Probeer gratis!"
        keywords="voorraadbeheer, stockflow, voorraad, magazijn, automatiseren, KMO, inventaris, voorraadbeheer software, voorraad optimaliseren"
        structuredData={structuredData}
      />
      <main>
        <h1 className="text-3xl font-bold mb-4">Voorraadbeheer met Stockflow</h1>
        <h2 className="text-xl font-semibold mb-6">Slim en efficiënt voorraadbeheer voor KMO's en bedrijven</h2>
        <p className="mb-6 text-gray-700">Stockflow voorraadbeheer software helpt KMO's en bedrijven hun voorraad, producten en magazijn efficiënt te beheren, automatiseren en optimaliseren. Voorraadbeheer, voorraad, voorraad optimaliseren, voorraadbeheer software, automatiseren, KMO, inventaris, magazijnbeheer.</p>
        <StockManagementApp />
        
        {/* Social Media Integration */}
        <div className="mt-8 mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Volg ons voor meer tips</h3>
          <div className="flex gap-4 mb-4">
            <a 
              href="https://www.linkedin.com/company/stockflow" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <span>🔗</span> LinkedIn
            </a>
            <a 
              href="https://www.facebook.com/stockflowapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition-colors"
            >
              <span>📘</span> Facebook
            </a>
            <a 
              href="https://twitter.com/stockflowapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
            >
              <span>🐦</span> Twitter
            </a>
          </div>
          
          {/* Social Share Component */}
          <div className="border-t pt-4">
            <h4 className="text-md font-semibold mb-2">Deel deze pagina</h4>
            <SocialShare 
              title="Stockflow - Gratis Voorraadbeheer"
              description="Ontdek Stockflow: dé oplossing voor eenvoudig en gratis voorraadbeheer. Automatiseer, bespaar tijd en krijg direct inzicht."
            />
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <Link to="/voorraadbeheer-tips" className="text-blue-700 underline block">
            Lees onze voorraadbeheer tips voor KMO's
          </Link>
          <Link to="/voorraadbeheer-software-vergelijken" className="text-blue-700 underline block">
            Vergelijk voorraadbeheer software
          </Link>
          <Link to="/voorraadbeheer-webshop" className="text-blue-700 underline block">
            Voorraadbeheer voor webshops
          </Link>
          <Link to="/voorraadbeheer-fouten-voorkomen" className="text-blue-700 underline block">
            Fouten in voorraadbeheer voorkomen
          </Link>
          <Link to="/voorraadbeheer-automatiseren" className="text-blue-700 underline block">
            Voorraadbeheer automatiseren
          </Link>
          <Link to="/inventarisatie-tips" className="text-blue-700 underline block">
            Inventarisatie tips
          </Link>
          <Link to="/voorraadbeheer-horeca" className="text-blue-700 underline block">
            Voorraadbeheer voor horeca
          </Link>
          <Link to="/voorraadbeheer-excel-vs-software" className="text-blue-700 underline block">
            Voorraadbeheer: Excel vs. software
          </Link>
          <Link to="/voorraadbeheer-voor-starters" className="text-blue-700 underline block">
            Voorraadbeheer voor starters
          </Link>
          <Link to="/mobiel-voorraadbeheer" className="text-blue-700 underline block">
            Mobiel voorraadbeheer
          </Link>
        </div>
      </main>
    </>
  );
};

export default Index;
