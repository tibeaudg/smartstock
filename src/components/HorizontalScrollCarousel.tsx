import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollCarouselProps {
  children: React.ReactNode[];
  desktopCardsVisible?: number;
  mobileCardsVisible?: number;
  cardSpacing?: number;
  showArrows?: boolean;
  showDots?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
  cardClassName?: string;
}

export default function HorizontalScrollCarousel({
  children,
  desktopCardsVisible = 3,
  mobileCardsVisible = 1,
  cardSpacing = 32,
  showArrows = true,
  showDots = true,
  autoplay = false,
  autoplayDelay = 5000,
  className = '',
  cardClassName = '',
}: HorizontalScrollCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update container width and responsive settings - optimized with RAF and debouncing
  useEffect(() => {
    let rafId: number | null = null;
    let resizeTimeout: NodeJS.Timeout;
    
    const updateDimensions = () => {
      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Batch layout reads in RAF
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(() => {
          if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            setContainerWidth(width);
            setIsMobile(width < 768);
          }
        });
      }, 150); // Debounce for 150ms
    };

    // Initial calculation with RAF
    rafId = requestAnimationFrame(() => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        setIsMobile(width < 768);
      }
    });
    
    window.addEventListener('resize', updateDimensions, { passive: true });
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(resizeTimeout);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Update card width based on container and cards visible
  useEffect(() => {
    if (containerWidth > 0) {
      const cardsVisible = isMobile ? mobileCardsVisible : desktopCardsVisible;
      // Handle fractional cards (like 2.5) by using ceiling to calculate proper width
      const effectiveCards = Math.ceil(cardsVisible);
      const calculatedWidth = (containerWidth - (cardSpacing * (effectiveCards - 1))) / cardsVisible;
      setCardWidth(Math.max(calculatedWidth, 280)); // Minimum card width
    }
  }, [containerWidth, isMobile, desktopCardsVisible, mobileCardsVisible, cardSpacing]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoplay || isHovered || isDragging) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % children.length);
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, isDragging, children.length]);

  const maxIndex = Math.max(0, children.length - (isMobile ? mobileCardsVisible : desktopCardsVisible));

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;
    
    const scrollAmount = index * (cardWidth + cardSpacing);
    scrollRef.current.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }, [cardWidth, cardSpacing]);

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex, scrollToIndex]);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Touch and drag handling
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    // Batch layout reads in RAF
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    // Use cached startX (which already includes offsetLeft) to avoid layout read
    // Calculate relative movement without reading offsetLeft again
    const walk = (e.pageX - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const touch = e.touches[0];
    // Batch layout reads in RAF
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        setStartX(touch.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
      }
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const touch = e.touches[0];
    // Use cached startX (which already includes offsetLeft) to avoid layout read
    // Calculate relative movement without reading offsetLeft again
    const walk = (touch.pageX - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  // Scroll snap effect - optimized with RAF batching
  useEffect(() => {
    let rafId: number | null = null;
    
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      // Batch layout reads in RAF
      rafId = requestAnimationFrame(() => {
        if (!scrollRef.current) return;
        const scrollLeft = scrollRef.current.scrollLeft;
        const index = Math.round(scrollLeft / (cardWidth + cardSpacing));
        if (index !== currentIndex && index >= 0 && index <= maxIndex) {
          setCurrentIndex(index);
        }
      });
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }
  }, [cardWidth, cardSpacing, currentIndex, maxIndex]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Horizontal scrolling carousel"
        aria-live="polite"
      >
        {children.map((child, index) => (
          <motion.div
            key={index}
            className={`flex-shrink-0 ${cardClassName}`}
            style={{
              width: cardWidth,
              scrollSnapAlign: 'start',
              marginRight: index < children.length - 1 ? cardSpacing : 0,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {child}
          </motion.div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && children.length > (isMobile ? mobileCardsVisible : desktopCardsVisible) && (
        <>
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 
              bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200
              ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 
              bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200
              ${currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </>
      )}

      {/* Navigation dots */}
      {showDots && children.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2" role="tablist" aria-label="Carousel navigation">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Gradient fade edges */}
      <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-5" />
      <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-5" />
    </div>
  );
}
