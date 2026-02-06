/**
 * FloatingParticles - CSS-only ambient particles
 * Lightweight, performant, magical
 */
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

interface FloatingParticlesProps {
  density?: 'sparse' | 'normal' | 'dense';
  colors?: string[];
}

const DEFAULT_COLORS = [
  'rgba(43, 212, 255, 0.3)',
  'rgba(109, 255, 156, 0.25)',
  'rgba(243, 201, 76, 0.2)',
  'rgba(162, 89, 255, 0.25)',
  'rgba(255, 255, 255, 0.15)',
];

export function FloatingParticles({ 
  density = 'normal',
  colors = DEFAULT_COLORS 
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    const count = density === 'sparse' ? 12 : density === 'dense' ? 30 : 20;
    
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    
    setParticles(newParticles);
  }, [density, colors.length]);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.left,
            bottom: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.5;
            }
          }
        }
      `}</style>
    </div>
  );
}
