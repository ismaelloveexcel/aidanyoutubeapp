import { useState } from "react";
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

  const playSound = (soundId: string) => {
    setPlaying(soundId);
    setTimeout(() => setPlaying(null), 500);
    // In a real app, this would play actual audio files
    console.log(`Playing sound: ${soundId}`);
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
          <CardTitle>📝 Note About Sounds</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            This is a demo soundboard showing the buttons. To use actual sounds in your videos, search for "royalty-free
            sound effects" on YouTube or use sites like Freesound.org. Always check the license before using sounds in
            your videos!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
