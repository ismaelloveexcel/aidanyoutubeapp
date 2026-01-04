import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { GROW_NAV_ITEMS } from "@/lib/studioModes";
import { BarChart3, Zap, Trophy, CalendarDays, Map } from "lucide-react";

interface GrowNavProps {
  currentPath: string;
}

const NAV_ICONS = {
  "/analytics": BarChart3,
  "/viral-optimizer": Zap,
  "/progress": Trophy,
  "/calendar": CalendarDays,
  "/roadmap": Map
};

export default function GrowNav({ currentPath }: GrowNavProps) {
  return (
    <div className="w-full bg-[#0c1322]/90 border-b border-[#1a2a4a]/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {GROW_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.path as keyof typeof NAV_ICONS];
            const isActive = item.path === currentPath;
            
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap",
                    isActive
                      ? "text-white bg-[#F3C94C]/10 ring-1 ring-[#F3C94C]/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                  data-testid={`grow-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {Icon && <Icon className={cn("h-4 w-4", isActive ? "text-[#F3C94C]" : "")} />}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
