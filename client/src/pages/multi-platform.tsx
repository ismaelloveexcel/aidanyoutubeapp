import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function MultiPlatform() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const { toast } = useToast();

  const platforms = [
    { id: "youtube", name: "YouTube", emoji: "📺", aspect: "16:9", maxLength: "No limit", color: "hsl(0, 100%, 50%)" },
    { id: "tiktok", name: "TikTok", emoji: "🎵", aspect: "9:16", maxLength: "10 min", color: "hsl(180, 100%, 50%)" },
    { id: "instagram", name: "Instagram Reels", emoji: "📸", aspect: "9:16", maxLength: "90 sec", color: "hsl(320, 100%, 50%)" },
    { id: "shorts", name: "YouTube Shorts", emoji: "⚡", aspect: "9:16", maxLength: "60 sec", color: "hsl(0, 100%, 50%)" },
  ];

  const togglePlatform = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const exportVideo = () => {
    if (selectedPlatforms.length === 0) {
      toast({ title: "No Platforms Selected", description: "Select at least one platform" });
      return;
    }

    toast({
      title: "Export Started",
      description: `Preparing video for ${selectedPlatforms.length} platform(s). This feature requires backend video processing.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">📱 Multi-Platform Export</h1>
        <p className="text-gray-400">Optimize your videos for every platform</p>
      </div>

      {/* Platform Selection */}
      <div>
        <h2 className="font-display text-2xl mb-4">Select Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map(platform => (
            <Card
              key={platform.id}
              className={`cursor-pointer transition-all ${
                selectedPlatforms.includes(platform.id)
                  ? "ring-4 scale-105"
                  : "hover:scale-102"
              }`}
              style={{
                boxShadow: selectedPlatforms.includes(platform.id) 
                  ? `0 0 0 4px ${platform.color}` 
                  : 'none',
              }}
              onClick={() => togglePlatform(platform.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-3">{platform.emoji}</div>
                <h3 className="font-display text-lg mb-2">{platform.name}</h3>
                <div className="text-sm text-gray-400">
                  <div>{platform.aspect} ratio</div>
                  <div>Max: {platform.maxLength}</div>
                </div>
                {selectedPlatforms.includes(platform.id) && (
                  <div className="mt-3 text-green-400 font-semibold">✓ Selected</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Export Options */}
      {selectedPlatforms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export Settings</CardTitle>
            <CardDescription>Your video will be optimized for {selectedPlatforms.length} platform(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedPlatforms.map(platformId => {
                const platform = platforms.find(p => p.id === platformId);
                if (!platform) return null;

                return (
                  <div key={platformId} className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{platform.emoji}</span>
                        <span className="font-semibold">{platform.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">{platform.aspect}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {platform.aspect === "9:16" && "Will crop to vertical format"}
                      {platform.aspect === "16:9" && "Standard horizontal format"}
                    </div>
                  </div>
                );
              })}

              <Button onClick={exportVideo} className="w-full" size="lg">
                Export to {selectedPlatforms.length} Platform(s)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Tips */}
      <Card>
        <CardHeader>
          <CardTitle>📱 Platform Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">📺 YouTube</h4>
              <p className="text-sm text-gray-400">Long-form content, detailed descriptions, timestamps</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">🎵 TikTok</h4>
              <p className="text-sm text-gray-400">Hook in first 3 seconds, trending sounds, hashtags</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">📸 Instagram Reels</h4>
              <p className="text-sm text-gray-400">Visual aesthetics, on-screen text, music</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">⚡ YouTube Shorts</h4>
              <p className="text-sm text-gray-400">Vertical, under 60s, trending topics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cross-Posting Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Cross-Posting Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">1. Create Main Video for YouTube</h4>
              <p className="text-sm text-gray-400">Your full-length content (5-15 minutes)</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">2. Extract Best 60 Seconds</h4>
              <p className="text-sm text-gray-400">Clip the most exciting moment for Shorts/TikTok/Reels</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">3. Crop to 9:16 for Vertical</h4>
              <p className="text-sm text-gray-400">Use our multi-platform export to auto-crop</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">4. Post Everywhere at Once</h4>
              <p className="text-sm text-gray-400">Maximum reach with minimum extra work!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
