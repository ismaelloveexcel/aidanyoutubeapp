import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VIDEO_TEMPLATES = [
    {
      id: "capcut-trend",
      name: "CapCut Trend Edit",
      category: "Trending",
      emoji: "🎬",
      description: "Fast cuts, text overlays, and viral effects like CapCut",
      intro: "Start with a bold animated title and trending sound",
      mainContent: "Use quick transitions, zooms, and on-screen text for each scene",
      outro: "End with a call to action and a catchy effect",
      transitions: "Flash cuts, zooms, swipe transitions",
      proTips: ["Use trending music", "Add animated text", "Sync cuts to the beat", "Try split-screen or overlays"],
    },
    {
      id: "day-in-life",
      name: "Day in My Life",
      category: "Vlog",
      emoji: "📅",
      description: "Vlog your day with timestamps and music",
      intro: "Show a morning routine with time overlay",
      mainContent: "Highlight key moments, add captions and music",
      outro: "Recap the day and ask viewers to comment",
      transitions: "Time-lapse, crossfades",
      proTips: ["Use time overlays", "Keep clips short", "Add background music", "Show real moments"],
    },
    {
      id: "unboxing",
      name: "Unboxing & Review",
      category: "Review",
      emoji: "📦",
      description: "Unbox and review a product with close-ups and reactions",
      intro: "Show the box and tease what's inside",
      mainContent: "Unbox step by step, react to each part, give close-ups",
      outro: "Give your honest review and rating",
      transitions: "Zooms, pop-up text",
      proTips: ["Show genuine reactions", "Use close-up shots", "Add pop-up facts", "Give a final verdict"],
    },
    {
      id: "shorts-meme",
      name: "YouTube Shorts Meme",
      category: "Shorts",
      emoji: "😂",
      description: "Quick meme or joke in under 60 seconds",
      intro: "Start with a hook or punchline",
      mainContent: "Deliver the joke or meme with sound effects",
      outro: "Add a funny reaction or twist",
      transitions: "Jump cuts, sound effects",
      proTips: ["Keep it under 60s", "Use big text", "Add sound effects", "End with a twist"],
    },
  {
    id: "stranger-things",
    name: "Stranger Things Style",
    category: "Trending",
    emoji: "👾",
    description: "80s retro vibes with mysterious music",
    intro: "Start with flickering lights and retro title cards",
    mainContent: "Use VHS effects and dark, moody shots",
    outro: "End with suspenseful music and 'To Be Continued...'",
    transitions: "Static glitches, light flickers",
    proTips: ["Use retro fonts", "Add VHS scan lines", "Dark color grading", "Synth music"],
  },
  {
    id: "minecraft",
    name: "Minecraft Let's Play",
    category: "Gaming",
    emoji: "⛏️",
    description: "Classic gaming commentary format",
    intro: "Spawn in and explain your goal for the episode",
    mainContent: "Build, explore, and narrate your gameplay",
    outro: "Show progress and tease next episode",
    transitions: "Quick cuts, time lapses for building",
    proTips: ["Use shaders for better visuals", "Plan your builds", "Keep commentary energetic", "Show off creations"],
  },
  {
    id: "challenge",
    name: "Challenge Video",
    category: "Trending",
    emoji: "🏆",
    description: "Fun challenge with rules and stakes",
    intro: "Explain the challenge and rules (30 seconds)",
    mainContent: "Show attempts, fails, and progress",
    outro: "Did you succeed? Call viewers to try it",
    transitions: "Jump cuts, speed ramps",
    proTips: ["Set clear rules", "Show fails and wins", "React genuinely", "Make it repeatable"],
  },
  {
    id: "tutorial",
    name: "How-To Tutorial",
    category: "Educational",
    emoji: "🎓",
    description: "Step-by-step teaching format",
    intro: "Show final result, explain what you'll teach",
    mainContent: "Break into clear steps, demonstrate each",
    outro: "Recap key points, encourage practice",
    transitions: "Chapter markers, step numbers",
    proTips: ["Show final result first", "Go slow and clear", "Use text overlays", "Encourage questions"],
  },
  {
    id: "reaction",
    name: "Reaction Video",
    category: "React",
    emoji: "😮",
    description: "React to trending content",
    intro: "Say what you're reacting to and why",
    mainContent: "Watch and give genuine reactions",
    outro: "Share final thoughts and rating",
    transitions: "Picture-in-picture, pause moments",
    proTips: ["Genuine reactions only", "Pause to comment", "Good camera quality", "Link original content"],
  },
  {
    id: "montage",
    name: "Epic Montage",
    category: "Gaming",
    emoji: "⚡",
    description: "High-energy highlight reel",
    intro: "Quick title card with hype music",
    mainContent: "Best clips synced to music beats",
    outro: "Fade to black with stats/score",
    transitions: "Beat-synced cuts, zoom effects",
    proTips: ["Sync to music beats", "Use speed ramps", "Color grade consistently", "Best clips only"],
  },
];

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof VIDEO_TEMPLATES[0] | null>(null);
  const categories = Array.from(new Set(VIDEO_TEMPLATES.map(t => t.category)));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">📋 Video Templates</h1>
        <p className="text-gray-400">Professional templates for popular video styles</p>
      </div>

      {!selectedTemplate ? (
        <>
          {categories.map((category) => (
            <div key={category}>
              <h2 className="font-display text-2xl mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {VIDEO_TEMPLATES.filter(t => t.category === category).map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-6">
                      <div className="text-4xl mb-3">{template.emoji}</div>
                      <h3 className="font-display text-xl mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-400">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
            ← Back to Templates
          </Button>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{selectedTemplate.emoji}</div>
            <h2 className="font-display text-3xl mb-2">{selectedTemplate.name}</h2>
            <p className="text-gray-400">{selectedTemplate.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🎬 Intro</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{selectedTemplate.intro}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📹 Main Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{selectedTemplate.mainContent}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>👋 Outro</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{selectedTemplate.outro}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>✨ Transitions</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{selectedTemplate.transitions}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedTemplate.proTips.map((tip, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-[hsl(320,100%,50%)]">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
