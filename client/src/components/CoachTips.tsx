import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface CoachTip {
  title: string;
  message: string;
  icon?: string;
}

interface CoachTipsProps {
  tips: CoachTip[];
  pageName: string;
}

export function CoachTips({ tips, pageName }: CoachTipsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [hasSeenTips, setHasSeenTips] = useState(false);

  useEffect(() => {
    // Check if user has seen tips for this page
    const seenKey = `tubestar-tips-seen-${pageName}`;
    const seen = localStorage.getItem(seenKey);
    if (seen) {
      setHasSeenTips(true);
      setIsVisible(false);
    }
  }, [pageName]);

  const handleClose = () => {
    setIsVisible(false);
    const seenKey = `tubestar-tips-seen-${pageName}`;
    localStorage.setItem(seenKey, 'true');
  };

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  if (tips.length === 0 || !isVisible) {
    return null;
  }

  const currentTip = tips[currentTipIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 z-40 w-full max-w-sm"
        >
          <div className="bg-gradient-to-br from-[#122046] to-[#0a1628] border-2 border-[#F3C94C] rounded-2xl p-4 shadow-[0_0_30px_rgba(243,201,76,0.3)]">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-[#F3C94C]/20 flex items-center justify-center">
                  {currentTip.icon ? (
                    <span className="text-2xl">{currentTip.icon}</span>
                  ) : (
                    <Lightbulb className="h-5 w-5 text-[#F3C94C]" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-lg font-bold text-[#F3C94C]">
                    Coach Tip {currentTipIndex + 1}/{tips.length}
                  </h3>
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Close tips"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="font-semibold text-white mb-2">{currentTip.title}</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{currentTip.message}</p>
                
                {tips.length > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevTip}
                      className="text-zinc-400 hover:text-white h-8"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="flex gap-1.5">
                      {tips.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTipIndex(index)}
                          className={`h-1.5 rounded-full transition-all ${
                            index === currentTipIndex
                              ? 'w-6 bg-[#F3C94C]'
                              : 'w-1.5 bg-zinc-600 hover:bg-zinc-500'
                          }`}
                          aria-label={`Go to tip ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextTip}
                      className="text-zinc-400 hover:text-white h-8"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Pre-defined tips for each page
export const IDEA_TIPS: CoachTip[] = [
  {
    title: "Mix it up!",
    message: "Try different categories! Gaming + Tech combos are super popular right now.",
    icon: "🎮"
  },
  {
    title: "Trending Topics",
    message: "Check what's trending and add your unique twist to popular topics!",
    icon: "🔥"
  },
  {
    title: "Save Your Favorites",
    message: "Found a great idea? Save it for later so you never forget!",
    icon: "⭐"
  }
];

export const SCRIPT_TIPS: CoachTip[] = [
  {
    title: "Hook 'Em Fast!",
    message: "Start with a loud 'HEY!' or exciting question in the first 3 seconds to grab attention!",
    icon: "🎣"
  },
  {
    title: "Keep it Short",
    message: "Shorter sentences are easier to say on camera. Aim for 10-15 seconds per step!",
    icon: "⚡"
  },
  {
    title: "Add Energy!",
    message: "Use words like EPIC, AWESOME, CRAZY to make your script more exciting!",
    icon: "🔥"
  },
  {
    title: "Call to Action",
    message: "Always end with 'Like and Subscribe!' - it really works!",
    icon: "👍"
  }
];

export const THUMBNAIL_TIPS: CoachTip[] = [
  {
    title: "Use Bright Colors",
    message: "Hot pink, cyan, and yellow catch the eye! Try contrasting colors for maximum pop.",
    icon: "🎨"
  },
  {
    title: "Big Text = More Clicks",
    message: "Keep text short (3-5 words max) and HUGE! People watch on phones!",
    icon: "📱"
  },
  {
    title: "Faces Work Better",
    message: "Thumbnails with expressive faces get 30% more clicks. Show emotion!",
    icon: "😮"
  },
  {
    title: "Test on Mobile",
    message: "Your thumbnail should be easy to read even on a tiny phone screen!",
    icon: "📲"
  }
];

export const DASHBOARD_TIPS: CoachTip[] = [
  {
    title: "Create Every Day",
    message: "Keep your streak going! Even 10 minutes of work counts towards becoming a better creator.",
    icon: "🔥"
  },
  {
    title: "Watch & Learn",
    message: "Study your favorite YouTubers. What makes their videos stand out?",
    icon: "👀"
  },
  {
    title: "Track Your Progress",
    message: "Check your stats regularly to see what's working and what to improve!",
    icon: "📈"
  }
];
