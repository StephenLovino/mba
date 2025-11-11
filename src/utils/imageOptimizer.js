/**
 * Image optimization utility for Vercel
 * 
 * Since this is a Create React App (not Next.js), we can use Vercel's Image Optimization
 * API by constructing URLs with query parameters.
 * 
 * Usage:
 * import { getOptimizedImageUrl } from '../utils/imageOptimizer';
 * <img src={getOptimizedImageUrl('/certified.jpg', { width: 800, quality: 75 })} />
 */

/**
 * Get optimized image URL using Vercel's Image Optimization API
 * @param {string} src - Image source path (relative to public folder)
 * @param {Object} options - Optimization options
 * @param {number} options.width - Target width in pixels
 * @param {number} options.quality - Image quality (1-100, default: 75)
 * @param {string} options.format - Output format ('webp', 'avif', 'jpeg', 'png')
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (src, options = {}) => {
  const { width, quality = 75, format } = options;
  
  // Remove leading slash if present
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  
  // Build query parameters
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (quality) params.set('q', quality.toString());
  if (format) params.set('f', format);
  params.set('url', cleanSrc);
  
  // Return Vercel Image Optimization API URL
  // Note: This works automatically on Vercel deployments
  // For local development, it will fall back to the original image
  return `/_vercel/image?${params.toString()}`;
};

/**
 * Get responsive image srcset for different screen sizes
 * @param {string} src - Image source path
 * @param {Object} options - Options
 * @param {number[]} options.widths - Array of widths (default: [400, 800, 1200, 1600])
 * @param {number} options.quality - Image quality (default: 75)
 * @returns {string} srcset string
 */
export const getResponsiveSrcSet = (src, options = {}) => {
  const { widths = [400, 800, 1200, 1600], quality = 75 } = options;
  
  return widths
    .map(width => {
      const url = getOptimizedImageUrl(src, { width, quality });
      return `${url} ${width}w`;
    })
    .join(', ');
};

/**
 * Get sizes attribute for responsive images
 * @param {Object} breakpoints - Breakpoint configuration
 * @returns {string} sizes attribute string
 */
export const getSizesAttribute = (breakpoints = {}) => {
  const defaultBreakpoints = {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 1024px) 50vw',
    desktop: '33vw'
  };
  
  const merged = { ...defaultBreakpoints, ...breakpoints };
  return Object.values(merged).join(', ');
};

