/**
 * Image optimization utilities
 * 
 * This module provides helper functions for serving optimized images
 * with responsive srcsets and modern formats (WebP/AVIF).
 * 
 * To use optimized images:
 * 1. Create optimized versions of images in /public/logos/ and /public/gallery/
 * 2. Use the getOptimizedImageSrc function to generate srcset attributes
 * 3. Images should be created in multiple sizes: 1x, 2x, 3x for logos
 *    and mobile (640w), tablet (1024w), desktop (1920w) for gallery images
 */

export interface ImageSizes {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

export interface LogoImageSizes {
  '1x': number;
  '2x': number;
  '3x': number;
}

/**
 * Generate srcset for responsive gallery images
 * @param basePath - Base path to the image (without extension)
 * @param sizes - Object with mobile, tablet, desktop widths
 * @returns srcset string for use in <img srcset>
 */
export function getResponsiveImageSrcset(
  basePath: string,
  sizes: ImageSizes = { mobile: 640, tablet: 1024, desktop: 1920 }
): string {
  const srcset: string[] = [];
  
  // Generate WebP srcset
  if (sizes.mobile) {
    srcset.push(`${basePath}-mobile.webp ${sizes.mobile}w`);
  }
  if (sizes.tablet) {
    srcset.push(`${basePath}-tablet.webp ${sizes.tablet}w`);
  }
  if (sizes.desktop) {
    srcset.push(`${basePath}-desktop.webp ${sizes.desktop}w`);
  }
  
  return srcset.join(', ');
}

/**
 * Generate srcset for logo images (retina displays)
 * @param basePath - Base path to the image (without extension)
 * @param sizes - Object with 1x, 2x, 3x sizes
 * @returns srcset string for use in <img srcset>
 */
export function getLogoImageSrcset(
  basePath: string,
  sizes: LogoImageSizes = { '1x': 96, '2x': 192, '3x': 288 }
): string {
  const srcset: string[] = [];
  
  // Generate WebP srcset for retina displays
  srcset.push(`${basePath}-1x.webp ${sizes['1x']}w`);
  srcset.push(`${basePath}-2x.webp ${sizes['2x']}w`);
  srcset.push(`${basePath}-3x.webp ${sizes['3x']}w`);
  
  return srcset.join(', ');
}

/**
 * Get the appropriate sizes attribute for responsive images
 * @param isLogo - Whether this is a logo (smaller sizes) or gallery image
 * @returns sizes attribute string
 */
export function getImageSizes(isLogo: boolean = false): string {
  if (isLogo) {
    // Logos are displayed at fixed sizes: 48px (mobile), 80px (tablet), 96px (desktop)
    return '(max-width: 768px) 48px, (max-width: 1024px) 80px, 96px';
  }
  // Gallery images are responsive
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

/**
 * Get optimized image source with fallback
 * @param originalPath - Original image path (e.g., "/logo.png")
 * @param useWebP - Whether to prefer WebP format
 * @returns Optimized image path
 */
export function getOptimizedImageSrc(originalPath: string, useWebP: boolean = true): string {
  if (!useWebP) {
    return originalPath;
  }
  
  // Try to use WebP version if available
  const webpPath = originalPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  // In production, you would check if the file exists
  // For now, return the original path - replace with optimized versions when available
  return originalPath;
}

/**
 * Image optimization instructions:
 * 
 * LOGO IMAGES (in /public/logos/):
 * - Create WebP versions: logo-name-1x.webp (96x48), logo-name-2x.webp (192x96), logo-name-3x.webp (288x144)
 * - Keep original PNG as fallback: logo-name.png
 * 
 * GALLERY IMAGES (in /public/gallery/):
 * - Create WebP versions: image-name-mobile.webp (640w), image-name-tablet.webp (1024w), image-name-desktop.webp (1920w)
 * - Optionally create AVIF versions for even better compression
 * - Keep original PNG as fallback: image-name.png
 * 
 * TOOLS FOR OPTIMIZATION:
 * - Use sharp (Node.js) or ImageMagick for batch processing
 * - Use squoosh.app for manual optimization
 * - Target: <50KB for logos, <200KB for gallery images
 */

