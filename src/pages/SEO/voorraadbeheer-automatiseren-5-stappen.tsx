import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, X, TrendingUp, Package, Database, Link as LinkIcon, Users, AlertTriangle, Clock, Zap, Target, BarChart3, Settings } from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function VoorraadbeheerAutomatiseren5Stappen() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Hoe lang duurt het om voorraadbeheer te automatiseren?",
      answer: "De basis automatisering kun je in 1-2 dagen opzetten (software kiezen, data importeren, basis instellingen). Voor volledige automatisering met integraties en team training plan je 1-2 weken. De meeste bedrijven zijn binnen 2 weken volledig operationeel."
    },
    {
      question: "Moet ik alle stappen in één keer doorlopen?",
      answer: "Nee, je kunt gefaseerd automatiseren. Begin met de basis (stap 1-3) en voeg later integraties en optimalisaties toe (stap 4-5). Veel bedrijven starten simpel en bouwen uit naarmate ze comfortabel zijn."
    },
    {
      question: "Wat kost het om voorraadbeheer te automatiseren?",
      answer: "De software zelf start vanaf €0 (gratis versies) tot €29-49/maand voor professionele plannen. De grootste investering is tijd: verwacht 10-20 uur voor volledige setup en team training. De ROI is meestal binnen 1-3 maanden."
    },
    {
      question: "Kan ik mijn oude systeem behouden als backup?",
      answer: "Ja, het is verstandig om je Excel of oude systeem de eerste 1-2 maanden als backup te behouden. Parallel draaien geeft je vertrouwen. Daarna kun je volledig overschakelen naar de geautomatiseerde oplossing."
    },
    {
      question: "Wat zijn de grootste valkuilen bij automatisering?",
      answer: "De top 3 valkuilen: 1) Te snel willen gaan zonder goede voorbereiding, 2) Team niet meenemen in de verandering, 3) Data niet opschonen voor import. Vermijd deze door gefaseerd te werken en het team te betrekken."
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Kies de Juiste Software",
      icon: Target,
      color: "blue",
      duration: "2-4 uur",
      description: "De basis van succesvolle automatisering begint met de juiste software keuze",
      details: [
        "Evalueer je specifieke behoeften en groeiplannen",
        "Check of de software integreert met je huidige systemen",
        "Test minstens 2-3 opties met gratis trials",
        "Kijk naar gebruiksvriendelijkheid voor je team",
        "Controleer of Excel import mogelijk is"
      ],
      tips: [
        "Kies software die schaalt met je groei",
        "Prioriteer gebruiksvriendelijkheid boven features",
        "Check reviews van vergelijkbare bedrijven"
      ]
    },
    {
      number: 2,
      title: "Importeer en Organiseer je Data",
      icon: Database,
      color: "green",
      duration: "3-6 uur",
      description: "Clean en gestructureerde data is cruciaal voor succesvolle automatisering",
      details: [
        "Schoon je Excel bestand op: verwijder duplicaten en fix inconsistenties",
        "Zorg voor uniforme kolommen en data formaten",
        "Voeg ontbrekende informatie toe (SKU's, minimum voorraad, etc.)",
        "Importeer je producten via Excel upload of CSV",
        "Controleer of alle data correct is overgekomen"
      ],
      tips: [
        "Maak eerst een backup van je originele data",
        "Test met een kleine subset voor je alles importeert",
        "Gebruik templates als je software die biedt"
      ]
    },
    {
      number: 3,
      title: "Stel Automatische Reorder Points In",
      icon: AlertTriangle,
      color: "orange",
      duration: "2-3 uur",
      description: "Automatische waarschuwingen zijn de kern van slim voorraadbeheer",
      details: [
        "Bepaal per product de minimum voorraad niveau's",
        "Stel reorder points in gebaseerd op leadtimes van leveranciers",
        "Configureer automatische meldingen via email of dashboard",
        "Voeg veiligheidsmarges toe voor populaire producten",
        "Test de alerts door voorraad handmatig te verlagen"
      ],
      tips: [
        "Begin conservatief en pas aan op basis van ervaring",
        "Houd seizoenspatronen in gedachten",
        "Stel verschillende levels per productcategorie"
      ]
    },
    {
      number: 4,
      title: "Verbind Integraties",
      icon: LinkIcon,
      color: "purple",
      duration: "1-3 uur per integratie",
      description: "Integraties zorgen voor echte automatisering zonder handmatig werk",
      details: [
        "Koppel je webshop voor automatische voorraad sync",
        "Integreer met je boekhoudsoftware voor financieel overzicht",
        "Verbind je kassasysteem als je retail hebt",
        "Setup leveranciers koppelingen voor direct bestellen",
        "Test elke integratie grondig met test transacties"
      ],
      tips: [
        "Prioriteer de integratie met je belangrijkste kanaal eerst",
        "Documenteer alle API keys en credentials veilig",
        "Monitor de eerste week extra goed"
      ]
    },
    {
      number: 5,
      title: "Train Team en Optimaliseer",
      icon: Users,
      color: "red",
      duration: "2-4 uur + ongoing",
      description: "Succesvolle automatisering vereist een goed getraind team",
      details: [
        "Organiseer hands-on training sessies per rol",
        "Maak duidelijke documentatie en quick reference guides",
        "Wijs een 'super user' aan als eerste aanspreekpunt",
        "Start met parallel draaien (oud + nieuw systeem)",
        "Verzamel feedback en optimaliseer workflows"
      ],
      tips: [
        "Train niet te veel tegelijk - focus op daily tasks eerst",
        "Maak video tutorials voor veelgebruikte acties",
        "Plan follow-up sessies na 1-2 weken"
      ]
    }
  ];

  const timeline = [
    { week: "Week 1", focus: "Setup & Import", tasks: ["Software kiezen", "Account aanmaken", "Data voorbereiden", "Eerste import"], status: "Foundation" },
    { week: "Week 2", focus: "Automatisering", tasks: ["Reorder points instellen", "Alerts configureren", "Integraties starten"], status: "Automation" },
    { week: "Week 3", focus: "Training & Testing", tasks: ["Team trainen", "Parallel draaien", "Workflows testen"], status: "Implementation" },
    { week: "Week 4+", focus: "Optimalisatie", tasks: ["Feedback verwerken", "Processen verfijnen", "Volledig live"], status: "Optimization" }
  ];

  const pitfalls = [
    {
      pitfall: "Te Snel Willen Gaan",
      icon: Clock,
      description: "Direct alles tegelijk willen implementeren zonder goede voorbereiding",
      solution: "Start met de basis en bouw gefaseerd uit. Geef jezelf en je team de tijd om te wennen.",
      color: "red"
    },
    {
      pitfall: "Vuile Data Importeren",
      icon: Database,
      description: "Excel met inconsistenties, duplicaten en ontbrekende info importeren",
      solution: "Neem de tijd om je data op te schonen voor import. Dit voorkomt problemen later.",
      color: "orange"
    },
    {
      pitfall: "Team Niet Meenemen",
      icon: Users,
      description: "Software implementeren zonder het team te betrekken of trainen",
      solution: "Betrek je team vroeg, vraag input en investeer in goede training.",
      color: "blue"
    },
    {
      pitfall: "Te Weinig Testen",
      icon: Settings,
      description: "Direct live gaan zonder grondig te testen of parallel te draaien",
      solution: "Test alle workflows, draai parallel met je oude systeem en controleer alles dubbel.",
      color: "purple"
    }
  ];

  const expectedResults = [
    { metric: "70%", label: "Tijdsbesparing", description: "Minder tijd aan handmatige administratie", icon: Clock, color: "blue" },
    { metric: "90%", label: "Minder Fouten", description: "Elimineer handmatige invoer fouten", icon: Check, color: "green" },
    { metric: "25%", label: "Lagere Kosten", description: "Bespaar op voorraad en operationele kosten", icon: TrendingUp, color: "purple" },
    { metric: "2x", label: "Snellere Processen", description: "Van order tot verzending", icon: Zap, color: "orange" }
  ];

  return (
    <SeoPageLayout title="Voorraadbeheer Automatiseren in 5 Stappen">
      <SEO
        title="Voorraadbeheer Automatiseren in 5 Stappen | Praktische Implementatie Gids | stockflow"
        description="Stap-voor-stap gids om je voorraadbeheer te automatiseren. Van software keuze tot team training - leer hoe je in 5 concrete stappen 70% tijd bespaart."
        keywords="voorraadbeheer automatiseren, voorraad automatisering, voorraadbeheer implementatie, automatisch voorraadbeheer, voorraadbeheer software implementeren"
        url="https://www.stockflow.be/voorraadbeheer-automatiseren-5-stappen"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-indigo-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Complete Implementatie Gids
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Voorraadbeheer <span className="text-yellow-300">Automatiseren</span> in 5 Stappen
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Stop met handmatig voorraad bijhouden. Volg deze 5 concrete stappen om je voorraadbeheer te automatiseren 
                en 70% tijd te besparen binnen 2 weken.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/auth"
                  className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transition text-center"
                >
                  Start met Automatiseren
                </Link>
                <Link
                  to="/demo"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-indigo-600 transition text-center"
                >
                  Bekijk Demo
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Excel import inbegrepen
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Setup in 1-2 dagen
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Gratis te proberen
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Wat Je Gaat Bereiken</h3>
              <div className="space-y-4">
                {expectedResults.map((result, index) => (
                  <div key={index} className="bg-white/10 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <result.icon className={`w-6 h-6 text-${result.color}-300`} />
                        <span className="font-bold text-2xl">{result.metric}</span>
                      </div>
                    </div>
                    <div className="font-semibold">{result.label}</div>
                    <div className="text-sm text-indigo-100">{result.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Automate Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Waarom <span className="text-indigo-600">Automatiseren</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              De voordelen van geautomatiseerd voorraadbeheer zijn enorm
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <X className="w-8 h-8 text-red-600 mr-3" />
                Zonder Automatisering
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>10-15 uur per week aan handmatig werk</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>5-15% foutmarge door handmatige invoer</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Regelmatige stockouts en overstocking</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Geen real-time inzicht in voorraad status</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Frustratie en stress bij het team</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border-2 border-green-600">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Check className="w-8 h-8 text-green-600 mr-3" />
                Met Automatisering
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>70% tijdsbesparing</strong> - focus op groei in plaats van admin</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>99% nauwkeurigheid</strong> - automatische updates zonder fouten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Automatische waarschuwingen</strong> - bestel op tijd, nooit meer tekorten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Real-time dashboard</strong> - altijd actueel overzicht</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Tevreden team</strong> - minder stress, meer efficiency</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">💰 Return on Investment</h3>
            <p className="text-lg mb-6 opacity-90">
              Gemiddeld bespaart automatisering <strong>€2.000-5.000 per maand</strong> door tijdsbesparing, 
              minder fouten en betere voorraad optimalisatie. De meeste bedrijven verdienen hun investering binnen <strong>1-3 maanden</strong> terug.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Steps Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              De <span className="text-indigo-600">5 Stappen</span> naar Geautomatiseerd Voorraadbeheer
            </h2>
            <p className="text-lg text-gray-600">
              Volg deze concrete stappen voor succesvolle automatisering
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-start space-x-6 mb-6">
                  <div className={`bg-${step.color}-100 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0`}>
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-3 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                      Wat Je Moet Doen:
                    </h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-sm">
                          <Check className={`w-4 h-4 text-${step.color}-600 mr-2 mt-0.5 flex-shrink-0`} />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-orange-600" />
                      Pro Tips:
                    </h4>
                    <ul className="space-y-2">
                      {step.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start text-sm">
                          <span className="text-orange-600 mr-2">💡</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {step.number === 1 && (
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Aanbevolen:</strong> <Link to="/voorraadbeheer-kmo" className="text-indigo-600 font-semibold hover:underline">Stockflow</Link> is 
                      speciaal gebouwd voor KMO's met Excel import, integraties en gebruiksvriendelijke interface. 
                      <Link to="/auth" className="text-indigo-600 font-semibold hover:underline ml-1">Start gratis →</Link>
                    </p>
                  </div>
                )}

                {step.number === 2 && (
                  <div className="mt-6 bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Template beschikbaar:</strong> Download onze <Link to="/voorraadbeheer-excel" className="text-indigo-600 font-semibold hover:underline">Excel template</Link> om 
                      je data te structureren voor vlotte import.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Week-voor-Week <span className="text-indigo-600">Planning</span>
            </h2>
            <p className="text-lg text-gray-600">
              Verwachte tijdlijn voor volledige automatisering
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {timeline.map((week, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                <div className="text-center mb-4">
                  <div className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-full font-bold mb-2">
                    {week.week}
                  </div>
                  <h3 className="text-xl font-bold">{week.focus}</h3>
                  <div className="text-sm text-gray-600 mt-1">{week.status}</div>
                </div>
                <ul className="space-y-2">
                  {week.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Deze tijdlijn is een richtlijn. Kleinere bedrijven kunnen sneller, grotere organisaties 
              nemen mogelijk meer tijd voor grondige testing en training.
            </p>
            <Link
              to="/auth"
              className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
            >
              Start je gratis proefperiode
            </Link>
          </div>
        </div>
      </section>

      {/* Common Pitfalls Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Veelgemaakte <span className="text-red-600">Fouten</span> Voorkomen
            </h2>
            <p className="text-lg text-gray-600">
              Leer van de valkuilen die anderen tegenkwamen
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pitfalls.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`bg-${item.color}-100 p-3 rounded-lg flex-shrink-0`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">❌ {item.pitfall}</h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  <div className="font-semibold text-green-900 mb-1">✅ Oplossing:</div>
                  <p className="text-sm text-gray-700">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-center">💬 Hulp Nodig?</h3>
            <p className="text-center text-lg opacity-90 mb-6">
              Twijfel je over implementatie of loop je vast? Onze support helpt je graag. 
              Of bekijk onze andere gidsen voor meer context.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/demo"
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-orange-50 transition"
              >
                Vraag een Demo
              </Link>
              <Link
                to="/wat-is-voorraadbeheer-software"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition"
              >
                Leer de Basis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Results Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Verwachte Resultaten na Automatisering
            </h2>
            <p className="text-xl opacity-90">
              Dit is wat je kunt bereiken binnen 1-3 maanden
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {expectedResults.map((result, index) => (
              <div key={index} className="bg-white/10 backdrop-blur p-6 rounded-xl text-center">
                <result.icon className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">{result.metric}</div>
                <div className="text-lg font-semibold mb-2">{result.label}</div>
                <p className="text-sm opacity-90">{result.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-center">📈 Real-world Voorbeeld</h3>
            <p className="text-lg mb-4 text-center opacity-90">
              Een typische KMO met 200 producten en €500k omzet:
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="font-bold text-2xl mb-1">15u → 4u</div>
                <div className="text-sm opacity-90">Voorraad admin per week</div>
              </div>
              <div>
                <div className="font-bold text-2xl mb-1">€3.200</div>
                <div className="text-sm opacity-90">Maandelijkse besparing</div>
              </div>
              <div>
                <div className="font-bold text-2xl mb-1">6 weken</div>
                <div className="text-sm opacity-90">ROI bereikt</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klaar om te <span className="text-indigo-600">Beginnen</span> met Automatiseren?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Volg deze 5 stappen en bespaar 70% tijd binnen 2 weken. 
            Start gratis en ervaar direct het verschil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/auth"
              className="bg-indigo-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
            >
              Start je gratis proefperiode
            </Link>
            <Link
              to="/demo"
              className="border-2 border-indigo-600 text-indigo-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transition"
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
              Alle integraties beschikbaar
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Support tijdens implementatie
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
              Antwoorden over voorraadbeheer automatisering
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
            <Link to="/wat-is-voorraadbeheer-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 transition">
                  Wat is Voorraadbeheer Software?
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Leer de basis over hoe voorraadbeheer software werkt.
                </p>
                <div className="text-indigo-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/checklist-voorraadbeheer-software-gereed" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 transition">
                  Readiness Checklist
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Check of je bedrijf klaar is voor automatisering.
                </p>
                <div className="text-indigo-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/excel-vs-voorraadbeheer-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 transition">
                  Excel vs Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Vergelijk Excel met geautomatiseerde oplossingen.
                </p>
                <div className="text-indigo-600 text-sm font-semibold">Lees meer →</div>
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
            Automatiseer je voorraadbeheer in 5 concrete stappen. 
            Bespaar tijd, verminder fouten en groei zonder stress.
          </p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
              Voorraadbeheer Automatisering & Implementation.
            </p>
          </div>
        </div>
      </footer>

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          ${faqData.map(faq => `{
            "@type": "Question",
            "name": "${faq.question}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${faq.answer}"
            }
          }`).join(',')}
        ]
      }`}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Voorraadbeheer Automatiseren in 5 Stappen",
        "description": "Complete gids om je voorraadbeheer te automatiseren met concrete stappen en tijdlijn.",
        "totalTime": "PT168H",
        "step": [
          ${steps.map(step => `{
            "@type": "HowToStep",
            "name": "${step.title}",
            "text": "${step.description}",
            "url": "https://www.stockflow.be/voorraadbeheer-automatiseren-5-stappen#stap-${step.number}"
          }`).join(',')}
        ]
      }`}} />

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {"@context": "https://schema.org",
                "@type": "Article",
                "headline": "Voorraadbeheer Automatiseren in 5 Stappen",
                "description": "Stap-voor-stap implementatie gids voor voorraadbeheer automatisering met praktische tips en tijdlijn.",
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
                  "@id": "https://www.stockflow.be/voorraadbeheer-automatiseren-5-stappen"
                }
              }
        ]} />
    </SeoPageLayout>
  );
}

