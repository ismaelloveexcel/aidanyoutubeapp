import { useState } from "react";
import { useCreatorProfile, AVATARS } from "@/lib/creator-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, FileText, Video, Scissors, Upload, ChevronRight, Check, RotateCcw, Settings } from "lucide-react";

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  icon: typeof Lightbulb;
  path: string;
  color: string;
  bgColor: string;
}

const STEPS: RoadmapStep[] = [
  {
    id: 1,
    title: "Generate Idea",
    description: "Come up with an awesome video concept",
    icon: Lightbulb,
    path: "/ideas",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
  {
    id: 2,
    title: "Write Script",
    description: "Plan what you'll say and do",
    icon: FileText,
    path: "/script",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
  },
  {
    id: 3,
    title: "Record Video",
    description: "Lights, camera, action!",
    icon: Video,
    path: "/recorder",
    color: "text-red-400",
    bgColor: "bg-red-500/20",
  },
  {
    id: 4,
    title: "Edit Video",
    description: "Add effects and make it awesome",
    icon: Scissors,
    path: "/editor",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
  },
  {
    id: 5,
    title: "Upload & Share",
    description: "Share your creation with the world!",
    icon: Upload,
    path: "/upload",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
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
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {profile.name ? `Hey ${profile.name}!` : "Welcome!"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {allComplete ? "All done! Start a new video?" : "Let's create your next video"}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowSetup(true)}
          className="p-2"
          data-testid="button-edit-profile"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{completedSteps.length} of {STEPS.length} steps</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current Step Highlight */}
      {!allComplete && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${currentStep.bgColor}`}>
                <currentStep.icon className={`h-8 w-8 ${currentStep.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                  Next Step
                </p>
                <h2 className="text-xl font-semibold">{currentStep.title}</h2>
                <p className="text-muted-foreground text-sm mt-0.5">{currentStep.description}</p>
              </div>
              <Link href={currentStep.path}>
                <Button data-testid="button-go-to-step">
                  Start
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Complete State */}
      {allComplete && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Video Complete!</h2>
            <p className="text-muted-foreground mb-4">Great job finishing all the steps!</p>
            <Button onClick={resetProgress} variant="secondary" data-testid="button-start-new">
              <RotateCcw className="h-4 w-4 mr-2" />
              Start New Video
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Steps List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Your Roadmap
        </h3>
        
        {STEPS.map((step, index) => {
          const isComplete = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep.id && !allComplete;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative">
              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div 
                  className={`absolute left-7 top-16 w-0.5 h-6 ${
                    isComplete ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
              
              <Card 
                className={`transition-all ${
                  isCurrent ? 'border-primary/50 shadow-sm' : ''
                } ${isComplete ? 'bg-muted/30' : ''}`}
                data-testid={`card-step-${step.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Clickable Step Number/Check - Toggle completion */}
                    <button
                      onClick={() => toggleStepComplete(step.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-110 ${
                        isComplete
                          ? "bg-primary text-primary-foreground"
                          : isCurrent
                            ? "bg-primary/20 text-primary border-2 border-primary hover:bg-primary/30"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      data-testid={`button-toggle-step-${step.id}`}
                    >
                      {isComplete ? <Check className="h-5 w-5" /> : step.id}
                    </button>

                    {/* Step Icon */}
                    <div className={`p-2 rounded-lg ${step.bgColor}`}>
                      <Icon className={`h-5 w-5 ${step.color}`} />
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${isComplete ? 'text-muted-foreground line-through' : ''}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">{step.description}</p>
                    </div>

                    {/* Go Button */}
                    <Link href={step.path}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="p-2"
                        data-testid={`button-step-${step.id}`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Reset Button */}
      {completedSteps.length > 0 && !allComplete && (
        <div className="text-center pt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetProgress}
            className="text-muted-foreground"
            data-testid="button-reset-progress"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Progress
          </Button>
        </div>
      )}

      {/* Profile Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Your Profile</DialogTitle>
            <DialogDescription>
              Tell us about yourself and your channel!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="mt-2"
                data-testid="input-name"
              />
            </div>
            <div>
              <Label htmlFor="channel">Channel Name (optional)</Label>
              <Input
                id="channel"
                value={tempChannel}
                onChange={(e) => setTempChannel(e.target.value)}
                placeholder="Enter your channel name"
                className="mt-2"
                data-testid="input-channel"
              />
            </div>
            <div>
              <Label>Choose Your Avatar</Label>
              <div className="grid grid-cols-6 gap-2 mt-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-3xl p-2 rounded-lg transition-all ${
                      selectedAvatar === avatar
                        ? "bg-primary scale-110"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    data-testid={`button-avatar-${avatar}`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            <Button 
              onClick={handleSaveProfile} 
              className="w-full"
              data-testid="button-save-profile"
            >
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
