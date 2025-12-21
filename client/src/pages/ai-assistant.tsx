import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AIAssistant() {
  const [videoTitle, setVideoTitle] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [thumbnailSuggestions, setThumbnailSuggestions] = useState<string[]>([]);
  const [contentIdeas, setContentIdeas] = useState<string[]>([]);
  const { toast } = useToast();

  const generateDescription = () => {
    if (!videoTitle.trim()) {
      toast({ title: "Error", description: "Enter a video title first" });
      return;
    }

    // AI-powered description generation (simulated)
    const descriptions = [
      `In this video, we dive deep into ${videoTitle}! You'll learn everything you need to know and more. Don't forget to like and subscribe for more awesome content!

⏱️ Timestamps:
0:00 - Intro
0:30 - Main Content
5:00 - Conclusion

💜 Follow me on social media for behind-the-scenes content!

#${videoTitle.replace(/\s/g, '')} #YouTube #Tutorial`,

      `Welcome back to the channel! Today's video is all about ${videoTitle}. This is something I've been working on and I can't wait to share it with you!

What you'll learn:
✓ Key concepts and techniques
✓ Pro tips and tricks
✓ Common mistakes to avoid

If you enjoyed this video, smash that like button and subscribe for weekly uploads!`,

      `${videoTitle} - Everything you need to know in one video!

This comprehensive guide covers all the basics and advanced techniques. Whether you're a beginner or experienced, you'll find value here.

🔔 Turn on notifications so you never miss an upload!
👍 Like if this helped you!
💬 Comment your thoughts below!

Let's get started!`,
    ];

    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    setGeneratedDescription(randomDesc);

    toast({
      title: "Description Generated!",
      description: "AI created a custom description for your video",
    });
  };

  const generateTags = () => {
    if (!videoTitle.trim()) {
      toast({ title: "Error", description: "Enter a video title first" });
      return;
    }

    // Smart tag generation
    const baseTags = videoTitle.toLowerCase().split(' ');
    const additionalTags = ['tutorial', 'how to', 'tips', 'guide', 'beginner friendly', 'viral', 'trending', '2024'];

    const allTags = [...baseTags, ...additionalTags].slice(0, 15);
    setGeneratedTags(allTags);

    toast({
      title: "Tags Generated!",
      description: `Created ${allTags.length} relevant tags`,
    });
  };

  const generateThumbnailIdeas = () => {
    const ideas = [
      "Bright yellow background with large text",
      "Your face with shocked expression + text overlay",
      "Before & After comparison split screen",
      "Red circle highlighting key element",
      "Epic action shot with motion blur",
      "Minimalist design with emoji and number",
    ];

    setThumbnailSuggestions(ideas);

    toast({
      title: "Thumbnail Ideas Generated!",
      description: "Here are some proven thumbnail styles",
    });
  };

  const generateContentIdeas = () => {
    const ideas = [
      "Top 10 Things You Didn't Know About...",
      "I Tried [Challenge] for 24 Hours",
      "ULTIMATE Beginner's Guide to...",
      "5 Mistakes Everyone Makes (And How to Fix Them)",
      "Behind the Scenes of My Creative Process",
      "Reacting to Viewer Comments",
      "My Monthly Favorites and Recommendations",
      "Q&A: You Asked, I Answered!",
    ];

    setContentIdeas(ideas);

    toast({
      title: "Content Ideas Generated!",
      description: "8 video ideas based on trending formats",
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">🤖 AI Assistant</h1>
        <p className="text-gray-400">Let AI help you create better content faster</p>
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
            <Button onClick={generateDescription}>Generate Description</Button>
            <Button onClick={generateTags} variant="secondary">Generate Tags</Button>
            <Button onClick={generateThumbnailIdeas} variant="accent">Thumbnail Ideas</Button>
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
          <Button onClick={generateContentIdeas} className="mb-4">
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
          <CardTitle>✨ How AI Helps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">💬 Smart Descriptions</h4>
              <p className="text-sm text-gray-400">AI writes engaging descriptions with timestamps and CTAs</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">#️⃣ Relevant Tags</h4>
              <p className="text-sm text-gray-400">Generates SEO-optimized tags from your title</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">🎨 Thumbnail Tips</h4>
              <p className="text-sm text-gray-400">Suggests proven thumbnail styles that get clicks</p>
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
