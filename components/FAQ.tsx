'use client';

import { motion, AnimatePresence } from 'framer-motion';
// Font Awesome icons are loaded via CDN in layout.tsx
import { useState } from 'react';
import { H2 } from '@/components/ui/Heading';

const faqs = [
  {
    question: 'Quanto tempo leva para ver resultados?',
    answer: 'Com o método PRO TRAINER, você começa a ver mudanças visíveis em 30 dias. Em 90 dias, a transformação é completa. Nossos alunos relatam aumento de energia já na primeira semana.',
  },
  {
    question: 'Preciso ter experiência na academia?',
    answer: 'Não! O método é adaptado para todos os níveis. Se você é iniciante, começamos do zero. Se já treina, otimizamos seu treino atual para resultados máximos.',
  },
  {
    question: 'Como funciona o acompanhamento?',
    answer: 'Você recebe check-ins diários via WhatsApp, ajustes semanais no treino e suporte 24/7. Toda dúvida é respondida em até 2 horas. Você nunca fica sozinho nessa jornada.',
  },
  {
    question: 'O plano nutricional está incluído?',
    answer: 'Sim! Nos planos Trimestral e Anual, você recebe um plano nutricional completo, calculado especificamente para seus objetivos e biotipo. No plano Mensal, oferecemos orientações gerais.',
  },
  {
    question: 'E se eu não conseguir seguir o plano?',
    answer: 'Ajustamos! O método é flexível e se adapta à sua rotina. Se você tem limitações de tempo, criamos treinos mais eficientes. Se tem restrições alimentares, adaptamos a nutrição. O importante é a consistência, não a perfeição.',
  },
  {
    question: 'Há garantia de resultados?',
    answer: 'Sim! Oferecemos garantia de 30 dias. Se você seguir o método corretamente e não estiver satisfeito, devolvemos 100% do seu investimento. Mas a verdade é: seguindo o método, resultados são inevitáveis.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-[#0f0f0f]">
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
            <span className="text-white">PERGUNTAS</span>
            <span className="text-[#ccff00]">&nbsp;FREQUENTES</span>
          </H2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto mt-4 mb-12"
          >
            Tire todas as suas dúvidas antes de começar sua transformação.
          </motion.p>
        </motion.div>

        {/* FAQ Items - Efeito Cascata */}
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1, 
                ease: "easeOut" 
              }}
              className="bg-[#0a0a0a] border border-neutral-800 rounded-[2rem] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-8 flex items-center justify-between text-left"
              >
                <span className="text-lg md:text-xl font-bold text-white pr-4">{faq.question}</span>
                <i
                  className={`fa-solid fa-chevron-down text-[#ccff00] flex-shrink-0 transition-transform text-xl ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                ></i>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-lg md:text-xl text-neutral-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
