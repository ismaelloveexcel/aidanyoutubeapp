import { Link, useLocation } from "wouter";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [showMoreNav, setShowMoreNav] = useState(false);

  // Primary navigation - most important items
  const primaryNavItems = [
    { path: "/", label: "Home", emoji: "🏠" },
    { path: "/roadmap", label: "Roadmap", emoji: "🗺️" },
    { path: "/ideas", label: "Ideas", emoji: "💡" },
    { path: "/script", label: "Script", emoji: "📝" },
    { path: "/recorder", label: "Record", emoji: "🎬" },
    { path: "/editor", label: "Edit", emoji: "✂️" },
  ];

  // Secondary navigation - additional tools
  const secondaryNavItems = [
    { path: "/thumbnail", label: "Thumbnail", emoji: "🎨" },
    { path: "/ai-assistant", label: "AI Help", emoji: "🤖" },
    { path: "/viral", label: "Go Viral", emoji: "🚀" },
    { path: "/multi-platform", label: "Export", emoji: "📱" },
    { path: "/upload", label: "Upload", emoji: "📤" },
    { path: "/progress", label: "Progress", emoji: "🏆" },
    { path: "/analytics", label: "Analytics", emoji: "📊" },
    { path: "/calendar", label: "Calendar", emoji: "📅" },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Header with cool blue gradient */}
      <header className="bg-gradient-to-r from-[hsl(220,40%,12%)] via-[hsl(210,50%,15%)] to-[hsl(220,40%,12%)] border-b-2 border-[hsl(210,60%,30%)] shadow-[0_4px_30px_rgba(0,120,255,0.15)]">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="font-display text-4xl bg-gradient-to-r from-[hsl(45,100%,60%)] via-[hsl(180,100%,50%)] to-[hsl(210,100%,60%)] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,150,255,0.5)] cursor-pointer hover:scale-105 transition-transform">
                ⭐ TubeStar
              </h1>
            </Link>
            <div className="text-sm font-semibold text-[hsl(180,100%,70%)] bg-[hsl(210,50%,15%)] px-4 py-2 rounded-full border border-[hsl(210,60%,40%)]">
              🎮 Creator Studio
            </div>
          </div>
        </div>
      </header>

      {/* Simplified Navigation */}
      <nav className="bg-gradient-to-r from-[hsl(220,30%,10%)] via-[hsl(210,35%,12%)] to-[hsl(220,30%,10%)] border-b-2 border-[hsl(210,40%,22%)] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 py-4">
            {/* Primary nav items */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {primaryNavItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    className={cn(
                      "px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-sm",
                      location === item.path
                        ? "bg-gradient-to-r from-[hsl(210,100%,50%)] to-[hsl(200,100%,45%)] text-white shadow-[0_4px_20px_rgba(0,120,255,0.4)] border-2 border-white/20"
                        : "bg-[hsl(220,25%,15%)] text-gray-300 hover:bg-[hsl(210,30%,20%)] hover:text-white border-2 border-transparent hover:border-[hsl(210,60%,40%)]"
                    )}
                  >
                    <span className="mr-1.5">{item.emoji}</span>
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
            
            {/* More button */}
            <button
              onClick={() => setShowMoreNav(!showMoreNav)}
              className={cn(
                "px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-sm ml-auto",
                showMoreNav
                  ? "bg-[hsl(210,50%,25%)] text-white border-2 border-[hsl(210,60%,40%)]"
                  : "bg-[hsl(220,25%,15%)] text-gray-300 hover:bg-[hsl(210,30%,20%)] hover:text-white border-2 border-transparent"
              )}
            >
              <span className="mr-1.5">✨</span>
              More
              <span className="ml-1.5">{showMoreNav ? "▲" : "▼"}</span>
            </button>
          </div>
          
          {/* Expandable secondary nav */}
          {showMoreNav && (
            <div className="pb-4 flex flex-wrap gap-2 border-t border-[hsl(210,30%,20%)] pt-4">
              {secondaryNavItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    className={cn(
                      "px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap text-sm",
                      location === item.path
                        ? "bg-gradient-to-r from-[hsl(210,100%,50%)] to-[hsl(200,100%,45%)] text-white shadow-[0_4px_20px_rgba(0,120,255,0.4)] border-2 border-white/20"
                        : "bg-[hsl(220,25%,18%)] text-gray-300 hover:bg-[hsl(210,30%,22%)] hover:text-white border-2 border-transparent hover:border-[hsl(210,60%,40%)]"
                    )}
                  >
                    <span className="mr-1.5">{item.emoji}</span>
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content with more padding for breathing room */}
      <main className="container mx-auto px-6 py-12">
        {children}
      </main>

      {/* Enhanced Footer */}
      <footer className="mt-20 bg-gradient-to-r from-[hsl(220,40%,10%)] via-[hsl(210,50%,12%)] to-[hsl(220,40%,10%)] border-t-2 border-[hsl(210,60%,25%)] py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold bg-gradient-to-r from-[hsl(45,100%,60%)] via-[hsl(180,100%,60%)] to-[hsl(210,100%,60%)] bg-clip-text text-transparent">
            Made with {"<3"} for Awesome Aidan
          </p>
          <p className="text-sm text-gray-500 mt-2">Level up your content game! 🎮</p>
        </div>
      </footer>
    </div>
  );
}
