import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Gift, Zap, Shield, Users, Star, BarChart3, Warehouse } from 'lucide-react';

export default function MagazijnbeheerSoftwareGratis() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Is magazijnbeheer software gratis echt gratis?",
      answer: "Ja, onze magazijnbeheer software gratis is volledig gratis voor KMO's. Je kunt tot 30 producten beheren zonder enige kosten. Geen verborgen kosten, geen verplichtingen, geen creditcard vereist. Perfect voor starters en kleine bedrijven die willen beginnen met professioneel magazijnbeheer."
    },
    {
      question: "Welke functies heeft magazijnbeheer software gratis?",
      answer: "Onze magazijnbeheer software gratis bevat alle essentiële functies: real-time voorraadoverzicht, automatische bestelmeldingen, barcode scanning, team samenwerking, rapportages, locatiebeheer en integratie met andere systemen. Alles wat je nodig hebt voor professioneel magazijnbeheer zonder kosten."
    },
    {
      question: "Is magazijnbeheer software gratis geschikt voor grote magazijnen?",
      answer: "Onze magazijnbeheer software gratis is perfect voor kleine tot middelgrote magazijnen. Voor grote magazijnoperaties bieden we premium versies met uitgebreide functies. De gratis versie is ideaal om te testen en te starten met magazijnbeheer."
    },
    {
      question: "Kan ik magazijnbeheer software gratis integreren met mijn ERP-systeem?",
      answer: "Ja, onze magazijnbeheer software gratis kan eenvoudig geïntegreerd worden met populaire ERP-systemen en boekhoudsoftware. Dit zorgt voor automatische synchronisatie van magazijndata en bespaart je veel tijd."
    },
    {
      question: "Hoe veilig is magazijnbeheer software gratis?",
      answer: "Onze magazijnbeheer software gratis gebruikt enterprise-grade beveiliging met SSL-versleuteling, dagelijkse back-ups en GDPR-compliance. Je magazijndata is altijd veilig en beschermd tegen verlies. We nemen de veiligheid van jouw bedrijfsgegevens zeer serieus."
    }
  ];

  const features = [
    {
      icon: Gift,
      title: "100% Gratis",
      description: "Geen verborgen kosten, geen limieten op gebruikers. Volledig gratis magazijnbeheer software voor KMO's."
    },
    {
      icon: Warehouse,
      title: "Locatiebeheer",
      description: "Beheer verschillende magazijnlocaties en stellingen. Perfect voor bedrijven met meerdere opslagruimtes."
    },
    {
      icon: BarChart3,
      title: "Real-time Rapportages",
      description: "Krijg direct inzicht in je magazijn, voorraad en trends met uitgebreide rapportages en dashboards."
    },
    {
      icon: Zap,
      title: "Automatische Bestellingen",
      description: "Stel minimum voorraadniveaus in en ontvang automatische bestelmeldingen wanneer voorraad laag is."
    },
    {
      icon: Shield,
      title: "Veilig & Betrouwbaar",
      description: "Enterprise-grade beveiliging met dagelijkse back-ups. Je magazijndata is altijd veilig in de cloud."
    },
    {
      icon: Users,
      title: "Team Samenwerking",
      description: "Werk samen met je team in de magazijnbeheer software gratis. Verschillende gebruikersrollen mogelijk."
    }
  ];

  const benefits = [
    "Geen verborgen kosten of verplichtingen",
    "Direct starten, geen installatie nodig",
    "Real-time magazijnoverzicht en rapportages",
    "Automatische bestelmeldingen en alerts",
    "Barcode scanning functionaliteit",
    "Locatiebeheer voor meerdere magazijnen",
    "Integratie met ERP en boekhouding",
    "24/7 toegang vanaf overal"
  ];

  const comparisonData = [
    {
      feature: "Producten beheren",
      gratis: "30 producten",
      premium: "Onbeperkt"
    },
    {
      feature: "Magazijnlocaties",
      gratis: "1 locatie",
      premium: "Onbeperkt"
    },
    {
      feature: "Gebruikers",
      gratis: "Onbeperkt",
      premium: "Onbeperkt"
    },
    {
      feature: "Rapportages",
      gratis: "Basis rapportages",
      premium: "Uitgebreide rapportages"
    },
    {
      feature: "Barcode scanning",
      gratis: "✓",
      premium: "✓"
    },
    {
      feature: "Mobiele app",
      gratis: "✓",
      premium: "✓"
    },
    {
      feature: "ERP integratie",
      gratis: "Basis",
      premium: "Uitgebreid"
    },
    {
      feature: "Email support",
      gratis: "✓",
      premium: "✓"
    }
  ];

  return (
    <SeoPageLayout title="Magazijnbeheer Software Gratis - Professioneel Magazijnbeheer">
      <SEO
        title="Magazijnbeheer Software Gratis | Professioneel Magazijnbeheer | stockflow"
        description="Ontdek de beste magazijnbeheer software gratis voor KMO's. Professioneel magazijnbeheer met real-time rapportages, locatiebeheer en 100% gratis. Start vandaag!"
        keywords="magazijnbeheer software gratis, gratis magazijnbeheer software, magazijnbeheer software gratis download, magazijnbeheer software gratis KMO, magazijnbeheer software gratis belgië, magazijnbeheer software gratis vlaanderen, magazijnbeheer software gratis horeca, magazijnbeheer software gratis webshop, magazijnbeheer software gratis detailhandel, magazijnbeheer software gratis starters, magazijnbeheer software gratis kleine bedrijven, magazijnbeheer software gratis stockflow"
        url="https://www.stockflow.be/magazijnbeheer-software-gratis"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Magazijnbeheer Software Gratis</span>
                <span className="block text-indigo-100">voor Professioneel Beheer</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                De enige magazijnbeheer software gratis die specifiek ontwikkeld is voor Vlaamse bedrijven. 
                Professioneel magazijnbeheer met real-time rapportages, locatiebeheer en zonder kosten.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ 100% Gratis</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Locatiebeheer</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Real-time</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ ERP Integratie</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition text-center"
                >
                  Start Gratis Nu
                </Link>
                <Link
                  to="/demo-aanvragen"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition text-center"
                >
                  Demo Aanvragen
                </Link>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/optimized/desktop.png" 
                alt="Magazijnbeheer Software Gratis" 
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Waarom kiezen voor onze <span className="text-indigo-600">magazijnbeheer software gratis?</span>
            </h2>
            <p className="text-lg text-gray-600">
              De enige magazijnbeheer software gratis die alles biedt wat je nodig hebt voor professioneel magazijnbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-indigo-600">Voordelen</span> van onze magazijnbeheer software gratis
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Onze magazijnbeheer software gratis is specifiek ontwikkeld voor KMO's. 
                Ontdek waarom honderden bedrijven al kiezen voor onze magazijnbeheer software gratis.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-indigo-800">Voor Starters</h3>
                  <ul className="space-y-3">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-indigo-800">Voor Groeiende Bedrijven</h3>
                  <ul className="space-y-3">
                    {benefits.slice(4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/optimized/image.png" 
                alt="Magazijnbeheer Software Interface" 
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Gratis vs Premium <span className="text-indigo-600">Magazijnbeheer Software</span>
            </h2>
            <p className="text-lg text-gray-600">
              Vergelijk onze magazijnbeheer software gratis met de premium versie
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-green-800 mb-2">Gratis Versie</h3>
                <div className="text-4xl font-bold text-green-600 mb-4">$0/maand</div>
                <p className="text-green-700">Perfect voor starters en kleine magazijnen</p>
              </div>
              <ul className="space-y-4">
                {comparisonData.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.feature}</span>
                    <span className="font-semibold text-green-600">{item.gratis}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 text-center">
                <Link
                  to="/auth"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Start Gratis
                </Link>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-8 rounded-lg border-2 border-indigo-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-indigo-800 mb-2">Premium Versie</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-4">$29/maand</div>
                <p className="text-indigo-700">Voor grote magazijnen en teams</p>
              </div>
              <ul className="space-y-4">
                {comparisonData.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.feature}</span>
                    <span className="font-semibold text-indigo-600">{item.premium}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 text-center">
                <Link
                  to="/auth"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Upgrade Nu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Hoe werkt onze <span className="text-indigo-600">magazijnbeheer software gratis?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Start binnen 5 minuten met professioneel magazijnbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Account Aanmaken</h3>
              <p className="text-gray-600">
                Maak in 2 minuten een gratis account aan. Geen creditcard nodig, geen verplichtingen.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Magazijn Inrichten</h3>
              <p className="text-gray-600">
                Stel je magazijnlocaties en stellingen in. Voeg je eerste producten toe en begin met magazijnbeheer.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Rapportages Bekijken</h3>
              <p className="text-gray-600">
                Bekijk real-time rapportages, stel automatische bestellingen in en beheer je magazijn efficiënt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Waarom kiezen <span className="text-indigo-600">3200+ KMO's</span> voor onze magazijnbeheer software gratis?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "De beste magazijnbeheer software gratis die ik ooit heb gebruikt. Perfect voor ons magazijn!"
              </p>
              <div className="font-bold">Laura Peeters</div>
              <div className="text-sm text-gray-500">Eigenaar, De Koffieboetiek - Gent</div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "Eindelijk een magazijnbeheer software gratis die echt werkt. Het team is fantastisch!"
              </p>
              <div className="font-bold">Tom De Wit</div>
              <div className="text-sm text-gray-500">Zaakvoerder, TechOnderdelen BV - Antwerpen</div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "Als klein bedrijf is deze magazijnbeheer software gratis perfect. Aanrader!"
              </p>
              <div className="font-bold">Anke Willems</div>
              <div className="text-sm text-gray-500">Manager, Creatief Atelier - Brugge</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Veelgestelde vragen over onze <span className="text-indigo-600">magazijnbeheer software gratis</span>
            </h2>
            <p className="text-lg text-gray-600">
              Alles wat je moet weten over onze magazijnbeheer software gratis
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Onze Magazijnbeheer Software Gratis
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij honderden KMO's die al profiteren van onze magazijnbeheer software gratis. 
            Geen verborgen kosten, geen verplichtingen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition text-center"
            >
              Start Gratis Nu
            </Link>
            <Link
              to="/demo-aanvragen"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition text-center"
            >
              Demo Aanvragen
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-75">
            Geen creditcard vereist • Direct toegang • Nederlandse support
          </p>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Meer lezen over magazijnbeheer?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-indigo-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  Voorraadbeheer Software
                </h3>
                <p className="text-gray-600 text-sm">
                  Ontdek alle functies van onze voorraadbeheer software en hoe het je bedrijf kan helpen.
                </p>
              </div>
            </Link>
            <Link to="/gratis-voorraadbeheer" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-indigo-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  Gratis Voorraadbeheer
                </h3>
                <p className="text-gray-600 text-sm">
                  Alles over gratis voorraadbeheer voor KMO's en hoe je kunt starten.
                </p>
              </div>
            </Link>
            <Link to="/voorraadbeheer-tips" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-indigo-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  Voorraadbeheer Tips
                </h3>
                <p className="text-gray-600 text-sm">
                  Praktische tips voor efficiënt voorraadbeheer en kostenbesparing.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img
            src="/logo.png"
            alt="stockflow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            De beste magazijnbeheer software gratis voor KMO's. 
            Professioneel, efficiënt en 100% gratis.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Magazijnbeheer software gratis voor KMO's.
            </p>
          </div>
        </div>
      </footer>

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
        "@type": "SoftwareApplication",
        "name": "stockflow - Magazijnbeheer Software Gratis",
        "description": "De beste magazijnbeheer software gratis voor KMO's. Professioneel magazijnbeheer met real-time rapportages, locatiebeheer en 100% gratis.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": "100% gratis magazijnbeheer software voor KMO's"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "32"
        },
        "author": {"@type": "Organization", "name": "stockflow"},
        "publisher": {"@type": "Organization", "name": "stockflow", "logo": {"@type": "ImageObject", "url": "https://www.stockflow.be/logo.png"}},
        "image": "https://www.stockflow.be/optimized/desktop.png",
        "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/magazijnbeheer-software-gratis"}
      }`}} />
    </SeoPageLayout>
  );
}
