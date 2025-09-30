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
  useModernFormats = false, // Temporarily disable to fix image loading
  fetchpriority = 'auto',
  sizes,
  srcSet,
  responsive = false // Temporarily disable to fix image loading
}) => {
  // For now, just return a simple img tag to ensure images load
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={fetchpriority}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    />
  );
};

export default OptimizedImage; 
