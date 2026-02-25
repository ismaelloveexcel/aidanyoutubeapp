import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { Lightbulb, Save, RefreshCw, Trash2, Sparkles, TrendingUp, Download, Copy, FileText } from "lucide-react";
import { CoachTips, IDEA_TIPS } from "@/components/CoachTips";
import { celebrateSuccess } from "@/lib/confetti";
import { exportToClipboard, exportToTextFile, exportToPDF, formatIdeaForExport } from "@/lib/export-helpers";
import { incrementStat } from "@/lib/progress-tracking";
import type { Idea } from "@shared/schema";

const VIDEO_IDEAS = {
  Gaming: [
    { title: "My First Victory Royale", description: "Show your epic first win and tips for beginners" },
    { title: "Top 10 Secret Locations", description: "Reveal hidden spots in your favorite game" },
    { title: "Challenge: Using Only [Weapon]", description: "Complete levels with limited equipment" },
    { title: "Character Tier List", description: "Rank all characters from worst to best" },
    { title: "Speedrun Challenge", description: "Try to beat the game as fast as possible" },
  ],
  Tech: [
    { title: "My Desk Setup Tour", description: "Show off your gaming or creative workspace" },
    { title: "App Recommendations", description: "Share your top 5 favorite apps and why" },
    { title: "Tech Unboxing & Review", description: "Open and test out new tech gadgets" },
    { title: "Digital Art Tutorial", description: "Teach viewers how to create cool digital art" },
    { title: "Coding My First Game", description: "Document your journey learning to code" },
  ],
  Vlog: [
    { title: "Day in My Life", description: "Film your typical day from start to finish" },
    { title: "Room Tour 2024", description: "Show viewers your awesome room setup" },
    { title: "What's in My Backpack", description: "Reveal all the cool stuff you carry daily" },
    { title: "Morning Routine", description: "Share how you start your day" },
    { title: "Weekend Adventure", description: "Document a fun weekend activity or trip" },
  ],
  React: [
    { title: "React to Trending Videos", description: "Watch and comment on popular content" },
    { title: "Reacting to Old Photos", description: "Look back at your funny childhood photos" },
    { title: "Try Not to Laugh", description: "Watch funny videos without laughing" },
    { title: "Reacting to Comments", description: "Respond to viewer comments from past videos" },
    { title: "First Time Trying [Food]", description: "React to tasting something new" },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  Gaming: "#2BD4FF",
  Tech: "#4E4DFF",
  Vlog: "#F3C94C",
  React: "#6DFF9C",
};

// Trending video ideas (simulated - could be connected to YouTube API later)
const TRENDING_IDEAS = [
  { title: "I Survived 100 Days In...", category: "Gaming", views: "12M" },
  { title: "Testing Viral TikTok Hacks", category: "React", views: "8M" },
  { title: "My Setup Tour 2024", category: "Tech", views: "5M" },
  { title: "24 Hours Challenge", category: "Vlog", views: "10M" },
  { title: "Things You Didn't Know About...", category: "Gaming", views: "6M" },
  { title: "Epic Transformation", category: "Vlog", views: "7M" },
];

export default function Ideas() {
  const [currentIdea, setCurrentIdea] = useState<{ title: string; description: string; category: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedIdeas = [], isLoading } = useQuery<Idea[]>({
    queryKey: ["/api/ideas?saved=true"],
  });

  const saveIdeaMutation = useMutation({
    mutationFn: async (idea: { title: string; description: string; category: string }) => {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...idea, saved: true }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas?saved=true"] });
      celebrateSuccess();
      
      // Track progress
      const newBadge = incrementStat('ideasGenerated');
      
      toast({
        title: "Idea Saved! 🎉",
        description: newBadge ? `Achievement unlocked: ${newBadge.emoji} ${newBadge.name}!` : "Added to your collection.",
      });
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/ideas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas?saved=true"] });
      toast({
        title: "Idea Deleted",
        description: "Removed from your list.",
      });
    },
  });

  const generateIdea = () => {
    const categories = Object.keys(VIDEO_IDEAS) as Array<keyof typeof VIDEO_IDEAS>;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const ideas = VIDEO_IDEAS[randomCategory];
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    setCurrentIdea({ ...randomIdea, category: randomCategory });
  };

  const handleExportIdea = async (idea: { title: string; description: string; category: string }, format: 'clipboard' | 'txt' | 'pdf') => {
    const content = formatIdeaForExport(idea);
    
    try {
      if (format === 'clipboard') {
        await exportToClipboard(content);
        toast({ title: "Copied to clipboard! 📋" });
      } else if (format === 'txt') {
        exportToTextFile(content, `idea-${idea.title.toLowerCase().replace(/\s+/g, '-')}`);
        toast({ title: "Downloaded as text file! 📄" });
      } else if (format === 'pdf') {
        exportToPDF(content, `idea-${idea.title.toLowerCase().replace(/\s+/g, '-')}`, idea.title);
        toast({ title: "Downloaded as PDF! 📕" });
      }
    } catch (error) {
      toast({ title: "Export failed", description: "Please try again." });
    }
  };

  if (isLoading) {
    return <Loader text="Loading your ideas..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Coach Tips */}
      <CoachTips tips={IDEA_TIPS} pageName="ideas" />
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3">
          <div 
            className="p-3 rounded-xl"
            style={{ 
              background: "rgba(43, 212, 255, 0.12)"
            }}
          >
            <Lightbulb className="h-7 w-7 text-[#2BD4FF]" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Idea Generator</h1>
        <p className="text-zinc-400 text-sm sm:text-base">Need inspiration? Get a random video idea or browse trending topics!</p>
      </div>

      {/* Idea Generator Card */}
      <div className="holo-card rounded-2xl p-8 neon-border">
        <div className="text-center space-y-5">
          {currentIdea ? (
            <div 
              className="p-6 rounded-xl"
              style={{ 
                background: `linear-gradient(135deg, ${CATEGORY_COLORS[currentIdea.category]}10 0%, transparent 100%)`,
                border: `1px solid ${CATEGORY_COLORS[currentIdea.category]}25`
              }}
            >
              <div 
                className="inline-block px-3 py-1 rounded-full text-sm font-semibold font-display uppercase tracking-wider mb-4"
                style={{ 
                  background: CATEGORY_COLORS[currentIdea.category],
                  color: currentIdea.category === "Vlog" || currentIdea.category === "React" ? "#000" : "#fff"
                }}
              >
                {currentIdea.category}
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-white mb-2">{currentIdea.title}</h3>
              <p className="text-zinc-400 text-sm sm:text-base">{currentIdea.description}</p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Button 
                  onClick={() => saveIdeaMutation.mutate(currentIdea)}
                  className="gap-2 text-base sm:text-lg px-6 py-6"
                  style={{ 
                    background: "#6DFF9C",
                    color: "#000"
                  }}
                >
                  <Save className="h-5 w-5" />
                  Save Idea
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={generateIdea}
                  className="gap-2 text-base"
                >
                  <RefreshCw className="h-4 w-4" />
                  New Idea
                </Button>
              </div>
              
              {/* Export Options */}
              <div className="flex flex-wrap gap-2 justify-center mt-4 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExportIdea(currentIdea, 'clipboard')}
                  className="gap-2 text-zinc-400 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExportIdea(currentIdea, 'txt')}
                  className="gap-2 text-zinc-400 hover:text-white"
                >
                  <FileText className="h-4 w-4" />
                  .TXT
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExportIdea(currentIdea, 'pdf')}
                  className="gap-2 text-zinc-400 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  .PDF
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-14">
              <Sparkles className="h-12 w-12 text-[#4E4DFF] mx-auto mb-5 opacity-40" />
              <Button 
                size="lg" 
                onClick={generateIdea}
                className="font-display uppercase tracking-wide"
                style={{ 
                  background: "#4E4DFF"
                }}
              >
                Generate Idea
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Trending Section */}
      <div className="space-y-5">
        <h2 className="font-display text-lg sm:text-xl text-white flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-[#F3C94C]" />
          Trending Right Now
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRENDING_IDEAS.map((trend, index) => (
            <button
              key={index}
              onClick={() => {
                const ideas = VIDEO_IDEAS[trend.category as keyof typeof VIDEO_IDEAS];
                const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
                setCurrentIdea({ 
                  title: trend.title,
                  description: randomIdea.description,
                  category: trend.category 
                });
              }}
              className="p-4 rounded-xl text-left transition-all hover:scale-102 group"
              style={{ 
                background: `${CATEGORY_COLORS[trend.category]}08`,
                border: `1px solid ${CATEGORY_COLORS[trend.category]}20`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <span 
                  className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded"
                  style={{ 
                    background: CATEGORY_COLORS[trend.category],
                    color: '#000'
                  }}
                >
                  {trend.category}
                </span>
                <span className="text-xs text-zinc-500">{trend.views} views</span>
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-[#6DFF9C] transition-colors">
                {trend.title}
              </h3>
            </button>
          ))}
        </div>
      </div>

      {/* Category Buttons */}
      <div className="space-y-5">
        <h2 className="font-display text-lg sm:text-xl text-white flex items-center gap-3">
          <span className="inline-block w-6 h-[1px] bg-gradient-to-r from-[#4E4DFF] to-transparent" />
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {Object.keys(VIDEO_IDEAS).map((category) => (
            <button
              key={category}
              onClick={() => {
                const ideas = VIDEO_IDEAS[category as keyof typeof VIDEO_IDEAS];
                const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
                setCurrentIdea({ ...randomIdea, category });
              }}
              className="px-4 py-4 sm:py-5 rounded-xl font-display font-medium text-base sm:text-lg transition-all hover:scale-102 active:scale-95"
              style={{ 
                background: `${CATEGORY_COLORS[category]}12`,
                border: `1px solid ${CATEGORY_COLORS[category]}25`,
                color: CATEGORY_COLORS[category]
              }}
              data-testid={`button-category-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Block Divider */}
      <div className="block-divider opacity-50" />

      {/* Saved Ideas */}
      <div className="space-y-5">
        <h2 className="font-display text-lg text-white flex items-center gap-3">
          <span className="inline-block w-6 h-[1px] bg-gradient-to-r from-[#2BD4FF] to-transparent" />
          Your Saved Ideas
        </h2>
        {savedIdeas.length === 0 ? (
          <div className="holo-card rounded-xl p-8 text-center">
            <Save className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500">No saved ideas yet. Generate and save some!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedIdeas.map((idea) => (
              <div 
                key={idea.id}
                className="holo-card rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div 
                      className="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ 
                        background: CATEGORY_COLORS[idea.category] || "#4E4DFF",
                        color: idea.category === "Vlog" || idea.category === "React" ? "#000" : "#fff"
                      }}
                    >
                      {idea.category}
                    </div>
                    <h3 className="font-display text-white font-medium">{idea.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{idea.description}</p>
                  </div>
                  <button
                    onClick={() => deleteIdeaMutation.mutate(idea.id)}
                    className="p-2 rounded-lg hover:bg-[rgba(78,77,255,0.2)] transition-colors"
                    data-testid={`button-delete-idea-${idea.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-zinc-500 hover:text-[#4E4DFF]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
