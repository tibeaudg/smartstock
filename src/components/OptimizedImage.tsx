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
  fetchpriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  srcSet?: string;
  responsive?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  useModernFormats = true, // Default to true for better performance
  fetchpriority = 'auto',
  sizes,
  srcSet,
  responsive = true
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

  // Generate responsive srcSet for different screen sizes
  const generateSrcSet = (baseSrc: string, format: string) => {
    if (!responsive) return baseSrc;
    
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    return sizes
      .map(size => {
        const optimizedSrc = getOptimizedSrc(baseSrc, format);
        // For responsive images, we'll use the optimized directory structure
        const responsiveSrc = optimizedSrc.replace('/optimized/', `/optimized/w${size}-`);
        return `${responsiveSrc} ${size}w`;
      })
      .join(', ');
  };

  const webpSrc = getOptimizedSrc(src, 'webp');
  const avifSrc = getOptimizedSrc(src, 'avif');
  const originalSrc = src;

  // Generate responsive srcSets for modern formats
  const webpSrcSet = responsive ? generateSrcSet(src, 'webp') : webpSrc;
  const avifSrcSet = responsive ? generateSrcSet(src, 'avif') : avifSrc;
  const fallbackSrcSet = responsive ? generateSrcSet(src, 'jpeg') : originalSrc;

  // Default sizes for responsive images if not provided
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  if (useModernFormats) {
    return (
      <picture>
        <source 
          srcSet={avifSrcSet} 
          type="image/avif"
          sizes={defaultSizes}
        />
        <source 
          srcSet={webpSrcSet} 
          type="image/webp"
          sizes={defaultSizes}
        />
        <img
          src={originalSrc}
          srcSet={fallbackSrcSet}
          alt={alt}
          className={className}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding={priority ? 'sync' : 'async'}
          fetchpriority={fetchpriority}
          sizes={sizes || defaultSizes}
          style={{
            width: width ? `${width}px` : undefined,
            height: height ? `${height}px` : undefined,
            aspectRatio: width && height ? `${width}/${height}` : undefined,
          }}
        />
      </picture>
    );
  }

  return (
    <img
      src={originalSrc}
      srcSet={srcSet || (responsive ? fallbackSrcSet : undefined)}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      decoding={priority ? 'sync' : 'async'}
      fetchpriority={fetchpriority}
      sizes={sizes || (responsive ? defaultSizes : undefined)}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    />
  );
};

export default OptimizedImage; 
