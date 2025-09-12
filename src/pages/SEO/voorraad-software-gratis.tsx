import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Gift, Zap, Shield, Users, TrendingUp, Star, BarChart3, Smartphone, Package } from 'lucide-react';

export default function VoorraadSoftwareGratis() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Is voorraad software gratis echt gratis?",
      answer: "Ja, onze voorraad software gratis is volledig gratis voor Vlaamse KMO's. Je kunt tot 30 producten beheren zonder enige kosten. Geen verborgen kosten, geen verplichtingen, geen creditcard vereist. Perfect voor starters en kleine bedrijven die willen beginnen met professioneel voorraadbeheer."
    },
    {
      question: "Welke functies heeft voorraad software gratis?",
      answer: "Onze voorraad software gratis bevat alle essentiële functies: real-time voorraadoverzicht, automatische bestelmeldingen, barcode scanning, team samenwerking, rapportages, en integratie met andere systemen. Alles wat je nodig hebt voor professioneel voorraadbeheer zonder kosten."
    },
    {
      question: "Kan ik voorraad software gratis downloaden?",
      answer: "Je hoeft niets te downloaden! Onze voorraad software gratis werkt direct in je webbrowser op smartphone, tablet en computer. Gewoon inloggen en direct beginnen. Geen installatie nodig, geen updates, altijd de nieuwste versie."
    },
    {
      question: "Is voorraad software gratis geschikt voor horeca?",
      answer: "Absoluut! Onze voorraad software gratis is perfect geschikt voor horeca, detailhandel, webshops en elke sector die voorraadbeheer nodig heeft. Specifiek ontwikkeld voor Vlaamse bedrijven met lokale support en Nederlandse interface."
    },
    {
      question: "Hoe veilig is voorraad software gratis?",
      answer: "Onze voorraad software gratis gebruikt enterprise-grade beveiliging met SSL-versleuteling, dagelijkse back-ups en GDPR-compliance. Je voorraadgegevens zijn altijd veilig en beschermd tegen verlies. We nemen de veiligheid van jouw bedrijfsgegevens zeer serieus."
    }
  ];

  const features = [
    {
      icon: Gift,
      title: "100% Gratis",
      description: "Geen verborgen kosten, geen limieten op gebruikers. Volledig gratis voorraad software voor Vlaamse KMO's."
    },
    {
      icon: Package,
      title: "Voorraadbeheer",
      description: "Beheer je voorraad efficiënt met real-time inzicht in stockniveaus en automatische bestelmeldingen."
    },
    {
      icon: BarChart3,
      title: "Real-time Rapportages",
      description: "Krijg direct inzicht in je voorraad, verkoop en trends met uitgebreide rapportages en dashboards."
    },
    {
      icon: Zap,
      title: "Automatische Bestellingen",
      description: "Stel minimum voorraadniveaus in en ontvang automatische bestelmeldingen wanneer voorraad laag is."
    },
    {
      icon: Shield,
      title: "Veilig & Betrouwbaar",
      description: "Enterprise-grade beveiliging met dagelijkse back-ups. Je voorraadgegevens zijn altijd veilig in de cloud."
    },
    {
      icon: Users,
      title: "Team Samenwerking",
      description: "Werk samen met je team in de voorraad software gratis. Verschillende gebruikersrollen mogelijk."
    }
  ];

  const benefits = [
    "Geen verborgen kosten of verplichtingen",
    "Direct starten, geen installatie nodig",
    "Real-time voorraadoverzicht en rapportages",
    "Automatische bestelmeldingen en alerts",
    "Barcode scanning functionaliteit",
    "Integratie met boekhouding mogelijk",
    "Team samenwerking en gebruikersrollen",
    "24/7 toegang vanaf overal"
  ];

  const steps = [
    {
      step: "1",
      title: "Account Aanmaken",
      description: "Maak in 2 minuten een gratis account aan. Geen creditcard nodig, geen verplichtingen.",
      icon: "👤"
    },
    {
      step: "2", 
      title: "Producten Toevoegen",
      description: "Voeg je eerste producten toe via barcode scanning of handmatig. Begin direct met voorraadbeheer.",
      icon: "📦"
    },
    {
      step: "3",
      title: "Voorraad Beheren",
      description: "Beheer je voorraad vanaf je smartphone, tablet of computer. Altijd en overal toegang.",
      icon: "📱"
    }
  ];

  return (
    <SeoPageLayout title="Voorraad Software Gratis - Professioneel Voorraadbeheer">
      <SEO
        title="Voorraad Software Gratis | Professioneel Voorraadbeheer | stockflow"
        description="Ontdek de beste voorraad software gratis voor Vlaamse KMO's. Professioneel voorraadbeheer met real-time rapportages, automatische bestellingen en 100% gratis. Start vandaag!"
        keywords="voorraad software gratis, gratis voorraad software, voorraad software gratis download, voorraad software gratis KMO, voorraad software gratis belgië, voorraad software gratis vlaanderen, voorraad software gratis horeca, voorraad software gratis webshop, voorraad software gratis detailhandel, voorraad software gratis starters, voorraad software gratis kleine bedrijven, voorraad software gratis stockflow"
        url="https://www.stockflow.be/voorraad-software-gratis"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Voorraad Software Gratis</span>
                <span className="block text-teal-100">voor Professioneel Beheer</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                De enige voorraad software gratis die specifiek ontwikkeld is voor Vlaamse bedrijven. 
                Professioneel voorraadbeheer met real-time rapportages, automatische bestellingen en zonder kosten.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ 100% Gratis</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Geen Download</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Real-time</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Mobiel</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-teal-50 transition text-center"
                >
                  Start Gratis Nu
                </Link>
                <Link
                  to="/demo-aanvragen"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition text-center"
                >
                  Demo Aanvragen
                </Link>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/optimized/desktop.png" 
                alt="Voorraad Software Gratis" 
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
              Waarom kiezen voor onze <span className="text-teal-600">voorraad software gratis?</span>
            </h2>
            <p className="text-lg text-gray-600">
              De enige voorraad software gratis die alles biedt wat je nodig hebt voor professioneel voorraadbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-teal-600" />
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
                <span className="text-teal-600">Voordelen</span> van onze voorraad software gratis
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Onze voorraad software gratis is specifiek ontwikkeld voor Vlaamse KMO's. 
                Ontdek waarom honderden bedrijven al kiezen voor onze voorraad software gratis.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-teal-800">Voor Starters</h3>
                  <ul className="space-y-3">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-teal-800">Voor Groeiende Bedrijven</h3>
                  <ul className="space-y-3">
                    {benefits.slice(4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
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
                alt="Voorraad Software Interface" 
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
              Hoe werkt onze <span className="text-teal-600">voorraad software gratis?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Start binnen 5 minuten met professioneel voorraadbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No Download Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <img 
                src="/optimized/mobile.png" 
                alt="Geen Download Nodig" 
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-teal-600">Geen Download</span> Nodig
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Onze voorraad software gratis werkt direct in je webbrowser. Geen installatie, 
                geen updates, geen gedoe. Gewoon inloggen en direct beginnen met professioneel voorraadbeheer.
              </p>
              
              <div className="space-y-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Direct Toegankelijk</h3>
                  <p className="text-gray-700">Werkt op alle apparaten: smartphone, tablet, laptop en desktop. Altijd de nieuwste versie.</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Geen Installatie</h3>
                  <p className="text-gray-700">Geen software installatie nodig. Werkt direct in je webbrowser zonder gedoe.</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Automatische Updates</h3>
                  <p className="text-gray-700">Altijd de nieuwste functies en verbeteringen. Geen handmatige updates nodig.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Waarom kiezen <span className="text-teal-600">32+ Vlaamse KMO's</span> voor onze voorraad software gratis?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "De beste voorraad software gratis die ik ooit heb gebruikt. Perfect voor ons restaurant!"
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
                "Eindelijk een voorraad software gratis die echt werkt. Het team is fantastisch!"
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
                "Als klein bedrijf is deze voorraad software gratis perfect. Aanrader!"
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
              Veelgestelde vragen over onze <span className="text-teal-600">voorraad software gratis</span>
            </h2>
            <p className="text-lg text-gray-600">
              Alles wat je moet weten over onze voorraad software gratis
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
      <section className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Onze Voorraad Software Gratis
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij honderden Vlaamse KMO's die al profiteren van onze voorraad software gratis. 
            Geen verborgen kosten, geen verplichtingen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-teal-50 transition text-center"
            >
              Start Gratis Nu
            </Link>
            <Link
              to="/demo-aanvragen"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition text-center"
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
            Meer lezen over voorraadbeheer?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/voorraadbeheer-software" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-teal-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  Voorraadbeheer Software
                </h3>
                <p className="text-gray-600 text-sm">
                  Ontdek alle functies van onze voorraadbeheer software en hoe het je bedrijf kan helpen.
                </p>
              </div>
            </Link>
            <Link to="/gratis-voorraadbeheer" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-teal-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  Gratis Voorraadbeheer
                </h3>
                <p className="text-gray-600 text-sm">
                  Alles over gratis voorraadbeheer voor KMO's en hoe je kunt starten.
                </p>
              </div>
            </Link>
            <Link to="/voorraadbeheer-tips" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-teal-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
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
            De beste voorraad software gratis voor Vlaamse KMO's. 
            Professioneel, efficiënt en 100% gratis.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Voorraad software gratis voor Vlaamse KMO's.
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
        "name": "stockflow - Voorraad Software Gratis",
        "description": "De beste voorraad software gratis voor Vlaamse KMO's. Professioneel voorraadbeheer met real-time rapportages, automatische bestellingen en 100% gratis.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": "100% gratis voorraad software voor KMO's"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "32"
        },
        "author": {"@type": "Organization", "name": "stockflow"},
        "publisher": {"@type": "Organization", "name": "stockflow", "logo": {"@type": "ImageObject", "url": "https://www.stockflow.be/logo.png"}},
        "image": "https://www.stockflow.be/optimized/desktop.png",
        "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/voorraad-software-gratis"}
      }`}} />
    </SeoPageLayout>
  );
}
