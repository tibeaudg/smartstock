import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SuggestionInput } from "@/components/SuggestionInput";
import SEO from '../components/SEO';

const SUGGESTIES = [
  { label: "Home", path: "/" },
  { label: "Voorraadbeheer tips", path: "/voorraadbeheer-tips" },
  { label: "Magazijnbeheer tips", path: "/magazijnbeheer-tips" },
  { label: "Software vergelijken", path: "/voorraadbeheer-software-vergelijken" },
  { label: "Voorraadbeheer webshop", path: "/voorraadbeheer-webshop" },
  { label: "Fouten voorkomen", path: "/voorraadbeheer-fouten-voorkomen" },
  { label: "Automatiseren", path: "/voorraadbeheer-automatiseren" },
  { label: "Inventarisatie tips", path: "/inventarisatie-tips" },
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
          Misschien zocht je één van deze pagina's?
        </p>
        
        {/* Helpful search section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Vind wat je zoekt</h2>
          <SuggestionInput
            value={zoek}
            onChange={setZoek}
            suggestions={SUGGESTIES.map(s => s.label)}
            placeholder="Zoek een pagina..."
            label="Zoeken"
          />
        </div>

        {/* Popular pages section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Populaire pagina's</h3>
          <div className="space-y-2">
            {(zoek ? filtered : SUGGESTIES).slice(0, 6).map(s => (
              <div key={s.path}>
                <a
                  href={s.path}
                  className="text-blue-600 hover:underline text-base block py-1 hover:bg-blue-50 rounded px-2"
                >
                  {s.label}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center mb-6">
          <a
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Terug naar Home
          </a>
          <button
            onClick={() => navigate(-1)}
            className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Vorige pagina
          </button>
        </div>

        {/* Contact and social section */}
        <div className="border-t pt-6">
          <p className="text-sm text-gray-600 mb-4">
            Kan je niet vinden wat je zoekt? Neem contact met ons op.
          </p>
          <div className="flex justify-center gap-4 mb-4">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-2xl hover:scale-110 transition-transform"
              >
                <span role="img" aria-label={s.label}>{s.icon}</span>
              </a>
            ))}
          </div>
          <a 
            href="mailto:support@stockflow.app" 
            className="text-blue-600 hover:underline text-sm"
          >
            support@stockflow.app
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
