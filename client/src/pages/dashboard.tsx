import { useState, useEffect } from "react";
import { useCreatorProfile, AVATARS } from "@/lib/creator-profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  Check,
  RotateCcw,
  Settings,
  Trophy,
  Target,
  Sparkles,
  Palette,
  Megaphone,
  Brain,
  PlaySquare,
  CalendarClock,
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

const TOOLKIT_ITEMS = [
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
  {
    title: "Analytics & Pulse",
    description: "Track what’s resonating and where to improve next upload.",
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

export default function Dashboard() {
  const { profile, setName, setChannelName, setAvatar, setRememberMe, isSetup } = useCreatorProfile();
  const { toast } = useToast();
  const [showSetup, setShowSetup] = useState(!isSetup || !profile.rememberMe);
  const [showTour, setShowTour] = useState(false);
  const [firstVisit, setFirstVisit] = useState(() => {
    return !localStorage.getItem("aidan-onboarded");
  });
  useEffect(() => {
    if (firstVisit) {
      setShowTour(true);
      localStorage.setItem("aidan-onboarded", "true");
    }
  }, [firstVisit]);
  const [tempName, setTempName] = useState(profile.name);
  const [tempChannel, setTempChannel] = useState(profile.channelName);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [rememberMe, setRememberMeLocal] = useState(profile.rememberMe);
  const [completedSteps, setCompletedSteps] = useState<number[]>(getStoredSteps);

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
    <div className="space-y-10 sm:space-y-12 pb-14">
      <Dialog open={showTour} onOpenChange={setShowTour}>
        <DialogContent className="bg-[#0a1525] border-[#1a2a4a]/60 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Feature tour</DialogTitle>
            <DialogDescription className="text-zinc-400">
              A calm walkthrough so every tool feels easy to find.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4 text-sm text-zinc-300">
            <div className="p-3 rounded-lg bg-[#2BD4FF]/10 border border-[#2BD4FF]/20">
              <strong className="text-[#2BD4FF]">Ideas & Script</strong> — start with hooks, outlines, and friendly prompts.
            </div>
            <div className="p-3 rounded-lg bg-[#6DFF9C]/10 border border-[#6DFF9C]/15">
              <strong className="text-[#6DFF9C]">Record & Edit</strong> — capture, trim, and tighten pacing without fuss.
            </div>
            <div className="p-3 rounded-lg bg-[#F3C94C]/10 border border-[#F3C94C]/20">
              <strong className="text-[#F3C94C]">Thumbnail & Upload</strong> — polish the look, then share to YouTube.
            </div>
            <div className="p-3 rounded-lg bg-[#4E4DFF]/10 border border-[#4E4DFF]/20">
              <strong className="text-[#4E4DFF]">AI Wingman</strong> — ask for tips, captions, or fixes while you build.
            </div>
          </div>
          <Button className="w-full mt-6" onClick={() => setShowTour(false)} aria-label="Close Tour">
            Let's create!
          </Button>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr] items-stretch">
        <Card className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[#0f1f3f] via-[#0c172c] to-[#0b1322] border-[#1a2a4a]/70">
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(43,212,255,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(243,201,76,0.18),transparent_35%)]" />
          <div className="relative space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Gifted to Aidan • Future YouTube Star</p>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                  {displayName ? `Hey ${displayName}, let's design your next hit!` : "Welcome, let's build your next hit!"}
                </h1>
                <p className="text-zinc-300 text-sm sm:text-base max-w-2xl">
                  This workspace keeps the journey calm: clear steps, bright highlights, and quick shortcuts so no feature gets lost.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white">{channelTag}</span>
                  <span className="px-3 py-1 rounded-full bg-[#2BD4FF]/10 border border-[#2BD4FF]/30 text-xs font-semibold text-[#2BD4FF]">{completedSteps.length} / {STEPS.length} steps</span>
                  <span className="px-3 py-1 rounded-full bg-[#F3C94C]/10 border border-[#F3C94C]/25 text-xs font-semibold text-[#F3C94C]">Feature tour ready</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-zinc-200 border-white/15" onClick={() => setShowTour(true)}>
                  <Sparkles className="h-4 w-4 mr-2" /> Feature tour
                </Button>
                <Button variant="ghost" size="sm" className="text-zinc-200 hover:text-white" onClick={() => setShowSetup(true)}>
                  <Settings className="h-4 w-4 mr-2" /> Personalize
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 items-stretch">
              <div className="sm:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-sm text-zinc-300">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Target className="h-4 w-4 text-[#6DFF9C]" /> Production progress
                  </div>
                  <span className="text-xs text-zinc-400">{progressPercent.toFixed(0)}% complete</span>
                </div>
                <div className="mt-3 h-2.5 bg-[#0c1322] rounded-full overflow-hidden border border-[#1a2a4a]/70">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${progressPercent}%`,
                      background: "linear-gradient(90deg, #2BD4FF 0%, #6DFF9C 50%, #F3C94C 100%)"
                    }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-300">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2BD4FF]/10 border border-[#2BD4FF]/20 text-[#2BD4FF]">
                    <Sparkles className="h-3.5 w-3.5" /> Current: {currentStep.title}
                  </span>
                  {completedSteps.length > 0 && (
                    <button
                      onClick={resetProgress}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
                      data-testid="button-reset-progress"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset progress
                    </button>
                  )}
                </div>
              </div>

              <Card className="relative p-4 bg-[#0f1f3f]/70 border-white/10 h-full overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#2BD4FF]/10" />
                <div className="relative space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Next focus</p>
                  <h3 className="text-lg font-semibold text-white">{currentStep.title}</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">{currentStep.description}</p>
                  <Link href={currentStep.path}>
                    <Button
                      className="mt-3 w-full gap-2 font-semibold text-sm h-11"
                      style={{
                        background: currentStep.color,
                        color: "#0a1628"
                      }}
                      data-testid="button-go-to-step"
                    >
                      Resume step
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#0a1525] border-[#1a2a4a]/60 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[#2BD4FF]/10 text-[#2BD4FF]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Session overview</p>
              <h2 className="text-lg font-semibold text-white">What to explore next</h2>
            </div>
          </div>
          <div className="space-y-3 text-sm text-zinc-300">
            <p className="leading-relaxed">A tidy hub keeps all your creator tools in reach. Jump back into the roadmap, or skim a feature tour before diving in.</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">Roadmap ready</span>
              <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">AI help on call</span>
              <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">Templates stocked</span>
              <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">Uploads guided</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/roadmap">
                <Button variant="secondary" size="sm" className="bg-[#2BD4FF]/10 text-[#2BD4FF] border border-[#2BD4FF]/30">
                  <ChevronRight className="h-4 w-4 mr-1" /> View roadmap
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="border-white/10 text-zinc-200" onClick={() => setShowTour(true)}>
                Take tour
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Creator toolkit</p>
            <h2 className="text-xl font-semibold text-white">Every feature, neatly organized</h2>
            <p className="text-sm text-zinc-400">Follow the icons to jump directly into the tool you need.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-zinc-200" onClick={() => setShowTour(true)}>
              <Sparkles className="h-4 w-4 mr-2" /> Show me around
            </Button>
            <Button variant="outline" size="sm" className="border-white/10 text-zinc-200" onClick={() => setShowSetup(true)}>
              <Settings className="h-4 w-4 mr-2" /> Update profile
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLKIT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.path}>
                <Card className="group relative h-full p-4 sm:p-5 bg-[#0a1525] border-[#1a2a4a]/60 hover:border-[#2BD4FF]/30 transition-all">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition rounded-xl bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                  <div className="relative flex items-start gap-4">
                    <div className="p-3 rounded-xl" style={{ background: `${item.color}1A`, color: item.color }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-white">{item.title}</h3>
                        <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-zinc-300 uppercase tracking-wide">{item.label}</span>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#2BD4FF] group-hover:translate-x-1 transition">
                        Open tool <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Production timeline</p>
            <h3 className="text-xl font-semibold text-white">Road to publish</h3>
            <p className="text-sm text-zinc-400">{completedSteps.length} of {STEPS.length} steps complete. Tap a number to toggle done.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Current: {currentStep.title}</span>
            {completedSteps.length > 0 && (
              <Button variant="outline" size="sm" className="border-white/10 text-zinc-200" onClick={resetProgress} data-testid="button-reset-progress">
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
            )}
          </div>
        </div>

        <div className="h-2 bg-[#0c1322] rounded-full overflow-hidden border border-[#1a2a4a]/70">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #2BD4FF 0%, #6DFF9C 50%, #F3C94C 100%)"
            }}
          />
        </div>

        <div className="grid lg:grid-cols-[1fr,320px] gap-8 lg:gap-12">
          <div className="space-y-6">
            {STEPS.map((step) => {
              const isComplete = completedSteps.includes(step.id);
              const isCurrent = step.id === currentStep.id && !allComplete;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-start gap-4" data-testid={`timeline-step-${step.id}`}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleStepComplete(step.id);
                    }}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all border-2",
                      isComplete
                        ? "bg-[#6DFF9C] border-[#6DFF9C] text-[#0a1628]"
                        : isCurrent
                          ? "bg-[#0a1628] border-current text-current"
                          : "bg-[#0f1f3f] border-[#1a2a4a]/80 text-zinc-500"
                    )}
                    style={{
                      borderColor: isCurrent ? step.color : undefined,
                      color: isCurrent ? step.color : undefined,
                      boxShadow: isCurrent ? `0 0 14px ${step.color}30` : undefined
                    }}
                    data-testid={`button-toggle-step-${step.id}`}
                  >
                    {isComplete ? <Check className="h-6 w-6" /> : step.id}
                  </button>

                  <Link href={step.path} className="flex-1">
                    <Card
                      className={cn(
                        "p-5 transition-all border cursor-pointer group",
                        isCurrent
                          ? "bg-[#0a1525] border-l-4"
                          : isComplete
                            ? "bg-[#0a1525]/50 border-[#1a2a4a]/40 opacity-80"
                            : "bg-[#0a1525] border-[#1a2a4a]/60 hover:border-[#2BD4FF]/20"
                      )}
                      style={{
                        borderLeftColor: isCurrent ? step.color : undefined
                      }}
                      data-testid={`card-step-${step.id}`}
                    >
                      <div className="flex items-center gap-4 sm:gap-5">
                        <div
                          className="shrink-0 p-3 rounded-xl"
                          style={{ background: `${step.color}15` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: step.color }} />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className={cn(
                              "font-bold text-base sm:text-lg",
                              isComplete ? "text-zinc-500 line-through" : "text-white"
                            )}>
                              {step.title}
                            </h4>
                            {isCurrent && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3C94C]/15 text-[#F3C94C] uppercase tracking-wide">
                                In progress
                              </span>
                            )}
                            {isComplete && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#6DFF9C]/15 text-[#6DFF9C] uppercase tracking-wide">
                                Done
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400">{step.description}</p>
                        </div>

                        <ChevronRight
                          className={cn(
                            "shrink-0 h-5 w-5 transition-transform group-hover:translate-x-1",
                            isCurrent ? "text-white" : "text-zinc-500"
                          )}
                        />
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            {!allComplete ? (
              <Card className="p-6 bg-[#0a1525] border-[#1a2a4a]/60">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#6DFF9C]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#6DFF9C] animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">Next step</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {(() => {
                      const CurrentIcon = currentStep.icon;
                      return (
                        <div
                          className="p-3 rounded-xl"
                          style={{ background: `${currentStep.color}20` }}
                        >
                          <CurrentIcon className="h-6 w-6" style={{ color: currentStep.color }} />
                        </div>
                      );
                    })()}
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
                      <p className="text-sm text-zinc-400">{currentStep.description}</p>
                    </div>
                  </div>

                  <Link href={currentStep.path}>
                    <Button
                      className="w-full gap-2 font-semibold text-base h-11"
                      style={{
                        background: currentStep.color,
                        color: "#0a1628"
                      }}
                      data-testid="button-go-to-step"
                    >
                      Get started
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-[#0a1525] border-[#6DFF9C]/20">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#6DFF9C]">
                    <Trophy className="h-7 w-7 text-[#0a1628]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">Victory!</h3>
                    <p className="text-sm text-zinc-400">You completed all steps.</p>
                  </div>
                  <button
                    onClick={resetProgress}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#6DFF9C]/30 text-[#6DFF9C] hover:bg-[#6DFF9C]/10 transition-colors font-semibold text-sm"
                    data-testid="button-start-new"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Start new video
                  </button>
                </div>
              </Card>
            )}

            <Card className="p-5 bg-[#0a1525] border-[#1a2a4a]/60">
              <h4 className="text-sm font-semibold text-zinc-300 mb-2">Quick tip ✨</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Click the step numbers to mark them as complete, and jump straight into any tool from the creator toolkit above.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="bg-[#0a1525] border-[#1a2a4a]/60 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Player Setup
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter your name and pick your avatar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-zinc-300">Your Name</Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="bg-[#0a1525] border-[#1a2a4a]/60 text-white placeholder:text-zinc-500 focus:border-[#2BD4FF]/60 focus-visible:ring-[#2BD4FF]/30"
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel" className="text-sm font-medium text-zinc-300">Channel Name (optional)</Label>
              <Input
                id="channel"
                value={tempChannel}
                onChange={(e) => setTempChannel(e.target.value)}
                placeholder="Enter your channel name"
                className="bg-[#0a1525] border-[#1a2a4a]/60 text-white placeholder:text-zinc-500 focus:border-[#2BD4FF]/60"
                data-testid="input-channel"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-zinc-300">Choose Your Avatar</Label>
              <div className="grid grid-cols-5 gap-2.5">
                {AVATARS.map((avatarName, index) => {
                  const Icon = (LucideIcons as any)[avatarName];
                  const colors = ["#2BD4FF", "#F3C94C", "#4E4DFF", "#6DFF9C", "#2BD4FF"];
                  const color = colors[index % colors.length];

                  return (
                    <button
                      key={avatarName}
                      onClick={() => setSelectedAvatar(avatarName)}
                      className={cn(
                        "p-2.5 rounded-lg transition-all flex items-center justify-center border",
                        selectedAvatar === avatarName
                          ? "bg-[#2BD4FF] text-[#0a1628] scale-105 border-[#2BD4FF] shadow-[0_0_15px_rgba(43,212,255,0.4)]"
                          : "bg-[#1a2a4a]/40 border-[#1a2a4a]/60 text-zinc-400 hover:bg-[#1a2a4a] hover:text-white"
                      )}
                      style={{
                        color: selectedAvatar === avatarName ? "#0a1628" : color,
                        borderColor: selectedAvatar === avatarName ? "#2BD4FF" : `${color}40`
                      }}
                      data-testid={`button-avatar-${avatarName}`}
                    >
                      {Icon ? <Icon className="h-6 w-6" /> : avatarName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked: boolean) => setRememberMeLocal(!!checked)}
                className="border-[#1a2a4a] data-[state=checked]:bg-[#2BD4FF] data-[state=checked]:text-[#0a1628]"
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium text-zinc-400 cursor-pointer"
              >
                Remember Me
              </Label>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="w-full font-semibold mt-2"
              style={{
                background: "#6DFF9C",
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
