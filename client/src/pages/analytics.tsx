import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Film, Lightbulb, FileText, Trophy, Target, Zap } from "lucide-react";

interface VideoStats {
  total: number;
  draft: number;
  inProgress: number;
  published: number;
}

export default function Analytics() {
  const { data: videoStats, isLoading } = useQuery<VideoStats>({
    queryKey: ['/api/video-projects/stats'],
  });

  const { data: ideas } = useQuery<any[]>({
    queryKey: ['/api/ideas'],
  });

  const { data: scripts } = useQuery<any[]>({
    queryKey: ['/api/scripts'],
  });

  const totalProjects = videoStats?.total ?? 0;
  const completedVideos = videoStats?.published ?? 0;
  const ideasSaved = ideas?.length ?? 0;
  const scriptsWritten = scripts?.length ?? 0;

  const achievements = [
    { 
      title: "First Idea", 
      description: "Save your first video idea",
      unlocked: ideasSaved >= 1,
      icon: Lightbulb,
      color: "#F3C94C"
    },
    { 
      title: "Script Writer", 
      description: "Write your first script",
      unlocked: scriptsWritten >= 1,
      icon: FileText,
      color: "#2BD4FF"
    },
    { 
      title: "Video Creator", 
      description: "Complete your first video",
      unlocked: completedVideos >= 1,
      icon: Film,
      color: "#6DFF9C"
    },
    { 
      title: "Idea Machine", 
      description: "Save 5 video ideas",
      unlocked: ideasSaved >= 5,
      icon: Zap,
      color: "#A259FF"
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2BD4FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#F3C94C] font-semibold">Your Progress</p>
        <h1 className="text-2xl font-display font-bold text-white">Creator Stats</h1>
        <p className="text-sm text-zinc-400 mt-1">Track your practice journey</p>
      </div>

      <div className="p-4 rounded-lg bg-[#0d1a2d]/80 border border-[#2BD4FF]/20">
        <div className="flex items-start gap-3">
          <Target className="h-5 w-5 text-[#2BD4FF] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-zinc-300">
              <span className="font-semibold text-white">TubeStar is your practice studio!</span> Everything you create here stays private. 
              When you're ready, you can use these skills on real YouTube with a parent's help.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-md bg-[#0d1a2d] border border-[#1a2a4a]/40">
          <div className="text-3xl font-bold text-[#2BD4FF]">{ideasSaved}</div>
          <p className="text-xs text-zinc-500 mt-1">Ideas Saved</p>
        </div>
        <div className="p-4 rounded-md bg-[#0d1a2d] border border-[#1a2a4a]/40">
          <div className="text-3xl font-bold text-[#F3C94C]">{scriptsWritten}</div>
          <p className="text-xs text-zinc-500 mt-1">Scripts Written</p>
        </div>
        <div className="p-4 rounded-md bg-[#0d1a2d] border border-[#1a2a4a]/40">
          <div className="text-3xl font-bold text-[#6DFF9C]">{completedVideos}</div>
          <p className="text-xs text-zinc-500 mt-1">Videos Made</p>
        </div>
        <div className="p-4 rounded-md bg-[#0d1a2d] border border-[#1a2a4a]/40">
          <div className="text-3xl font-bold text-[#A259FF]">{totalProjects}</div>
          <p className="text-xs text-zinc-500 mt-1">Total Projects</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Trophy className="h-4 w-4 text-[#F3C94C]" />
          Achievements
        </h2>
        <div className="space-y-2">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={achievement.title}
                className={`flex items-center gap-3 p-3 rounded-md border transition-all ${
                  achievement.unlocked 
                    ? 'bg-[#0d1a2d] border-[#1a2a4a]/40' 
                    : 'bg-[#0a1525]/50 border-[#1a2a4a]/20 opacity-50'
                }`}
              >
                <div 
                  className="p-2 rounded-lg shrink-0"
                  style={{ background: achievement.unlocked ? `${achievement.color}20` : '#1a2a4a30' }}
                >
                  <Icon 
                    className="h-4 w-4" 
                    style={{ color: achievement.unlocked ? achievement.color : '#4a5568' }} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white">{achievement.title}</h3>
                  <p className="text-xs text-zinc-500">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <div className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: `${achievement.color}20`, color: achievement.color }}>
                    Unlocked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
