import { useEffect, useCallback } from 'react';
export const useKeyboardShortcuts = () => {
  const shortcuts = new Map();
  const registerShortcut = useCallback((key, callback) => {
    const handler = (e) => {
      const parts = key.toLowerCase().split('+');
      const keyMatch = parts.pop();
      const ctrl = parts.includes('ctrl');
      const shift = parts.includes('shift');
      const alt = parts.includes('alt');
      const meta = parts.includes('meta');
      if ((ctrl === e.ctrlKey) && (shift === e.shiftKey) && (alt === e.altKey) && (meta === e.metaKey) && e.key.toLowerCase() === keyMatch) {
        e.preventDefault();
        callback(e);
      }
    };
    window.addEventListener('keydown', handler);
    shortcuts.set(key, handler);
  }, []);
  const unregisterShortcut = useCallback((key) => {
    const handler = shortcuts.get(key);
    if (handler) window.removeEventListener('keydown', handler);
  }, []);
  useEffect(() => () => shortcuts.forEach((h) => window.removeEventListener('keydown', h)), []);
  return { registerShortcut, unregisterShortcut };
};
