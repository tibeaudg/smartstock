import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Gift, Zap, Shield, Users, Star, BarChart3, Smartphone} from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
export default function ProgrammaStockbeheerGratis() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Is het programma stockbeheer gratis echt gratis?",
      answer: "Ja, ons programma stockbeheer gratis is volledig gratis voor KMO's. Je kunt tot 30 producten beheren zonder enige kosten. Geen verborgen kosten, geen verplichtingen, geen creditcard vereist. Perfect voor starters en kleine bedrijven die willen beginnen met professioneel stockbeheer."
    },
    {
      question: "Welke functies heeft het programma stockbeheer gratis?",
      answer: "Ons programma stockbeheer gratis bevat alle essentiÃ«le functies: real-time voorraadoverzicht, automatische bestelmeldingen, barcode scanning, team samenwerking, rapportages, en integratie met andere systemen. Alles wat je nodig hebt voor professioneel stockbeheer zonder kosten."
    },
    {
      question: "Kan ik het programma stockbeheer gratis downloaden?",
      answer: "Je hoeft niets te downloaden! Ons programma stockbeheer gratis werkt direct in je webbrowser op smartphone, tablet en computer. Gewoon inloggen en direct beginnen. Geen installatie nodig, geen updates, altijd de nieuwste versie."
    },
    {
      question: "Is het programma stockbeheer gratis geschikt voor horeca?",
      answer: "Absoluut! Ons programma stockbeheer gratis is perfect geschikt voor horeca, detailhandel, webshops en elke sector die stockbeheer nodig heeft. Specifiek ontwikkeld voor Vlaamse bedrijven met lokale support en Nederlandse interface."
    },
    {
      question: "Hoe veilig is het programma stockbeheer gratis?",
      answer: "Ons programma stockbeheer gratis gebruikt enterprise-grade beveiliging met SSL-versleuteling, dagelijkse back-ups en GDPR-compliance. Je data is altijd veilig en beschermd tegen verlies. We nemen de veiligheid van jouw bedrijfsgegevens zeer serieus."
    }
  ];

  const features = [
    {
      icon: Gift,
      title: "100% Gratis",
      description: "Geen verborgen kosten, geen limieten op gebruikers. Volledig gratis programma stockbeheer voor KMO's."
    },
    {
      icon: BarChart3,
      title: "Real-time Rapportages",
      description: "Krijg direct inzicht in je stock, verkoop en trends met uitgebreide rapportages en dashboards."
    },
    {
      icon: Zap,
      title: "Automatische Bestellingen",
      description: "Stel minimum stockniveaus in en ontvang automatische bestelmeldingen wanneer stock laag is."
    },
    {
      icon: Shield,
      title: "Veilig & Betrouwbaar",
      description: "Enterprise-grade beveiliging met dagelijkse back-ups. Je data is altijd veilig in de cloud."
    },
    {
      icon: Users,
      title: "Team Samenwerking",
      description: "Werk samen met je team in het programma stockbeheer gratis. Verschillende gebruikersrollen mogelijk."
    },
    {
      icon: Smartphone,
      title: "Mobiele Toegang",
      description: "Toegang tot je programma stockbeheer gratis vanaf smartphone, tablet of computer."
    }
  ];

  const benefits = [
    "Geen verborgen kosten of verplichtingen",
    "Direct starten, geen installatie nodig",
    "Real-time stockoverzicht en rapportages",
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
      icon: "ðŸ‘¤"
    },
    {
      step: "2", 
      title: "Producten Toevoegen",
      description: "Voeg je eerste producten toe via barcode scanning of handmatig. Begin direct met stockbeheer.",
      icon: "ðŸ“¦"
    },
    {
      step: "3",
      title: "Stock Beheren",
      description: "Beheer je stock vanaf je smartphone, tablet of computer. Altijd en overal toegang.",
      icon: "ðŸ“±"
    }
  ];

  return (
    <SeoPageLayout title="Programma Stockbeheer Gratis - Professioneel Stockbeheer">
      <SEO
        title="Programma Stockbeheer Gratis | Professioneel Stockbeheer | stockflow"
        description="Ontdek het beste programma stockbeheer gratis voor KMO's. Professioneel stockbeheer met real-time rapportages, automatische bestellingen en 100% gratis. Start vandaag!"
        keywords="programma stockbeheer gratis, stockbeheer programma gratis, gratis programma stockbeheer, programma stockbeheer gratis download, programma stockbeheer gratis KMO, programma stockbeheer gratis belgiÃ«, programma stockbeheer gratis vlaanderen, programma stockbeheer gratis horeca, programma stockbeheer gratis webshop, programma stockbeheer gratis detailhandel, programma stockbeheer gratis starters, programma stockbeheer gratis kleine bedrijven, programma stockbeheer gratis stockflow"
        url="https://www.stockflow.be/programma-stockbeheer-gratis"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-500 to-pink-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Programma Stockbeheer Gratis</span>
                <span className="block text-purple-100">voor Professioneel Beheer</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Het enige programma stockbeheer gratis dat specifiek ontwikkeld is voor Vlaamse bedrijven. 
                Professioneel stockbeheer met real-time rapportages, automatische bestellingen en zonder kosten.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ 100% Gratis</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">✓ Geen </span>
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
                  className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition text-center"
                >
                  Start Gratis Nu
                </Link>
           
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/optimized/desktop.png" 
                alt="Programma Stockbeheer Gratis" 
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
              Waarom kiezen voor ons <span className="text-purple-600">programma stockbeheer gratis?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Het enige programma stockbeheer gratis dat alles biedt wat je nodig hebt voor professioneel stockbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-purple-600" />
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
                <span className="text-purple-600">Voordelen</span> van ons programma stockbeheer gratis
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Ons programma stockbeheer gratis is specifiek ontwikkeld voor KMO's. 
                Ontdek waarom honderden bedrijven al kiezen voor ons programma stockbeheer gratis.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-purple-800">Voor Starters</h3>
                  <ul className="space-y-3">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-purple-800">Voor Groeiende Bedrijven</h3>
                  <ul className="space-y-3">
                    {benefits.slice(4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
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
                alt="Programma Stockbeheer Interface" 
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
              Hoe werkt ons <span className="text-purple-600">programma stockbeheer gratis?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Start binnen 5 minuten met professioneel stockbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
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

      {/* No Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <img 
                src="/optimized/mobile.png" 
                alt="Geen Nodig" 
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-purple-600">Geen </span> Nodig
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Ons programma stockbeheer gratis werkt direct in je webbrowser. Geen installatie, 
                geen updates, geen gedoe. Gewoon inloggen en direct beginnen met professioneel stockbeheer.
              </p>
              
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Direct Toegankelijk</h3>
                  <p className="text-gray-700">Werkt op alle apparaten: smartphone, tablet, laptop en desktop. Altijd de nieuwste versie.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Geen Installatie</h3>
                  <p className="text-gray-700">Geen software installatie nodig. Werkt direct in je webbrowser zonder gedoe.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Automatische Updates</h3>
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
            Waarom kiezen <span className="text-purple-600">3200+ KMO's</span> voor ons programma stockbeheer gratis?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "Het beste programma stockbeheer gratis dat ik ooit heb gebruikt. Perfect voor ons restaurant!"
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
                "Eindelijk een programma stockbeheer gratis dat echt werkt. Het team is fantastisch!"
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
                "Als klein bedrijf is dit programma stockbeheer gratis perfect. Aanrader!"
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
              Veelgestelde vragen over ons <span className="text-purple-600">programma stockbeheer gratis</span>
            </h2>
            <p className="text-lg text-gray-600">
              Alles wat je moet weten over ons programma stockbeheer gratis
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
      <section className="bg-gradient-to-br from-purple-500 to-pink-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Ons Programma Stockbeheer Gratis
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij honderden KMO's die al profiteren van ons programma stockbeheer gratis. 
            Geen verborgen kosten, geen verplichtingen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition text-center"
            >
              Start Gratis Nu
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
            <Link to="/stockbeheer" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-purple-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  Stockbeheer
                </h3>
                <p className="text-gray-600 text-sm">
                  Ontdek alles over professioneel stockbeheer en hoe het je bedrijf kan helpen.
                </p>
              </div>
            </Link>
            <Link to="/gratis-stockbeheer" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-purple-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  Gratis Stockbeheer
                </h3>
                <p className="text-gray-600 text-sm">
                  Alles over gratis stockbeheer voor KMO's en hoe je kunt starten.
                </p>
              </div>
            </Link>
            <Link to="/voorraadbeheer-tips" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-purple-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  Voorraadbeheer Tips
                </h3>
                <p className="text-gray-600 text-sm">
                  Praktische tips voor efficiÃ«nt voorraadbeheer en kostenbesparing.
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
            Het beste programma stockbeheer gratis voor KMO's. 
            Professioneel, efficiÃ«nt en 100% gratis.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Programma stockbeheer gratis voor KMO's.
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
          "@type": "SoftwareApplication",
          "name": "stockflow - Programma Stockbeheer Gratis",
          "description": "Het beste programma stockbeheer gratis voor KMO's. Professioneel stockbeheer met real-time rapportages, automatische bestellingen en 100% gratis.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "description": "100% gratis programma stockbeheer voor KMO's"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "32"
          },
          "author": {"@type": "Organization", "name": "stockflow"},
          "publisher": {"@type": "Organization", "name": "stockflow", "logo": {"@type": "ImageObject", "url": "https://www.stockflow.be/logo.png"}},
          "image": "https://www.stockflow.be/optimized/desktop.png",
          "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/programma-stockbeheer-gratis"}
        }
      ]} />
    </SeoPageLayout>
  );
}


