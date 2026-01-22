import { useLocation, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { StructuredData } from "@/components/StructuredData";

const topicTitle = "Voorraadbeheer in de Horeca: Stocken zonder verspilling";
const canonicalPath = "/nl/industries/voorraadbeheer-horeca";

const metaDescription =
  "Voorraadbeheer horeca: complete gids voor stockbeheer in restaurants en cafés. Leer correct stocken, verspilling verminderen tot 30%, foodcost verlagen en winstmarges verbeteren met gratis voorraadbeheer software voor horeca.";

const keywords =
  "voorraadbeheer horeca, stocken horeca, horeca voorraad tellen, horeca stockbeheer, inventaris horeca, horeca kostenbeheersing, foodcost horeca, drankvoorraad horeca, voorraadbeheer restaurant, horeca software voorraad, voorraadbeheer software horeca, stockbeheer restaurant, voorraadbeheer café, horeca inventaris software";

const keyTakeaways = [
  "Voorraadbeheer horeca (stocken) is essentieel voor foodcost controle en winstoptimalisatie.",
  "StockFlow biedt gratis voorraadbeheer software horeca specifiek ontwikkeld voor restaurants en cafés.",
  "Systematisch tellen met vaste routines vermindert verspilling met tot 30% en verbetert marges.",
  "De juiste voorraadbeheer software horeca integreert met POS-systemen voor real-time tracking.",
  "KPI's zoals foodcost %, shrinkage en inventory turnover geven snel inzicht in effectiviteit."
];

const faqData: { question: string; answer: string }[] = [
  {
    question: "Hoe doe je voorraadbeheer?",
    answer:
      "Voorraadbeheer voer je uit door het proces van inkopen, opslaan en verkopen nauwgezet te monitoren. Dit omvat het bepalen van bestelniveaus (wanneer koop ik bij?), het tellen van fysieke voorraad en het analyseren van de doorloopsnelheid om zowel tekorten als overschotten te voorkomen.",
  },
  {
    question: "Wat is voorraadbeheer?",
    answer:
      "Voorraadbeheer (inventory management) is de kunst van het balanceren tussen vraag en aanbod. Het is het proces waarbij een bedrijf zorgt dat de juiste hoeveelheid goederen op het juiste moment op de juiste plek aanwezig is, tegen de laagst mogelijke kosten.",
  },
  {
    question: "Wat is een voorraadbeheersysteem?",
    answer:
      "Een voorraadbeheersysteem (vaak software) is een tool die automatisch bijhoudt hoeveel producten er op voorraad zijn, waar ze liggen en wanneer ze aangevuld moeten worden. Het koppelt vaak inkoop, verkoop en magazijnbeheer aan elkaar voor een real-time overzicht.",
  },
  {
    question: "Welke voorraadbeheer software horeca is het beste?",
    answer:
      "De beste voorraadbeheer software horeca biedt POS-integratie, mobiele tellingen, receptbeheer en real-time tracking. StockFlow is specifiek ontwikkeld voor horeca en biedt alle essentiële functies volledig gratis, zonder verborgen kosten of beperkingen.",
  },
  {
    question: "Hoeveel kan ik besparen met voorraadbeheer software horeca?",
    answer:
      "Horecazaken die overstappen op voorraadbeheer software horeca zien gemiddeld 20-30% reductie in verspilling, 5-10% verbetering in foodcost, en 15-25% tijdswinst op administratie. Dit vertaalt zich vaak in €5.000-€15.000 extra winst per jaar voor een gemiddeld restaurant.",
  }
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Voorraadbeheer in de Horeca: Stocken zonder verspilling",
    description:
      "Complete gids voor voorraadbeheer horeca: stockbeheer, voorraadbeheer software horeca, foodcost optimalisatie, en praktische tips voor restaurants en cafés. Leer hoe correct voorraadbeheer verspilling met 30% vermindert en marges verbetert.",
    author: {
      "@type": "Organization",
      name: "StockFlow",
    },
    publisher: {
      "@type": "Organization",
      name: "StockFlow",
      logo: {
        "@type": "ImageObject",
        url: "https://www.stockflowsystems.com/logo.png",
      },
    },
    datePublished: "2026-01-07",
    dateModified: "2026-01-22",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.stockflowsystems.com${canonicalPath}`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
];

export default function VoorraadbeheerHorecaPage() {
  const location = useLocation();

  return (
    <SeoPageLayout
      title={topicTitle}
      heroTitle="Voorraadbeheer in de Horeca"
      heroDescription="Correct stocken in de horeca: minder verspilling, meer controle en hogere marges"
      heroSubtitle="Praktische stappen, meetbare KPI's en softwaretips voor elke horecazaak"
      dateUpdated="2026-01-22"
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="Voorraadbeheer Horeca: Complete Gids voor Stockbeheer & Inventaris | 2026"
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflowsystems.com${canonicalPath}`}
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/restaurant-inventory-management-software' },
          { lang: 'nl-BE', url: `https://www.stockflowsystems.com${canonicalPath}` }
        ]}
      />

      <StructuredData data={structuredData} />

      {/* Intro sectie */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg leading-relaxed text-gray-700">
            Voorraadbeheer in de horeca, vaak simpelweg <strong>"stocken"</strong> genoemd, 
            is een basisvaardigheid die direct invloed heeft op je foodcost, voorraadwaarde
            en operationele rust. Goede routines voorkomen verspilling, verbeteren marge en
            geven je team meer tijd voor gasten in plaats van voor tellingen.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Gratis Voorraadbeheer Software Horeca
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow biedt volledig gratis, onbeperkt voorraadbeheer voor horeca. Geen creditcard vereist.
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

