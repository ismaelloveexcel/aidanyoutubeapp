/**
 * MagneticButton - Button that attracts cursor on hover
 * Premium micro-interaction
 */
import { ReactNode, useRef, useState, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  
  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    x.set(deltaX);
    y.set(deltaY);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative transition-all duration-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
      
      {/* Ripple effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: [0.3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{
            background: 'radial-gradient(circle, rgba(43, 212, 255, 0.3), transparent 70%)',
          }}
        />
      )}
    </motion.button>
  );
}
