import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  itemsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  className = '',
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getItemsPerView = () => {
    if (isMobile) return itemsPerView.mobile;
    if (isTablet) return itemsPerView.tablet;
    return itemsPerView.desktop;
  };

  const currentItemsPerView = getItemsPerView();
  const maxIndex = Math.max(0, children.length - currentItemsPerView);
  const totalSlides = Math.ceil(children.length / currentItemsPerView);

  useEffect(() => {
    if (autoPlay && children.length > currentItemsPerView) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, maxIndex, children.length, currentItemsPerView]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Reset current index when screen size changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile, isTablet]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const renderDots = () => {
    if (!showDots || totalSlides <= 1) return null;

    return (
      <div className="flex justify-center space-x-2 mt-6" role="tablist" aria-label="Carousel navigation">
        {Array.from({ length: totalSlides }, (_, index) => {
          const isActive = index === Math.floor(currentIndex / currentItemsPerView);
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:p-0 rounded-full transition-all duration-300"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={cn(
                  'w-3 h-3 sm:w-2 sm:h-2 rounded-full transition-all duration-300',
                  isActive
                    ? 'bg-blue-600 sm:w-8 sm:h-2'
                    : 'bg-gray-300 sm:hover:bg-gray-400'
                )}
              />
            </button>
          );
        })}
      </div>
    );
  };

  if (children.length === 0) return null;

  // Als er minder items zijn dan itemsPerView, toon gewoon de items zonder carousel
  if (children.length <= currentItemsPerView) {
    return (
      <div className={cn('grid gap-6', className)}>
        <div className={cn(
          'grid gap-6',
          `grid-cols-${itemsPerView.mobile}`,
          `md:grid-cols-${itemsPerView.tablet}`,
          `lg:grid-cols-${itemsPerView.desktop}`
        )}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / currentItemsPerView)}%)`
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-3"
              style={{ 
                width: `${100 / currentItemsPerView}%`,
                minWidth: `${100 / currentItemsPerView}%`
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {renderDots()}
    </div>
  );
};

export default Carousel;
