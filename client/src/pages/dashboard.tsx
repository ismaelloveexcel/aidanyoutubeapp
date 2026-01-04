import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreatorProfile, AVATARS } from "@/lib/creator-profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "wouter";
import * as LucideIcons from "lucide-react";
import {
  PenTool,
  TrendingUp,
  FolderOpen,
  ChevronRight,
  Settings,
  PlayCircle,
  Film,
  Loader2,
  Sparkles,
  Zap,
  Target,
  Star,
} from "lucide-react";

// Daily tips for young creators
const DAILY_TIPS = [
  { icon: Sparkles, tip: "Great thumbnails get more clicks! Use bright colors and big text.", color: "#F3C94C" },
  { icon: Target, tip: "Post consistently! Pick a schedule and stick to it.", color: "#6DFF9C" },
  { icon: Star, tip: "Reply to comments - your fans love hearing from you!", color: "#2BD4FF" },
  { icon: Zap, tip: "Hook viewers in the first 5 seconds with something exciting!", color: "#A259FF" },
  { icon: Sparkles, tip: "Use trending sounds and music to boost your reach.", color: "#FF6B6B" },
  { icon: Target, tip: "Tell a story - beginning, middle, and end!", color: "#4ECDC4" },
  { icon: Star, tip: "Collaborate with other creators to grow faster!", color: "#F3C94C" },
];

// Maximum streak to display before capping
const MAX_STREAK_DISPLAY = 7;

interface VideoProject {
  id: number;
  title: string;
  status: string;
  updatedAt: string;
}

interface VideoStats {
  total: number;
  draft: number;
  inProgress: number;
  published: number;
}

const MODE_ENTRY_BUTTONS = [
  {
    mode: "CREATE",
    title: "Create",
    description: "Start a new video from idea to upload",
    path: "/ideas",
    icon: PenTool,
    color: "#6DFF9C",
    gradient: "from-[#6DFF9C] to-[#4BCC7A]"
  },
  {
    mode: "LIBRARY",
    title: "Library",
    description: "Templates, sounds, and assets",
    path: "/templates",
    icon: FolderOpen,
    color: "#2BD4FF",
    gradient: "from-[#2BD4FF] to-[#1BA8D4]"
  }
];

