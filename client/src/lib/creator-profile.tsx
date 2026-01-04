import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CreatorProfile {
  name: string;
  channelName: string;
  avatar: string;
  rememberMe: boolean;
}

interface CreatorProfileContextType {
  profile: CreatorProfile;
  setName: (name: string) => void;
  setChannelName: (channelName: string) => void;
  setAvatar: (avatar: string) => void;
  setRememberMe: (rememberMe: boolean) => void;
  isSetup: boolean;
}

const defaultProfile: CreatorProfile = { name: '', channelName: '', avatar: 'Gamepad2', rememberMe: false };
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
        setProfile(parsed);
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
  return (
    <CreatorProfileContext.Provider value={{ profile, setName, setChannelName, setAvatar, setRememberMe, isSetup }}>
      {children}
    </CreatorProfileContext.Provider>
  );
}

export function useCreatorProfile() {
  const context = useContext(CreatorProfileContext);
  if (!context) throw new Error('useCreatorProfile must be used within a CreatorProfileProvider');
  return context;
}

export { AVATARS };
