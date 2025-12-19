import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { testimonialQuotes, TestimonialQuote } from '@/data/testimonialQuotes';
import { cn } from '@/lib/utils';
import HorizontalScrollCarousel from '@/components/HorizontalScrollCarousel';

interface TestimonialQuotesProps {
  quotes?: TestimonialQuote[];
  variant?: 'carousel' | 'grid' | 'rotating';
  maxQuotes?: number;
  showRating?: boolean;
  showSavings?: boolean;
  className?: string;
  autoRotate?: boolean;
  rotateInterval?: number;
}

export const TestimonialQuotes: React.FC<TestimonialQuotesProps> = ({
  quotes = testimonialQuotes,
  variant = 'carousel',
  maxQuotes,
  showRating = true,
  showSavings = true,
  className = '',
  autoRotate = false,
  rotateInterval = 5000,
}) => {
  const displayQuotes = maxQuotes ? quotes.slice(0, maxQuotes) : quotes;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || variant !== 'rotating') return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayQuotes.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, displayQuotes.length, variant]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={cn(
              "h-4 w-4",
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        ))}
      </div>
    );
  };

  const renderQuoteCard = (quote: TestimonialQuote, index: number) => (
    <div
      key={quote.id}
      className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow"
    >
      {showRating && (
        <div className="mb-4">{renderStars(quote.rating)}</div>
      )}

      <Quote className="h-8 w-8 text-blue-100 mb-4" />

      <blockquote className="text-gray-700 mb-6 flex-1 italic text-sm md:text-base leading-relaxed">
        "{quote.quote}"
      </blockquote>

      {showSavings && quote.savings && (
        <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-sm font-semibold text-green-700">
            {quote.savings}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="font-semibold text-gray-900">{quote.author}</p>
          <p className="text-sm text-gray-600">
            {quote.role}, {quote.company}
          </p>
        </div>
        <Link
          to={`/customers/${quote.id}`}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          aria-label={`Read more about ${quote.author}'s story`}
        >
          Read more about {quote.author} →
        </Link>
      </div>
    </div>
  );

  if (variant === 'rotating') {
    return (
      <div className={cn("relative", className)}>
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {displayQuotes.map((quote, index) => (
              <div key={quote.id} className="w-full flex-shrink-0 px-4">
                {renderQuoteCard(quote, index)}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-6">
          {displayQuotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === currentIndex
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-gray-300"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        {displayQuotes.map((quote, index) => renderQuoteCard(quote, index))}
      </div>
    );
  }

  // Carousel variant
  return (
    <div className={cn("w-full", className)}>
      <HorizontalScrollCarousel
        desktopCardsVisible={3}
        mobileCardsVisible={1}
        cardSpacing={24}
        showArrows={true}
        showDots={true}
        autoplay={autoRotate}
      >
        {displayQuotes.map((quote, index) => (
          <div key={quote.id}>{renderQuoteCard(quote, index)}</div>
        ))}
      </HorizontalScrollCarousel>
    </div>
  );
};

