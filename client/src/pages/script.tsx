import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { Mic, MicOff, CheckCircle2, AlertCircle, Zap, FileText, Copy, Download, Sparkles } from "lucide-react";
import { CoachTips, SCRIPT_TIPS } from "@/components/CoachTips";
import { celebrateSuccess } from "@/lib/confetti";
import { exportToClipboard, exportToTextFile, exportToPDF, formatScriptForExport } from "@/lib/export-helpers";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { incrementStat } from "@/lib/progress-tracking";
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
  const [activeStepForVoice, setActiveStepForVoice] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Voice input for the active step
  const { isListening, isSupported, toggleListening } = useVoiceInput({
    onResult: (transcript) => {
      if (activeStepForVoice !== null) {
        const step = steps.find(s => s.stepId === activeStepForVoice);
        if (step) {
          const newContent = step.content ? `${step.content} ${transcript}` : transcript;
          updateStep(activeStepForVoice, newContent);
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Voice input error",
        description: error === 'not-allowed' ? 'Please allow microphone access' : 'Something went wrong',
      });
    },
    continuous: false,
  });

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
      celebrateSuccess();
      
      // Track progress
      const newBadge = incrementStat('scriptsCreated');
      
      toast({
        title: editingScript ? "Script Updated! ✅" : "Script Saved! 🎉",
        description: newBadge ? `Achievement unlocked: ${newBadge.emoji} ${newBadge.name}!` : "Your script has been saved successfully.",
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

  // Calculate script score
  const calculateScriptScore = () => {
    const checks = {
      hasHook: steps[0]?.content.toLowerCase().includes('hey') || 
               steps[0]?.content.toLowerCase().includes('what') ||
               steps[0]?.content.includes('!'),
      hasCTA: steps[steps.length - 1]?.content.toLowerCase().includes('subscribe') ||
              steps[steps.length - 1]?.content.toLowerCase().includes('like'),
      shortSentences: steps.every(step => step.content.split(' ').length < 30),
      hasEnergy: steps.some(step => 
        step.content.toLowerCase().includes('epic') ||
        step.content.toLowerCase().includes('awesome') ||
        step.content.toLowerCase().includes('crazy') ||
        step.content.includes('!')
      ),
      isComplete: steps.every(step => step.content.trim().length > 10),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { score, total: 5, checks };
  };

  const makeMoreExciting = () => {
    const excitingWords = ['EPIC', 'AMAZING', 'AWESOME', 'INCREDIBLE', 'CRAZY'];
    const randomWord = excitingWords[Math.floor(Math.random() * excitingWords.length)];
    
    // Add energy to first step
    if (steps[0]) {
      const content = steps[0].content;
      if (!content.includes('!')) {
        updateStep(steps[0].stepId, content + '!');
      }
      // Add exciting word if not present
      if (!excitingWords.some(word => content.toUpperCase().includes(word))) {
        updateStep(steps[0].stepId, `${randomWord}! ${content}`);
      }
    }
    
    toast({ title: "Script boosted! 🚀", description: "Added more energy to your script!" });
  };

  const makeShorter = () => {
    // Simplify each step by removing filler words
    const fillerWords = ['really', 'very', 'just', 'actually', 'basically', 'literally'];
    
    steps.forEach(step => {
      let content = step.content;
      fillerWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        content = content.replace(regex, '');
      });
      // Remove extra spaces
      content = content.replace(/\s+/g, ' ').trim();
      updateStep(step.stepId, content);
    });
    
    toast({ title: "Script simplified! ✂️", description: "Removed unnecessary words!" });
  };

  const handleExportScript = async (format: 'clipboard' | 'txt' | 'pdf') => {
    const content = formatScriptForExport(scriptTitle, steps);
    
    try {
      if (format === 'clipboard') {
        await exportToClipboard(content);
        toast({ title: "Copied to clipboard! 📋" });
      } else if (format === 'txt') {
        exportToTextFile(content, `script-${scriptTitle.toLowerCase().replace(/\s+/g, '-')}`);
        toast({ title: "Downloaded as text file! 📄" });
      } else if (format === 'pdf') {
        exportToPDF(content, `script-${scriptTitle.toLowerCase().replace(/\s+/g, '-')}`, scriptTitle);
        toast({ title: "Downloaded as PDF! 📕" });
      }
    } catch (error) {
      toast({ title: "Export failed", description: "Please try again." });
    }
  };

  if (isLoading) {
    return <Loader text="Loading your scripts..." />;
  }

  const scoreData = selectedTemplate ? calculateScriptScore() : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Coach Tips */}
      <CoachTips tips={SCRIPT_TIPS} pageName="script" />
      
      <div className="text-center">
        <h1 className="heading-display text-3xl sm:text-4xl mb-2">📝 Script Writer</h1>
        <p className="text-zinc-400 text-sm sm:text-base">Create awesome video scripts with templates</p>
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
          {/* Script Editor Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button variant="ghost" onClick={resetForm} className="gap-2">
              ← Back to Templates
            </Button>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowScore(!showScore)}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {showScore ? 'Hide' : 'Show'} Score
              </Button>
              <Button 
                onClick={() => saveScriptMutation.mutate({ templateId: selectedTemplate, title: scriptTitle, steps })}
                className="gap-2 bg-gradient-to-r from-[#6DFF9C] to-[#4BCC7A] text-[#0a1628]"
              >
                💾 {editingScript ? "Update" : "Save"} Script
              </Button>
            </div>
          </div>

          {/* Script Score Card */}
          {showScore && scoreData && (
            <Card className="bg-gradient-to-br from-[#122046] to-[#0a1628] border-[#F3C94C]/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-display font-bold text-white">Script Quality Score</h3>
                  <div className="text-3xl font-bold" style={{ color: scoreData.score >= 4 ? '#6DFF9C' : scoreData.score >= 3 ? '#F3C94C' : '#FF6B6B' }}>
                    {scoreData.score}/{scoreData.total}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <ScoreItem checked={scoreData.checks.hasHook} text="Strong hook in first 3 seconds" />
                  <ScoreItem checked={scoreData.checks.hasCTA} text="Call-to-action at the end" />
                  <ScoreItem checked={scoreData.checks.shortSentences} text="Short, punchy sentences" />
                  <ScoreItem checked={scoreData.checks.hasEnergy} text="Energetic language (EPIC, AWESOME)" />
                  <ScoreItem checked={scoreData.checks.isComplete} text="All steps filled out" />
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                  <Button
                    onClick={makeMoreExciting}
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Make it More Exciting
                  </Button>
                  <Button
                    onClick={makeShorter}
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Make it Shorter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
                <div key={step.stepId} className="p-4 bg-[#122046]/50 rounded-xl border border-[#2BD4FF]/20">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-[#2BD4FF] font-semibold">
                      Step {index + 1}
                    </Label>
                    {isSupported && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (activeStepForVoice === step.stepId && isListening) {
                            toggleListening();
                            setActiveStepForVoice(null);
                          } else {
                            setActiveStepForVoice(step.stepId);
                            toggleListening();
                          }
                        }}
                        className={`gap-2 ${activeStepForVoice === step.stepId && isListening ? 'text-red-500' : 'text-zinc-400'}`}
                      >
                        {activeStepForVoice === step.stepId && isListening ? (
                          <>
                            <MicOff className="h-4 w-4 animate-pulse" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4" />
                            Voice
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <textarea
                    value={step.content}
                    onChange={(e) => updateStep(step.stepId, e.target.value)}
                    className="w-full h-28 bg-[#0a1628] border-2 border-[#2BD4FF]/30 rounded-lg p-3 text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-[#2BD4FF] transition-colors"
                    placeholder={`Write step ${index + 1}... ${isSupported ? 'or click Voice to speak' : ''}`}
                  />
                  {activeStepForVoice === step.stepId && isListening && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Listening...
                    </div>
                  )}
                </div>
              ))}
              
              {/* Export Options */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="secondary"
                  onClick={() => handleExportScript('clipboard')}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy All
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleExportScript('txt')}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export .TXT
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleExportScript('pdf')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export .PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// Helper component for score checklist
function ScoreItem({ checked, text }: { checked: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3">
      {checked ? (
        <CheckCircle2 className="h-5 w-5 text-[#6DFF9C] flex-shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 text-zinc-600 flex-shrink-0" />
      )}
      <span className={`text-sm ${checked ? 'text-white' : 'text-zinc-500'}`}>
        {text}
      </span>
    </div>
  );
}
