import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Trophy, CheckCircle2, Clock, Zap, Star } from "lucide-react";
import { celebrateSuccess } from "@/lib/confetti";
import { useToast } from "@/hooks/use-toast";
import { incrementStat } from "@/lib/progress-tracking";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  emoji: string;
  timeLimit?: string;
}

const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'quick-idea',
    title: 'Quick Thinker',
    description: 'Generate 3 video ideas in one session',
    difficulty: 'easy',
    xpReward: 10,
    emoji: '💡',
  },
  {
    id: 'script-master',
    title: 'Script Speed Run',
    description: 'Write a complete script in under 10 minutes',
    difficulty: 'medium',
    xpReward: 25,
    emoji: '⚡',
    timeLimit: '10 min',
  },
  {
    id: 'thumbnail-three',
    title: 'Design Triple',
    description: 'Create 3 different thumbnail designs',
    difficulty: 'medium',
    xpReward: 20,
    emoji: '🎨',
  },
  {
    id: 'voice-warrior',
    title: 'Voice Warrior',
    description: 'Use voice input for an entire script',
    difficulty: 'hard',
    xpReward: 30,
    emoji: '🎤',
  },
  {
    id: 'complete-video',
    title: 'Full Package',
    description: 'Create idea + script + thumbnail for one video',
    difficulty: 'hard',
    xpReward: 50,
    emoji: '🎬',
  },
];

const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: 'consistency-king',
    title: 'Consistency King',
    description: 'Use TubeStar 5 days this week',
    difficulty: 'medium',
    xpReward: 100,
    emoji: '👑',
  },
  {
    id: 'idea-factory',
    title: 'Idea Factory',
    description: 'Generate 20 video ideas this week',
    difficulty: 'hard',
    xpReward: 150,
    emoji: '🏭',
  },
  {
    id: 'all-rounder',
    title: 'All-Rounder',
    description: 'Use every feature at least once',
    difficulty: 'hard',
    xpReward: 200,
    emoji: '⭐',
  },
];

