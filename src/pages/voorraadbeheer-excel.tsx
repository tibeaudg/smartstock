import React from 'react';
import SEO from '../components/SEO';
import SeoPageLayout from '../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';

export default function VoorraadbeheerExcel() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  
  return (
    <SeoPageLayout
      title="Voorraadbeheer in Excel: Complete Gids 2024"
      image="/optimized/Inventory-Management.png"
    >
      <SEO
        title="Voorraadbeheer in Excel: Gratis Template & Tips 2024 | stockflow"
        description="Voorraadbeheer in Excel: download gratis template, stappenplan en tips. Leer hoe je voorraad beheert in Excel of overstapt naar software. Complete gids voor KMO's."
        keywords="voorraadbeheer excel, excel voorraadbeheer, voorraadbeheer template excel, voorraadbeheer excel template, voorraadbeheer excel gratis, voorraadbeheer excel download, voorraadbeheer excel formule, voorraadbeheer excel macro, voorraadbeheer excel 2024, voorraadbeheer excel tips, voorraadbeheer excel stappenplan, voorraadbeheer excel voorbeelden"
        url="https://www.stockflow.be/voorraadbeheer-excel"
        image="/optimized/Inventory-Management.png"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-300 to-blue-500 text-white py-16 px-6 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            Voorraadbeheer in Excel: Complete Gids 2024
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Leer hoe je <strong>voorraadbeheer in Excel</strong> opzet of ontdek waarom je 
            beter kunt overstappen naar moderne software. Gratis template en stappenplan.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">Gratis template</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">Stappenplan</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-sm text-black font-bold">Excel vs Software</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="text-green-500 text-3xl mt-1 flex-shrink-0">ðŸ“Š</div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Voorraadbeheer in Excel: Voordelen en nadelen
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Excel is populair voor <strong>voorraadbeheer</strong> omdat het gratis en vertrouwd is. 
                Maar is het nog wel de beste keuze in 2024? Ontdek de voor- en nadelen, 
                download een gratis template en leer wanneer je beter kunt overstappen naar 
                moderne <strong>voorraadbeheer software</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Voordelen Excel */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Voordelen van voorraadbeheer in Excel
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <div className="text-green-600 text-xl">ðŸ’°</div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Gratis te gebruiken</h3>
            </div>
            <p className="text-gray-700">
              Excel is vaak al beschikbaar in je bedrijf en vereist geen extra investeringen.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <div className="text-blue-600 text-xl">ðŸ“š</div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Vertrouwd en bekend</h3>
            </div>
            <p className="text-gray-700">
              De meeste mensen kennen Excel al, dus weinig leercurve voor je team.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <div className="text-purple-600 text-xl">ðŸ”§</div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Volledig aanpasbaar</h3>
            </div>
            <p className="text-gray-700">
              Je kunt elke formule, cel en layout aanpassen aan jouw specifieke behoeften.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <div className="text-orange-600 text-xl">ðŸ“Š</div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Uitgebreide rapportages</h3>
            </div>
            <p className="text-gray-700">
              Grafieken, draaitabellen en geavanceerde analyses zijn mogelijk.
            </p>
          </div>
        </div>
      </div>

      {/* Nadelen Excel */}
      <div className="bg-red-50 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-red-800">
            Nadelen van voorraadbeheer in Excel
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-red-800">âŒ Geen real-time updates</h3>
              <p className="text-gray-700">
                Excel bestanden moeten handmatig worden bijgewerkt. Geen automatische synchronisatie.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-red-800">âŒ Foutgevoelig</h3>
              <p className="text-gray-700">
                Handmatige invoer leidt tot fouten. Ã‰Ã©n verkeerde cel kan alles verstoren.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-red-800">âŒ Geen automatisering</h3>
              <p className="text-gray-700">
                Geen automatische meldingen bij lage voorraad of bestellingen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-red-800">âŒ Beperkte toegang</h3>
              <p className="text-gray-700">
                Alleen beschikbaar op Ã©Ã©n computer. Geen mobiele toegang mogelijk.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wanneer overstappen */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Wanneer overstappen van Excel naar software?
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              âœ… Je hebt meer dan 50 producten
            </h3>
            <p className="text-gray-700">
              Excel wordt onoverzichtelijk bij veel producten. Software houdt alles georganiseerd.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              âœ… Je team werkt samen aan voorraad
            </h3>
            <p className="text-gray-700">
              Software biedt real-time samenwerking. Excel bestanden kunnen conflicteren.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              âœ… Je wilt automatisering
            </h3>
            <p className="text-gray-700">
              Automatische meldingen, bestellingen en rapportages besparen veel tijd.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              âœ… Je werkt mobiel
            </h3>
            <p className="text-gray-700">
              Moderne software werkt op alle apparaten. Excel is beperkt tot desktop.
            </p>
          </div>
        </div>
      </div>

      {/* Gratis Template */}
      <div className="bg-gradient-to-br from-blue-300 to-indigo-500 p-8 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Gratis Excel Template voor Voorraadbeheer
          </h2>
          <p className="text-xl mb-6 text-white opacity-90">
            Download onze gratis Excel template met formules en draaitabellen
          </p>
          <div className="bg-white p-6 rounded-lg max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Template bevat:</h3>
            <ul className="text-gray-700 text-left space-y-2">
              <li>â€¢ Product catalogus met categorieÃ«n</li>
              <li>â€¢ Voorraad tracking met minimum niveaus</li>
              <li>â€¢ Automatische berekeningen</li>
              <li>â€¢ Rapportage draaitabellen</li>
              <li>â€¢ Bestellingen overzicht</li>
            </ul>
            <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Download Gratis Template
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-green-300 to-blue-500 text-white p-8 rounded-lg text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Klaar om te upgraden van Excel?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Ontdek hoe moderne voorraadbeheer software je 70% tijd kan besparen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/voorraadbeheer-excel-vs-software" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Excel vs Software vergelijking
            </a>
            <a 
              href="/gratis-stockbeheer" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Gratis software proberen
            </a>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Voorraadbeheer in Excel opzetten",
        "description": "Complete gids voor voorraadbeheer in Excel met gratis template en tips",
        "image": "https://www.stockflow.be/optimized/Inventory-Management.png",
        "totalTime": "PT2H",
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "EUR",
          "value": "0"
        },
        "supply": [
          {
            "@type": "HowToSupply",
            "name": "Excel template"
          }
        ],
        "step": [
          {
            "@type": "HowToStep",
            "name": "Download gratis template",
            "text": "Download onze gratis Excel template voor voorraadbeheer"
          },
          {
            "@type": "HowToStep", 
            "name": "Vul productgegevens in",
            "text": "Voeg je producten toe met naam, categorie en minimum voorraad"
          },
          {
            "@type": "HowToStep",
            "name": "Stel formules in",
            "text": "Configureer automatische berekeningen voor voorraad tracking"
          }
        ]
      }`}} />
    </SeoPageLayout>
  );
} 