export default function Dashboard() {
  const { profile, setName, setChannelName, setAvatar, setRememberMe } = useCreatorProfile();
  const [showSetup, setShowSetup] = useState(false);
  const [tempName, setTempName] = useState(profile.name || 'Aidan');
  const [tempChannel, setTempChannel] = useState(profile.channelName || "Aidan's Channel");
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || 'Rocket');
  const [rememberMe, setRememberMeLocal] = useState(profile.rememberMe ?? true);

  // Fetch recent projects for "Continue" functionality
  const { data: recentProjects, isLoading: projectsLoading } = useQuery<VideoProject[]>({
    queryKey: ['/api/video-projects/recent'],
  });

  const { data: videoStats, isLoading: statsLoading } = useQuery<VideoStats>({
    queryKey: ['/api/video-projects/stats'],
  });

  const handleSaveProfile = () => {
    if (tempName.trim()) {
      setName(tempName);
      setChannelName(tempChannel);
      setAvatar(selectedAvatar);
      setRememberMe(rememberMe);
      setShowSetup(false);
    }
  };

  const displayName = profile.name?.trim() || "";
  const lastProject = recentProjects?.[0];
  
  // Get a daily tip based on the day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const dailyTip = DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
  const DailyTipIcon = dailyTip.icon;

  return (
    <div className="space-y-3 pb-4">
      {/* Hero Section - Compact */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#F3C94C] font-semibold">Creator Studio</p>
          <h1 className="text-2xl font-display font-bold text-white leading-tight">
            {displayName ? `Hey ${displayName}!` : "Hey Aidan!"}
          </h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-400 hover:text-white"
          onClick={() => setShowSetup(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Daily Creator Tip - Compact */}
      <div 
        className="flex items-center gap-2 p-2 rounded-lg border"
        style={{ 
          background: `${dailyTip.color}08`, 
          borderColor: `${dailyTip.color}25` 
        }}
      >
        <DailyTipIcon className="h-3.5 w-3.5 shrink-0" style={{ color: dailyTip.color }} />
        <p className="text-xs text-zinc-300 line-clamp-1">
          <span className="font-semibold" style={{ color: dailyTip.color }}>Tip:</span>{" "}
          {dailyTip.tip}
        </p>
      </div>

      {/* Quick Stats Row - Styled like reference */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-md bg-[#0d1a2d] border border-[#1a2a4a]/40">
          <div className="text-2xl font-bold text-[#2BD4FF] leading-none" data-testid="stat-videos">
            {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : videoStats?.published ?? 0}
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">Videos Made</p>
        </div>
        <div className="p-3 rounded-md bg-[#0d1a2d] border border-[#1a2a4a]/40">
          <div className="text-2xl font-bold text-[#F3C94C] leading-none" data-testid="stat-in-progress">
            {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (videoStats?.inProgress ?? 0) + (videoStats?.draft ?? 0)}
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">In Progress</p>
        </div>
        <div className="p-3 rounded-md bg-[#0d1a2d] border border-[#1a2a4a]/40">
          <div className="text-2xl font-bold text-[#6DFF9C] leading-none" data-testid="stat-streak">
            {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : videoStats?.total ?? 0}
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">Ideas Saved</p>
        </div>
      </div>

      {/* Mode Entry Buttons - Clean horizontal style like reference */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white">Jump Into</h2>
        <div className="space-y-2">
          {MODE_ENTRY_BUTTONS.map((entry) => {
            const Icon = entry.icon;
            return (
              <Link key={entry.mode} href={entry.path}>
                <div 
                  className="flex items-center gap-3 p-3 rounded-md bg-[#0d1a2d] border border-[#1a2a4a]/40 hover-elevate active-elevate-2 cursor-pointer"
                  data-testid={`mode-entry-${entry.mode.toLowerCase()}`}
                >
                  <div className="shrink-0">
                    <Icon className="h-5 w-5" style={{ color: entry.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-zinc-500">{entry.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Player Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="bg-[#0a1525] border-[#2BD4FF]/30 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-2xl font-bold text-white font-display">
              Welcome, Aidan!
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-base">
              Set up your creator profile and pick your avatar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-1">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-semibold text-zinc-200">Your Name</Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Aidan"
                className="bg-[#122046] border-[#2BD4FF]/40 text-white placeholder:text-zinc-500 focus:border-[#2BD4FF] focus-visible:ring-[#2BD4FF]/40 h-10 text-base"
                data-testid="input-name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="channel" className="text-sm font-semibold text-zinc-200">Channel Name <span className="text-zinc-500 font-normal">(optional)</span></Label>
              <Input
                id="channel"
                value={tempChannel}
                onChange={(e) => setTempChannel(e.target.value)}
                placeholder="Aidan's Channel"
                className="bg-[#122046] border-[#2BD4FF]/40 text-white placeholder:text-zinc-500 focus:border-[#2BD4FF] focus-visible:ring-[#2BD4FF]/40 h-10 text-base"
                data-testid="input-channel"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-zinc-200">Choose Your Avatar</Label>
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map((avatarName, index) => {
                  const Icon = (LucideIcons as any)[avatarName];
                  const colors = ["#2BD4FF", "#F3C94C", "#4E4DFF", "#6DFF9C", "#A259FF"];
                  const color = colors[index % colors.length];
                  const isSelected = selectedAvatar === avatarName;

                  return (
                    <button
                      key={avatarName}
                      onClick={() => setSelectedAvatar(avatarName)}
                      className={cn(
                        "aspect-square rounded-xl transition-all flex items-center justify-center border-2",
                        isSelected
                          ? "scale-105 shadow-[0_0_15px_rgba(43,212,255,0.4)]"
                          : "hover:scale-102"
                      )}
                      style={{
                        background: isSelected ? color : `${color}15`,
                        borderColor: isSelected ? color : `${color}40`,
                        color: isSelected ? "#0a1628" : color,
                      }}
                      data-testid={`button-avatar-${avatarName}`}
                    >
                      {Icon ? <Icon className="h-5 w-5 sm:h-6 sm:w-6" /> : avatarName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-0.5">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked: boolean) => setRememberMeLocal(!!checked)}
                className="border-[#2BD4FF]/50 data-[state=checked]:bg-[#2BD4FF] data-[state=checked]:border-[#2BD4FF] data-[state=checked]:text-[#0a1628] h-4 w-4"
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium text-zinc-300 cursor-pointer"
              >
                Remember Me
              </Label>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="w-full font-bold text-base h-10 mt-1 shadow-[0_0_20px_rgba(109,255,156,0.2)]"
              style={{
                background: "linear-gradient(135deg, #6DFF9C 0%, #4BCC7A 100%)",
                color: "#0a1628"
              }}
              data-testid="button-save-profile"
            >
              Let's Go!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
