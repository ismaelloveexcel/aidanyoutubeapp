/**
 * BreathingBackground - Animated gradient that shifts with time
 * Web-optimized, inspired by gameforge's LivingGradient
 */
import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BreathingBackgroundProps {
  children: ReactNode;
  intensity?: 'subtle' | 'normal' | 'vibrant';
  className?: string;
}

const getTimeGradients = () => {
  const hour = new Date().getHours();
  
  // Dawn (5-8am)
  if (hour >= 5 && hour < 8) {
    return {
      from: '#1a1a2e',
      via: '#16213e',
      to: '#0f3460',
      accent: 'rgba(255, 107, 129, 0.15)',
    };
  }
  
  // Morning (8am-12pm)
  if (hour >= 8 && hour < 12) {
    return {
      from: '#0a1628',
      via: '#122046',
      to: '#1a2a4a',
      accent: 'rgba(109, 255, 156, 0.12)',
    };
  }
  
  // Afternoon (12-5pm)
  if (hour >= 12 && hour < 17) {
    return {
      from: '#0f1f3f',
      via: '#1a2a4a',
      to: '#0a1628',
      accent: 'rgba(243, 201, 76, 0.12)',
    };
  }
  
  // Evening (5-8pm)
  if (hour >= 17 && hour < 20) {
    return {
      from: '#16213e',
      via: '#0f3460',
      to: '#1a1a2e',
      accent: 'rgba(162, 89, 255, 0.15)',
    };
  }
  
  // Night (8pm-12am)
  if (hour >= 20 && hour < 24) {
    return {
      from: '#0a0e27',
      via: '#16213e',
      to: '#0a1628',
      accent: 'rgba(43, 212, 255, 0.1)',
    };
  }
  
  // Midnight (12am-5am)
  return {
    from: '#050B1F',
    via: '#0a1628',
    to: '#0f1f3f',
    accent: 'rgba(78, 77, 255, 0.08)',
  };
};

export function BreathingBackground({ 
  children, 
  intensity = 'normal',
  className = ''
}: BreathingBackgroundProps) {
  const [gradients, setGradients] = useState(getTimeGradients());
  
  useEffect(() => {
    // Update gradients every minute to track time of day
    const interval = setInterval(() => {
      setGradients(getTimeGradients());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const opacityMultiplier = intensity === 'subtle' ? 0.3 : intensity === 'vibrant' ? 1 : 0.6;
  
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base gradient layer */}
      <div 
        className="fixed inset-0 transition-colors duration-[20000ms] ease-in-out"
        style={{
          background: `linear-gradient(135deg, ${gradients.from} 0%, ${gradients.via} 50%, ${gradients.to} 100%)`,
        }}
      />
      
      {/* Breathing overlay with radial gradients */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: [opacityMultiplier * 0.4, opacityMultiplier * 0.8, opacityMultiplier * 0.4],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${gradients.accent}, transparent 60%)`,
        }}
      />
      
      {/* Second breathing layer for depth */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: [opacityMultiplier * 0.3, opacityMultiplier * 0.6, opacityMultiplier * 0.3],
          scale: [1.02, 1, 1.02],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        style={{
          background: `radial-gradient(ellipse at 70% 70%, ${gradients.accent}, transparent 60%)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
