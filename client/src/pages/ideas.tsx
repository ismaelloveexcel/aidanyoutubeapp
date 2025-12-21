import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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

export default function Ideas() {
  const [currentIdea, setCurrentIdea] = useState<{ title: string; description: string; category: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedIdeas = [] } = useQuery<Idea[]>({
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
        description: "You can find it in your saved ideas below.",
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
        description: "Idea removed from your saved list.",
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">💡 Video Idea Generator</h1>
        <p className="text-gray-400">Need inspiration? Get a random video idea!</p>
      </div>

      {/* Idea Generator */}
      <Card className="sticker-tilt-left">
        <CardHeader>
          <CardTitle>Generate New Idea</CardTitle>
          <CardDescription>Click the button to get a random video idea</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            {currentIdea ? (
              <div className="p-6 bg-[hsl(240,10%,15%)] rounded-lg">
                <div className="inline-block px-3 py-1 bg-[hsl(320,100%,50%)] rounded-full text-sm font-semibold mb-3">
                  {currentIdea.category}
                </div>
                <h3 className="font-display text-2xl mb-2">{currentIdea.title}</h3>
                <p className="text-gray-400">{currentIdea.description}</p>
                <div className="flex gap-3 justify-center mt-4">
                  <Button onClick={() => saveIdeaMutation.mutate(currentIdea)}>
                    💾 Save Idea
                  </Button>
                  <Button variant="secondary" onClick={generateIdea}>
                    🔄 New Idea
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12">
                <div className="text-6xl mb-4">💡</div>
                <Button size="lg" onClick={generateIdea}>
                  Generate Idea
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Buttons */}
      <div>
        <h2 className="font-display text-2xl mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(VIDEO_IDEAS).map((category) => (
            <Button
              key={category}
              variant="secondary"
              onClick={() => {
                const ideas = VIDEO_IDEAS[category as keyof typeof VIDEO_IDEAS];
                const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
                setCurrentIdea({ ...randomIdea, category });
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Saved Ideas */}
      <div>
        <h2 className="font-display text-2xl mb-4">💾 Your Saved Ideas</h2>
        {savedIdeas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-400">No saved ideas yet. Generate and save some!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedIdeas.map((idea) => (
              <Card key={idea.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="inline-block px-2 py-1 bg-[hsl(180,100%,50%)] rounded text-xs font-semibold mb-2">
                        {idea.category}
                      </div>
                      <CardTitle className="text-lg">{idea.title}</CardTitle>
                      <CardDescription className="mt-2">{idea.description}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteIdeaMutation.mutate(idea.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
