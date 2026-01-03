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
      <header className="sticky top-0 z-50 w-full border-b border-[#1a2a4a] bg-[#0a1628]/95 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          {/* Logo - Left */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group" data-testid="link-home-logo">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#F3C94C] to-[#ff9500]">
                <Zap className="h-5 w-5 text-[#0a1628]" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold font-display tracking-tight">
                <span className="text-white">Tube</span>
                <span className="text-[#2BD4FF]">Star</span>
              </span>
            </div>
          </Link>
          
          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0f1d32] rounded-full px-2 py-1.5 border border-[#1a2a4a]">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer",
                      isActive
                        ? "text-white bg-gradient-to-r from-[#2BD4FF] to-[#4E4DFF] shadow-lg shadow-[#2BD4FF]/25"
                        : "text-zinc-400 hover:text-white hover:bg-[#1a2a4a]"
                    )}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
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
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  showMore
                    ? "bg-[#1a2a4a] text-white"
                    : "text-zinc-400 hover:text-white hover:bg-[#1a2a4a]"
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
          <div className="w-[140px] flex justify-end">
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500">
              <span>Made for</span>
              <span className="text-[#F3C94C] font-semibold">Aidan</span>
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
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all cursor-pointer min-w-[48px]",
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
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
