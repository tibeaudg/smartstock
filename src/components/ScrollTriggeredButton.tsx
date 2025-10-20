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
          
        }
        
      },
      { threshold: 0.1, rootMargin: '-10% 0px -10% 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasTriggered, isMobile]);

  return (
    <Component
      ref={ref}
      className={`relative overflow-hidden ${className} ${
        isAnimating ? 'animate-pulse' : ''
      }`}
      {...(rest as any)}
    >
      {children}
      
      {/* Attention-grabbing overlay animation */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-white/30 to-blue-400/20"
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
      
      {/* Subtle glow effect */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          initial={{ boxShadow: '0 0 0px rgba(59, 130, 246, 0.5)' }}
          animate={{ 
            boxShadow: [
              '0 0 0px rgba(59, 130, 246, 0.5)',
              '0 0 20px rgba(59, 130, 246, 0.8)',
              '0 0 0px rgba(59, 130, 246, 0.5)',
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </Component>
  );
};

export default ScrollTriggeredButton;
