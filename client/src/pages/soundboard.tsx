import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard, TactileButton } from "@/components/premium";
import { Volume2, Info, Sparkles } from "lucide-react";

const SOUNDS = [
  { id: "airhorn", name: "Air Horn", emoji: "📢", color: "hsl(0, 100%, 50%)" },
  { id: "badum", name: "Badum Tss", emoji: "🥁", color: "hsl(30, 100%, 50%)" },
  { id: "applause", name: "Applause", emoji: "👏", color: "hsl(140, 100%, 50%)" },
  { id: "crickets", name: "Crickets", emoji: "🦗", color: "hsl(100, 100%, 40%)" },
  { id: "wow", name: "Wow!", emoji: "😮", color: "hsl(50, 100%, 50%)" },
  { id: "fail", name: "Fail Sound", emoji: "💔", color: "hsl(0, 100%, 40%)" },
  { id: "success", name: "Success!", emoji: "🎉", color: "hsl(280, 100%, 50%)" },
  { id: "suspense", name: "Suspense", emoji: "😱", color: "hsl(280, 100%, 30%)" },
  { id: "laugh", name: "Laugh Track", emoji: "😂", color: "hsl(60, 100%, 50%)" },
  { id: "ding", name: "Ding!", emoji: "🔔", color: "hsl(180, 100%, 50%)" },
  { id: "record", name: "Record Scratch", emoji: "💿", color: "hsl(320, 100%, 50%)" },
  { id: "dramatic", name: "Dramatic", emoji: "🎭", color: "hsl(340, 100%, 50%)" },
];

export default function Soundboard() {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playSound = (soundId: string) => {
    setPlaying(soundId);
    setTimeout(() => setPlaying(null), 800);

    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (soundId) {
      case "airhorn": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
      case "ding": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case "success": {
        [0, 0.15, 0.3].forEach((time, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(400 + (i * 200), now + time);
          gain.gain.setValueAtTime(0.2, now + time);
          gain.gain.exponentialRampToValueAtTime(0.01, now + time + 0.2);
          osc.start(now + time);
          osc.stop(now + time + 0.2);
        });
        break;
      }
      case "fail": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
      case "dramatic": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 1);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
        osc.start(now);
        osc.stop(now + 1);
        break;
      }
      default: {
        // Generic beep for other sounds
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#A259FF]/20">
            <Volume2 className="h-7 w-7 text-[#A259FF]" />
          </div>
        </div>
        <h1 className="heading-display text-3xl sm:text-4xl text-white">🔊 Soundboard</h1>
        <p className="text-zinc-400 text-sm sm:text-base">Add epic sound effects to your videos!</p>
      </div>

      <Card className="bg-gradient-to-r from-[#122046] to-[#0a1628] border-[#A259FF]/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#A259FF]/20">
              <Info className="h-5 w-5 text-[#A259FF]" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">How to Use</h3>
              <p className="text-zinc-400 text-sm">
                Click any button to hear the sound effect. Perfect for adding comedy, drama, or excitement to your videos!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {SOUNDS.map((sound) => (
          <GlowCard key={sound.id} glowColor={sound.color}>
            <motion.div
              animate={playing === sound.id ? { 
                scale: 0.92,
                rotate: [0, -2, 2, 0],
              } : { 
                scale: 1,
                rotate: 0,
              }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
            >
              <div
                className="relative cursor-pointer p-6 rounded-2xl overflow-hidden group"
                onClick={() => playSound(sound.id)}
                style={{ 
                  background: `linear-gradient(135deg, ${sound.color}20, ${sound.color}10)`,
                  border: `2px solid ${sound.color}40`,
                }}
              >
                {/* Ripple effect when playing */}
                <AnimatePresence>
                  {playing === sound.id && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      style={{
                        background: `radial-gradient(circle, ${sound.color}60, transparent 70%)`,
                      }}
                    />
                  )}
                </AnimatePresence>
                
                <div className="relative text-center">
                  <motion.div 
                    className="text-5xl sm:text-6xl mb-3"
                    animate={playing === sound.id ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {sound.emoji}
                  </motion.div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                    {sound.name}
                  </h3>
                  
                  {playing === sound.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-2 -right-2"
                    >
                      <Volume2 className="h-5 w-5 text-white animate-pulse" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </GlowCard>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-[#122046] to-[#0a1628] border-[#F3C94C]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Sparkles className="h-6 w-6 text-[#F3C94C]" />
            Pro Sound Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0a1628]/50 rounded-xl border border-[#6DFF9C]/20">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-[#6DFF9C]">✓</span> Timing is Everything
              </h4>
              <p className="text-sm text-zinc-400">
                Place sound effects right at the moment of action for maximum impact
              </p>
            </div>
            <div className="p-4 bg-[#0a1628]/50 rounded-xl border border-[#F3C94C]/20">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-[#F3C94C]">✓</span> Don't Overdo It
              </h4>
              <p className="text-sm text-zinc-400">
                Use 2-3 sound effects per video max - too many gets annoying
              </p>
            </div>
            <div className="p-4 bg-[#0a1628]/50 rounded-xl border border-[#2BD4FF]/20">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-[#2BD4FF]">✓</span> Match the Mood
              </h4>
              <p className="text-sm text-zinc-400">
                Pick sounds that fit your video's tone (funny, dramatic, etc.)
              </p>
            </div>
            <div className="p-4 bg-[#0a1628]/50 rounded-xl border border-[#A259FF]/20">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-[#A259FF]">✓</span> Volume Control
              </h4>
              <p className="text-sm text-zinc-400">
                Keep sound effects quieter than your voice - they enhance, not overpower
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-[#122046] to-[#0a1628] border-[#2BD4FF]/30">
        <CardHeader>
          <CardTitle className="text-white">📝 Using These Sounds</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400 leading-relaxed">
            These are synthesized sound effects you can use freely! Click any button to preview the sound.
            For even more sound effects, check out royalty-free libraries like <span className="text-[#2BD4FF] font-semibold">Freesound.org</span> or <span className="text-[#6DFF9C] font-semibold">YouTube Audio Library</span>.
            Always verify the license before using external sounds in your videos!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
