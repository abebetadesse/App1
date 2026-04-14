import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const VisibilityContext = createContext({});
export const useVisibility = () => useContext(VisibilityContext);

// Default visibility settings for all widgets
const defaultSettings = {
  // Pages visibility
  showHomePage: { guest: true, user: true, admin: true },
  showFeaturesPage: { guest: true, user: true, admin: true },
  showPricingPage: { guest: true, user: true, admin: true },
  showFAQPage: { guest: true, user: true, admin: true },
  showContactPage: { guest: true, user: true, admin: true },
  showAboutPage: { guest: true, user: true, admin: true },
  showMarketplace: { guest: false, user: true, admin: true },
  showDashboard: { guest: false, user: true, admin: true },
  showNotifications: { guest: false, user: true, admin: true },
  showSettings: { guest: false, user: true, admin: true },
  showAdminPanel: { guest: false, user: false, admin: true },
  
  // Widgets visibility
  widgetAnnouncements: { guest: true, user: true, admin: true },
  widgetRecentActivity: { guest: false, user: true, admin: true },
  widgetRecommendedProfiles: { guest: false, user: true, admin: true },
  widgetStatsSummary: { guest: false, user: true, admin: true },
  widgetQuickStats: { guest: false, user: false, admin: true },
  widgetNewsTicker: { guest: true, user: true, admin: true },
  widgetWeather: { guest: true, user: true, admin: true },
  widgetBadges: { guest: false, user: true, admin: true },
};

export const VisibilityProvider = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('visibility_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSetting = (key, role, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], [role]: value }
    }));
  };

  const isVisible = (key) => {
    const setting = settings[key];
    if (!setting) return true;
    const role = user?.role || 'guest';
    return setting[role] ?? setting.guest ?? true;
  };

  useEffect(() => {
    localStorage.setItem('visibility_settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <VisibilityContext.Provider value={{ settings, updateSetting, isVisible }}>
      {children}
    </VisibilityContext.Provider>
  );
};
