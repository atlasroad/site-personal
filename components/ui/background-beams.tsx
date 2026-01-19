'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function BackgroundBeams() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [beams, setBeams] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Criar 5-8 feixes de luz
    const newBeams = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setBeams(newBeams);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {beams.map((beam) => (
        <motion.div
          key={beam.id}
          className="absolute w-px h-64 bg-gradient-to-b from-gray-800/50 via-gray-700/30 to-transparent"
          initial={{
            x: `${beam.x}%`,
            y: `${beam.y}%`,
            opacity: 0,
          }}
          animate={{
            y: [
              `${beam.y}%`,
              `${beam.y + 20}%`,
              `${beam.y - 10}%`,
              `${beam.y}%`,
            ],
            opacity: [0, 0.6, 0.4, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: beam.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transform: `rotate(${Math.random() * 360}deg)`,
            filter: 'blur(1px)',
          }}
        />
      ))}
      
      {/* Feixes horizontais suaves */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`horizontal-${i}`}
          className="absolute w-64 h-px bg-gradient-to-r from-transparent via-gray-800/40 to-transparent"
          initial={{
            x: '-100%',
            y: `${30 + i * 30}%`,
            opacity: 0,
          }}
          animate={{
            x: ['-100%', '200%'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 12 + i * 2,
            delay: i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
