import { Metadata } from 'next';

// Core SEO interfaces
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: OpenGraphData;
  structuredData?: StructuredDataObject;
}

export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'website' | 'article';
  siteName?: string;
  locale?: string;
}

export interface StructuredDataObject {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

// SEO Configuration interface
export interface SEOConfig {
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  siteUrl: string;
  locale: string;
  structuredData: {
    organization: OrganizationSchema;
    website: WebsiteSchema;
  };
}

export interface OrganizationSchema extends StructuredDataObject {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string | ImageObject;
  contactPoint?: ContactPoint[];
  sameAs?: string[];
  address?: PostalAddress;
  foundingDate?: string;
  founder?: Person;
  image?: string;
  description?: string;
  alternateName?: string;
  serviceArea?: any;
  hasOfferCatalog?: any;
}

export interface WebsiteSchema extends StructuredDataObject {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  publisher?: OrganizationSchema | any;
  alternateName?: string;
  inLanguage?: string;
  isAccessibleForFree?: boolean;
  potentialAction?: any;
  mainEntity?: any;
}

export interface ImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
}

export interface PostalAddress {
  '@type': 'PostalAddress';
  addressCountry: string;
  addressLocality: string;
  addressRegion: string;
}

export interface Person {
  '@type': 'Person';
  name: string;
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  availableLanguage?: string | string[];
  areaServed?: string;
  hoursAvailable?: any;
}

// Default SEO configuration
export const defaultSEOConfig: SEOConfig = {
  siteName: 'PRO TRAINER',
  defaultTitle: 'PRO TRAINER - Transforme Seu Corpo em 90 Dias',
  defaultDescription: 'Personal Trainer de alta performance. Método exclusivo que transforma seu corpo em 90 dias. Resultados garantidos.',
  defaultImage: '/og-image.svg',
  siteUrl: 'https://protrainer.com.br',
  locale: 'pt_BR',
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PRO TRAINER',
      alternateName: 'Pro Trainer Brasil',
      url: 'https://protrainer.com.br',
      logo: {
        '@type': 'ImageObject',
        url: 'https://protrainer.com.br/logo.svg',
        width: 300,
        height: 100
      },
      image: 'https://protrainer.com.br/logo.svg',
      description: 'Personal Trainer de alta performance especializado em transformação corporal em 90 dias com método exclusivo e resultados garantidos.',
      foundingDate: '2020',
      founder: {
        '@type': 'Person',
        name: 'PRO TRAINER'
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+55-11-99999-9999',
          contactType: 'customer service',
          availableLanguage: ['Portuguese', 'pt'],
          areaServed: 'BR',
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '06:00',
            closes: '22:00'
          }
        }
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
        addressLocality: 'São Paulo',
        addressRegion: 'SP'
      },
      sameAs: [
        'https://www.instagram.com/protrainer',
        'https://www.facebook.com/protrainer',
        'https://www.youtube.com/protrainer'
      ],
      serviceArea: {
        '@type': 'Country',
        name: 'Brazil'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Serviços de Personal Training',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Personal Training Exclusivo',
              description: 'Treino personalizado com acompanhamento individual'
            }
          }
        ]
      }
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'PRO TRAINER',
      alternateName: 'Pro Trainer - Transformação Corporal',
      url: 'https://protrainer.com.br',
      description: 'Personal Trainer de alta performance. Método exclusivo que transforma seu corpo em 90 dias com resultados garantidos.',
      inLanguage: 'pt-BR',
      isAccessibleForFree: true,
      publisher: {
        '@type': 'Organization',
        name: 'PRO TRAINER',
        url: 'https://protrainer.com.br'
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://protrainer.com.br/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      },
      mainEntity: {
        '@type': 'Organization',
        name: 'PRO TRAINER'
      }
    }
  }
};

// Utility functions for SEO metadata generation
export function generateMetadata(seoData: Partial<SEOMetadata> = {}): Metadata {
  const config = defaultSEOConfig;
  
  const title = seoData.title || config.defaultTitle;
  const description = seoData.description || config.defaultDescription;
  const image = seoData.openGraph?.image || config.defaultImage;
  const url = seoData.openGraph?.url || config.siteUrl;

  const metadata: Metadata = {
    metadataBase: new URL(config.siteUrl),
    title,
    description,
    keywords: seoData.keywords?.join(', '),
    authors: [{ name: config.siteName }],
    creator: config.siteName,
    publisher: config.siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: seoData.openGraph?.type || 'website',
      title: seoData.openGraph?.title || title,
      description: seoData.openGraph?.description || description,
      url,
      siteName: config.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: config.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.openGraph?.title || title,
      description: seoData.openGraph?.description || description,
      images: [image],
      creator: '@protrainer',
    },
    alternates: {
      canonical: url,
    },
    verification: {
      google: 'google-site-verification-code',
    },
  };

  return metadata;
}

// Generate page-specific metadata
export function generatePageMetadata(
  pageTitle: string,
  pageDescription: string,
  pagePath: string = '',
  additionalData: Partial<SEOMetadata> = {}
): Metadata {
  const config = defaultSEOConfig;
  const fullUrl = `${config.siteUrl}${pagePath}`;
  
  return generateMetadata({
    title: `${pageTitle} | ${config.siteName}`,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: fullUrl,
      type: 'website',
      image: config.defaultImage,
    },
    ...additionalData,
  });
}

