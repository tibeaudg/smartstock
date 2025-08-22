
import { StockManagementApp } from '@/components/StockManagementApp';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import SocialShare from '@/components/SocialShare';

const Index = () => {
  // Structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Stockflow - Gratis Voorraadbeheer Software",
    "description": "Ontdek Stockflow: dé gratis voorraadbeheer software voor KMO's. Eenvoudig voorraadbeheer met Excel-achtige interface. Automatiseer, bespaar tijd en krijg direct inzicht. Probeer gratis!",
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
      "Voorraadbeheer software",
      "Voorraadbeheer excel",
      "Gratis voorraadbeheer",
      "Voorraadbeheer app",
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
        title="Voorraadbeheer Software Gratis | Stockflow - Eenvoudig Voorraadbeheer"
        description="Ontdek Stockflow: dé gratis voorraadbeheer software voor KMO's. Eenvoudig voorraadbeheer met Excel-achtige interface. Automatiseer, bespaar tijd en krijg direct inzicht. Probeer gratis!"
        keywords="voorraadbeheer, voorraadbeheer software, voorraadbeheer excel, gratis voorraadbeheer, voorraadbeheer app, voorraadbeheer software gratis, voorraadbeheer app gratis, gratis voorraadbeheer excel, voorraadbeheer excel template gratis, voorraadbeheer app, app voorraadbeheer thuis, voorraadbeheer excel zelf maken, erp voorraadbeheer, excel voorraadbeheer, voorraadbeheer logistiek, voorraadbeheer detailhandel, facturatie en voorraadbeheer, voorraadbeheer betekenis, online voorraadbeheer, exact online voorraadbeheer, stockflow, voorraad, magazijn, automatiseren, KMO, inventaris, voorraad optimaliseren"
        structuredData={structuredData}
      />
      <main>
        <h1 className="text-3xl font-bold mb-4">Voorraadbeheer Software - Gratis en Eenvoudig</h1>
        <h2 className="text-xl font-semibold mb-6">De beste gratis voorraadbeheer software voor KMO's en bedrijven</h2>
        <p className="mb-6 text-gray-700">
          Stockflow voorraadbeheer software helpt KMO's en bedrijven hun voorraad, producten en magazijn efficiënt te beheren. 
          Onze gratis voorraadbeheer software combineert de eenvoud van Excel met de kracht van moderne voorraadbeheer software. 
          Perfect voor voorraadbeheer thuis, detailhandel, logistiek en horeca. 
          <strong>Voorraadbeheer software gratis</strong> - geen verborgen kosten, direct toegang.
        </p>
        
        {/* Key Features Section */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Waarom kiezen voor onze voorraadbeheer software?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Voorraadbeheer software gratis</strong> - geen abonnement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Voorraadbeheer excel</strong> - vertrouwde interface</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Voorraadbeheer app</strong> - mobiel toegankelijk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Online voorraadbeheer</strong> - altijd beschikbaar</span>
            </div>
          </div>
        </div>

        <StockManagementApp />
        
        {/* Popular Search Terms Section */}
        <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Populaire voorraadbeheer onderwerpen:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Voorraadbeheer Software</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• <Link to="/voorraadbeheer-software" className="text-blue-600 hover:underline">Voorraadbeheer software vergelijken</Link></li>
                <li>• <Link to="/voorraadbeheer-software-vergelijken" className="text-blue-600 hover:underline">Beste voorraadbeheer software</Link></li>
                <li>• <Link to="/voorraadbeheer-excel-vs-software" className="text-blue-600 hover:underline">Excel vs voorraadbeheer software</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Gratis Voorraadbeheer</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• <Link to="/gratis-voorraadbeheer" className="text-blue-600 hover:underline">Gratis voorraadbeheer software</Link></li>
                <li>• <Link to="/gratis-stockbeheer" className="text-blue-600 hover:underline">Gratis stockbeheer</Link></li>
                <li>• <Link to="/voorraadbeheer-excel-vs-software" className="text-blue-600 hover:underline">Gratis voorraadbeheer excel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Voorraadbeheer App</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• <Link to="/mobiel-voorraadbeheer" className="text-blue-600 hover:underline">Mobiel voorraadbeheer</Link></li>
                <li>• <Link to="/voorraadbeheer-app" className="text-blue-600 hover:underline">Voorraadbeheer app</Link></li>
                <li>• <Link to="/app-voorraadbeheer-thuis" className="text-blue-600 hover:underline">App voorraadbeheer thuis</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Social Media Integration */}
        <div className="mt-8 mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Volg ons voor meer voorraadbeheer tips</h3>
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
            <h4 className="text-md font-semibold mb-2">Deel deze gratis voorraadbeheer software</h4>
            <SocialShare 
              title="Voorraadbeheer Software Gratis | Stockflow"
              description="Ontdek Stockflow: dé gratis voorraadbeheer software voor KMO's. Eenvoudig voorraadbeheer met Excel-achtige interface."
            />
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <Link to="/voorraadbeheer-tips" className="text-blue-700 underline block">
            Voorraadbeheer tips voor KMO's
          </Link>
          <Link to="/voorraadbeheer-software-vergelijken" className="text-blue-700 underline block">
            Voorraadbeheer software vergelijken
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
          <Link to="/gratis-voorraadbeheer" className="text-blue-700 underline block">
            Gratis voorraadbeheer software
          </Link>
        </div>
      </main>
    </>
  );
};

export default Index;
