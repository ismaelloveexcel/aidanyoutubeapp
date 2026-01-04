import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreatorProfile, AVATARS } from "@/lib/creator-profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";
import {
  Lightbulb,
  FileText,
  Video,
  Scissors,
  Upload,
  ChevronRight,
  ChevronDown,
  Check,
  RotateCcw,
  Settings,
  Trophy,
  Sparkles,
  Palette,
  Megaphone,
  Brain,
  PlaySquare,
  CalendarClock,
  Film,
  Loader2,
} from "lucide-react";

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  icon: typeof Lightbulb;
  path: string;
  color: string;
}

const STEPS: RoadmapStep[] = [
  { id: 1, title: "Generate Idea", description: "Brainstorm your video concept", icon: Lightbulb, path: "/ideas", color: "#2BD4FF" },
  { id: 2, title: "Write Script", description: "Plan what you'll say and do", icon: FileText, path: "/script", color: "#4E4DFF" },
  { id: 3, title: "Record Video", description: "Lights, camera, action!", icon: Video, path: "/recorder", color: "#6DFF9C" },
  { id: 4, title: "Edit Video", description: "Add effects and make it awesome", icon: Scissors, path: "/editor", color: "#F3C94C" },
  { id: 5, title: "Upload & Share", description: "Share with the world!", icon: Upload, path: "/upload", color: "#2BD4FF" },
];

const IDEA_TOOLS = [
  {
    title: "Ideas Lab",
    description: "Instant hooks, headlines, and prompts to spark the episode.",
    path: "/ideas",
    icon: Lightbulb,
    color: "#2BD4FF",
    label: "Creativity",
  },
  {
    title: "Script Studio",
    description: "Structured beats so every scene flows and keeps viewers watching.",
    path: "/script",
    icon: FileText,
    color: "#4E4DFF",
    label: "Story",
  },
  {
    title: "Thumbnail Atelier",
    description: "Design scroll-stopping thumbnails with ready palettes.",
    path: "/thumbnail",
    icon: Palette,
    color: "#A259FF",
    label: "Design",
  },
  {
    title: "AI Wingman",
    description: "Ask for fixes, captions, or growth tips while you build.",
    path: "/ai-assistant",
    icon: Brain,
    color: "#6DFF9C",
    label: "Support",
  },
];

const VIDEO_TOOLS = [
  {
    title: "Record Suite",
    description: "Capture camera, screen, or both with simple audio checks.",
    path: "/recorder",
    icon: Video,
    color: "#6DFF9C",
    label: "Production",
  },
  {
    title: "Edit Desk",
    description: "Trim, add reactions, and tighten pacing before exporting.",
    path: "/editor",
    icon: Scissors,
    color: "#F3C94C",
    label: "Polish",
  },
  {
    title: "Analytics & Pulse",
    description: "Track what's resonating and where to improve next upload.",
    path: "/analytics",
    icon: PlaySquare,
    color: "#2BD4FF",
    label: "Insights",
  },
  {
    title: "Share Everywhere",
    description: "Schedule posts and repurpose cuts for each platform.",
    path: "/multi-platform",
    icon: Megaphone,
    color: "#F3C94C",
    label: "Growth",
  },
  {
    title: "Creator Calendar",
    description: "Plan filming days and deadlines so nothing slips.",
    path: "/calendar",
    icon: CalendarClock,
    color: "#4E4DFF",
    label: "Rhythm",
  },
];

const STEP_STORAGE_KEY = "tubestar-completed-steps";

