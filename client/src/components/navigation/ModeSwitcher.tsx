import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { StudioMode } from "@/lib/studioModes";
import { PenTool, TrendingUp, FolderOpen } from "lucide-react";

interface ModeSwitcherProps {
  activeMode: StudioMode | null;
}

const MODE_CONFIG = {
  CREATE: { icon: PenTool, label: "Create", color: "#6DFF9C", path: "/ideas" },
  GROW: { icon: TrendingUp, label: "Grow", color: "#F3C94C", path: "/analytics" },
  LIBRARY: { icon: FolderOpen, label: "Library", color: "#2BD4FF", path: "/templates" }
};

export default function ModeSwitcher({ activeMode }: ModeSwitcherProps) {
  return (
    <div className="flex items-center gap-1 bg-[#0f1d32]/85 rounded-full px-2 py-1.5 border border-[#1a2a4a]/60">
      {(Object.keys(MODE_CONFIG) as StudioMode[]).map((mode) => {
        const config = MODE_CONFIG[mode];
        const Icon = config.icon;
        const isActive = activeMode === mode;
        
        return (
          <Link key={mode} href={config.path}>
            <span
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer",
                isActive
                  ? "text-white bg-white/10 ring-1 shadow-lg"
                  : "text-zinc-300 hover:text-white hover:bg-white/5"
              )}
              style={{
                ringColor: isActive ? `${config.color}60` : undefined,
                boxShadow: isActive ? `0 8px 30px -10px ${config.color}45` : undefined
              }}
              data-testid={`mode-${mode.toLowerCase()}`}
            >
              <Icon className="h-4 w-4" style={{ color: isActive ? config.color : undefined }} />
              <span>{config.label}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
