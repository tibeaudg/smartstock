import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  ArrowRight, 
  CheckCircle, 
  DollarSign, 
  Smartphone, 
  Zap,
  Shield,
  Users,
  TrendingUp,
  Star,
  Package,
  BarChart3,
  Clock
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function BestVoorraadbeheerSoftwareKMO() {
  usePageRefresh();

  const topSolutions = [
    {
      name: 'StockFlow',
      tagline: 'Beste keuze voor KMO\'s',
      pros: [
        'Gratis tot 30 producten',
        'Mobiele app inbegrepen',
        'Geen setup kosten',
        'Nederlandse interface',
        'Multi-vestiging ondersteuning',
        'Real-time synchronisatie'
      ],
      cons: [
        'Geen ingebouwde boekhouding',
        'Relatief nieuw op de markt'
      ],
      price: 'Gratis - €49/maand',
      rating: 4.9,
      bestFor: 'KMO\'s die snel willen starten zonder grote investering',
      url: '/auth'
    },
    {
      name: 'Exact Online',
      tagline: 'Volledig ERP-systeem',
      pros: [
        'Geïntegreerde boekhouding',
        'Veel functies',
        'Bekend in Nederland',
        'Goede support'
      ],
      cons: [
        'Hoge kosten (€255+/maand)',
        'Complexe setup',
        'Steile leercurve',
        'Contract vereist',
        'Overkill voor pure voorraad'
      ],
      price: '€255 - €500/maand',
      rating: 4.0,
      bestFor: 'Grotere KMO\'s die volledige ERP nodig hebben',
      url: '/stockflow-vs-exact-online'
    },
    {
      name: 'Teamleader',
      tagline: 'CRM met voorraad',
      pros: [
        'CRM inbegrepen',
        'Factuurmodule',
        'Nederlandse interface',
        'Redelijke prijs'
      ],
      cons: [
        'Voorraad is bijzaak',
        'Beperkte voorraad functies',
        'Geen barcode scanning',
        'Desktop-gericht'
      ],
      price: '€50 - €150/maand',
      rating: 4.1,
      bestFor: 'Bedrijven die vooral CRM nodig hebben',
      url: '#'
    },
    {
      name: 'Moneybird',
      tagline: 'Boekhouding + voorraad',
      pros: [
        'Betaalbaar',
        'Eenvoudige boekhouding',
        'Nederlandse focus'
      ],
      cons: [
        'Zeer basale voorraad',
        'Geen mobiele app',
        'Geen multi-vestiging',
        'Beperkte rapportages'
      ],
      price: '€8 - €20/maand',
      rating: 3.8,
      bestFor: 'Zzp\'ers met minimale voorraad',
      url: '#'
    }
  ];

  const keyFeatures = [
    {
      icon: Package,
      title: 'Voorraad Tracking',
      description: 'Real-time overzicht van alle voorraad met automatische updates'
    },
    {
      icon: Smartphone,
      title: 'Mobiele App',
      description: 'Beheer voorraad onderweg met iOS en Android apps'
    },
    {
      icon: BarChart3,
      title: 'Rapportages',
      description: 'Inzicht in voorraadwaarde, omloop en trends'
    },
    {
      icon: Zap,
      title: 'Automatisering',
      description: 'Automatische waarschuwingen bij lage voorraad'
    },
    {
      icon: Users,
      title: 'Multi-gebruiker',
      description: 'Samenwerken met je hele team'
    },
    {
      icon: Clock,
      title: 'Tijdbesparing',
      description: 'Bespaar uren per week op handmatig werk'
    }
  ];

  return (
    <SeoPageLayout title="Best Voorraadbeheer Software KMO">
      <SEO
        title="Beste Voorraadbeheer Software voor KMO's 2025 | Vergelijk & Kies"
        description="Ontdek de beste voorraadbeheer software voor KMO's in 2025. Vergelijk prijzen, functies en reviews. Vind de perfecte voorraadoplossing voor jouw bedrijf."
        keywords="beste voorraadbeheer software kmo, voorraadbeheer software vergelijken, voorraad software kleine bedrijven, stockbeheer kmo, voorraadbeheer mkb"
        url="https://www.stockflow.be/best-voorraadbeheer-software-kmo"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Beste Voorraadbeheer Software <span className="text-blue-600">voor KMO's 2025</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Vergelijk de top voorraadbeheer oplossingen voor kleine en middelgrote ondernemingen. 
              Vind de perfecte software die past bij jouw budget en behoeften.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Probeer #1 Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/pricing" 
                className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Bekijk Prijzen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Wat Moet Goede Voorraadbeheer Software Kunnen?
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Voor KMO's zijn deze functies essentieel bij het kiezen van voorraadbeheer software:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Solutions */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Top 4 Voorraadbeheer Software voor KMO's
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Gebaseerd op prijs, functionaliteit, gebruiksgemak en geschiktheid voor KMO's
          </p>
          
          <div className="space-y-8">
            {topSolutions.map((solution, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-md p-8 ${
                  index === 0 ? 'border-2 border-blue-500 relative' : ''
                }`}
              >
                {index === 0 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      🏆 Beste Keuze voor KMO's
                    </span>
                  </div>
                )}
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">#{index + 1}</span>
                      <h3 className="text-2xl font-bold">{solution.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{solution.tagline}</p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${
                            i < Math.floor(solution.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold">{solution.rating}</span>
                    </div>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{solution.price}</div>
                      <p className="text-sm text-gray-600">per maand</p>
                    </div>
                    {solution.url.startsWith('/') && (
                      <Link
                        to={solution.url}
                        className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition w-full"
                      >
                        {index === 0 ? 'Start Gratis' : 'Meer Info'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Voordelen
                        </h4>
                        <ul className="space-y-2">
                          {solution.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                          <span className="h-5 w-5 mr-2">⚠️</span>
                          Nadelen
                        </h4>
                        <ul className="space-y-2">
                          {solution.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-red-400 flex-shrink-0 mt-0.5">−</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm">
                        <strong className="text-blue-900">Best voor:</strong>{' '}
                        <span className="text-gray-700">{solution.bestFor}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buying Guide */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Hoe Kies je de Beste Voorraadbeheer Software?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Stap 1: Bepaal je Behoeften</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong>Aantal producten</strong>
                    <p className="text-sm text-gray-600">Hoeveel SKU's beheer je?</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong>Aantal locaties</strong>
                    <p className="text-sm text-gray-600">Eén of meerdere vestigingen?</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong>Budget</strong>
                    <p className="text-sm text-gray-600">Wat kun je maandelijks investeren?</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <strong>Integraties</strong>
                    <p className="text-sm text-gray-600">Welke systemen moet het koppelen?</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Stap 2: Test & Vergelijk</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    5
                  </div>
                  <div>
                    <strong>Probeer gratis versies</strong>
                    <p className="text-sm text-gray-600">Test eerst voordat je betaalt</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    6
                  </div>
                  <div>
                    <strong>Check gebruiksgemak</strong>
                    <p className="text-sm text-gray-600">Kan je team ermee werken?</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    7
                  </div>
                  <div>
                    <strong>Lees reviews</strong>
                    <p className="text-sm text-gray-600">Wat zeggen andere KMO's?</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    8
                  </div>
                  <div>
                    <strong>Vergelijk total cost</strong>
                    <p className="text-sm text-gray-600">Let op verborgen kosten</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Veelgestelde Vragen
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Wat kost voorraadbeheer software voor KMO's?</h3>
              <p className="text-gray-600">
                De prijzen variëren van gratis (zoals StockFlow tot 30 producten) tot €500+ per maand 
                voor uitgebreide systemen. Voor de meeste KMO's is €0-€100 per maand voldoende.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Welke voorraadbeheer software is het makkelijkst?</h3>
              <p className="text-gray-600">
                StockFlow wordt vaak genoemd als meest gebruiksvriendelijk, met een intuïtieve interface 
                die geen training vereist. Je kunt binnen 10 minuten aan de slag.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Heb ik een mobiele app nodig?</h3>
              <p className="text-gray-600">
                Voor de meeste KMO's is een mobiele app essentieel. Het stelt je in staat om voorraad 
                te beheren vanaf de werkvloer, tijdens leveringen, of onderweg.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Kan ik overstappen van Excel naar software?</h3>
              <p className="text-gray-600">
                Ja, de meeste moderne voorraadsystemen bieden CSV import. Je kunt je Excel data 
                eenvoudig importeren en meteen starten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar om te Starten met Professioneel Voorraadbeheer?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Probeer de #1 voorraadbeheer software voor KMO's. 
            Gratis starten, geen creditcard vereist.
          </p>
          <Link 
            to="/auth" 
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Start Gratis met StockFlow
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm opacity-75">
            Sluit je aan bij 500+ tevreden KMO's
          </p>
        </div>
      </section>

      {/* Structured Data */}

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
                  "@context": "https://schema.org",
                  "@type": "Article",
                  "headline": "Beste Voorraadbeheer Software voor KMO's 2025",
                  "description": "Vergelijk de top voorraadbeheer software voor kleine en middelgrote ondernemingen. Reviews, prijzen en functies.",
                  "author": {
                    "@type": "Organization",
                    "name": "StockFlow"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "StockFlow",
                    "logo": {
                      "@type": "ImageObject",
                      "url": "https://www.stockflow.be/logo.png"
                    }
                  },
                  "datePublished": "2025-01-01",
                  "dateModified": "2025-01-01",
                  "inLanguage": "nl"
                }
      ]} />
    </SeoPageLayout>
  );
}

