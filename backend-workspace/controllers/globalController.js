/**
 * Global Controller - Handles global application data and utilities
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global application state
let globalMenus = null;
let appSettings = null;
let globalData = {};

// Set global menus (called from server.js)
export const setGlobalMenus = (menus) => {
  globalMenus = menus;
  console.log('✅ Global menus set:', Object.keys(menus).length, 'menu categories');
};

// Get global menus
export const getGlobalMenus = () => {
  return globalMenus || {};
};

// Load application settings
export const loadAppSettings = () => {
  try {
    const settingsPath = path.join(__dirname, '../config/settings.json');
    
    if (fs.existsSync(settingsPath)) {
      const settingsData = fs.readFileSync(settingsPath, 'utf8');
      appSettings = JSON.parse(settingsData);
      console.log('✅ Application settings loaded');
    } else {
      // Default settings
      appSettings = {
        appName: 'Tham Platform',
        version: '2.0.0',
        maintenance: false,
        features: {
          fileUpload: true,
          notifications: true,
          analytics: true,
        },
        limits: {
          maxFileSize: 10 * 1024 * 1024, // 10MB
          maxRequestSize: '10mb',
          rateLimit: 100,
        },
      };
      console.log('⚠️ Using default application settings');
    }
    
    return appSettings;
  } catch (error) {
    console.error('❌ Error loading app settings:', error);
    appSettings = getDefaultSettings();
    return appSettings;
  }
};

// Get application settings
export const getAppSettings = () => {
  if (!appSettings) {
    return loadAppSettings();
  }
  return appSettings;
};

// Set global data
export const setGlobalData = (key, value) => {
  globalData[key] = value;
  return { success: true, key, value };
};

// Get global data
export const getGlobalData = (key) => {
  if (key) {
    return globalData[key] || null;
  }
  return globalData;
};

// Clear global data
export const clearGlobalData = (key) => {
  if (key) {
    delete globalData[key];
    return { success: true, message: `Cleared data for key: ${key}` };
  }
  
  globalData = {};
  return { success: true, message: 'Cleared all global data' };
};

// Application health check
export const appHealthCheck = () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'connected', // This would be checked separately
    settings: appSettings ? 'loaded' : 'not loaded',
    menus: globalMenus ? 'loaded' : 'not loaded',
  };
};

// Load menu from JSON file
export const loadMenuFromFile = (filePath) => {
  try {
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(__dirname, '..', filePath);
    
    if (fs.existsSync(absolutePath)) {
      const menuData = fs.readFileSync(absolutePath, 'utf8');
      const menus = JSON.parse(menuData);
      setGlobalMenus(menus);
      return { success: true, message: 'Menu loaded from file', data: menus };
    } else {
      console.warn('⚠️ Menu file not found:', absolutePath);
      return { success: false, message: 'Menu file not found' };
    }
  } catch (error) {
    console.error('❌ Error loading menu:', error);
    return { success: false, message: error.message };
  }
};

// Default settings
const getDefaultSettings = () => {
  return {
    appName: 'Tham Platform',
    version: '2.0.0',
    maintenance: false,
    features: {
      fileUpload: true,
      notifications: true,
      analytics: true,
      chat: true,
      fileStorage: true,
    },
    limits: {
      maxFileSize: 10 * 1024 * 1024,
      maxRequestSize: '10mb',
      rateLimit: 100,
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    },
    security: {
      requireHTTPS: process.env.NODE_ENV === 'production',
      enableCORS: true,
      enableRateLimit: true,
      enableCSRF: true,
    },
  };
};

// Initialize global controller
export const initializeGlobalController = async () => {
  try {
    // Load settings
    loadAppSettings();
    
    // Set default global data
    setGlobalData('startupTime', new Date().toISOString());
    setGlobalData('environment', process.env.NODE_ENV || 'development');
    setGlobalData('serverVersion', '2.0.0');
    
    console.log('✅ Global controller initialized');
    return { success: true, message: 'Global controller initialized' };
  } catch (error) {
    console.error('❌ Global controller initialization failed:', error);
    return { success: false, message: error.message };
  }
};

export default {
  setGlobalMenus,
  getGlobalMenus,
  loadAppSettings,
  getAppSettings,
  setGlobalData,
  getGlobalData,
  clearGlobalData,
  appHealthCheck,
  loadMenuFromFile,
  initializeGlobalController,
};