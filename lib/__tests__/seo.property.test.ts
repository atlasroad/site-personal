/**
 * Property-Based Tests for SEO Metadata Completeness
 * **Feature: site-optimization, Property 4: SEO Metadata Completeness**
 * **Validates: Requirements 3.1**
 */

import * as fc from 'fast-check'
import {
  generateMetadata,
  generatePageMetadata,
  generateStructuredData,
  generateServiceStructuredData,
  generateFAQStructuredData,
  generateLocalBusinessStructuredData,
  generatePersonStructuredData,
  generateCourseStructuredData,
  generateAggregateRatingStructuredData,
  generateBreadcrumbStructuredData,
  validateSEOMetadata,
  combineStructuredData,
  defaultSEOConfig,
  SEOMetadata,
  StructuredDataObject
} from '../seo'

// Custom arbitraries for generating test data
const seoTitleArbitrary = fc.string({ minLength: 1, maxLength: 120 })
const seoDescriptionArbitrary = fc.string({ minLength: 50, maxLength: 300 })
const urlPathArbitrary = fc.string({ minLength: 1, maxLength: 100 }).map(s => 
  '/' + s.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
)
const keywordsArbitrary = fc.array(fc.string({ minLength: 2, maxLength: 30 }), { minLength: 0, maxLength: 10 })

const openGraphDataArbitrary = fc.record({
  title: seoTitleArbitrary,
  description: seoDescriptionArbitrary,
  image: fc.constant('/og-image.jpg'),
  url: fc.webUrl(),
  type: fc.constantFrom('website', 'article') as fc.Arbitrary<'website' | 'article'>
})

const seoMetadataArbitrary = fc.record({
  title: seoTitleArbitrary,
  description: seoDescriptionArbitrary,
  keywords: fc.option(keywordsArbitrary),
  openGraph: fc.option(openGraphDataArbitrary)
})

// Arbitrary for structured data generation parameters
const serviceDataArbitrary = fc.record({
  serviceName: fc.string({ minLength: 5, maxLength: 100 }),
  description: fc.string({ minLength: 20, maxLength: 300 }),
  provider: fc.option(fc.string({ minLength: 2, maxLength: 50 })),
  price: fc.option(fc.float({ min: 10, max: 10000 }).map(p => p.toFixed(2))),
  duration: fc.option(fc.constantFrom('P30D', 'P60D', 'P90D', 'P1Y'))
})

const faqDataArbitrary = fc.array(
  fc.record({
    question: fc.string({ minLength: 10, maxLength: 200 }),
    answer: fc.string({ minLength: 20, maxLength: 500 })
  }),
  { minLength: 1, maxLength: 10 }
)

const personDataArbitrary = fc.record({
  name: fc.string({ minLength: 2, maxLength: 100 }),
  jobTitle: fc.option(fc.string({ minLength: 5, maxLength: 100 })),
  description: fc.option(fc.string({ minLength: 20, maxLength: 300 }))
})

const breadcrumbDataArbitrary = fc.array(
  fc.record({
    name: fc.string({ minLength: 2, maxLength: 50 }),
    url: fc.webUrl()
  }),
  { minLength: 1, maxLength: 8 }
)

