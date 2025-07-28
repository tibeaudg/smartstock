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
  { label: "LinkedIn", url: "https://www.linkedin.com/", icon: "🔗" },
  { label: "Facebook", url: "https://www.facebook.com/", icon: "📘" },
  { label: "Twitter", url: "https://twitter.com/", icon: "🐦" },
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

  // Suggesties filteren op zoekterm
  const filtered = SUGGESTIES.filter(s =>
    s.label.toLowerCase().includes(zoek.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-lg w-full bg-white p-8 rounded shadow">
        <SEO
          title="Pagina niet gevonden (404) | stockflow"
          description="Deze pagina bestaat niet. Vind hier snel de juiste voorraadbeheer informatie, tips en oplossingen voor KMO's."
          keywords="404, pagina niet gevonden, voorraadbeheer, stockbeheer, tips, KMO"
          url={`https://www.stockflow.be${location.pathname}`}
        />
        <h1 className="text-5xl font-bold mb-2 text-blue-700">404</h1>
        <p className="text-lg text-gray-700 mb-4">
          Oeps! Deze pagina bestaat niet.<br />
          Misschien zocht je één van deze pagina's?
        </p>
        <div className="mb-4">
          <SuggestionInput
            value={zoek}
            onChange={setZoek}
            suggestions={SUGGESTIES.map(s => s.label)}
            placeholder="Zoek een pagina..."
            label="Zoeken"
          />
        </div>
        <div className="mb-4 space-y-1">
          {(zoek ? filtered : SUGGESTIES).slice(0, 6).map(s => (
            <div key={s.path}>
              <a
                href={s.path}
                className="text-blue-600 hover:underline text-base"
              >
                {s.label}
              </a>
            </div>
          ))}
        </div>
        <a
          href="/"
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Terug naar Home
        </a>
        <div className="mt-6 flex justify-center gap-4">
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
        <p className="mt-6 text-xs text-gray-400">Foutmelding: Pagina niet gevonden ({location.pathname})</p>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Pagina niet gevonden (404)",
          "description": "Deze pagina bestaat niet. Vind hier snel de juiste voorraadbeheer informatie, tips en oplossingen voor KMO's.",
          "url": "https://www.stockflow.be${location.pathname}"
        }`}} />
      </div>
    </div>
  );
};

export default NotFound;
