
import { StockManagementApp } from '@/components/StockManagementApp';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <main>
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
  );
};

export default Index;
