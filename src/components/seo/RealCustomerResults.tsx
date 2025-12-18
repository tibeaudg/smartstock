import React from 'react';
import { Link } from 'react-router-dom';
import { TestimonialQuote } from '@/data/testimonialQuotes';
import { Quote, Star, TrendingUp, ArrowRight } from 'lucide-react';

interface RealCustomerResultsProps {
  testimonials: TestimonialQuote[];
  variant?: 'default' | 'carousel' | 'grid';
  maxItems?: number;
  className?: string;
}

export const RealCustomerResults: React.FC<RealCustomerResultsProps> = ({
  testimonials,
  variant = 'default',
  maxItems = 3,
  className = ''
}) => {
  const displayTestimonials = testimonials.slice(0, maxItems);
  
  if (variant === 'grid') {
    return (
      <section className={`py-12 bg-white ${className}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real Results from Real Customers
            </h2>
            <p className="text-lg text-gray-700">
              See how businesses like yours are saving time and money with StockFlow
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <Quote className="h-8 w-8 text-blue-300 mb-4" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                {testimonial.savings && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      <span>{testimonial.savings}</span>
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-blue-600">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/customers"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              View More Customer Stories <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }
  
  if (variant === 'carousel') {
    return (
      <section className={`py-12 bg-gray-50 ${className}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="space-y-6">
            {displayTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600"
              >
                <div className="flex items-start gap-4">
                  <Quote className="h-10 w-10 text-blue-200 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-lg text-gray-700 mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {testimonial.savings && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
                          <TrendingUp className="h-5 w-5" />
                          <span>{testimonial.savings}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  // Default variant - inline callout
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-r-lg p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <Quote className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Real Customer Results
          </h3>
          
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="mb-4 last:mb-0">
              <blockquote className="text-gray-700 mb-2 italic">
                "{testimonial.quote}"
              </blockquote>
              
              {testimonial.savings && (
                <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{testimonial.savings}</span>
                </div>
              )}
              
              <p className="text-sm text-gray-600">
                — {testimonial.author}, {testimonial.role} at {testimonial.company}
              </p>
            </div>
          ))}
          
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm mt-4"
          >
            View More Customer Stories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};


