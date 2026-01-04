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
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-2">
            {CREATE_STEPPER.map((step, idx) => {
              const Icon = STEP_ICONS[step.path as keyof typeof STEP_ICONS];
              const isActive = step.path === currentPath;
              const isComplete = idx < currentIndex;
              const color = STEP_COLORS[idx];
              
              return (
                <div key={step.path} className="flex items-center gap-2 shrink-0">
                  <Link href={step.path}>
                    <div
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer",
                        isActive ? "bg-white/10" : "hover:bg-white/5"
                      )}
                      data-testid={`stepper-${step.label.toLowerCase()}`}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                          isComplete
                            ? "bg-[#6DFF9C] border-[#6DFF9C] text-[#0a1628]"
                            : isActive
                              ? "bg-[#0a1628]"
                              : "bg-[#0f1f3f] border-[#1a2a4a]/80 text-zinc-500"
                        )}
                        style={{
                          borderColor: isActive && !isComplete ? color : undefined,
                          color: isActive && !isComplete ? color : undefined
                        }}
                      >
                        {isComplete ? <Check className="h-3.5 w-3.5" /> : step.step}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {Icon && (
                          <Icon
                            className="h-4 w-4"
                            style={{ color: isActive || isComplete ? color : "#71717a" }}
                          />
                        )}
                        <span
                          className={cn(
                            "text-sm font-medium hidden sm:inline",
                            isComplete ? "text-zinc-500" : isActive ? "text-white" : "text-zinc-400"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  {idx < CREATE_STEPPER.length - 1 && (
                    <div
                      className={cn(
                        "w-4 md:w-8 h-0.5 transition-colors",
                        isComplete ? "bg-[#6DFF9C]" : "bg-[#1a2a4a]"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* AI Assistant - Quick Access Tool */}
          <Link href="/ai-assistant">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer shrink-0 ml-2",
                isAIActive 
                  ? "bg-[#A259FF]/20 ring-1 ring-[#A259FF]/50" 
                  : "hover:bg-white/5 border border-[#A259FF]/30"
              )}
              data-testid="stepper-ai-assistant"
            >
              <Sparkles className="h-4 w-4 text-[#A259FF]" />
              <span className={cn(
                "text-sm font-medium hidden sm:inline",
                isAIActive ? "text-[#A259FF]" : "text-zinc-400"
              )}>
                AI Help
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
