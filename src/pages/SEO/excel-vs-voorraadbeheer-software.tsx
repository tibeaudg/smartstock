import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, X, TrendingUp, AlertTriangle, Users, Smartphone, Clock, DollarSign, Zap } from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function ExcelVsVoorraadbeheerSoftware() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wanneer is Excel voldoende voor voorraadbeheer?",
      answer: "Excel werkt prima voor heel kleine bedrijven met minder dan 50 producten, één locatie, geen multi-user toegang nodig en beperkte voorraad bewegingen. Het is een goede start voor starters."
    },
    {
      question: "Wat zijn de grootste nadelen van Excel voor voorraadbeheer?",
      answer: "De grootste nadelen zijn: geen real-time updates, hoog risico op fouten, niet geschikt voor meerdere gebruikers tegelijk, geen automatische waarschuwingen, en het schaalt niet mee bij groei."
    },
    {
      question: "Hoe moeilijk is de overstap van Excel naar software?",
      answer: "De overstap is verrassend eenvoudig. Je kunt je Excel bestand importeren in voorraadbeheer software, waarna alles automatisch wordt overgenomen. De meeste bedrijven zijn binnen 1-2 dagen volledig operationeel."
    },
    {
      question: "Zijn mijn Excel gegevens veilig na de overstap?",
      answer: "Ja, je Excel gegevens blijven behouden als backup. Goede voorraadbeheer software biedt zelfs betere beveiliging met automatische backups, encryptie en gebruikersrechten beheer."
    },
    {
      question: "Wat kost voorraadbeheer software vergeleken met Excel?",
      answer: "Excel lijkt gratis, maar kost je veel tijd (en dus geld). Voorraadbeheer software start vanaf €0 (gratis versies) tot €29-49/maand. De tijdsbesparing van 10+ uur per week verdient dit snel terug."
    }
  ];

  const comparison = [
    {
      feature: "Real-time Updates",
      excel: "Handmatig bijwerken",
      software: "Automatisch & direct",
      excelIcon: X,
      softwareIcon: Check
    },
    {
      feature: "Multi-user Toegang",
      excel: "Beperkt, conflicten",
      software: "Onbeperkt, veilig",
      excelIcon: X,
      softwareIcon: Check
    },
    {
      feature: "Automatische Waarschuwingen",
      excel: "Niet mogelijk",
      software: "Lage voorraad alerts",
      excelIcon: X,
      softwareIcon: Check
    },
    {
      feature: "Mobiele Toegang",
      excel: "Moeilijk/onhandig",
      software: "Native apps",
      excelIcon: X,
      softwareIcon: Check
    },
    {
      feature: "Barcode Scanning",
      excel: "Niet mogelijk",
      software: "Ingebouwd",
      excelIcon: X,
      softwareIcon: Check
    },
    {
      feature: "Integraties",
      excel: "Zeer beperkt",
      software: "Webshops, boekhouding, etc.",
      excelIcon: X,
      softwareIcon: Check
    },
    {
      feature: "Foutmarge",
      excel: "Hoog (5-15%)",
      software: "Zeer laag (<1%)",
      excelIcon: X,
      softwareIcon: Check
    },
    {
      feature: "Rapportages",
      excel: "Handmatig maken",
      software: "Automatisch gegenereerd",
      excelIcon: AlertTriangle,
      softwareIcon: Check
    },
    {
      feature: "Kosten",
      excel: "€0 licentie",
      software: "€0-49/maand",
      excelIcon: Check,
      softwareIcon: AlertTriangle
    },
    {
      feature: "Leercurve",
      excel: "Iedereen kent het",
      software: "1-2 dagen training",
      excelIcon: Check,
      softwareIcon: AlertTriangle
    }
  ];

  const switchSignals = [
    {
      icon: TrendingUp,
      signal: "Je voorraad groeit boven 50 producten",
      description: "Excel wordt onoverzichtelijk en traag met veel producten",
      color: "blue"
    },
    {
      icon: Users,
      signal: "Meerdere mensen moeten toegang hebben",
      description: "Excel is niet gebouwd voor samenwerken - dit leidt tot conflicten en verloren data",
      color: "green"
    },
    {
      icon: AlertTriangle,
      signal: "Je maakt regelmatig fouten",
      description: "Handmatige invoer in Excel leidt tot 5-15% foutmarge. Dit kost je geld.",
      color: "red"
    },
    {
      icon: Clock,
      signal: "Je besteedt 5+ uur per week aan voorraad administratie",
      description: "Automatisering bespaart 70% van deze tijd - dat is 15+ uur per maand",
      color: "orange"
    },
    {
      icon: Smartphone,
      signal: "Je wilt voorraad op locatie kunnen bijwerken",
      description: "Met Excel op je telefoon werken is onpraktisch. Software heeft mobiele apps.",
      color: "purple"
    },
    {
      icon: Zap,
      signal: "Je hebt integraties nodig",
      description: "Wil je koppelen met je webshop of boekhoudpakket? Excel kan dit niet.",
      color: "indigo"
    }
  ];

  return (
    <SeoPageLayout title="Excel vs Voorraadbeheer Software">
      <SEO
        title="Excel vs Voorraadbeheer Software — Welke Past Bij Jou? | Vergelijking | stockflow"
        description="Uitgebreide vergelijking tussen Excel en voorraadbeheer software. Ontdek wanneer Excel werkt, wanneer je moet overstappen en hoe je de transitie maakt."
        keywords="excel vs voorraadbeheer software, excel voorraadbeheer, voorraadbeheer excel, overstappen van excel, excel alternatieven, voorraadbeheer software vergelijking"
        url="https://www.stockflow.be/excel-vs-voorraadbeheer-software"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-green-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Complete Vergelijking
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Excel vs <span className="text-yellow-300">Voorraadbeheer Software</span> — Welke Past Bij Jou?
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Excel is vertrouwd en gratis, maar is het voldoende voor jouw voorraad? 
                Ontdek wanneer Excel werkt, wanneer je moet overstappen en hoe je de transitie maakt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/auth"
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition text-center"
                >
                  Probeer Software Gratis
                </Link>
                <Link
                  to="/demo"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-600 transition text-center"
                >
                  Bekijk Vergelijking
                </Link>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Snel Overzicht</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="font-semibold mb-2">📊 Excel is goed voor:</div>
                  <p className="text-green-100 text-sm">Starters, &lt;50 producten, 1 gebruiker, simpele voorraad</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="font-semibold mb-2">🚀 Software is beter bij:</div>
                  <p className="text-green-100 text-sm">Groei, meerdere users, automatisering, integraties</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="font-semibold mb-2">⚡ Overstap duurt:</div>
                  <p className="text-green-100 text-sm">1-2 dagen met Excel import functie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When Excel Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wanneer <span className="text-green-600">Excel</span> Voldoende Is
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Excel is niet altijd slecht voor voorraadbeheer. In sommige situaties is het perfect geschikt.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl mb-12">
            <h3 className="text-2xl font-bold mb-6">Excel werkt prima als:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-3">
                  <Check className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Je net begint</div>
                    <p className="text-sm text-gray-600">
                      Als startup of kleine ondernemer is Excel een goede eerste stap zonder initiële kosten.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-3">
                  <Check className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Kleine voorraad (&lt;50 producten)</div>
                    <p className="text-sm text-gray-600">
                      Bij een beperkt assortiment blijft Excel overzichtelijk en werkbaar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-3">
                  <Check className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Alleen jij gebruikt het</div>
                    <p className="text-sm text-gray-600">
                      Als je de enige bent die voorraad beheert, zijn de multi-user problemen van Excel geen issue.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-3">
                  <Check className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Weinig voorraad mutaties</div>
                    <p className="text-sm text-gray-600">
                      Als je maar een paar keer per week inkoop of verkoop doet, is handmatig bijwerken nog haalbaar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-3">
                  <Check className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Eén locatie</div>
                    <p className="text-sm text-gray-600">
                      Als al je voorraad op één plek ligt, is Excel tracking nog te overzien.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-3">
                  <Check className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Geen integraties nodig</div>
                    <p className="text-sm text-gray-600">
                      Als je geen webshop of boekhoudsoftware hebt die automatisch moet synchroniseren.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <p className="text-gray-700">
              <strong>💡 Pro tip:</strong> Zelfs als Excel nu voldoet, denk aan de toekomst. 
              Als je groeiplannen hebt, is het slim om vroeg over te stappen naar <Link to="/voorraadbeheer-software" className="text-blue-600 font-semibold hover:underline">professionele software</Link>.
              Hoe langer je wacht, hoe moeilijker de transitie.
            </p>
          </div>
        </div>
      </section>

      {/* Excel Limitations */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              De <span className="text-red-600">Beperkingen</span> van Excel voor Voorraadbeheer
            </h2>
            <p className="text-lg text-gray-600">
              Waarom Excel niet schaalt en wat de risico's zijn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hoge Foutmarge</h3>
              <p className="text-gray-600 mb-3">
                Handmatige invoer in Excel leidt tot 5-15% fouten. Typfouten, vergeten updates, formule errors - ze gebeuren constant.
              </p>
              <div className="text-sm text-red-600 font-semibold">Impact: Stockouts & teveel voorraad</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enorm Tijdrovend</h3>
              <p className="text-gray-600 mb-3">
                Gemiddeld besteden bedrijven 10-15 uur per week aan handmatig Excel werk dat geautomatiseerd kan worden.
              </p>
              <div className="text-sm text-orange-600 font-semibold">Impact: Verspilde arbeidskosten</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-user Problemen</h3>
              <p className="text-gray-600 mb-3">
                Meerdere mensen tegelijk in hetzelfde Excel bestand? Dat leidt tot conflicten, overschreven data en frustratie.
              </p>
              <div className="text-sm text-purple-600 font-semibold">Impact: Data verlies & miscommunicatie</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Geen Mobiele Toegang</h3>
              <p className="text-gray-600 mb-3">
                In het magazijn of bij een klant? Excel op je telefoen is onpraktisch en foutgevoelig. Geen barcode scanning.
              </p>
              <div className="text-sm text-blue-600 font-semibold">Impact: Inefficiënte processen</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Geen Automatisering</h3>
              <p className="text-gray-600 mb-3">
                Excel kan geen automatische waarschuwingen sturen, geen voorraad synchroniseren met je webshop, geen smart reorder points.
              </p>
              <div className="text-sm text-green-600 font-semibold">Impact: Gemiste sales & overstocks</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Schaalt Niet Mee</h3>
              <p className="text-gray-600 mb-3">
                Bij 200+ producten, meerdere locaties of hoge volumes wordt Excel extreem traag en onoverzichtelijk.
              </p>
              <div className="text-sm text-red-600 font-semibold">Impact: Groei wordt belemmerd</div>
            </div>
          </div>

          <div className="mt-12 bg-red-50 border-l-4 border-red-600 p-6 rounded">
            <h4 className="font-bold text-lg mb-2">💸 De Echte Kosten van Excel</h4>
            <p className="text-gray-700">
              Excel lijkt gratis, maar de verborgen kosten zijn enorm: 15 uur/week × €50/uur = <strong>€3.000/maand</strong> aan 
              verspilde tijd. Plus voorraadfouten die gemiddeld <strong>€5.000-10.000/jaar</strong> kosten aan stockouts en overstock.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Excel vs Software: <span className="text-blue-600">Kant-en-Klare Vergelijking</span>
            </h2>
            <p className="text-lg text-gray-600">
              Alle verschillen op een rij
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left font-bold">Functie</th>
                  <th className="px-6 py-4 text-center font-bold">Excel</th>
                  <th className="px-6 py-4 text-center font-bold bg-blue-50">Voorraadbeheer Software</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-semibold">{item.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <item.excelIcon className={`w-5 h-5 ${item.excelIcon === Check ? 'text-green-600' : item.excelIcon === AlertTriangle ? 'text-orange-600' : 'text-red-600'}`} />
                        <span className="text-sm">{item.excel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50/50">
                      <div className="flex items-center justify-center space-x-2">
                        <item.softwareIcon className={`w-5 h-5 ${item.softwareIcon === Check ? 'text-green-600' : item.softwareIcon === AlertTriangle ? 'text-orange-600' : 'text-red-600'}`} />
                        <span className="text-sm font-semibold">{item.software}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/auth"
              className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
            >
              Probeer Software 14 Dagen Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* When to Switch */}
      <section className="py-16 px-4 bg-gradient-to-br from-orange-600 to-red-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              6 Signalen dat Je Moet Overstappen
            </h2>
            <p className="text-xl opacity-90">
              Herken je één van deze situaties? Dan is het tijd voor voorraadbeheer software
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {switchSignals.map((signal, index) => (
              <div key={index} className="bg-white/10 backdrop-blur p-6 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className={`bg-${signal.color}-400/30 p-3 rounded-lg flex-shrink-0`}>
                    <signal.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{signal.signal}</h3>
                    <p className="text-sm opacity-90">{signal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white/20 backdrop-blur p-8 rounded-xl inline-block">
              <h3 className="text-2xl font-bold mb-4">✅ Bereken je Score</h3>
              <p className="mb-4 opacity-90">
                Herken je 3+ van deze signalen? Dan kost Excel je meer dan het oplevert.
              </p>
              <Link
                to="/checklist-voorraadbeheer-software-gereed"
                className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-orange-50 transition"
              >
                Doe de Readiness Check
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Transition Guide */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hoe <span className="text-green-600">Overstappen</span> van Excel naar Software
            </h2>
            <p className="text-lg text-gray-600">
              Makkelijker dan je denkt - in 5 eenvoudige stappen
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Kies de Juiste Software</h3>
                  <p className="text-gray-700 mb-3">
                    Kies software met Excel import functie. <Link to="/voorraadbeheer-kmo" className="text-blue-600 font-semibold hover:underline">Stockflow</Link> importeert 
                    je Excel bestand automatisch en zet alles klaar.
                  </p>
                  <div className="text-sm text-gray-600">⏱️ 30 minuten om te evalueren</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Ruim je Excel Op</h3>
                  <p className="text-gray-700 mb-3">
                    Zorg dat je Excel bestand clean is: consistente kolommen, geen lege rijen, duidelijke headers. 
                    Dit maakt de import soepel.
                  </p>
                  <div className="text-sm text-gray-600">⏱️ 1-2 uur opschonen</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Importeer je Data</h3>
                  <p className="text-gray-700 mb-3">
                    Upload je Excel bestand. De software mapt automatisch de kolommen (productnaam, voorraad, prijs, etc.) 
                    en importeert alles. Controleer daarna of alles correct is overgekomen.
                  </p>
                  <div className="text-sm text-gray-600">⏱️ 15 minuten import + controle</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Stel Integraties In</h3>
                  <p className="text-gray-700 mb-3">
                    Koppel je webshop, boekhouding of andere systemen zodat je voorraad automatisch synchroniseert. 
                    Dit is waar de echte magie gebeurt.
                  </p>
                  <div className="text-sm text-gray-600">⏱️ 30 minuten per integratie</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Train je Team</h3>
                  <p className="text-gray-700 mb-3">
                    Moderne software is intuïtief, maar neem toch even de tijd om je team te trainen. 
                    Video tutorials en support helpen je op weg.
                  </p>
                  <div className="text-sm text-gray-600">⏱️ 2-4 uur teamtraining</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">Totale Transitietijd: 1-2 Dagen</h3>
            <p className="text-lg mb-6 opacity-90">
              De overstap van Excel naar voorraadbeheer software is sneller en makkelijker dan je denkt. 
              Je Excel data blijft behouden als backup.
            </p>
            <Link
              to="/voorraadbeheer-automatiseren-5-stappen"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition"
            >
              Volledige Automatiserings Gids
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klaar om de Overstap te <span className="text-green-600">Maken</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Importeer je Excel bestand en ervaar direct het verschil. 
            Gratis proberen, geen creditcard nodig.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/auth"
              className="bg-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition"
            >
              Start je gratis proefperiode
            </Link>
            <Link
              to="/demo"
              className="border-2 border-green-600 text-green-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition"
            >
              Bekijk Demo
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Excel import inbegrepen
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Setup in 1 dag
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              14 dagen gratis trial
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Veelgestelde Vragen</h2>
            <p className="text-lg text-gray-600">
              Alles wat je moet weten over de overstap
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Gerelateerde Artikelen</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-excel" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition">
                  Voorraadbeheer in Excel
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Tips en templates voor wie nog met Excel werkt.
                </p>
                <div className="text-green-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/wat-is-voorraadbeheer-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition">
                  Wat is Voorraadbeheer Software?
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete uitleg over hoe het werkt en wat het kan.
                </p>
                <div className="text-green-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-kmo" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition">
                  Voorraadbeheer voor KMO's
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Software oplossingen specifiek voor kleine bedrijven.
                </p>
                <div className="text-green-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/logo.png"
            alt="stockflow"
            className="h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Groei van Excel naar professioneel voorraadbeheer. 
            Importeer je data en start direct.
          </p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
              Excel Alternatieven & Voorraadbeheer Software.
            </p>
          </div>
        </div>
      </footer>

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Excel vs Voorraadbeheer Software — Welke Past Bij Jou?",
          "description": "Complete vergelijking tussen Excel en voorraadbeheer software met praktische tips voor de overstap.",
          "author": {
            "@type": "Organization",
            "name": "stockflow"
          },
          "publisher": {
            "@type": "Organization",
            "name": "stockflow",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.stockflow.be/logo.png"
            }
          },
          "datePublished": "2024-01-01",
          "dateModified": "new Date().toISOString().split('T')[0]",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflow.be/excel-vs-voorraadbeheer-software"
          }
        }
      ]} />
    </SeoPageLayout>
  );
}

