import { useLocation, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { StructuredData } from "@/components/StructuredData";

const topicTitle = "Voorraadbeheer in de Horeca: Stocken zonder verspilling";
const canonicalPath = "/voorraadbeheer-horeca";

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
    question: "Wat is de 80/20-regel in voorraadbeheer?",
    answer:
      "Ook wel bekend als de Pareto-analyse: het principe dat vaak 80% van de omzet wordt gegenereerd door slechts 20% van het totale aantal producten (de 'hardlopers'). In voorraadbeheer helpt dit om prioriteit te geven aan de belangrijkste artikelen.",
  },


  {
    question: "Hoe vaak moet ik tellen?",
    answer:
      "Kleine of snelverbruikende items: dagelijks. De rest: wekelijks of maandelijks afhankelijk van omloopsnelheid.",
  },
  {
    question: "Kan ik zonder software?",
    answer:
      "Ja, maar manuele processen vergen meer tijd en zijn foutgevoeliger. Software automatiseert koppelingen, vermindert fouten en koppelt tellingen aan verkoopdata.",
  },
  {
    question: "Welke KPI's zijn het belangrijkst?",
    answer:
      "Foodcost %, shrinkage, inventory turnover en days on hand geven snel inzicht in de effectiviteit van je voorraadbeheer.",
  },
  {
    question: "Hoe moet ik de voorraad in de horeca tellen?",
    answer:
      "Tel idealiter buiten de service, begin steeds met dezelfde volgorde, tel per opslagruimte en gebruik vaste eenheden (stuks, kilo's, liter). Noteer breuk en verspilling apart.",
  },
  {
    question: "Wat is een gezonde winstmarge in de horeca?",
    answer:
      "Een gezonde brutomarge verschilt per categorie: dranken 70–80%, gerechten 60–70%. Streef naar een foodcost van ongeveer 25–35%.",
  },
  {
    question: "Wat moet ik controleren bij overname van een zaak?",
    answer:
      "Controleer voorraadlijsten, rotatie en vraag om historische tellingen — verouderde of onbekende voorraad kunnen verborgen kostenposten zijn.",
  },
  {
    question: "Wat zijn de 6 P's in de horeca?",
    answer:
      "Product, Prijs, Plaats, Promotie, Personeel en Proces — voorraadbeheer valt onder Proces en beïnvloedt alle andere P's.",
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
  },
  {
    question: "Is voorraadbeheer software horeca moeilijk te leren?",
    answer:
      "Goede voorraadbeheer software horeca zoals StockFlow is intuïtief ontworpen. De meeste teams zijn binnen 1-2 weken volledig operationeel. Mobiele apps maken tellingen eenvoudig, en automatische integraties elimineren handmatig werk.",
  },
];

