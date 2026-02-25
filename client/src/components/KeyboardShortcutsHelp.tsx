/**
 * Keyboard Shortcuts Help Panel
 * Shows available keyboard shortcuts
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { Button } from './ui/button';
import { GLOBAL_SHORTCUTS } from '@/hooks/use-keyboard-shortcuts';

export function KeyboardShortcutsHelp() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts panel with Ctrl+/
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
      // Hide with Escape
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);
  
  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-24 md:bottom-8 right-4 z-40 p-3 rounded-full bg-[#122046] border-2 border-[#2BD4FF]/30 hover:border-[#2BD4FF]/50 hover:scale-110 transition-all shadow-lg group"
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (Ctrl+/)"
      >
        <Keyboard className="h-5 w-5 text-[#2BD4FF] group-hover:text-white transition-colors" />
      </button>
      
      {/* Shortcuts panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-44 md:bottom-24 right-4 z-50 w-full max-w-md"
          >
            <div className="bg-gradient-to-br from-[#0f1f3f] via-[#0c172c] to-[#0b1322] border-2 border-[#2BD4FF]/30 rounded-2xl shadow-[0_0_40px_rgba(43,212,255,0.3)] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Keyboard className="h-6 w-6 text-[#2BD4FF]" />
                    <h3 className="font-display text-xl font-bold text-white">Keyboard Shortcuts</h3>
                  </div>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {GLOBAL_SHORTCUTS.map((shortcut, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0a1628]/50 border border-white/5 hover:border-[#2BD4FF]/20 transition-colors"
                    >
                      <span className="text-sm text-zinc-300">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.ctrl && (
                          <kbd className="px-2 py-1 text-xs font-semibold text-white bg-[#2BD4FF]/20 rounded border border-[#2BD4FF]/30">
                            Ctrl
                          </kbd>
                        )}
                        {shortcut.shift && (
                          <kbd className="px-2 py-1 text-xs font-semibold text-white bg-[#F3C94C]/20 rounded border border-[#F3C94C]/30">
                            Shift
                          </kbd>
                        )}
                        {shortcut.alt && (
                          <kbd className="px-2 py-1 text-xs font-semibold text-white bg-[#A259FF]/20 rounded border border-[#A259FF]/30">
                            Alt
                          </kbd>
                        )}
                        <kbd className="px-2 py-1 text-xs font-semibold text-white bg-[#6DFF9C]/20 rounded border border-[#6DFF9C]/30 uppercase">
                          {shortcut.key}
                        </kbd>
                      </div>
                    </div>
                  ))}
                  
                  {/* Special shortcuts */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a1628]/50 border border-white/5">
                    <span className="text-sm text-zinc-300">Toggle this panel</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 text-xs font-semibold text-white bg-[#2BD4FF]/20 rounded border border-[#2BD4FF]/30">
                        Ctrl
                      </kbd>
                      <kbd className="px-2 py-1 text-xs font-semibold text-white bg-[#6DFF9C]/20 rounded border border-[#6DFF9C]/30">
                        /
                      </kbd>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-zinc-500 text-center mt-4">
                  Pro tip: Use shortcuts to navigate faster!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
