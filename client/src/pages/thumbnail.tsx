import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { Download, Copy, Smartphone, Monitor, ImageIcon } from "lucide-react";
import { CoachTips, THUMBNAIL_TIPS } from "@/components/CoachTips";
import { celebrateSuccess } from "@/lib/confetti";
import { incrementStat } from "@/lib/progress-tracking";
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

const FACE_EMOJIS = ["😀", "😮", "😱", "🤯", "🥳", "😎", "🤔", "😍", "🤩", "😭", "😤", "🥺", "😈", "👀", "🤪", "🔥"];

const TEXT_PRESETS = [
  { name: "Bold Center", fontSize: 80, x: 640, y: 360, color: "#FFFFFF" },
  { name: "Top Banner", fontSize: 60, x: 640, y: 100, color: "#FFFFFF" },
  { name: "Bottom Banner", fontSize: 60, x: 640, y: 620, color: "#FFFFFF" },
];

const QUICK_TEMPLATES = [
  { name: "VS Battle", emoji: "⚔️", bgColor: "hsl(0, 100%, 50%)", title: "YOU VS ME" },
  { name: "Top 10", emoji: "🔟", bgColor: "hsl(280, 100%, 50%)", title: "TOP 10" },
  { name: "Reaction", emoji: "😮", bgColor: "hsl(30, 100%, 50%)", title: "REACTION" },
  { name: "LIVE", emoji: "🔴", bgColor: "hsl(0, 100%, 50%)", title: "LIVE NOW" },
  { name: "Challenge", emoji: "🏆", bgColor: "hsl(140, 100%, 40%)", title: "CHALLENGE" },
  { name: "Tutorial", emoji: "📚", bgColor: "hsl(220, 100%, 50%)", title: "HOW TO" },
];

