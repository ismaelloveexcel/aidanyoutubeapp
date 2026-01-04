import { useState } from "react";
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
  Lightbulb, FileText, Video, Scissors, Upload, 
  ChevronRight, Check, RotateCcw, Settings, Trophy, 
  Target, Sparkles 
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

  // Get display name - use profile name or fallback
  const displayName = profile.name?.trim() || "";

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* Welcome Header */}
      <div className="flex items-start justify-between gap-6 pt-2">
        <div className="flex items-center gap-4">
          <div className="p-2 relative">
            {(() => {
              const ProfileIcon = (LucideIcons as any)[profile.avatar];
              return (
                <div className="p-3 rounded-xl bg-[#2BD4FF]/10 text-[#2BD4FF] border border-[#2BD4FF]/20">
                  {ProfileIcon ? <ProfileIcon className="h-10 w-10" /> : <Sparkles className="h-10 w-10" />}
                </div>
              );
            })()}
          </div>
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-[#2BD4FF] font-medium tracking-wide">
              {displayName ? `Made for Awesome ${displayName}` : "Made for Awesome Creators"}
            </p>
            <h1 className="text-2xl sm:text-4xl font-bold font-display text-white leading-tight">
              {displayName ? `Hey ${displayName}!` : "Welcome, Creator!"}
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg">
              {allComplete ? "Victory! Ready to create another masterpiece?" : "Your next viral video starts here"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowSetup(true)}
          className="p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-[#1a2a4a]/60 transition-colors"
          data-testid="button-edit-profile"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Overview Card */}
      <Card className="p-6 sm:p-8 bg-[#0a1525] border-[#1a2a4a]/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-[#F3C94C]/10">
              <Target className="h-5 w-5 text-[#F3C94C]" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Your Progress</h2>
              <p className="text-sm text-zinc-400 mt-0.5">{completedSteps.length} of {STEPS.length} steps complete</p>
            </div>
          </div>
          {completedSteps.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetProgress}
              className="text-zinc-400 hover:text-white gap-2"
              data-testid="button-reset-progress"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-[#1a2a4a]/60 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #2BD4FF 0%, #4E4DFF 50%, #6DFF9C 100%)"
            }}
          />
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[1fr,340px] gap-10 lg:gap-14">
        {/* Left Column - Timeline Roadmap */}
        <div className="space-y-8">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest px-1 flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-[#F3C94C]" />
            Your Quest Path
          </h3>
          
          {/* Timeline Container */}
          <div className="relative pl-1 sm:pl-2">
            {/* Vertical Timeline Line */}
            <div 
              className="absolute left-5 sm:left-7 top-10 bottom-10 w-1 sm:w-1.5 rounded-full"
              style={{ 
                background: `linear-gradient(180deg, 
                  ${STEPS[0].color} 0%, 
                  ${STEPS[1].color} 25%, 
                  ${STEPS[2].color} 50%, 
                  ${STEPS[3].color} 75%, 
                  ${STEPS[4].color} 100%)`
              }}
            />
            
            {/* Progress overlay on timeline */}
            <div 
              className="absolute left-5 sm:left-7 top-10 w-1 sm:w-1.5 rounded-full bg-[#0a1628]/80 transition-all duration-500"
              style={{ 
                height: `calc(${100 - progressPercent}% - 80px)`,
                bottom: '40px'
              }}
            />

            <div className="space-y-5 sm:space-y-4">
              {STEPS.map((step, index) => {
                const isComplete = completedSteps.includes(step.id);
                const isCurrent = step.id === currentStep.id && !allComplete;
                const Icon = step.icon;

                return (
                  <div 
                    key={step.id}
                    className="relative flex items-start gap-5 sm:gap-6"
                    data-testid={`timeline-step-${step.id}`}
                  >
                    {/* Timeline Node */}
                    <div className="shrink-0 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleStepComplete(step.id);
                        }}
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl transition-all border-2",
                          isComplete
                            ? "bg-[#6DFF9C] border-[#6DFF9C] text-[#0a1628]"
                            : isCurrent
                              ? "bg-[#0a1628] border-current text-current"
                              : "bg-[#1a2a4a]/60 border-[#1a2a4a]/60 text-zinc-500"
                        )}
                        style={{
                          borderColor: isCurrent ? step.color : undefined,
                          color: isCurrent ? step.color : undefined,
                          boxShadow: isCurrent ? `0 0 16px ${step.color}30` : undefined
                        }}
                        data-testid={`button-toggle-step-${step.id}`}
                      >
                        {isComplete ? <Check className="h-5 w-5 sm:h-7 sm:w-7" /> : step.id}
                      </button>
                    </div>

                    {/* Step Content Card */}
                    <Link href={step.path} className="flex-1">
                      <Card 
                        className={cn(
                          "p-5 sm:p-6 transition-all border cursor-pointer group",
                          isCurrent 
                            ? "bg-[#0a1525] border-l-4" 
                            : isComplete
                              ? "bg-[#0a1525]/40 border-[#1a2a4a]/40 opacity-70"
                              : "bg-[#0a1525] border-[#1a2a4a]/60 hover:border-[#2BD4FF]/20"
                        )}
                        style={{
                          borderLeftColor: isCurrent ? step.color : undefined
                        }}
                        data-testid={`card-step-${step.id}`}
                      >
                        <div className="flex items-center gap-4 sm:gap-5">
                          {/* Step Icon */}
                          <div 
                            className="shrink-0 p-3 sm:p-3.5 rounded-xl transition-transform"
                            style={{ background: `${step.color}15` }}
                          >
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: step.color }} />
                          </div>

                          {/* Step Info */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className={cn(
                                "font-bold text-base sm:text-lg",
                                isComplete ? "text-zinc-500 line-through" : "text-white"
                              )}>
                                {step.title}
                              </h4>
                              {isCurrent && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-[#F3C94C]/15 text-[#F3C94C] uppercase tracking-wide">
                                  Now
                                </span>
                              )}
                              {isComplete && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-[#6DFF9C]/15 text-[#6DFF9C] uppercase tracking-wide">
                                  Done
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-zinc-400">{step.description}</p>
                          </div>

                          {/* Arrow */}
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
          </div>
        </div>

        {/* Right Column - Current Mission / Victory */}
        <div className="lg:sticky lg:top-24 space-y-8">
          {!allComplete ? (
            <Card className="p-8 bg-[#0a1525] border-[#1a2a4a]/60">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#6DFF9C]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6DFF9C] animate-pulse" />
                  <span className="text-sm font-semibold uppercase tracking-widest">Next Step</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {(() => {
                    const CurrentIcon = currentStep.icon;
                    return (
                      <div 
                        className="p-4 rounded-2xl"
                        style={{ background: `${currentStep.color}20` }}
                      >
                        <CurrentIcon className="h-7 w-7" style={{ color: currentStep.color }} />
                      </div>
                    );
                  })()}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
                    <p className="text-sm text-zinc-400">{currentStep.description}</p>
                  </div>
                </div>

                <Link href={currentStep.path}>
                  <Button 
                    className="w-full gap-2 font-semibold text-base h-12"
                    style={{ 
                      background: currentStep.color,
                      color: "#0a1628"
                    }}
                    data-testid="button-go-to-step"
                  >
                    Get Started
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="p-8 bg-[#0a1525] border-[#6DFF9C]/20">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6DFF9C]">
                  <Trophy className="h-8 w-8 text-[#0a1628]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Victory!</h3>
                  <p className="text-sm text-zinc-400">You completed all steps!</p>
                </div>
                <button
                  onClick={resetProgress}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#6DFF9C]/30 text-[#6DFF9C] hover:bg-[#6DFF9C]/10 transition-colors font-semibold text-sm"
                  data-testid="button-start-new"
                >
                  <RotateCcw className="h-4 w-4" />
                  Start New Video
                </button>
              </div>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="p-6 bg-[#0a1525] border-[#1a2a4a]/60">
            <h4 className="text-sm font-semibold text-zinc-300 mb-2">Quick Tip</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Click the step numbers to mark them as complete. You can go in any order!
            </p>
          </Card>
        </div>
      </div>

      {/* Profile Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="bg-[#0a1525] border-[#1a2a4a]/60 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Player Setup
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter your name and pick your avatar!
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
                className="bg-[#0a1525] border-[#1a2a4a]/60 text-white placeholder:text-zinc-500 focus:border-[#2BD4FF]/60"
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
                  // Assign colors from the Aurora Nexus palette
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
