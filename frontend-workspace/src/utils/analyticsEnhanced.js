import { trackEvent } from './analytics';

export const initAnalytics = () => {
  console.log('Enhanced analytics initialized');
  // Track page views automatically
  if (typeof window !== 'undefined') {
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      trackEvent('page_view', { path: window.location.pathname });
    };
    window.addEventListener('popstate', () => {
      trackEvent('page_view', { path: window.location.pathname });
    });
  }
};
