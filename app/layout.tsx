import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import StructuredData from "@/components/StructuredData";
import { generateMetadata, defaultSEOConfig } from "@/lib/seo";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap', // Melhora LCP - mostra texto imediatamente
  preload: true,
});

// Generate default metadata using SEO utilities
export const metadata: Metadata = {
  metadataBase: new URL(defaultSEOConfig.siteUrl),
  ...generateMetadata({
    title: defaultSEOConfig.defaultTitle,
    description: defaultSEOConfig.defaultDescription,
    keywords: [
      'personal trainer',
      'transformação corporal',
      'emagrecimento',
      'musculação',
      'fitness',
      'treino personalizado',
      '90 dias',
      'resultados garantidos'
    ],
    openGraph: {
      title: defaultSEOConfig.defaultTitle,
      description: defaultSEOConfig.defaultDescription,
      url: defaultSEOConfig.siteUrl,
      type: 'website',
      image: defaultSEOConfig.defaultImage,
      siteName: defaultSEOConfig.siteName,
      locale: defaultSEOConfig.locale,
    },
  })
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preload de recursos críticos para LCP */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://site-assets.fontawesome.com" />
        
        {/* Font Awesome carregado corretamente como CSS */}
        <link 
          rel="stylesheet" 
          href="https://site-assets.fontawesome.com/releases/v7.1.0/css/all.css" 
          precedence="high" 
        />
        
        <StructuredData 
          data={[
            defaultSEOConfig.structuredData.organization,
            defaultSEOConfig.structuredData.website
          ]} 
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        {/* Layout Wrapper - Controla overflow sem quebrar iOS scroll */}
        <div className="relative w-full overflow-x-hidden">
          {children}
          <FloatingWhatsapp />
        </div>
      </body>
    </html>
  );
}
