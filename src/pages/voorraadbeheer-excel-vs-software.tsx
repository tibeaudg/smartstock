import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../components/SeoPageLayout';
import { Check, X, Star, Smartphone, Zap, Shield, Users, TrendingUp, FileSpreadsheet, Database, AlertTriangle, Clock } from 'lucide-react';

export default function VoorraadbeheerExcelVsSoftware() {
  const excelPros = [
    "Laagdrempelig en gratis",
    "Flexibel in te richten",
    "Bekende interface",
    "Geen internetverbinding nodig",
    "Eenvoudig te leren"
  ];

  const excelCons = [
    "Grote kans op fouten bij groei",
    "Geen automatische meldingen",
    "Moeilijk te delen met team",
    "Geen real-time synchronisatie",
    "Beperkte rapportage mogelijkheden",
    "Geen mobiele toegang",
    "Geen backup of versiebeheer",
    "Tijdsintensief onderhoud"
  ];

  const softwarePros = [
    "Realtime inzicht en synchronisatie",
    "Automatische meldingen bij lage voorraad",
    "Veilig en altijd beschikbaar",
    "Gemakkelijk te delen met team",
    "Mobiele toegang",
    "Geavanceerde rapportages",
    "Automatische backups",
    "Integratie met andere systemen"
  ];

  const comparisonData = [
    {
      feature: "Kosten",
      excel: "Gratis",
      software: "Vanaf €0/maand",
      winner: "software"
    },
    {
      feature: "Foutgevoeligheid",
      excel: "Hoog",
      software: "Laag",
      winner: "software"
    },
    {
      feature: "Automatisering",
      excel: "Geen",
      software: "Uitgebreid",
      winner: "software"
    },
    {
      feature: "Mobiele toegang",
      excel: "Nee",
      software: "Ja",
      winner: "software"
    },
    {
      feature: "Team samenwerking",
      excel: "Beperkt",
      software: "Uitgebreid",
      winner: "software"
    },
    {
      feature: "Rapportages",
      excel: "Basis",
      software: "Geavanceerd",
      winner: "software"
    }
  ];

  return (
    <SeoPageLayout
      title="Voorraadbeheer: Excel vs. Software"
      image="/optimized/Inventory-Management.png"
    >
      <SEO
        title="Voorraadbeheer: Excel vs. Software | Complete Vergelijking | stockflow"
        description="Voorraadbeheer in Excel of met software? Complete vergelijking van voordelen en nadelen. Ontdek wanneer je moet overstappen van Excel naar moderne voorraadbeheer software voor KMO's."
        keywords="voorraadbeheer excel, voorraadbeheer software, excel vs software, voorraadbeheer vergelijken, voorraadbeheer overstappen, excel voorraadbeheer, software voorraadbeheer, voorraadbeheer excel vs software, voorraadbeheer app vs excel, voorraadbeheer overstappen excel, voorraadbeheer software vergelijken, excel voorraadbeheer nadelen, voorraadbeheer software voordelen"
        url="https://www.stockflow.be/voorraadbeheer-excel-vs-software"
        image="/optimized/Inventory-Management.png"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-300 to-purple-500 text-white py-16 px-6 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Voorraadbeheer: Excel vs. Software
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Veel bedrijven starten met <strong>voorraadbeheer in Excel</strong>. 
            Maar wanneer is het tijd om over te stappen op een <strong>voorraadbeheer app</strong>? 
            We vergelijken de voor- en nadelen voor KMO's.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">✓ Complete vergelijking</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">✓ Praktische tips</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">✓ Overstap advies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="text-indigo-500 text-3xl mt-1 flex-shrink-0">⚖️</div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Excel vs. Software: De grote vergelijking
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Excel is een populaire start voor <strong>voorraadbeheer</strong>, maar heeft beperkingen 
                bij groei. Moderne <strong>voorraadbeheer software</strong> biedt meer mogelijkheden, 
                maar wanneer is de overstap de moeite waard? We helpen je de juiste keuze te maken.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Directe vergelijking: Excel vs. Software
        </h2>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50">
            <div className="p-4 font-semibold text-gray-800">Functie</div>
            <div className="p-4 font-semibold text-gray-800 text-center">Excel</div>
            <div className="p-4 font-semibold text-gray-800 text-center">Software</div>
          </div>
          
          {comparisonData.map((item, index) => (
            <div key={index} className="grid grid-cols-3 border-t border-gray-200">
              <div className="p-4 font-medium text-gray-800">{item.feature}</div>
              <div className={`p-4 text-center ${item.winner === 'software' ? 'text-red-600' : 'text-green-600'}`}>
                {item.excel}
              </div>
              <div className={`p-4 text-center ${item.winner === 'software' ? 'text-green-600' : 'text-red-600'}`}>
                {item.software}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Excel Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Voorraadbeheer in Excel
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <FileSpreadsheet className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Voordelen van Excel</h3>
            </div>
            <ul className="space-y-3">
              {excelPros.map((pro, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Nadelen van Excel</h3>
            </div>
            <ul className="space-y-3">
              {excelCons.map((con, index) => (
                <li key={index} className="flex items-start">
                  <X className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Software Section */}
      <div className="bg-gradient-to-br from-indigo-300 to-purple-500 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-indigo-600 text-4xl mx-auto mb-4">🚀</div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              Voorraadbeheer Software
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Voordelen van software
              </h3>
              <ul className="space-y-3 text-white">
                {softwarePros.slice(0, 4).map((pro, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-indigo-300 mr-3 flex-shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Meer voordelen
              </h3>
              <ul className="space-y-3 text-white">
                {softwarePros.slice(4).map((pro, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-indigo-300 mr-3 flex-shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* When to Switch Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Wanneer overstappen van Excel naar software?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-green-600">✅ Tijd om over te stappen</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Je hebt meer dan 50 producten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Meerdere mensen werken met voorraad</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Je hebt vaak fouten in Excel</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Je wilt automatisering</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Mobiele toegang is belangrijk</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">⏳ Excel is nog voldoende</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Je hebt minder dan 20 producten</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Je werkt alleen</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Je hebt een beperkt budget</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Je bent net gestart</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Je hebt weinig tijd voor implementatie</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Migration Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Stappenplan: Overstappen van Excel naar software
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Voorbereiding</h3>
              <p className="text-gray-600">
                Exporteer je Excel data en maak een backup. Documenteer je huidige processen.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Implementatie</h3>
              <p className="text-gray-600">
                Importeer je data in de nieuwe software en test alle functies.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Overgang</h3>
              <p className="text-gray-600">
                Train je team en ga geleidelijk over naar het nieuwe systeem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8">
          <div className="text-indigo-600 text-4xl mx-auto mb-4">❓</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Veelgestelde vragen over Excel vs. Software
          </h2>
          <p className="text-gray-600">
            Antwoorden op de meest gestelde vragen over de overstap
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Kan ik mijn Excel data importeren in voorraadbeheer software?
            </h3>
            <p className="text-gray-700">
              Ja, de meeste voorraadbeheer software ondersteunt Excel import. 
              Je kunt je bestaande data eenvoudig overzetten naar het nieuwe systeem.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Hoeveel kost voorraadbeheer software?
            </h3>
            <p className="text-gray-700 mb-3">
              <a href="/gratis-stockbeheer" className="text-indigo-700 underline font-semibold">
                stockflow biedt een gratis versie aan
              </a> voor kleine bedrijven. 
              Premium versies kosten vanaf €29 per maand, afhankelijk van je behoeften.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Hoe lang duurt het om over te stappen?
            </h3>
            <p className="text-gray-700 mb-3">
              De overstap duurt meestal 1-2 weken, inclusief data import, 
              training en het testen van het nieuwe systeem.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Kan ik beide systemen parallel gebruiken tijdens de overstap?
            </h3>
            <p className="text-gray-700 mb-3">
              Ja, veel bedrijven gebruiken beide systemen tijdelijk om de overstap 
              geleidelijk te maken en fouten te voorkomen.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Welke software is het beste voor kleine bedrijven?
            </h3>
            <p className="text-gray-700 mb-3">
              <a href="/voorraadbeheer-software-vergelijken" className="text-indigo-700 underline font-semibold">
                Bekijk onze complete vergelijking
              </a> van voorraadbeheer software voor KMO's. 
              stockflow is speciaal ontwikkeld voor kleine bedrijven.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-indigo-300 to-purple-500 text-white p-8 rounded-lg text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mx-auto mb-4">🚀</div>
          <h2 className="text-3xl font-bold mb-4">
            Klaar om over te stappen van Excel?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Start vandaag nog met moderne voorraadbeheer software. 
            Gratis voor kleine bedrijven, schaalbaar voor groei.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/gratis-stockbeheer" 
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis starten
            </a>
            <a 
              href="/voorraadbeheer-software-vergelijken" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Software vergelijken
            </a>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Meer lezen over voorraadbeheer?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/voorraadbeheer-software-vergelijken" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-indigo-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Software vergelijken
              </h3>
              <p className="text-gray-600 text-sm">
                Vergelijk verschillende voorraadbeheer software oplossingen.
              </p>
            </div>
          </Link>
          <Link to="/voorraadbeheer-tips" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-indigo-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Voorraadbeheer tips
              </h3>
              <p className="text-gray-600 text-sm">
                Praktische tips voor efficiënt voorraadbeheer en kostenbesparing.
              </p>
            </div>
          </Link>
          <Link to="/gratis-stockbeheer" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-indigo-300">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Gratis stockbeheer
              </h3>
              <p className="text-gray-600 text-sm">
                Ontdek hoe je gratis kunt beginnen met professioneel voorraadbeheer.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Kan ik mijn Excel data importeren in voorraadbeheer software?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja, de meeste voorraadbeheer software ondersteunt Excel import. Je kunt je bestaande data eenvoudig overzetten naar het nieuwe systeem."
            }
          },
          {
            "@type": "Question",
            "name": "Hoeveel kost voorraadbeheer software?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "stockflow biedt een gratis versie aan voor kleine bedrijven. Premium versies kosten vanaf €29 per maand, afhankelijk van je behoeften."
            }
          },
          {
            "@type": "Question",
            "name": "Hoe lang duurt het om over te stappen?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "De overstap duurt meestal 1-2 weken, inclusief data import, training en het testen van het nieuwe systeem."
            }
          },
          {
            "@type": "Question",
            "name": "Kan ik beide systemen parallel gebruiken tijdens de overstap?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja, veel bedrijven gebruiken beide systemen tijdelijk om de overstap geleidelijk te maken en fouten te voorkomen."
            }
          },
          {
            "@type": "Question",
            "name": "Welke software is het beste voor kleine bedrijven?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Bekijk onze complete vergelijking van voorraadbeheer software voor KMO's. stockflow is speciaal ontwikkeld voor kleine bedrijven."
            }
          }
        ]
      }`}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Voorraadbeheer: Excel vs. Software",
        "description": "Voorraadbeheer in Excel of met software? Complete vergelijking van voordelen en nadelen. Ontdek wanneer je moet overstappen van Excel naar moderne voorraadbeheer software voor KMO's.",
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
        "datePublished": "2024-01-01",
        "dateModified": "2024-12-19",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/voorraadbeheer-excel-vs-software"
        }
      }`}} />
    </SeoPageLayout>
  );
} 