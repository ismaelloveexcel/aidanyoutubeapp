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

// Short labels for mobile
const SHORT_LABELS: Record<string, string> = {
  "/ideas": "Idea",
  "/script": "Script",
  "/recorder": "Record",
  "/editor": "Edit",
  "/thumbnail": "Art",
  "/youtube-upload": "Upload"
};

export default function CreateStepper({ currentPath }: CreateStepperProps) {
  const currentIndex = CREATE_STEPPER.findIndex(step => step.path === currentPath);
  const isAIActive = currentPath === "/ai-assistant";
  
  return (
    <div className="w-full bg-[#0c1322]/90 border-b border-[#1a2a4a]/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-2 py-2">
        <div className="flex items-center justify-center gap-0.5">
          {CREATE_STEPPER.map((step, idx) => {
            const Icon = STEP_ICONS[step.path as keyof typeof STEP_ICONS];
            const isActive = step.path === currentPath;
            const isComplete = idx < currentIndex;
            const color = STEP_COLORS[idx];
            const shortLabel = SHORT_LABELS[step.path] || step.label;
            
            return (
              <div key={step.path} className="flex items-center">
                <Link href={step.path}>
                  <div
                    className="flex flex-col items-center gap-0.5 px-1.5 sm:px-2 py-1 rounded-lg transition-all cursor-pointer hover:bg-white/5"
                    data-testid={`stepper-${step.label.toLowerCase()}`}
                  >
                    <div
                      className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all"
                      style={{
                        background: isComplete 
                          ? "#6DFF9C" 
                          : isActive 
                            ? `${color}25` 
                            : "#0f1f3f",
                        boxShadow: isActive ? `0 0 0 2px ${color}` : undefined
                      }}
                    >
                      {isComplete ? (
                        <Check className="h-3.5 w-3.5 text-[#0a1628]" />
                      ) : Icon ? (
                        <Icon
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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
                    <span 
                      className="text-[9px] sm:text-[10px] font-medium"
                      style={{ color: isActive ? color : isComplete ? "#6DFF9C" : "#71717a" }}
                    >
                      {shortLabel}
                    </span>
                  </div>
                </Link>
                
                {idx < CREATE_STEPPER.length - 1 && (
                  <div
                    className={cn(
                      "w-2 sm:w-4 h-0.5 mt-[-12px] sm:mt-[-14px]",
                      isComplete ? "bg-[#6DFF9C]" : "bg-[#1a2a4a]"
                    )}
                  />
                )}
              </div>
            );
          })}
          
          {/* AI Assistant - Quick Access */}
          <div className="w-2 sm:w-4 h-0.5 mt-[-12px] sm:mt-[-14px] bg-[#1a2a4a]" />
          <Link href="/ai-assistant">
            <div
              className="flex flex-col items-center gap-0.5 px-1.5 sm:px-2 py-1 rounded-lg transition-all cursor-pointer hover:bg-white/5"
              data-testid="stepper-ai-assistant"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all",
                  isAIActive 
                    ? "bg-[#A259FF]/30" 
                    : "bg-[#0f1f3f]"
                )}
                style={{
                  boxShadow: isAIActive ? "0 0 0 2px #A259FF" : undefined
                }}
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#A259FF]" />
              </div>
              <span 
                className="text-[9px] sm:text-[10px] font-medium"
                style={{ color: isAIActive ? "#A259FF" : "#71717a" }}
              >
                AI
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
