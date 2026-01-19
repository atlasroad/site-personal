'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  className,
  prefix = '',
  suffix = '',
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  
  // A MÁGICA: Configuração de mola otimizada baseada no valor
  // Números maiores precisam de configurações diferentes para suavidade ideal
  const getSpringConfig = (targetValue: number) => {
    if (targetValue > 1000) {
      // Números grandes: mais suave e gradual
      return {
        damping: 80,
        stiffness: 60,
        mass: 1.2,
        restDelta: 0.01,
        restSpeed: 0.01,
      };
    } else if (targetValue > 100) {
      // Números médios: balanceado
      return {
        damping: 70,
        stiffness: 80,
        mass: 1,
        restDelta: 0.01,
        restSpeed: 0.01,
      };
    } else {
      // Números pequenos: mais responsivo
      return {
        damping: 60,
        stiffness: 100,
        mass: 0.8,
        restDelta: 0.01,
        restSpeed: 0.01,
      };
    }
  };

  const springValue = useSpring(motionValue, getSpringConfig(value));
  
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === 'down' ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        // Interpolação suave para evitar saltos bruscos
        // Quando está muito próximo do valor final, usa o valor exato
        const targetValue = direction === 'down' ? 0 : value;
        const progress = Math.abs(latest - (direction === 'down' ? value : 0)) / Math.abs(targetValue - (direction === 'down' ? value : 0));
        
        let displayValue;
        if (progress > 0.98) {
          // Nos últimos 2% da animação, usa o valor final para evitar saltos
          displayValue = targetValue;
        } else {
          // Durante a animação, usa Math.floor para suavidade
          displayValue = Math.floor(latest);
        }
        
        const formatted = Intl.NumberFormat('pt-BR').format(displayValue);
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });

    // Define valor inicial suave
    if (ref.current) {
      const initial = direction === 'down' ? value : 0;
      const formatted = Intl.NumberFormat('pt-BR').format(initial);
      ref.current.textContent = `${prefix}${formatted}${suffix}`;
    }

    return () => unsubscribe();
  }, [springValue, prefix, suffix, direction, value]);

  return (
    <span
      ref={ref}
      className={cn(
        'tabular-nums font-mono transition-all duration-100',
        'font-variant-numeric-tabular-nums', // CSS nativo para tabular nums
        className
      )}
      style={{ fontVariantNumeric: 'tabular-nums' }} // Fallback inline
    />
  );
}
