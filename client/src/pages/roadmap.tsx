import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  emoji: string;
  path: string;
  tips: string[];
  completed: boolean;
}

const INITIAL_STEPS: RoadmapStep[] = [
  {
    id: 1,
    title: "Brainstorm Your Idea",
    description: "Come up with an awesome video concept that your audience will love",
    emoji: "💡",
    path: "/ideas",
    tips: [
      "Think about what YOU love and want to share",
      "Check trending topics for inspiration",
      "Ask yourself: Would I watch this video?"
    ],
    completed: false
  },
  {
    id: 2,
    title: "Write Your Script",
    description: "Plan what you'll say and do in your video",
    emoji: "📝",
    path: "/script",
    tips: [
      "Start with a hook to grab attention",
      "Keep it simple and fun",
      "Include a call-to-action at the end"
    ],
    completed: false
  },
  {
    id: 3,
    title: "Get AI Help",
    description: "Use AI to improve your script, titles, and descriptions",
    emoji: "🤖",
    path: "/ai-assistant",
    tips: [
      "Ask for title ideas that pop",
      "Get help with your description",
      "Generate hashtag suggestions"
    ],
    completed: false
  },
  {
    id: 4,
    title: "Record Your Video",
    description: "Lights, camera, action! Time to record your masterpiece",
    emoji: "🎬",
    path: "/recorder",
    tips: [
      "Make sure your lighting is good",
      "Check your microphone audio",
      "Look at the camera and be yourself!"
    ],
    completed: false
  },
  {
    id: 5,
    title: "Edit Your Video",
    description: "Add effects, cut mistakes, and make it awesome",
    emoji: "✂️",
    path: "/editor",
    tips: [
      "Cut out awkward pauses",
      "Add music and sound effects",
      "Keep the energy high throughout"
    ],
    completed: false
  },
  {
    id: 6,
    title: "Create Thumbnail",
    description: "Design an eye-catching thumbnail that makes people click",
    emoji: "🎨",
    path: "/thumbnail",
    tips: [
      "Use bright colors that stand out",
      "Add your face showing emotion",
      "Keep text big and readable"
    ],
    completed: false
  },
  {
    id: 7,
    title: "Optimize for Viral",
    description: "Check your title and description for maximum reach",
    emoji: "🚀",
    path: "/viral",
    tips: [
      "Use power words in your title",
      "Include relevant keywords",
      "Make sure your hook is strong"
    ],
    completed: false
  },
  {
    id: 8,
    title: "Export for Platforms",
    description: "Get your video ready for different platforms",
    emoji: "📱",
    path: "/multi-platform",
    tips: [
      "YouTube prefers 16:9 videos",
      "TikTok and Shorts need 9:16 vertical",
      "Export in high quality (1080p+)"
    ],
    completed: false
  },
  {
    id: 9,
    title: "Upload & Publish",
    description: "Share your creation with the world!",
    emoji: "📤",
    path: "/upload",
    tips: [
      "Upload at peak times (after school)",
      "Share on all your social media",
      "Respond to comments to boost engagement"
    ],
    completed: false
  },
  {
    id: 10,
    title: "Track Performance",
    description: "See how your video is doing and learn for next time",
    emoji: "📊",
    path: "/analytics",
    tips: [
      "Check views and watch time",
      "See what parts people skip",
      "Learn what works for next video"
    ],
    completed: false
  }
];

