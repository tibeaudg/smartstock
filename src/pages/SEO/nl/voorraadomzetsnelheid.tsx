import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { StructuredData } from '@/components/StructuredData';
import { 
  BarChart3, 
  TrendingUp, 
  Calculator,
  CheckCircle,
  Target,
  ArrowRight,
  Lightbulb,
  Package,
  Clock
} from 'lucide-react';

export default function VoorraadomzetsnelheidPage() {
  const faqData = [
    {
      question: "Wat is voorraadomzetsnelheid?",
      answer: "Voorraadomzetsnelheid is een financiële metriek die meet hoe vaak een bedrijf zijn voorraad verkoopt en vervangt over een specifieke periode, typisch een jaar. Het wordt berekend door de kosten van verkochte goederen te delen door de gemiddelde voorraadwaarde. Een hogere voorraadomzetsnelheid duidt op efficiënt voorraadbeheer en snellere verkopen."
    },
    {
      question: "Hoe berekent u voorraadomzetsnelheid?",
      answer: "Voorraadomzetsnelheid wordt berekend door de kosten van verkochte goederen (COGS) te delen door de gemiddelde voorraadwaarde. De formule is: Voorraadomzetsnelheid = Kosten van Verkochte Goederen / Gemiddelde Voorraad. Gemiddelde voorraad wordt berekend als (Beginvoorraad + Eindvoorraad) / 2."
    },
    {
      question: "Wat is een goede voorraadomzetsnelheid?",
      answer: "Een goede voorraadomzetsnelheid hangt af van uw industrie. Retailbedrijven streven doorgaans naar 4-6 keer per jaar, terwijl fast-moving consumer goods 10-15 keer kunnen zien. Productiebedrijven hebben vaak 6-8 omlopen per jaar. Het belangrijkste is om uw ratio te vergelijken met industriebenchmarks en ervoor te zorgen dat deze in de loop van de tijd verbetert."
    },
    {
      question: "Wat betekent een lage voorraadomzetsnelheid?",
      answer: "Een lage voorraadomzetsnelheid duidt erop dat voorraad langzaam verkoopt, wat kan leiden tot overvoorraad, veroudering en gebonden kapitaal. Veelvoorkomende oorzaken zijn slechte vraagvoorspelling, over-inkoop, seizoensmismatches of productkwaliteitsproblemen."
    },
    {
      question: "Hoe kan ik mijn voorraadomzetsnelheid verbeteren?",
      answer: "Verbeter voorraadomzetsnelheid door: just-in-time bestellen implementeren, vraagvoorspelling gebruiken, herbestelpunt optimaliseren, langzaam bewegende voorraad verminderen, verkoopstrategieën verbeteren, ABC-analyse gebruiken en voorraadbeheer software gebruiken voor betere zichtbaarheid en controle."
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Verbeter Cashflow",
      description: "Hogere voorraadomzetsnelheid betekent snellere cash conversie, waardoor kapitaal vrijkomt voor groei en operaties."
    },
    {
      icon: Target,
      title: "Verminder Voorraadkosten",
      description: "Snellere omloop vermindert opslag-, verzekerings- en verouderingskosten geassocieerd met het houden van voorraad."
    },
    {
      icon: BarChart3,
      title: "Betere Vraagvoorspelling",
      description: "Begrijpen van omloop helpt vraagpatronen voorspellen en inkoopbeslissingen optimaliseren."
    },
    {
      icon: Package,
      title: "Voorkom Overvoorraad",
      description: "Monitor omloopsnelheid om langzaam bewegende items te identificeren voordat ze dode voorraad worden."
    }
  ];

  return (
    <SeoPageLayout 
      title="Voorraadomzetsnelheid"
      heroTitle="Voorraadomzetsnelheid: Verbeter Uw Voorraadefficiëntie"
      dateUpdated="22/01/2026"
      faqData={faqData}
    >
      <SEO
        title="Voorraadomzetsnelheid - Complete Gids 2026 | StockFlow"
        description="Leer alles over voorraadomzetsnelheid: wat het is, hoe u het berekent en hoe u het verbetert. Verbeter cashflow, verminder voorraadkosten en optimaliseer uw voorraadbeheer met StockFlow."
        keywords="voorraadomzetsnelheid, inventory turnover ratio, voorraad omloop, voorraad rotatie, voorraadomzetsnelheid berekenen, goede voorraadomzetsnelheid, voorraad efficiëntie, voorraad optimalisatie"
        url="https://www.stockflowsystems.com/nl/voorraadomzetsnelheid"
        locale="nl-BE"
        alternateLanguages={[
          { lang: 'en-US', url: 'https://www.stockflowsystems.com/inventory-turnover-ratio' },
          { lang: 'nl-BE', url: 'https://www.stockflowsystems.com/nl/voorraadomzetsnelheid' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Wat is Voorraadomzetsnelheid?
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Voorraadomzetsnelheid is een cruciale financiële metriek die meet hoe efficiënt uw bedrijf voorraad beheert. 
            Het toont hoe vaak u uw voorraad verkoopt en vervangt over een bepaalde periode, meestal een jaar.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Hoe Berekent U Voorraadomzetsnelheid?</h2>
            <p className="text-gray-700 mb-4">
              <strong>Formule:</strong> Voorraadomzetsnelheid = Kosten van Verkochte Goederen / Gemiddelde Voorraad
            </p>
            <p className="text-gray-700">
              Gemiddelde Voorraad = (Beginvoorraad + Eindvoorraad) / 2
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <benefit.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Verbeter Uw Voorraadomzetsnelheid Met StockFlow
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            StockFlow helpt u voorraadomzetsnelheid te optimaliseren met real-time tracking en geautomatiseerde waarschuwingen.
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

