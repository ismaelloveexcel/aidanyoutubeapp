import { useState } from "react";
import { useCreatorProfile, AVATARS } from "@/lib/creator-profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, FileText, Video, Scissors, Upload, ChevronRight, Check, RotateCcw, Settings, Trophy, Target, Sparkles } from "lucide-react";

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
  const { profile, setName, setChannelName, setAvatar, isSetup } = useCreatorProfile();
  const { toast } = useToast();
  const [showSetup, setShowSetup] = useState(!isSetup);
  const [tempName, setTempName] = useState(profile.name);
  const [tempChannel, setTempChannel] = useState(profile.channelName);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [completedSteps, setCompletedSteps] = useState<number[]>(getStoredSteps);

  const handleSaveProfile = () => {
    if (tempName.trim()) {
      setName(tempName);
      setChannelName(tempChannel);
      setAvatar(selectedAvatar);
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
    <div className="space-y-10 pb-8">
      {/* Welcome Header */}
      <div className="flex items-start justify-between gap-4 pt-2">
        <div className="space-y-2">
          <p className="text-sm text-[#2BD4FF] font-medium tracking-wide">
            {displayName ? `Made for Awesome ${displayName}` : "Made for Awesome Creators"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white leading-tight">
            {displayName ? `Hey ${displayName}!` : "Welcome, Creator!"}
          </h1>
          <p className="text-zinc-400 text-lg">
            {allComplete ? "Victory! Ready to create another masterpiece?" : "Your next viral video starts here"}
          </p>
        </div>
        <button 
          onClick={() => setShowSetup(true)}
          className="p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-[#1a2a4a] transition-colors"
          data-testid="button-edit-profile"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Overview Card */}
      <Card className="p-8 bg-[#0f1d32] border-[#1a2a4a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#F3C94C]/10">
              <Target className="h-5 w-5 text-[#F3C94C]" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Your Progress</h2>
              <p className="text-sm text-zinc-400">{completedSteps.length} of {STEPS.length} steps complete</p>
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
        <div className="h-2.5 bg-[#1a2a4a] rounded-full overflow-hidden">
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
      <div className="grid lg:grid-cols-[1fr,360px] gap-10">
        {/* Left Column - Timeline Roadmap */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest px-1 flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-[#F3C94C]" />
            Your Quest Path
          </h3>
          
          {/* Timeline Container */}
          <div className="relative pl-2">
            {/* Vertical Timeline Line */}
            <div 
              className="absolute left-7 top-10 bottom-10 w-1.5 rounded-full"
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
              className="absolute left-7 top-10 w-1.5 rounded-full bg-[#0a1628]/80 transition-all duration-500"
              style={{ 
                height: `calc(${100 - progressPercent}% - 80px)`,
                bottom: '40px'
              }}
            />

            <div className="space-y-6">
              {STEPS.map((step, index) => {
                const isComplete = completedSteps.includes(step.id);
                const isCurrent = step.id === currentStep.id && !allComplete;
                const Icon = step.icon;

                return (
                  <div 
                    key={step.id}
                    className="relative flex items-start gap-5"
                    data-testid={`timeline-step-${step.id}`}
                  >
                    {/* Timeline Node */}
                    <div className="flex-shrink-0 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleStepComplete(step.id);
                        }}
                        className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all border-4",
                          isComplete
                            ? "bg-[#6DFF9C] border-[#6DFF9C] text-[#0a1628] shadow-lg shadow-[#6DFF9C]/30"
                            : isCurrent
                              ? "bg-[#0a1628] border-current text-current shadow-lg"
                              : "bg-[#1a2a4a] border-[#1a2a4a] text-zinc-500"
                        )}
                        style={{
                          borderColor: isCurrent ? step.color : undefined,
                          color: isCurrent ? step.color : undefined,
                          boxShadow: isCurrent ? `0 0 24px ${step.color}50` : undefined
                        }}
                        data-testid={`button-toggle-step-${step.id}`}
                      >
                        {isComplete ? <Check className="h-7 w-7" /> : step.id}
                      </button>
                    </div>

                    {/* Step Content Card */}
                    <Link href={step.path} className="flex-1 pt-1">
                      <Card 
                        className={cn(
                          "p-6 transition-all border cursor-pointer group",
                          isCurrent 
                            ? "bg-gradient-to-r from-[#0f1d32] to-[#1a2a4a] border-l-4 shadow-xl" 
                            : isComplete
                              ? "bg-[#0a1628]/50 border-[#1a2a4a] opacity-60"
                              : "bg-[#0f1d32] border-[#1a2a4a] hover:border-[#2BD4FF]/30 hover:bg-[#0f1d32]/80"
                        )}
                        style={{
                          borderLeftColor: isCurrent ? step.color : undefined
                        }}
                        data-testid={`card-step-${step.id}`}
                      >
                        <div className="flex items-center gap-5">
                          {/* Step Icon */}
                          <div 
                            className={cn(
                              "flex-shrink-0 p-4 rounded-2xl transition-transform",
                              isCurrent && "scale-105"
                            )}
                            style={{ background: `${step.color}20` }}
                          >
                            <Icon className="h-7 w-7" style={{ color: step.color }} />
                          </div>

                          {/* Step Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className={cn(
                                "font-bold text-xl",
                                isComplete ? "text-zinc-500 line-through" : "text-white"
                              )}>
                                {step.title}
                              </h4>
                              {isCurrent && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F3C94C]/20 text-[#F3C94C] uppercase tracking-wide">
                                  Now
                                </span>
                              )}
                              {isComplete && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#6DFF9C]/20 text-[#6DFF9C] uppercase tracking-wide">
                                  Done
                                </span>
                              )}
                            </div>
                            <p className="text-base text-zinc-400">{step.description}</p>
                          </div>

                          {/* Arrow */}
                          <ChevronRight 
                            className={cn(
                              "flex-shrink-0 h-7 w-7 transition-transform group-hover:translate-x-1",
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
        <div className="lg:sticky lg:top-24 space-y-6">
          {!allComplete ? (
            <Card className="p-8 bg-gradient-to-br from-[#0f1d32] to-[#1a2a4a] border-[#2BD4FF]/30">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#6DFF9C]">
                  <div className="w-3 h-3 rounded-full bg-[#6DFF9C] animate-pulse" />
                  <span className="text-sm font-bold uppercase tracking-widest">Next Step</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {(() => {
                    const CurrentIcon = currentStep.icon;
                    return (
                      <div 
                        className="p-4 rounded-2xl"
                        style={{ background: `${currentStep.color}20` }}
                      >
                        <CurrentIcon className="h-8 w-8" style={{ color: currentStep.color }} />
                      </div>
                    );
                  })()}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">{currentStep.title}</h3>
                    <p className="text-base text-zinc-400">{currentStep.description}</p>
                  </div>
                </div>

                <Link href={currentStep.path}>
                  <Button 
                    className="w-full gap-2 font-bold text-lg h-14"
                    style={{ 
                      background: `linear-gradient(135deg, ${currentStep.color} 0%, ${currentStep.color}cc 100%)`,
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
            <Card className="p-8 bg-gradient-to-br from-[#6DFF9C]/20 to-[#4BCC7A]/10 border-[#6DFF9C]/30">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#6DFF9C]">
                  <Trophy className="h-10 w-10 text-[#0a1628]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Victory!</h3>
                  <p className="text-base text-zinc-400">You completed all steps!</p>
                </div>
                <button
                  onClick={resetProgress}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#6DFF9C]/50 text-[#6DFF9C] hover:bg-[#6DFF9C]/10 transition-colors font-bold"
                  data-testid="button-start-new"
                >
                  <RotateCcw className="h-5 w-5" />
                  Start New Video
                </button>
              </div>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="p-6 bg-[#0f1d32] border-[#1a2a4a]">
            <h4 className="text-base font-semibold text-zinc-300 mb-3">Quick Tip</h4>
            <p className="text-base text-zinc-400 leading-relaxed">
              Click the step numbers to mark them as complete. You can go in any order!
            </p>
          </Card>
        </div>
      </div>

      {/* Profile Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="bg-[#0f1d32] border-[#1a2a4a] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Player Setup
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter your name and pick your avatar!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-zinc-300">Your Name</Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="bg-[#0a1628] border-[#1a2a4a] text-white placeholder:text-zinc-500 focus:border-[#2BD4FF]"
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
                className="bg-[#0a1628] border-[#1a2a4a] text-white placeholder:text-zinc-500 focus:border-[#2BD4FF]"
                data-testid="input-channel"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">Choose Your Avatar</Label>
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={cn(
                      "text-2xl p-2.5 rounded-lg transition-all",
                      selectedAvatar === avatar
                        ? "bg-gradient-to-r from-[#2BD4FF] to-[#4E4DFF] scale-110 shadow-lg shadow-[#2BD4FF]/30"
                        : "bg-[#1a2a4a] hover:bg-[#2a3a5a]"
                    )}
                    data-testid={`button-avatar-${avatar}`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleSaveProfile} 
              className="w-full font-semibold"
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
