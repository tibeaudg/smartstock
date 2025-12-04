import React from 'react';
import { CustomerLogos } from './CustomerLogos';
import { ReviewBadges } from './ReviewBadges';
import { TestimonialQuotes } from './TestimonialQuotes';
import { CaseStudyThumbnails } from './CaseStudyThumbnails';
import { cn } from '@/lib/utils';

interface TrustSignalsSectionProps {
  showLogos?: boolean;
  showBadges?: boolean;
  showQuotes?: boolean;
  showCaseStudies?: boolean;
  layout?: 'stacked' | 'side-by-side' | 'compact';
  className?: string;
  logosVariant?: 'grid' | 'carousel' | 'marquee';
  logosHeading?: string;
  quotesVariant?: 'carousel' | 'grid' | 'rotating';
  maxQuotes?: number;
  maxCaseStudies?: number;
}

export const TrustSignalsSection: React.FC<TrustSignalsSectionProps> = ({
  showLogos = true,
  showBadges = true,
  showQuotes = true,
  showCaseStudies = false,
  layout = 'stacked',
  className = '',
  logosVariant = 'grid',
  logosHeading = "Trusted by leading businesses",
  quotesVariant = 'carousel',
  maxQuotes = 3,
  maxCaseStudies = 3,
}) => {
  if (layout === 'compact') {
    return (
      <section className={cn("py-8 bg-white", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {showLogos && (
              <div className="flex-1">
                <CustomerLogos
                  variant={logosVariant}
                  heading={logosHeading}
                  showHeading={false}
                  maxLogos={6}
                />
              </div>
            )}
            {showBadges && (
              <div className="flex-shrink-0">
                <ReviewBadges variant="compact" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'side-by-side') {
    return (
      <section className={cn("py-12 bg-white", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {showLogos && (
              <div>
                <CustomerLogos
                  variant={logosVariant}
                  heading={logosHeading}
                  className="mb-8"
                />
              </div>
            )}
            {showBadges && (
              <div>
                <ReviewBadges variant="vertical" />
              </div>
            )}
          </div>

          {showQuotes && (
            <div className="mt-12">
              <TestimonialQuotes
                variant={quotesVariant}
                maxQuotes={maxQuotes}
              />
            </div>
          )}

          {showCaseStudies && (
            <div className="mt-12">
              <CaseStudyThumbnails maxStudies={maxCaseStudies} />
            </div>
          )}
        </div>
      </section>
    );
  }

  // Stacked layout (default)
  return (
    <section className={cn("py-12 bg-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showLogos && (
          <div className="mb-12">
            <CustomerLogos variant={logosVariant} heading={logosHeading} />
          </div>
        )}

        {showBadges && (
          <div className="mb-12 flex justify-center">
            <ReviewBadges variant="horizontal" />
          </div>
        )}

        {showQuotes && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
              What Our Customers Say
            </h2>
            <TestimonialQuotes variant={quotesVariant} maxQuotes={maxQuotes} />
          </div>
        )}

        {showCaseStudies && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
              Success Stories
            </h2>
            <CaseStudyThumbnails maxStudies={maxCaseStudies} />
          </div>
        )}
      </div>
    </section>
  );
};

