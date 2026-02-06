/**
 * Keyboard shortcuts system for power users
 */
import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        
        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

// Global shortcuts for app navigation
export const GLOBAL_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'h',
    ctrl: true,
    description: 'Go to Dashboard',
    action: () => window.location.href = '/',
  },
  {
    key: 'i',
    ctrl: true,
    description: 'Idea Generator',
    action: () => window.location.href = '/ideas',
  },
  {
    key: 's',
    ctrl: true,
    shift: true,
    description: 'Script Writer',
    action: () => window.location.href = '/script',
  },
  {
    key: 't',
    ctrl: true,
    description: 'Thumbnail Designer',
    action: () => window.location.href = '/thumbnail',
  },
  {
    key: 'p',
    ctrl: true,
    description: 'Progress Tracking',
    action: () => window.location.href = '/progress',
  },
  {
    key: 'c',
    ctrl: true,
    shift: true,
    description: 'Challenge Mode',
    action: () => window.location.href = '/challenge-mode',
  },
];

export function useGlobalKeyboardShortcuts() {
  useKeyboardShortcuts(GLOBAL_SHORTCUTS);
}
