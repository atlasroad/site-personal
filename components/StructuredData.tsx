import { StructuredDataObject, generateStructuredData } from '@/lib/seo';

interface StructuredDataProps {
  data: StructuredDataObject | StructuredDataObject[];
}

/**
 * Component for injecting structured data (JSON-LD) into pages
 * Usage: <StructuredData data={structuredDataObject} />
 */
export default function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) 
    ? JSON.stringify(data, null, 2)
    : generateStructuredData(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonLd,
      }}
    />
  );
}