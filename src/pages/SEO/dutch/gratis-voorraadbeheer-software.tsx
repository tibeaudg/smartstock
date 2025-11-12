import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Check, Gift, Zap, Shield, Users, Star, BarChart3, Smartphone } from 'lucide-react';

import { StructuredData } from '@/components/StructuredData';
export default function GratisVoorraadbeheerSoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  const faqData = [
    {
      question: "Is gratis voorraadbeheer software echt gratis?",
      answer: "Ja, onze gratis voorraadbeheer software is volledig gratis voor KMO's. Je kunt tot 30 producten beheren zonder enige kosten. Geen verborgen kosten, geen verplichtingen, geen creditcard vereist. Perfect voor starters en kleine bedrijven."
    },
    {
      question: "Welke functies heeft gratis voorraadbeheer software?",
      answer: "Onze gratis voorraadbeheer software bevat alle essentiÃ«le functies: real-time voorraadoverzicht, automatische bestelmeldingen, barcode scanning, team samenwerking, rapportages, en integratie met andere systemen. Alles wat je nodig hebt voor professioneel voorraadbeheer."
    },
    {
      question: "Is gratis voorraadbeheer software geschikt voor grote bedrijven?",
      answer: "Onze gratis voorraadbeheer software is perfect voor kleine tot middelgrote bedrijven. Voor grote organisaties bieden we premium versies met uitgebreide functies. De gratis versie is ideaal om te testen en te starten."
    },
    {
      question: "Kan ik gratis voorraadbeheer software integreren met mijn boekhouding?",
      answer: "Ja, onze gratis voorraadbeheer software kan eenvoudig geÃ¯ntegreerd worden met populaire boekhoudsystemen. Dit zorgt voor automatische synchronisatie van voorraadgegevens en bespaart je veel tijd."
    },
    {
      question: "Hoe veilig is gratis voorraadbeheer software?",
      answer: "Onze gratis voorraadbeheer software gebruikt enterprise-grade beveiliging met SSL-versleuteling, dagelijkse back-ups en GDPR-compliance. Je data is altijd veilig en beschermd tegen verlies."
    }
  ];

  const features = [
    {
      icon: Gift,
      title: "100% Gratis",
      description: "Geen verborgen kosten, geen limieten op gebruikers. Volledig gratis voorraadbeheer software voor KMO's."
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
      description: "Enterprise-grade beveiliging met dagelijkse back-ups. Je data is altijd veilig in de cloud."
    },
    {
      icon: Users,
      title: "Team Samenwerking",
      description: "Werk samen met je team in de gratis voorraadbeheer software. Verschillende gebruikersrollen mogelijk."
    },
    {
      icon: Smartphone,
      title: "Mobiele Toegang",
      description: "Toegang tot je gratis voorraadbeheer software vanaf smartphone, tablet of computer."
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

  const comparisonData = [
    {
      feature: "Producten beheren",
      gratis: "30 producten",
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
      gratis: "âœ“",
      premium: "âœ“"
    },
    {
      feature: "Mobiele app",
      gratis: "âœ“",
      premium: "âœ“"
    },
    {
      feature: "Email support",
      gratis: "âœ“",
      premium: "âœ“"
    },
    {
      feature: "Telefoon support",
      gratis: "âœ—",
      premium: "âœ“"
    },
    {
      feature: "Integraties",
      gratis: "Basis",
      premium: "Uitgebreid"
    }
  ];

  return (
    <SeoPageLayout title="Gratis Voorraadbeheer Software - Professioneel Voorraadbeheer">
      <SEO
        title="Gratis Voorraadbeheer Software | Professioneel Voorraadbeheer | stockflow"
        description="Ontdek de beste gratis voorraadbeheer software voor KMO's. Professioneel voorraadbeheer met real-time rapportages, automatische bestellingen en 100% gratis. Start vandaag!"
        keywords="gratis voorraadbeheer software, voorraadbeheer software gratis, gratis voorraadbeheer software download, gratis voorraadbeheer software KMO, gratis voorraadbeheer software belgiÃ«, gratis voorraadbeheer software vlaanderen, gratis voorraadbeheer software horeca, gratis voorraadbeheer software webshop, gratis voorraadbeheer software detailhandel, gratis voorraadbeheer software starters, gratis voorraadbeheer software kleine bedrijven, gratis voorraadbeheer software stockflow"
        url="https://www.stockflow.be/gratis-voorraadbeheer-software"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Gratis Voorraadbeheer Software</span>
                <span className="block text-blue-100">voor Professioneel Beheer</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                De enige gratis voorraadbeheer software die specifiek ontwikkeld is voor Vlaamse bedrijven. 
                Professioneel voorraadbeheer met real-time rapportages, automatische bestellingen en zonder kosten.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">âœ“ 100% Gratis</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">âœ“ Real-time Rapportages</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">âœ“ Automatische Bestellingen</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold">âœ“ Team Samenwerking</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
                >
                  Start Gratis Nu
                </Link>
             
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/optimized/desktop.png" 
                alt="Gratis Voorraadbeheer Software" 
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
              Waarom kiezen voor onze <span className="text-blue-600">gratis voorraadbeheer software?</span>
            </h2>
            <p className="text-lg text-gray-600">
              De enige gratis voorraadbeheer software die alles biedt wat je nodig hebt voor professioneel voorraadbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
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
                <span className="text-blue-600">Voordelen</span> van onze gratis voorraadbeheer software
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Onze gratis voorraadbeheer software is specifiek ontwikkeld voor KMO's. 
                Ontdek waarom honderden bedrijven al kiezen voor onze gratis voorraadbeheer software.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">Voor Starters</h3>
                  <ul className="space-y-3">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">Voor Groeiende Bedrijven</h3>
                  <ul className="space-y-3">
                    {benefits.slice(4).map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
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
                alt="Voorraadbeheer Software Interface" 
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
              Gratis vs Premium <span className="text-blue-600">Voorraadbeheer Software</span>
            </h2>
            <p className="text-lg text-gray-600">
              Vergelijk onze gratis voorraadbeheer software met de premium versie
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-green-800 mb-2">Gratis Versie</h3>
                <div className="text-4xl font-bold text-green-600 mb-4">$0/maand</div>
                <p className="text-green-700">Perfect voor starters en kleine bedrijven</p>
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
            
            <div className="bg-blue-50 p-8 rounded-lg border-2 border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-2">Premium Versie</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">$29/maand</div>
                <p className="text-blue-700">Voor groeiende bedrijven en teams</p>
              </div>
              <ul className="space-y-4">
                {comparisonData.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.feature}</span>
                    <span className="font-semibold text-blue-600">{item.premium}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 text-center">
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
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
              Hoe werkt onze <span className="text-blue-600">gratis voorraadbeheer software?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Start binnen 5 minuten met professioneel voorraadbeheer
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Account Aanmaken</h3>
              <p className="text-gray-600">
                Maak in 2 minuten een gratis account aan. Geen creditcard nodig, geen verplichtingen.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Producten Toevoegen</h3>
              <p className="text-gray-600">
                Voeg je eerste producten toe via barcode scanning of handmatig. Begin direct met voorraadbeheer.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Rapportages Bekijken</h3>
              <p className="text-gray-600">
                Bekijk real-time rapportages, stel automatische bestellingen in en beheer je voorraad efficiÃ«nt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Waarom kiezen <span className="text-blue-600">3200+ KMO's</span> voor onze gratis voorraadbeheer software?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">
                "De beste gratis voorraadbeheer software die ik ooit heb gebruikt. Perfect voor ons restaurant!"
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
                "Eindelijk een gratis voorraadbeheer software die echt werkt. Het team is fantastisch!"
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
                "Als klein bedrijf is deze gratis voorraadbeheer software perfect. Aanrader!"
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
              Veelgestelde vragen over onze <span className="text-blue-600">gratis voorraadbeheer software</span>
            </h2>
            <p className="text-lg text-gray-600">
              Alles wat je moet weten over onze gratis voorraadbeheer software
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
      <section className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Vandaag Met Onze Gratis Voorraadbeheer Software
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sluit je aan bij honderden KMO's die al profiteren van onze gratis voorraadbeheer software. 
            Geen verborgen kosten, geen verplichtingen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
            >
              Start Gratis Nu
            </Link>
        
          </div>
          <p className="text-sm mt-6 opacity-75">
            Geen creditcard vereist â€¢ Direct toegang â€¢ Nederlandse support
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
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-blue-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Voorraadbeheer Software
                </h3>
                <p className="text-gray-600 text-sm">
                  Ontdek alle functies van onze voorraadbeheer software en hoe het je bedrijf kan helpen.
                </p>
              </div>
            </Link>
            <Link to="/gratis-voorraadbeheer" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-blue-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Gratis Voorraadbeheer
                </h3>
                <p className="text-gray-600 text-sm">
                  Alles over gratis voorraadbeheer voor KMO's en hoe je kunt starten.
                </p>
              </div>
            </Link>
            <Link to="/voorraadbeheer-tips" className="group">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group-hover:border-blue-300">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
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
            De beste gratis voorraadbeheer software voor KMO's. 
            Professioneel, efficiÃ«nt en 100% gratis.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden.
              Gratis voorraadbeheer software voor KMO's.
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
          "name": "stockflow - Gratis Voorraadbeheer Software",
          "description": "De beste gratis voorraadbeheer software voor KMO's. Professioneel voorraadbeheer met real-time rapportages, automatische bestellingen en 100% gratis.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "description": "100% gratis voorraadbeheer software voor KMO's"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "32"
          },
          "author": {"@type": "Organization", "name": "stockflow"},
          "publisher": {"@type": "Organization", "name": "stockflow", "logo": {"@type": "ImageObject", "url": "https://www.stockflow.be/logo.png"}},
          "image": "https://www.stockflow.be/optimized/desktop.png",
          "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.stockflow.be/gratis-voorraadbeheer-software"}
        }
      ]} />
    </SeoPageLayout>
  );
}


