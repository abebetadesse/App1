export const initializeAnalytics = () => console.log('Analytics initialized');
export const trackPageView = (path, data) => console.log('Page view:', path, data);
export const trackEvent = (name, data) => console.log('Event:', name, data);
export const trackPerformance = (name, data) => console.log('Performance:', name, data);
