import { Link, useLocation } from "wouter";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Lightbulb, FileText, Video, Scissors, Upload, MoreHorizontal, Palette, Sparkles, BarChart3, Zap } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [showMore, setShowMore] = useState(false);

  const mainNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/ideas", label: "Ideas", icon: Lightbulb },
    { path: "/script", label: "Script", icon: FileText },
    { path: "/recorder", label: "Record", icon: Video },
    { path: "/editor", label: "Edit", icon: Scissors },
    { path: "/upload", label: "Upload", icon: Upload },
  ];

  const moreNavItems = [
    { path: "/thumbnail", label: "Thumbnail", icon: Palette },
    { path: "/ai-assistant", label: "AI Help", icon: Sparkles },
    { path: "/analytics", label: "Stats", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Header - Holographic Nav */}
      <header className="border-b border-[rgba(43,212,255,0.2)] bg-[rgba(5,11,31,0.9)] backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <Zap className="h-7 w-7 text-[#F3C94C] group-hover:text-[#2BD4FF] transition-colors" />
                  <div className="absolute inset-0 blur-md bg-[#F3C94C] opacity-50 group-hover:bg-[#2BD4FF] transition-colors" />
                </div>
                <span className="text-xl font-bold font-display tracking-tight">
                  <span className="text-[#F3C94C]">Tube</span>
                  <span className="text-[#2BD4FF]">Star</span>
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation - Holographic Pills */}
            <nav className="hidden md:flex items-center gap-1 holo-card rounded-2xl p-1.5">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <span
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer overflow-visible",
                        isActive
                          ? "text-white"
                          : "text-zinc-400 hover:text-white"
                      )}
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#4E4DFF] to-[#2BD4FF] opacity-90" />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#4E4DFF] to-[#2BD4FF] blur-md opacity-50" />
                      )}
                      <Icon className="h-4 w-4 relative z-10" />
                      <span className="relative z-10">{item.label}</span>
                    </span>
                  </Link>
                );
              })}
              
              {/* More dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    showMore
                      ? "bg-[rgba(43,212,255,0.2)] text-white"
                      : "text-zinc-400 hover:text-white"
                  )}
                  data-testid="nav-more"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </button>
                {showMore && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
                    <div className="absolute right-0 top-full mt-2 holo-card rounded-xl shadow-2xl min-w-[180px] py-2 z-50 neon-border-cyan">
                      {moreNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.path} href={item.path}>
                            <span
                              onClick={() => setShowMore(false)}
                              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-[rgba(43,212,255,0.15)] transition-colors cursor-pointer"
                              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                            >
                              <Icon className="h-4 w-4 text-[#2BD4FF]" />
                              {item.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
        
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2BD4FF] to-transparent opacity-50" />
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[rgba(5,11,31,0.95)] backdrop-blur-xl border-t border-[rgba(43,212,255,0.2)] z-50 safe-area-inset-bottom">
        <div className="flex justify-around py-2 px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all cursor-pointer min-w-[48px]",
                    isActive
                      ? "text-[#2BD4FF]"
                      : "text-zinc-500"
                  )}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-[rgba(43,212,255,0.1)]" />
                  )}
                  <Icon className={cn(
                    "h-5 w-5 relative z-10", 
                    isActive && "drop-shadow-[0_0_8px_rgba(43,212,255,0.8)]"
                  )} />
                  <span className="text-[10px] font-medium relative z-10">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
        
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2BD4FF] to-transparent opacity-50" />
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 pb-28 md:pb-8 relative z-10">
        {children}
      </main>

      {/* Footer - Desktop only */}
      <footer className="hidden md:block border-t border-[rgba(43,212,255,0.15)] py-6 bg-[rgba(5,11,31,0.5)] relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-zinc-600">
            Made for Awesome <span className="text-[#F3C94C]">Aidan</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
