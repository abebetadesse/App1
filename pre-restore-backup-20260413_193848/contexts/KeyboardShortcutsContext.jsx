import React, { createContext, useContext, useEffect, useCallback } from 'react';

const KeyboardShortcutsContext = createContext({});
export const useKeyboardShortcuts = () => useContext(KeyboardShortcutsContext);

export const KeyboardShortcutsProvider = ({ children }) => {
  const shortcuts = new Map();

  const registerShortcut = useCallback((key, callback) => {
    const handler = (e) => {
      const keyMatch = key.toLowerCase();
      if (e.key.toLowerCase() === keyMatch && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        callback(e);
      }
    };
    window.addEventListener('keydown', handler);
    shortcuts.set(key, handler);
  }, []);

  const unregisterShortcut = useCallback((key) => {
    const handler = shortcuts.get(key);
    if (handler) {
      window.removeEventListener('keydown', handler);
      shortcuts.delete(key);
    }
  }, []);

  useEffect(() => {
    registerShortcut('?', () => alert('Shortcuts: ? - help, / - search, g d - go to dashboard'));
    registerShortcut('/', () => document.querySelector('input[type="search"]')?.focus());
    return () => {
      shortcuts.forEach((_, key) => unregisterShortcut(key));
    };
  }, [registerShortcut, unregisterShortcut]);

  return <KeyboardShortcutsContext.Provider value={{ registerShortcut, unregisterShortcut }}>{children}</KeyboardShortcutsContext.Provider>;
};
