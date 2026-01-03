import { useState } from "react";
import { useCreatorProfile, AVATARS } from "@/lib/creator-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, FileText, Video, Scissors, Upload, ChevronRight, Check, RotateCcw, Settings, Sparkles } from "lucide-react";

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  icon: typeof Lightbulb;
  path: string;
  gradient: string;
  iconBg: string;
}

const STEPS: RoadmapStep[] = [
  {
    id: 1,
    title: "Generate Idea",
    description: "Come up with an awesome video concept",
    icon: Lightbulb,
    path: "/ideas",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-500/20",
  },
  {
    id: 2,
    title: "Write Script",
    description: "Plan what you'll say and do",
    icon: FileText,
    path: "/script",
    gradient: "from-purple-500 to-violet-600",
    iconBg: "bg-purple-500/20",
  },
  {
    id: 3,
    title: "Record Video",
    description: "Lights, camera, action!",
    icon: Video,
    path: "/recorder",
    gradient: "from-red-500 to-rose-600",
    iconBg: "bg-red-500/20",
  },
  {
    id: 4,
    title: "Edit Video",
    description: "Add effects and make it awesome",
    icon: Scissors,
    path: "/editor",
    gradient: "from-cyan-500 to-teal-600",
    iconBg: "bg-cyan-500/20",
  },
  {
    id: 5,
    title: "Upload & Share",
    description: "Share your creation with the world!",
    icon: Upload,
    path: "/upload",
    gradient: "from-green-500 to-emerald-600",
    iconBg: "bg-green-500/20",
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
          title: "Step Complete!",
          description: stepId === STEPS.length 
            ? "Amazing! You've completed your video!" 
            : "Great job! Keep going!",
        });
      }
      
      return updated;
    });
  };

  const resetProgress = () => {
    setCompletedSteps([]);
    storeCompletedSteps([]);
    toast({
      title: "Progress Reset",
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
          <h1 className="text-3xl font-bold text-white">
            {profile.name ? `Hey ${profile.name}!` : "Welcome!"}
          </h1>
          <p className="text-zinc-400 mt-1 text-lg">
            {allComplete ? "All done! Start a new video?" : "Let's create your next video"}
          </p>
        </div>
        <button 
          onClick={() => setShowSetup(true)}
          className="p-2.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-all"
          data-testid="button-edit-profile"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-400">Your Progress</span>
          <span className="text-sm font-bold text-white">{completedSteps.length} of {STEPS.length}</span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-violet-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current Step Card */}
      {!allComplete && (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentStep.gradient} p-[1px]`}>
          <div className="relative bg-zinc-900/90 backdrop-blur rounded-2xl p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentStep.gradient}`}>
                <currentStep.icon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Next Step</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{currentStep.title}</h2>
                <p className="text-zinc-400 mt-1">{currentStep.description}</p>
              </div>
              <Link href={currentStep.path}>
                <button 
                  className={`px-6 py-3 rounded-xl bg-gradient-to-r ${currentStep.gradient} text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2`}
                  data-testid="button-go-to-step"
                >
                  Start
                  <ChevronRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* All Complete State */}
      {allComplete && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-[1px]">
          <div className="relative bg-zinc-900/90 backdrop-blur rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Video Complete!</h2>
            <p className="text-zinc-400 mb-6">Great job finishing all the steps!</p>
            <button 
              onClick={resetProgress} 
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-all inline-flex items-center gap-2"
              data-testid="button-start-new"
            >
              <RotateCcw className="h-5 w-5" />
              Start New Video
            </button>
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
          Your Roadmap
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
                    className={`absolute left-6 top-[72px] w-0.5 h-4 ${
                      isComplete ? 'bg-gradient-to-b from-purple-500 to-violet-600' : 'bg-zinc-800'
                    }`}
                  />
                )}
                
                <div 
                  className={`group relative rounded-xl transition-all ${
                    isCurrent 
                      ? 'bg-zinc-800/80 ring-2 ring-purple-500/50' 
                      : isComplete 
                        ? 'bg-zinc-800/40' 
                        : 'bg-zinc-800/60 hover:bg-zinc-800/80'
                  }`}
                  data-testid={`card-step-${step.id}`}
                >
                  <div className="p-4 flex items-center gap-4">
                    {/* Step Number/Check - Clickable */}
                    <button
                      onClick={() => toggleStepComplete(step.id)}
                      className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all hover:scale-110 ${
                        isComplete
                          ? "bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25"
                          : isCurrent
                            ? "bg-gradient-to-br from-purple-500/20 to-violet-600/20 text-purple-400 ring-2 ring-purple-500"
                            : "bg-zinc-700/50 text-zinc-400 hover:text-white"
                      }`}
                      data-testid={`button-toggle-step-${step.id}`}
                    >
                      {isComplete ? <Check className="h-6 w-6" /> : step.id}
                    </button>

                    {/* Step Icon */}
                    <div className={`p-2.5 rounded-xl ${step.iconBg}`}>
                      <Icon className={`h-5 w-5 ${isComplete ? 'text-zinc-500' : 'text-white'}`} />
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold ${isComplete ? 'text-zinc-500 line-through' : 'text-white'}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-zinc-500 truncate">{step.description}</p>
                    </div>

                    {/* Go Button */}
                    <Link href={step.path}>
                      <button 
                        className="p-2.5 rounded-xl bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-400 hover:text-white transition-all"
                        data-testid={`button-step-${step.id}`}
                      >
                        <ChevronRight className="h-5 w-5" />
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
            className="text-sm text-zinc-500 hover:text-white transition-colors inline-flex items-center gap-2"
            data-testid="button-reset-progress"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </button>
        </div>
      )}

      {/* Profile Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Set Up Your Profile</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Tell us about yourself and your channel!
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
                className="mt-2 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
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
                className="mt-2 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
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
                    className={`text-3xl p-2.5 rounded-xl transition-all ${
                      selectedAvatar === avatar
                        ? "bg-gradient-to-br from-purple-500 to-violet-600 scale-110 shadow-lg shadow-purple-500/25"
                        : "bg-zinc-800/50 hover:bg-zinc-700/50"
                    }`}
                    data-testid={`button-avatar-${avatar}`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={handleSaveProfile} 
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              data-testid="button-save-profile"
            >
              Save Profile
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
