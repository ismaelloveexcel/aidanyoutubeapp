import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { LIBRARY_NAV_ITEMS } from "@/lib/studioModes";
import { Layout, Volume2, FolderArchive, Share2 } from "lucide-react";

interface LibraryNavProps {
  currentPath: string;
}

const NAV_ICONS = {
  "/templates": Layout,
  "/soundboard": Volume2,
  "/repository": FolderArchive,
  "/multi-platform": Share2
};

// Short labels for mobile
const SHORT_LABELS: Record<string, string> = {
  "/templates": "Templates",
  "/soundboard": "Sounds",
  "/repository": "Saved",
  "/multi-platform": "Share"
};

export default function LibraryNav({ currentPath }: LibraryNavProps) {
  return (
    <div className="w-full bg-[#0c1322]/90 border-b border-[#1a2a4a]/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-2 py-2">
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
          {LIBRARY_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.path as keyof typeof NAV_ICONS];
            const isActive = item.path === currentPath;
            const shortLabel = SHORT_LABELS[item.path] || item.label;
            
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    "flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium transition-all cursor-pointer",
                    isActive
                      ? "text-white bg-[#2BD4FF]/15"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                  data-testid={`library-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {Icon && <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#2BD4FF]" : "")} />}
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
