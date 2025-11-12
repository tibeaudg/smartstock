import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Package, MapPin, Smartphone, BarChart3, Users, Zap, TrendingUp, ArrowRight, Clock } from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
export default function Magazijnbeheer() {
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat is het verschil tussen magazijnbeheer en voorraadbeheer?",
      answer: "Voorraadbeheer richt zich op het bijhouden van aantallen en bestellingen. Magazijnbeheer gaat verder met focus op fysieke locaties, zones, picken, pakken en verzenden. Het omvat de complete warehouse operatie van ontvangst tot verzending."
    },
    {
      question: "Welke functies moet magazijnbeheer software hebben?",
      answer: "EssentiÃ«le functies zijn: multi-locatie support, barcode scanning, zone en bin management, picking en packing workflows, shipping integratie, mobiele toegang voor het warehouse team, en real-time voorraad tracking per locatie."
    },
    {
      question: "Is magazijnbeheer software geschikt voor kleine magazijnen?",
      answer: "Absoluut! Moderne magazijnbeheer software is schaalbaar. Stockflow is perfect voor zowel kleine magazijnen met Ã©Ã©n locatie als grote operations met meerdere warehouses. Je betaalt alleen voor wat je nodig hebt."
    },
    {
      question: "Kan ik magazijnbeheer software integreren met mijn webshop?",
      answer: "Ja, professionele magazijnbeheer software integreert naadloos met webshop platforms. Dit zorgt voor automatische order import, voorraad sync en verzending tracking. Perfect voor e-commerce fulfillment."
    },
    {
      question: "Hoe helpt barcode scanning bij magazijnbeheer?",
      answer: "Barcode scanning verhoogt de nauwkeurigheid tot 99.9% en maakt processen 5x sneller. Je scant producten bij ontvangst, opslag, picking en verzending. Dit elimineert vrijwel alle fouten en bespaart enorm veel tijd."
    }
  ];

  const magazijnFeatures = [
    {
      icon: MapPin,
      title: "Multi-Locatie Beheer",
      description: "Beheer meerdere magazijnen, zones en stellingen vanuit Ã©Ã©n centraal systeem.",
      color: "blue"
    },
    {
      icon: Smartphone,
      title: "Mobile Barcode Scanning",
      description: "Scan producten met je smartphone of dedicated scanner voor snelle verwerking.",
      color: "green"
    },
    {
      icon: Package,
      title: "Picking & Packing",
      description: "Geoptimaliseerde workflows voor efficiÃ«nte order picking en verpakking.",
      color: "purple"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Wijs taken toe, track performance en werk samen met je warehouse team.",
      color: "orange"
    },
    {
      icon: BarChart3,
      title: "Real-time Rapportage",
      description: "Live inzicht in voorraad locaties, movements en warehouse efficiency.",
      color: "red"
    },
    {
      icon: Zap,
      title: "Shipping Integratie",
      description: "Koppel met verzendpartners voor automatische labels en tracking.",
      color: "yellow"
    }
  ];

  const warehouseTypes = [
    {
      type: "E-commerce Fulfillment",
      description: "Voor webshops die snel en accuraat willen verzenden",
      features: ["Multi-channel order import", "Batch picking ondersteuning", "Shipping label automatisering"]
    },
    {
      type: "Wholesale Distributie",
      description: "Voor groothandels met grote volumes en veel SKUs",
      features: ["Bulk receiving en putaway", "Zone-based opslag", "Pallet tracking"]
    },
    {
      type: "Retail Voorraad",
      description: "Voor retailers met centrale warehouse en winkels",
      features: ["Store replenishment", "Multi-locatie transfers", "Cross-docking support"]
    },
    {
      type: "Productie & Assembly",
      description: "Voor manufacturers met raw materials en finished goods",
      features: ["BOM (Bill of Materials)", "Work-in-progress tracking", "Quality control checks"]
    }
  ];

  return (
    <SeoPageLayout title="Magazijnbeheer Software">
      <SEO
        title="Magazijnbeheer Software | Optimaliseer je Warehouse Operaties | stockflow"
        description="Professionele magazijnbeheer software met multi-locatie support, barcode scanning en shipping integratie. Verhoog efficiency en elimineer fouten in je warehouse."
        keywords="magazijnbeheer, magazijnbeheer software, warehouse management, magazijn software, warehouse management system, magazijnbeheer systeem, magazijn optimalisatie, warehouse software, stockflow magazijnbeheer"
        url="https://www.stockflow.be/magazijnbeheer"
        hreflang={[
          { lang: "nl", url: "https://www.stockflow.be/magazijnbeheer" },
          { lang: "en", url: "https://www.stockflow.be/warehouse-management" }
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-purple-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Warehouse Management System
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Magazijnbeheer Software voor <span className="text-yellow-300">EfficiÃ«nte</span> Warehouses
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Transformeer je magazijnoperaties met professionele magazijnbeheer software. 
                Van ontvangst tot verzending - optimaliseer elk proces met <Link to="/voorraadbeheer-software" className="underline hover:text-yellow-300">moderne voorraadbeheer software</Link>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/auth"
                  className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-50 transition text-center"
                >
                  Start Gratis Trial
                </Link>
              
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Multi-locatie support
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Barcode scanning
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-300" />
                  Mobiele app
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Warehouse KPIs na Implementatie</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Picking Accuracy</span>
                    <span className="font-bold text-2xl">99.5%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '99.5%'}}></div>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Order Processing Time</span>
                    <span className="font-bold text-2xl">-60%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Warehouse Efficiency</span>
                    <span className="font-bold text-2xl">+75%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Difference Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Magazijnbeheer vs <span className="text-purple-600">Voorraadbeheer</span>: Wat is het Verschil?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Beide zijn belangrijk, maar hebben verschillende focus. Hier is het verschil uitgelegd.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Voorraadbeheer</h3>
              <p className="text-gray-700 mb-4">
                Focus op <strong>wat</strong> en <strong>hoeveel</strong> je hebt. 
                Meer informatie in ons complete <Link to="/voorraadbeheer-software" className="text-blue-600 font-semibold hover:underline">voorraadbeheer software overzicht</Link>.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span className="text-sm">Voorraad aantallen bijhouden</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span className="text-sm">Automatische bestelmeldingen</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span className="text-sm">Voorraad waardering en kosten</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span className="text-sm">Product informatie management</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border-2 border-purple-600">
              <h3 className="text-2xl font-bold mb-4 text-purple-900">Magazijnbeheer</h3>
              <p className="text-gray-700 mb-4">
                Focus op <strong>waar</strong> producten zijn en <strong>hoe</strong> ze bewegen door het warehouse.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                  <span className="text-sm"><strong>Locaties, zones en stellingen</strong></span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                  <span className="text-sm"><strong>Picking en packing workflows</strong></span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                  <span className="text-sm"><strong>Receiving en putaway processen</strong></span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                  <span className="text-sm"><strong>Shipping en verzending integratie</strong></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl text-center">
            <p className="text-lg">
              <strong>Het beste van beide?</strong> Stockflow combineert voorraadbeheer Ã©n magazijnbeheer in Ã©Ã©n platform. 
              Perfect voor <Link to="/voorraadbeheer-kmo" className="underline hover:text-yellow-300">KMO's</Link> die willen groeien.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Krachtige <span className="text-purple-600">Magazijnbeheer</span> Functies
            </h2>
            <p className="text-lg text-gray-600">
              Alles wat je nodig hebt voor efficiÃ«nte warehouse operaties
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {magazijnFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition">
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse Workflows Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete <span className="text-purple-600">Warehouse Workflows</span>
            </h2>
            <p className="text-lg text-gray-600">
              Van ontvangst tot verzending - elk proces geoptimaliseerd
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Receiving (Ontvangst)</h3>
                  <p className="text-gray-700 mb-3">
                    Scan inkomende goederen en registreer direct in het systeem. 
                    Automatische quality checks en discrepancy alerts.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Barcode scanning</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm">PO matching</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Quality control</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Putaway (Opslag)</h3>
                  <p className="text-gray-700 mb-3">
                    Intelligente locatie suggesties voor optimale opslag. Zone-based putaway voor verschillende product types. 
                    Real-time locatie updates.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Smart locaties</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Zone management</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Bin tracking</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Picking (Verzamelen)</h3>
                  <p className="text-gray-700 mb-3">
                    Geoptimaliseerde pick routes voor sneller verzamelen. Batch picking voor meerdere orders. 
                    Wave picking voor grote volumes. Mobile app voor warehouse team.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Route optimalisatie</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Batch picking</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Pick-to-light</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Packing & Shipping (Verpakken & Verzenden)</h3>
                  <p className="text-gray-700 mb-3">
                    Scan producten tijdens verpakking voor 100% accuracy. Automatische verzend labels via carrier integratie. 
                    Real-time tracking updates naar klanten. Ideaal voor <Link to="/voorraadbeheer-webshop" className="text-orange-600 font-semibold hover:underline">webshop fulfillment</Link>.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Pack verification</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Shipping labels</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm">Tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warehouse Types */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Magazijnbeheer voor <span className="text-purple-600">Elk Type Warehouse</span>
            </h2>
            <p className="text-lg text-gray-600">
              Of je nu e-commerce, wholesale, retail of productie draait - we hebben de juiste oplossing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {warehouseTypes.map((type, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-2xl font-bold mb-3">{type.type}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <h4 className="font-semibold mb-3">Specifieke functies:</h4>
                <ul className="space-y-2">
                  {type.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barcode Scanning Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Barcode Scanning: <span className="text-purple-600">De Basis</span> van Modern Magazijnbeheer
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Barcode scanning is niet meer weg te denken uit moderne magazijnen. Het verhoogt nauwkeurigheid, 
                versnelt processen en elimineert menselijke fouten.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">99.9% Accuracy</div>
                    <div className="text-gray-600">Elimineer vrijwel alle pick en pack fouten</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">5x Sneller</div>
                    <div className="text-gray-600">Verwerk orders veel sneller dan handmatig</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Real-time Updates</div>
                    <div className="text-gray-600">Directe voorraad updates bij elke scan</div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  to="/auth"
                  className="inline-flex items-center bg-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-purple-700 transition"
                >
                  Start met Barcode Scanning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-6">Gebruik je Smartphone</h3>
              <p className="text-gray-700 mb-6">
                Geen dure scanners nodig. Gebruik gewoon je smartphone of tablet als professionele barcode scanner. 
                Onze mobiele app maakt elk device een warehouse tool.
              </p>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center mb-4">
                  <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                  <div className="font-bold text-2xl mb-1">1.2 sec</div>
                  <div className="text-gray-600 text-sm">Gemiddelde scan tijd</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Producten gescand vandaag:</span>
                    <span className="font-bold">2,847</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fout percentage:</span>
                    <span className="font-bold text-green-600">0.1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tijdsbesparing:</span>
                    <span className="font-bold text-blue-600">6.5 uur</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Automatiseer je Magazijnbeheer
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Door je <Link to="/voorraadbeheer-automatiseren" className="underline hover:text-yellow-300">magazijnbeheer te automatiseren</Link>, 
            bespaar je niet alleen tijd maar verhoog je ook de nauwkeurigheid en klanttevredenheid.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">70%</div>
              <div className="text-lg">Minder tijd aan administratie</div>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg">Picking accuracy</div>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="text-4xl font-bold mb-2">2x</div>
              <div className="text-lg">Snellere order verwerking</div>
            </div>
          </div>
          <Link
            to="/auth"
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-50 transition"
          >
            Begin Gratis met Automatisering
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Klaar om je Magazijn te <span className="text-purple-600">Optimaliseren</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start vandaag nog met professioneel magazijnbeheer. 
            Geen lange implementatie, geen dure hardware - gewoon direct beginnen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/auth"
              className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition"
            >
              Start Gratis Trial
            </Link>
       
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Geen creditcard vereist
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
              Alles wat je moet weten over magazijnbeheer software
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
            <Link to="/voorraadbeheer-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition">
                  Voorraadbeheer Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete gids over voorraadbeheer software en waarom je het nodig hebt.
                </p>
                <div className="text-purple-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-kmo" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition">
                  Voorraadbeheer voor KMO's
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Betaalbare magazijn en voorraad oplossingen voor kleine bedrijven.
                </p>
                <div className="text-purple-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-webshop" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition">
                  Voorraadbeheer voor Webshops
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  E-commerce fulfillment en multi-channel voorraad synchronisatie.
                </p>
                <div className="text-purple-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-automatiseren" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition">
                  Voorraadbeheer Automatiseren
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Automatiseer je warehouse processen en bespaar 70% tijd.
                </p>
                <div className="text-purple-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/voorraadbeheer-excel" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition">
                  Van Excel naar Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Groei van handmatige Excel sheets naar professioneel magazijnbeheer.
                </p>
                <div className="text-purple-600 text-sm font-semibold">Lees meer →</div>
              </div>
            </Link>

            <Link to="/inventory-management-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition">
                  Inventory Management Software
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  English version - warehouse and inventory management solutions.
                </p>
                <div className="text-purple-600 text-sm font-semibold">Read more →</div>
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
            Professionele magazijnbeheer software voor moderne warehouses. 
            Optimaliseer je operaties van receiving tot shipping.
          </p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
              Magazijnbeheer & Warehouse Management Software.
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
          "headline": "Magazijnbeheer Software - Optimaliseer je Warehouse",
          "description": "Professionele magazijnbeheer software met multi-locatie support, barcode scanning en shipping integratie voor efficiÃ«nte warehouse operaties.",
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
            "@id": "https://www.stockflow.be/magazijnbeheer"
          }
        }
      ]} />
    </SeoPageLayout>
  );
}



