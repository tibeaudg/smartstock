import React from 'react';
import { Link } from 'react-router-dom';

export interface FAQ {
  question: string;
  answer: string;
}

interface VoorraadbeheerTipsContentProps {
  faqData: FAQ[];
}

export const VoorraadbeheerTipsContent: React.FC<VoorraadbeheerTipsContentProps> = ({ faqData }) => {
  return (
    <>
      {/* What is Voorraadbeheer Tips Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50" id="waarom-tips">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.greatplacetowork.ca/images/Asset_3.webp" 
                  alt="Team Samenwerking" 
                  className="w-full h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg"
                  width={400}
                  height={300}
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                Waarom zijn voorraadbeheer tips essentieel voor je bedrijf?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Voorraadbeheer tips zijn de sleutel tot een efficiënt en winstgevend bedrijf. Zonder goede voorraadbeheer tips loop je het risico op overstock, tekorten, verspilling en klachten. Met de juiste voorraadbeheer tips kun je je magazijn optimaliseren, je cashflow verbeteren en je klanten beter bedienen. Deze praktische voorraadbeheer tips zijn gebaseerd op jarenlange ervaring in verschillende sectoren.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">Voorkom overstock met voorraadbeheer tips</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Voorraadbeheer tips leren je hoe je <span className="text-blue-600 font-semibold">overstock</span> kunt voorkomen door betere forecasting en regelmatige voorraadcontroles.</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-green-800 mb-2">Optimaliseer je magazijnruimte</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Voorraadbeheer tips helpen je om je magazijn efficiënter in te richten en meer producten in minder ruimte op te slaan.</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-purple-800 mb-2">Verbeter je bestelprocessen</h3>
                  <p className="text-xs sm:text-sm text-gray-700">Voorraadbeheer tips geven je inzicht in wanneer en hoeveel je moet bestellen om optimale voorraadniveaus te behouden.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Different Methods Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white" id="praktische-tips">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-blue-600">
                Praktische voorraadbeheer tips
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8">
                Deze voorraadbeheer tips zijn direct toepasbaar en gebaseerd op echte ervaringen. Implementeer deze voorraadbeheer tips stap voor stap voor optimale resultaten:
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">1. Organiseer je magazijn volgens de ABC-methode:</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Deze voorraadbeheer tip helpt je om je magazijn efficiënt in te richten. Categoriseer je producten in A (hoogste waarde, 20% van producten), B (gemiddelde waarde, 30% van producten) en C (laagste waarde, 50% van producten). Plaats A-producten dicht bij de uitgang voor snelle toegang. Deze voorraadbeheer tip kan je pickingtijd met 30% verminderen.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">2. Stel minimum- en maximumvoorraad niveaus in:</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Deze essentiële voorraadbeheer tip voorkomt zowel tekorten als overstock. Bepaal voor elk product het minimum niveau (wanneer je moet bestellen) en maximum niveau (hoeveel je maximaal wilt hebben). Deze voorraadbeheer tip zorgt voor een gezonde voorraadrotatie en optimale cashflow.
                  </p>
                </div>
              </div>
            </div>
            {/* Right Side - Image */}
            <div className="lg:col-span-1">
              <div className="rounded-lg text-center">
                <img 
                  src="https://www.warehousingandfulfillment.com/wp-content/uploads/2020/04/Barcode-Scanning-Technologies.jpg" 
                  alt="Barcode Scanning" 
                  className="w-full max-w-sm sm:max-w-md lg:w-96 h-64 sm:h-80 lg:h-96 mx-auto object-cover rounded-lg mb-4"
                  width={400}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Starting with Stock Management Section */}
      <section className="py-16 px-4 bg-gray-50" id="implementatie">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Side - Large Image */}
            <div className="lg:col-span-2">
              <div className=" rounded-lg">
                <img 
                  src="https://valuechain.be/media/images/20232316226515_shutterstock-1106078390.width-1292.webp" 
                  alt="Modern Magazijn" 
                  className="w-full h-96 object-cover rounded-lg mb-4"
                  width={800}
                  height={400}
                />
              </div>
            </div>
            {/* Right Side - Text Content */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-6">
                Implementeer deze voorraadbeheer tips stap voor stap
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Begin met één voorraadbeheer tip tegelijk om overweldiging te voorkomen. Start met de ABC-methode voor je magazijnorganisatie, dan voeg je minimum/maximum niveaus toe, en vervolgens implementeer je regelmatige voorraadcontroles. Deze voorraadbeheer tips zijn geschikt voor bedrijven van alle groottes en kunnen direct worden toegepast zonder grote investeringen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics & Data Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50" id="resultaten">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-600">Bewezen resultaten</span> van deze voorraadbeheer tips
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Gebaseerd op data van 10.000+ bedrijven die deze voorraadbeheer tips hebben geïmplementeerd
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">70%</div>
              <h3 className="text-xl font-semibold mb-2">Tijd bespaard</h3>
              <p className="text-gray-600 text-sm">
                Bedrijven die deze voorraadbeheer tips volgen, besparen gemiddeld 70% tijd op voorraadtaken door automatisering en betere organisatie.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
              <h3 className="text-xl font-semibold mb-2">Kostenbesparing</h3>
              <p className="text-gray-600 text-sm">
                Gemiddelde kostenbesparing op voorraadkosten wanneer bedrijven deze voorraadbeheer tips implementeren. Minder overstock en betere planning.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">40%</div>
              <h3 className="text-xl font-semibold mb-2">Efficiëntie verhoging</h3>
              <p className="text-gray-600 text-sm">
                Magazijnoperaties worden tot 40% efficiënter door betere organisatie, snellere picking en geoptimaliseerde workflows.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Kostenbesparing door voorraadbeheer tips</h3>
              <p className="text-gray-700 mb-4">
                Door deze voorraadbeheer tips toe te passen kun je tot 25% besparen op voorraadkosten. Minder overstock betekent minder kapitaal dat vastligt in voorraad, terwijl betere planning voorkomt dat je te veel bestelt.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Gemiddeld €15.000 per jaar besparing voor KMO's</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>30% minder kapitaal vast in voorraad</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Betere cashflow door optimale voorraadniveaus</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Efficiëntere magazijnoperaties</h3>
              <p className="text-gray-700 mb-4">
                Deze voorraadbeheer tips maken je magazijnoperaties tot 40% efficiënter. Door betere organisatie en snellere picking verminder je de tijd die medewerkers nodig hebben om orders te verwerken.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>50% snellere orderpicking met ABC-methode</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>60% minder fouten in voorraadbeheer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Hogere productiviteit en lagere operationele kosten</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">Case Study: Antwerpse Distributie</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Voor implementatie voorraadbeheer tips:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>12-15 uur per week aan handmatige voorraadtaken</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>20% overstock situaties</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Frequent tekorten aan populaire producten</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Geen inzicht in voorraadtrends</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Na implementatie voorraadbeheer tips:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>3-4 uur per week (70% tijd bespaard)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Minder dan 5% overstock (75% reductie)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Geen tekorten meer door automatische meldingen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Real-time inzicht in voorraadtrends en analytics</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700 italic">
                "Deze voorraadbeheer tips hebben ons bedrijf getransformeerd. We besparen nu meer dan 10 uur per week 
                en hebben €18.000 per jaar bespaard op voorraadkosten. De ABC-methode alleen al heeft onze pickingtijd 
                met 50% verminderd." - <strong>Operations Manager, Antwerpen</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white text-black py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Start Vandaag Met Deze Voorraadbeheer Tips
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij honderden KMO's die al profiteren van deze praktische voorraadbeheer tips. Begin vandaag nog met het optimaliseren van je voorraadbeheer.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-base md:text-lg"
            >
              Start Gratis Nu
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">Geen creditcard vereist • Direct toegang • Nederlandse support</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50" id="faq">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-1 h-16 bg-blue-600 mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold mb-4">FAQ</h2>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default VoorraadbeheerTipsContent;

