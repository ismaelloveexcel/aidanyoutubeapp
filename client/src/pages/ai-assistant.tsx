import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Zap } from "lucide-react";

interface AIStatus {
  enabled: boolean;
  provider: string;
  message: string;
}

export default function AIAssistant() {
  const [videoTitle, setVideoTitle] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [thumbnailSuggestions, setThumbnailSuggestions] = useState<string[]>([]);
  const [contentIdeas, setContentIdeas] = useState<string[]>([]);
  const [aiStatus, setAIStatus] = useState<AIStatus | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  // Check AI status on mount
  useEffect(() => {
    fetch("/api/ai/status")
      .then(res => res.json())
      .then(data => setAIStatus(data))
      .catch(() => setAIStatus({ enabled: false, provider: "Offline", message: "AI service unavailable" }));
  }, []);

  const generateDescription = async () => {
    if (!videoTitle.trim()) {
      toast({ title: "Error", description: "Enter a video title first" });
      return;
    }

    setIsLoading("description");
    try {
      const res = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoTitle })
      });
      const data = await res.json();
      
      if (data.error) {
        toast({ title: "Error", description: data.error });
        return;
      }
      
      setGeneratedDescription(data.description);
      toast({
        title: "Description Generated!",
        description: data.aiPowered ? "Powered by Google Gemini AI ✨" : "Created with smart templates",
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate description" });
    } finally {
      setIsLoading(null);
    }
  };

  const generateTags = async () => {
    if (!videoTitle.trim()) {
      toast({ title: "Error", description: "Enter a video title first" });
      return;
    }

    setIsLoading("tags");
    try {
      const res = await fetch("/api/ai/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoTitle })
      });
      const data = await res.json();
      
      if (data.error) {
        toast({ title: "Error", description: data.error });
        return;
      }
      
      setGeneratedTags(data.tags);
      toast({
        title: "Tags Generated!",
        description: `Created ${data.tags.length} relevant tags`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate tags" });
    } finally {
      setIsLoading(null);
    }
  };

  const generateThumbnailIdeas = async () => {
    if (!videoTitle.trim()) {
      toast({ title: "Error", description: "Enter a video title first" });
      return;
    }

    setIsLoading("thumbnail");
    try {
      const res = await fetch("/api/ai/thumbnail-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoTitle })
      });
      const data = await res.json();
      
      if (data.error) {
        toast({ title: "Error", description: data.error });
        return;
      }
      
      setThumbnailSuggestions(data.ideas);
      toast({
        title: "Thumbnail Ideas Generated!",
        description: "Here are some creative thumbnail concepts",
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate thumbnail ideas" });
    } finally {
      setIsLoading(null);
    }
  };

  const generateContentIdeas = async () => {
    setIsLoading("content");
    try {
      const res = await fetch("/api/ai/content-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      const data = await res.json();
      
      if (data.error) {
        toast({ title: "Error", description: data.error });
        return;
      }
      
      setContentIdeas(data.ideas);
      toast({
        title: "Content Ideas Generated!",
        description: `${data.ideas.length} video ideas ready!`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate content ideas" });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">🤖 AI Assistant</h1>
        <p className="text-gray-400">Let AI help you create better content faster</p>
        
        {/* AI Status Badge */}
        {aiStatus && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" 
            style={{ 
              background: aiStatus.enabled ? "rgba(109,255,156,0.15)" : "rgba(243,201,76,0.15)",
              color: aiStatus.enabled ? "#6DFF9C" : "#F3C94C"
            }}
          >
            {aiStatus.enabled ? <Sparkles className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
            {aiStatus.provider}
          </div>
        )}
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Video Information</CardTitle>
          <CardDescription>Tell the AI about your video</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter your video title..."
              className="mt-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button onClick={generateDescription} disabled={isLoading !== null}>
              {isLoading === "description" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Generate Description
            </Button>
            <Button onClick={generateTags} variant="secondary" disabled={isLoading !== null}>
              {isLoading === "tags" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Generate Tags
            </Button>
            <Button onClick={generateThumbnailIdeas} variant="accent" disabled={isLoading !== null}>
              {isLoading === "thumbnail" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Thumbnail Ideas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Description */}
      {generatedDescription && (
        <Card>
          <CardHeader>
            <CardTitle>📝 Generated Description</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={generatedDescription}
              onChange={(e) => setGeneratedDescription(e.target.value)}
              className="w-full h-64 bg-[hsl(240,10%,12%)] border-[3px] border-[hsl(240,10%,20%)] rounded-lg p-4 text-white resize-none"
            />
            <Button
              className="mt-3"
              onClick={() => {
                navigator.clipboard.writeText(generatedDescription);
                toast({ title: "Copied!", description: "Description copied to clipboard" });
              }}
            >
              📋 Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generated Tags */}
      {generatedTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>#️⃣ Generated Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {generatedTags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[hsl(180,100%,50%)] text-black rounded-full text-sm font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <Button
              className="mt-4"
              onClick={() => {
                const tagsText = generatedTags.join(', ');
                navigator.clipboard.writeText(tagsText);
                toast({ title: "Copied!", description: "Tags copied to clipboard" });
              }}
            >
              📋 Copy Tags
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Thumbnail Suggestions */}
      {thumbnailSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🎨 Thumbnail Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {thumbnailSuggestions.map((suggestion, i) => (
                <div key={i} className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <div className="font-semibold mb-1">Idea #{i + 1}</div>
                  <p className="text-sm text-gray-400">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Ideas Generator */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Need Video Ideas?</CardTitle>
          <CardDescription>Generate fresh content ideas instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateContentIdeas} className="mb-4" disabled={isLoading !== null}>
            {isLoading === "content" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Generate Content Ideas
          </Button>

          {contentIdeas.length > 0 && (
            <div className="space-y-2">
              {contentIdeas.map((idea, i) => (
                <div key={i} className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span>{idea}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setVideoTitle(idea)}
                    >
                      Use This
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>✨ Powered by Google Gemini AI</CardTitle>
          <CardDescription>Free tier - no cost for creators!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">💬 Smart Descriptions</h4>
              <p className="text-sm text-gray-400">AI writes engaging descriptions with timestamps and CTAs</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">#️⃣ SEO Tags</h4>
              <p className="text-sm text-gray-400">Generates optimized tags to help your video get discovered</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">🎨 Thumbnail Tips</h4>
              <p className="text-sm text-gray-400">Custom thumbnail suggestions based on your video topic</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">💡 Content Ideas</h4>
              <p className="text-sm text-gray-400">Never run out of ideas with AI-powered suggestions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