export default function ChallengeMode() {
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('tubestar-completed-challenges');
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  const completeChallenge = (challengeId: string, xpReward: number) => {
    if (completedChallenges.includes(challengeId)) {
      toast({ title: "Already completed!", description: "You've already finished this challenge." });
      return;
    }

    const newCompleted = [...completedChallenges, challengeId];
    setCompletedChallenges(newCompleted);
    localStorage.setItem('tubestar-completed-challenges', JSON.stringify(newCompleted));
    
    // Track progress
    incrementStat('completedChallenges');
    
    celebrateSuccess();
    toast({
      title: "Challenge Complete! 🎉",
      description: `You earned ${xpReward} XP!`,
    });
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '#6DFF9C';
      case 'medium': return '#F3C94C';
      case 'hard': return '#FF6B6B';
    }
  };

  const dailyCompleted = DAILY_CHALLENGES.filter(c => completedChallenges.includes(c.id)).length;
  const weeklyCompleted = WEEKLY_CHALLENGES.filter(c => completedChallenges.includes(c.id)).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#A259FF]/20">
            <Target className="h-7 w-7 text-[#A259FF]" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Challenge Mode</h1>
        <p className="text-zinc-400 text-sm sm:text-base">
          Complete challenges to level up faster and unlock special badges!
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-[#122046] to-[#0a1628] border-[#6DFF9C]/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-[#6DFF9C]" />
                <h3 className="font-display text-lg text-white">Daily Challenges</h3>
              </div>
              <span className="text-2xl font-bold text-[#6DFF9C]">
                {dailyCompleted}/{DAILY_CHALLENGES.length}
              </span>
            </div>
            <div className="w-full h-2 bg-[#0a1628] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#6DFF9C] to-[#4BCC7A] transition-all duration-500"
                style={{ width: `${(dailyCompleted / DAILY_CHALLENGES.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#122046] to-[#0a1628] border-[#F3C94C]/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-[#F3C94C]" />
                <h3 className="font-display text-lg text-white">Weekly Challenges</h3>
              </div>
              <span className="text-2xl font-bold text-[#F3C94C]">
                {weeklyCompleted}/{WEEKLY_CHALLENGES.length}
              </span>
            </div>
            <div className="w-full h-2 bg-[#0a1628] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#F3C94C] to-[#ff9500] transition-all duration-500"
                style={{ width: `${(weeklyCompleted / WEEKLY_CHALLENGES.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenges */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-[#6DFF9C]" />
          <h2 className="text-xl font-display font-bold text-white">Daily Challenges</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {DAILY_CHALLENGES.map((challenge) => {
            const isCompleted = completedChallenges.includes(challenge.id);
            return (
              <Card 
                key={challenge.id}
                className={`bg-gradient-to-r from-[#122046] to-[#0a1628] transition-all ${
                  isCompleted ? 'border-[#6DFF9C]/50 opacity-75' : 'border-zinc-700 hover:border-[#2BD4FF]/30'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{challenge.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-lg text-white font-semibold">
                            {challenge.title}
                          </h3>
                          <span 
                            className="text-xs font-bold uppercase px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: `${getDifficultyColor(challenge.difficulty)}20`,
                              color: getDifficultyColor(challenge.difficulty)
                            }}
                          >
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-3">{challenge.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-[#F3C94C]">
                            <Star className="h-4 w-4" fill="#F3C94C" />
                            <span className="font-semibold">{challenge.xpReward} XP</span>
                          </div>
                          {challenge.timeLimit && (
                            <div className="flex items-center gap-2 text-zinc-500">
                              <Clock className="h-4 w-4" />
                              <span>{challenge.timeLimit}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => completeChallenge(challenge.id, challenge.xpReward)}
                      disabled={isCompleted}
                      className={`flex-shrink-0 ${
                        isCompleted 
                          ? 'bg-[#6DFF9C]/20 text-[#6DFF9C] cursor-not-allowed' 
                          : 'bg-gradient-to-r from-[#6DFF9C] to-[#4BCC7A] text-[#0a1628]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Done
                        </>
                      ) : (
                        'Complete'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Weekly Challenges */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-[#F3C94C]" />
          <h2 className="text-xl font-display font-bold text-white">Weekly Challenges</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {WEEKLY_CHALLENGES.map((challenge) => {
            const isCompleted = completedChallenges.includes(challenge.id);
            return (
              <Card 
                key={challenge.id}
                className={`bg-gradient-to-r from-[#122046] to-[#0a1628] transition-all ${
                  isCompleted ? 'border-[#F3C94C]/50 opacity-75' : 'border-zinc-700 hover:border-[#F3C94C]/30'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{challenge.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-lg text-white font-semibold">
                            {challenge.title}
                          </h3>
                          <span 
                            className="text-xs font-bold uppercase px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: `${getDifficultyColor(challenge.difficulty)}20`,
                              color: getDifficultyColor(challenge.difficulty)
                            }}
                          >
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-3">{challenge.description}</p>
                        <div className="flex items-center gap-2 text-sm text-[#F3C94C]">
                          <Star className="h-4 w-4" fill="#F3C94C" />
                          <span className="font-semibold">{challenge.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => completeChallenge(challenge.id, challenge.xpReward)}
                      disabled={isCompleted}
                      className={`flex-shrink-0 ${
                        isCompleted 
                          ? 'bg-[#F3C94C]/20 text-[#F3C94C] cursor-not-allowed' 
                          : 'bg-gradient-to-r from-[#F3C94C] to-[#ff9500] text-[#0a1628]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Done
                        </>
                      ) : (
                        'Complete'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Motivational Message */}
      {dailyCompleted === DAILY_CHALLENGES.length && weeklyCompleted === WEEKLY_CHALLENGES.length && (
        <Card className="bg-gradient-to-r from-[#A259FF]/20 to-[#2BD4FF]/20 border-[#A259FF]/50">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 text-[#F3C94C] mx-auto mb-3" />
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              🎉 All Challenges Complete!
            </h3>
            <p className="text-zinc-300">
              You're an absolute legend! Check back tomorrow for new daily challenges.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
