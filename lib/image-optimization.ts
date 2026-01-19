/**
 * Image Optimization Utilities
 * Provides utilities for SEO-friendly alt texts, lazy loading, and image optimization
 */

// Interface for image metadata
export interface ImageMetadata {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Interface for responsive image configuration
export interface ResponsiveImageConfig {
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  sizes: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

// Default responsive configuration
export const defaultResponsiveConfig: ResponsiveImageConfig = {
  breakpoints: {
    mobile: '(max-width: 768px)',
    tablet: '(min-width: 769px) and (max-width: 1024px)',
    desktop: '(min-width: 1025px)'
  },
  sizes: {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw'
  }
};

/**
 * Generate SEO-friendly alt text for fitness/transformation images
 */
export function generateSEOAltText(
  type: 'hero' | 'before' | 'after' | 'testimonial' | 'logo' | 'profile',
  context?: {
    name?: string;
    service?: string;
    location?: string;
    description?: string;
  }
): string {
  const { name, service, location, description } = context || {};

  // Sanitize name to only include alphanumeric characters and spaces
  const sanitizedName = name ? name.replace(/[^a-zA-Z0-9\s]/g, '').trim() : undefined;

  switch (type) {
    case 'hero':
      return `Personal trainer profissional em ação - ${service || 'Transformação corporal'} - ${location || 'São Paulo'}`;
    
    case 'before':
      return `Foto antes da transformação${sanitizedName ? ` de ${sanitizedName}` : ''} - Personal trainer PRO TRAINER - Resultados reais em 90 dias`;
    
    case 'after':
      return `Foto depois da transformação${sanitizedName ? ` de ${sanitizedName}` : ''} - Personal trainer PRO TRAINER - Resultado alcançado em 90 dias`;
    
    case 'testimonial':
      return `Depoimento de cliente${sanitizedName ? ` ${sanitizedName}` : ''} - Transformação corporal PRO TRAINER - Resultado real em 90 dias`;
    
    case 'logo':
      return 'PRO TRAINER - Personal Trainer de alta performance - Logo oficial';
    
    case 'profile':
      return `${sanitizedName || 'Personal Trainer'} - PRO TRAINER - Especialista em transformação corporal${location ? ` em ${location}` : ''}`;
    
    default:
      return description || 'PRO TRAINER - Personal Trainer de alta performance';
  }
}

/**
 * Generate responsive sizes attribute for different image contexts
 */
export function generateResponsiveSizes(
  context: 'hero' | 'testimonial' | 'gallery' | 'profile' | 'logo',
  customConfig?: Partial<ResponsiveImageConfig>
): string {
  const config = { ...defaultResponsiveConfig, ...customConfig };

  switch (context) {
    case 'hero':
      return '100vw';
    
    case 'testimonial':
      return `${config.breakpoints.mobile} 50vw, ${config.breakpoints.tablet} 33vw, 25vw`;
    
    case 'gallery':
      return `${config.breakpoints.mobile} 100vw, ${config.breakpoints.tablet} 50vw, 33vw`;
    
    case 'profile':
      return `${config.breakpoints.mobile} 80px, ${config.breakpoints.tablet} 120px, 150px`;
    
    case 'logo':
      return `${config.breakpoints.mobile} 120px, ${config.breakpoints.tablet} 150px, 200px`;
    
    default:
      return config.sizes.mobile;
  }
}

/**
 * Generate optimized image metadata for different contexts
 */
export function generateImageMetadata(
  src: string,
  type: 'hero' | 'before' | 'after' | 'testimonial' | 'logo' | 'profile',
  context?: {
    name?: string;
    service?: string;
    location?: string;
    description?: string;
    priority?: boolean;
    quality?: number;
  }
): ImageMetadata {
  // Handle null context properly
  const contextObj = context || {};
  const priority = contextObj.priority;
  const quality = contextObj.quality || 80;
  const altContext = {
    name: contextObj.name,
    service: contextObj.service,
    location: contextObj.location,
    description: contextObj.description
  };

  // Determine priority based on type if not explicitly set
  const shouldPrioritize = priority !== undefined && priority !== null ? priority : (type === 'hero' || type === 'logo');

  return {
    src,
    alt: generateSEOAltText(type, altContext),
    sizes: generateResponsiveSizes(type === 'before' || type === 'after' ? 'testimonial' : type),
    priority: shouldPrioritize,
    quality,
    placeholder: 'empty' as const
  };
}

/**
 * Optimize Unsplash URLs for better performance
 */
export function optimizeUnsplashUrl(
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'webp' | 'auto';
  } = {}
): string {
  const { width, height, quality = 80, format = 'auto' } = options;
  
  // Extract the base Unsplash URL and photo ID
  const unsplashRegex = /https:\/\/images\.unsplash\.com\/photo-([^?]+)/;
  const match = originalUrl.match(unsplashRegex);
  
  if (!match) {
    return originalUrl; // Return original if not an Unsplash URL
  }

  const photoId = match[1];
  let optimizedUrl = `https://images.unsplash.com/photo-${photoId}?`;
  
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('fit', 'crop');
  params.append('q', (quality || 80).toString());
  if (format && format !== 'auto') params.append('fm', format);
  
  // Add auto optimization parameters
  params.append('auto', 'format,compress');
  params.append('cs', 'tinysrgb');
  
  return optimizedUrl + params.toString();
}

/**
 * Generate blur placeholder data URL for images
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = '#1f1f1f'
): string {
  const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`;
}

/**
 * Image loading strategies for different contexts
 */
export const imageLoadingStrategies = {
  // Critical images that should load immediately
  critical: {
    priority: true,
    loading: 'eager' as const,
    fetchPriority: 'high' as const
  },
  
  // Above-the-fold images
  aboveFold: {
    priority: false,
    loading: 'eager' as const,
    fetchPriority: 'auto' as const
  },
  
  // Below-the-fold images (lazy loaded)
  belowFold: {
    priority: false,
    loading: 'lazy' as const,
    fetchPriority: 'auto' as const
  },
  
  // Background images
  background: {
    priority: false,
    loading: 'lazy' as const,
    fetchPriority: 'low' as const
  }
} as const;

/**
 * Validate image accessibility compliance
 */
export function validateImageAccessibility(
  alt: string,
  context: 'decorative' | 'informative' | 'functional'
): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check alt text length
  if (alt.length === 0 && context !== 'decorative') {
    warnings.push('Alt text is empty for non-decorative image');
    suggestions.push('Add descriptive alt text that explains the image content');
  }