describe('SEO Metadata Completeness Properties', () => {
  /**
   * Property 4: SEO Metadata Completeness
   * **Validates: Requirements 3.1**
   * 
   * For any page in the application, the SEO system should generate complete meta tags 
   * and structured data that are properly formatted for search engine crawlers.
   * 
   * This property ensures that:
   * 1. All generated metadata contains required fields (title, description)
   * 2. OpenGraph data is properly structured when provided
   * 3. Structured data follows valid JSON-LD format
   * 4. URLs are properly formatted and canonical
   * 5. Meta tags comply with length recommendations
   * 6. All generated data is valid for search engine consumption
   */
  test('Property 4: SEO metadata completeness for all page types', () => {
    fc.assert(
      fc.property(
        seoMetadataArbitrary,
        urlPathArbitrary,
        (seoData, urlPath) => {
          // Generate metadata using the SEO utilities
          const metadata = generatePageMetadata(
            seoData.title,
            seoData.description,
            urlPath,
            {
              keywords: seoData.keywords || undefined,
              openGraph: seoData.openGraph || undefined
            }
          )

          // Property 4.1: Required fields must always be present
          expect(metadata.title).toBeDefined()
          expect(metadata.description).toBeDefined()
          
          // Title should be a string and not empty
          expect(typeof metadata.title).toBe('string')
          expect(metadata.title.toString().length).toBeGreaterThan(0)
          
          // Description should be a string and not empty
          expect(typeof metadata.description).toBe('string')
          expect(metadata.description.toString().length).toBeGreaterThan(0)

          // Property 4.2: OpenGraph data completeness
          if (metadata.openGraph) {
            expect(metadata.openGraph.title).toBeDefined()
            expect(metadata.openGraph.description).toBeDefined()
            expect(metadata.openGraph.url).toBeDefined()
            expect(metadata.openGraph.siteName).toBe(defaultSEOConfig.siteName)
            expect(metadata.openGraph.locale).toBe(defaultSEOConfig.locale)
            
            // OpenGraph images should be properly structured
            expect(metadata.openGraph.images).toBeDefined()
            expect(Array.isArray(metadata.openGraph.images)).toBe(true)
            
            if (Array.isArray(metadata.openGraph.images) && metadata.openGraph.images.length > 0) {
              const firstImage = metadata.openGraph.images[0]
              expect(firstImage.url).toBeDefined()
              expect(firstImage.width).toBe(1200)
              expect(firstImage.height).toBe(630)
              expect(firstImage.alt).toBeDefined()
            }
          }

          // Property 4.3: Twitter card completeness
          if (metadata.twitter) {
            expect(metadata.twitter.card).toBe('summary_large_image')
            expect(metadata.twitter.title).toBeDefined()
            expect(metadata.twitter.description).toBeDefined()
            expect(metadata.twitter.images).toBeDefined()
            expect(metadata.twitter.creator).toBe('@protrainer')
          }

          // Property 4.4: Technical SEO completeness
          expect(metadata.robots).toBeDefined()
          expect(metadata.robots?.index).toBe(true)
          expect(metadata.robots?.follow).toBe(true)
          
          // Google Bot specific settings
          expect(metadata.robots?.googleBot).toBeDefined()
          expect(metadata.robots?.googleBot?.index).toBe(true)
          expect(metadata.robots?.googleBot?.follow).toBe(true)

          // Property 4.5: Canonical URL completeness
          expect(metadata.alternates?.canonical).toBeDefined()
          expect(typeof metadata.alternates?.canonical).toBe('string')

          // Property 4.6: Metadata base URL
          expect(metadata.metadataBase).toBeDefined()
          expect(metadata.metadataBase?.toString()).toBe(defaultSEOConfig.siteUrl + '/')

          // Property 4.7: Author and publisher information
          expect(metadata.authors).toBeDefined()
          expect(metadata.creator).toBe(defaultSEOConfig.siteName)
          expect(metadata.publisher).toBe(defaultSEOConfig.siteName)

          // Property 4.8: Verification codes
          expect(metadata.verification?.google).toBeDefined()

          return true // Property holds
        }
      ),
      { 
        numRuns: 100, // Run 100 iterations as specified in design document
        verbose: true 
      }
    )
  })

  /**
   * Property test for structured data completeness
   * Ensures all structured data types generate valid JSON-LD
   */
  test('Property 4.3: Structured data JSON-LD format completeness', () => {
    fc.assert(
      fc.property(
        serviceDataArbitrary,
        (serviceData) => {
          // Generate structured data
          const structuredData = generateServiceStructuredData(
            serviceData.serviceName,
            serviceData.description,
            serviceData.provider,
            serviceData.price,
            serviceData.duration
          )

          // Property 4.3.1: Valid JSON-LD structure
          expect(structuredData['@context']).toBe('https://schema.org')
          expect(structuredData['@type']).toBe('Service')
          
          // Property 4.3.2: Required service fields
          expect(structuredData.name).toBe(serviceData.serviceName)
          expect(structuredData.description).toBe(serviceData.description)
          expect(structuredData.serviceType).toBe('Personal Training')
          expect(structuredData.category).toBe('Fitness')

          // Property 4.3.3: Provider information completeness
          expect(structuredData.provider).toBeDefined()
          expect(structuredData.provider['@type']).toBe('Organization')
          expect(structuredData.provider.name).toBeDefined()
          expect(structuredData.provider.url).toBe(defaultSEOConfig.siteUrl)

          // Property 4.3.4: Service area and availability
          expect(structuredData.areaServed).toBeDefined()
          expect(structuredData.areaServed['@type']).toBe('Country')
          expect(structuredData.areaServed.name).toBe('Brazil')
          
          expect(structuredData.availableChannel).toBeDefined()
          expect(structuredData.availableChannel['@type']).toBe('ServiceChannel')

          // Property 4.3.5: Optional pricing information completeness
          if (serviceData.price) {
            expect(structuredData.offers).toBeDefined()
            expect(structuredData.offers['@type']).toBe('Offer')
            expect(structuredData.offers.price).toBe(serviceData.price)
            expect(structuredData.offers.priceCurrency).toBe('BRL')
            expect(structuredData.offers.availability).toBe('https://schema.org/InStock')
            expect(structuredData.offers.validFrom).toBeDefined()
            expect(structuredData.offers.priceValidUntil).toBeDefined()
          }

          // Property 4.3.6: Optional duration information
          if (serviceData.duration) {
            expect(structuredData.duration).toBe(serviceData.duration)
          }

          // Property 4.3.7: JSON serialization validity
          const jsonString = generateStructuredData(structuredData)
          expect(() => JSON.parse(jsonString)).not.toThrow()
          
          const parsedData = JSON.parse(jsonString)
          expect(parsedData['@context']).toBe('https://schema.org')
          expect(parsedData['@type']).toBe('Service')

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property test for FAQ structured data completeness
   */
  test('Property 4.3: FAQ structured data completeness', () => {
    fc.assert(
      fc.property(
        faqDataArbitrary,
        (faqData) => {
          const faqStructuredData = generateFAQStructuredData(faqData)

          // Property 4.3.1: Valid FAQ JSON-LD structure
          expect(faqStructuredData['@context']).toBe('https://schema.org')
          expect(faqStructuredData['@type']).toBe('FAQPage')
          
          // Property 4.3.2: Main entity completeness
          expect(faqStructuredData.mainEntity).toBeDefined()
          expect(Array.isArray(faqStructuredData.mainEntity)).toBe(true)
          expect(faqStructuredData.mainEntity.length).toBe(faqData.length)

          // Property 4.3.3: Each FAQ item completeness
          faqStructuredData.mainEntity.forEach((item: any, index: number) => {
            expect(item['@type']).toBe('Question')
            expect(item.name).toBe(faqData[index].question)
            expect(item.acceptedAnswer).toBeDefined()
            expect(item.acceptedAnswer['@type']).toBe('Answer')
            expect(item.acceptedAnswer.text).toBe(faqData[index].answer)
          })

          // Property 4.3.4: JSON serialization validity
          const jsonString = generateStructuredData(faqStructuredData)
          expect(() => JSON.parse(jsonString)).not.toThrow()

          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property test for Person structured data completeness
   */
  test('Property 4.3: Person structured data completeness', () => {
    fc.assert(
      fc.property(
        personDataArbitrary,
        (personData) => {
          const personStructuredData = generatePersonStructuredData(
            personData.name,
            personData.jobTitle,
            personData.description
          )

          // Property 4.3.1: Valid Person JSON-LD structure
          expect(personStructuredData['@context']).toBe('https://schema.org')
          expect(personStructuredData['@type']).toBe('Person')
          
          // Property 4.3.2: Required person fields
          expect(personStructuredData.name).toBe(personData.name)
          expect(personStructuredData.jobTitle).toBeDefined()
          expect(personStructuredData.url).toBe(defaultSEOConfig.siteUrl)

          // Property 4.3.3: Organization relationship
          expect(personStructuredData.worksFor).toBeDefined()
          expect(personStructuredData.worksFor['@type']).toBe('Organization')
          expect(personStructuredData.worksFor.name).toBe(defaultSEOConfig.siteName)
          expect(personStructuredData.worksFor.url).toBe(defaultSEOConfig.siteUrl)

          // Property 4.3.4: Knowledge areas
          expect(personStructuredData.knowsAbout).toBeDefined()
          expect(Array.isArray(personStructuredData.knowsAbout)).toBe(true)
          expect(personStructuredData.knowsAbout.length).toBeGreaterThan(0)

          // Property 4.3.5: Social media presence
          expect(personStructuredData.sameAs).toBeDefined()
          expect(Array.isArray(personStructuredData.sameAs)).toBe(true)

          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property test for breadcrumb structured data completeness
   */
  test('Property 4.3: Breadcrumb structured data completeness', () => {
    fc.assert(
      fc.property(
        breadcrumbDataArbitrary,
        (breadcrumbData) => {
          const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbData)

          // Property 4.3.1: Valid BreadcrumbList JSON-LD structure
          expect(breadcrumbStructuredData['@context']).toBe('https://schema.org')
          expect(breadcrumbStructuredData['@type']).toBe('BreadcrumbList')
          
          // Property 4.3.2: Item list completeness
          expect(breadcrumbStructuredData.itemListElement).toBeDefined()
          expect(Array.isArray(breadcrumbStructuredData.itemListElement)).toBe(true)
          expect(breadcrumbStructuredData.itemListElement.length).toBe(breadcrumbData.length)

          // Property 4.3.3: Each breadcrumb item completeness
          breadcrumbStructuredData.itemListElement.forEach((item: any, index: number) => {
            expect(item['@type']).toBe('ListItem')
            expect(item.position).toBe(index + 1)
            expect(item.name).toBe(breadcrumbData[index].name)
            expect(item.item).toBe(breadcrumbData[index].url)
          })

          return true
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * Property test for combined structured data completeness
   */
  test('Property 4.3: Combined structured data format completeness', () => {
    fc.assert(
      fc.property(
        serviceDataArbitrary,
        faqDataArbitrary,
        (serviceData, faqData) => {
          // Generate multiple structured data objects
          const serviceStructuredData = generateServiceStructuredData(
            serviceData.serviceName,
            serviceData.description
          )
          
          const faqStructuredData = generateFAQStructuredData(faqData)
          const localBusinessData = generateLocalBusinessStructuredData()

          // Property 4.3.1: Single object combination
          const singleJson = combineStructuredData(serviceStructuredData)
          expect(() => JSON.parse(singleJson)).not.toThrow()
          
          const singleParsed = JSON.parse(singleJson)
          expect(singleParsed['@context']).toBe('https://schema.org')
          expect(singleParsed['@type']).toBe('Service')

          // Property 4.3.2: Multiple objects combination
          const multipleJson = combineStructuredData(
            serviceStructuredData,
            faqStructuredData,
            localBusinessData
          )
          expect(() => JSON.parse(multipleJson)).not.toThrow()
          
          const multipleParsed = JSON.parse(multipleJson)
          expect(Array.isArray(multipleParsed)).toBe(true)
          expect(multipleParsed.length).toBe(3)
          
          // Each object should maintain its structure
          expect(multipleParsed[0]['@type']).toBe('Service')
          expect(multipleParsed[1]['@type']).toBe('FAQPage')
          expect(multipleParsed[2]['@type']).toBe('LocalBusiness')

          return true
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * Property test for SEO validation completeness
   */
  test('Property 4.6: SEO validation completeness and accuracy', () => {
    fc.assert(
      fc.property(
        seoMetadataArbitrary,
        (seoData) => {
          const validation = validateSEOMetadata(seoData)

          // Property 4.6.1: Validation structure completeness
          expect(validation).toHaveProperty('isValid')
          expect(validation).toHaveProperty('missingFields')
          expect(validation).toHaveProperty('warnings')
          
          expect(typeof validation.isValid).toBe('boolean')
          expect(Array.isArray(validation.missingFields)).toBe(true)
          expect(Array.isArray(validation.warnings)).toBe(true)

          // Property 4.6.2: Required field validation accuracy
          if (!seoData.title) {
            expect(validation.missingFields).toContain('title')
            expect(validation.isValid).toBe(false)
          }
          
          if (!seoData.description) {
            expect(validation.missingFields).toContain('description')
            expect(validation.isValid).toBe(false)
          }

          // Property 4.6.3: Length validation warnings
          if (seoData.title && seoData.title.length > 60) {
            expect(validation.warnings.some(w => w.includes('Title is longer than 60 characters'))).toBe(true)
          }
          
          if (seoData.description && seoData.description.length > 160) {
            expect(validation.warnings.some(w => w.includes('Description is longer than 160 characters'))).toBe(true)
          }
          
          if (seoData.description && seoData.description.length < 120) {
            expect(validation.warnings.some(w => w.includes('Description is shorter than 120 characters'))).toBe(true)
          }

          // Property 4.6.4: OpenGraph validation
          if (seoData.openGraph && !seoData.openGraph.image) {
            expect(validation.warnings.some(w => w.includes('OpenGraph image is missing'))).toBe(true)
          }

          // Property 4.6.5: Valid metadata should pass validation
          if (seoData.title && seoData.description) {
            expect(validation.isValid).toBe(true)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property test for default SEO configuration completeness
   */
  test('Property 4.1: Default SEO configuration completeness', () => {
    // This test runs once but validates the default configuration thoroughly
    const config = defaultSEOConfig

    // Property 4.1.1: Basic configuration completeness
    expect(config.siteName).toBeDefined()
    expect(config.defaultTitle).toBeDefined()
    expect(config.defaultDescription).toBeDefined()
    expect(config.defaultImage).toBeDefined()
    expect(config.siteUrl).toBeDefined()
    expect(config.locale).toBeDefined()

    // Property 4.1.2: URL format validation
    expect(config.siteUrl).toMatch(/^https?:\/\//)
    expect(config.defaultImage).toMatch(/^\//)

    // Property 4.1.3: Structured data completeness
    expect(config.structuredData).toBeDefined()
    expect(config.structuredData.organization).toBeDefined()
    expect(config.structuredData.website).toBeDefined()

    // Property 4.1.4: Organization schema completeness
    const org = config.structuredData.organization
    expect(org['@context']).toBe('https://schema.org')
    expect(org['@type']).toBe('Organization')
    expect(org.name).toBeDefined()
    expect(org.url).toBeDefined()
    expect(org.contactPoint).toBeDefined()
    expect(org.address).toBeDefined()
    expect(org.sameAs).toBeDefined()

    // Property 4.1.5: Website schema completeness
    const website = config.structuredData.website
    expect(website['@context']).toBe('https://schema.org')
    expect(website['@type']).toBe('WebSite')
    expect(website.name).toBeDefined()
    expect(website.url).toBeDefined()
    expect(website.publisher).toBeDefined()

    // Property 4.1.6: Contact information completeness
    expect(Array.isArray(org.contactPoint)).toBe(true)
    if (org.contactPoint && org.contactPoint.length > 0) {
      const contact = org.contactPoint[0]
      expect(contact['@type']).toBe('ContactPoint')
      expect(contact.telephone).toBeDefined()
      expect(contact.contactType).toBeDefined()
    }

    // Property 4.1.7: Social media presence
    expect(Array.isArray(org.sameAs)).toBe(true)
    expect(org.sameAs?.length).toBeGreaterThan(0)
  })

  /**
   * Property test for aggregate rating structured data completeness
   */
  test('Property 4.3: Aggregate rating structured data completeness', () => {
    fc.assert(
      fc.property(
        fc.record({
          itemName: fc.string({ minLength: 5, maxLength: 100 }),
          ratingValue: fc.float({ min: 1, max: 5 }),
          reviewCount: fc.integer({ min: 1, max: 10000 }),
          bestRating: fc.constantFrom(5, 10)
        }),
        (ratingData) => {
          const aggregateRating = generateAggregateRatingStructuredData(
            ratingData.itemName,
            ratingData.ratingValue,
            ratingData.reviewCount,
            ratingData.bestRating
          )

          // Property 4.3.1: Valid rating JSON-LD structure
          expect(aggregateRating['@context']).toBe('https://schema.org')
          expect(aggregateRating['@type']).toBe('Service')
          expect(aggregateRating.name).toBe(ratingData.itemName)

          // Property 4.3.2: Aggregate rating completeness
          expect(aggregateRating.aggregateRating).toBeDefined()
          expect(aggregateRating.aggregateRating['@type']).toBe('AggregateRating')
          expect(aggregateRating.aggregateRating.ratingValue).toBe(ratingData.ratingValue.toString())
          expect(aggregateRating.aggregateRating.reviewCount).toBe(ratingData.reviewCount.toString())
          expect(aggregateRating.aggregateRating.bestRating).toBe(ratingData.bestRating.toString())
          expect(aggregateRating.aggregateRating.worstRating).toBe('1')

          return true
        }
      ),
      { numRuns: 50 }
    )
  })
})