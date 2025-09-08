import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  useModernFormats?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  useModernFormats = false
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

  if (useModernFormats) {
    return (
      <picture>
        <source srcSet={avifSrc} type="image/avif" />
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={originalSrc}
          alt={alt}
          className={className}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding={priority ? 'sync' : 'async'}
          style={
            width || height
              ? {
                  width: width ? `${width}px` : undefined,
                  height: height ? `${height}px` : undefined,
                }
              : undefined
          }
        />
      </picture>
    );
  }

  return (
    <img
      src={originalSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      decoding={priority ? 'sync' : 'async'}
      style={
        width || height
          ? {
              width: width ? `${width}px` : undefined,
              height: height ? `${height}px` : undefined,
            }
          : undefined
      }
    />
  );
};

export default OptimizedImage; 
