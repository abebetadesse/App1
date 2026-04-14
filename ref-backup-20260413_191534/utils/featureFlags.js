export const initializeFeatureFlags = async () => {
  console.log('Feature flags initialized');
};

export const isFeatureEnabled = (flag) => true;
export const getFeatureFlag = (flag) => true;

export default { initializeFeatureFlags, isFeatureEnabled, getFeatureFlag };
