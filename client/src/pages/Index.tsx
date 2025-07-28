
import { StockManagementApp } from '@/components/StockManagementApp';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import SEO from '../components/SEO';

const Index = () => {
  return (
    <main>
      <SEO
        title="Stockbeheer App voor KMO's | stockflow"
        description="De beste stockbeheer app voor KMO's en zelfstandigen. Beheer je voorraad eenvoudig, snel en slim met stockflow."
        keywords="stockbeheer, voorraadbeheer, stockbeheer app, voorraadbeheer KMO, voorraadbeheer software, voorraadbeheer Vlaanderen"
        url="https://www.stockflow.be/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Stockbeheer App voor KMO's | stockflow",
          "description": "De beste stockbeheer app voor KMO's en zelfstandigen. Beheer je voorraad eenvoudig, snel en slim met stockflow.",
          "publisher": {"@type": "Organization", "name": "stockflow"},
          "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/"}
        }}
      />
      <h1 className="text-4xl font-bold mb-6">Stockbeheer App voor KMO's en Zelfstandigen</h1>
      <StockManagementApp />
      <div className="mt-8 space-y-2">
        <Link to="/voorraadbeheer-tips" className="text-blue-700 underline block">Lees onze voorraadbeheer tips voor KMO's</Link>
        <Link to="/magazijnbeheer-tips" className="text-blue-700 underline block">Magazijnbeheer tips voor KMO's</Link>
        <Link to="/voorraadbeheer-software-vergelijken" className="text-blue-700 underline block">Vergelijk voorraadbeheer software</Link>
        <Link to="/voorraadbeheer-webshop" className="text-blue-700 underline block">Voorraadbeheer voor webshops</Link>
        <Link to="/voorraadbeheer-fouten-voorkomen" className="text-blue-700 underline block">Fouten in voorraadbeheer voorkomen</Link>
        <Link to="/voorraadbeheer-automatiseren" className="text-blue-700 underline block">Voorraadbeheer automatiseren</Link>
        <Link to="/inventarisatie-tips" className="text-blue-700 underline block">Inventarisatie tips</Link>
        <Link to="/voorraadbeheer-horeca" className="text-blue-700 underline block">Voorraadbeheer voor horeca</Link>
        <Link to="/voorraadbeheer-excel-vs-software" className="text-blue-700 underline block">Voorraadbeheer: Excel vs. software</Link>
        <Link to="/voorraadbeheer-voor-starters" className="text-blue-700 underline block">Voorraadbeheer voor starters</Link>
        <Link to="/mobiel-voorraadbeheer" className="text-blue-700 underline block">Mobiel voorraadbeheer</Link>
      </div>
    </main>
=======
import { SEO } from '@/components/SEO';

const Index = () => {
  return (
    <>
      <SEO
        title="Stockflow - Slim en Efficiënt Voorraadbeheer"
        description="Ontdek Stockflow: dé oplossing voor eenvoudig en efficiënt voorraadbeheer. Automatiseer, bespaar tijd en krijg direct inzicht. Probeer gratis!"
        keywords="voorraadbeheer, stockflow, voorraad, magazijn, automatiseren, KMO, inventaris, voorraadbeheer software, voorraad optimaliseren"
      />
      <main>
        <h1 className="text-3xl font-bold mb-4">Voorraadbeheer met Stockflow</h1>
        <h2 className="text-xl font-semibold mb-6">Slim en efficiënt voorraadbeheer voor KMO's en bedrijven</h2>
        <p className="mb-6 text-gray-700">Stockflow voorraadbeheer software helpt KMO's en bedrijven hun voorraad, producten en magazijn efficiënt te beheren, automatiseren en optimaliseren. Voorraadbeheer, voorraad, voorraad optimaliseren, voorraadbeheer software, automatiseren, KMO, inventaris, magazijnbeheer.</p>
        <StockManagementApp />
        <div className="mt-8 space-y-2">
          <Link to="/voorraadbeheer-tips" className="text-blue-700 underline block">
            Lees onze voorraadbeheer tips voor KMO's
          </Link>
          <Link to="/magazijnbeheer-tips" className="text-blue-700 underline block">
            Magazijnbeheer tips voor KMO's
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
>>>>>>> 6deb758d64acaa90db173d1b6dfa6479d94c0b33
  );
};

export default Index;
