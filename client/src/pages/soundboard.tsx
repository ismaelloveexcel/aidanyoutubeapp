import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    setTimeout(() => setPlaying(null), 500);

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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">🔊 Soundboard</h1>
        <p className="text-gray-400">Add fun sound effects to your videos!</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>💡 How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Click any button to hear the sound effect. In your video editor, you can add these sounds at the perfect moment
            for comedic timing, transitions, or emphasis!
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SOUNDS.map((sound) => (
          <motion.div
            key={sound.id}
            animate={playing === sound.id ? { scale: 0.95 } : { scale: 1 }}
            transition={{ duration: 0.1 }}
          >
            <Card
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => playSound(sound.id)}
              style={{ backgroundColor: sound.color }}
            >
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-3">{sound.emoji}</div>
                <h3 className="font-display text-lg text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                  {sound.name}
                </h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🎵 Pro Sound Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Timing is Everything</h4>
              <p className="text-sm text-gray-400">
                Place sound effects right at the moment of action for maximum impact
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Don't Overdo It</h4>
              <p className="text-sm text-gray-400">
                Use 2-3 sound effects per video max - too many gets annoying
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Match the Mood</h4>
              <p className="text-sm text-gray-400">
                Pick sounds that fit your video's tone (funny, dramatic, etc.)
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Volume Control</h4>
              <p className="text-sm text-gray-400">
                Keep sound effects quieter than your voice - they should enhance, not overpower
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📝 Using These Sounds</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            These are synthesized sound effects you can use freely! Click any button to preview the sound.
            For even more sound effects, check out royalty-free libraries like Freesound.org or YouTube Audio Library.
            Always verify the license before using external sounds in your videos!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
