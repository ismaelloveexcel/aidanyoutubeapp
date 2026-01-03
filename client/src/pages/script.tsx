import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import type { Script } from "@shared/schema";

const SCRIPT_TEMPLATES = {
  gaming: {
    id: "gaming",
    name: "Gaming Highlight",
    emoji: "🎮",
    steps: [
      { stepId: 1, content: "Hook: 'What's up gamers! Check out this EPIC moment!'" },
      { stepId: 2, content: "Intro: Explain what game you're playing and the challenge" },
      { stepId: 3, content: "Build-up: Set the scene - what's happening in the game" },
      { stepId: 4, content: "Climax: Show the epic moment or win" },
      { stepId: 5, content: "Reaction: Your genuine reaction to what just happened" },
      { stepId: 6, content: "Outro: 'Thanks for watching! Like and subscribe for more!'" },
    ],
  },
  review: {
    id: "review",
    name: "Product Review",
    emoji: "⭐",
    steps: [
      { stepId: 1, content: "Hook: 'Is this the BEST [product] ever?'" },
      { stepId: 2, content: "Intro: What you're reviewing and why" },
      { stepId: 3, content: "Unboxing: Show the product and first impressions" },
      { stepId: 4, content: "Features: Explain 3-5 coolest features" },
      { stepId: 5, content: "Testing: Show it in action" },
      { stepId: 6, content: "Verdict: Would you recommend it? Rate out of 10" },
      { stepId: 7, content: "Outro: Ask viewers to comment their thoughts" },
    ],
  },
  vlog: {
    id: "vlog",
    name: "Daily Vlog",
    emoji: "📹",
    steps: [
      { stepId: 1, content: "Hook: 'Good morning! Today is gonna be awesome!'" },
      { stepId: 2, content: "Morning: Show your morning routine" },
      { stepId: 3, content: "Main Activity: The main thing you're doing today" },
      { stepId: 4, content: "Bonus Clips: Funny or interesting moments" },
      { stepId: 5, content: "Evening: Wrap up your day" },
      { stepId: 6, content: "Outro: 'See you tomorrow!'" },
    ],
  },
};

export default function Script() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [scriptTitle, setScriptTitle] = useState("");
  const [steps, setSteps] = useState<{ stepId: number; content: string }[]>([]);
  const [editingScript, setEditingScript] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedScripts = [], isLoading } = useQuery<Script[]>({
    queryKey: ["/api/scripts"],
  });

  const saveScriptMutation = useMutation({
    mutationFn: async (script: { templateId: string; title: string; steps: typeof steps }) => {
      if (editingScript) {
        const res = await fetch(`/api/scripts/${editingScript}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(script),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      } else {
        const res = await fetch("/api/scripts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(script),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
      toast({
        title: editingScript ? "Script Updated!" : "Script Saved!",
        description: "Your script has been saved successfully.",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save script",
      });
    },
  });

  const deleteScriptMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/scripts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
      toast({
        title: "Script Deleted",
        description: "Script removed successfully.",
      });
    },
  });

  const resetForm = () => {
    setSelectedTemplate(null);
    setScriptTitle("");
    setSteps([]);
    setEditingScript(null);
  };

  const selectTemplate = (templateId: string) => {
    const template = SCRIPT_TEMPLATES[templateId as keyof typeof SCRIPT_TEMPLATES];
    setSelectedTemplate(templateId);
    setScriptTitle(template.name);
    setSteps(template.steps);
  };

  const loadScript = (script: Script) => {
    setEditingScript(script.id);
    setSelectedTemplate(script.templateId);
    setScriptTitle(script.title);
    setSteps(script.steps);
  };

  const updateStep = (stepId: number, content: string) => {
    setSteps(steps.map(step => step.stepId === stepId ? { ...step, content } : step));
  };

  if (isLoading) {
    return <Loader text="Loading your scripts..." />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">📝 Script Writer</h1>
        <p className="text-gray-400">Create awesome video scripts with templates</p>
      </div>

      {!selectedTemplate ? (
        <>
          {/* Template Selection */}
          <div>
            <h2 className="font-display text-2xl mb-4">Choose a Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(SCRIPT_TEMPLATES).map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => selectTemplate(template.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-3">{template.emoji}</div>
                    <h3 className="font-display text-xl">{template.name}</h3>
                    <p className="text-sm text-gray-400 mt-2">{template.steps.length} steps</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Saved Scripts */}
          <div>
            <h2 className="font-display text-2xl mb-4">📚 Your Scripts</h2>
            {savedScripts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-400">No scripts yet. Create one using a template!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedScripts.map((script) => (
                  <Card key={script.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{script.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {script.steps.length} steps · Updated {new Date(script.updatedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => loadScript(script)}>
                            ✏️
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteScriptMutation.mutate(script.id)}>
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Script Editor */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={resetForm}>
              ← Back to Templates
            </Button>
            <Button onClick={() => saveScriptMutation.mutate({ templateId: selectedTemplate, title: scriptTitle, steps })}>
              💾 {editingScript ? "Update" : "Save"} Script
            </Button>
          </div>

          <Card>
            <CardHeader>
              <Label htmlFor="title">Script Title</Label>
              <Input
                id="title"
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
                placeholder="Enter script title"
                className="mt-2"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.stepId} className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <Label className="text-[hsl(320,100%,50%)] mb-2 block">
                    Step {index + 1}
                  </Label>
                  <textarea
                    value={step.content}
                    onChange={(e) => updateStep(step.stepId, e.target.value)}
                    className="w-full h-24 bg-[hsl(240,10%,12%)] border-[3px] border-[hsl(240,10%,20%)] rounded-lg p-3 text-white resize-none focus:outline-none focus:border-[hsl(320,100%,50%)]"
                    placeholder={`Write step ${index + 1}...`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