export default function Thumbnail() {
  const [title, setTitle] = useState("");
  const [bgColor, setBgColor] = useState(COLORS[0].value);
  const [selectedEmoji, setSelectedEmoji] = useState("🎮");
  const [selectedFace, setSelectedFace] = useState("😮");
  const [showFaces, setShowFaces] = useState(false);
  const [previewSize, setPreviewSize] = useState<'desktop' | 'mobile'>('desktop');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedThumbnails = [], isLoading } = useQuery<Thumbnail[]>({
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
      celebrateSuccess();
      
      // Track progress
      const newBadge = incrementStat('thumbnailsDesigned');
      
      toast({
        title: "Thumbnail Saved! 🎨",
        description: newBadge ? `Achievement unlocked: ${newBadge.emoji} ${newBadge.name}!` : "Your design has been saved.",
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
    setTitle(template.title);
    setBgColor(template.bgColor);
    setSelectedEmoji(template.emoji);
  };

  const copyToClipboard = async () => {
    try {
      const canvas = document.getElementById('thumbnail-canvas') as HTMLCanvasElement;
      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            toast({ title: "Copied to clipboard! 📋" });
          }
        });
      }
    } catch (error) {
      toast({ title: "Copy failed", description: "Try downloading instead." });
    }
  };

  const downloadThumbnail = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 1280, 720);

    // Add title text with shadow
    ctx.fillStyle = 'white';
    ctx.font = 'bold 90px "Rajdhani", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;

    const text = title || 'Your Title Here';
    ctx.fillText(text.toUpperCase(), 640, 360);

    // Add emoji sticker
    ctx.shadowColor = 'transparent';
    ctx.font = '140px Arial';
    ctx.save();
    ctx.translate(1100, 150);
    ctx.rotate(0.2); // Slight tilt
    ctx.fillText(selectedEmoji, 0, 0);
    ctx.restore();

    // Add face emoji if showing faces
    if (showFaces) {
      ctx.font = '180px Arial';
      ctx.save();
      ctx.translate(180, 200);
      ctx.rotate(-0.15);
      ctx.fillText(selectedFace, 0, 0);
      ctx.restore();
    }

    // Store canvas reference for copying
    canvas.id = 'thumbnail-canvas';

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
          title: "Thumbnail Downloaded! 🎉",
          description: "Your 1280x720 YouTube thumbnail is ready!",
        });
      }
    });
  };

  if (isLoading) {
    return <Loader text="Loading your thumbnails..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Coach Tips */}
      <CoachTips tips={THUMBNAIL_TIPS} pageName="thumbnail" />
      
      <div className="text-center">
        <h1 className="heading-display text-3xl sm:text-4xl mb-2">🎨 Thumbnail Designer</h1>
        <p className="text-zinc-400 text-sm sm:text-base">Create eye-catching thumbnails optimized for YouTube (1280×720)</p>
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

              {/* Emoji/Face Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={!showFaces ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setShowFaces(false)}
                  className="flex-1"
                >
                  Emoji Stickers
                </Button>
                <Button
                  variant={showFaces ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setShowFaces(true)}
                  className="flex-1"
                >
                  Face Reactions
                </Button>
              </div>

              {!showFaces ? (
                <div>
                  <Label>Emoji Sticker</Label>
                  <div className="grid grid-cols-8 gap-2 mt-2">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-3xl p-2 rounded-lg transition-all ${
                          selectedEmoji === emoji
                            ? "bg-[#2BD4FF]/20 border-2 border-[#2BD4FF] scale-110"
                            : "bg-[#122046] hover:bg-[#122046]/80 border-2 border-transparent"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <Label>Face Reaction (Click-Magnets!)</Label>
                  <div className="grid grid-cols-8 gap-2 mt-2">
                    {FACE_EMOJIS.map((face) => (
                      <button
                        key={face}
                        onClick={() => setSelectedFace(face)}
                        className={`text-3xl p-2 rounded-lg transition-all ${
                          selectedFace === face
                            ? "bg-[#F3C94C]/20 border-2 border-[#F3C94C] scale-110"
                            : "bg-[#122046] hover:bg-[#122046]/80 border-2 border-transparent"
                        }`}
                      >
                        {face}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => saveThumbnailMutation.mutate()}
                  className="bg-gradient-to-r from-[#6DFF9C] to-[#4BCC7A] text-[#0a1628]"
                >
                  💾 Save
                </Button>
                <Button onClick={downloadThumbnail} variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <Button onClick={copyToClipboard} variant="ghost" className="w-full gap-2">
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {QUICK_TEMPLATES.map((template) => (
                  <Button
                    key={template.name}
                    variant="secondary"
                    onClick={() => loadTemplate(template)}
                    className="h-auto py-3 flex-col gap-2"
                  >
                    <span className="text-2xl">{template.emoji}</span>
                    <span className="text-xs">{template.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preview (1280×720)</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={previewSize === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewSize('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewSize === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewSize('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={previewSize === 'mobile' ? 'max-w-xs mx-auto' : ''}>
                <div
                  className="aspect-video rounded-lg border-4 border-black flex items-center justify-center relative overflow-hidden shadow-2xl"
                  style={{ backgroundColor: bgColor }}
                >
                  {/* Emoji Sticker */}
                  <div className="absolute top-4 right-4 text-5xl sm:text-6xl transform rotate-12 drop-shadow-lg">
                    {selectedEmoji}
                  </div>
                  
                  {/* Face (if enabled) */}
                  {showFaces && (
                    <div className="absolute top-8 left-8 text-6xl sm:text-7xl transform -rotate-12 drop-shadow-lg">
                      {selectedFace}
                    </div>
                  )}
                  
                  {/* Title */}
                  <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl text-white text-center px-8 uppercase font-black drop-shadow-[6px_6px_0_rgba(0,0,0,0.9)]" style={{ letterSpacing: '0.02em' }}>
                    {title || "Your Title Here"}
                  </h2>
                </div>
              </div>
              
              <p className="text-center text-xs text-zinc-500 mt-3">
                {previewSize === 'mobile' ? '📱 Mobile View' : '🖥️ Desktop View'} - Switch to see how it looks on different devices
              </p>
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
