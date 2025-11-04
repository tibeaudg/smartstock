import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversionCTAProps {
  title?: string;
  description?: string;
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
  variant?: 'default' | 'hero' | 'inline' | 'footer';
  trustElements?: string[];
  showTrustBadges?: boolean;
  className?: string;
}

export const ConversionCTA: React.FC<ConversionCTAProps> = ({
  title = 'Start Managing Your Inventory Today',
  description = 'Join thousands of businesses using StockFlow to streamline their inventory management.',
  primaryText = 'Start Free Trial',
  primaryLink = '/auth',
  secondaryText,
  secondaryLink,
  variant = 'default',
  trustElements = [
    'No credit card required',
    '14-day free trial',
    'Cancel anytime'
  ],
  showTrustBadges = true,
  className = '',
}) => {
  const baseClasses = 'w-full';
  
  const variantClasses = {
    hero: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 md:p-12 shadow-xl',
    default: 'bg-blue-50 border-2 border-blue-200 rounded-lg p-6 md:p-8',
    inline: 'bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6',
    footer: 'bg-gray-900 text-white rounded-lg p-6'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="flex flex-col items-center text-center space-y-4">
        {variant === 'hero' && (
          <Sparkles className="h-8 w-8 mb-2 text-yellow-300" />
        )}
        
        <h3 className={`font-bold ${
          variant === 'hero' ? 'text-3xl md:text-4xl' : 
          variant === 'footer' ? 'text-2xl text-white' :
          'text-2xl md:text-3xl'
        }`}>
          {title}
        </h3>
        
        {description && (
          <p className={`max-w-2xl ${
            variant === 'hero' ? 'text-lg md:text-xl text-blue-50' :
            variant === 'footer' ? 'text-gray-300' :
            'text-gray-600'
          }`}>
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            asChild
            size="lg"
            className={`${
              variant === 'hero' ? 'bg-white text-blue-600 hover:bg-blue-50' :
              variant === 'footer' ? 'bg-blue-600 hover:bg-blue-700' :
              'bg-blue-600 hover:bg-blue-700'
            } text-lg px-8 py-6`}
          >
            <Link to={primaryLink}>
              {primaryText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          {secondaryText && secondaryLink && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className={`${
                variant === 'hero' ? 'border-white text-white hover:bg-white/10' :
                variant === 'footer' ? 'border-gray-400 text-gray-300 hover:bg-gray-800' :
                'border-gray-300'
              } text-lg px-8 py-6`}
            >
              <Link to={secondaryLink}>
                {secondaryText}
              </Link>
            </Button>
          )}
        </div>

        {showTrustBadges && trustElements && trustElements.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-current/20">
            {trustElements.map((element, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className={`h-5 w-5 ${
                  variant === 'hero' ? 'text-yellow-300' :
                  variant === 'footer' ? 'text-green-400' :
                  'text-green-600'
                }`} />
                <span className={`text-sm ${
                  variant === 'hero' ? 'text-blue-50' :
                  variant === 'footer' ? 'text-gray-300' :
                  'text-gray-600'
                }`}>
                  {element}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionCTA;
