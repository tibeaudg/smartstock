import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useWindowSize';

type ScrollTriggeredButtonProps<T extends React.ElementType = 'button'> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
};

const ScrollTriggeredButton = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  children,
  ...rest
}: ScrollTriggeredButtonProps<T>) => {
  const [hasTriggered, setHasTriggered] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const ref = React.useRef(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  const Component = as || 'button';

  React.useEffect(() => {
    if (isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation when button scrolls out of view (past it)
        if (!entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          setIsAnimating(true);
          
          // Set up interval to retrigger animation every 10 seconds with proper cleanup
          const startInterval = () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            
            intervalRef.current = setInterval(() => {
              setIsAnimating(false);
              setTimeout(() => setIsAnimating(true), 100);
            }, 5000);
          };
          
          startInterval();
        }
        
      },
      { threshold: 0.1, rootMargin: '-10% 0px -10% 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasTriggered, isMobile]);

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Component
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      {...(rest as any)}
    >
      {/* Pulsation effect */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
      
      {children}
      
      {/* Shimmer effect */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), rgba(255, 255, 255, 0.6), rgba(59, 130, 246, 0.4), transparent)'
          }}
        />
      )}
      
      {/* Enhanced shadow and glow effect */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{ 
            boxShadow: [
              '0 0 0px rgba(59, 130, 246, 0)',
              '0 0 15px rgba(59, 130, 246, 0.4)',
              '0 0 25px rgba(59, 130, 246, 0.6)',
              '0 0 15px rgba(59, 130, 246, 0.4)',
              '0 0 0px rgba(59, 130, 246, 0)',
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </Component>
  );
};

export default ScrollTriggeredButton;
