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
    { path: "/ideas", label: "Ideas", emoji: "💡" },
    { path: "/script", label: "Script", emoji: "📝" },
    { path: "/templates", label: "Templates", emoji: "📋" },
    { path: "/thumbnail", label: "Thumbnail", emoji: "🎨" },
    { path: "/soundboard", label: "Sounds", emoji: "🔊" },
  ];

  return (
    <div className="min-h-screen bg-[hsl(240,10%,8%)] text-white">
      {/* Header */}
      <header className="bg-[hsl(240,10%,12%)] border-b-4 border-[hsl(240,10%,20%)] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl text-[hsl(320,100%,50%)] drop-shadow-[3px_3px_0_rgba(0,0,0,0.3)]">
              ⭐ TubeStar
            </h1>
            <div className="text-sm text-gray-400">Creator Studio</div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[hsl(240,10%,10%)] border-b-4 border-[hsl(240,10%,20%)]">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={cn(
                    "px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap",
                    location === item.path
                      ? "bg-[hsl(320,100%,50%)] text-white shadow-[3px_3px_0_rgba(0,0,0,0.3)]"
                      : "bg-[hsl(240,10%,15%)] text-gray-300 hover:bg-[hsl(240,10%,20%)]"
                  )}
                >
                  {item.emoji} {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[hsl(240,10%,10%)] border-t-4 border-[hsl(240,10%,20%)] py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          Made with 💜 for young creators
        </div>
      </footer>
    </div>
  );
}
