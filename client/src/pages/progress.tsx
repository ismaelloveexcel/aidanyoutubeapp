import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCreatorProfile, calculateLevel, getXpProgress, XP_PER_LEVEL } from "@/lib/creator-profile";
import { useToast } from "@/hooks/use-toast";

interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

const ALL_BADGES: Badge[] = [
  { id: "first-video", name: "First Steps", description: "Record your first video", emoji: "🎬", unlocked: false },
  { id: "viral-title", name: "Viral Master", description: "Score 90+ on 5 titles", emoji: "🚀", unlocked: false },
  { id: "consistent", name: "Consistent Creator", description: "Post 4 weeks in a row", emoji: "📅", unlocked: false },
  { id: "idea-saver", name: "Idea Bank", description: "Save 10 video ideas", emoji: "💡", unlocked: false },
  { id: "script-writer", name: "Script Master", description: "Write 5 complete scripts", emoji: "📝", unlocked: false },
  { id: "thumbnail-pro", name: "Thumbnail Pro", description: "Create 10 thumbnails", emoji: "🎨", unlocked: false },
  { id: "sound-explorer", name: "Sound Explorer", description: "Use all sound effects", emoji: "🔊", unlocked: false },
  { id: "editor-apprentice", name: "Editor Apprentice", description: "Edit your first video", emoji: "✂️", unlocked: false },
  { id: "100-views", name: "100 Views", description: "Get 100 views on a video", emoji: "👀", unlocked: false },
  { id: "1000-views", name: "1K Views", description: "Get 1,000 views on a video", emoji: "⭐", unlocked: false },
  { id: "super-creator", name: "Super Creator", description: "Reach Level 10", emoji: "🏆", unlocked: false },
  { id: "template-master", name: "Template Master", description: "Use all video templates", emoji: "📋", unlocked: false },
];

const LEVELS = [
  { level: 1, name: "Beginner", xpRequired: 0, color: "hsl(0, 100%, 50%)" },
  { level: 2, name: "Newbie", xpRequired: 100, color: "hsl(30, 100%, 50%)" },
  { level: 3, name: "Creator", xpRequired: 200, color: "hsl(50, 100%, 50%)" },
  { level: 4, name: "Rising Star", xpRequired: 300, color: "hsl(100, 100%, 50%)" },
  { level: 5, name: "Content Maker", xpRequired: 400, color: "hsl(140, 100%, 50%)" },
  { level: 6, name: "Influencer", xpRequired: 500, color: "hsl(180, 100%, 50%)" },
  { level: 7, name: "Pro Creator", xpRequired: 600, color: "hsl(220, 100%, 50%)" },
  { level: 8, name: "Viral Sensation", xpRequired: 700, color: "hsl(280, 100%, 50%)" },
  { level: 9, name: "YouTube Star", xpRequired: 800, color: "hsl(320, 100%, 50%)" },
  { level: 10, name: "Legend", xpRequired: 900, color: "hsl(340, 100%, 50%)" },
];

export default function Progress() {
  const { profile, addXp } = useCreatorProfile();
  const { toast } = useToast();

  // Use XP and level from the actual profile, not hardcoded values
  const xp = profile.xp;
  const level = profile.level;

  const [badges, setBadges] = useState<Badge[]>(ALL_BADGES);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([
    { id: "1", title: "Create a Thumbnail", description: "Design and save a new thumbnail", xpReward: 50, completed: false },
    { id: "2", title: "Generate 3 Ideas", description: "Save 3 video ideas", xpReward: 30, completed: false },
    { id: "3", title: "Write a Script", description: "Complete a script using any template", xpReward: 75, completed: false },
  ]);

  const currentLevelInfo = LEVELS.find(l => l.level === level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === level + 1);
  const xpProgress = getXpProgress(xp);
  const xpToNextLevel = XP_PER_LEVEL - xpProgress;

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  const completeChallenge = (challengeId: string) => {
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    setDailyChallenges(challenges =>
      challenges.map(c =>
        c.id === challengeId ? { ...c, completed: true } : c
      )
    );

    // Add XP through the profile context (persisted)
    addXp(challenge.xpReward);
    const newXp = xp + challenge.xpReward;
    const newLevel = calculateLevel(newXp);

    // Check for level up
    if (newLevel > level) {
      const newLevelInfo = LEVELS.find(l => l.level === newLevel);
      toast({
        title: `🎉 Level Up!`,
        description: `You're now a ${newLevelInfo?.name || 'Level ' + newLevel}! Keep creating amazing content!`,
      });
    } else {
      toast({
        title: "Challenge Complete!",
        description: `+${challenge.xpReward} XP earned!`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">🏆 Your Progress</h1>
        <p className="text-gray-400">Level up and unlock awesome badges!</p>
      </div>

      {/* Level & XP */}
      <Card className="border-4" style={{ borderColor: currentLevelInfo.color }}>
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">
              {level}
            </div>
            <h2 className="font-display text-3xl mb-2">{currentLevelInfo.name}</h2>
            <p className="text-gray-400">
              {xp.toLocaleString()} XP
              {nextLevelInfo && ` • ${xpToNextLevel} XP to Level ${level + 1}`}
            </p>
          </div>

          {nextLevelInfo && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level {level}</span>
                <span>Level {level + 1}</span>
              </div>
              <div className="h-6 bg-[hsl(240,10%,15%)] rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(xpProgress / XP_PER_LEVEL) * 100}%`,
                    background: `linear-gradient(90deg, ${currentLevelInfo.color}, ${nextLevelInfo.color})`,
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      <div>
        <h2 className="font-display text-2xl mb-4">📅 Today's Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyChallenges.map(challenge => (
            <Card key={challenge.id} className={challenge.completed ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(50,100%,50%)] font-semibold">
                    +{challenge.xpReward} XP
                  </span>
                  <Button
                    size="sm"
                    onClick={() => completeChallenge(challenge.id)}
                    disabled={challenge.completed}
                  >
                    {challenge.completed ? "✓ Done" : "Complete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Unlocked Badges */}
      <div>
        <h2 className="font-display text-2xl mb-4">
          🎖️ Badges Unlocked ({unlockedBadges.length}/{badges.length})
        </h2>
        {unlockedBadges.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🏅</div>
              <p className="text-gray-400">
                Complete activities to unlock your first badge!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {unlockedBadges.map(badge => (
              <Card key={badge.id} className="text-center">
                <CardContent className="p-4">
                  <div className="text-5xl mb-2">{badge.emoji}</div>
                  <div className="font-semibold text-sm">{badge.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{badge.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Locked Badges */}
      <div>
        <h2 className="font-display text-2xl mb-4">🔒 Locked Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {lockedBadges.map(badge => (
            <Card key={badge.id} className="text-center opacity-50">
              <CardContent className="p-4">
                <div className="text-5xl mb-2 grayscale">{badge.emoji}</div>
                <div className="font-semibold text-sm">{badge.name}</div>
                <div className="text-xs text-gray-400 mt-1">{badge.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* XP Sources */}
      <Card>
        <CardHeader>
          <CardTitle>💎 How to Earn XP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Complete Daily Challenges</h4>
              <p className="text-sm text-gray-400">30-75 XP each</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Record a Video</h4>
              <p className="text-sm text-gray-400">100 XP</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Write a Script</h4>
              <p className="text-sm text-gray-400">50 XP</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Create a Thumbnail</h4>
              <p className="text-sm text-gray-400">25 XP</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Upload to YouTube</h4>
              <p className="text-sm text-gray-400">200 XP</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Get 100 Views</h4>
              <p className="text-sm text-gray-400">500 XP</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
