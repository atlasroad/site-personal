import { render } from '@testing-library/react';
import StructuredData from '../StructuredData';
import { generateServiceStructuredData, generateFAQStructuredData } from '@/lib/seo';

describe('StructuredData Component', () => {
  it('should render single structured data object', () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Test Organization'
    };

    const { container } = render(<StructuredData data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    
    expect(script).toBeInTheDocument();
    
    const jsonContent = JSON.parse(script?.innerHTML || '{}');
    expect(jsonContent['@context']).toBe('https://schema.org');
    expect(jsonContent['@type']).toBe('Organization');
    expect(jsonContent.name).toBe('Test Organization');
  });

  it('should render array of structured data objects', () => {
    const serviceData = generateServiceStructuredData(
      'Personal Training',
      'Professional fitness training'
    );
    
    const faqData = generateFAQStructuredData([
      { question: 'What is this?', answer: 'This is a test.' }
    ]);

    const { container } = render(<StructuredData data={[serviceData, faqData]} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    
    expect(script).toBeInTheDocument();
    
    const jsonContent = JSON.parse(script?.innerHTML || '[]');
    expect(Array.isArray(jsonContent)).toBe(true);
    expect(jsonContent).toHaveLength(2);
    
    // Check service data
    expect(jsonContent[0]['@type']).toBe('Service');
    expect(jsonContent[0].name).toBe('Personal Training');
    
    // Check FAQ data
    expect(jsonContent[1]['@type']).toBe('FAQPage');
    expect(jsonContent[1].mainEntity).toHaveLength(1);
  });

  it('should handle empty data gracefully', () => {
    const { container } = render(<StructuredData data={{} as any} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    
    expect(script).toBeInTheDocument();
    expect(script?.innerHTML).toBe('{}');
  });

  it('should render valid JSON-LD format', () => {
    const complexData = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Personal Training',
      description: 'Professional fitness training',
      provider: {
        '@type': 'Organization',
        name: 'PRO TRAINER',
        url: 'https://protrainer.com.br'
      },
      offers: {
        '@type': 'Offer',
        price: '297.00',
        priceCurrency: 'BRL'
      }
    };

    const { container } = render(<StructuredData data={complexData} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    
    expect(script).toBeInTheDocument();
    
    // Validate that it's valid JSON
    expect(() => JSON.parse(script?.innerHTML || '')).not.toThrow();
    
    const parsed = JSON.parse(script?.innerHTML || '{}');
    expect(parsed.provider.name).toBe('PRO TRAINER');
    expect(parsed.offers.price).toBe('297.00');
  });

  it('should properly escape HTML in JSON-LD', () => {
    const dataWithHtml = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Test & Company',
      description: 'A company with <strong>HTML</strong> content'
    };

    const { container } = render(<StructuredData data={dataWithHtml} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    
    expect(script).toBeInTheDocument();
    
    const parsed = JSON.parse(script?.innerHTML || '{}');
    expect(parsed.name).toBe('Test & Company');
    expect(parsed.description).toBe('A company with <strong>HTML</strong> content');
  });
});