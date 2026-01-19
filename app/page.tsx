import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StructuredData from '@/components/StructuredData';
import { HeadingProvider } from '@/components/ui/Heading';
import { 
  generatePageMetadata, 
  generateFAQStructuredData, 
  generateServiceStructuredData,
  generateCourseStructuredData,
  generateAggregateRatingStructuredData
} from '@/lib/seo';
import { Metadata } from 'next';

// Code Splitting - Componentes carregados dinamicamente para melhor performance
const ProblemSolution = dynamic(() => import('@/components/ProblemSolution'), {
  loading: () => <div className="h-96 bg-[#0a0a0a] animate-pulse" />,
});

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => <div className="h-96 bg-[#0f0f0f] animate-pulse" />,
});

const Services = dynamic(() => import('@/components/Services'), {
  loading: () => <div className="h-96 bg-[#0a0a0a] animate-pulse" />,
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div className="h-96 bg-[#0f0f0f] animate-pulse" />,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-[#0a0a0a] animate-pulse" />,
});

// Generate page-specific metadata for the home page
export const metadata: Metadata = generatePageMetadata(
  'Transformação Corporal em 90 Dias',
  'Método exclusivo de personal training que garante resultados em 90 dias. Transforme seu corpo com acompanhamento profissional e treinos personalizados.',
  '/',
  {
    keywords: [
      'personal trainer',
      'transformação corporal',
      'emagrecimento rápido',
      'musculação',
      'fitness',
      'treino personalizado',
      '90 dias',
      'resultados garantidos',
      'método exclusivo'
    ]
  }
);

export default function Home() {
  // FAQ data for structured data
  const faqData = [
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

  // Generate comprehensive structured data
  const personalTrainingService = generateServiceStructuredData(
    'Personal Training Exclusivo',
    'Treino personalizado com acompanhamento individual para transformação corporal em 90 dias com método exclusivo e resultados garantidos.',
    'PRO TRAINER',
    '297.00',
    'P90D'
  );

  const transformationCourse = generateCourseStructuredData(
    'Método de Transformação Corporal em 90 Dias',
    'Curso completo de transformação corporal com treinos personalizados, plano nutricional e acompanhamento profissional.',
    'P90D',
    '297.00'
  );

  const serviceRating = generateAggregateRatingStructuredData(
    'PRO TRAINER - Personal Training',
    4.9,
    200,
    5
  );

  const faqStructuredData = generateFAQStructuredData(faqData);

  return (
    <>
      <StructuredData 
        data={[
          personalTrainingService, 
          transformationCourse,
          serviceRating,
          faqStructuredData
        ]} 
      />
      <HeadingProvider initialLevel={0}>
        <main className="min-h-screen bg-[#0a0a0a] text-white">
          <Header />
          <Hero />
          <ProblemSolution />
          <Testimonials />
          <Services />
          <FAQ />
          <Footer />
        </main>
      </HeadingProvider>
    </>
  );
}
