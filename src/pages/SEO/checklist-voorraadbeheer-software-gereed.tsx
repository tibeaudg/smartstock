import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, X, TrendingUp, AlertCircle, Users, MapPin, Clock, DollarSign, Zap, Target, Package, BarChart3 } from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function ChecklistVoorraadbeheerSoftwareGereed() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wanneer ben ik echt klaar voor voorraadbeheer software?",
      answer: "Je bent klaar als je minstens 4 van de 10 checkpoints herkent. Bijvoorbeeld: meer dan 50 producten, meerdere gebruikers, regelmatige fouten, of meer dan 5 uur per week aan voorraad administratie."
    },
    {
      question: "Wat als ik nog niet alle checkpoints heb?",
      answer: "Dat is prima! Als je 3 of minder checkpoints hebt, kun je nog goed uit de voeten met Excel. Maar houd de checklist in de gaten - zodra je groeit, weet je wanneer het tijd is om over te stappen."
    },
    {
      question: "Kan ik starten als ik een klein budget heb?",
      answer: "Absoluut! Veel voorraadbeheer software heeft gratis plannen voor kleine voorraden. Stockflow is bijvoorbeeld gratis tot 30 producten. Je kunt altijd klein beginnen en opschalen wanneer nodig."
    },
    {
      question: "Moet mijn team technisch zijn om software te gebruiken?",
      answer: "Nee, moderne voorraadbeheer software is ontworpen voor niet-technische gebruikers. Als je team Excel kan gebruiken, kunnen ze ook voorraadbeheer software gebruiken. Training duurt meestal maar 1-2 uur."
    },
    {
      question: "Wat als ik nog twijfel na deze checklist?",
      answer: "Probeer een gratis trial! Zo ervaar je zelf of software echt iets toevoegt voor jouw situatie. De meeste bedrijven weten na 1 week proberen of het voor hen werkt."
    }
  ];

  const checklistItems = [
    {
      icon: Package,
      title: "Groeiende Product Catalogus (>50 items)",
      description: "Je hebt meer dan 50 verschillende producten of SKUs",
      why: "Excel wordt traag en onoverzichtelijk bij grote catalogi",
      impact: "Hoog",
      color: "blue"
    },
    {
      icon: AlertCircle,
      title: "Regelmatige Handmatige Fouten",
      description: "Je maakt wekelijks fouten in voorraad tellingen of invoer",
      why: "Handmatige Excel invoer heeft 5-15% foutmarge",
      impact: "Zeer Hoog",
      color: "red"
    },
    {
      icon: MapPin,
      title: "Meerdere Locaties of Kanalen",
      description: "Je hebt voorraad op verschillende plekken (magazijn, winkel, webshop)",
      why: "Multi-locatie tracking is bijna onmogelijk in Excel",
      impact: "Hoog",
      color: "purple"
    },
    {
      icon: Clock,
      title: "Veel Tijd aan Voorraad Admin (>10h/week)",
      description: "Je besteedt meer dan 10 uur per week aan voorraad administratie",
      why: "Automatisering kan 70% van deze tijd besparen",
      impact: "Zeer Hoog",
      color: "orange"
    },
    {
      icon: TrendingUp,
      title: "Stockouts of Overstocking",
      description: "Je hebt regelmatig tekorten of te veel voorraad liggen",
      why: "Software geeft automatische waarschuwingen en inzichten",
      impact: "Hoog",
      color: "red"
    },
    {
      icon: BarChart3,
      title: "Behoefte aan Real-time Data",
      description: "Je wilt altijd actuele voorraad cijfers zonder handmatig te checken",
      why: "Excel updates zijn handmatig en vaak verouderd",
      impact: "Gemiddeld",
      color: "blue"
    },
    {
      icon: Users,
      title: "Team Samenwerking Nodig",
      description: "Meerdere teamleden moeten tegelijk toegang hebben tot voorraad",
      why: "Excel multi-user is problematisch en leidt tot conflicten",
      impact: "Hoog",
      color: "green"
    },
    {
      icon: Zap,
      title: "Integratie Vereisten",
      description: "Je wilt koppelen met webshop, boekhouding of kassasysteem",
      why: "Excel heeft nauwelijks integratie mogelijkheden",
      impact: "Hoog",
      color: "indigo"
    },
    {
      icon: DollarSign,
      title: "Budget Beschikbaar",
      description: "Je hebt budget voor software (of wilt gratis starten)",
      why: "Investering verdient zich terug door tijd- en kostenbesparing",
      impact: "Gemiddeld",
      color: "green"
    },
    {
      icon: Target,
      title: "Groeiplannen voor Komende 12 Maanden",
      description: "Je verwacht te groeien in producten, locaties of team",
      why: "Vroeg overstappen voorkomt dat je straks een chaotische transitie hebt",
      impact: "Gemiddeld",
      color: "purple"
    }
  ];

  const scoringGuide = [
    {
      score: "0-3 Checkpoints",
      level: "Nog Niet Nodig",
      color: "gray",
      description: "Excel is waarschijnlijk nog voldoende voor jouw situatie. Houd deze checklist in de gaten voor de toekomst.",
      action: "Blijf voorlopig bij Excel, maar evalueer opnieuw bij groei"
    },
    {
      score: "4-6 Checkpoints",
      level: "Tijd om te Overwegen",
      color: "orange",
      description: "Je begint toe te groeien naar software. Het is geen urgentie, maar wel slim om te onderzoeken en voorbereiden.",
      action: "Bekijk software opties en start een gratis trial om te ervaren"
    },
    {
      score: "7-10 Checkpoints",
      level: "Zeker Klaar!",
      color: "green",
      description: "Je bent duidelijk klaar voor professioneel voorraadbeheer. Excel kost je waarschijnlijk meer dan het oplevert.",
      action: "Start direct met implementatie - je verdient de investering snel terug"
    }
  ];

  return (
    <SeoPageLayout title="Checklist: Is je Bedrijf Klaar voor Voorraadbeheer Software?">
      <SEO
        title="Checklist: Is je Bedrijf Klaar voor Voorraadbeheer Software? | 10-Punten Test | stockflow"
        description="Doe de readiness check met onze 10-punten checklist. Ontdek of jouw bedrijf klaar is voor voorraadbeheer software en wat de volgende stappen zijn."
        keywords="voorraadbeheer software checklist, klaar voor voorraadbeheer, wanneer voorraadbeheer software, voorraadbeheer readiness check, voorraadbeheer software kiezen"
        url="https://www.stockflow.be/checklist-voorraadbeheer-software-gereed"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-purple-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                10-Punten Readiness Check
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Checklist: Is je Bedrijf <span className="text-yellow-300">Klaar</span> voor Voorraadbeheer Software?
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Ontdek met deze 10-punten checklist of jouw bedrijf toe is aan professioneel voorraadbeheer. 
                Inclusief scoring systeem en concrete vervolgstappen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/auth"
                  className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-50 transition text-center"
                >
                  Start Direct
                </Link>
                <Link
                  to="/demo"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition text-center"
                >
                  Bekijk Demo
                </Link>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Hoe het Werkt</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-semibold">Check de 10 punten</div>
                    <p className="text-purple-100 text-sm">Tel hoeveel situaties op jou van toepassing zijn</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-semibold">Bereken je score</div>
                    <p className="text-purple-100 text-sm">0-3: Nog niet | 4-6: Overwegen | 7-10: Zeker klaar!</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-semibold">Volg de adviezen</div>
                    <p className="text-purple-100 text-sm">Krijg concrete vervolgstappen op basis van je score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wanneer Ben Je <span className="text-purple-600">Klaar</span> voor Voorraadbeheer Software?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Niet elk bedrijf heeft direct voorraadbeheer software nodig. Maar hoe weet je of <em>jij</em> er klaar voor bent? 
              Deze checklist helpt je om een weloverwogen beslissing te nemen.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">💡 Waarom Deze Checklist?</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                Te vroeg overstappen naar software kan onnodig complex zijn als Excel nog prima werkt. 
                Te laat overstappen betekent dat je geld, tijd en kansen verliest.
              </p>
              <p>
                Deze 10-punten checklist is gebaseerd op ervaringen van honderden KMO's die de overstap maakten. 
                Het helpt je om objectief te bepalen of <em>nu</em> het juiste moment is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              De <span className="text-purple-600">10-Punten</span> Readiness Checklist
            </h2>
            <p className="text-lg text-gray-600">
              Check welke situaties op jouw bedrijf van toepassing zijn
            </p>
          </div>

          <div className="space-y-6">
            {checklistItems.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                      <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold">{index + 1}. {item.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.impact === 'Zeer Hoog' ? 'bg-red-100 text-red-700' :
                        item.impact === 'Hoog' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.impact} Impact
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{item.description}</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm">
                        <span className="font-semibold text-gray-900">Waarom belangrijk: </span>
                        <span className="text-gray-600">{item.why}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">📊 Tel Je Score</h3>
            <p className="text-lg mb-6 opacity-90">
              Hoeveel van deze 10 punten zijn van toepassing op jouw bedrijf? 
              Tel ze en kijk hieronder wat jouw score betekent.
            </p>
          </div>
        </div>
      </section>

      {/* Scoring System */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wat Betekent <span className="text-purple-600">Jouw Score</span>?
            </h2>
            <p className="text-lg text-gray-600">
              Interpretatie en concrete vervolgstappen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {scoringGuide.map((guide, index) => (
              <div key={index} className={`bg-gradient-to-br from-${guide.color}-50 to-${guide.color}-100 p-8 rounded-xl border-2 border-${guide.color}-200`}>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold mb-2">{guide.score}</div>
                  <div className={`inline-block px-4 py-2 rounded-full bg-${guide.color}-600 text-white font-bold`}>
                    {guide.level}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 text-center">{guide.description}</p>
                <div className="bg-white p-4 rounded-lg">
                  <div className="font-semibold text-sm mb-2">✅ Volgende Stap:</div>
                  <p className="text-sm text-gray-700">{guide.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps by Score */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Concrete <span className="text-purple-600">Vervolgstappen</span> per Score
            </h2>
            <p className="text-lg text-gray-600">
              Wat moet je nu doen op basis van je resultaat?
            </p>
          </div>

          <div className="space-y-8">
            {/* Score 0-3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  0-3
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Nog Niet Nodig - Blijf Bij Excel</h3>
                  <p className="text-gray-600">Je Excel setup is waarschijnlijk nog voldoende voor jouw situatie</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3">✅ Wat Je Nu Moet Doen:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Optimaliseer je huidige Excel setup met <Link to="/voorraadbeheer-excel" className="text-purple-600 font-semibold hover:underline">onze tips</Link></span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Evalueer deze checklist elke 3 maanden opnieuw</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Hou je Excel bestand clean en georganiseerd voor toekomstige overstap</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3">⚠️ Let Op Deze Signalen:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Groei in aantal producten (richting 50+)</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Extra teamleden die toegang nodig hebben</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Toename in handmatige fouten</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Score 4-6 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-orange-200">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  4-6
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Tijd om te Overwegen - Voorbereiden</h3>
                  <p className="text-gray-600">Je groeit toe naar software. Geen urgentie, maar wel slim om voor te bereiden</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3">✅ Wat Je Nu Moet Doen:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Start een gratis trial van <Link to="/voorraadbeheer-software" className="text-purple-600 font-semibold hover:underline">voorraadbeheer software</Link></span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Vergelijk verschillende software opties</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Maak je Excel bestand import-ready</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Bereken je ROI met <Link to="/excel-vs-voorraadbeheer-software" className="text-purple-600 font-semibold hover:underline">onze vergelijking</Link></span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3">📅 Planning:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Week 1-2:</span>
                      <span>Research en trials</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Week 3:</span>
                      <span>Beslissing maken</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Week 4:</span>
                      <span>Implementatie starten</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/auth"
                  className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
                >
                  Start Gratis Trial
                </Link>
              </div>
            </div>

            {/* Score 7-10 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-4 border-green-600">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  7-10
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Zeker Klaar - Start Direct!</h3>
                  <p className="text-gray-600">Je bent overduidelijk klaar. Excel kost je waarschijnlijk meer dan het oplevert</p>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h4 className="font-bold mb-3">🚀 Waarom Direct Starten:</h4>
                <p className="text-gray-700 mb-3">
                  Met 7+ checkpoints verlies je waarschijnlijk €2.000-5.000 per maand aan inefficiëntie, fouten en gemiste kansen. 
                  Elke week uitstel kost je geld.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3">✅ Actieplan voor Deze Week:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Vandaag:</strong> Start gratis account en importeer Excel</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Dag 2:</strong> Setup integraties (webshop, boekhouding)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Dag 3:</strong> Train je team (2-4 uur)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Dag 4+:</strong> Live gaan en Excel als backup houden</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3">💰 Verwachte Resultaten:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>70% tijdsbesparing binnen 2 weken</span>
                    </li>
                    <li className="flex items-start">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>90% minder fouten binnen 1 maand</span>
                    </li>
                    <li className="flex items-start">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>ROI binnen 1-3 maanden</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/auth"
                  className="inline-block bg-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition mr-4"
                >
                  Start je gratis proefperiode
                </Link>
                <Link
                  to="/voorraadbeheer-automatiseren-5-stappen"
                  className="inline-block border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-green-50 transition"
                >
                  Bekijk Implementatie Gids
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Considerations */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Extra <span className="text-purple-600">Overwegingen</span>
            </h2>
            <p className="text-lg text-gray-600">
              Andere factoren om mee te nemen in je beslissing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">💼 Sector & Branche</h3>
              <p className="text-gray-700 mb-3">
                Sommige sectoren hebben specifieke vereisten. E-commerce heeft bijvoorbeeld real-time synchronisatie nodig, 
                terwijl horeca focus legt op verse producten en houdbaarheidsdatums.
              </p>
              <Link to="/voorraadbeheer-webshop" className="text-blue-600 font-semibold hover:underline">
                Bekijk sector specifieke oplossingen →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">📈 Groeiambitie</h3>
              <p className="text-gray-700 mb-3">
                Plan je te groeien van 10 naar 100 producten komend jaar? Of van 1 naar 3 locaties? 
                Dan is het slim om vroeg te investeren in schaalbare software.
              </p>
              <Link to="/voorraadbeheer-kmo" className="text-green-600 font-semibold hover:underline">
                Software voor groeiende KMO's →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">👥 Team Grootte</h3>
              <p className="text-gray-700 mb-3">
                Werkt nu alleen jij met voorraad maar komt er binnenkort een magazijnmedewerker bij? 
                Of wil je externe accountant toegang geven? Multi-user is een game changer.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">🔌 Bestaande Systemen</h3>
              <p className="text-gray-700 mb-3">
                Als je al andere software gebruikt (webshop, boekhouding, CRM), zijn integraties cruciaal. 
                Check of voorraadbeheer software kan koppelen met je systemen.
              </p>
              <Link to="/voorraadbeheer-automatiseren" className="text-orange-600 font-semibold hover:underline">
                Lees over automatisering & integraties →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klaar om de <span className="text-purple-600">Volgende Stap</span> te Zetten?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Ongeacht je score, ervaar zelf wat voorraadbeheer software kan betekenen voor jouw bedrijf. 
            Start gratis en kijk of het bij je past.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/auth"
              className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition"
            >
              Start je gratis proefperiode
            </Link>
            <Link
              to="/demo"
              className="border-2 border-purple-600 text-purple-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-50 transition"
            >
              Bekijk Demo
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Geen creditcard nodig
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Excel import inbegrepen
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Setup in 1 dag
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Veelgestelde Vragen</h2>
            <p className="text-lg text-gray-600">
              Antwoorden over de readiness check
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Gerelateerde Artikelen</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/wat-is-voorraadbeheer-software" className="group">
              <div className="bg-white p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition">
                  Wat is Voorraadbeheer Software?
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Uitleg over hoe het werkt en wat het kan voor je bedrijf.
                </p>
                <div className="text-purple-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/excel-vs-voorraadbeheer-software" className="group">
              <div className="bg-white p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition">
                  Excel vs Software Vergelijking
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Kant-en-klare vergelijking tussen Excel en software.
                </p>
                <div className="text-purple-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-automatiseren-5-stappen" className="group">
              <div className="bg-white p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition">
                  Automatiseren in 5 Stappen
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Praktische gids voor implementatie en automatisering.
                </p>
                <div className="text-purple-600 text-sm font-semibold">Lees meer →</div>
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
            Ontdek of je bedrijf klaar is voor voorraadbeheer software met onze readiness check. 
            Start wanneer jij er klaar voor bent.
          </p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
              Voorraadbeheer Software Readiness Check.
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
          "headline": "Checklist: Is je Bedrijf Klaar voor Voorraadbeheer Software?",
          "description": "10-punten readiness checklist om te bepalen of jouw bedrijf klaar is voor voorraadbeheer software, inclusief scoring en advies.",
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
            "@id": "https://www.stockflow.be/checklist-voorraadbeheer-software-gereed"
          }
        }
      ]} />
    </SeoPageLayout>
  );
}

