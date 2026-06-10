import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';

const canonicalPath = '/nl/beste-voorraadbeheer-software';

const faqData = [
  {
    question: 'Wat is voorraadbeheer software?',
    answer:
      'Voorraadbeheer software is een digitaal systeem dat u helpt om de hoeveelheid, locatie en waarde van uw voorraad bij te houden. Het vervangt handmatige spreadsheets door real-time inzicht in voorraadniveaus, automatische herbestelwaarschuwingen en geïntegreerde inkoop- en verkoopworkflows.',
  },
  {
    question: 'Wat is de beste gratis voorraadbeheer software in 2026?',
    answer:
      'StockFlow biedt een volledig gratis voorraadbeheer platform zonder tijdslimiet en zonder creditcard. Het omvat onbeperkte producten, barcode scanning, stuklijstbeheer (BOM), meerdere locaties en rapportages — functies die bij veel andere aanbieders pas betaald beschikbaar zijn.',
  },
  {
    question: 'Wanneer heb ik betaalde voorraadbeheer software nodig?',
    answer:
      'Gratis software volstaat voor de meeste kleine en middelgrote bedrijven. Betaald wordt relevant als u geavanceerde EDI-koppelingen, diepgaande ERP-integraties (SAP, NetSuite), of dedicated SLA-ondersteuning nodig heeft.',
  },
  {
    question: 'Kan voorraadbeheer software ook stuklijsten (BOM) beheren?',
    answer:
      'Ja, StockFlow combineert voorraadvolging met multi-level stuklijstbeheer. Wanneer u een productieorder uitvoert, worden componentvoorraden automatisch verminderd en de voorraad afgewerkte producten verhoogd.',
  },
  {
    question: 'Hoe migreer ik van een spreadsheet naar voorraadbeheer software?',
    answer:
      'Exporteer uw huidige productlijst als CSV met kolommen voor SKU, naam, eenheid, huidige voorraad en kostprijs. Importeer dit bestand in StockFlow, stel uw locaties en herbestelpunten in, en u bent operationeel. De meeste teams zijn binnen één werkdag volledig overgezet.',
  },
];

const vergelijkingRijen = [
  ['StockFlow', 'Gratis (permanent)', 'Onbeperkte producten, BOM, barcode, multi-locatie, rapportages', 'Minder geschikt voor complexe ERP-integraties'],
  ['Zoho Inventory', 'Gratis (beperkt)', 'E-commerce integraties, basisfuncties', 'Gratis tier beperkt tot 50 orders/maand'],
  ['Odoo Community', 'Gratis (zelf-gehost)', 'Modulair, breed inzetbaar', 'Hoge implementatie- en onderhoudsinspanning'],
  ['inFlow', 'Betaald (proefperiode)', 'Sterke productiedepth', 'Geen zinvolle gratis tier'],
  ['Excel / Google Sheets', 'Gratis', 'Flexibel en vertrouwd', 'Geen real-time sync, geen audit trail, foutgevoelig'],
];

