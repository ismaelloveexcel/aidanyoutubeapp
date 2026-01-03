import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { Lightbulb, Save, RefreshCw, Trash2, Sparkles } from "lucide-react";
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
  Gaming: "#FF2D95",
  Tech: "#7C4DFF",
  Vlog: "#40F5FF",
  React: "#8BFF4A",
};

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
      toast({
        title: "Idea Saved!",
        description: "Added to your collection.",
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

  if (isLoading) {
    return <Loader text="Loading your ideas..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div 
            className="p-3 rounded-xl"
            style={{ 
              background: "rgba(255, 45, 149, 0.2)",
              boxShadow: "0 0 30px rgba(255, 45, 149, 0.3)"
            }}
          >
            <Lightbulb className="h-8 w-8 text-[#FF2D95]" />
          </div>
        </div>
        <h1 className="text-4xl font-bold font-display text-white mb-2">Idea Generator</h1>
        <p className="text-zinc-400">Need inspiration? Get a random video idea!</p>
      </div>

      {/* Idea Generator Card */}
      <div className="holo-card rounded-2xl p-6 neon-border">
        <div className="text-center space-y-4">
          {currentIdea ? (
            <div 
              className="p-6 rounded-xl"
              style={{ 
                background: `linear-gradient(135deg, ${CATEGORY_COLORS[currentIdea.category]}15 0%, transparent 100%)`,
                border: `1px solid ${CATEGORY_COLORS[currentIdea.category]}40`
              }}
            >
              <div 
                className="inline-block px-3 py-1 rounded-full text-sm font-bold font-display uppercase tracking-wider mb-3"
                style={{ 
                  background: CATEGORY_COLORS[currentIdea.category],
                  color: currentIdea.category === "Vlog" || currentIdea.category === "React" ? "#000" : "#fff"
                }}
              >
                {currentIdea.category}
              </div>
              <h3 className="font-display text-2xl text-white mb-2">{currentIdea.title}</h3>
              <p className="text-zinc-400">{currentIdea.description}</p>
              <div className="flex gap-3 justify-center mt-6">
                <Button 
                  onClick={() => saveIdeaMutation.mutate(currentIdea)}
                  className="gap-2"
                  style={{ 
                    background: "linear-gradient(135deg, #8BFF4A 0%, #00E676 100%)",
                    color: "#000"
                  }}
                >
                  <Save className="h-4 w-4" />
                  Save Idea
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={generateIdea}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  New Idea
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12">
              <Sparkles className="h-16 w-16 text-[#7C4DFF] mx-auto mb-4 opacity-50" />
              <Button 
                size="lg" 
                onClick={generateIdea}
                className="font-display uppercase tracking-wide"
                style={{ 
                  background: "linear-gradient(135deg, #FF2D95 0%, #7C4DFF 100%)",
                  boxShadow: "0 10px 30px rgba(255, 45, 149, 0.3)"
                }}
              >
                Generate Idea
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Category Buttons */}
      <div>
        <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2">
          <span className="inline-block w-8 h-[2px] bg-gradient-to-r from-[#7C4DFF] to-transparent" />
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(VIDEO_IDEAS).map((category) => (
            <button
              key={category}
              onClick={() => {
                const ideas = VIDEO_IDEAS[category as keyof typeof VIDEO_IDEAS];
                const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
                setCurrentIdea({ ...randomIdea, category });
              }}
              className="px-4 py-3 rounded-xl font-display font-medium transition-all hover:scale-105"
              style={{ 
                background: `${CATEGORY_COLORS[category]}20`,
                border: `1px solid ${CATEGORY_COLORS[category]}40`,
                color: CATEGORY_COLORS[category],
                boxShadow: `0 0 20px ${CATEGORY_COLORS[category]}20`
              }}
              data-testid={`button-category-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Block Divider */}
      <div className="block-divider" />

      {/* Saved Ideas */}
      <div>
        <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2">
          <span className="inline-block w-8 h-[2px] bg-gradient-to-r from-[#40F5FF] to-transparent" />
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
                        background: CATEGORY_COLORS[idea.category] || "#7C4DFF",
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
                    className="p-2 rounded-lg hover:bg-[rgba(255,45,149,0.2)] transition-colors"
                    data-testid={`button-delete-idea-${idea.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-zinc-500 hover:text-[#FF2D95]" />
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
