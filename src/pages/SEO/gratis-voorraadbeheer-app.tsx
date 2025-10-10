import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Smartphone, Gift, Zap, Shield, Users, TrendingUp, Star } from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function GratisVoorraadbeheerApp() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Is de gratis voorraadbeheer app echt gratis?",
      answer: "Ja, onze gratis voorraadbeheer app is volledig gratis voor KMO's. Je kunt tot 30 producten beheren zonder enige kosten. Geen verborgen kosten, geen verplichtingen, geen creditcard vereist."
    },
    {
      question: "Welke functies heeft de gratis voorraadbeheer app?",
      answer: "De gratis voorraadbeheer app bevat alle essentiële functies: barcode scanning, real-time voorraadoverzicht, automatische bestelmeldingen, team samenwerking, en mobiele toegang. Perfect voor kleine tot middelgrote bedrijven."
    },
    {
      question: "Kan ik de gratis voorraadbeheer app offline gebruiken?",
      answer: "Onze gratis voorraadbeheer app werkt online en synchroniseert automatisch met je account. Dit zorgt ervoor dat je altijd de meest recente gegevens hebt, waar je ook bent."
    },
    {
      question: "Is de gratis voorraadbeheer app geschikt voor horeca?",
      answer: "Absoluut! Onze gratis voorraadbeheer app is perfect geschikt voor horeca, detailhandel, webshops en elke sector die voorraadbeheer nodig heeft. Specifiek ontwikkeld voor Vlaamse bedrijven."
    },
    {
      question: "Hoe download ik de gratis voorraadbeheer app?",
      answer: "Je hoeft niets te downloaden! Onze gratis voorraadbeheer app werkt direct in je webbrowser op smartphone, tablet en computer. Gewoon inloggen en direct beginnen."
    }
  ];

  const features = [
    {
      icon: Gift,
      title: "100% Gratis",
      description: "Geen verborgen kosten, geen limieten op gebruikers. Volledig gratis voorraadbeheer app voor KMO's."
    },
    {
      icon: Smartphone,
      title: "Mobiele App",
      description: "Werkt perfect op smartphone, tablet en desktop. Altijd en overal toegang tot je voorraadbeheer app."
    },
    {
      icon: Zap,
      title: "Direct Starten",
      description: "Geen installatie nodig. Log in en begin direct met je gratis voorraadbeheer app."
    },
    {
      icon: Shield,
      title: "Veilig & Betrouwbaar",
      description: "Enterprise-grade beveiliging met dagelijkse back-ups. Je data is altijd veilig."
    },
    {
      icon: Users,
      title: "Team Samenwerking",
      description: "Werk samen met je team in de gratis voorraadbeheer app. Verschillende gebruikersrollen mogelijk."
    },
    {
      icon: TrendingUp,
      title: "Schaalbaar",
      description: "Groeit mee met je bedrijf. Upgrade eenvoudig wanneer je meer functies nodig hebt."
    }
  ];

  const benefits = [
    "Geen verborgen kosten of verplichtingen",
    "Direct starten, geen installatie nodig", 
    "Gebruiksvriendelijke mobiele interface",
    "Real-time synchronisatie tussen apparaten",
    "Automatische meldingen bij lage voorraad",
    "Barcode scanning functionaliteit",
    "Professionele rapportages",
    "24/7 toegang vanaf overal"
  ];

  return (
    <SeoPageLayout title="Gratis Voorraadbeheer App - Mobiel Voorraadbeheer">
      <SEO
        title="Gratis Voorraadbeheer App | Mobiel Voorraadbeheer | stockflow"
        description="Ontdek de beste gratis voorraadbeheer app voor KMO's. Mobiel voorraadbeheer met barcode scanning, real-time synchronisatie en 100% gratis. Start vandaag!"
        keywords="gratis voorraadbeheer app, voorraadbeheer app gratis, gratis voorraadbeheer app download, gratis voorraadbeheer app android, gratis voorraadbeheer app iphone, gratis voorraadbeheer app tablet, gratis voorraadbeheer app barcode, gratis voorraadbeheer app offline, gratis voorraadbeheer app KMO, gratis voorraadbeheer app horeca, gratis voorraadbeheer app webshop, gratis voorraadbeheer app belgië, gratis voorraadbeheer app vlaanderen, gratis voorraadbeheer app stockflow"
        url="https://www.stockflow.be/gratis-voorraadbeheer-app"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-400 to-emerald-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Gratis Voorraadbeheer App</span>
                <span className="block text-green-100">voor KMO's</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                De enige gratis voorraadbeheer app die specifiek ontwikkeld is voor Vlaamse bedrijven. 
                Beheer je voorraad mobiel, efficiënt en zonder kosten. Perfect voor horeca, detailhandel en webshops.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ 100% Gratis</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Mobiel</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Barcode Scanning</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Real-time</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition text-center"
                >
                  Start Gratis Nu
                </Link>
                <Link
                  to="/demo-aanvragen"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition text-center"
                >
                  Demo Aanvragen
                </Link>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/optimized/mobile.png" 
                alt="Gratis Voorraadbeheer App" 
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
              Waarom kiezen voor onze <span className="text-green-600">gratis voorraadbeheer app?</span>
            </h2>
            <p className="text-lg text-gray-600">
              De enige gratis voorraadbeheer app die alles biedt wat je nodig hebt voor professioneel voorraadbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-green-600" />
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
                <span className="text-green-600">Voordelen</span> van onze gratis voorraadbeheer app
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Onze gratis voorraadbeheer app is specifiek ontwikkeld voor KMO's. 
                Ontdek waarom honderden bedrijven al kiezen voor onze gratis voorraadbeheer app.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-800">Voor Starters</h3>
                  <ul className="space-y-3">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-800">Voor Groeiende Bedrijven</h3>
                  <ul className="space-y-3">
                    {benefits.slice(4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
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
                alt="Voorraadbeheer App Interface" 
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Hoe werkt onze <span className="text-green-600">gratis voorraadbeheer app?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Start binnen 5 minuten met professioneel voorraadbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Account Aanmaken</h3>
              <p className="text-gray-600">
                Maak in 2 minuten een gratis account aan. Geen creditcard nodig, geen verplichtingen.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Producten Toevoegen</h3>
              <p className="text-gray-600">
                Voeg je eerste producten toe via barcode scanning of handmatig. Begin direct met voorraadbeheer.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Mobiel Beheren</h3>
              <p className="text-gray-600">
                Beheer je voorraad vanaf je smartphone, tablet of computer. Altijd en overal toegang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Waarom kiezen <span className="text-green-600">3200+ KMO's</span> voor onze gratis voorraadbeheer app?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "De beste gratis voorraadbeheer app die ik ooit heb gebruikt. Perfect voor ons restaurant!"
              </p>
              <div className="font-bold">Laura Peeters</div>
              <div className="text-sm text-gray-500">Eigenaar, De Koffieboetiek - Gent</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "Eindelijk een gratis voorraadbeheer app die echt werkt. Het team is fantastisch!"
              </p>
              <div className="font-bold">Tom De Wit</div>
              <div className="text-sm text-gray-500">Zaakvoerder, TechOnderdelen BV - Antwerpen</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "Als klein bedrijf is deze gratis voorraadbeheer app perfect. Aanrader!"
              </p>
              <div className="font-bold">Anke Willems</div>
              <div className="text-sm text-gray-500">Manager, Creatief Atelier - Brugge</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Veelgestelde vragen over onze <span className="text-green-600">gratis voorraadbeheer app</span>
            </h2>
            <p className="text-lg text-gray-600">
              Alles wat je moet weten over onze gratis voorraadbeheer app
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-400 to-emerald-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Onze Gratis Voorraadbeheer App
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij honderden KMO's die al profiteren van onze gratis voorraadbeheer app. 
            Geen verborgen kosten, geen verplichtingen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition text-center"
            >
              Start Gratis Nu
            </Link>
            <Link
              to="/demo-aanvragen"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition text-center"
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Meer lezen over voorraadbeheer?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-app" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-green-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  Voorraadbeheer App
                </h3>
                <p className="text-gray-600 text-sm">
                  Ontdek alle functies van onze voorraadbeheer app en hoe het je bedrijf kan helpen.
                </p>
              </div>
            </Link>
            <Link to="/gratis-voorraadbeheer" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-green-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  Gratis Voorraadbeheer
                </h3>
                <p className="text-gray-600 text-sm">
                  Alles over gratis voorraadbeheer voor KMO's en hoe je kunt starten.
                </p>
              </div>
            </Link>
            <Link to="/voorraadbeheer-tips" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-green-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
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
            De beste gratis voorraadbeheer app voor KMO's. 
            Mobiel, efficiënt en 100% gratis.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Gratis voorraadbeheer app voor KMO's.
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

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {"@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "stockflow - Gratis Voorraadbeheer App",
                "description": "De beste gratis voorraadbeheer app voor KMO's. Mobiel voorraadbeheer met barcode scanning, real-time synchronisatie en 100% gratis.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "EUR",
                  "description": "100% gratis voorraadbeheer app voor KMO's"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "32"
                },
                "author": {"@type": "Organization", "name": "stockflow"},
                "publisher": {"@type": "Organization", "name": "stockflow", "logo": {"@type": "ImageObject", "url": "https://www.stockflow.be/logo.png"}},
                  "image": "https://www.stockflow.be/optimized/mobile.png",
                  "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/gratis-voorraadbeheer-app"}
                }
      ]} />
    </SeoPageLayout>
  );
}
