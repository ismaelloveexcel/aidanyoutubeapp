/**
 * PremiumToast - Enhanced toast notifications
 * With icons, colors, and animations
 */
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, Sparkles } from 'lucide-react';

interface PremiumToastProps {
  type?: 'success' | 'error' | 'info' | 'achievement';
  title: string;
  description?: string;
  icon?: React.ReactNode;
  duration?: number;
}

const TOAST_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  achievement: Sparkles,
};

const TOAST_COLORS = {
  success: '#6DFF9C',
  error: '#FF6B6B',
  info: '#2BD4FF',
  achievement: '#F3C94C',
};

export function PremiumToast({
  type = 'info',
  title,
  description,
  icon,
  duration = 3000,
}: PremiumToastProps) {
  const Icon = icon || TOAST_ICONS[type];
  const color = TOAST_COLORS[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative overflow-hidden rounded-2xl shadow-2xl max-w-md"
      style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #122046 100%)',
        border: `2px solid ${color}40`,
        boxShadow: `0 0 30px ${color}30`,
      }}
    >
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}20, transparent 70%)`,
        }}
      />
      
      <div className="relative p-4 flex items-start gap-4">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          {typeof Icon === 'function' ? (
            <Icon className="h-5 w-5" style={{ color }} />
          ) : (
            Icon
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-white text-lg mb-1">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-zinc-400">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <motion.div
        className="h-1"
        style={{ backgroundColor: color }}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  );
}
