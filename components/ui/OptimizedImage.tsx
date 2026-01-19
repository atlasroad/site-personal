'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { 
  generateImageMetadata, 
  optimizeUnsplashUrl, 
  generateBlurDataURL,
  validateImageAccessibility,
  type ImageMetadata 
} from '@/lib/image-optimization';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  type?: 'hero' | 'before' | 'after' | 'testimonial' | 'logo' | 'profile';
  context?: {
    name?: string;
    service?: string;
    location?: string;
    description?: string;
  };
  optimizeUnsplash?: boolean;
  unsplashOptions?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'webp' | 'auto';
  };
  showAccessibilityWarnings?: boolean;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  type,
  context,
  optimizeUnsplash = true,
  unsplashOptions,
  showAccessibilityWarnings = false,
  fallbackSrc,
  className,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate optimized image metadata if type is provided
  let imageMetadata: Partial<ImageMetadata> = {};
  if (type) {
    imageMetadata = generateImageMetadata(src, type, context);
  }

  // Optimize Unsplash URLs if enabled
  let optimizedSrc = src;
  if (optimizeUnsplash && src.includes('unsplash.com')) {
    optimizedSrc = optimizeUnsplashUrl(src, unsplashOptions);
  }

  // Use metadata or provided values
  const finalSrc = imageError && fallbackSrc ? fallbackSrc : (imageMetadata.src || optimizedSrc);
  const finalAlt = imageMetadata.alt || alt;
  const finalSizes = imageMetadata.sizes || props.sizes;
  const finalQuality = imageMetadata.quality || props.quality || 80;

  // Validate accessibility if enabled
  if (showAccessibilityWarnings && process.env.NODE_ENV === 'development') {
    const validation = validateImageAccessibility(finalAlt, 'informative');
    if (!validation.isValid) {
      console.warn(`Image accessibility issues for "${finalSrc}":`, validation.warnings);
      if (validation.suggestions.length > 0) {
        console.info('Suggestions:', validation.suggestions);
      }
    }
  }

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    if (process.env.NODE_ENV === 'development') {
      console.error(`Failed to load image: ${finalSrc}`);
    }
  };

  return (
    <div className="relative">
      <Image
        {...props}
        src={finalSrc}
        alt={finalAlt}
        sizes={finalSizes}
        quality={finalQuality}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className || ''}`}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={props.placeholder || 'blur'}
        blurDataURL={
          props.blurDataURL || 
          generateBlurDataURL(10, 10, '#1f1f1f')
        }
      />
      
      {/* Loading placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center"
          style={{ aspectRatio: props.fill ? undefined : 'inherit' }}
        >
          <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {imageError && !fallbackSrc && (
        <div 
          className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-400 text-sm"
          style={{ aspectRatio: props.fill ? undefined : 'inherit' }}
        >
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 opacity-50">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p>Imagem não disponível</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized components for common use cases
export function HeroImage({ src, alt, context, ...props }: Omit<OptimizedImageProps, 'type'>) {
  return (
    <OptimizedImage
      {...props}
      src={src}
      alt={alt}
      type="hero"
      context={context}
      priority
      unsplashOptions={{ width: 1920, height: 1080, quality: 85 }}
    />
  );
}

export function TestimonialImage({ 
  src, 
  alt, 
  variant = 'before',
  clientName,
  ...props 
}: Omit<OptimizedImageProps, 'type' | 'context'> & {
  variant: 'before' | 'after';
  clientName?: string;
}) {
  return (
    <OptimizedImage
      {...props}
      src={src}
      alt={alt}
      type={variant}
      context={{ name: clientName }}
      loading="lazy"
      unsplashOptions={{ width: 400, height: 600, quality: 85 }}
    />
  );
}

export function ProfileImage({ src, alt, name, jobTitle, ...props }: Omit<OptimizedImageProps, 'type' | 'context'> & {
  name?: string;
  jobTitle?: string;
}) {
  return (
    <OptimizedImage
      {...props}
      src={src}
      alt={alt}
      type="profile"
      context={{ name, description: jobTitle }}
      loading="lazy"
      unsplashOptions={{ width: 300, height: 300, quality: 90 }}
    />
  );
}

export function LogoImage({ src, alt, ...props }: Omit<OptimizedImageProps, 'type'>) {
  return (
    <OptimizedImage
      {...props}
      src={src}
      alt={alt}
      type="logo"
      priority
      unsplashOptions={{ width: 300, height: 100, quality: 95 }}
    />
  );
}