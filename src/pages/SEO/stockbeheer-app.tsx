import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Smartphone, Zap, Shield, Users, Star, BarChart3, Camera } from 'lucide-react';

export default function StockbeheerApp() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Wat is een stockbeheer app?",
      answer: "Een stockbeheer app is een mobiele applicatie waarmee je je stock kunt beheren vanaf je smartphone of tablet. Met onze stockbeheer app kun je overal en altijd je stock controleren, bestellingen plaatsen en stockbewegingen registreren. Perfect voor ondernemers die onderweg zijn."
    },
    {
      question: "Is de stockbeheer app gratis?",
      answer: "Ja, onze stockbeheer app is volledig gratis voor KMO's. Je kunt tot 30 producten gratis beheren zonder verborgen kosten. Geen verborgen kosten, geen limieten op gebruikers of producten. Perfect om te testen of een stockbeheer app iets voor jou is."
    },
    {
      question: "Werkt de stockbeheer app offline?",
      answer: "Onze stockbeheer app werkt online en synchroniseert automatisch met je account. Dit zorgt ervoor dat je altijd de meest recente gegevens hebt, waar je ook bent. Alle wijzigingen worden direct gesynchroniseerd tussen je apparaten."
    },
    {
      question: "Kan ik de stockbeheer app thuis gebruiken?",
      answer: "Absoluut! Onze stockbeheer app is perfect geschikt voor thuisgebruik. Veel kleine ondernemers en zelfstandigen gebruiken de app om hun thuisstock te beheren. Ideaal voor thuiswerkers en kleine bedrijven."
    },
    {
      question: "Welke functies heeft de stockbeheer app?",
      answer: "De stockbeheer app bevat alle essentiële functies: stock bijhouden, bestellingen plaatsen, barcode scannen, stockbewegingen registreren en real-time inzicht in je stockniveaus. Alles wat je nodig hebt voor professioneel stockbeheer."
    }
  ];

  const features = [
    {
      icon: Smartphone,
      title: "Mobiele App",
      description: "Werkt perfect op smartphone, tablet en desktop. Altijd en overal toegang tot je stockbeheer app."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Scan barcodes direct met je smartphone camera voor snelle en nauwkeurige stockregistratie."
    },
    {
      icon: Zap,
      title: "Real-time Synchronisatie",
      description: "Alle wijzigingen in de stockbeheer app worden direct gesynchroniseerd met je hoofdsysteem."
    },
    {
      icon: Shield,
      title: "Veilig & Betrouwbaar",
      description: "Enterprise-grade beveiliging met dagelijkse back-ups. Je data is altijd veilig in de cloud."
    },
    {
      icon: Users,
      title: "Team Samenwerking",
      description: "Werk samen met je team in de stockbeheer app. Verschillende gebruikersrollen mogelijk."
    },
    {
      icon: BarChart3,
      title: "Rapportages",
      description: "Krijg real-time inzicht in je stock, verkoop en trends met uitgebreide rapportages."
    }
  ];

  const benefits = [
    "Geen verborgen kosten of verplichtingen",
    "Direct starten, geen installatie nodig",
    "Gebruiksvriendelijke mobiele interface",
    "Real-time synchronisatie tussen apparaten",
    "Automatische meldingen bij lage stock",
    "Barcode scanning functionaliteit",
    "Professionele rapportages",
    "24/7 toegang vanaf overal"
  ];

  const useCases = [
    {
      title: "Horeca",
      description: "Beheer je ingrediënten en voorraad direct vanuit de keuken. Perfect voor restaurants en cafés.",
      icon: "🍽️"
    },
    {
      title: "Detailhandel",
      description: "Controleer je winkelvoorraad en plaats bestellingen onderweg. Ideaal voor winkeliers.",
      icon: "🛍️"
    },
    {
      title: "Webshops",
      description: "Beheer je online voorraad en voorkom uitverkochte producten. Perfect voor e-commerce.",
      icon: "💻"
    },
    {
      title: "Kleine Bedrijven",
      description: "Professioneel stockbeheer zonder complexe systemen. Perfect voor KMO's en starters.",
      icon: "🏢"
    }
  ];

  return (
    <SeoPageLayout title="Stockbeheer App - Mobiel Stockbeheer">
      <SEO
        title="Stockbeheer App | Mobiel Stockbeheer | stockflow"
        description="Ontdek de beste stockbeheer app voor je bedrijf. Mobiel stockbeheer met barcode scanning, real-time synchronisatie en gratis starten. Download nu!"
        keywords="stockbeheer app, stockbeheer app gratis, app stockbeheer thuis, mobiel stockbeheer, stockbeheer app download, stockbeheer app android, stockbeheer app iphone, stockbeheer app tablet, stockbeheer app barcode, stockbeheer app offline, stockflow app, stockbeheer software app, stockbeheer app KMO, stockbeheer app horeca, stockbeheer app webshop, stockbeheer app belgië, stockbeheer app vlaanderen"
        url="https://www.stockflow.be/stockbeheer-app"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-400 to-red-500 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Stockbeheer App</span>
                <span className="block text-orange-100">voor mobiel beheer</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Ontdek de kracht van mobiel stockbeheer met onze stockbeheer app. Beheer je stock overal en altijd vanaf je smartphone of tablet. 
                Met barcode scanning, real-time synchronisatie en een gebruiksvriendelijke interface maakt onze stockbeheer app stockbeheer eenvoudig en efficiënt.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Mobiel</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Barcode Scanning</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Real-time</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Gratis</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition text-center"
                >
                  Start Gratis Nu
                </Link>
                <Link
                  to="/demo-aanvragen"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition text-center"
                >
                  Demo Aanvragen
                </Link>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/optimized/mobile.png" 
                alt="Stockbeheer App" 
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
              Waarom kiezen voor onze <span className="text-orange-600">stockbeheer app?</span>
            </h2>
            <p className="text-lg text-gray-600">
              De enige stockbeheer app die alles biedt wat je nodig hebt voor professioneel mobiel stockbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-orange-600" />
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
                <span className="text-orange-600">Voordelen</span> van onze stockbeheer app
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Onze stockbeheer app is specifiek ontwikkeld voor KMO's. 
                Ontdek waarom honderden bedrijven al kiezen voor onze stockbeheer app.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-orange-800">Voor Starters</h3>
                  <ul className="space-y-3">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-orange-800">Voor Groeiende Bedrijven</h3>
                  <ul className="space-y-3">
                    {benefits.slice(4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/optimized/desktop.png" 
                alt="Stockbeheer App Interface" 
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Perfect voor elke <span className="text-orange-600">sector</span>
            </h2>
            <p className="text-lg text-gray-600">
              Onze stockbeheer app is geschikt voor alle soorten bedrijven
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Hoe werkt onze <span className="text-orange-600">stockbeheer app?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Start binnen 5 minuten met professioneel mobiel stockbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Account Aanmaken</h3>
              <p className="text-gray-600">
                Maak in 2 minuten een gratis account aan. Geen creditcard nodig, geen verplichtingen.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">App Openen</h3>
              <p className="text-gray-600">
                Open de stockbeheer app in je webbrowser. Geen download nodig, werkt direct.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Stock Beheren</h3>
              <p className="text-gray-600">
                Beheer je stock vanaf je smartphone, tablet of computer. Altijd en overal toegang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Waarom kiezen <span className="text-orange-600">3200+ KMO's</span> voor onze stockbeheer app?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "De beste stockbeheer app die ik ooit heb gebruikt. Perfect voor ons restaurant!"
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
                "Eindelijk een stockbeheer app die echt werkt. Het team is fantastisch!"
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
                "Als klein bedrijf is deze stockbeheer app perfect. Aanrader!"
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
              Veelgestelde vragen over onze <span className="text-orange-600">stockbeheer app</span>
            </h2>
            <p className="text-lg text-gray-600">
              Alles wat je moet weten over onze stockbeheer app
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
      <section className="bg-gradient-to-br from-orange-400 to-red-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Onze Stockbeheer App
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij honderden KMO's die al profiteren van onze stockbeheer app. 
            Geen verborgen kosten, geen verplichtingen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition text-center"
            >
              Start Gratis Nu
            </Link>
            <Link
              to="/demo-aanvragen"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition text-center"
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
            Meer lezen over stockbeheer?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-app" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-orange-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  Voorraadbeheer App
                </h3>
                <p className="text-gray-600 text-sm">
                  Ontdek alle functies van onze voorraadbeheer app en hoe het je bedrijf kan helpen.
                </p>
              </div>
            </Link>
            <Link to="/gratis-stockbeheer" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-orange-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  Gratis Stockbeheer
                </h3>
                <p className="text-gray-600 text-sm">
                  Alles over gratis stockbeheer voor KMO's en hoe je kunt starten.
                </p>
              </div>
            </Link>
            <Link to="/voorraadbeheer-tips" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-orange-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
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
            De beste stockbeheer app voor KMO's. 
            Mobiel, efficiënt en gebruiksvriendelijk.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Stockbeheer app voor KMO's.
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
        "name": "stockflow - Stockbeheer App",
        "description": "De beste stockbeheer app voor KMO's. Mobiel stockbeheer met barcode scanning, real-time synchronisatie en gratis starten.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": "100% gratis stockbeheer app voor KMO's"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "32"
        },
        "author": {"@type": "Organization", "name": "stockflow"},
        "publisher": {"@type": "Organization", "name": "stockflow", "logo": {"@type": "ImageObject", "url": "https://www.stockflow.be/logo.png"}},
        "image": "https://www.stockflow.be/optimized/mobile.png",
        "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/stockbeheer-app"}
      }`}} />
    </SeoPageLayout>
  );
}
