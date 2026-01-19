'use client';

import { motion } from 'framer-motion';
// Font Awesome icons are loaded via CDN in layout.tsx
import { BlurIn } from '@/components/ui/blur-in';
import { H2, H3 } from '@/components/ui/Heading';

const services = [
  {
    title: 'Consultoria Online',
    highlight: 'Liberdade para treinar onde quiser com meu protocolo',
    icon: 'fa-solid fa-mobile-screen-button',
    secondaryIcon: 'fa-solid fa-cloud',
    cta: 'Aplicar para Consultoria',
    whatsappMessage: 'Olá! Gostaria de aplicar para a Consultoria Online.',
    badge: null,
  },
  {
    title: 'Personal Presencial',
    highlight: 'Acompanhamento VIP e correção de movimento em tempo real',
    icon: 'fa-solid fa-dumbbell',
    secondaryIcon: 'fa-solid fa-user',
    cta: 'Verificar Disponibilidade',
    whatsappMessage: 'Olá! Gostaria de verificar a disponibilidade para Personal Presencial.',
    badge: 'Vagas Limitadas',
  },
];

export default function Services() {
  const handleWhatsAppClick = (message: string) => {
    const phoneNumber = '5511999999999'; // Substitua pelo número real
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    // Abre em nova aba com segurança
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <section id="planos" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <H2 className="text-[2.6rem] leading-[1] md:text-7xl font-black uppercase tracking-tighter text-white mb-10 text-center px-4 break-words">
              <BlurIn word={<span className="text-white">PROGRAMAS E&nbsp;</span>} delay={0.1} />
              <br className="md:hidden" />
              <BlurIn word={<span className="text-[#ccff00]">CONSULTORIA</span>} delay={0.2} />
            </H2>
          </motion.div>
          <motion.p 
            className="text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto mt-4 mb-12"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Métodos validados para queimar gordura e construir músculo.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto overflow-visible">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut",
                delay: index * 0.1 
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              className="relative group cursor-pointer"
            >
              <div className="relative p-10 rounded-[2rem] bg-[#0a0a0a] border border-neutral-800 group-hover:border-[#ccff00] transition-all duration-300 overflow-visible group-hover:shadow-[0_0_30px_rgba(204,255,0,0.15)]">
                {/* Enhanced Neon glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00]/0 via-[#ccff00]/8 to-[#ccff00]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem]" />
                
                {/* Subtle glow border effect */}
                <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#ccff00]/20 to-transparent blur-sm" />
                
                {/* Badge - Posicionado de forma segura */}
                {service.badge && (
                  <motion.div 
                    className="absolute top-5 right-5 z-20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  >
                    <div className="bg-[#ccff00] text-black text-xs font-bold px-3 py-1 rounded-lg shadow-lg uppercase tracking-wide">
                      {service.badge}
                    </div>
                  </motion.div>
                )}

                {/* Icons with enhanced animations */}
                <motion.div 
                  className="flex items-center gap-4 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#ccff00]/20 blur-xl rounded-2xl group-hover:bg-[#ccff00]/30 transition-all duration-300" />
                    <div className="relative p-4 bg-[#ccff00]/10 rounded-lg border border-[#ccff00]/30 group-hover:border-[#ccff00]/50 transition-all duration-300">
                      <i className={`${service.icon} text-[#ccff00] text-2xl group-hover:scale-110 transition-transform duration-200`}></i>
                    </div>
                  </div>
                  {service.secondaryIcon && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#ccff00]/20 blur-xl rounded-2xl group-hover:bg-[#ccff00]/30 transition-all duration-300" />
                      <div className="relative p-3 bg-[#ccff00]/10 rounded-lg border border-[#ccff00]/30 group-hover:border-[#ccff00]/50 transition-all duration-300">
                        <i className={`${service.secondaryIcon} text-[#ccff00] text-xl group-hover:scale-110 transition-transform duration-200`}></i>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Content with staggered animations */}
                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  >
                    <H3 className="text-white mb-4 group-hover:text-[#ccff00] transition-colors duration-300">{service.title}</H3>
                  </motion.div>
                  
                  <motion.p 
                    className="text-lg text-neutral-400 leading-relaxed mb-8 group-hover:text-neutral-300 transition-colors duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  >
                    {service.highlight}
                  </motion.p>

                  {/* Enhanced CTA Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: '0 0 30px rgba(204,255,0,0.7)',
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      transition: { duration: 0.1 }
                    }}
                    onClick={() => handleWhatsAppClick(service.whatsappMessage)}
                    aria-label={`${service.cta} - ${service.title}`}
                    className="w-full bg-[#ccff00] text-black font-black uppercase tracking-wide py-4 px-8 rounded-full transition-all flex items-center justify-center gap-3 group/btn hover:bg-[#b8e600]"
                  >
                    {service.cta}
                    <i className="fa-solid fa-arrow-right group-hover/btn:translate-x-1 transition-transform duration-200"></i>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="text-center mt-12"
        >
          <p className="text-neutral-400 leading-relaxed">
            Ambos os serviços incluem <span className="text-[#ccff00] font-bold">acompanhamento personalizado</span> e <span className="text-[#ccff00] font-bold">resultados garantidos</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
