/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de imagem para Lighthouse 90+
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // AVIF primeiro para máxima compressão
    formats: ['image/avif', 'image/webp'],
    // Device sizes otimizados para mobile-first
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache agressivo para performance
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compressão para reduzir tamanho dos assets
  compress: true,
  
  // Otimizações experimentais para performance (Next.js 16+)
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion'],
  },
  
  // Headers de performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
