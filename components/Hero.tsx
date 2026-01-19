'use client';

import { motion } from 'framer-motion';
// Font Awesome icons are loaded via CDN in layout.tsx
import Image from 'next/image';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { BlurIn } from '@/components/ui/blur-in';
import { NumberTicker } from '@/components/ui/number-ticker';
import { H1 } from '@/components/ui/Heading';
import { generateImageMetadata, optimizeUnsplashUrl, generateBlurDataURL } from '@/lib/image-optimization';

export default function Hero() {
  // Generate optimized image metadata for hero background
  const heroImageMetadata = generateImageMetadata(
    optimizeUnsplashUrl(
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      { width: 1920, height: 1080, quality: 85 }
    ),
    'hero',
    {
      service: 'Transformação corporal em 90 dias',
      location: 'São Paulo',
      description: 'Personal trainer profissional demonstrando exercícios de alta performance',
      priority: true,
      quality: 85
    }
  );

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImageMetadata.src}
          alt={heroImageMetadata.alt}
          fill
          className="object-cover opacity-20"
          priority={true}
          fetchPriority="high"
          loading="eager"
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={85}
          placeholder="blur"
          blurDataURL={generateBlurDataURL(10, 6, '#0a0a0a')}
        />
      </div>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(204,255,0,0.1),transparent_50%)] z-[1]" />

      {/* Background Beams */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Headline - Tipografia Colossal - Animação Padronizada */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <H1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white mb-8 text-center break-words overflow-visible">
              <BlurIn word={<span className="text-white">TRANSFORME</span>} delay={0.2} />
              <br />
              <BlurIn word={<span className="text-[#ccff00]">SEU CORPO</span>} delay={0.3} />
              <br />
              <BlurIn word={<span className="text-white">EM 90 DIAS</span>} delay={0.4} />
            </H1>
          </motion.div>

          {/* Subheadline - Animação Padronizada */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            Descubra o método exclusivo que já transformou mais de{' '}
            <span className="text-[#ccff00] font-bold">
              <NumberTicker value={500} suffix="+ vidas" delay={0.6} />
            </span>. 
            Treinamento personalizado, nutrição estratégica e acompanhamento 24/7. 
            <span className="text-white font-semibold"> Resultados garantidos ou seu dinheiro de volta.</span>
          </motion.p>

          {/* CTA Buttons - Animação Padronizada */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mx-auto"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 30px rgba(204,255,0,0.6)' 
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Começar transformação agora"
              className="bg-[#ccff00] text-black font-black uppercase tracking-wide py-4 px-10 rounded-full transition-all flex items-center gap-3"
            >
              Começar Agora
              <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(255,255,255,0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Ver resultados de transformações"
              className="bg-white text-black font-black uppercase tracking-wide py-4 px-10 rounded-full transition-all flex items-center gap-3"
            >
              <i className="fa-solid fa-play text-black"></i>
              Ver Resultados
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
