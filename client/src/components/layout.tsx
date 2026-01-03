import { Link, useLocation } from "wouter";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Lightbulb, FileText, Video, Scissors, Upload, MoreHorizontal, Palette, Sparkles, BarChart3 } from "lucide-react";

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
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent cursor-pointer">
                TubeStar
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-zinc-800/50 rounded-xl p-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <span
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/20"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                      )}
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              
              {/* More dropdown - click based */}
              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
                    showMore
                      ? "bg-zinc-700/50 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                  )}
                  data-testid="nav-more"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </button>
                {showMore && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
                    <div className="absolute right-0 top-full mt-2 bg-zinc-800 border border-zinc-700/50 rounded-xl shadow-xl min-w-[160px] py-2 z-50">
                      {moreNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.path} href={item.path}>
                            <span
                              onClick={() => setShowMore(false)}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50 transition-colors cursor-pointer"
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
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800/50 z-50 safe-area-inset-bottom">
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
                      ? "text-purple-400"
                      : "text-zinc-500"
                  )}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  <Icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 pb-28 md:pb-8">
        {children}
      </main>

      {/* Footer - Desktop only */}
      <footer className="hidden md:block border-t border-zinc-800/50 py-6 bg-zinc-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-zinc-500">
            Made for Awesome Aidan
          </p>
        </div>
      </footer>
    </div>
  );
}
