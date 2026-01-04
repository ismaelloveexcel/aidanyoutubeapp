import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CreatorProfile {
  name: string;
  channelName: string;
  avatar: string;
  rememberMe: boolean;
  xp: number;
  level: number;
}

interface CreatorProfileContextType {
  profile: CreatorProfile;
  setName: (name: string) => void;
  setChannelName: (channelName: string) => void;
  setAvatar: (avatar: string) => void;
  setRememberMe: (rememberMe: boolean) => void;
  addXp: (amount: number) => void;
  isSetup: boolean;
}

// XP required per level (fixed amount)
const XP_PER_LEVEL = 100;
const calculateLevel = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;
const getXpProgress = (xp: number) => xp % XP_PER_LEVEL;

const defaultProfile: CreatorProfile = { name: 'Aidan', channelName: "Aidan's Channel", avatar: 'Rocket', rememberMe: true, xp: 0, level: 1 };
const AVATARS = ['Gamepad2', 'Clapperboard', 'Mic2', 'Palette', 'Rocket', 'Star', 'Flame', 'Heart', 'Ghost', 'Zap', 'Sword', 'Crown', 'Target', 'Gamepad', 'Headset'];
const CreatorProfileContext = createContext<CreatorProfileContextType | null>(null);

export function CreatorProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CreatorProfile>(defaultProfile);
  const [isSetup, setIsSetup] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('tubestar-profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure xp and level exist for backwards compatibility
        const xp = parsed.xp ?? 0;
        const level = calculateLevel(xp);
        setProfile({ ...defaultProfile, ...parsed, xp, level });
        setIsSetup(!!parsed.name);
      } catch (e) {}
    }
  }, []);
  const saveProfile = (newProfile: CreatorProfile) => {
    setProfile(newProfile);
    setIsSetup(!!newProfile.name);
    localStorage.setItem('tubestar-profile', JSON.stringify(newProfile));
  };
  const setName = (name: string) => saveProfile({ ...profile, name });
  const setChannelName = (channelName: string) => saveProfile({ ...profile, channelName });
  const setAvatar = (avatar: string) => saveProfile({ ...profile, avatar });
  const setRememberMe = (rememberMe: boolean) => saveProfile({ ...profile, rememberMe });
  const addXp = (amount: number) => {
    const newXp = profile.xp + amount;
    const newLevel = calculateLevel(newXp);
    saveProfile({ ...profile, xp: newXp, level: newLevel });
  };
  return (
    <CreatorProfileContext.Provider value={{ profile, setName, setChannelName, setAvatar, setRememberMe, addXp, isSetup }}>
      {children}
    </CreatorProfileContext.Provider>
  );
}

export function useCreatorProfile() {
  const context = useContext(CreatorProfileContext);
  if (!context) throw new Error('useCreatorProfile must be used within a CreatorProfileProvider');
  return context;
}

export { AVATARS, XP_PER_LEVEL, calculateLevel, getXpProgress };
