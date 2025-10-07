import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  useOptimized?: boolean; // New prop to control whether to use optimized versions
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  fetchPriority = 'auto',
  sizes,
  useOptimized = false, // Default to false until optimized images are generated
}) => {
  // For now, just return a simple img tag with all optimizations
  // The picture element with AVIF/WebP will be enabled when useOptimized=true
  
  if (!useOptimized) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding={priority ? 'sync' : 'async'}
        fetchpriority={fetchPriority}
        style={{
          width: width ? undefined : '100%',
          height: height ? undefined : 'auto',
          maxWidth: '100%',
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
      />
    );
  }

  // Generate WebP and AVIF paths from the original image (when useOptimized=true)
  const getImagePaths = (originalSrc: string) => {
    const pathWithoutLeadingSlash = originalSrc.startsWith('/') ? originalSrc.slice(1) : originalSrc;
    const pathWithoutExt = pathWithoutLeadingSlash.replace(/\.(jpg|jpeg|png)$/i, '');
    
    if (pathWithoutLeadingSlash.startsWith('optimized/')) {
      return {
        avif: `/${pathWithoutExt}.avif`,
        webp: `/${pathWithoutExt}.webp`,
        fallback: originalSrc,
      };
    }
    
    return {
      avif: `/optimized/${pathWithoutExt}.avif`,
      webp: `/optimized/${pathWithoutExt}.webp`,
      fallback: originalSrc,
    };
  };

  const { avif, webp, fallback } = getImagePaths(src);

  return (
    <picture>
      {/* AVIF format - best compression */}
      <source 
        type="image/avif" 
        srcSet={avif}
        sizes={sizes || (width ? `(max-width: 640px) 100vw, ${width}px` : undefined)}
      />
      
      {/* WebP format - good compression and wide support */}
      <source 
        type="image/webp" 
        srcSet={webp}
        sizes={sizes || (width ? `(max-width: 640px) 100vw, ${width}px` : undefined)}
      />
      
      {/* Fallback to original format */}
      <img
        src={fallback}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding={priority ? 'sync' : 'async'}
        fetchpriority={fetchPriority}
        style={{
          width: width ? undefined : '100%',
          height: height ? undefined : 'auto',
          maxWidth: '100%',
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
      />
    </picture>
  );
};

export default OptimizedImage;
