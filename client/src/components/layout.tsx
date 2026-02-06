import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getModeFromPath } from "@/lib/studioModes";
import { useCreatorProfile, XP_PER_LEVEL, getXpProgress } from "@/lib/creator-profile";
import { ModeSwitcher, CreateStepper, GrowNav, LibraryNav } from "@/components/navigation";
import { BreathingBackground, FloatingParticles } from "@/components/premium";
import { Zap, Home, PenTool, TrendingUp, FolderOpen, Star } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { profile } = useCreatorProfile();
  
  // Detect current mode from route
  const mode = getModeFromPath(location);
  
  // XP progress calculation
  const xpProgress = getXpProgress(profile.xp);
  const xpPercent = (xpProgress / XP_PER_LEVEL) * 100;

  // Mobile nav items for quick mode access
  const mobileNavItems = [
    { path: "/", label: "Home", icon: Home, color: "#2BD4FF" },
    { path: "/ideas", label: "Create", icon: PenTool, color: "#6DFF9C" },
    { path: "/analytics", label: "Grow", icon: TrendingUp, color: "#F3C94C" },
    { path: "/templates", label: "Library", icon: FolderOpen, color: "#2BD4FF" }
  ];

  return (
    <BreathingBackground intensity="subtle">
      <FloatingParticles density="sparse" />
      
      <div className="min-h-screen flex flex-col relative z-10">
        {/* TopBar */}
        <header className="sticky top-0 z-50 w-full border-b border-[#17233b] bg-gradient-to-r from-[#081121]/95 via-[#0a1628]/95 to-[#081121]/95 backdrop-blur-xl shadow-[0_10px_40px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-6xl mx-auto">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group" data-testid="link-home-logo">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-[#F3C94C] to-[#ff9500]">
                <Zap className="h-4 w-4 text-[#0a1628]" strokeWidth={2.5} />
              </div>
              <span className="text-xl md:text-2xl font-bold font-display tracking-tight">
                <span className="text-white pr-0.5">Tube</span>
                <span className="text-[#2BD4FF]">Star</span>
              </span>
            </div>
          </Link>
          
          {/* ModeSwitcher - Center (Desktop) */}
          <div className="hidden md:block">
            <ModeSwitcher activeMode={mode} />
          </div>

          {/* ProfileXP - Shows Level and XP progress */}
          <div className="w-[160px] hidden md:flex items-center justify-end">
            <div className="flex items-center gap-2.5 rounded-full bg-white/5 px-3 py-1.5 border border-white/10 hover:border-[#F3C94C]/30 transition-colors cursor-pointer group">
              <div className="relative">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#F3C94C] to-[#ff9500] shadow-[0_0_10px_rgba(243,201,76,0.3)]">
                  <Star className="h-3.5 w-3.5 text-[#0a1628]" fill="#0a1628" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#0a1628] rounded-full px-1 text-[9px] font-bold text-[#F3C94C] border border-[#F3C94C]/50">
                  {profile.level}
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-400 font-medium">Level {profile.level}</span>
                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#F3C94C] to-[#ff9500] transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mode-specific navigation */}
      {mode === "CREATE" && <CreateStepper currentPath={location} />}
      {mode === "GROW" && <GrowNav currentPath={location} />}
      {mode === "LIBRARY" && <LibraryNav currentPath={location} />}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a1628]/95 backdrop-blur-xl border-t border-[#1a2a4a] z-50 pb-safe">
        <div className="flex justify-around py-2 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === "/" 
              ? location === "/" 
              : getModeFromPath(item.path) === mode;
            
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer",
                    isActive ? "text-white" : "text-zinc-500"
                  )}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  <Icon 
                    className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_6px_rgba(109,255,156,0.8)]")} 
                    style={{ color: isActive ? item.color : undefined }}
                  />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

        {/* MainContent */}
        <main className="flex-1 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12">
            {children}
          </div>
        </main>
      </div>
    </BreathingBackground>
  );
}
