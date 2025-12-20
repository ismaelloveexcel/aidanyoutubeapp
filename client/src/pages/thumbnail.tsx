import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Thumbnail } from "@shared/schema";

const COLORS = [
  { name: "Hot Pink", value: "hsl(320, 100%, 50%)" },
  { name: "Cyan", value: "hsl(180, 100%, 50%)" },
  { name: "Yellow", value: "hsl(50, 100%, 50%)" },
  { name: "Purple", value: "hsl(280, 100%, 50%)" },
  { name: "Orange", value: "hsl(30, 100%, 50%)" },
  { name: "Green", value: "hsl(140, 100%, 50%)" },
  { name: "Red", value: "hsl(0, 100%, 50%)" },
  { name: "Blue", value: "hsl(220, 100%, 50%)" },
];

const EMOJIS = ["🎮", "⭐", "🔥", "💡", "🚀", "💜", "😮", "🏆", "⚡", "💯", "🎬", "🎨", "🎯", "💪", "🤯", "😱"];

const QUICK_TEMPLATES = [
  { name: "VS Battle", emoji: "⚔️", bgColor: "hsl(0, 100%, 50%)" },
  { name: "Top 10", emoji: "🔟", bgColor: "hsl(280, 100%, 50%)" },
  { name: "Reaction", emoji: "😮", bgColor: "hsl(30, 100%, 50%)" },
  { name: "LIVE", emoji: "🔴", bgColor: "hsl(0, 100%, 50%)" },
];

export default function Thumbnail() {
  const [title, setTitle] = useState("");
  const [bgColor, setBgColor] = useState(COLORS[0].value);
  const [selectedEmoji, setSelectedEmoji] = useState("🎮");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedThumbnails = [] } = useQuery<Thumbnail[]>({
    queryKey: ["/api/thumbnails"],
  });

  const saveThumbnailMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/thumbnails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, bgColor, emoji: selectedEmoji }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thumbnails"] });
      toast({
        title: "Thumbnail Saved!",
        description: "Your design has been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save thumbnail",
      });
    },
  });

  const deleteThumbnailMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/thumbnails/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thumbnails"] });
    },
  });

  const loadTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    setTitle(template.name);
    setBgColor(template.bgColor);
    setSelectedEmoji(template.emoji);
  };

  const downloadThumbnail = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Convert HSL to RGB for canvas
    const tempDiv = document.createElement('div');
    tempDiv.style.color = bgColor;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 1280, 720);

    // Add title text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px "Carter One", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    ctx.fillText(title || 'Your Title Here', 640, 360);

    // Add emoji (simplified - just text)
    ctx.shadowColor = 'transparent';
    ctx.font = '120px Arial';
    ctx.fillText(selectedEmoji, 1100, 150);

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tubestar-thumbnail-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Thumbnail Downloaded!",
          description: "Your thumbnail has been saved as a PNG image.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">🎨 Thumbnail Designer</h1>
        <p className="text-gray-400">Create eye-catching thumbnails for your videos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Designer */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Your Thumbnail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title Text</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title..."
                  maxLength={30}
                  className="mt-2"
                />
                <p className="text-xs text-gray-400 mt-1">{title.length}/30 characters</p>
              </div>

              <div>
                <Label>Background Color</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBgColor(color.value)}
                      className={`h-12 rounded-lg border-[3px] transition-all ${
                        bgColor === color.value ? "border-white scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Emoji Sticker</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-3xl p-2 rounded-lg transition-all ${
                        selectedEmoji === emoji
                          ? "bg-[hsl(320,100%,50%)] scale-110"
                          : "bg-[hsl(240,10%,15%)] hover:bg-[hsl(240,10%,20%)]"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => saveThumbnailMutation.mutate()}>
                  💾 Save
                </Button>
                <Button onClick={downloadThumbnail} variant="secondary">
                  📥 Download PNG
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_TEMPLATES.map((template) => (
                  <Button
                    key={template.name}
                    variant="secondary"
                    onClick={() => loadTemplate(template)}
                  >
                    {template.emoji} {template.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="aspect-video rounded-lg border-4 border-black flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: bgColor }}
              >
                <div className="absolute top-4 right-4 text-6xl transform rotate-12">
                  {selectedEmoji}
                </div>
                <h2 className="font-display text-4xl text-white text-center px-8 drop-shadow-[4px_4px_0_rgba(0,0,0,0.8)]">
                  {title || "Your Title Here"}
                </h2>
              </div>
            </CardContent>
          </Card>

          {/* Saved Thumbnails */}
          <div className="mt-8">
            <h2 className="font-display text-2xl mb-4">💾 Saved Designs</h2>
            {savedThumbnails.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-400">No saved thumbnails yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {savedThumbnails.map((thumbnail) => (
                  <div key={thumbnail.id} className="relative group">
                    <div
                      className="aspect-video rounded-lg border-4 border-black flex items-center justify-center overflow-hidden cursor-pointer"
                      style={{ backgroundColor: thumbnail.bgColor }}
                      onClick={() => {
                        setTitle(thumbnail.title);
                        setBgColor(thumbnail.bgColor);
                        setSelectedEmoji(thumbnail.emoji);
                      }}
                    >
                      <div className="absolute top-2 right-2 text-3xl transform rotate-12">
                        {thumbnail.emoji}
                      </div>
                      <p className="font-display text-lg text-white text-center px-4 drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                        {thumbnail.title}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
                      onClick={() => deleteThumbnailMutation.mutate(thumbnail.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