export default function Roadmap() {
  const { toast } = useToast();
  const [steps, setSteps] = useState<RoadmapStep[]>(INITIAL_STEPS);
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = (completedCount / steps.length) * 100;

  const markComplete = (stepId: number) => {
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, completed: true } : s
    ));
    
    // Move to next step
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
      setExpandedStep(stepId + 1);
    }

    toast({
      title: "🎉 Step Complete!",
      description: stepId === steps.length 
        ? "Congratulations! You've completed the entire video creation process!" 
        : "Great job! On to the next step!",
    });
  };

  const resetRoadmap = () => {
    setSteps(INITIAL_STEPS);
    setCurrentStep(1);
    setExpandedStep(1);
    toast({
      title: "🔄 Roadmap Reset",
      description: "Start fresh with a new video project!",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">🗺️ Video Creation Roadmap</h1>
        <p className="text-gray-400 text-lg">Your complete guide from idea to upload!</p>
      </div>

      {/* Progress Bar */}
      <Card className="border-[hsl(210,60%,40%)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl">Your Progress</h2>
              <p className="text-gray-400">{completedCount} of {steps.length} steps completed</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-display bg-gradient-to-r from-[hsl(210,100%,60%)] to-[hsl(180,100%,50%)] bg-clip-text text-transparent">
                {Math.round(progressPercent)}%
              </div>
            </div>
          </div>
          <div className="h-4 bg-[hsl(220,25%,15%)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[hsl(210,100%,50%)] to-[hsl(180,100%,50%)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {completedCount === steps.length && (
            <div className="mt-4 text-center">
              <Button onClick={resetRoadmap} variant="secondary">
                🔄 Start New Project
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Step Highlight */}
      {completedCount < steps.length && (
        <Card className="border-[hsl(45,100%,50%)] bg-gradient-to-r from-[hsl(45,50%,15%)] to-[hsl(35,50%,12%)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{steps[currentStep - 1]?.emoji}</div>
              <div className="flex-1">
                <div className="text-sm text-[hsl(45,100%,60%)] font-semibold mb-1">
                  CURRENT STEP
                </div>
                <h3 className="font-display text-2xl text-white">
                  Step {currentStep}: {steps[currentStep - 1]?.title}
                </h3>
                <p className="text-gray-300 mt-1">{steps[currentStep - 1]?.description}</p>
              </div>
              <Link href={steps[currentStep - 1]?.path || "/"}>
                <Button size="lg">
                  Go to Step →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Steps */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl">📋 All Steps</h2>
        
        {steps.map((step) => (
          <Card 
            key={step.id}
            className={`cursor-pointer transition-all ${
              step.completed 
                ? "border-[hsl(140,60%,40%)] bg-[hsl(140,30%,12%)]" 
                : step.id === currentStep
                  ? "border-[hsl(210,60%,40%)] shadow-[0_0_20px_rgba(0,150,255,0.2)]"
                  : "border-[hsl(220,30%,25%)] opacity-75"
            }`}
            onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                {/* Step Number */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                  step.completed
                    ? "bg-[hsl(140,100%,35%)] text-white"
                    : step.id === currentStep
                      ? "bg-gradient-to-r from-[hsl(210,100%,50%)] to-[hsl(200,100%,45%)] text-white"
                      : "bg-[hsl(220,25%,20%)] text-gray-400"
                }`}>
                  {step.completed ? "✓" : step.id}
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{step.emoji}</span>
                    <h3 className={`font-display text-xl ${step.completed ? "text-green-300" : "text-white"}`}>
                      {step.title}
                    </h3>
                    {step.completed && (
                      <span className="text-xs bg-[hsl(140,100%,35%)] text-white px-2 py-1 rounded-full">
                        COMPLETE
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1">{step.description}</p>
                </div>

                {/* Expand Icon */}
                <div className="text-2xl text-gray-400">
                  {expandedStep === step.id ? "▼" : "▶"}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedStep === step.id && (
                <div className="mt-5 pt-5 border-t border-[hsl(220,30%,25%)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tips */}
                    <div>
                      <h4 className="font-semibold text-[hsl(45,100%,60%)] mb-3">💡 Pro Tips:</h4>
                      <ul className="space-y-2">
                        {step.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300">
                            <span className="text-[hsl(180,100%,50%)]">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <Link href={step.path}>
                        <Button className="w-full" size="lg">
                          {step.emoji} Go to {step.title}
                        </Button>
                      </Link>
                      {!step.completed && (
                        <Button 
                          variant="secondary" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            markComplete(step.id);
                          }}
                        >
                          ✓ Mark as Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Tips Card */}
      <Card className="border-[hsl(180,60%,35%)]">
        <CardHeader>
          <CardTitle>🎯 Quick Tips for Success</CardTitle>
          <CardDescription>Remember these as you create your video!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[hsl(220,25%,15%)] rounded-xl text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold mb-1">Stay Focused</h4>
              <p className="text-sm text-gray-400">One topic per video works best</p>
            </div>
            <div className="p-4 bg-[hsl(220,25%,15%)] rounded-xl text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold mb-1">Hook Early</h4>
              <p className="text-sm text-gray-400">Grab attention in first 5 seconds</p>
            </div>
            <div className="p-4 bg-[hsl(220,25%,15%)] rounded-xl text-center">
              <div className="text-3xl mb-2">🎮</div>
              <h4 className="font-semibold mb-1">Have Fun!</h4>
              <p className="text-sm text-gray-400">If you enjoy it, viewers will too</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
