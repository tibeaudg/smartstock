import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
  className?: string;
}

/**
 * OptimizedImage component with automatic lazy loading and performance optimizations
 * - Uses native lazy loading for images below the fold
 * - Adds proper width/height to prevent CLS
 * - Supports priority loading for above-the-fold images
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  ...props
}) => {
  // Use eager loading for priority images (above the fold), lazy for others
  const loading = priority ? 'eager' : 'lazy';
  
  // Determine if we should use fetchpriority="high" for LCP images
  const fetchPriority = priority ? 'high' : 'auto';
  
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchpriority={fetchPriority}
      decoding="async"
      className={className}
      {...props}
    />
  );
};

export default OptimizedImage;

