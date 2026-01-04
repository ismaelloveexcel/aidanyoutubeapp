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
  ChevronDown,
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
import { motion, AnimatePresence } from "framer-motion";

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
  { id: 2, title: "Write Script", description: "Plan what you'll say", icon: FileText, path: "/script", color: "#4E4DFF" },
  { id: 3, title: "Record Video", description: "Lights, camera, action!", icon: Video, path: "/recorder", color: "#6DFF9C" },
  { id: 4, title: "Edit Video", description: "Add effects and polish", icon: Scissors, path: "/editor", color: "#F3C94C" },
  { id: 5, title: "Upload & Share", description: "Share with the world!", icon: Upload, path: "/upload", color: "#2BD4FF" },
];

const TOOLKIT_SECTIONS = [
  {
    title: "Create",
    items: [
      { title: "Ideas Lab", path: "/ideas", icon: Lightbulb, color: "#2BD4FF" },
      { title: "Script Studio", path: "/script", icon: FileText, color: "#4E4DFF" },
      { title: "Thumbnails", path: "/thumbnail", icon: Palette, color: "#A259FF" },
    ]
  },
  {
    title: "Produce",
    items: [
      { title: "Record", path: "/recorder", icon: Video, color: "#6DFF9C" },
      { title: "Edit", path: "/editor", icon: Scissors, color: "#F3C94C" },
      { title: "AI Help", path: "/ai-assistant", icon: Brain, color: "#6DFF9C" },
    ]
  },
  {
    title: "Share",
    items: [
      { title: "Analytics", path: "/analytics", icon: PlaySquare, color: "#2BD4FF" },
      { title: "Multi-Platform", path: "/multi-platform", icon: Megaphone, color: "#F3C94C" },
      { title: "Calendar", path: "/calendar", icon: CalendarClock, color: "#4E4DFF" },
    ]
  }
];

