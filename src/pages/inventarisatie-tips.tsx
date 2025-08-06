import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../components/SeoPageLayout';
import { Check, Star, Smartphone, Zap, Shield, Users, TrendingUp, Clipboard, Clock, BarChart3, Settings, Calculator, AlertTriangle, FileText } from 'lucide-react';

export default function InventarisatieTips() {
  const tips = [
    {
      icon: Clipboard,
      title: "Plan je Inventarisatie Goed",
      description: "Kies een rustig moment en zorg dat iedereen weet wat er verwacht wordt.",
      details: [
        "Stel een duidelijke tijdlijn op",
        "Communiceer met alle betrokkenen",
        "Zorg voor voldoende personeel",
        "Plan backup momenten"
      ]
    },
    {
      icon: FileText,
      title: "Werk met Duidelijke Lijsten en Labels",
      description: "Zorg voor een overzichtelijke administratie en duidelijke productlabels.",
      details: [
        "Gebruik gestandaardiseerde labels",
        "Maak duidelijke productcategorieën",
        "Nummer alle locaties consistent",
        "Documenteer alle afwijkingen"
      ]
    },
    {
      icon: Smartphone,
      title: "Gebruik Digitale Hulpmiddelen",
      description: "Met een voorraadbeheer app zoals stockflow wordt inventariseren sneller en nauwkeuriger.",
      details: [
        "Barcode scanning mogelijkheden",
        "Directe data invoer",
        "Automatische berekeningen",
        "Realtime synchronisatie"
      ]
    },
    {
      icon: Calculator,
      title: "Controleer en Verifieer",
      description: "Dubbelcheck alle tellingen en verifieer resultaten voor betrouwbaarheid.",
      details: [
        "Tweede telling van kritieke items",
        "Vergelijk met historische data",
        "Controleer op ongewone afwijkingen",
        "Documenteer alle bevindingen"
      ]
    },
    {
      icon: Clock,
      title: "Optimaliseer het Proces",
      description: "Leer van elke inventarisatie en verbeter het proces voor volgende keren.",
      details: [
        "Analyseer tijd per sectie",
        "Identificeer knelpunten",
        "Train medewerkers",
        "Update procedures"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Houd Rekening met Seizoensinvloeden",
      description: "Plan inventarisatie momenten die passen bij je bedrijfscyclus.",
      details: [
        "Vermijd piekperiodes",
        "Houd rekening met seizoenen",
        "Plan rond feestdagen",
        "Overweeg meerdere tellingen per jaar"
      ]
    }
  ];

  const benefits = [
    "Accurate voorraad informatie",
    "Betere financiële planning",
    "Vroegtijdige detectie van problemen",
    "Verbeterde klanttevredenheid",
    "Kostenbesparing door efficiëntie",
    "Compliance met regelgeving"
  ];

  const bestPractices = [
    {
      title: "Voorbereiding",
      description: "Zorg voor goede voorbereiding om fouten te voorkomen.",
      items: [
        "Maak een gedetailleerd plan",
        "Zorg voor voldoende materiaal",
        "Train alle betrokkenen",
        "Test procedures van tevoren"
      ]
    },
    {
      title: "Uitvoering",
      description: "Voer de inventarisatie systematisch en zorgvuldig uit.",
      items: [
        "Werk in logische secties",
        "Documenteer alle bevindingen",
        "Controleer regelmatig voortgang",
        "Los problemen direct op"
      ]
    },
    {
      title: "Afhandeling",
      description: "Verwerk resultaten en implementeer verbeteringen.",
      items: [
        "Analyseer afwijkingen",
        "Update voorraad administratie",
        "Communiceer resultaten",
        "Plan follow-up acties"
      ]
    }
  ];

  const faqData = [
    {
      question: "Hoe vaak moet ik inventariseren?",
      answer: "Dit hangt af van je bedrijfstype. Kleine bedrijven kunnen volstaan met 1-2 keer per jaar, terwijl grotere bedrijven vaak maandelijks of zelfs wekelijks inventariseren voor kritieke producten."
    },
    {
      question: "Kan ik inventariseren zonder de winkel te sluiten?",
      answer: "Ja, met moderne voorraadbeheer software kun je cyclische inventarisatie uitvoeren zonder de normale bedrijfsvoering te verstoren."
    },
    {
      question: "Hoe nauwkeurig moet mijn inventarisatie zijn?",
      answer: "Streef naar een nauwkeurigheid van 95% of hoger. Voor waardevolle producten is 99%+ aanbevolen."
    },
    {
      question: "Wat als ik grote afwijkingen vind?",
      answer: "Documenteer alle afwijkingen en onderzoek de oorzaken. Controleer of er systematische problemen zijn in je voorraadbeheer proces."
    },
    {
      question: "Kan ik inventarisatie automatiseren?",
      answer: "Ja, moderne voorraadbeheer systemen bieden automatische tellingen, barcode scanning en realtime updates die het proces aanzienlijk kunnen versnellen."
    },
    {
      question: "Hoeveel kost een goede inventarisatie?",
      answer: "Kosten variëren van €500-5000 afhankelijk van de grootte van je voorraad en gewenste nauwkeurigheid. De investering verdient zich terug door betere voorraad controle."
    }
  ];

  const relatedArticles = [
    {
      title: "Voorraadbeheer Tips",
      url: "/voorraadbeheer-tips",
      description: "Beste tips voor efficiënt voorraadbeheer"
    },
    {
      title: "Magazijnbeheer Tips",
      url: "/magazijnbeheer-tips",
      description: "Tips voor efficiënt magazijnbeheer"
    },
    {
      title: "Voorraadbeheer Automatiseren",
      url: "/voorraadbeheer-automatiseren",
      description: "Leer hoe je voorraadbeheer kunt automatiseren"
    }
  ];

  return (
    <SeoPageLayout
      title="Inventarisatie Tips"
      image="/optimized/Inventory-Management.png"
    >
      <SEO
        title="Inventarisatie Tips | Voorraad Tellen | stockflow"
        description="De beste tips voor inventarisatie en voorraad tellen. Leer hoe je efficiënt en foutloos je voorraad inventariseert met stockflow."
        keywords="inventarisatie, voorraad tellen, inventariseren, voorraadcontrole, voorraadbeheer, inventarisatie tips, voorraad telling, inventarisatie software, inventarisatie app, voorraad inventariseren, inventarisatie procedure, inventarisatie nauwkeurigheid, inventarisatie kosten, inventarisatie automatisering, inventarisatie planning, inventarisatie best practices"
        url="https://www.stockflow.be/inventarisatie-tips"
        image="/optimized/Inventory-Management.png"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Inventarisatie Tips
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Een goede <strong>inventarisatie</strong> voorkomt verrassingen en zorgt voor een kloppende voorraad. 
            Met deze tips maak je het inventariseren makkelijker en nauwkeuriger.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis Proberen
            </Link>
            <Link 
              to="/demo" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Demo Bekijken
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Waarom Inventarisatie Belangrijk Is</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Regelmatige inventarisatie is essentieel voor accurate voorraad informatie, 
              financiële planning en het voorkomen van voorraad problemen.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Voordelen van Goede Inventarisatie</h3>
              <ul className="space-y-2">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 mt-1" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Gevolgen van Slechte Inventarisatie</h3>
              <ul className="space-y-2">
                {benefits.slice(3).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 mt-1" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tips Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">6 Essentiële Inventarisatie Tips</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Implementeer deze tips om je inventarisatie efficiënter en nauwkeuriger te maken.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <tip.icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">{tip.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{tip.description}</p>
                <ul className="space-y-2">
                  {tip.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start text-sm">
                      <Check className="text-green-500 mr-2 mt-1" size={14} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Best Practices voor Inventarisatie</h2>
            <p className="text-lg text-gray-600">
              Volg deze best practices voor optimale resultaten
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {bestPractices.map((practice, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{practice.title}</h3>
                <p className="text-gray-600 mb-4">{practice.description}</p>
                <ul className="space-y-2">
                  {practice.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm">
                      <Check className="text-green-500 mr-2 mt-1" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Moderne Inventarisatie Tools</h2>
            <p className="text-lg text-gray-600">
              Gebruik technologie om je inventarisatie te verbeteren
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Digitale Hulpmiddelen</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 mt-1" size={16} />
                  <span>Barcode scanners voor snelle invoer</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 mt-1" size={16} />
                  <span>Mobiele apps voor realtime updates</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 mt-1" size={16} />
                  <span>Automatische berekeningen en rapportages</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 mt-1" size={16} />
                  <span>Integratie met bestaande systemen</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Tradionele Methoden</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 mt-1" size={16} />
                  <span>Gedrukte lijsten en formulieren</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 mt-1" size={16} />
                  <span>Handmatige tellingen en registratie</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 mt-1" size={16} />
                  <span>Excel spreadsheets voor verwerking</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mr-2 mt-1" size={16} />
                  <span>Fysieke controle en verificatie</span>
                </li>
              </ul>
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
              Antwoorden op de meest gestelde vragen over inventarisatie
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Klaar om je Inventarisatie te Verbeteren?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Begin vandaag nog met het optimaliseren van je inventarisatie proces. 
            stockflow helpt je om efficiënter en nauwkeuriger te inventariseren.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis Proberen
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Opnemen
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Meer Informatie</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((article, index) => (
              <Link 
                key={index} 
                to={article.url}
                className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <h3 className="text-lg font-semibold mb-2 text-blue-600">{article.title}</h3>
                <p className="text-gray-600 text-sm">{article.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
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
        "@type": "Article",
        "headline": "Inventarisatie Tips",
        "description": "De beste tips voor inventarisatie en voorraad tellen. Leer hoe je efficiënt en foutloos je voorraad inventariseert met stockflow.",
        "image": "https://www.stockflow.be/optimized/Inventory-Management.png",
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
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/inventarisatie-tips"
        },
        "datePublished": "2024-06-01",
        "dateModified": "2024-12-19"
      }`}} />
    </SeoPageLayout>
  );
} 