export default function VoorraadbeheerHorecaPage() {
  
  const location = useLocation();

  const pageStructuredData = structuredData.map((item) => ({
    ...item,
    dateModified: new Date().toISOString().split("T")[0],
  }));

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
      />

      <StructuredData data={pageStructuredData} />

      {/* Intro sectie */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg leading-relaxed text-gray-700">
            Voorraadbeheer in de horeca  vaak simpelweg <strong>“stocken”</strong> genoemd 
            is een basisvaardigheid die direct invloed heeft op je foodcost, voorraadwaarde
            en operationele rust. Goede routines voorkomen verspilling, verbeteren marge en
            geven je team meer tijd voor gasten in plaats van voor tellingen.
          </p>

          <div className="mt-6 text-left">
            <h4 className="text-sm font-semibold text-gray-900">Direct voordeel van beter stocken</h4>
            <ul className="mt-2 list-disc pl-6 text-gray-700">
              <li>Minder bederf en verspilling  directe kostenbesparing</li>
              <li>Betere inkoop: slimmer bestellen en minder overtollige voorraad</li>
              <li>Betrouwbare marges en betere prijsvorming</li>
              <li>Tijdswinst voor je team en minder fouten tijdens service</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Table of contents for quick navigation */}
      <section className="bg-white px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="In-page navigation">
            <h4 className="text-sm font-semibold text-gray-900">In deze gids</h4>
            <ul className="mt-3 flex flex-wrap gap-3 text-sm">
              <li><a className="text-blue-600 underline" href="#hoe-doe-je-voorraadbeheer">Hoe doe je voorraadbeheer?</a></li>
              <li><a className="text-blue-600 underline" href="#checklist">Checklist</a></li>
              <li><a className="text-blue-600 underline" href="#telronde">Telronde</a></li>
              <li><a className="text-blue-600 underline" href="#software">Software & integratie</a></li>
              <li><a className="text-blue-600 underline" href="#kpis">KPI's</a></li>
              <li><a className="text-blue-600 underline" href="#faq">FAQ</a></li>
            </ul>
          </nav>
        </div>
      </section>

      {/* Hoofdcontent */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 id="hoe-doe-je-voorraadbeheer" className="text-2xl font-bold text-gray-900">
              Hoe doe je voorraadbeheer?
            </h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Voorraadbeheer in de horeca betekent het systematisch tellen,
              registreren en analyseren van alle ingrediënten, dranken en producten
              in je zaak. Het doel is eenvoudig: exact weten wat je hebt, wat je
              verbruikt en wat je opnieuw moet bestellen.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              In de praktijk gaat stocken vaak fout door inschattingen,
              onregelmatige tellingen of het ontbreken van een duidelijk systeem.
              Toch hoeft voorraadbeheer niet complex te zijn.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border p-6">
                <h3 className="font-semibold">Nauwkeurigheid</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Exact tellen, niet gokken. Elke afwijking heeft impact op je
                  foodcost en marge.
                </p>
              </div>

              <div className="rounded-xl border p-6">
                <h3 className="font-semibold">Regelmaat</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Wekelijks of dagelijks stocken is noodzakelijk om controle te
                  behouden.
                </p>
              </div>

              <div className="rounded-xl border p-6">
                <h3 className="font-semibold">Structuur</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Werk met vaste categorieën: keuken, bar, diepvries, droge
                  voeding.
                </p>
              </div>

              <div className="rounded-xl border p-6">
                <h3 className="font-semibold">Software</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Digitale tools zoals{" "}
                  <Link to="/auth" className="text-blue-600 underline">
                    StockFlow
                  </Link>{" "}
                  maken stocken sneller en foutloos.
                </p>
              </div>
            </div>

            <h2 id="checklist" className="mt-16 text-2xl font-bold text-gray-900">
              Praktische checklist: Voorraad tellen in 8 stappen
            </h2>

            <ol className="mt-4 list-decimal pl-6 text-gray-700">
              <li>Plan vaste telmomenten (dagelijks voor snelverbruik, wekelijks voor voorraad).</li>
              <li>Werk per opslagruimte: koelcel, freezer, bar, droge opslag.</li>
              <li>Gebruik vaste eenheden (stuks, kg, liter) en meetinstrumenten.</li>
              <li>Noteer breuk, verspilling en productschade apart.</li>
              <li>Vergelijk getelde voorraad met verkoopdata en recepten (receptkost).</li>
              <li>Corrigeer voor inkoop/leveringen die nog niet geboekt zijn.</li>
              <li>Update bestelniveaus en minimumvoorraden op basis van verbruik.</li>
              <li>Archiveer tellingen en analyseer afwijkingen maandelijks.
              </li>
            </ol>


            <h2 id="software" className="mt-16 text-2xl font-bold text-gray-900">Voorraadbeheer software horeca: wat moet je zoeken?</h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              <strong>Voorraadbeheer software voor horeca</strong> maakt het verschil tussen giswerk en exacte controle. Digitale tools zoals <Link to="/auth" className="text-blue-600 underline">StockFlow</Link> maken
              stocken sneller, minder foutgevoelig en automatisch gekoppeld aan je verkoopdata. De beste <strong>voorraadbeheer software horeca</strong> ondersteunt deze integraties:
            </p>

            <ul className="mt-4 list-disc pl-6 text-gray-700">
              <li><strong>POS-integratie</strong> voor realtime verbruik en automatische voorraadafname</li>
              <li><strong>Automatische correcties</strong> voor leveringen en inkoopfacturen</li>
              <li><strong>Receptbeheer</strong> om verbruik te vertalen naar ingrediënten en foodcost te berekenen</li>
              <li><strong>Mobiele tellingen</strong> met auditable logs voor transparantie</li>
              <li><strong>Multi-locatie support</strong> voor ketens met meerdere vestigingen</li>
              <li><strong>Barcode scanning</strong> voor snelle en foutloze tellingen</li>
            </ul>

            <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Waarom voorraadbeheer software horeca kiezen?</h3>
              <p className="text-gray-700 text-sm">
                <strong>Voorraadbeheer software voor horeca</strong> zoals StockFlow is specifiek ontwikkeld voor restaurants, cafés en hotels. Het begrijpt de unieke uitdagingen van de horeca: bederf, seizoensgebonden vraag, en de noodzaak van real-time inzicht. In tegenstelling tot generieke <Link to="/inventory-management-software" className="text-blue-600 underline">inventory management software</Link>, is <strong>voorraadbeheer software horeca</strong> geoptimaliseerd voor foodcost tracking, receptbeheer en POS-integratie.
              </p>
            </div>

            <hr className="my-12 border-gray-200" />

            <h2 id="telronde" className="mt-16 text-2xl font-bold text-gray-900">Stap-voor-stap: een telronde uitvoeren</h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Een systematische telronde is de basis van goed <strong>stockbeheer restaurant</strong>. Volg deze stappen voor nauwkeurige resultaten:
            </p>

            <ol className="mt-4 list-decimal pl-6 text-gray-700 space-y-2">
              <li><strong>Voorbereiding:</strong> Zorg dat alle leveringen geboekt zijn en je team op de hoogte is</li>
              <li><strong>Start met droge opslag:</strong> Tel eerst niet-bederfelijke producten (blikken, verpakkingen)</li>
              <li><strong>Koelcel en vriezer:</strong> Tel snel om temperatuurschommelingen te voorkomen</li>
              <li><strong>Bar en dranken:</strong> Tel flessen, tapinstallaties en voorraad apart</li>
              <li><strong>Noteer breuken:</strong> Apart registreren van beschadigde of verlopen producten</li>
              <li><strong>Controleer tegen systeem:</strong> Vergelijk getelde voorraad met je <strong>voorraadbeheer software horeca</strong></li>
              <li><strong>Analyseer afwijkingen:</strong> Onderzoek grote verschillen tussen telling en systeem</li>
            </ol>

            <h3 id="kpis" className="mt-12 text-xl font-bold text-gray-900">KPI's voor voorraadbeheer horeca</h3>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Meet wat telt: met deze KPI's zie je snel of je voorraadbeheer werkt.
            </p>

            <ul className="mt-4 list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Foodcost %</strong>: totale kosten ingrediënten / omzet (streefwaarde: 25-35%)</li>
              <li><strong>Shrinkage</strong>: verlies door bederf, diefstal of fouten (streefwaarde: &lt;2%)</li>
              <li><strong>Inventory turnover</strong>: hoe snel voorraad wordt omgezet (streefwaarde: 12-24x per jaar)</li>
              <li><strong>Days on hand</strong>: hoeveel dagen voorraad meegaat bij huidig verbruik (streefwaarde: 7-14 dagen)</li>
              <li><strong>Drankmarge</strong>: brutomarge op dranken (streefwaarde: 70-80%)</li>
            </ul>


   



          </div>

          


          

          {/* Sidebar */}
_
        </div>
      </section>



      <section>
        <div className="max-w-6xl mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        
      </section>

    </SeoPageLayout>
  );
}
