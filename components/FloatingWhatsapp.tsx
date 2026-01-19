'use client'
import { useState, useEffect } from 'react'
// Font Awesome icons are loaded via CDN in layout.tsx
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingWhatsapp() {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Monitoramento de scroll para mostrar/ocultar o botão
  useEffect(() => {
    const toggleVisibility = () => {
      // Aparece quando o scroll passar de 300px (fim da Hero no mobile)
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true })
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Tooltip automático (só aparece se o botão estiver visível)
  useEffect(() => {
    if (!isVisible) return

    // Entra depois de 3 segundos (só se o botão estiver visível)
    const showTimer = setTimeout(() => setShowTooltip(true), 3000)
    // Sai depois de 10 segundos exibindo (Total 13s)
    const hideTimer = setTimeout(() => setShowTooltip(false), 13000)
    
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-24 md:bottom-8 right-6 z-50 flex flex-row items-center gap-3 justify-end pointer-events-none"
        >
          {/* Container flexível garante que o balão fique sempre alinhado ao centro do botão */}
          
          {/* TOOLTIP (Balão) - Pointer events auto para permitir fechar */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative pointer-events-auto"
              >
                <div className="bg-white text-neutral-950 px-5 py-4 rounded-2xl shadow-xl border border-neutral-200 w-max max-w-[260px]">
                  <button 
                    onClick={() => setShowTooltip(false)}
                    className="absolute -top-2 -left-2 bg-neutral-200 p-1 rounded-full hover:bg-neutral-300 transition-colors"
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                  
                  <p className="text-sm font-bold">
                    Quer saber os valores?
                    <span className="block text-xs font-normal text-neutral-600 mt-1">
                      Chame agora e receba o PDF explicativo.
                    </span>
                  </p>
                  
                  {/* Setinha apontando para a direita (para o botão) */}
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-neutral-200" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOTÃO WHATSAPP - Pointer events auto */}
          <motion.a
            href="https://wa.me/5500000000000?text=Ola+vim+pelo+site"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Entrar em contato via WhatsApp"
            className="pointer-events-auto relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl transition-transform"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 20px rgba(37, 211, 102, 0.5)"
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ 
              rotate: { 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3,
                ease: "easeInOut"
              }
            }}
          >
            <i className="fa-brands fa-whatsapp text-white text-3xl"></i>
            <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping" />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
