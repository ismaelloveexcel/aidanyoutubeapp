/**
 * GlowCard - Premium card with animated glow effect
 * Responds to hover with beautiful gradient glow
 */
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: ReactNode;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
  animated?: boolean;
}

export function GlowCard({
  children,
  glowColor = '#2BD4FF',
  className = '',
  onClick,
  animated = true,
}: GlowCardProps) {
  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    whileHover: { scale: 1.02, y: -4 },
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  } : {};
  
  return (
    <Component
      className={cn(
        'relative rounded-2xl overflow-hidden group',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...animationProps}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}40, transparent 70%)`,
        }}
      />
      
      {/* Card border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 20px ${glowColor}30, inset 0 0 20px ${glowColor}10`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
}
