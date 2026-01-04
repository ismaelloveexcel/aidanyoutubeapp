import { Link, useLocation } from "wouter";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Lightbulb, FileText, Video, Scissors, Upload, MoreHorizontal, Palette, Sparkles, BarChart3, Zap, ChevronDown } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [showMore, setShowMore] = useState(false);

  const mainNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/roadmap", label: "Roadmap", icon: BarChart3 },
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
    <div className="min-h-screen flex flex-col">
      {/* Header - Clean Professional Design */}
      <header className="sticky top-0 z-50 w-full border-b border-[#17233b] bg-gradient-to-r from-[#081121]/95 via-[#0a1628]/95 to-[#081121]/95 backdrop-blur-xl shadow-[0_10px_40px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex h-20 items-center justify-between px-6 sm:px-8 max-w-6xl mx-auto sticky-nav">
          {/* Logo - Left */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group" data-testid="link-home-logo">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-linear-to-br from-[#F3C94C] to-[#ff9500]">
                <Zap className="h-5 w-5 text-[#0a1628]" strokeWidth={2.5} />
              </div>
              <span className="text-2xl md:text-3xl font-bold font-display tracking-tight">
                <span className="text-white pr-1">Tube</span>
                <span className="text-[#2BD4FF]">Star</span>
              </span>
            </div>
          </Link>
          
          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0f1d32]/85 rounded-full px-2 py-2 border border-[#1a2a4a]/60 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.7)]">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    className={cn(
                      "relative flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer",
                      isActive
                        ? "text-white bg-white/10 ring-1 ring-[#2BD4FF]/60 shadow-[0_8px_30px_-10px_rgba(43,212,255,0.45)]"
                        : "text-zinc-300 hover:text-white hover:bg-white/5"
                    )}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-[#F3C94C]" : "text-[#2BD4FF]")} />
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}
            
            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMore(!showMore)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
                  showMore
                    ? "bg-white/10 text-white ring-1 ring-[#2BD4FF]/40 shadow-[0_10px_30px_-18px_rgba(43,212,255,0.55)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                )}
                data-testid="nav-more"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span>More</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", showMore && "rotate-180")} />
              </button>
              {showMore && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-[#0f1d32] rounded-xl border border-[#1a2a4a] shadow-2xl shadow-black/50 min-w-[180px] py-2 z-50">
                    {moreNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.path;
                      return (
                        <Link key={item.path} href={item.path}>
                          <span
                            onClick={() => setShowMore(false)}
                            className={cn(
                              "flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors cursor-pointer",
                              isActive
                                ? "text-[#2BD4FF] bg-[#2BD4FF]/10"
                                : "text-zinc-300 hover:text-white hover:bg-[#1a2a4a]"
                            )}
                            data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                          >
                            <Icon className="h-4 w-4" />
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

          {/* Right side - Placeholder for future profile/actions */}
          <div className="w-[160px] hidden md:flex items-center justify-end">
            <div className="flex items-center gap-3 rounded-full bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 border border-white/5">
              <div className="h-2 w-2 rounded-full bg-[#2BD4FF] shadow-[0_0_6px_rgba(43,212,255,0.9)]" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">For Aidan</p>
                <p className="text-white">Future YouTube Star</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a1628]/95 backdrop-blur-xl border-t border-[#1a2a4a] z-50 pb-safe">
        <div className="flex justify-around py-2 px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all cursor-pointer min-w-12",
                    isActive
                      ? "text-[#2BD4FF]"
                      : "text-zinc-500"
                  )}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  <Icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_6px_rgba(43,212,255,0.8)]")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-32 md:pb-0">
        <div className="max-w-5xl mx-auto px-10 sm:px-20 lg:px-32 py-16 sm:py-24">
          {children}
        </div>
      </main>
    </div>
  );
}
