'use client';

import { motion } from 'framer-motion';
// Font Awesome icons are loaded via CDN in layout.tsx
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Controle do scroll quando menu está aberto - CORRIGIDO
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { 
      document.body.style.overflow = 'unset'; 
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-[100]">
      {/* Barra Superior - Corrigida para iPhone */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full px-6 py-4 pt-6 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold tracking-wider"
        >
          <span className="text-white">PRO</span>
          <span className="text-[#ccff00]"> TRAINER</span>
        </motion.div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <a href="#sobre" className="text-gray-300 hover:text-white transition-colors font-medium">
              Sobre
            </a>
          </li>
          <li>
            <a href="#resultados" className="text-gray-300 hover:text-white transition-colors font-medium">
              Resultados
            </a>
          </li>
          <li>
            <a href="#planos" className="text-gray-300 hover:text-white transition-colors font-medium">
              Serviços
            </a>
          </li>
          <li>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors font-medium">
              FAQ
            </a>
          </li>
        </ul>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block px-6 py-2.5 bg-[#ccff00] text-[#0a0a0a] font-bold rounded-2xl hover:bg-[#b8e600] transition-colors"
        >
          Consultoria
        </motion.button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="md:hidden text-white"
        >
          {isMenuOpen ? (
            <i className="fa-solid fa-xmark text-2xl text-white"></i>
          ) : (
            <i className="fa-solid fa-bars-staggered text-2xl text-white"></i>
          )}
        </button>
      </motion.div>

      {/* Menu Dropdown - Corrigido */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 w-full h-auto p-8 flex flex-col gap-6 z-[90] border-b border-white/5 shadow-2xl md:hidden"
          style={{
            backgroundColor: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          <ul className="flex flex-col gap-6 w-full">
            <li>
              <a 
                href="#sobre" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors font-medium block py-3 text-lg"
              >
                Sobre
              </a>
            </li>
            <li>
              <a 
                href="#resultados" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors font-medium block py-3 text-lg"
              >
                Resultados
              </a>
            </li>
            <li>
              <a 
                href="#planos" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors font-medium block py-3 text-lg"
              >
                Serviços
              </a>
            </li>
            <li>
              <a 
                href="#faq" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors font-medium block py-3 text-lg"
              >
                FAQ
              </a>
            </li>
            <li className="pt-4 border-t border-white/10 w-full">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-full px-6 py-4 bg-[#ccff00] text-[#0a0a0a] font-bold rounded-2xl hover:bg-[#b8e600] transition-colors shadow-lg text-lg"
              >
                Consultoria
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
}