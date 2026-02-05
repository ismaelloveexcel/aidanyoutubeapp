// Progress tracking and achievement system for TubeStar

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: number;
  category: 'create' | 'streak' | 'milestone' | 'special';
}

export const BADGES: Badge[] = [
  // Create badges
  {
    id: 'first-idea',
    name: 'Idea Starter',
    description: 'Generated your first video idea',
    emoji: '💡',
    requirement: 1,
    category: 'create',
  },
  {
    id: 'idea-machine',
    name: 'Idea Machine',
    description: 'Generated 10 video ideas',
    emoji: '🤖',
    requirement: 10,
    category: 'create',
  },
  {
    id: 'first-script',
    name: 'Scriptwriter',
    description: 'Wrote your first script',
    emoji: '📝',
    requirement: 1,
    category: 'create',
  },
  {
    id: 'script-master',
    name: 'Script Master',
    description: 'Created 5 scripts',
    emoji: '📜',
    requirement: 5,
    category: 'create',
  },
  {
    id: 'first-thumbnail',
    name: 'Designer',
    description: 'Created your first thumbnail',
    emoji: '🎨',
    requirement: 1,
    category: 'create',
  },
  {
    id: 'thumbnail-pro',
    name: 'Thumbnail Pro',
    description: 'Designed 10 thumbnails',
    emoji: '🖼️',
    requirement: 10,
    category: 'create',
  },
  
  // Streak badges
  {
    id: 'streak-3',
    name: 'On Fire',
    description: '3 day streak',
    emoji: '🔥',
    requirement: 3,
    category: 'streak',
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: '7 day streak',
    emoji: '⚡',
    requirement: 7,
    category: 'streak',
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: '30 day streak',
    emoji: '🏆',
    requirement: 30,
    category: 'streak',
  },
  
  // Milestone badges
  {
    id: 'bronze-creator',
    name: 'Bronze Creator',
    description: 'Reached Level 5',
    emoji: '🥉',
    requirement: 5,
    category: 'milestone',
  },
  {
    id: 'silver-creator',
    name: 'Silver Creator',
    description: 'Reached Level 10',
    emoji: '🥈',
    requirement: 10,
    category: 'milestone',
  },
  {
    id: 'gold-creator',
    name: 'Gold Creator',
    description: 'Reached Level 20',
    emoji: '🥇',
    requirement: 20,
    category: 'milestone',
  },
  
  // Special badges
  {
    id: 'completed-onboarding',
    name: 'Getting Started',
    description: 'Completed the onboarding wizard',
    emoji: '🎯',
    requirement: 1,
    category: 'special',
  },
  {
    id: 'voice-recorder',
    name: 'Voice Star',
    description: 'Used voice input for scripts',
    emoji: '🎤',
    requirement: 1,
    category: 'special',
  },
  {
    id: 'challenge-complete',
    name: 'Challenge Accepted',
    description: 'Completed a daily challenge',
    emoji: '✅',
    requirement: 1,
    category: 'special',
  },
];

export interface ProgressStats {
  ideasGenerated: number;
  scriptsCreated: number;
  thumbnailsDesigned: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  completedChallenges: number;
  unlockedBadges: string[];
}

const STORAGE_KEY = 'tubestar-progress';

export function getProgressStats(): ProgressStats {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse progress stats:', e);
    }
  }
  
  return {
    ideasGenerated: 0,
    scriptsCreated: 0,
    thumbnailsDesigned: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedChallenges: 0,
    unlockedBadges: [],
  };
}

export function saveProgressStats(stats: ProgressStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function incrementStat(statName: keyof Pick<ProgressStats, 'ideasGenerated' | 'scriptsCreated' | 'thumbnailsDesigned' | 'completedChallenges'>): Badge | null {
  const stats = getProgressStats();
  stats[statName]++;
  
  // Update streak
  updateStreak(stats);
  
  saveProgressStats(stats);
  
  // Check for new badges
  return checkForNewBadge(stats);
}

export function unlockBadge(badgeId: string) {
  const stats = getProgressStats();
  if (!stats.unlockedBadges.includes(badgeId)) {
    stats.unlockedBadges.push(badgeId);
    saveProgressStats(stats);
  }
}

function updateStreak(stats: ProgressStats) {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = stats.lastActiveDate;
  
  if (lastActive === today) {
    // Already counted today
    return;
  }
  
  const lastDate = new Date(lastActive);
  const todayDate = new Date(today);
  const dayDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (dayDiff === 1) {
    // Consecutive day
    stats.currentStreak++;
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }
  } else if (dayDiff > 1) {
    // Streak broken
    stats.currentStreak = 1;
  }
  
  stats.lastActiveDate = today;
}

function checkForNewBadge(stats: ProgressStats): Badge | null {
  // Check for create badges
  for (const badge of BADGES) {
    if (stats.unlockedBadges.includes(badge.id)) {
      continue; // Already unlocked
    }
    
    let shouldUnlock = false;
    
    if (badge.id === 'first-idea' && stats.ideasGenerated >= 1) shouldUnlock = true;
    if (badge.id === 'idea-machine' && stats.ideasGenerated >= 10) shouldUnlock = true;
    if (badge.id === 'first-script' && stats.scriptsCreated >= 1) shouldUnlock = true;
    if (badge.id === 'script-master' && stats.scriptsCreated >= 5) shouldUnlock = true;
    if (badge.id === 'first-thumbnail' && stats.thumbnailsDesigned >= 1) shouldUnlock = true;
    if (badge.id === 'thumbnail-pro' && stats.thumbnailsDesigned >= 10) shouldUnlock = true;
    if (badge.id === 'streak-3' && stats.currentStreak >= 3) shouldUnlock = true;
    if (badge.id === 'streak-7' && stats.currentStreak >= 7) shouldUnlock = true;
    if (badge.id === 'streak-30' && stats.currentStreak >= 30) shouldUnlock = true;
    if (badge.id === 'challenge-complete' && stats.completedChallenges >= 1) shouldUnlock = true;
    
    if (shouldUnlock) {
      unlockBadge(badge.id);
      return badge;
    }
  }
  
  return null;
}

export function getUnlockedBadges(): Badge[] {
  const stats = getProgressStats();
  return BADGES.filter(badge => stats.unlockedBadges.includes(badge.id));
}

export function getLockedBadges(): Badge[] {
  const stats = getProgressStats();
  return BADGES.filter(badge => !stats.unlockedBadges.includes(badge.id));
}
