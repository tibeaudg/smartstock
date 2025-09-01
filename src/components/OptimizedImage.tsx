import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false
}) => {
  // Generate optimized image paths
  const getOptimizedSrc = (originalSrc: string, format: string) => {
    const pathParts = originalSrc.split('.');
    const extension = pathParts.pop();
    const baseName = pathParts.join('.');
    
    // Check if optimized version exists
    const optimizedPath = originalSrc.replace(`.${extension}`, `.${format}`);
    return optimizedPath;
  };

  const webpSrc = getOptimizedSrc(src, 'webp');
  const avifSrc = getOptimizedSrc(src, 'avif');
  const originalSrc = src;

  return (
    <picture>
      {/* AVIF format (best compression, modern browsers) */}
      <source
        srcSet={avifSrc}
        type="image/avif"
      />
      
      {/* WebP format (good compression, wide support) */}
      <source
        srcSet={webpSrc}
        type="image/webp"
      />
      
      {/* Original format as fallback */}
      <img
        src={originalSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding={priority ? 'sync' : 'async'}
        style={{
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
        }}
      />
    </picture>
  );
};

export default OptimizedImage; 
