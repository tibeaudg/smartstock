import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface RegionalFAQProps {
  locationName: string;
  faqs: FAQ[];
}

const RegionalFAQ: React.FC<RegionalFAQProps> = ({ locationName, faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Veelgestelde vragen over voorraadbeheer in <span className="text-blue-600">{locationName}</span>
          </h2>
          <p className="text-lg text-gray-700">
            Antwoorden op de meest gestelde vragen door bedrijven in {locationName}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional help */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Meer vragen? <a href="/contact" className="text-blue-600 hover:underline font-semibold">Neem contact met ons op</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegionalFAQ;

