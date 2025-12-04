import React from 'react';
import { customerLogos, CustomerLogo } from '@/data/customerLogos';
import { cn } from '@/lib/utils';

interface CustomerLogosProps {
  logos?: CustomerLogo[];
  variant?: 'grid' | 'carousel' | 'marquee';
  heading?: string;
  showHeading?: boolean;
  className?: string;
  logoClassName?: string;
  maxLogos?: number;
}

export const CustomerLogos: React.FC<CustomerLogosProps> = ({
  logos = customerLogos,
  variant = 'grid',
  heading = "Trusted by leading businesses",
  showHeading = true,
  className = '',
  logoClassName = '',
  maxLogos,
}) => {
  const displayLogos = maxLogos ? logos.slice(0, maxLogos) : logos;

  const renderGrid = () => (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center", className)}>
      {displayLogos.map((logo, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300",
            logoClassName
          )}
        >
          <img
            src={logo.logo}
            alt={`${logo.name} logo`}
            className="h-8 md:h-10 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );

  const renderCarousel = () => {
    const duplicatedLogos = [...displayLogos, ...displayLogos];
    
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <div className="flex animate-scroll gap-12 md:gap-16 items-center">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className={cn(
                "flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300",
                logoClassName
              )}
            >
              <img
                src={logo.logo}
                alt={`${logo.name} logo`}
                className="h-8 md:h-10 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        {/* Gradient fade edges */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>
    );
  };

  const renderMarquee = () => (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="flex animate-scroll gap-12 md:gap-16 items-center">
        {[...displayLogos, ...displayLogos].map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className={cn(
              "flex-shrink-0 flex items-center justify-center opacity-60",
              logoClassName
            )}
          >
            <img
              src={logo.logo}
              alt={`${logo.name} logo`}
              className="h-8 md:h-10 lg:h-12 w-auto object-contain grayscale"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      
      {/* Gradient fade edges */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
    </div>
  );

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <div className="text-center mb-8 md:mb-12">
            <p className="text-sm md:text-base font-medium text-gray-600">
              {heading}
            </p>
          </div>
        )}
        
        {variant === 'grid' && renderGrid()}
        {variant === 'carousel' && renderCarousel()}
        {variant === 'marquee' && renderMarquee()}
      </div>
      
      <style>{`
        @keyframes scroll-logos {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll-logos 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

