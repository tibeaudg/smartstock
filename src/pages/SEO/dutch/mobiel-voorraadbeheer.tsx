import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { Check, Smartphone, Users, BarChart3, Camera, Clock, Globe, Package, Wifi } from 'lucide-react';
import { usePageRefresh } from '@/hooks/usePageRefresh';

import { StructuredData } from '@/components/StructuredData';
export default function MobielVoorraadbeheer() {
  // Gebruik de page refresh hook
  usePageRefresh();
  
  
  const features = [
    {
      icon: Smartphone,
      title: "Altijd Realtime Inzicht",
      description: "Bekijk en beheer je voorraad direct vanaf je mobiel, waar je ook bent."
    },
    {
      icon: Camera,
      title: "Barcode Scanning",
      description: "Scan barcodes of maak direct een foto van nieuwe producten."
    },
    {
      icon: Wifi,
      title: "Offline Werking",
      description: "Werk ook zonder internetverbinding, data wordt gesynchroniseerd bij verbinding."
    },
    {
      icon: Users,
      title: "Team Samenwerking",
      description: "Werk mobiel samen met je team en voorkom fouten door papierwerk."
    },
    {
      icon: Clock,
      title: "Direct Updates",
      description: "Alle wijzigingen worden direct gesynchroniseerd met je team."
    },
    {
      icon: BarChart3,
      title: "Mobiele Rapportages",
      description: "Bekijk belangrijke statistieken en trends direct op je mobiel."
    }
  ];

  const benefits = [
    "Verhoogde productiviteit door mobiele toegang",
    "Minder fouten door directe data invoer",
    "Betere team communicatie en samenwerking",
    "Flexibiliteit om overal te werken",
    "Tijdbesparing door geautomatiseerde processen",
    "Accurate realtime voorraad informatie"
  ];

  const useCases = [
    {
      title: "In het Magazijn",
      description: "Scan producten, update voorraad en registreer bewegingen direct ter plaatse.",
      icon: Package
    },
    {
      title: "Onderweg",
      description: "Controleer voorraad en plaats bestellingen vanaf elke Locations.",
      icon: Globe
    },
    {
      title: "Bij Klanten",
      description: "Toon realtime voorraad informatie en plaats direct orders.",
      icon: Users
    },
    {
      title: "Tijdens Inventarisatie",
      description: "Tel voorraad efficiÃ«nt met mobiele tools en directe registratie.",
      icon: Check
    }
  ];

  const faqData = [
    {
      question: "Werkt mobiel voorraadbeheer op alle apparaten?",
      answer: "Ja, stockflow werkt perfect op smartphones, tablets en computers. De app past zich automatisch aan aan het schermformaat."
    },
    {
      question: "Kan ik offline werken met mobiel voorraadbeheer?",
      answer: "Ja, stockflow biedt offline functionaliteit. Je kunt data invoeren zonder internetverbinding en alles wordt gesynchroniseerd zodra je weer online bent."
    },
    {
      question: "Is mobiel voorraadbeheer veilig?",
      answer: "Absoluut! Alle data wordt versleuteld opgeslagen en overgedragen. Je kunt ook inloggen met biometrische beveiliging."
    },
    {
      question: "Kan ik barcodes scannen met mijn smartphone?",
      answer: "Ja, stockflow ondersteunt barcode scanning via de camera van je smartphone. Dit maakt het toevoegen van producten veel sneller."
    },
    {
      question: "Hoeveel kost mobiel voorraadbeheer?",
      answer: "stockflow biedt een betaalbare oplossing vanaf ï¿½25 per maand, inclusief alle mobiele functionaliteiten."
    },
    {
      question: "Kan ik mijn team uitnodigen voor mobiel voorraadbeheer?",
      answer: "Ja, je kunt onbeperkt teamleden uitnodigen. Iedereen krijgt toegang tot de mobiele app met eigen inloggegevens."
    }
  ];

  const relatedArticles = [
    {
      title: "Voorraadbeheer Tips",
      url: "/voorraadbeheer-tips",
      description: "Beste tips voor efficiÃ«nt voorraadbeheer"
    },
    {
      title: "Voorraadbeheer Software Vergelijken",
      url: "/voorraadbeheer-software-vergelijken",
      description: "Vergelijk verschillende voorraadbeheer oplossingen"
    }
  ];

  return (
    <SeoPageLayout
      title="Mobiel Voorraadbeheer"
    >
      <SEO
        title="Mobiel Voorraadbeheer | Voorraadbeheer App | stockflow"
        description="Mobiel voorraadbeheer: beheer je voorraad eenvoudig via je smartphone of tablet. Ontdek de voordelen van een mobiele voorraadbeheer app."
        keywords="mobiel voorraadbeheer, voorraadbeheer app, voorraadbeheer smartphone, voorraadbeheer tablet, mobiele voorraadbeheer software, voorraadbeheer mobiel, voorraadbeheer app downloaden, voorraadbeheer iOS, voorraadbeheer Android, voorraadbeheer offline, voorraadbeheer barcode scanning, voorraadbeheer realtime, voorraadbeheer team, voorraadbeheer onderweg"
        url="https://www.stockflow.be/mobiel-voorraadbeheer"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Mobiel Voorraadbeheer
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Met <strong>mobiel voorraadbeheer</strong> heb je altijd en overal inzicht in je voorraad. 
            Ontdek de voordelen van een voorraadbeheer app op je smartphone of tablet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis Proberen
            </Link>
    
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Waarom Mobiel Voorraadbeheer?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              In de moderne zakenwereld is flexibiliteit cruciaal. Mobiel voorraadbeheer geeft je de vrijheid 
              om je voorraad te beheren waar en wanneer je maar wilt. 
              <a href="/voorraadbeheer-tips" className="text-blue-700 underline font-semibold">ontdek meer voorraadbeheer tips</a>.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Altijd Toegang</h3>
              <p className="text-gray-600 mb-4">
                Of je nu in het magazijn bent, onderweg naar een klant, of thuis werkt - 
                je hebt altijd toegang tot je voorraad informatie.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  <span>Realtime voorraad informatie</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  <span>Direct producten toevoegen of aanpassen</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  <span>Barcode scanning mogelijkheden</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  <span>Offline werken mogelijk</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Team Samenwerking</h3>
              <p className="text-gray-600 mb-4">
                Werk samen met je team in real-time. Iedereen heeft toegang tot dezelfde informatie 
                en kan direct updates maken.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-semibold">âœ“</div>
                  <span>Realtime synchronisatie</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-semibold">âœ“</div>
                  <span>Gedeelde toegang</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-semibold">âœ“</div>
                  <span>Audit trail</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Krachtige Mobiele Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Alle tools die je nodig hebt voor professioneel voorraadbeheer, nu ook beschikbaar op je mobiel.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <feature.icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Gebruikssituaties</h2>
            <p className="text-lg text-gray-600">
              Ontdek hoe mobiel voorraadbeheer je werkdag kan verbeteren
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <useCase.icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">{useCase.title}</h3>
                </div>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Voordelen van Mobiel Voorraadbeheer</h2>
            <p className="text-lg text-gray-600">
              Ontdek hoe mobiel voorraadbeheer je bedrijf kan transformeren
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Productiviteit</h3>
              <p className="text-gray-600 mb-4">
                Werk efficiÃ«nter door directe toegang tot voorraad informatie en geautomatiseerde processen.
              </p>
              <ul className="space-y-2">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 mt-1" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Flexibiliteit</h3>
              <p className="text-gray-600 mb-4">
                Werk waar en wanneer je wilt, zonder beperkingen door Locations of tijd.
              </p>
              <ul className="space-y-2">
                {benefits.slice(3).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 mt-1" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
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
              Antwoorden op de meest gestelde vragen over mobiel voorraadbeheer
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Vandaag met Mobiel Voorraadbeheer</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Probeer stockflow nu gratis uit en ervaar zelf het gemak van mobiel voorraadbeheer. 
            Download de app en begin direct!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gratis Proberen
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Opnemen
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Meer Informatie</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((article, index) => (
              <Link 
                key={index} 
                to={article.url}
                className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <h3 className="text-lg font-semibold mb-2 text-blue-600">{article.title}</h3>
                <p className="text-gray-600 text-sm">{article.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

            

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
        {"@context": "https://schema.org",
                "@type": "Article",
                "headline": "Mobiel Voorraadbeheer",
                "description": "Mobiel voorraadbeheer: beheer je voorraad eenvoudig via je smartphone of tablet. Ontdek de voordelen van een mobiele voorraadbeheer app.",
                "image": "https://www.stockflow.be/logo.png",
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
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://www.stockflow.be/mobiel-voorraadbeheer"
                },
                "datePublished": "2024-06-01",
                "dateModified": "2024-12-19"        }      ]} />
    </SeoPageLayout>
  );
} 


