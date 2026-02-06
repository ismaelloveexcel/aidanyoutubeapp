/**
 * TactileButton - Premium button with squish animation
 * Inspired by gameforge's tactile feedback system
 */
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TactileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'card';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variants = {
  primary: 'bg-gradient-to-r from-[#6DFF9C] to-[#4BCC7A] text-[#0a1628] font-bold shadow-[0_0_20px_rgba(109,255,156,0.3)]',
  secondary: 'bg-gradient-to-r from-[#122046] to-[#0a1628] text-white border-2 border-[#2BD4FF]/30 hover:border-[#2BD4FF]/50',
  ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
  card: 'bg-gradient-to-br from-[#122046] to-[#0a1628] border border-zinc-700 hover:border-[#2BD4FF]/30',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function TactileButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props 
}: TactileButtonProps) {
  const squishScale = variant === 'card' ? 0.98 : variant === 'ghost' ? 0.96 : 0.94;
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : squishScale }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 15,
      }}
      className={cn(
        'rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
