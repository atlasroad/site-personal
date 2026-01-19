'use client';

import { motion } from 'framer-motion';
// Font Awesome icons are loaded via CDN in layout.tsx
import { H3, H4 } from '@/components/ui/Heading';

const problems = [
  {
    icon: 'fa-solid fa-dumbbell',
    title: 'Treino Genérico',
    description: 'Você segue planilhas prontas que não consideram seu biotipo, objetivos e limitações. Resultado: meses treinando sem ver progresso real.',
  },
  {
    icon: 'fa-solid fa-clock',
    title: 'Falta de Consistência',
    description: 'Você treina 3 dias, falta 2, volta na segunda... Sem rotina estruturada, seu corpo não tem tempo de se adaptar e evoluir.',
  },
  {
    icon: 'fa-solid fa-bullseye',
    title: 'Nutrição Desalinhada',
    description: 'Você treina pesado mas come errado. Sem os nutrientes certos no momento certo, seus músculos não se recuperam nem crescem.',
  },
];

const solutions = [
  {
    icon: 'fa-solid fa-check',
    title: 'Plano 100% Personalizado',
    description: 'Análise completa do seu perfil. Treino adaptado ao seu corpo, objetivos e disponibilidade. Ajustes semanais baseados em resultados reais.',
  },
  {
    icon: 'fa-solid fa-check',
    title: 'Acompanhamento Diário',
    description: 'Check-ins diários, ajustes em tempo real e suporte 24/7. Você nunca fica perdido. Cada treino é monitorado e otimizado.',
  },
  {
    icon: 'fa-solid fa-check',
    title: 'Nutrição Estratégica',
    description: 'Plano alimentar que acelera seus resultados. Timing perfeito, macros calculados e suplementação otimizada para maximizar ganhos.',
  },
];

export default function ProblemSolution() {
  return (
    <section id="sobre" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        {/* Título - Animação Padronizada */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-[2.6rem] leading-[1] md:text-7xl font-black uppercase tracking-tighter text-white mb-10 text-center px-4 break-words">
            O PROBLEMA <br />
            <span className="text-[#ccff00] text-[3rem] md:text-8xl">VS</span> <br />
            A SOLUÇÃO
          </h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto mt-4 mb-12"
          >
            Pare de perder tempo. Veja o que você está fazendo errado e como o método PRO TRAINER resolve isso.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Problems Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <H3 className="text-red-400 mb-8 flex items-center gap-2">
              <i className="fa-solid fa-xmark text-2xl"></i>
              Erros Comuns
            </H3>
            <div className="space-y-6">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4 + (index * 0.1), 
                    ease: "easeOut" 
                  }}
                  className="p-6 bg-white/5 rounded-[2rem] border border-red-500/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                      <i className={`${problem.icon} text-red-400 text-xl`}></i>
                    </div>
                    <div>
                      <H4 className="text-white mb-2">{problem.title}</H4>
                      <p className="text-gray-400 leading-relaxed">{problem.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solutions Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <H3 className="text-[#ccff00] mb-8 flex items-center gap-2">
              <i className="fa-solid fa-check text-2xl"></i>
              Método Correto
            </H3>
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.6 + (index * 0.1), 
                    ease: "easeOut" 
                  }}
                  className="p-6 bg-[#ccff00]/10 rounded-[2rem] border border-[#ccff00]/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#ccff00]/20 rounded-xl">
                      <i className={`${solution.icon} text-[#ccff00] text-xl`}></i>
                    </div>
                    <div>
                      <H4 className="text-white mb-2">{solution.title}</H4>
                      <p className="text-gray-300 leading-relaxed">{solution.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}