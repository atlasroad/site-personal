/**
 * Property-Based Tests for Image Optimization
 * Tests Property 6: Image Accessibility Compliance
 * **Validates: Requirements 3.3**
 */

import * as fc from 'fast-check';
import {
  generateSEOAltText,
  generateResponsiveSizes,
  generateImageMetadata,
  optimizeUnsplashUrl,
  validateImageAccessibility,
  generateBlurDataURL,
  generateImageStructuredData
} from '../image-optimization';

describe('Image Optimization Property Tests', () => {
  describe('Property 6: Image Accessibility Compliance', () => {
    /**
     * **Feature: site-optimization, Property 6: Image Accessibility Compliance**
     * 
     * For any image element in the application, it should include appropriate alt text 
     * and meet file size optimization requirements
     * **Validates: Requirements 3.3**
     */
    it('should generate accessible alt text for any image type and context', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('hero', 'before', 'after', 'testimonial', 'logo', 'profile'),
          fc.record({
            name: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            service: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
            location: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            description: fc.option(fc.string({ minLength: 1, maxLength: 200 }))
          }),
          (imageType, context) => {
            const altText = generateSEOAltText(imageType, context);
            
            // Property: Alt text should always be generated
            expect(altText).toBeDefined();
            expect(typeof altText).toBe('string');
            expect(altText.length).toBeGreaterThan(0);
            
            // Property: Alt text should be within reasonable length limits
            expect(altText.length).toBeLessThanOrEqual(200);
            expect(altText.length).toBeGreaterThanOrEqual(10);
            
            // Property: Alt text should contain relevant keywords for SEO
            const fitnessKeywords = ['personal trainer', 'transformação', 'fitness', 'treino', 'pro trainer'];
            const hasRelevantKeyword = fitnessKeywords.some(keyword => 
              altText.toLowerCase().includes(keyword.toLowerCase())
            );
            expect(hasRelevantKeyword).toBe(true);
            
            // Property: Alt text should not contain redundant phrases
            const redundantPhrases = ['image of', 'picture of', 'photo of', 'graphic of'];
            const hasRedundantPhrase = redundantPhrases.some(phrase => 
              altText.toLowerCase().includes(phrase.toLowerCase())
            );
            expect(hasRedundantPhrase).toBe(false);
            
            // Property: Context should be reflected in alt text when provided (except for hero and logo images)
            if (context.name && imageType !== 'hero' && imageType !== 'logo') {
              // Names are sanitized to remove special characters
              const sanitizedName = context.name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
              if (sanitizedName.length > 0) {
                expect(altText.toLowerCase()).toContain(sanitizedName.toLowerCase());
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate proper responsive sizes for any image context', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('hero', 'testimonial', 'gallery', 'profile', 'logo'),
          (context) => {
            const sizes = generateResponsiveSizes(context);
            
            // Property: Sizes should always be generated
            expect(sizes).toBeDefined();
            expect(typeof sizes).toBe('string');
            expect(sizes.length).toBeGreaterThan(0);
            
            // Property: Sizes should contain viewport width units
            expect(sizes).toMatch(/\d+(vw|px)/);
            
            // Property: Hero images should use full viewport width
            if (context === 'hero') {
              expect(sizes).toBe('100vw');
            }
            
            // Property: Other contexts should have responsive breakpoints
            if (context !== 'hero') {
              expect(sizes).toMatch(/\(.*\)/); // Should contain media queries
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should optimize Unsplash URLs while preserving image quality', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10 }).filter(id => !id.includes('?')).map(id => `https://images.unsplash.com/photo-${id}`),
          fc.record({
            width: fc.option(fc.integer({ min: 100, max: 4000 })),
            height: fc.option(fc.integer({ min: 100, max: 4000 })),
            quality: fc.option(fc.integer({ min: 1, max: 100 })),
            format: fc.option(fc.constantFrom('jpg', 'webp', 'auto'))
          }),
          (originalUrl, options) => {
            const optimizedUrl = optimizeUnsplashUrl(originalUrl, options);
            
            // Property: Optimized URL should be valid
            expect(optimizedUrl).toBeDefined();
            expect(typeof optimizedUrl).toBe('string');
            expect(optimizedUrl).toMatch(/^https:\/\/images\.unsplash\.com/);
            
            // Only test optimization parameters if the URL was actually an Unsplash URL
            if (originalUrl.match(/https:\/\/images\.unsplash\.com\/photo-[^?]+$/)) {
              // Property: URL should contain optimization parameters
              expect(optimizedUrl).toContain('?');
              expect(optimizedUrl).toContain('fit=crop');
              expect(optimizedUrl).toMatch(/auto=format(%2C|,)compress/); // Handle URL encoding
              
              // Property: Specified dimensions should be included
              if (options.width) {
                expect(optimizedUrl).toContain(`w=${options.width}`);
              }
              if (options.height) {
                expect(optimizedUrl).toContain(`h=${options.height}`);
              }
              
              // Property: Quality should be within valid range
              const qualityMatch = optimizedUrl.match(/q=(\d+)/);
              if (qualityMatch) {
                const quality = parseInt(qualityMatch[1]);
                expect(quality).toBeGreaterThanOrEqual(1);
                expect(quality).toBeLessThanOrEqual(100);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate image accessibility and provide actionable feedback', () => {
      fc.assert(
        fc.property(
          fc.string({ maxLength: 300 }),
          fc.constantFrom('decorative', 'informative', 'functional'),
          (altText, context) => {
            const validation = validateImageAccessibility(altText, context);
            
            // Property: Validation should always return structured result
            expect(validation).toBeDefined();
            expect(validation).toHaveProperty('isValid');
            expect(validation).toHaveProperty('warnings');
            expect(validation).toHaveProperty('suggestions');
            expect(typeof validation.isValid).toBe('boolean');
            expect(Array.isArray(validation.warnings)).toBe(true);
            expect(Array.isArray(validation.suggestions)).toBe(true);
            
            // Property: Empty alt text should be invalid for non-decorative images
            if (altText.length === 0 && context !== 'decorative') {
              expect(validation.isValid).toBe(false);
              expect(validation.warnings).toContain('Alt text is empty for non-decorative image');
            }
            
            // Property: Very long alt text should generate warnings
            if (altText.length > 125) {
              expect(validation.warnings).toContain('Alt text is longer than 125 characters');
            }
            
            // Property: Redundant phrases should be detected
            const redundantPhrases = ['image of', 'picture of', 'photo of', 'graphic of'];
            const hasRedundantPhrase = redundantPhrases.some(phrase => 
              altText.toLowerCase().includes(phrase)
            );
            if (hasRedundantPhrase) {
              expect(validation.warnings).toContain('Alt text contains redundant phrases');
            }
            
            // Property: All warnings should have corresponding suggestions
            if (validation.warnings.length > 0) {
              expect(validation.suggestions.length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate complete image metadata with all required properties', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          fc.constantFrom('hero', 'before', 'after', 'testimonial', 'logo', 'profile'),
          fc.record({
            name: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            service: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
            location: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            priority: fc.option(fc.boolean()),
            quality: fc.option(fc.integer({ min: 1, max: 100 }))
          }),
          (src, type, context) => {
            const metadata = generateImageMetadata(src, type, context);
            
            // Property: Metadata should contain all essential properties
            expect(metadata).toBeDefined();
            expect(metadata).toHaveProperty('src');
            expect(metadata).toHaveProperty('alt');
            expect(metadata).toHaveProperty('sizes');
            
            // Property: Alt text should be accessible and SEO-friendly
            expect(metadata.alt).toBeDefined();
            expect(typeof metadata.alt).toBe('string');
            expect(metadata.alt.length).toBeGreaterThan(0);
            
            const validation = validateImageAccessibility(metadata.alt, 'informative');
            // Should have minimal accessibility issues
            expect(validation.warnings.length).toBeLessThanOrEqual(2);
            
            // Property: Sizes should be appropriate for the image type
            expect(metadata.sizes).toBeDefined();
            expect(typeof metadata.sizes).toBe('string');
            expect(metadata.sizes.length).toBeGreaterThan(0);
            
            // Property: Quality should be within acceptable range
            if (metadata.quality) {
              expect(metadata.quality).toBeGreaterThanOrEqual(1);
              expect(metadata.quality).toBeLessThanOrEqual(100);
            }
            
            // Property: Priority should be set appropriately
            if (type === 'hero' || type === 'logo') {
              expect(metadata.priority).toBeDefined();
              // If priority was explicitly set in context, respect that value
              if (context.priority !== undefined && context.priority !== null) {
                expect(metadata.priority).toBe(context.priority);
              } else {
                // Otherwise, should default to true for hero/logo
                expect(metadata.priority).toBe(true);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate valid blur placeholder data URLs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          fc.integer({ min: 1, max: 50 }),
          fc.string({ minLength: 4, maxLength: 7 }).filter(s => s.startsWith('#')),
          (width, height, color) => {
            const blurDataURL = generateBlurDataURL(width, height, color);
            
            // Property: Should generate valid data URL
            expect(blurDataURL).toBeDefined();
            expect(typeof blurDataURL).toBe('string');
            expect(blurDataURL).toMatch(/^data:image\/svg\+xml;base64,/);
            
            // Property: Should be decodable base64
            const base64Part = blurDataURL.split(',')[1];
            expect(() => Buffer.from(base64Part, 'base64')).not.toThrow();
            
            // Property: Decoded content should be valid SVG
            const decoded = Buffer.from(base64Part, 'base64').toString();
            expect(decoded).toContain('<svg');
            expect(decoded).toContain('</svg>');
            expect(decoded).toContain(`width="${width}"`);
            expect(decoded).toContain(`height="${height}"`);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should generate structured data for images with proper schema', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          fc.string({ minLength: 10, maxLength: 200 }),
          fc.option(fc.integer({ min: 100, max: 4000 })),
          fc.option(fc.integer({ min: 100, max: 4000 })),
          fc.option(fc.string({ minLength: 10, maxLength: 300 })),
          (imageUrl, alt, width, height, caption) => {
            const structuredData = generateImageStructuredData(imageUrl, alt, width, height, caption);
            
            // Property: Should generate valid structured data object
            expect(structuredData).toBeDefined();
            expect(typeof structuredData).toBe('object');
            expect(structuredData).toHaveProperty('@type', 'ImageObject');
            expect(structuredData).toHaveProperty('url', imageUrl);
            expect(structuredData).toHaveProperty('description', alt);
            
            // Property: Optional properties should be included when provided
            if (width) {
              expect(structuredData).toHaveProperty('width', width);
            }
            if (height) {
              expect(structuredData).toHaveProperty('height', height);
            }
            if (caption) {
              expect(structuredData).toHaveProperty('caption', caption);
            }
            
            // Property: Should include required schema.org properties
            expect(structuredData).toHaveProperty('contentUrl', imageUrl);
            expect(structuredData).toHaveProperty('encodingFormat');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Image Optimization Integration Properties', () => {
    it('should maintain consistency across all optimization functions', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          fc.constantFrom('hero', 'testimonial', 'profile'),
          fc.string({ minLength: 1, maxLength: 50 }),
          (src, type, name) => {
            // Generate metadata using the main function
            const metadata = generateImageMetadata(src, type, { name });
            
            // Property: Alt text should pass accessibility validation
            const validation = validateImageAccessibility(metadata.alt, 'informative');
            expect(validation.warnings.length).toBeLessThanOrEqual(1); // Allow minor warnings
            
            // Property: Sizes should be valid for the context
            const expectedSizes = generateResponsiveSizes(type);
            expect(metadata.sizes).toBe(expectedSizes);
            
            // Property: Structured data should be compatible
            const structuredData = generateImageStructuredData(
              metadata.src, 
              metadata.alt,
              undefined,
              undefined,
              `${type} image for ${name}`
            );
            expect(structuredData.description).toBe(metadata.alt);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});