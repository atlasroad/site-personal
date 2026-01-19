/**
 * SEO Examples and Usage Guide
 * 
 * This file demonstrates how to use the SEO utilities from lib/seo.ts
 * for different types of pages and content.
 */

import {
  generateMetadata,
  generatePageMetadata,
  generateStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  generateServiceStructuredData,
  generateLocalBusinessStructuredData,
  generatePersonStructuredData,
  generateCourseStructuredData,
  generateAggregateRatingStructuredData,
  validateSEOMetadata,
  SEOMetadata,
  defaultSEOConfig
} from './seo';

// Example 1: Basic page metadata
export const homePageMetadata = generatePageMetadata(
  'Transformação Corporal em 90 Dias',
  'Método exclusivo de personal training que garante resultados em 90 dias.',
  '/'
);

// Example 2: Service page metadata
export const servicesPageMetadata = generatePageMetadata(
  'Serviços de Personal Training',
  'Conheça nossos serviços de personal training: treino personalizado, consultoria nutricional e acompanhamento completo.',
  '/servicos',
  {
    keywords: ['personal training', 'treino personalizado', 'consultoria nutricional']
  }
);

// Example 3: Blog post metadata
export const blogPostMetadata = generateMetadata({
  title: 'Como Perder 10kg em 90 Dias | PRO TRAINER',
  description: 'Descubra o método científico para perder 10kg em 90 dias de forma saudável e sustentável.',
  keywords: ['emagrecimento', 'perda de peso', 'dieta', 'exercícios'],
  openGraph: {
    title: 'Como Perder 10kg em 90 Dias',
    description: 'Método científico para emagrecimento saudável e sustentável.',
    url: `${defaultSEOConfig.siteUrl}/blog/como-perder-10kg-em-90-dias`,
    type: 'article',
    image: `${defaultSEOConfig.siteUrl}/blog-images/perder-peso.jpg`
  }
});

// Example 4: FAQ structured data
export const faqStructuredData = generateFAQStructuredData([
  {
    question: 'Quanto tempo leva para ver resultados?',
    answer: 'Com nosso método exclusivo, você começará a ver resultados visíveis nas primeiras 2-3 semanas, com transformação completa em 90 dias.'
  },
  {
    question: 'O treino é adequado para iniciantes?',
    answer: 'Sim! Nossos treinos são personalizados para todos os níveis, desde iniciantes até atletas avançados.'
  },
  {
    question: 'Preciso de equipamentos especiais?',
    answer: 'Não. Adaptamos os treinos para o que você tem disponível, seja em casa ou na academia.'
  }
]);

// Example 5: Service structured data
export const personalTrainingService = generateServiceStructuredData(
  'Personal Training Exclusivo',
  'Treino personalizado com acompanhamento individual para transformação corporal em 90 dias.',
  'PRO TRAINER',
  '297.00',
  'P90D'
);

// Example 6: Local Business structured data
export const localBusinessData = generateLocalBusinessStructuredData(
  'PRO TRAINER',
  'Personal Trainer de alta performance especializado em transformação corporal em 90 dias.'
);

// Example 7: Person structured data for trainer
export const trainerPersonData = generatePersonStructuredData(
  'PRO TRAINER',
  'Personal Trainer Certificado',
  'Especialista em transformação corporal com mais de 5 anos de experiência e centenas de alunos transformados.'
);

// Example 8: Course structured data
export const transformationCourse = generateCourseStructuredData(
  'Método de Transformação Corporal em 90 Dias',
  'Curso completo de transformação corporal com treinos personalizados, plano nutricional e acompanhamento profissional.',
  'P90D',
  '297.00'
);

// Example 9: Aggregate rating structured data
export const serviceRating = generateAggregateRatingStructuredData(
  'PRO TRAINER - Personal Training',
  4.9,
  200,
  5
);

// Example 6: Breadcrumb structured data
export const serviceBreadcrumbs = generateBreadcrumbStructuredData([
  { name: 'Home', url: defaultSEOConfig.siteUrl },
  { name: 'Serviços', url: `${defaultSEOConfig.siteUrl}/servicos` },
  { name: 'Personal Training', url: `${defaultSEOConfig.siteUrl}/servicos/personal-training` }
]);

// Example 7: Complete SEO validation
export function validatePageSEO(metadata: Partial<SEOMetadata>) {
  const validation = validateSEOMetadata(metadata);
  
  if (!validation.isValid) {
    console.warn('SEO Validation Failed:', validation.missingFields);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('SEO Warnings:', validation.warnings);
  }
  
  return validation;
}

// Example 8: Dynamic metadata generation for blog posts
export function generateBlogPostMetadata(
  title: string,
  excerpt: string,
  slug: string,
  publishDate: string,
  author: string = 'PRO TRAINER',
  tags: string[] = []
) {
  return generateMetadata({
    title: `${title} | Blog PRO TRAINER`,
    description: excerpt,
    keywords: tags,
    openGraph: {
      title,
      description: excerpt,
      url: `${defaultSEOConfig.siteUrl}/blog/${slug}`,
      type: 'article',
      image: `${defaultSEOConfig.siteUrl}/blog-images/${slug}.jpg`
    }
  });
}

// Example 9: Product/Service page with rich structured data
export function generateServicePageData(serviceName: string, description: string, price?: string) {
  const serviceStructuredData = generateServiceStructuredData(
    serviceName,
    description,
    defaultSEOConfig.siteName,
    price,
    'P90D'
  );

  const localBusinessData = generateLocalBusinessStructuredData();
  
  const ratingData = generateAggregateRatingStructuredData(
    serviceName,
    4.8,
    150
  );

  return {
    metadata: generatePageMetadata(serviceName, description, `/servicos/${serviceName.toLowerCase().replace(/\s+/g, '-')}`),
    structuredData: [serviceStructuredData, localBusinessData, ratingData]
  };
}

// Example 10: Complete page with multiple structured data types
export function generateCompletePageStructuredData() {
  return [
    generateServiceStructuredData(
      'Personal Training Exclusivo',
      'Transformação corporal em 90 dias com método exclusivo',
      'PRO TRAINER',
      '297.00',
      'P90D'
    ),
    generateLocalBusinessStructuredData(),
    generatePersonStructuredData(
      'PRO TRAINER',
      'Personal Trainer Certificado'
    ),
    generateCourseStructuredData(
      'Método de Transformação Corporal',
      'Curso completo de transformação corporal',
      'P90D',
      '297.00'
    ),
    generateAggregateRatingStructuredData(
      'PRO TRAINER',
      4.9,
      200
    )
  ];
}

// Example usage in a Next.js page:
/*
// app/servicos/personal-training/page.tsx
import { generateServicePageData } from '@/lib/seo-examples';
import StructuredData from '@/components/StructuredData';

const { metadata, structuredData } = generateServicePageData(
  'Personal Training Exclusivo',
  'Transforme seu corpo em 90 dias com acompanhamento personalizado.',
  '297.00'
);

export { metadata };

export default function PersonalTrainingPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <main>
        // Page content here
      </main>
    </>
  );
}
*/