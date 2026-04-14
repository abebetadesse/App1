export const validateEnv = () => {
  const required = ['VITE_API_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  if (missing.length) {
    console.warn(`Missing optional env vars: ${missing.join(', ')}`);
  }
  return true;
};
