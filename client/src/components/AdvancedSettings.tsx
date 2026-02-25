/**
 * AdvancedSettings - Power user settings panel
 */
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Settings, Zap, Palette, Accessibility, Keyboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdvancedSettingsProps {
  open: boolean;
  onClose: () => void;
}

export function AdvancedSettings({ open, onClose }: AdvancedSettingsProps) {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    reducedMotion: localStorage.getItem('tubestar-reduced-motion') === 'true',
    highContrast: localStorage.getItem('tubestar-high-contrast') === 'true',
    particles: localStorage.getItem('tubestar-particles') !== 'false',
    autoSave: localStorage.getItem('tubestar-auto-save') !== 'false',
    soundEffects: localStorage.getItem('tubestar-sound-effects') !== 'false',
    keyboardShortcuts: localStorage.getItem('tubestar-keyboard-shortcuts') !== 'false',
  });
  
  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`tubestar-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, String(value));
    
    // Apply changes immediately
    if (key === 'reducedMotion') {
      document.documentElement.classList.toggle('reduce-motion', value);
    }
    if (key === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast', value);
    }
  };
  
  const handleSave = () => {
    toast({
      title: "Settings saved! ✅",
      description: "Your preferences have been updated.",
    });
    onClose();
  };
  
  const handleReset = () => {
    Object.keys(settings).forEach(key => {
      localStorage.removeItem(`tubestar-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
    });
    setSettings({
      reducedMotion: false,
      highContrast: false,
      particles: true,
      autoSave: true,
      soundEffects: true,
      keyboardShortcuts: true,
    });
    toast({
      title: "Settings reset! 🔄",
      description: "All settings restored to defaults.",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-[#0f1f3f] via-[#0c172c] to-[#0b1322] border-2 border-[#2BD4FF]/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-white flex items-center gap-3">
            <Settings className="h-6 w-6 text-[#2BD4FF]" />
            Advanced Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Accessibility */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Accessibility className="h-5 w-5 text-[#6DFF9C]" />
              <h3 className="font-semibold text-white">Accessibility</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a1628]/50">
                <Label htmlFor="reduced-motion" className="text-zinc-300 cursor-pointer">
                  Reduced Motion
                </Label>
                <Checkbox
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('reducedMotion', !!checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a1628]/50">
                <Label htmlFor="high-contrast" className="text-zinc-300 cursor-pointer">
                  High Contrast Mode
                </Label>
                <Checkbox
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', !!checked)}
                />
              </div>
            </div>
          </div>
          
          {/* Visual Effects */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-[#F3C94C]" />
              <h3 className="font-semibold text-white">Visual Effects</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a1628]/50">
                <Label htmlFor="particles" className="text-zinc-300 cursor-pointer">
                  Floating Particles
                </Label>
                <Checkbox
                  id="particles"
                  checked={settings.particles}
                  onCheckedChange={(checked) => updateSetting('particles', !!checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a1628]/50">
                <Label htmlFor="sound-effects" className="text-zinc-300 cursor-pointer">
                  Sound Effects
                </Label>
                <Checkbox
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => updateSetting('soundEffects', !!checked)}
                />
              </div>
            </div>
          </div>
          
          {/* Productivity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-[#A259FF]" />
              <h3 className="font-semibold text-white">Productivity</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a1628]/50">
                <Label htmlFor="auto-save" className="text-zinc-300 cursor-pointer">
                  Auto-save Drafts
                </Label>
                <Checkbox
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', !!checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a1628]/50">
                <Label htmlFor="keyboard-shortcuts" className="text-zinc-300 cursor-pointer">
                  Keyboard Shortcuts
                </Label>
                <Checkbox
                  id="keyboard-shortcuts"
                  checked={settings.keyboardShortcuts}
                  onCheckedChange={(checked) => updateSetting('keyboardShortcuts', !!checked)}
                />
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              onClick={handleReset}
              variant="secondary"
              className="flex-1"
            >
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-[#6DFF9C] to-[#4BCC7A] text-[#0a1628] font-semibold"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
