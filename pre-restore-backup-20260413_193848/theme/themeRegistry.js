export const themes = {
  default: {
    name: 'Default Light',
    icon: '☀️',
    variables: {
      '--primary': '#6366f1',
      '--primary-dark': '#4f46e5',
      '--bg-primary': '#ffffff',
      '--bg-card': '#f9fafb',
      '--text-primary': '#1e293b',
      '--border-color': '#e2e8f0',
    }
  },
  dark: {
    name: 'Dark Mode',
    icon: '🌙',
    variables: {
      '--primary': '#818cf8',
      '--primary-dark': '#6366f1',
      '--bg-primary': '#0f172a',
      '--bg-card': '#1e293b',
      '--text-primary': '#f1f5f9',
      '--border-color': '#334155',
    }
  },
  ocean: {
    name: 'Ocean Blue',
    icon: '🌊',
    variables: {
      '--primary': '#0ea5e9',
      '--primary-dark': '#0284c7',
      '--bg-primary': '#f0f9ff',
      '--bg-card': '#ffffff',
      '--text-primary': '#0c4a6e',
      '--border-color': '#bae6fd',
    }
  },
  forest: {
    name: 'Forest Green',
    icon: '🌲',
    variables: {
      '--primary': '#10b981',
      '--primary-dark': '#059669',
      '--bg-primary': '#ecfdf5',
      '--bg-card': '#ffffff',
      '--text-primary': '#064e3b',
      '--border-color': '#a7f3d0',
    }
  },
  sunset: {
    name: 'Sunset',
    icon: '🌅',
    variables: {
      '--primary': '#f97316',
      '--primary-dark': '#ea580c',
      '--bg-primary': '#fff7ed',
      '--bg-card': '#ffffff',
      '--text-primary': '#7c2d12',
      '--border-color': '#fed7aa',
    }
  },
  purple: {
    name: 'Purple Haze',
    icon: '🟣',
    variables: {
      '--primary': '#a855f7',
      '--primary-dark': '#9333ea',
      '--bg-primary': '#faf5ff',
      '--bg-card': '#ffffff',
      '--text-primary': '#4c1d95',
      '--border-color': '#e9d5ff',
    }
  }
};

export const getTheme = (name) => themes[name] || themes.default;
export const getAllThemes = () => Object.keys(themes).map(key => ({ id: key, ...themes[key] }));
