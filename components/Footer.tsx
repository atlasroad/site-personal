'use client';

import { motion } from 'framer-motion';
// Font Awesome icons are loaded via CDN in layout.tsx

export default function Footer() {
  const socialLinks = [
    { icon: 'fa-brands fa-instagram', href: 'https://instagram.com', label: 'Instagram' },
    { icon: 'fa-brands fa-linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: 'fa-brands fa-whatsapp', href: 'https://wa.me/', label: 'WhatsApp' },
  ];

  return (
    <footer className="mt-20 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#050505] border border-neutral-800 rounded-3xl p-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            {/* Lado Esquerdo - Branding */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white">
                PRO<span className="text-[#ccff00]"> TRAINER</span>
              </h2>
              <p className="text-neutral-400 text-sm">
                Treino premium • execução minimalista • resultados mensuráveis
              </p>
            </div>

            {/* Lado Direito - Info e Redes Sociais */}
            <div className="text-center md:text-right space-y-3">
              <p className="text-neutral-500 text-sm">
                © 2026 PT Premium. Todos os direitos reservados.
              </p>
              
              {/* Ícones de Redes Sociais */}
              <div className="flex justify-center md:justify-end items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-neutral-500 hover:text-[#ccff00] hover:scale-110 transition-all duration-200"
                  >
                    <i className={`${social.icon} text-2xl`}></i>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
