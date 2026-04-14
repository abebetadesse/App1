export const logLevels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
let currentLevel = logLevels[import.meta.env.VITE_LOG_LEVEL || 'INFO'];

export const setLogLevel = (level) => { currentLevel = logLevels[level]; };

export const logDebug = (message, data) => { if (currentLevel <= logLevels.DEBUG) console.debug(`[DEBUG] ${message}`, data); };
export const logInfo = (message, data) => { if (currentLevel <= logLevels.INFO) console.info(`[INFO] ${message}`, data); };
export const logWarn = (message, data) => { if (currentLevel <= logLevels.WARN) console.warn(`[WARN] ${message}`, data); };
export const logError = (message, error) => { 
  console.error(`[ERROR] ${message}`, error);
  if (import.meta.env.PROD && window.Sentry) window.Sentry.captureException(error);
};

export const logEvent = (name, properties) => {
  logInfo(`Event: ${name}`, properties);
  if (window.gtag) window.gtag('event', name, properties);
};
