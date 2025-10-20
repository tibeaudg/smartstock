// Component added by Ansh - github.com/ansh-dhanani
import React, { useEffect, useRef } from 'react';

interface GradualBlurProps {
  target?: 'parent' | 'window';
  position?: 'top' | 'bottom' | 'left' | 'right';
  height?: string;
  strength?: number;
  divCount?: number;
  curve?: 'linear' | 'bezier' | 'exponential';
  exponential?: boolean;
  opacity?: number;
}

const GradualBlur: React.FC<GradualBlurProps> = ({
  target = 'parent',
  position = 'bottom',
  height = '6rem',
  strength = 2,
  divCount = 5,
  curve = 'bezier',
  exponential = true,
  opacity = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing blur divs
    container.innerHTML = '';

    // For viewport-wide effect, we'll create a fixed positioned overlay
    if (target === 'window') {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.right = '0';
      overlay.style.bottom = '0';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '9999';
      overlay.id = 'viewport-blur-overlay';
      
      // Remove any existing overlay
      const existingOverlay = document.getElementById('viewport-blur-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      document.body.appendChild(overlay);
      
      // Use the overlay as container for viewport-wide effect
      const blurContainer = overlay;
      
      // Create blur divs in the overlay
      for (let i = 0; i < divCount; i++) {
        const div = document.createElement('div');
        
        const heightValue = parseFloat(height.replace(/[^\d.]/g, ''));
        const heightUnit = height.replace(/[\d.]/g, '');
        const individualHeight = heightValue / divCount;

        let blurStrength;
        const progress = i / (divCount - 1);
        
        switch (curve) {
          case 'linear':
            blurStrength = progress * strength;
            break;
          case 'bezier':
            blurStrength = progress * progress * (3 - 2 * progress) * strength;
            break;
          case 'exponential':
            blurStrength = exponential 
              ? Math.pow(progress, 2) * strength
              : progress * strength;
            break;
          default:
            blurStrength = progress * strength;
        }

        const positionStyles: React.CSSProperties = {
          position: 'absolute',
          width: '100%',
          height: `${individualHeight}${heightUnit}`,
          backdropFilter: `blur(${blurStrength}px)`,
          WebkitBackdropFilter: `blur(${blurStrength}px)`,
          opacity: opacity,
          pointerEvents: 'none',
          zIndex: 9999
        };

        switch (position) {
          case 'top':
            (positionStyles as any).top = `${i * individualHeight}${heightUnit}`;
            break;
          case 'bottom':
            (positionStyles as any).bottom = `${(divCount - 1 - i) * individualHeight}${heightUnit}`;
            break;
          case 'left':
            (positionStyles as any).left = `${i * individualHeight}${heightUnit}`;
            positionStyles.width = `${individualHeight}${heightUnit}`;
            positionStyles.height = '100%';
            break;
          case 'right':
            (positionStyles as any).right = `${(divCount - 1 - i) * individualHeight}${heightUnit}`;
            positionStyles.width = `${individualHeight}${heightUnit}`;
            positionStyles.height = '100%';
            break;
        }

        Object.assign(div.style, positionStyles);
        blurContainer.appendChild(div);
      }

      // Cleanup function
      return () => {
        const overlayToRemove = document.getElementById('viewport-blur-overlay');
        if (overlayToRemove) {
          overlayToRemove.remove();
        }
      };
    } else {
      // Parent target logic (original implementation)
      // Parse height value to get numeric value
      const heightValue = parseFloat(height.replace(/[^\d.]/g, ''));
      const heightUnit = height.replace(/[\d.]/g, '');

      // Calculate individual div heights
      const individualHeight = heightValue / divCount;

      // Create blur divs for parent target
      for (let i = 0; i < divCount; i++) {
      const div = document.createElement('div');
      
      // Calculate blur strength based on curve
      let blurStrength;
      const progress = i / (divCount - 1);
      
      switch (curve) {
        case 'linear':
          blurStrength = progress * strength;
          break;
        case 'bezier':
          blurStrength = progress * progress * (3 - 2 * progress) * strength;
          break;
        case 'exponential':
          blurStrength = exponential 
            ? Math.pow(progress, 2) * strength
            : progress * strength;
          break;
        default:
          blurStrength = progress * strength;
      }

      // Position and style the div based on position prop
      const positionStyles: React.CSSProperties = {
        position: 'absolute',
        width: '100%',
        height: `${individualHeight}${heightUnit}`,
        backdropFilter: `blur(${blurStrength}px)`,
        WebkitBackdropFilter: `blur(${blurStrength}px)`,
        opacity: opacity,
        pointerEvents: 'none',
        zIndex: 9999
      };

      // Apply position-specific styles
      switch (position) {
        case 'top':
          (positionStyles as any).top = `${i * individualHeight}${heightUnit}`;
          break;
        case 'bottom':
          (positionStyles as any).bottom = `${(divCount - 1 - i) * individualHeight}${heightUnit}`;
          break;
        case 'left':
          (positionStyles as any).left = `${i * individualHeight}${heightUnit}`;
          positionStyles.width = `${individualHeight}${heightUnit}`;
          positionStyles.height = '100%';
          break;
        case 'right':
          (positionStyles as any).right = `${(divCount - 1 - i) * individualHeight}${heightUnit}`;
          positionStyles.width = `${individualHeight}${heightUnit}`;
          positionStyles.height = '100%';
          break;
      }

      // Apply styles to the div
      Object.assign(div.style, positionStyles);
      
      container.appendChild(div);
      }
    }
  }, [target, position, height, strength, divCount, curve, exponential, opacity]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default GradualBlur;
