import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { CREATE_STEPPER } from "@/lib/studioModes";
import { Lightbulb, FileText, Video, Scissors, Palette, Upload, Check, Sparkles } from "lucide-react";

interface CreateStepperProps {
  currentPath: string;
}

const STEP_ICONS = {
  "/ideas": Lightbulb,
  "/script": FileText,
  "/recorder": Video,
  "/editor": Scissors,
  "/thumbnail": Palette,
  "/youtube-upload": Upload
};

const STEP_COLORS = [
  "#2BD4FF",
  "#4E4DFF",
  "#6DFF9C",
  "#F3C94C",
  "#A259FF",
  "#2BD4FF"
];

export default function CreateStepper({ currentPath }: CreateStepperProps) {
  const currentIndex = CREATE_STEPPER.findIndex(step => step.path === currentPath);
  const isAIActive = currentPath === "/ai-assistant";
  
  return (
    <div className="w-full bg-[#0c1322]/90 border-b border-[#1a2a4a]/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-center gap-1">
          {CREATE_STEPPER.map((step, idx) => {
            const Icon = STEP_ICONS[step.path as keyof typeof STEP_ICONS];
            const isActive = step.path === currentPath;
            const isComplete = idx < currentIndex;
            const color = STEP_COLORS[idx];
            
            return (
              <div key={step.path} className="flex items-center">
                <Link href={step.path}>
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer hover:scale-110"
                    style={{
                      background: isComplete 
                        ? "#6DFF9C" 
                        : isActive 
                          ? `${color}25` 
                          : "#0f1f3f",
                      boxShadow: isActive ? `0 0 0 2px #0c1322, 0 0 0 4px ${color}` : undefined
                    }}
                    data-testid={`stepper-${step.label.toLowerCase()}`}
                    title={step.label}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4 text-[#0a1628]" />
                    ) : Icon ? (
                      <Icon
                        className="h-4 w-4"
                        style={{ color: isActive ? color : "#71717a" }}
                      />
                    ) : (
                      <span 
                        className="text-xs font-bold"
                        style={{ color: isActive ? color : "#71717a" }}
                      >
                        {step.step}
                      </span>
                    )}
                  </div>
                </Link>
                
                {idx < CREATE_STEPPER.length - 1 && (
                  <div
                    className={cn(
                      "w-6 md:w-10 h-0.5 mx-0.5",
                      isComplete ? "bg-[#6DFF9C]" : "bg-[#1a2a4a]"
                    )}
                  />
                )}
              </div>
            );
          })}
          
          {/* AI Assistant - Quick Access */}
          <div className="w-6 md:w-10 h-0.5 mx-0.5 bg-[#1a2a4a]" />
          <Link href="/ai-assistant">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer",
                isAIActive 
                  ? "bg-[#A259FF]/30 ring-2 ring-offset-2 ring-offset-[#0c1322] ring-[#A259FF]" 
                  : "bg-[#0f1f3f] hover:scale-110"
              )}
              data-testid="stepper-ai-assistant"
              title="AI Help"
            >
              <Sparkles className="h-4 w-4 text-[#A259FF]" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
