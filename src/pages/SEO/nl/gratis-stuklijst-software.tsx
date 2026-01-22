import { useLocation, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { StructuredData } from "@/components/StructuredData";

const topicTitle = "Gratis Stuklijst Beheer Software";
const canonicalPath = "/nl/gratis-stuklijst-software";
const metaDescription = "Stop met spreadsheets. Beheer uw voorraad en BOM gratis. Geen creditcard vereist. Gebouwd voor fabrikanten en kleine bedrijven.";
const keywords = "stuklijst, BOM, gratis stuklijst software, gratis BOM software, stuklijstbeheer, BOM beheer, gratis stuklijstbeheer software, stuklijst software gratis, productie stuklijst, assemblage stuklijst, engineering BOM, BOM beheersysteem, stuklijst template, voorraadbeheer BOM, BOM best practices, stuklijst software, BOM beheer gids, stuklijst voorbeelden, stuklijst types, stuklijst structuur, stuklijst optimalisatie, stuklijst voor productie, stuklijst voor engineering, stuklijst voor inkoop, stuklijst voor voorraad, stuklijst voor kostenschatting, stuklijst voor ERP, stuklijst voor MRP";

const KeyTakeaways = [
  "Een Stuklijst (BOM) is het 'recept' voor productie, met details over elk onderdeel, assemblage en sub-assemblage die nodig zijn om een product te bouwen.",
  "Overstappen van spreadsheets naar een digitaal BOM beheersysteem vermindert handmatige gegevensinvoerfouten met tot 40% en verbetert samenwerking tussen teams.",
  "Effectieve BOM tracking is essentieel voor nauwkeurige kostenschatting, inkoopplanning, voorraadcontrole en naleving van industriestandaarden.",
  "Moderne BOM software integreert met ERP, MRP en PLM systemen, waardoor real-time updates, versiecontrole en geautomatiseerde foutcontrole mogelijk zijn.",
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Gratis Stuklijst Beheer Software - Complete Gids 2026",
    "description": "Ontdek de beste gratis stuklijst beheer software voor fabrikanten. Maak, volg en optimaliseer BOM's met StockFlow's gratis platform. Verminder fouten met 40%, verbeter samenwerking en stroomlijn productieworkflows.",
    "author": {
      "@type": "Organization",
      "name": "StockFlow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflowsystems.com/logo.png"
      }
    },
    "datePublished": "2025-09-05",
    "dateModified": "2026-01-22",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.stockflowsystems.com${canonicalPath}`
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Wat is een Stuklijst (BOM)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Een Stuklijst (BOM) is een uitgebreide lijst van grondstoffen, componenten en instructies die nodig zijn om een product of service te construeren, te fabriceren of te repareren. Het dient als de centrale bron van informatie voor productie, inkoop en voorraadbeheer."
        }
      },
      {
        "@type": "Question",
        "name": "Wat zijn de belangrijkste types BOM's?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "De belangrijkste types zijn Engineering BOM (EBOM), Manufacturing BOM (MBOM), Sales BOM en Service BOM. Elk dient een ander doel in de productlevenscyclus."
        }
      },
      {
        "@type": "Question",
        "name": "Waarom is BOM beheer belangrijk?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Effectief BOM beheer zorgt voor nauwkeurige productie, vermindert verspilling, verbetert kostenschatting en maakt naadloze samenwerking mogelijk tussen engineering, inkoop en productieteams."
        }
      },
      {
        "@type": "Question",
        "name": "Hoe kan BOM software mijn bedrijf helpen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BOM software automatiseert gegevensinvoer, vermindert fouten, biedt real-time updates, integreert met ERP/MRP systemen en biedt versiecontrole, kostenanalyse en visueel BOM beheer."
        }
      },
      {
        "@type": "Question",
        "name": "Is er gratis stuklijst beheer software beschikbaar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, StockFlow biedt volledig gratis stuklijst beheer software zonder creditcard vereist. Ons gratis platform omvat multi-level BOM creatie, versiecontrole, kosten tracking, leveranciersbeheer en integratiemogelijkheden voor onbeperkte producten en gebruikers."
        }
      }
    ]
  }
];

const faqData = [
  {
    question: "Wat is een Stuklijst (BOM)?",
    answer: "Een Stuklijst (BOM) is een uitgebreide lijst van grondstoffen, componenten en instructies die nodig zijn om een product of service te construeren, te fabriceren of te repareren. Het dient als de centrale bron van informatie voor productie, inkoop en voorraadbeheer."
  },
  {
    question: "Wat zijn de belangrijkste types BOM's?",
    answer: "De belangrijkste types zijn Engineering BOM (EBOM), Manufacturing BOM (MBOM), Sales BOM en Service BOM. Elk dient een ander doel in de productlevenscyclus."
  },
  {
    question: "Waarom is BOM beheer belangrijk?",
    answer: "Effectief BOM beheer zorgt voor nauwkeurige productie, vermindert verspilling, verbetert kostenschatting en maakt naadloze samenwerking mogelijk tussen engineering, inkoop en productieteams."
  },
  {
    question: "Hoe kan BOM software mijn bedrijf helpen?",
    answer: "BOM software automatiseert gegevensinvoer, vermindert fouten, biedt real-time updates, integreert met ERP/MRP systemen en biedt versiecontrole, kostenanalyse en visueel BOM beheer."
  },
  {
    question: "Is er gratis stuklijst beheer software beschikbaar?",
    answer: "Ja, StockFlow biedt volledig gratis stuklijst beheer software zonder creditcard vereist. Ons gratis platform omvat multi-level BOM creatie, versiecontrole, kosten tracking, leveranciersbeheer en integratiemogelijkheden voor onbeperkte producten en gebruikers."
  }
];

export default function GratisStuklijstSoftwarePage() {
  const location = useLocation();

  return (
    <SeoPageLayout
      title={topicTitle}
      heroTitle="Gratis Stuklijst Beheer Software"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Gratis Stuklijst Beheer Software - Complete Gids 2026 | StockFlow"
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/bill-of-materials-software-free' },
          { lang: 'nl-BE', url: `https://www.stockflowsystems.com${canonicalPath}` }
        ]}
      />

      <StructuredData data={structuredData} />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Gratis Stuklijst Beheer Software voor Fabrikanten
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Stop met spreadsheets. Beheer uw voorraad en BOM gratis met StockFlow's krachtige stuklijst beheer software. 
            Geen creditcard vereist, volledig gratis voor altijd.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Wat is een Stuklijst (BOM)?</h2>
              <p className="text-gray-700 mb-4">
                Een Stuklijst (BOM) is het 'recept' voor productie, met details over elk onderdeel, assemblage en 
                sub-assemblage die nodig zijn om een product te bouwen. Het dient als de centrale bron van informatie 
                voor productie, inkoop en voorraadbeheer.
              </p>
              <p className="text-gray-700">
                Overstappen van spreadsheets naar een digitaal BOM beheersysteem vermindert handmatige gegevensinvoerfouten 
                met tot 40% en verbetert samenwerking tussen teams.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Waarom StockFlow?</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Volledig gratis voor altijd</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Onbeperkte producten en gebruikers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Multi-level BOM ondersteuning</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Versiecontrole en kostenanalyse</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Integratie met ERP/MRP systemen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Stuklijst Beheer Software
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt stuklijst beheer. Geen creditcard vereist.
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

