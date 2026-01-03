import { useState } from "react";
import { useCreatorProfile, AVATARS } from "@/lib/creator-profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, FileText, Video, Scissors, Upload, ChevronRight, Check, RotateCcw, Settings, Zap, Circle, Triangle, Square, Play } from "lucide-react";

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  icon: typeof Lightbulb;
  path: string;
  color: string;
  glowColor: string;
  shape: "circle" | "triangle" | "square";
}

const STEPS: RoadmapStep[] = [
  {
    id: 1,
    title: "Generate Idea",
    description: "Come up with an awesome video concept",
    icon: Lightbulb,
    path: "/ideas",
    color: "#FF2D95",
    glowColor: "rgba(255, 45, 149, 0.5)",
    shape: "circle",
  },
  {
    id: 2,
    title: "Write Script",
    description: "Plan what you'll say and do",
    icon: FileText,
    path: "/script",
    color: "#7C4DFF",
    glowColor: "rgba(124, 77, 255, 0.5)",
    shape: "triangle",
  },
  {
    id: 3,
    title: "Record Video",
    description: "Lights, camera, action!",
    icon: Video,
    path: "/recorder",
    color: "#40F5FF",
    glowColor: "rgba(64, 245, 255, 0.5)",
    shape: "square",
  },
  {
    id: 4,
    title: "Edit Video",
    description: "Add effects and make it awesome",
    icon: Scissors,
    path: "/editor",
    color: "#8BFF4A",
    glowColor: "rgba(139, 255, 74, 0.5)",
    shape: "circle",
  },
  {
    id: 5,
    title: "Upload & Share",
    description: "Share your creation with the world!",
    icon: Upload,
    path: "/upload",
    color: "#FF2D95",
    glowColor: "rgba(255, 45, 149, 0.5)",
    shape: "triangle",
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

function SquidShape({ shape, color, isComplete }: { shape: "circle" | "triangle" | "square"; color: string; isComplete: boolean }) {
  const baseClass = "transition-all duration-300";
  
  if (shape === "circle") {
    return (
      <Circle 
        className={baseClass} 
        style={{ 
          color: isComplete ? color : "rgba(255,255,255,0.3)",
          filter: isComplete ? `drop-shadow(0 0 8px ${color})` : "none"
        }} 
        strokeWidth={3}
        size={20}
      />
    );
  }
  if (shape === "triangle") {
    return (
      <Triangle 
        className={baseClass} 
        style={{ 
          color: isComplete ? color : "rgba(255,255,255,0.3)",
          filter: isComplete ? `drop-shadow(0 0 8px ${color})` : "none"
        }} 
        strokeWidth={3}
        size={20}
      />
    );
  }
  return (
    <Square 
      className={baseClass} 
      style={{ 
        color: isComplete ? color : "rgba(255,255,255,0.3)",
        filter: isComplete ? `drop-shadow(0 0 8px ${color})` : "none"
      }} 
      strokeWidth={3}
      size={20}
    />
  );
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
          title: "Level Up!",
          description: stepId === STEPS.length 
            ? "VICTORY ROYALE! Video complete!" 
            : "Nice! Keep going!",
        });
      }
      
      return updated;
    });
  };

  const resetProgress = () => {
    setCompletedSteps([]);
    storeCompletedSteps([]);
    toast({
      title: "New Game+",
      description: "Ready to start a new video project!",
    });
  };

  const currentStep = STEPS.find(step => !completedSteps.includes(step.id)) || STEPS[0];
  const progressPercent = (completedSteps.length / STEPS.length) * 100;
  const allComplete = completedSteps.length === STEPS.length;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            {profile.name ? (
              <>
                <span className="text-white">Hey </span>
                <span className="text-[#40F5FF]">{profile.name}</span>
                <span className="text-white">!</span>
              </>
            ) : (
              <span className="text-white">Welcome!</span>
            )}
          </h1>
          <p className="text-zinc-400 mt-1 text-lg">
            {allComplete ? "GG! Ready for another?" : "Let's create your next hit video"}
          </p>
        </div>
        <button 
          onClick={() => setShowSetup(true)}
          className="p-3 rounded-xl holo-card hover:neon-border-violet transition-all"
          data-testid="button-edit-profile"
        >
          <Settings className="h-5 w-5 text-[#7C4DFF]" />
        </button>
      </div>

      {/* Progress Section - Battle Pass Style */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#FF2D95]" />
            <span className="text-sm font-bold font-display uppercase tracking-wider text-zinc-400">Progress</span>
          </div>
          <div className="flex items-center gap-3">
            {STEPS.map((step) => (
              <SquidShape 
                key={step.id}
                shape={step.shape} 
                color={step.color} 
                isComplete={completedSteps.includes(step.id)} 
              />
            ))}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3 bg-[rgba(124,77,255,0.1)] rounded-full overflow-hidden neon-border-violet">
          <div 
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #FF2D95 0%, #7C4DFF 50%, #40F5FF 100%)",
              boxShadow: "0 0 20px rgba(124, 77, 255, 0.5)"
            }}
          />
          <div className="absolute inset-0 shimmer rounded-full" />
        </div>
        
        <div className="text-center">
          <span className="text-2xl font-bold font-display text-white">{completedSteps.length}</span>
          <span className="text-zinc-500"> / {STEPS.length} completed</span>
        </div>
      </div>

      {/* Current Step Card - Portal Style */}
      {!allComplete && (
        <div 
          className="relative rounded-2xl overflow-hidden group"
          style={{ 
            background: `linear-gradient(135deg, ${currentStep.color}20 0%, transparent 50%)`,
          }}
        >
          {/* Animated border */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-50"
            style={{
              background: `linear-gradient(135deg, ${currentStep.color} 0%, transparent 50%)`,
              padding: "1px",
            }}
          />
          
          <div className="relative holo-card rounded-2xl p-6 m-[1px]">
            {/* Glow effect */}
            <div 
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
              style={{ background: currentStep.color }}
            />
            
            <div className="relative flex items-center gap-5">
              {/* Icon with glow */}
              <div 
                className="relative p-4 rounded-2xl"
                style={{ 
                  background: `${currentStep.color}20`,
                  boxShadow: `0 0 30px ${currentStep.glowColor}`
                }}
              >
                <currentStep.icon 
                  className="h-8 w-8" 
                  style={{ color: currentStep.color }}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Play className="h-3 w-3 text-[#8BFF4A]" fill="#8BFF4A" />
                  <span className="text-xs font-bold font-display text-[#8BFF4A] uppercase tracking-wider">Next Mission</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-white">{currentStep.title}</h2>
                <p className="text-zinc-400 mt-1">{currentStep.description}</p>
              </div>
              
              <Link href={currentStep.path}>
                <button 
                  className="px-6 py-3 rounded-xl text-white font-bold font-display uppercase tracking-wide shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentStep.color} 0%, ${currentStep.color}99 100%)`,
                    boxShadow: `0 10px 30px ${currentStep.glowColor}`
                  }}
                  data-testid="button-go-to-step"
                >
                  Go
                  <ChevronRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* All Complete State - Victory */}
      {allComplete && (
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 portal-gradient" />
          <div className="relative holo-card rounded-2xl p-8 text-center m-[1px]">
            <div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
              style={{
                background: "linear-gradient(135deg, #8BFF4A 0%, #00E676 100%)",
                boxShadow: "0 0 40px rgba(139, 255, 74, 0.5)"
              }}
            >
              <Check className="h-12 w-12 text-black" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-bold font-display text-white mb-2">VICTORY ROYALE!</h2>
            <p className="text-zinc-400 mb-6">You completed all steps. Epic gamer moment!</p>
            <button 
              onClick={resetProgress} 
              className="px-8 py-3 rounded-xl holo-card neon-border-violet text-white font-bold font-display uppercase tracking-wide transition-all hover:glow-violet inline-flex items-center gap-2"
              data-testid="button-start-new"
            >
              <RotateCcw className="h-5 w-5" />
              New Game+
            </button>
          </div>
        </div>
      )}

      {/* Block Divider */}
      <div className="block-divider" />

      {/* Steps List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold font-display text-zinc-500 uppercase tracking-wider flex items-center gap-2">
          <span className="inline-block w-8 h-[2px] bg-gradient-to-r from-[#7C4DFF] to-transparent" />
          Your Quest Log
        </h3>
        
        <div className="space-y-3">
          {STEPS.map((step, index) => {
            const isComplete = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep.id && !allComplete;
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative">
                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div 
                    className="absolute left-6 top-[72px] w-0.5 h-4"
                    style={{
                      background: isComplete 
                        ? `linear-gradient(to bottom, ${step.color}, ${STEPS[index + 1].color})`
                        : "rgba(124, 77, 255, 0.2)"
                    }}
                  />
                )}
                
                <div 
                  className={cn(
                    "group relative rounded-xl transition-all overflow-visible",
                    isCurrent 
                      ? "holo-card" 
                      : isComplete 
                        ? "bg-[rgba(139,255,74,0.05)]" 
                        : "bg-[rgba(124,77,255,0.05)] hover:bg-[rgba(124,77,255,0.1)]"
                  )}
                  style={{
                    border: isCurrent ? `1px solid ${step.color}40` : "1px solid transparent",
                    boxShadow: isCurrent ? `0 0 20px ${step.glowColor}` : "none"
                  }}
                  data-testid={`card-step-${step.id}`}
                >
                  <div className="p-4 flex items-center gap-4">
                    {/* Step Number/Check - Squid Game Style */}
                    <button
                      onClick={() => toggleStepComplete(step.id)}
                      className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: isComplete 
                          ? `linear-gradient(135deg, ${step.color} 0%, ${step.color}99 100%)`
                          : isCurrent
                            ? `${step.color}20`
                            : "rgba(124, 77, 255, 0.1)",
                        boxShadow: isComplete 
                          ? `0 0 20px ${step.glowColor}`
                          : isCurrent 
                            ? `inset 0 0 0 2px ${step.color}`
                            : "none"
                      }}
                      data-testid={`button-toggle-step-${step.id}`}
                    >
                      {isComplete ? (
                        <Check className="h-6 w-6 text-black" strokeWidth={3} />
                      ) : (
                        <span 
                          className="text-lg font-bold font-display"
                          style={{ color: isCurrent ? step.color : "rgba(255,255,255,0.4)" }}
                        >
                          {step.id}
                        </span>
                      )}
                    </button>

                    {/* Step Icon */}
                    <div 
                      className="p-2.5 rounded-xl"
                      style={{ background: `${step.color}15` }}
                    >
                      <Icon 
                        className="h-5 w-5" 
                        style={{ 
                          color: isComplete ? "rgba(255,255,255,0.4)" : step.color,
                          filter: !isComplete && isCurrent ? `drop-shadow(0 0 6px ${step.color})` : "none"
                        }} 
                      />
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <h4 
                        className={cn(
                          "font-semibold font-display",
                          isComplete ? "text-zinc-500 line-through" : "text-white"
                        )}
                      >
                        {step.title}
                      </h4>
                      <p className="text-sm text-zinc-500 truncate">{step.description}</p>
                    </div>

                    {/* Go Button */}
                    <Link href={step.path}>
                      <button 
                        className="p-2.5 rounded-xl transition-all hover:scale-110"
                        style={{
                          background: "rgba(124, 77, 255, 0.1)",
                          border: "1px solid rgba(124, 77, 255, 0.2)"
                        }}
                        data-testid={`button-step-${step.id}`}
                      >
                        <ChevronRight 
                          className="h-5 w-5" 
                          style={{ color: isCurrent ? step.color : "rgba(255,255,255,0.4)" }}
                        />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      {completedSteps.length > 0 && !allComplete && (
        <div className="text-center pt-2">
          <button 
            onClick={resetProgress}
            className="text-sm text-zinc-500 hover:text-[#FF2D95] transition-colors inline-flex items-center gap-2 font-display"
            data-testid="button-reset-progress"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </button>
        </div>
      )}

      {/* Profile Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="holo-card border-[rgba(124,77,255,0.3)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display text-white">
              Player Setup
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter your gamer tag and pick your avatar!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-zinc-300">Your Name</Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="mt-2 bg-[rgba(124,77,255,0.1)] border-[rgba(124,77,255,0.3)] text-white placeholder:text-zinc-500 focus:border-[#FF2D95] focus:ring-[#FF2D95]"
                data-testid="input-name"
              />
            </div>
            <div>
              <Label htmlFor="channel" className="text-sm font-medium text-zinc-300">Channel Name (optional)</Label>
              <Input
                id="channel"
                value={tempChannel}
                onChange={(e) => setTempChannel(e.target.value)}
                placeholder="Enter your channel name"
                className="mt-2 bg-[rgba(124,77,255,0.1)] border-[rgba(124,77,255,0.3)] text-white placeholder:text-zinc-500 focus:border-[#FF2D95] focus:ring-[#FF2D95]"
                data-testid="input-channel"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-300">Choose Your Avatar</Label>
              <div className="grid grid-cols-6 gap-2 mt-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={cn(
                      "text-3xl p-2.5 rounded-xl transition-all",
                      selectedAvatar === avatar
                        ? "scale-110"
                        : "bg-[rgba(124,77,255,0.1)] hover:bg-[rgba(124,77,255,0.2)]"
                    )}
                    style={{
                      background: selectedAvatar === avatar 
                        ? "linear-gradient(135deg, #FF2D95 0%, #7C4DFF 100%)"
                        : undefined,
                      boxShadow: selectedAvatar === avatar 
                        ? "0 0 20px rgba(255, 45, 149, 0.5)"
                        : undefined
                    }}
                    data-testid={`button-avatar-${avatar}`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={handleSaveProfile} 
              className="w-full py-3 rounded-xl text-white font-bold font-display uppercase tracking-wide transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #FF2D95 0%, #7C4DFF 100%)",
                boxShadow: "0 10px 30px rgba(255, 45, 149, 0.3)"
              }}
              data-testid="button-save-profile"
            >
              Let's Go!
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