// Generate structured data JSON-LD
export function generateStructuredData(data: StructuredDataObject): string {
  return JSON.stringify(data, null, 2);
}

// Combine multiple structured data objects
export function combineStructuredData(...dataObjects: StructuredDataObject[]): string {
  if (dataObjects.length === 1) {
    return generateStructuredData(dataObjects[0]);
  }
  
  return JSON.stringify(dataObjects, null, 2);
}

// Validate SEO metadata completeness
export function validateSEOMetadata(metadata: Partial<SEOMetadata>): {
  isValid: boolean;
  missingFields: string[];
  warnings: string[];
} {
  const missingFields: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!metadata.title) missingFields.push('title');
  if (!metadata.description) missingFields.push('description');

  // Validation warnings
  if (metadata.title && metadata.title.length > 60) {
    warnings.push('Title is longer than 60 characters (recommended for SEO)');
  }
  
  if (metadata.description && metadata.description.length > 160) {
    warnings.push('Description is longer than 160 characters (recommended for SEO)');
  }

  if (metadata.description && metadata.description.length < 120) {
    warnings.push('Description is shorter than 120 characters (consider expanding)');
  }

  if (metadata.openGraph && !metadata.openGraph.image) {
    warnings.push('OpenGraph image is missing');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings,
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate service structured data for fitness/personal training
export function generateServiceStructuredData(
  serviceName: string,
  description: string,
  provider: string = defaultSEOConfig.siteName,
  price?: string,
  duration?: string
): StructuredDataObject {
  const service: StructuredDataObject = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: defaultSEOConfig.siteUrl
    },
    serviceType: 'Personal Training',
    category: 'Fitness',
    areaServed: {
      '@type': 'Country',
      name: 'Brazil'
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: defaultSEOConfig.siteUrl,
      serviceSmsNumber: '+55-11-99999-9999'
    }
  };

  // Add pricing information if provided
  if (price) {
    service.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
    };
  }

  // Add duration if provided
  if (duration) {
    service.duration = duration;
  }

  return service;
}

// Generate LocalBusiness structured data for fitness businesses
export function generateLocalBusinessStructuredData(
  businessName: string = defaultSEOConfig.siteName,
  description: string = defaultSEOConfig.defaultDescription
): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${defaultSEOConfig.siteUrl}#localbusiness`,
    name: businessName,
    description,
    url: defaultSEOConfig.siteUrl,
    telephone: '+55-11-99999-9999',
    priceRange: '$$',
    image: `${defaultSEOConfig.siteUrl}/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressLocality: 'São Paulo',
      addressRegion: 'SP'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.5505,
      longitude: -46.6333
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '06:00',
        closes: '22:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '08:00',
        closes: '16:00'
      }
    ],
    sameAs: [
      'https://www.instagram.com/protrainer',
      'https://www.facebook.com/protrainer',
      'https://www.youtube.com/protrainer'
    ]
  };
}

// Generate Person structured data for personal trainers
export function generatePersonStructuredData(
  name: string,
  jobTitle: string = 'Personal Trainer',
  description?: string
): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    description: description || `${jobTitle} especializado em transformação corporal`,
    url: defaultSEOConfig.siteUrl,
    image: `${defaultSEOConfig.siteUrl}/trainer-photo.svg`,
    worksFor: {
      '@type': 'Organization',
      name: defaultSEOConfig.siteName,
      url: defaultSEOConfig.siteUrl
    },
    knowsAbout: [
      'Personal Training',
      'Fitness',
      'Nutrição Esportiva',
      'Transformação Corporal',
      'Musculação',
      'Emagrecimento'
    ],
    sameAs: [
      'https://www.instagram.com/protrainer',
      'https://www.linkedin.com/in/protrainer'
    ]
  };
}

// Generate Course structured data for training programs
export function generateCourseStructuredData(
  courseName: string,
  description: string,
  duration: string = 'P90D', // 90 days in ISO 8601 duration format
  price?: string
): StructuredDataObject {
  const course: StructuredDataObject = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: courseName,
    description,
    provider: {
      '@type': 'Organization',
      name: defaultSEOConfig.siteName,
      url: defaultSEOConfig.siteUrl
    },
    courseMode: 'online',
    educationalLevel: 'Beginner',
    timeRequired: duration,
    inLanguage: 'pt-BR',
    availableLanguage: 'pt-BR',
    coursePrerequisites: 'Nenhum pré-requisito necessário',
    teaches: [
      'Técnicas de treino personalizado',
      'Princípios de nutrição esportiva',
      'Metodologia de transformação corporal'
    ]
  };

  if (price) {
    course.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock'
    };
  }

  return course;
}

// Generate Review/Rating structured data
export function generateAggregateRatingStructuredData(
  itemName: string,
  ratingValue: number = 4.8,
  reviewCount: number = 150,
  bestRating: number = 5
): StructuredDataObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: itemName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: bestRating.toString(),
      worstRating: '1'
    }
  };
}