  if (alt.length > 125) {
    warnings.push('Alt text is longer than 125 characters');
    suggestions.push('Consider shortening alt text while maintaining essential information');
  }

  // Check for redundant phrases
  const redundantPhrases = ['image of', 'picture of', 'photo of', 'graphic of'];
  const hasRedundantPhrase = redundantPhrases.some(phrase => 
    alt.toLowerCase().includes(phrase)
  );
  
  if (hasRedundantPhrase) {
    warnings.push('Alt text contains redundant phrases');
    suggestions.push('Remove phrases like "image of" or "picture of" from alt text');
  }

  // Check for SEO keywords (fitness context)
  const fitnessKeywords = ['personal trainer', 'transformação', 'fitness', 'treino'];
  const hasKeywords = fitnessKeywords.some(keyword => 
    alt.toLowerCase().includes(keyword)
  );
  
  if (!hasKeywords && context === 'informative') {
    suggestions.push('Consider adding relevant fitness/training keywords for SEO');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions
  };
}

/**
 * Generate structured data for images
 */
export function generateImageStructuredData(
  imageUrl: string,
  alt: string,
  width?: number,
  height?: number,
  caption?: string
): object {
  return {
    '@type': 'ImageObject',
    url: imageUrl,
    description: alt,
    ...(width && { width }),
    ...(height && { height }),
    ...(caption && { caption }),
    contentUrl: imageUrl,
    encodingFormat: 'image/jpeg'
  };
}

/**
 * Preload critical images
 */
export function generateImagePreloadLinks(images: Array<{
  src: string;
  type?: string;
  media?: string;
}>): string {
  return images
    .map(({ src, type = 'image/jpeg', media }) => {
      const mediaAttr = media ? ` media="${media}"` : '';
      return `<link rel="preload" as="image" href="${src}" type="${type}"${mediaAttr}>`;
    })
    .join('\n');
}