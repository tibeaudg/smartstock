import React from 'react';
import { Star, Quote } from 'lucide-react';
import { RegionalTestimonial } from '@/data/regions/testimonials';

interface RegionalTestimonialsProps {
  testimonials: RegionalTestimonial[];
  locationName: string;
}

const RegionalTestimonials: React.FC<RegionalTestimonialsProps> = ({ testimonials, locationName }) => {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Succesverhalen uit <span className="text-blue-600">{locationName}</span>
          </h2>
          <p className="text-lg text-gray-700">
            Ontdek hoe lokale bedrijven StockFlow gebruiken voor hun voorraadbeheer
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-blue-200 mb-4" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.quote}"
              </p>

              {/* Author Info */}
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-blue-600">{testimonial.business}</p>
                <p className="text-xs text-gray-500 mt-1">{testimonial.industry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionalTestimonials;

