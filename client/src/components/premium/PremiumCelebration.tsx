/**
 * PremiumCelebration - Enhanced celebration with emojis and messages
 * Combines canvas-confetti with emoji particles
 */
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface PremiumCelebrationProps {
  visible: boolean;
  type?: 'confetti' | 'fireworks' | 'sparkles' | 'hearts' | 'stars';
  message?: string;
  subMessage?: string;
  duration?: number;
  onComplete?: () => void;
}

const EMOJIS = {
  confetti: ['🎉', '🎊', '✨', '🌟', '⭐'],
  fireworks: ['🎆', '🎇', '✨', '💫', '🌟'],
  sparkles: ['✨', '💫', '⭐', '🌟', '💎'],
  hearts: ['❤️', '💕', '💖', '💝', '💗'],
  stars: ['⭐', '🌟', '💫', '✨', '🌠'],
};

export function PremiumCelebration({
  visible,
  type = 'confetti',
  message,
  subMessage,
  duration = 3000,
  onComplete,
}: PremiumCelebrationProps) {
  useEffect(() => {
    if (!visible) return;
    
    // Canvas confetti burst
    const colors = ['#2BD4FF', '#F3C94C', '#6DFF9C', '#A259FF', '#FF6B6B'];
    
    // Center burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      ticks: 200,
      gravity: 1.2,
      scalar: 1.2,
    });
    
    // Side bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
    }, 150);
    
    // Continuous sparkles for fireworks/sparkles
    if (type === 'fireworks' || type === 'sparkles') {
      const interval = setInterval(() => {
        confetti({
          particleCount: 20,
          spread: 360,
          startVelocity: 30,
          origin: {
            x: Math.random(),
            y: Math.random() * 0.6,
          },
          colors: colors,
        });
      }, 300);
      
      setTimeout(() => clearInterval(interval), duration);
    }
    
    // Auto-hide
    const timeout = setTimeout(() => {
      onComplete?.();
    }, duration);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [visible, type, duration, onComplete]);
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          {/* Floating emojis */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => {
              const emoji = EMOJIS[type][Math.floor(Math.random() * EMOJIS[type].length)];
              const left = Math.random() * 100;
              const delay = Math.random() * 1000;
              
              return (
                <motion.div
                  key={i}
                  initial={{ y: '100vh', x: `${left}vw`, opacity: 0, rotate: 0 }}
                  animate={{
                    y: '-20vh',
                    x: `${left + (Math.random() - 0.5) * 20}vw`,
                    opacity: [0, 1, 1, 0],
                    rotate: 360 * 2,
                  }}
                  transition={{
                    duration: 3,
                    delay: delay / 1000,
                    ease: 'easeOut',
                  }}
                  className="absolute text-4xl"
                  style={{ left: 0, bottom: 0 }}
                >
                  {emoji}
                </motion.div>
              );
            })}
          </div>
          
          {/* Message bubble */}
          {message && (
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -20 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.3,
              }}
              className="relative z-10"
            >
              <div className="bg-gradient-to-r from-[#0a1628]/95 to-[#122046]/95 backdrop-blur-xl px-8 py-6 rounded-3xl border-2 border-[#6DFF9C]/50 shadow-[0_0_40px_rgba(109,255,156,0.3)]">
                <motion.h2
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="text-3xl font-display font-bold text-white text-center mb-2"
                >
                  {message}
                </motion.h2>
                {subMessage && (
                  <p className="text-zinc-300 text-center text-lg">
                    {subMessage}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