const ONBOARDING_STEPS = [
  {
    title: "Welcome to TubeStar!",
    description: "Your all-in-one studio to become a YouTuber.",
    color: "#2BD4FF",
    highlights: ["Templates & music", "Easy editing tools", "AI-powered help"]
  },
  {
    title: "Your Creator Journey",
    description: "Follow the 5-step roadmap to publish your first video.",
    color: "#6DFF9C",
    highlights: ["Idea to upload", "Track progress", "Guided mode"]
  },
  {
    title: "Ready to Create!",
    description: "Dream big. Create boldly. Shine online.",
    color: "#F3C94C",
    highlights: ["Start with ideas", "Record anytime", "Share everywhere"]
  }
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
  const { profile, setName, setChannelName, setAvatar, setRememberMe } = useCreatorProfile();
  const { toast } = useToast();
  const [showSetup, setShowSetup] = useState(() => !localStorage.getItem('tubestar-profile'));
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("tubestar-onboarded"));
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>("Create");
  
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

  const handleOnboardingNext = () => {
    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      localStorage.setItem("tubestar-onboarded", "true");
      setShowOnboarding(false);
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
          description: stepId === STEPS.length ? "You finished!" : "Keep going!",
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
  const currentOnboarding = ONBOARDING_STEPS[onboardingStep];

  return (
    <div className="space-y-6 pb-10">
      {/* Unified Onboarding Stepper */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="bg-[#0a1525] border-[#2BD4FF]/30 max-w-sm" style={{ maxHeight: '70vh' }}>
          <DialogHeader className="text-center">
            <div className="flex justify-center gap-2 mb-3">
              {ONBOARDING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    i === onboardingStep ? "bg-[#2BD4FF] scale-125" : i < onboardingStep ? "bg-[#6DFF9C]" : "bg-zinc-600"
                  )}
                />
              ))}
            </div>
            <DialogTitle className="text-xl font-bold text-white font-display" style={{ color: currentOnboarding.color }}>
              {currentOnboarding.title}
            </DialogTitle>
            <DialogDescription className="text-zinc-300 text-sm">
              {currentOnboarding.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-3">
            {currentOnboarding.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                style={{ background: `${currentOnboarding.color}15`, color: currentOnboarding.color }}
              >
                <Check className="h-4 w-4" />
                {h}
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-4 font-semibold"
            style={{ background: currentOnboarding.color, color: "#0a1628" }}
            onClick={handleOnboardingNext}
            data-testid="button-onboarding-next"
          >
            {onboardingStep < ONBOARDING_STEPS.length - 1 ? "Next" : "Let's Go!"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Hero Section - Compact */}
      <Card className="relative overflow-hidden p-5 bg-gradient-to-br from-[#0f1f3f] via-[#0c172c] to-[#0b1322] border-[#1a2a4a]/70">
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,rgba(43,212,255,0.2),transparent_40%)]" />
        <div className="relative space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-[#F3C94C] font-semibold">Gifted to Aidan</p>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {displayName ? `Hey ${displayName}!` : "Welcome!"}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white">{channelTag}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#2BD4FF]/15 text-[#2BD4FF]">{completedSteps.length}/{STEPS.length} steps</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-zinc-300" onClick={() => setShowSetup(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-[#6DFF9C]" />
                {currentStep.title}
              </span>
              <span>{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-[#0c1322] rounded-full overflow-hidden border border-[#1a2a4a]/60">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #2BD4FF, #6DFF9C, #F3C94C)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Quick Action */}
          <Link href={currentStep.path}>
            <Button
              className="w-full gap-2 font-semibold h-10"
              style={{ background: currentStep.color, color: "#0a1628" }}
              data-testid="button-go-to-step"
            >
              {allComplete ? "Start New Video" : `Continue: ${currentStep.title}`}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Roadmap - Compact Horizontal */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Your Roadmap</h2>
          {completedSteps.length > 0 && (
            <button onClick={resetProgress} className="text-xs text-zinc-400 flex items-center gap-1" data-testid="button-reset-progress">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {STEPS.map((step, index) => {
            const isComplete = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep.id && !allComplete;
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex-shrink-0 w-28 p-3 rounded-xl border cursor-pointer transition-all relative",
                  isCurrent ? "bg-[#0a1525] border-l-2" : isComplete ? "bg-[#0a1525]/50 opacity-70" : "bg-[#0a1525] border-[#1a2a4a]/50"
                )}
                style={{ borderLeftColor: isCurrent ? step.color : undefined }}
                data-testid={`card-step-${step.id}`}
              >
                {/* Step number badge - click to mark complete */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStepComplete(step.id); }}
                  className={cn(
                    "absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border-2",
                    isComplete ? "bg-[#6DFF9C] border-[#6DFF9C] text-[#0a1628]" : "bg-[#0a1525] border-[#1a2a4a] text-zinc-400"
                  )}
                  data-testid={`button-complete-step-${step.id}`}
                  title={isComplete ? "Mark incomplete" : "Mark complete"}
                >
                  {isComplete ? <Check className="h-3 w-3" /> : index + 1}
                </button>
                <Link href={step.path} className="block">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg" style={{ background: `${step.color}20` }}>
                      <Icon className="h-3.5 w-3.5" style={{ color: step.color }} />
                    </div>
                    {isCurrent && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-[#F3C94C]" />}
                  </div>
                  <p className={cn("text-xs font-medium truncate", isComplete ? "text-zinc-500 line-through" : "text-white")}>
                    {step.title}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Toolkit - Collapsible Sections */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-white">Creator Toolkit</h2>
        <div className="space-y-2">
          {TOOLKIT_SECTIONS.map((section) => (
            <div key={section.title} className="rounded-xl border border-[#1a2a4a]/50 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === section.title ? null : section.title)}
                className="w-full flex items-center justify-between p-3 bg-[#0a1525] text-left"
                data-testid={`button-toggle-${section.title.toLowerCase()}`}
              >
                <span className="text-sm font-medium text-white">{section.title}</span>
                <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform", expandedSection === section.title && "rotate-180")} />
              </button>
              <AnimatePresence>
                {expandedSection === section.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2 p-2 bg-[#0c1322]">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.title} href={item.path}>
                            <motion.div
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-[#0a1525] border border-[#1a2a4a]/40 cursor-pointer"
                              data-testid={`link-tool-${item.title.toLowerCase().replace(/\s/g, '-')}`}
                            >
                              <div className="p-2 rounded-lg" style={{ background: `${item.color}20` }}>
                                <Icon className="h-4 w-4" style={{ color: item.color }} />
                              </div>
                              <span className="text-xs text-zinc-300 text-center">{item.title}</span>
                            </motion.div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Victory Card */}
      {allComplete && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-[#6DFF9C]/20 to-[#2BD4FF]/20 border border-[#6DFF9C]/30 text-center"
        >
          <Trophy className="h-8 w-8 text-[#F3C94C] mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white">Victory!</h3>
          <p className="text-sm text-zinc-300 mb-3">You completed all steps!</p>
          <Button variant="outline" size="sm" onClick={resetProgress} className="border-[#6DFF9C]/30 text-[#6DFF9C]">
            <RotateCcw className="h-4 w-4 mr-2" /> New Video
          </Button>
        </motion.div>
      )}

      {/* Player Setup Modal */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="bg-[#0a1525] border-[#2BD4FF]/30 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-bold text-white font-display">Player Setup</DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm">Enter your name and pick your avatar</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-1">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-semibold text-zinc-200">Your Name</Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="bg-[#122046] border-[#2BD4FF]/40 text-white h-10"
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
                className="bg-[#122046] border-[#2BD4FF]/40 text-white h-10"
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
                        isSelected ? "scale-105 shadow-[0_0_12px_rgba(43,212,255,0.4)]" : ""
                      )}
                      style={{
                        background: isSelected ? color : `${color}15`,
                        borderColor: isSelected ? color : `${color}40`,
                        color: isSelected ? "#0a1628" : color,
                      }}
                      data-testid={`button-avatar-${avatarName}`}
                    >
                      {Icon ? <Icon className="h-5 w-5" /> : avatarName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked: boolean) => setRememberMeLocal(!!checked)}
                className="border-[#2BD4FF]/50 data-[state=checked]:bg-[#2BD4FF] h-4 w-4"
              />
              <Label htmlFor="remember" className="text-sm text-zinc-300 cursor-pointer">Remember Me</Label>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="w-full font-bold h-10"
              style={{ background: "linear-gradient(135deg, #6DFF9C, #4BCC7A)", color: "#0a1628" }}
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
