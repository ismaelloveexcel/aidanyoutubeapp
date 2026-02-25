/**
 * LoadingState - Premium loading indicator
 * Multiple variants for different contexts
 */
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Rocket, Star } from 'lucide-react';

interface LoadingStateProps {
  variant?: 'spinner' | 'pulse' | 'dots' | 'rocket' | 'stars';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  variant = 'spinner',
  size = 'md',
  message,
  fullScreen = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className={`${sizeClasses[size]} text-[#2BD4FF]`} />
          </motion.div>
        );
        
      case 'pulse':
        return (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className={`${sizeClasses[size]} text-[#F3C94C]`} />
          </motion.div>
        );
        
      case 'dots':
        return (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-[#6DFF9C]"
                animate={{
                  y: [-8, 0, -8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );
        
      case 'rocket':
        return (
          <motion.div
            animate={{
              y: [-10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Rocket className={`${sizeClasses[size]} text-[#A259FF]`} />
          </motion.div>
        );
        
      case 'stars':
        return (
          <div className="relative">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: i === 0 ? -16 : i === 1 ? 0 : 16,
                  top: i === 1 ? -16 : 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <Star className="w-4 h-4 text-[#F3C94C]" fill="#F3C94C" />
              </motion.div>
            ))}
          </div>
        );
    }
  };
  
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {renderLoader()}
      {message && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-zinc-400 font-medium"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1628]/95 backdrop-blur-sm">
        {content}
      </div>
    );
  }
  
  return content;
}
