export const initializeVoiceAssistant = () => {
  console.log('Voice assistant initialized');
  return { enabled: false };
};

export const startListening = () => {};
export const stopListening = () => {};

export default { initializeVoiceAssistant, startListening, stopListening };
