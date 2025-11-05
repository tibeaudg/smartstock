import React, { ReactNode, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import Lenis from 'lenis';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full max-w-5xl mx-auto my-12 p-8 sm:p-12 rounded-[40px] border border-gray-200/50 bg-white shadow-lg hover:shadow-xl transition-all duration-300 origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
      opacity: 0,
      pointerEvents: 'auto'
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

interface TransformData {
  translateY: number;
  scale: number;
  rotation: number;
  opacity: number;
  filter: string;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef<Map<number, TransformData>>(new Map());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (start >= end) return 0;
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return Math.max(0, Math.min(1, (scrollTop - start) / (end - start)));
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string) || 0;
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  // Simplified and more performant card transform update
  // Optimized to batch all layout reads before any writes
  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    
    try {
      // Batch all layout reads first (before any DOM writes)
      const { scrollTop, containerHeight } = getScrollData();
      const stackPositionPx = parsePercentage(stackPosition, containerHeight);
      const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

      // Get end element position
      const endElement = useWindowScroll
        ? (document.querySelector('.scroll-stack-end') as HTMLElement | null)
        : (scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement | null);
      const endElementTop = endElement ? getElementOffset(endElement) : 0;

      // Batch all card position reads together
      const cardPositions = cardsRef.current.map((card) => {
        if (!card) return null;
        return {
          element: card,
          cardTop: getElementOffset(card)
        };
      }).filter(Boolean) as Array<{ element: HTMLElement; cardTop: number }>;

      // Process each card using pre-read positions
      cardPositions.forEach(({ element: card, cardTop }, i) => {
        const triggerStart = cardTop - stackPositionPx - (itemStackDistance * i);
        const triggerEnd = cardTop - scaleEndPositionPx;
        const pinStart = triggerStart;
        const pinEnd = endElementTop - containerHeight / 2;

        // Calculate visibility - simpler logic
        const isInTriggerRange = scrollTop >= triggerStart && scrollTop <= triggerEnd + containerHeight;
        const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
        
        // Calculate transforms
        const targetScale = Math.max(baseScale, baseScale + (i * itemScale));
        const scale = isInTriggerRange ? 1 - scaleProgress * (1 - targetScale) : baseScale;
        const rotation = rotationAmount ? (i * rotationAmount * scaleProgress) : 0;

        // Calculate positioning
        let translateY = 0;
        const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

        if (isPinned) {
          translateY = scrollTop - cardTop + stackPositionPx + (itemStackDistance * i);
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackPositionPx + (itemStackDistance * i);
        }

        // Prepare transform data
        const newTransform: TransformData = {
          translateY: Math.round(translateY * 100) / 100,
          scale: Math.round(scale * 1000) / 1000,
          rotation: Math.round(rotation * 100) / 100,
          opacity: isInTriggerRange ? 1 : 0,
          filter: isInTriggerRange ? '' : `blur(${blurAmount}px)`
        };

        // Check if update is needed (performance optimization)
        const lastTransform = lastTransformsRef.current.get(i);
        const shouldUpdate = !lastTransform || 
          Math.abs(lastTransform.translateY - newTransform.translateY) > 0.5 ||
          Math.abs(lastTransform.scale - newTransform.scale) > 0.005 ||
          Math.abs(lastTransform.rotation - newTransform.rotation) > 0.5 ||
          Math.abs((lastTransform.opacity || 0) - newTransform.opacity) > 0.01;

        if (shouldUpdate) {
          const transformString = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
          
          card.style.transform = transformString;
          card.style.opacity = newTransform.opacity.toString();
          card.style.filter = newTransform.filter;
          card.style.pointerEvents = isInTriggerRange ? 'auto' : 'none';

          lastTransformsRef.current.set(i, newTransform);
        }

        // Handle stack completion callback
        if (i === cardsRef.current.length - 1 && isInTriggerRange && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (i === cardsRef.current.length - 1 && !isInTriggerRange && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      });
    } catch (error) {
      console.warn('ScrollStack update error:', error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset
  ]);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) return;
    
    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null;
      updateCardTransforms();
    });
  }, [updateCardTransforms]);

  // Setup Lenis smooth scrolling
  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.1
      });

      lenis.on('scroll', handleScroll);
      
      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return null;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
        infinite: false,
        gestureOrientation: 'vertical',
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.1
      });

      lenis.on('scroll', handleScroll);
      
      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  // Initialize scroll stack
  useLayoutEffect(() => {
    const initializeScrollStack = () => {
      // Get all cards
      const cards = Array.from(
        useWindowScroll
          ? document.querySelectorAll('.scroll-stack-card')
          : (scrollerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
      ) as HTMLElement[];

      if (!cards.length) return;

      cardsRef.current = cards;

      // Initialize card styles
      cards.forEach((card, i) => {
        // Set spacing between cards
        if (i < cards.length - 1) {
          card.style.marginBottom = `${itemDistance}px`;
        }
        
        // Optimize for performance
        card.style.willChange = 'transform, opacity, filter';
        card.style.transformOrigin = 'top center';
        card.style.backfaceVisibility = 'hidden';
        card.style.transform = 'translateZ(0)';
        card.style.webkitTransform = 'translateZ(0)';
        
        // Smooth transitions for opacity and filter only
        card.style.transition = 'opacity 0.3s ease-out, filter 0.3s ease-out';
        
        // Initial state - only first card visible
        if (i === 0) {
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
        }
      });

      // Setup smooth scrolling
      setupLenis();

      // Initial transform update
      requestAnimationFrame(() => {
        updateCardTransforms();
      });
    };

    // Wait for DOM to be ready
    const timeoutId = setTimeout(initializeScrollStack, 50);

    return () => {
      clearTimeout(timeoutId);
      
      // Cleanup animation frames
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Cleanup Lenis
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      
      // Reset refs
      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    useWindowScroll,
    setupLenis,
    updateCardTransforms
  ]);

  return (
    <div
      className={`relative w-full h-full ${useWindowScroll ? '' : 'overflow-y-auto overflow-x-visible'} ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: useWindowScroll ? 'auto' : 'smooth',
        ...(useWindowScroll ? {} : {
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          willChange: 'scroll-position'
        })
      }}
    >
      <div className="scroll-stack-inner pt-[20vh] px-4 sm:px-6 lg:px-8 pb-[50rem] min-h-screen">
        {children}
        {/* Spacer for proper scroll completion */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;