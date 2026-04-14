export const initializeErrorReporting = () => {
  console.log('Error reporting initialized');
};

export const reportError = (error, context = {}) => {
  console.error('Reported error:', error, context);
};

export default { initializeErrorReporting, reportError };
