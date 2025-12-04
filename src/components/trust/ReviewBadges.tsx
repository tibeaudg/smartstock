import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { reviewBadges, ReviewBadge } from '@/data/reviewBadges';
import { cn } from '@/lib/utils';

interface ReviewBadgesProps {
  badges?: ReviewBadge[];
  variant?: 'horizontal' | 'vertical' | 'compact';
  showRating?: boolean;
  showReviewCount?: boolean;
  className?: string;
}

export const ReviewBadges: React.FC<ReviewBadgesProps> = ({
  badges = reviewBadges,
  variant = 'horizontal',
  showRating = true,
  showReviewCount = true,
  className = '',
}) => {
  const getPlatformStyles = (platform: 'G2' | 'Capterra') => {
    if (platform === 'G2') {
      return {
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-900',
        badgeColor: 'bg-purple-600',
        hoverColor: 'hover:bg-purple-100',
      };
    } else {
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-900',
        badgeColor: 'bg-green-600',
        hoverColor: 'hover:bg-green-100',
      };
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <div key={index} className="relative h-4 w-4">
                <Star className="absolute h-4 w-4 fill-gray-300 text-gray-300" />
                <Star className="absolute h-4 w-4 fill-yellow-400 text-yellow-400 clip-path-half" />
              </div>
            );
          } else {
            return (
              <Star
                key={index}
                className="h-4 w-4 fill-gray-300 text-gray-300"
              />
            );
          }
        })}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap items-center gap-4", className)}>
        {badges.map((badge, index) => {
          const styles = getPlatformStyles(badge.platform);
          return (
            <a
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
                styles.bgColor,
                styles.borderColor,
                styles.hoverColor
              )}
            >
              <span className={cn("text-sm font-semibold", styles.textColor)}>
                {badge.platform}
              </span>
              {showRating && (
                <span className="text-sm font-medium text-gray-700">
                  {badge.rating.toFixed(1)}
                </span>
              )}
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-4 md:gap-6",
        variant === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
    >
      {badges.map((badge, index) => {
        const styles = getPlatformStyles(badge.platform);
        return (
          <a
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex flex-col gap-3 px-6 py-4 rounded-xl border transition-all hover:shadow-md",
              styles.bgColor,
              styles.borderColor,
              styles.hoverColor,
              "min-w-[200px]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn("text-lg font-bold", styles.textColor)}>
                {badge.platform}
              </span>
              {badge.badgeText && (
                <span
                  className={cn(
                    "px-2 py-1 rounded text-xs font-semibold text-white",
                    styles.badgeColor
                  )}
                >
                  {badge.badgeText}
                </span>
              )}
            </div>

            {showRating && (
              <div className="flex items-center gap-2">
                {renderStars(badge.rating)}
                <span className="text-lg font-bold text-gray-900">
                  {badge.rating.toFixed(1)}
                </span>
              </div>
            )}

            {showReviewCount && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{badge.reviewCount}+ reviews</span>
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
};

