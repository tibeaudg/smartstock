import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export interface Badge {
  icon?: React.ReactNode;
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

interface SeoPageHeroProps {
  title: string | React.ReactNode;
  description: string;
  badges?: Badge[];
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  className?: string;
}

export const SeoPageHero: React.FC<SeoPageHeroProps> = ({
  title,
  description,
  badges = [],
  ctaText,
  ctaLink = '/auth',
  secondaryCtaText,
  secondaryCtaLink,
  backgroundImage,
  className = ''
}) => {
  const badgeVariants = {
    default: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <header
      className={`relative py-16 sm:py-20 md:py-28 px-4 overflow-hidden ${className}`}
      itemScope
      itemType="https://schema.org/WebPage"
      aria-label="Hero section for SEO landing page"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }
          : {}
      }
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      )}

      <div className={`relative max-w-6xl mx-auto text-center ${backgroundImage ? 'text-white' : 'text-gray-900'}`}>
        
        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-3 mb-8" aria-label="Feature highlights">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-300 ${
                  backgroundImage
                    ? 'bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30'
                    : badgeVariants[badge.variant || 'default']
                }`}
              >
                {badge.icon && <span>{badge.icon}</span>}
                {badge.text}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          itemProp="headline"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
        >
          {title}
        </h1>

        {/* Description */}
        <p
          itemProp="description"
          className={`text-lg md:text-xl lg:text-2xl mb-10 mx-auto max-w-3xl leading-relaxed ${
            backgroundImage ? 'text-gray-100' : 'text-gray-700'
          }`}
        >
          {description}
        </p>

        {/* CTA Buttons */}
        {(ctaText || secondaryCtaText) && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {ctaText && (
              <Link
                to={ctaLink}
                rel="nofollow"
                className={`inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg shadow-md transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                  backgroundImage
                    ? 'bg-white text-blue-700 hover:bg-gray-100'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                {ctaText}
              </Link>
            )}
            {secondaryCtaText && (
              <Link
                to={secondaryCtaLink || '#'}
                className={`inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 ${
                  backgroundImage
                    ? 'bg-white/20 text-white border border-white/40 hover:bg-white/30'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {secondaryCtaText}
              </Link>
            )}
          </div>
        )}

        {/* Trust / Proof Section */}
        {ctaText && (
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
            {[
              'No credit card required',
              'Free trial available',
              'Cancel anytime'
            ].map((text, i) => (
              <div key={i} className={`flex items-center gap-2 ${backgroundImage ? 'text-gray-200' : 'text-gray-600'}`}>
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default SeoPageHero;
