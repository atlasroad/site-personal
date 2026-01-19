import {
  generateStructuredData,
  generateServiceStructuredData,
  generateFAQStructuredData,
  generateLocalBusinessStructuredData,
  generatePersonStructuredData,
  generateCourseStructuredData,
  generateAggregateRatingStructuredData,
  defaultSEOConfig,
  validateSEOMetadata
} from '../seo';

describe('SEO Structured Data', () => {
  describe('generateStructuredData', () => {
    it('should generate valid JSON-LD', () => {
      const data = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Test Organization'
      };

      const result = generateStructuredData(data);
      const parsed = JSON.parse(result);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('Organization');
      expect(parsed.name).toBe('Test Organization');
    });
  });

  describe('generateServiceStructuredData', () => {
    it('should generate valid service structured data', () => {
      const service = generateServiceStructuredData(
        'Personal Training',
        'Professional fitness training',
        'PRO TRAINER',
        '297.00',
        'P90D'
      );

      expect(service['@context']).toBe('https://schema.org');
      expect(service['@type']).toBe('Service');
      expect(service.name).toBe('Personal Training');
      expect(service.description).toBe('Professional fitness training');
      expect(service.offers?.price).toBe('297.00');
      expect(service.duration).toBe('P90D');
    });

    it('should generate service without optional parameters', () => {
      const service = generateServiceStructuredData(
        'Basic Training',
        'Basic fitness training'
      );

      expect(service['@context']).toBe('https://schema.org');
      expect(service['@type']).toBe('Service');
      expect(service.name).toBe('Basic Training');
      expect(service.offers).toBeUndefined();
      expect(service.duration).toBeUndefined();
    });
  });

  describe('generateFAQStructuredData', () => {
    it('should generate valid FAQ structured data', () => {
      const faqs = [
        { question: 'What is this?', answer: 'This is a test.' },
        { question: 'How does it work?', answer: 'It works well.' }
      ];

      const faqData = generateFAQStructuredData(faqs);

      expect(faqData['@context']).toBe('https://schema.org');
      expect(faqData['@type']).toBe('FAQPage');
      expect(faqData.mainEntity).toHaveLength(2);
      expect(faqData.mainEntity[0]['@type']).toBe('Question');
      expect(faqData.mainEntity[0].name).toBe('What is this?');
      expect(faqData.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
      expect(faqData.mainEntity[0].acceptedAnswer.text).toBe('This is a test.');
    });
  });

  describe('generateLocalBusinessStructuredData', () => {
    it('should generate valid local business structured data', () => {
      const business = generateLocalBusinessStructuredData();

      expect(business['@context']).toBe('https://schema.org');
      expect(business['@type']).toBe('LocalBusiness');
      expect(business.name).toBe(defaultSEOConfig.siteName);
      expect(business.url).toBe(defaultSEOConfig.siteUrl);
      expect(business.address).toBeDefined();
      expect(business.geo).toBeDefined();
      expect(business.openingHoursSpecification).toBeDefined();
    });
  });

  describe('generatePersonStructuredData', () => {
    it('should generate valid person structured data', () => {
      const person = generatePersonStructuredData(
        'John Doe',
        'Personal Trainer',
        'Experienced fitness professional'
      );

      expect(person['@context']).toBe('https://schema.org');
      expect(person['@type']).toBe('Person');
      expect(person.name).toBe('John Doe');
      expect(person.jobTitle).toBe('Personal Trainer');
      expect(person.description).toBe('Experienced fitness professional');
      expect(person.worksFor).toBeDefined();
    });
  });

  describe('generateCourseStructuredData', () => {
    it('should generate valid course structured data', () => {
      const course = generateCourseStructuredData(
        'Fitness Course',
        'Complete fitness training course',
        'P90D',
        '297.00'
      );

      expect(course['@context']).toBe('https://schema.org');
      expect(course['@type']).toBe('Course');
      expect(course.name).toBe('Fitness Course');
      expect(course.timeRequired).toBe('P90D');
      expect(course.offers?.price).toBe('297.00');
    });
  });

  describe('generateAggregateRatingStructuredData', () => {
    it('should generate valid aggregate rating structured data', () => {
      const rating = generateAggregateRatingStructuredData(
        'PRO TRAINER',
        4.8,
        150,
        5
      );

      expect(rating['@context']).toBe('https://schema.org');
      expect(rating['@type']).toBe('Service');
      expect(rating.name).toBe('PRO TRAINER');
      expect(rating.aggregateRating).toBeDefined();
      expect(rating.aggregateRating.ratingValue).toBe('4.8');
      expect(rating.aggregateRating.reviewCount).toBe('150');
      expect(rating.aggregateRating.bestRating).toBe('5');
    });
  });

  describe('validateSEOMetadata', () => {
    it('should validate complete metadata', () => {
      const metadata = {
        title: 'Test Title',
        description: 'This is a test description that is long enough to meet the minimum requirements for SEO best practices.'
      };

      const validation = validateSEOMetadata(metadata);

      expect(validation.isValid).toBe(true);
      expect(validation.missingFields).toHaveLength(0);
    });

    it('should identify missing required fields', () => {
      const metadata = {
        title: 'Test Title'
        // missing description
      };

      const validation = validateSEOMetadata(metadata);

      expect(validation.isValid).toBe(false);
      expect(validation.missingFields).toContain('description');
    });

    it('should warn about title length', () => {
      const metadata = {
        title: 'This is a very long title that exceeds the recommended 60 character limit for SEO optimization',
        description: 'This is a test description that is long enough to meet the minimum requirements for SEO best practices.'
      };

      const validation = validateSEOMetadata(metadata);

      expect(validation.isValid).toBe(true);
      expect(validation.warnings.some(w => w.includes('Title is longer than 60 characters'))).toBe(true);
    });
  });

  describe('defaultSEOConfig', () => {
    it('should have valid organization structured data', () => {
      const org = defaultSEOConfig.structuredData.organization;

      expect(org['@context']).toBe('https://schema.org');
      expect(org['@type']).toBe('Organization');
      expect(org.name).toBe('PRO TRAINER');
      expect(org.url).toBe('https://protrainer.com.br');
      expect(org.contactPoint).toBeDefined();
      expect(org.sameAs).toBeDefined();
    });

    it('should have valid website structured data', () => {
      const website = defaultSEOConfig.structuredData.website;

      expect(website['@context']).toBe('https://schema.org');
      expect(website['@type']).toBe('WebSite');
      expect(website.name).toBe('PRO TRAINER');
      expect(website.url).toBe('https://protrainer.com.br');
    });
  });
});