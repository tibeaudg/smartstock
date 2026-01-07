import { useLocation, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";

const topicTitle = "Voorraadbeheer in de Horeca: Stocken zonder verspilling";
const canonicalPath = "/voorraadbeheer-horeca";

const metaDescription =
  "Voorraadbeheer in de horeca uitgelegd. Leer correct stocken in de horeca, verspilling verminderen, marges verbeteren en controle krijgen over je voorraad met praktische tips en software.";

const keywords =
  "stocken horeca, voorraadbeheer horeca, horeca voorraad tellen, horeca stockbeheer, inventaris horeca, horeca kostenbeheersing, foodcost horeca, drankvoorraad horeca, voorraadbeheer restaurant, horeca software voorraad";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Voorraadbeheer in de Horeca: Stocken zonder verspilling",
    description:
      "Praktische gids over stocken in de horeca. Leer hoe correct voorraadbeheer helpt om verspilling te beperken en marges te verhogen.",
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
    dateModified: "2026-01-07",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.stockflowsystems.com${canonicalPath}`,
    },
  },
];

export default function VoorraadbeheerHorecaPage() {
  usePageRefresh();
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
      updatedDate="2026-01-07"
    >
      <SEO
        title="Voorraadbeheer Horeca & Stocken | Praktische Gids voor Horeca-uitbaters"
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

            <h2 id="telronde" className="mt-16 text-2xl font-bold text-gray-900">Stap-voor-stap: een telronde uitvoeren</h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Begin buiten de service, werk met één verantwoordelijke en gebruik een duidelijke
              volgorde. Noteer aantallen direct in je systeem of op een voorgedrukt formulier.
              Kleine teams hebben baat bij een vast protocol: wie telt wat en wie verwerkt de
              resultaten.
            </p>

            <h2 id="software" className="mt-16 text-2xl font-bold text-gray-900">Software en integratie</h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Digitale tools zoals <Link to="/auth" className="text-blue-600 underline">StockFlow</Link> maken
              stocken sneller, minder foutgevoelig en automatisch gekoppeld aan je verkoopdata.
              Zoek naar software die deze integraties ondersteunt:
            </p>

            <ul className="mt-4 list-disc pl-6 text-gray-700">
              <li>POS-integratie voor realtime verbruik</li>
              <li>Automatische correcties voor leveringen en inkoopfacturen</li>
              <li>Receptbeheer om verbruik te vertalen naar ingrediënten</li>
              <li>Mobiele tellingen met auditable logs</li>
            </ul>

            <hr className="my-12 border-gray-200" />

            <h2 id="telronde" className="mt-16 text-2xl font-bold text-gray-900">Stap-voor-stap: een telronde uitvoeren</h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Meet wat telt: met deze KPI's zie je snel of je voorraadbeheer werkt.
            </p>

            <ul className="mt-4 list-disc pl-6 text-gray-700">
              <li><strong>Foodcost %</strong>: totale kosten ingrediënten / omzet</li>
              <li><strong>Shrinkage</strong>: verlies door bederf, diefstal of fouten</li>
              <li><strong>Inventory turnover</strong>: hoe snel voorraad wordt omgezet</li>
              <li><strong>Days on hand</strong>: hoeveel dagen voorraad meegaat bij huidig verbruik</li>
            </ul>

            <h2 className="mt-16 text-2xl font-bold text-gray-900">
              Hoe moet ik de voorraad in de horeca tellen?
            </h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Voorraad tellen in de horeca gebeurt idealiter buiten de service.
              Begin steeds met dezelfde volgorde en gebruik vaste eenheden
              (stuks, kilo’s, liter).
            </p>

            <ul className="mt-4 list-disc pl-6 text-gray-700">
              <li>Tel per opslagruimte (koelcel, bar, droge opslag)</li>
              <li>Gebruik vaste meeteenheden per product</li>
              <li>Noteer breuk, verspilling en afwijkingen</li>
              <li>Vergelijk verbruik met verkoopcijfers</li>
            </ul>

            <h2 className="mt-16 text-2xl font-bold text-gray-900">
              Hoeveel winstmarge is normaal in de horeca?
            </h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Een gezonde brutomarge in de horeca ligt gemiddeld tussen:
            </p>

            <ul className="mt-4 list-disc pl-6 text-gray-700">
              <li>Dranken: 70–80%</li>
              <li>Gerechten: 60–70%</li>
              <li>Foodcost doelstelling: 25–35%</li>
            </ul>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Slecht voorraadbeheer en onnauwkeurig stocken zijn één van de
              grootste oorzaken van margedaling.
            </p>

            <h2 className="mt-16 text-2xl font-bold text-gray-900">
              Wat zijn de 6 P's horeca?
            </h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              De 6 P’s vormen een klassiek kader binnen de horeca:
            </p>

            <ul className="mt-4 list-disc pl-6 text-gray-700">
              <li>Product</li>
              <li>Prijs</li>
              <li>Plaats</li>
              <li>Promotie</li>
              <li>Personeel</li>
              <li>Proces</li>
            </ul>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Voorraadbeheer en stocken vallen rechtstreeks onder <strong>Proces</strong>
              en hebben invloed op alle andere P’s.
            </p>
          </div>

          


          

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="font-semibold">Waarom correct stocken?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Minder verspilling, lagere kosten, beter inzicht en rust in je
                operatie.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="font-semibold">Veelgemaakte fouten</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc pl-4">
                <li>Inschatten i.p.v. tellen</li>
                <li>Onregelmatig stocken</li>
                <li>Geen analyse van afwijkingen</li>
              </ul>
            </div>
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="font-semibold">Snel overzicht</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc pl-4">
                <li>Plan: vaste dagen en verantwoordelijken</li>
                <li>Meet: foodcost &amp; shrinkage</li>
                <li>Act: bijsturen en bestelvoorwaarden aanpassen</li>
              </ul>
            </div>

            
          </aside>
        </div>
      </section>

      {/* FAQ & CTA */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900">Veelgestelde vragen</h2>

          <div className="mt-6 space-y-6 text-gray-700">
            <div>
              <h3 className="font-semibold">Hoe vaak moet ik tellen?</h3>
              <p className="mt-2 text-sm">Kleine of snelverbruikende items: dagelijks. De rest: wekelijks of maandelijks afhankelijk van omloopsnelheid.</p>
            </div>

            <div>
              <h3 className="font-semibold">Kan ik zonder software?</h3>
              <p className="mt-2 text-sm">Ja, maar manuele processen vergen meer tijd en zijn foutgevoeliger. Software automatiseert koppelingen en analyses.</p>
            </div>

            <div>
              <h3 className="font-semibold">Welke KPI's zijn het belangrijkst?</h3>
              <p className="mt-2 text-sm">Foodcost %, shrinkage, inventory turnover en days on hand geven snel inzicht in effectiviteit.</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border p-6 bg-gray-50">
            <h3 className="font-semibold">Overname checklist</h3>
            <p className="mt-2 text-sm text-gray-700">Bij aankoop van een zaak: controleer voorraadlijsten, rotatie, en vraag om historische tellingen. Verouderde of onbekende voorraad zijn verborgen kostenposten.</p>
          </div>

          <div className="mt-8 rounded-xl border p-6 bg-gray-50">
            <h3 className="font-semibold">Klaar om te verbeteren?</h3>
            <p className="mt-2 text-sm text-gray-700">Probeer <Link to="/auth" className="text-blue-600 underline">StockFlow</Link> voor geautomatiseerd stocken of <Link to="/contact" className="text-blue-600 underline">neem contact</Link> op voor advies op maat.</p>
          </div>
        </div>
      </section>
    </SeoPageLayout>
  );
}