export default function BesteVoorraadbeheerSoftwarePage() {
  return (
    <SeoPageLayout
      title="Beste Voorraadbeheer Software (2026 Gids)"
      seoTitle="Beste Voorraadbeheer Software 2026 | StockFlow"
      seoDescription="Beste voorraadbeheer software 2026 voor België en Nederland. Vergelijk gratis en betaalde tools. StockFlow is volledig gratis — geen creditcard vereist."
      heroTitle="Voorraadbeheer Software: De Complete Gids voor 2026"
      dateUpdated="05/06/2026"
      pageLanguage="nl"
      faqData={faqData}
    >
      {/* Intro */}
      <section className="py-10 space-y-4">
        <p className="text-slate-700 leading-7">
          De meeste kleine bedrijven beginnen met een spreadsheet voor voorraadbeheer. Dat werkt totdat het niet meer werkt:
          een product raakt uitverkocht terwijl de sheet zegt dat er nog 30 stuks zijn, of twee medewerkers werken
          tegelijkertijd in hetzelfde bestand en overschrijven elkaars wijzigingen. Voorraadbeheer software lost dit op.
        </p>
        <p className="text-slate-700 leading-7">
          Deze gids vergelijkt de beste opties voor 2026 — van volledig gratis tot betaald — en helpt u bepalen welke tool
          past bij uw bedrijfsgrootte, branche en budget.
        </p>
      </section>

      {/* Wat is voorraadbeheer software */}
      <section className="py-8 space-y-4">
        <h2 className="text-2xl font-bold">Wat is Voorraadbeheer Software?</h2>
        <p className="text-slate-700 leading-7">
          Voorraadbeheer software (ook wel voorraadsoftware of stockbeheer software genoemd) is een digitaal systeem
          waarmee u bijhoudt hoeveel van elk product u in voorraad heeft, waar het opgeslagen is, wat het waard is, en
          wanneer u moet nabestellen. Het vervangt handmatige tellijsten en spreadsheets door:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 leading-7 ml-2">
          <li>Real-time voorraadniveaus die automatisch worden bijgewerkt bij elke verkoop, ontvangst of productie</li>
          <li>Barcode- en QR-scannen om handmatige invoerfouten te elimineren</li>
          <li>Automatische lage-voorraadwaarschuwingen zodat u nooit onverwacht tekort komt</li>
          <li>Inkoop- en verkooporderworkflows die uw voorraadbewegingen documenteren</li>
          <li>Rapportages over omloopsnelheid, waardering en bestelbehoefte</li>
        </ul>
      </section>

      {/* Waarom spreadsheets falen */}
      <section className="py-8 space-y-4">
        <h2 className="text-2xl font-bold">Waarom Spreadsheets Tekortschieten</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['Geen real-time synchronisatie', 'Meerdere teamleden kunnen niet tegelijkertijd betrouwbaar werken in dezelfde sheet. Voorraadstanden lopen snel uit de pas met de werkelijkheid.'],
            ['Geen audit trail', 'Bij een voorraadverschil kunt u in een spreadsheet niet zien wie wat wanneer heeft gewijzigd. Dat maakt het onmogelijk om de oorzaak te achterhalen.'],
            ['Foutgevoelige formules', 'Een fout in één cel kan zich verspreiden door de hele sheet. Complexe VLOOKUPs en formules breken bij het toevoegen van nieuwe rijen.'],
            ['Geen barcode-integratie', 'Handmatige invoer bij ontvangst of verzending kost tijd en introduceert fouten die direct leiden tot verkeerde voorraadcijfers.'],
          ].map(([titel, tekst]) => (
            <div key={titel} className="rounded-xl border p-5 bg-slate-50">
              <h3 className="font-semibold mb-2">{titel}</h3>
              <p className="text-sm text-slate-600 leading-6">{tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vergelijkingstabel */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-4">Vergelijking Voorraadbeheer Software 2026</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-left">Platform</th>
                <th className="p-3 text-left">Prijs</th>
                <th className="p-3 text-left">Sterke punten</th>
                <th className="p-3 text-left">Beperkingen</th>
              </tr>
            </thead>
            <tbody>
              {vergelijkingRijen.map((rij) => (
                <tr key={rij[0]} className="border-t align-top">
                  <td className="p-3 font-semibold">{rij[0]}</td>
                  <td className="p-3">{rij[1]}</td>
                  <td className="p-3">{rij[2]}</td>
                  <td className="p-3">{rij[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-2">Prijsinformatie gebaseerd op openbare gegevens, juni 2026. Controleer altijd de actuele tarieven bij de aanbieder.</p>
      </section>

      {/* Essentiële functies */}
      <section className="py-8 space-y-4">
        <h2 className="text-2xl font-bold">Essentiële Functies van Voorraadbeheer Software</h2>
        <p className="text-slate-700 leading-7">
          Niet elke tool biedt dezelfde functionaliteit. Controleer vóór de keuze of het systeem voldoet aan deze basisvereisten:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-slate-700 leading-7 ml-2">
          <li>
            <strong>Real-time voorraadvolging</strong> — iedere beweging (ontvangst, verkoop, productie, correctie)
            wordt direct verwerkt en zichtbaar voor alle gebruikers.
          </li>
          <li>
            <strong>Barcode- en QR-scannen</strong> — essentieel om handmatige invoerfouten te elimineren bij
            ontvangst en verzending.
          </li>
          <li>
            <strong>Multi-locatie ondersteuning</strong> — als u voorraad verspreid heeft over meerdere magazijnen
            of filialen, moet de software dit kunnen bijhouden.
          </li>
          <li>
            <strong>Lage-voorraadwaarschuwingen en herbestelpunten</strong> — automatische notificaties wanneer
            een product onder een ingestelde drempelwaarde zakt.
          </li>
          <li>
            <strong>Inkooporderworkflows</strong> — mogelijkheid om inkooporders aan te maken, te sturen naar
            leveranciers en ontvangsten te registreren.
          </li>
          <li>
            <strong>Rapportages en exportmogelijkheden</strong> — omloopsnelheid, waardering per FIFO/gewogen
            gemiddelde, en exportmogelijkheden naar uw boekhoudsoftware.
          </li>
          <li>
            <strong>Geen productlimiet op de gratis tier</strong> — controleer of "gratis" echt onbeperkt is of
            dat u al snel tegen een betaalmuur aanloopt.
          </li>
        </ol>
      </section>

      {/* StockFlow specifiek */}
      <section className="py-8 space-y-4">
        <h2 className="text-2xl font-bold">Wat StockFlow Gratis Aanbiedt</h2>
        <p className="text-slate-700 leading-7">
          StockFlow is een voorraadbeheer platform dat gebouwd is op een gratis-eerst model. Het gratis plan kent geen
          tijdslimiet en geen producten- of gebruikerslimiet. U krijgt:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 leading-7 ml-2">
          <li>Onbeperkte producten en categorieën</li>
          <li>Real-time voorraadvolging over meerdere locaties</li>
          <li>Native barcode- en QR-scanning via de mobiele app</li>
          <li>Stuklijstbeheer (BOM) met automatische voorraadaftrek bij productie</li>
          <li>Inkoop- en verkooporderbeheer</li>
          <li>Lage-voorraadwaarschuwingen per product</li>
          <li>CSV import en export</li>
          <li>Rapportages over voorraadwaarde en omloopsnelheid</li>
        </ul>
        <div className="mt-4">
          <Link
            to="/auth"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start gratis — geen creditcard →
          </Link>
        </div>
      </section>

      {/* Hoe te migreren */}
      <section className="py-8 space-y-4">
        <h2 className="text-2xl font-bold">Van Spreadsheet naar Software: Hoe Pakt U Dat Aan?</h2>
        <p className="text-slate-700 leading-7">
          De overgang is eenvoudiger dan de meeste teams verwachten. Een bewezen aanpak:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-slate-700 leading-7 ml-2">
          <li>
            <strong>Exporteer uw productlijst</strong> als CSV met kolommen: SKU, naam, eenheid (stuks, kg, liter),
            huidige voorraad en inkoopprijs.
          </li>
          <li>
            <strong>Importeer via CSV</strong> in StockFlow. Wijs uw kolommen toe aan de juiste velden. Dit duurt
            meestal minder dan vijf minuten.
          </li>
          <li>
            <strong>Stel locaties en herbestelpunten in</strong> per product. Bepaal bij welk aantal u een
            waarschuwing wilt ontvangen.
          </li>
          <li>
            <strong>Voer een eerste voorraadtelling in</strong> als de huidige niveaus in uw sheet niet betrouwbaar
            zijn. StockFlow ondersteunt inventarisatiemodules voor een fysieke telling.
          </li>
          <li>
            <strong>Activeer barcode-scanning</strong> zodat alle toekomstige ontvangsten en verzendingen
            automatisch worden verwerkt.
          </li>
        </ol>
      </section>

      {/* Gerelateerde pagina's */}
      <section className="py-8 space-y-3">
        <h2 className="text-2xl font-bold mb-2">Gerelateerde Pagina's</h2>
        <ul className="space-y-2 text-slate-700">
          <li>
            <Link to="/nl/gratis-stuklijst-software" className="text-blue-600 underline">
              Gratis stuklijst beheer software (BOM)
            </Link>{' '}
            — als u productie beheert en stuklijsten nodig heeft.
          </li>
          <li>
            <Link to="/nl/beste-gratis-voorraad-software-met-barcode-scannen" className="text-blue-600 underline">
              Gratis voorraadsoftware met barcode scannen
            </Link>{' '}
            — als barcode-scanning uw primaire vereiste is.
          </li>
          <li>
            <Link to="/best-inventory-management-software" className="text-blue-600 underline">
              Best inventory management software (English)
            </Link>
          </li>
        </ul>
      </section>

      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'StockFlow — Gratis Voorraadbeheer Software',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web, iOS, Android',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
            url: `https://www.stockflowsystems.com${canonicalPath}`,
            description:
              'Gratis voorraadbeheer software met onbeperkte producten, barcode scanning, stuklijstbeheer en multi-locatie support. Geen creditcard vereist.',
            inLanguage: 'nl-BE',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqData.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />
    </SeoPageLayout>
  );
}
