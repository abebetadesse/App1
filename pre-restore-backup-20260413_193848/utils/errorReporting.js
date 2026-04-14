// Error reporting utility
export const initializeErrorReporting = () => {
  console.log('Error reporting initialized');
};

export const reportError = (error, context = {}) => {
  console.error('Error reported:', error, context);
};

export const captureException = (error) => {
  console.error('Exception captured:', error);
};

export default { initializeErrorReporting, reportError, captureException };
