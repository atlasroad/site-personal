# SEO System Documentation

## Overview

This SEO system provides a comprehensive, type-safe solution for managing SEO metadata and structured data in Next.js 13+ applications using the Metadata API. The system includes extensive Schema.org structured data support for enhanced search engine visibility.

## Files Structure

```
lib/
├── seo.ts              # Core SEO utilities and interfaces
├── seo-examples.ts     # Usage examples and patterns
├── SEO_README.md       # This documentation
└── __tests__/
    └── seo.test.ts     # Comprehensive test suite

components/
├── StructuredData.tsx  # Reusable component for JSON-LD injection
└── __tests__/
    └── StructuredData.test.tsx  # Component tests

scripts/
└── validate-structured-data.js  # Browser validation script

app/
├── layout.tsx          # Global SEO configuration with structured data
└── page.tsx            # Example page-specific SEO with rich snippets
```

## Core Features

### 1. Type-Safe Interfaces
- `SEOMetadata`: Main interface for SEO data
- `OpenGraphData`: Open Graph protocol data
- `StructuredDataObject`: JSON-LD structured data
- `SEOConfig`: Site-wide configuration
- `OrganizationSchema`: Schema.org Organization type
- `WebsiteSchema`: Schema.org WebSite type
- `ContactPoint`: Contact information structure
- `PostalAddress`: Address information structure

### 2. Utility Functions
- `generateMetadata()`: Creates Next.js Metadata objects
- `generatePageMetadata()`: Page-specific metadata generation
- `validateSEOMetadata()`: Validates completeness and best practices
- `generateStructuredData()`: JSON-LD generation utilities
- `combineStructuredData()`: Combines multiple structured data objects

### 3. Structured Data Generators
- **Organization and Website schema**: Complete business information
- **Service schema**: Service offerings with pricing and duration
- **FAQ schema**: Frequently asked questions
- **LocalBusiness schema**: Local business information with geo data
- **Person schema**: Individual professional profiles
- **Course schema**: Training programs and courses
- **AggregateRating schema**: Reviews and ratings
- **Breadcrumb schema**: Navigation breadcrumbs
- **Custom schema support**: Extensible for any Schema.org type

## Usage Examples

### Basic Page Metadata

```typescript
// app/about/page.tsx
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata(
  'Sobre Nós',
  'Conheça nossa história e metodologia de transformação corporal.',
  '/about'
);
```

### Page with Multiple Structured Data Types

```typescript
// app/services/page.tsx
import { generatePageMetadata, generateServiceStructuredData, generateLocalBusinessStructuredData, generateAggregateRatingStructuredData } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';

export const metadata = generatePageMetadata(
  'Nossos Serviços',
  'Serviços de personal training e consultoria nutricional.',
  '/services'
);

export default function ServicesPage() {
  const serviceData = generateServiceStructuredData(
    'Personal Training',
    'Treino personalizado para transformação corporal.',
    'PRO TRAINER',
    '297.00',
    'P90D'
  );

  const businessData = generateLocalBusinessStructuredData();
  
  const ratingData = generateAggregateRatingStructuredData(
    'PRO TRAINER',
    4.9,
    200
  );

  return (
    <>
      <StructuredData data={[serviceData, businessData, ratingData]} />
      <main>
        {/* Page content */}
      </main>
    </>
  );
}
```

### Dynamic Metadata Generation

```typescript
// app/blog/[slug]/page.tsx
import { generateBlogPostMetadata } from '@/lib/seo-examples';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug);
  
  return generateBlogPostMetadata(
    post.title,
    post.excerpt,
    params.slug,
    post.publishDate,
    post.author,
    post.tags
  );
}
```

## Configuration

### Default SEO Config

The system includes a default configuration in `lib/seo.ts`:

```typescript
export const defaultSEOConfig: SEOConfig = {
  siteName: 'PRO TRAINER',
  defaultTitle: 'PRO TRAINER - Transforme Seu Corpo em 90 Dias',
  defaultDescription: 'Personal Trainer de alta performance...',
  defaultImage: '/og-image.jpg',
  siteUrl: 'https://protrainer.com.br',
  locale: 'pt_BR',
  // ... structured data schemas
};
```

### Customizing Configuration

To customize for different environments or sites:

```typescript
// lib/seo-config.ts
import { SEOConfig } from './seo';

export const productionConfig: SEOConfig = {
  // Production configuration
};

export const developmentConfig: SEOConfig = {
  // Development configuration
};
```

## Best Practices

### 1. Title Optimization
- Keep titles under 60 characters
- Include primary keywords
- Use descriptive, unique titles for each page

### 2. Meta Descriptions
- 120-160 characters for optimal display
- Include call-to-action when appropriate
- Unique descriptions for each page

### 3. Open Graph Images
- 1200x630 pixels for optimal display
- Include text overlay for better engagement
- Use high-quality, relevant images

### 4. Structured Data
- Always validate JSON-LD before deployment
- Use specific schema types when available
- Include all relevant properties

## Validation and Testing

### Built-in Validation

The system includes comprehensive validation:

```typescript
import { validateSEOMetadata } from '@/lib/seo';

const validation = validateSEOMetadata(metadata);
if (!validation.isValid) {
  console.warn('Missing required fields:', validation.missingFields);
}
if (validation.warnings.length > 0) {
  console.warn('SEO Warnings:', validation.warnings);
}
```

### Browser Validation

Use the included validation script to test structured data in the browser:

```javascript
// In browser console or add to your page
<script src="/scripts/validate-structured-data.js"></script>
```

The script will:
- Find all JSON-LD scripts on the page
- Validate JSON syntax
- Check Schema.org compliance
- Provide recommendations for improvement

### Testing Tools

Test SEO implementation using:
- **Google's Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/
- **Facebook's Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Lighthouse SEO audit**: Built into Chrome DevTools

### Automated Testing

The system includes comprehensive test suites:

```bash
# Run SEO utility tests
npm test lib/__tests__/seo.test.ts

# Run component tests
npm test components/__tests__/StructuredData.test.tsx

# Run all tests
npm test
```

## Extensibility

The system is designed to be extensible:

### Adding New Schema Types

```typescript
export function generateCustomSchema(data: CustomData): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'CustomType',
    // ... custom properties
  };
}
```

### Adding New Metadata Fields

```typescript
interface ExtendedSEOMetadata extends SEOMetadata {
  customField?: string;
}
```

## Performance Considerations

- Structured data is rendered server-side
- Metadata is generated at build time when possible
- Images are optimized using Next.js Image component
- Minimal runtime overhead

## Troubleshooting

### Common Issues

1. **Missing Images**: Ensure all referenced images exist in the public directory
2. **Invalid JSON-LD**: Use the validation functions before deployment
3. **Long Titles/Descriptions**: Check validation warnings
4. **Missing Canonical URLs**: Ensure all pages have proper canonical tags

### Debug Mode

Enable debug logging:

```typescript
const validation = validateSEOMetadata(metadata);
console.log('SEO Validation:', validation);
```