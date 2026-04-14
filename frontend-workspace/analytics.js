export const initializeAnalytics = () => {
  console.log('Analytics initialized');
};

export const trackPageView = (path, data) => {
  console.log('Page view:', path, data);
};

export const trackEvent = (eventName, data) => {
  console.log('Event:', eventName, data);
};

export const trackPerformance = (metric, data) => {
  console.log('Performance:', metric, data);
};

export default { initializeAnalytics, trackPageView, trackEvent, trackPerformance };