function getStoredSteps(): number[] {
  try {
    const stored = localStorage.getItem(STEP_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storeCompletedSteps(steps: number[]) {
  localStorage.setItem(STEP_STORAGE_KEY, JSON.stringify(steps));
}

interface VideoStats {
  total: number;
  draft: number;
  inProgress: number;
  published: number;
}

export default function Dashboard() {
  const { profile, setName, setChannelName, setAvatar, setRememberMe } = useCreatorProfile();
  const { toast } = useToast();
  const [showSetup, setShowSetup] = useState(() => {
    const isSetupDone = localStorage.getItem('tubestar-profile');
    return !isSetupDone;
  });
  const [tempName, setTempName] = useState(profile.name);
  const [tempChannel, setTempChannel] = useState(profile.channelName);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [rememberMe, setRememberMeLocal] = useState(profile.rememberMe);
  const [completedSteps, setCompletedSteps] = useState<number[]>(getStoredSteps);
  const [ideaToolsOpen, setIdeaToolsOpen] = useState(true);
  const [videoToolsOpen, setVideoToolsOpen] = useState(true);

  const { data: videoStats, isLoading: statsLoading } = useQuery<VideoStats>({
    queryKey: ['/api/video-projects/stats'],
  });

  const handleSaveProfile = () => {
    if (tempName.trim()) {
      setName(tempName);
      setChannelName(tempChannel);
      setAvatar(selectedAvatar);
      setRememberMe(rememberMe);
      setShowSetup(false);
    }
  };

  const toggleStepComplete = (stepId: number) => {
    setCompletedSteps(prev => {
      const updated = prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId];
      storeCompletedSteps(updated);

      if (!prev.includes(stepId)) {
        toast({
          title: stepId === STEPS.length ? "Victory!" : "Step Complete!",
          description: stepId === STEPS.length ? "You finished your video!" : "Keep going!",
        });
      }

      return updated;
    });
  };

  const resetProgress = () => {
    setCompletedSteps([]);
    storeCompletedSteps([]);
    toast({ title: "Progress Reset", description: "Ready for a new video!" });
  };

  const currentStep = STEPS.find(step => !completedSteps.includes(step.id)) || STEPS[0];
  const progressPercent = (completedSteps.length / STEPS.length) * 100;
  const allComplete = completedSteps.length === STEPS.length;

  const displayName = profile.name?.trim() || "";
  const channelTag = profile.channelName?.trim() || "New Channel";

  return (
    <div className="space-y-8 pb-14">
      {/* Hero Section with Stats */}
      <Card className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[#0f1f3f] via-[#0c172c] to-[#0b1322] border-[#1a2a4a]/70 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.75)]">
        <div className="absolute inset-0 opacity-50 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,rgba(43,212,255,0.22),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(243,201,76,0.16),transparent_35%),linear-gradient(120deg,rgba(255,255,255,0.04),transparent)]" />
        <div className="relative space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-[#F3C94C] font-semibold">Gifted to Aidan</p>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                {displayName ? `Hey ${displayName}, ready to create?` : "Welcome! Let's make something awesome."}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white">{channelTag}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-zinc-200 hover:text-white" onClick={() => setShowSetup(true)}>
              <Settings className="h-4 w-4 mr-2" /> Profile
            </Button>
          </div>

          {/* Video Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <Film className="h-3.5 w-3.5" /> Videos Made
              </div>
              <div className="text-2xl font-bold text-white" data-testid="stat-videos-published">
                {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : videoStats?.published ?? 0}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <Scissors className="h-3.5 w-3.5" /> In Progress
              </div>
              <div className="text-2xl font-bold text-[#F3C94C]" data-testid="stat-videos-in-progress">
                {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (videoStats?.inProgress ?? 0) + (videoStats?.draft ?? 0)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <Sparkles className="h-3.5 w-3.5" /> Steps Done
              </div>
              <div className="text-2xl font-bold text-[#6DFF9C]" data-testid="stat-steps-done">
                {completedSteps.length}/{STEPS.length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <Trophy className="h-3.5 w-3.5" /> Progress
              </div>
              <div className="text-2xl font-bold text-[#2BD4FF]" data-testid="stat-progress">
                {progressPercent.toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Compact Horizontal Roadmap Strip */}
          <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1a2a4a]/70">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold">Road to Publish</span>
              {completedSteps.length > 0 && (
                <button
                  onClick={resetProgress}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-400 hover:text-white transition"
                  data-testid="button-reset-progress"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {STEPS.map((step, idx) => {
                const isComplete = completedSteps.includes(step.id);
                const isCurrent = step.id === currentStep.id && !allComplete;
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleStepComplete(step.id)}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2",
                        isComplete
                          ? "bg-[#6DFF9C] border-[#6DFF9C] text-[#0a1628]"
                          : isCurrent
                            ? "bg-[#0a1628] animate-pulse"
                            : "bg-[#0f1f3f] border-[#1a2a4a]/80 text-zinc-500"
                      )}
                      style={{
                        borderColor: isCurrent && !isComplete ? step.color : undefined,
                        color: isCurrent && !isComplete ? step.color : undefined,
                      }}
                      data-testid={`button-step-${step.id}`}
                      title={`${step.title} - Click to mark ${isComplete ? 'incomplete' : 'complete'}`}
                    >
                      {isComplete ? <Check className="h-4 w-4" /> : step.id}
                    </button>
                    <Link href={step.path}>
                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg transition cursor-pointer",
                          isCurrent ? "bg-white/10" : "hover:bg-white/5"
                        )}
                      >
                        <Icon className="h-4 w-4" style={{ color: step.color }} />
                        <span className={cn("text-sm font-medium", isComplete ? "text-zinc-500 line-through" : "text-white")}>
                          {step.title}
                        </span>
                      </div>
                    </Link>
                    {idx < STEPS.length - 1 && (
                      <div className="w-6 h-0.5 bg-[#1a2a4a]" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current Step CTA */}
            {!allComplete && (
              <div className="mt-4 pt-3 border-t border-[#1a2a4a]/50 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#6DFF9C] animate-pulse" />
                  <span className="text-sm text-zinc-300">
                    <span className="font-semibold text-white">Next:</span> {currentStep.title} - {currentStep.description}
                  </span>
                </div>
                <Link href={currentStep.path}>
                  <Button
                    size="sm"
                    className="gap-1 font-semibold"
                    style={{ background: currentStep.color, color: "#0a1628" }}
                    data-testid="button-go-to-step"
                  >
                    Get Started <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
            {allComplete && (
              <div className="mt-4 pt-3 border-t border-[#1a2a4a]/50 flex items-center justify-center gap-3">
                <Trophy className="h-5 w-5 text-[#6DFF9C]" />
                <span className="text-sm font-semibold text-[#6DFF9C]">Victory! All steps complete!</span>
                <button
                  onClick={resetProgress}
                  className="px-3 py-1 rounded-lg bg-[#6DFF9C]/10 text-[#6DFF9C] text-sm font-medium"
                  data-testid="button-start-new"
                >
                  Start New Video
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Creator Toolkit - Collapsible Accordions */}
      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Creator Toolkit</p>
          <h2 className="text-xl font-semibold text-white">All your tools in one place</h2>
        </div>

        {/* Idea Tools Accordion */}
        <Collapsible open={ideaToolsOpen} onOpenChange={setIdeaToolsOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between gap-3 p-4 rounded-xl bg-[#0a1525] border border-[#1a2a4a]/60 hover:border-[#2BD4FF]/30 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#2BD4FF]/10">
                  <Lightbulb className="h-5 w-5 text-[#2BD4FF]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Idea Tools</h3>
                  <p className="text-xs text-zinc-400">Brainstorm, write scripts, design thumbnails</p>
                </div>
              </div>
              <ChevronDown className={cn("h-5 w-5 text-zinc-400 transition-transform", ideaToolsOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid gap-3 mt-3 sm:grid-cols-2 lg:grid-cols-4">
              {IDEA_TOOLS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} href={item.path}>
                    <Card className="group h-full p-4 bg-[#0a1525] border-[#1a2a4a]/60 hover:border-[#2BD4FF]/30 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg shrink-0" style={{ background: `${item.color}1A`, color: item.color }}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Video Tools Accordion */}
        <Collapsible open={videoToolsOpen} onOpenChange={setVideoToolsOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between gap-3 p-4 rounded-xl bg-[#0a1525] border border-[#1a2a4a]/60 hover:border-[#6DFF9C]/30 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#6DFF9C]/10">
                  <Video className="h-5 w-5 text-[#6DFF9C]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Video Tools</h3>
                  <p className="text-xs text-zinc-400">Record, edit, share, and track</p>
                </div>
              </div>
              <ChevronDown className={cn("h-5 w-5 text-zinc-400 transition-transform", videoToolsOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid gap-3 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {VIDEO_TOOLS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} href={item.path}>
                    <Card className="group h-full p-4 bg-[#0a1525] border-[#1a2a4a]/60 hover:border-[#6DFF9C]/30 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg shrink-0" style={{ background: `${item.color}1A`, color: item.color }}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>

      {/* Player Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="bg-[#0a1525] border-[#2BD4FF]/30 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-2xl font-bold text-white font-display">
              Player Setup
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-base">
              Enter your name and pick your avatar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-1">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-semibold text-zinc-200">Your Name</Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="bg-[#122046] border-[#2BD4FF]/40 text-white placeholder:text-zinc-500 focus:border-[#2BD4FF] focus-visible:ring-[#2BD4FF]/40 h-10 text-base"
                data-testid="input-name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="channel" className="text-sm font-semibold text-zinc-200">Channel Name <span className="text-zinc-500 font-normal">(optional)</span></Label>
              <Input
                id="channel"
                value={tempChannel}
                onChange={(e) => setTempChannel(e.target.value)}
                placeholder="Enter your channel name"
                className="bg-[#122046] border-[#2BD4FF]/40 text-white placeholder:text-zinc-500 focus:border-[#2BD4FF] focus-visible:ring-[#2BD4FF]/40 h-10 text-base"
                data-testid="input-channel"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-zinc-200">Choose Your Avatar</Label>
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map((avatarName, index) => {
                  const Icon = (LucideIcons as any)[avatarName];
                  const colors = ["#2BD4FF", "#F3C94C", "#4E4DFF", "#6DFF9C", "#A259FF"];
                  const color = colors[index % colors.length];
                  const isSelected = selectedAvatar === avatarName;

                  return (
                    <button
                      key={avatarName}
                      onClick={() => setSelectedAvatar(avatarName)}
                      className={cn(
                        "aspect-square rounded-xl transition-all flex items-center justify-center border-2",
                        isSelected
                          ? "scale-105 shadow-[0_0_15px_rgba(43,212,255,0.4)]"
                          : "hover:scale-102"
                      )}
                      style={{
                        background: isSelected ? color : `${color}15`,
                        borderColor: isSelected ? color : `${color}40`,
                        color: isSelected ? "#0a1628" : color,
                      }}
                      data-testid={`button-avatar-${avatarName}`}
                    >
                      {Icon ? <Icon className="h-5 w-5 sm:h-6 sm:w-6" /> : avatarName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-0.5">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked: boolean) => setRememberMeLocal(!!checked)}
                className="border-[#2BD4FF]/50 data-[state=checked]:bg-[#2BD4FF] data-[state=checked]:border-[#2BD4FF] data-[state=checked]:text-[#0a1628] h-4 w-4"
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium text-zinc-300 cursor-pointer"
              >
                Remember Me
              </Label>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="w-full font-bold text-base h-10 mt-1 shadow-[0_0_20px_rgba(109,255,156,0.2)]"
              style={{
                background: "linear-gradient(135deg, #6DFF9C 0%, #4BCC7A 100%)",
                color: "#0a1628"
              }}
              data-testid="button-save-profile"
            >
              Let's Go!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
