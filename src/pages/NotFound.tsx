import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SuggestionInput } from "@/components/SuggestionInput";
import SEO from '../components/SEO';
import { usePageRefresh } from '@/hooks/usePageRefresh';

const SUGGESTIES = [
  { label: "Home", path: "/" },
  { label: "Voorraadbeheer tips", path: "/voorraadbeheer-tips" },
  { label: "Software vergelijken", path: "/voorraadbeheer-software-vergelijken" },
  { label: "Voorraadbeheer webshop", path: "/voorraadbeheer-webshop" },
  { label: "Fouten voorkomen", path: "/voorraadbeheer-fouten-voorkomen" },
  { label: "Automatiseren", path: "/voorraadbeheer-automatiseren" },
  { label: "Voorraadbeheer horeca", path: "/voorraadbeheer-horeca" },
  { label: "Excel vs. software", path: "/voorraadbeheer-excel-vs-software" },
  { label: "Voorraadbeheer voor starters", path: "/voorraadbeheer-voor-starters" },
  { label: "Mobiel voorraadbeheer", path: "/mobiel-voorraadbeheer" },
];

const SOCIALS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/company/stockflow", icon: "🔗" },
  { label: "Facebook", url: "https://www.facebook.com/stockflowapp", icon: "📘" },
  { label: "Twitter", url: "https://twitter.com/stockflowapp", icon: "🐦" },
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [zoek, setZoek] = useState("");
  
  // Gebruik de page refresh hook
  usePageRefresh();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Enhanced structured data for 404 page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Pagina niet gevonden (404) | Stockflow",
    "description": "Deze pagina bestaat niet. Vind hier snel de juiste voorraadbeheer informatie, tips en oplossingen voor KMO's.",
    "url": `https://www.stockflow.be${location.pathname}`,
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Waar kan ik voorraadbeheer tips vinden?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bekijk onze uitgebreide voorraadbeheer tips voor KMO's op de daarvoor bestemde pagina."
          }
        },
        {
          "@type": "Question", 
          "name": "Hoe kan ik voorraadbeheer automatiseren?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lees onze gids over voorraadbeheer automatiseren voor praktische tips en oplossingen."
          }
        }
      ]
    }
  };

  // Suggesties filteren op zoekterm
  const filtered = SUGGESTIES.filter(s =>
    s.label.toLowerCase().includes(zoek.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-lg w-full bg-white p-8 rounded shadow">
        <SEO
          title="Pagina niet gevonden (404) | Stockflow"
          description="Deze pagina bestaat niet. Vind hier snel de juiste voorraadbeheer informatie, tips en oplossingen voor KMO's."
          keywords="404, pagina niet gevonden, voorraadbeheer, stockbeheer, tips, KMO"
          url={`https://www.stockflow.be${location.pathname}`}
          structuredData={structuredData}
        />
        <h1 className="text-5xl font-bold mb-2 text-blue-700">404</h1>
        <p className="text-lg text-gray-700 mb-4">
          Oeps! Deze pagina bestaat niet.<br />
        </p>




        {/* Action buttons */}
        <div className="flex gap-3 justify-center mb-6">
          <a
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Terug
          </a>
        </div>

        {/* Contact and social section */}
        <div className="border-t pt-6">
          <p className="text-sm text-gray-600 mb-4">
            Kan je niet vinden wat je zoekt? Neem contact met ons op.
          </p>
          <a 
            href="mailto:info@stockflow.be" 
            className="text-blue-600 hover:underline text-sm"
          >
            info@stockflow.be
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Foutmelding: Pagina niet gevonden ({location.pathname})
        </p>
      </div>
    </div>
  );
};

export default NotFound;
