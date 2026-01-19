'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { NumberTicker } from '@/components/ui/number-ticker';
import { H2, H3 } from '@/components/ui/Heading';
import { generateImageMetadata, optimizeUnsplashUrl, generateBlurDataURL } from '@/lib/image-optimization';

const testimonials = [
  {
    name: 'Carlos Silva',
    age: 32,
    period: '90 dias',
    before: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    after: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    result: '-18kg | +12kg massa magra',
  },
  {
    name: 'Ana Paula',
    age: 28,
    period: '90 dias',
    before: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    after: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    result: '-15kg | definição completa',
  },
  {
    name: 'Roberto Santos',
    age: 45,
    period: '90 dias',
    before: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    after: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e',
    result: '-25kg | força triplicada',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleImageLoad = (imageKey: string) => {
    setImageLoading(prev => ({ ...prev, [imageKey]: false }));
  };

  const handleImageLoadStart = (imageKey: string) => {
    setImageLoading(prev => ({ ...prev, [imageKey]: true }));
  };
  return (
    <section id="resultados" className="py-24 bg-[#0f0f0f]">
      <div className="container mx-auto px-6">
        {/* Título - Animação Padronizada */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <H2 className="text-[2.6rem] leading-[1] md:text-7xl font-black uppercase tracking-tighter text-white mb-10 text-center px-4 break-words">
            <span className="text-white">ANTES</span>
            <span className="text-[#ccff00]">&nbsp;E&nbsp;</span>
            <span className="text-white">DEPOIS</span>
          </H2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto mt-4 mb-12"
          >
            Resultados reais de pessoas reais. Transformações em apenas 90 dias.
          </motion.p>
        </motion.div>

        {/* Carrossel de Transformações */}
        <div className="relative max-w-4xl mx-auto">
          {/* Controles do Carrossel */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              aria-label="Ver transformação anterior"
              className="p-3 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full hover:bg-[#ccff00]/20 transition-all"
            >
              <i className="fa-solid fa-chevron-left text-[#ccff00] text-xl"></i>
            </motion.button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-[#ccff00]' : 'bg-neutral-600'
                  }`}
                />
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              aria-label="Ver próxima transformação"
              className="p-3 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full hover:bg-[#ccff00]/20 transition-all"
            >
              <i className="fa-solid fa-chevron-right text-[#ccff00] text-xl"></i>
            </motion.button>
          </div>

          {/* Carrossel Principal */}
          <div className="overflow-hidden rounded-[2rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                {(() => {
                  const testimonial = testimonials[currentIndex];
                  
                  // Generate optimized image metadata for before/after photos
                  const beforeImageMetadata = generateImageMetadata(
                    optimizeUnsplashUrl(testimonial.before, { width: 400, height: 600, quality: 85, format: 'webp' }),
                    'before',
                    { 
                      name: testimonial.name,
                      description: `Transformação corporal antes - Cliente ${testimonial.name} - PRO TRAINER`
                    }
                  );

                  const afterImageMetadata = generateImageMetadata(
                    optimizeUnsplashUrl(testimonial.after, { width: 400, height: 600, quality: 85, format: 'webp' }),
                    'after',
                    { 
                      name: testimonial.name,
                      description: `Transformação corporal depois - Cliente ${testimonial.name} - PRO TRAINER`
                    }
                  );

                  return (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 hover:border-[#ccff00]/30 transition-all cursor-pointer"
                    >
                      {/* Before/After Images */}
                      <div className="grid grid-cols-2 gap-2 p-2">
                        <div className="relative aspect-[3/4] bg-gray-800 rounded-[1.5rem] overflow-hidden">
                          {/* Skeleton Loading */}
                          {imageLoading[`before-${currentIndex}`] && (
                            <div className="absolute inset-0 bg-neutral-800 animate-pulse rounded-[1.5rem]">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent animate-pulse"></div>
                            </div>
                          )}
                          <Image
                            src={beforeImageMetadata.src}
                            alt={beforeImageMetadata.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            quality={85}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL={generateBlurDataURL(8, 12, '#1f2937')}
                            onLoadStart={() => handleImageLoadStart(`before-${currentIndex}`)}
                            onLoad={() => handleImageLoad(`before-${currentIndex}`)}
                          />
                          <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 rounded-[0.5rem] text-gray-300 text-xs font-semibold">
                            ANTES
                          </div>
                        </div>
                        <div className="relative aspect-[3/4] bg-gray-800 rounded-[1.5rem] overflow-hidden">
                          {/* Skeleton Loading */}
                          {imageLoading[`after-${currentIndex}`] && (
                            <div className="absolute inset-0 bg-neutral-800 animate-pulse rounded-[1.5rem]">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent animate-pulse"></div>
                            </div>
                          )}
                          <Image
                            src={afterImageMetadata.src}
                            alt={afterImageMetadata.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            quality={85}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL={generateBlurDataURL(8, 12, '#1f2937')}
                            onLoadStart={() => handleImageLoadStart(`after-${currentIndex}`)}
                            onLoad={() => handleImageLoad(`after-${currentIndex}`)}
                          />
                          <div className="absolute top-3 left-3 px-2 py-1 bg-[#ccff00]/90 text-[#0a0a0a] text-xs font-bold rounded-[0.5rem]">
                            DEPOIS
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6 text-center">
                        <H3 className="text-white mb-1">{testimonial.name}</H3>
                        <p className="text-neutral-400 text-sm mb-3 leading-relaxed">{testimonial.age} anos • {testimonial.period}</p>
                        <div className="px-4 py-2 bg-[#ccff00]/10 rounded-[0.95rem] border border-[#ccff00]/30">
                          <p className="text-[#ccff00] font-bold text-sm">{testimonial.result}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* CTA Final com Selo de Garantia */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-center mt-12"
        >
          <p className="text-neutral-400 mb-6 leading-relaxed">
            Mais de <span className="text-[#ccff00] font-bold"><NumberTicker value={500} suffix=" transformações" delay={0.5} /></span> em 2024
          </p>
          
          {/* Selo de Garantia */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="inline-flex items-center gap-3 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-2xl px-6 py-4 mb-6"
          >
            <i className="fa-solid fa-shield-check text-[#ccff00] text-2xl"></i>
            <span className="text-white font-semibold">
              Satisfação Garantida ou seu dinheiro de volta em até 7 dias
            </span>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 25px rgba(204,255,0,0.6)'
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Ver mais resultados de transformações"
            className="px-8 py-3 border-2 border-[#ccff00] text-[#ccff00] font-bold rounded-2xl hover:bg-[#ccff00] hover:text-[#0a0a0a] transition-all"
          >
            Ver Mais Resultados
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
