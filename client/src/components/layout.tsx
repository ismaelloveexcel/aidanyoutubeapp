import { Link, useLocation } from "wouter";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Lightbulb, FileText, Video, Scissors, Upload, MoreHorizontal, Palette, Sparkles, BarChart3, X } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/">
              <span className="text-xl font-bold text-primary cursor-pointer">
                TubeStar
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <span
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    showMore
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  data-testid="nav-more"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </button>
                {showMore && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
                    <div className="absolute right-0 top-full mt-1 bg-card border rounded-lg shadow-lg min-w-[140px] py-1 z-50">
                      {moreNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.path} href={item.path}>
                            <span
                              onClick={() => setShowMore(false)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
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

      {/* Mobile Bottom Navigation - all main items */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="flex justify-around py-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px]">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Footer - Desktop only */}
      <footer className="hidden md:block border-t py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Made for Awesome Aidan
          </p>
        </div>
      </footer>
    </div>
  );
}
