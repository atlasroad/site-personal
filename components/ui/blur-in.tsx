'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BlurInProps {
  word: string | ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'default' | 'fade' | 'slide';
}

export function BlurIn({
  word,
  className,
  delay = 0,
  duration = 0.5,
  variant = 'default',
}: BlurInProps) {
  const variants = {
    default: {
      initial: { opacity: 0, filter: 'blur(20px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slide: {
      initial: { opacity: 0, filter: 'blur(20px)', y: 20 },
      animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
    },
  };

  return (
    <motion.span
      className={cn('inline-block', className)}
      initial={variants[variant].initial}
      whileInView={variants[variant].animate}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    >
      {word}
    </motion.span>
  );
}
