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

export default function LibraryNav({ currentPath }: LibraryNavProps) {
  return (
    <div className="w-full bg-[#0c1322]/90 border-b border-[#1a2a4a]/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {LIBRARY_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.path as keyof typeof NAV_ICONS];
            const isActive = item.path === currentPath;
            
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap",
                    isActive
                      ? "text-white bg-[#2BD4FF]/10 ring-1 ring-[#2BD4FF]/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                  data-testid={`library-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {Icon && <Icon className={cn("h-4 w-4", isActive ? "text-[#2BD4FF]" : "")} />}
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
