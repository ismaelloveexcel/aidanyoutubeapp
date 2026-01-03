import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home", emoji: "🏠" },
    { path: "/roadmap", label: "Roadmap", emoji: "🗺️" },
    { path: "/progress", label: "Progress", emoji: "🏆" },
    { path: "/ideas", label: "Ideas", emoji: "💡" },
    { path: "/script", label: "Script", emoji: "📝" },
    { path: "/recorder", label: "Record", emoji: "🎬" },
    { path: "/editor", label: "Edit", emoji: "✂️" },
    { path: "/thumbnail", label: "Thumbnail", emoji: "🎨" },
    { path: "/ai-assistant", label: "AI Help", emoji: "🤖" },
    { path: "/viral", label: "Go Viral", emoji: "🚀" },
    { path: "/multi-platform", label: "Export", emoji: "📱" },
    { path: "/upload", label: "Upload", emoji: "📤" },
    { path: "/analytics", label: "Analytics", emoji: "📊" },
    { path: "/calendar", label: "Calendar", emoji: "📅" },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Header with cool blue gradient */}
      <header className="bg-gradient-to-r from-[hsl(220,40%,12%)] via-[hsl(210,50%,15%)] to-[hsl(220,40%,12%)] border-b-2 border-[hsl(210,60%,30%)] shadow-[0_4px_30px_rgba(0,120,255,0.15)]">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-4xl bg-gradient-to-r from-[hsl(45,100%,60%)] via-[hsl(180,100%,50%)] to-[hsl(210,100%,60%)] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,150,255,0.5)]">
              ⭐ TubeStar
            </h1>
            <div className="text-sm font-semibold text-[hsl(180,100%,70%)] bg-[hsl(210,50%,15%)] px-4 py-2 rounded-full border border-[hsl(210,60%,40%)]">
              🎮 Creator Studio
            </div>
          </div>
        </div>
      </header>

      {/* Navigation with enhanced styling */}
      <nav className="bg-gradient-to-r from-[hsl(220,30%,10%)] via-[hsl(210,35%,12%)] to-[hsl(220,30%,10%)] border-b-2 border-[hsl(210,40%,22%)] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={cn(
                    "px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-sm",
                    location === item.path
                      ? "bg-gradient-to-r from-[hsl(210,100%,50%)] to-[hsl(200,100%,45%)] text-white shadow-[0_4px_20px_rgba(0,120,255,0.4)] scale-105 border-2 border-white/20"
                      : "bg-[hsl(220,25%,15%)] text-gray-300 hover:bg-[hsl(210,30%,20%)] hover:text-white border-2 border-transparent hover:border-[hsl(210,60%,40%)] hover:shadow-[0_0_15px_rgba(0,150,255,0.2)]"
                  )}
                >
                  <span className="mr-1.5">{item.emoji}</span>
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content with padding */}
      <main className="container mx-auto px-4 py-10">
        {children}
      </main>

      {/* Enhanced Footer */}
      <footer className="mt-16 bg-gradient-to-r from-[hsl(220,40%,10%)] via-[hsl(210,50%,12%)] to-[hsl(220,40%,10%)] border-t-2 border-[hsl(210,60%,25%)] py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold bg-gradient-to-r from-[hsl(45,100%,60%)] via-[hsl(180,100%,60%)] to-[hsl(210,100%,60%)] bg-clip-text text-transparent">
            Made with 💙 for young creators
          </p>
          <p className="text-sm text-gray-500 mt-2">Level up your content game! 🎮</p>
        </div>
      </footer>
    </div>
  );
}
