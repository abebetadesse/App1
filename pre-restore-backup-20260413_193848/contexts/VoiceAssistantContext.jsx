import React, { createContext, useContext, useCallback, useState } from 'react';

const VoiceAssistantContext = createContext({});

export const useVoiceAssistant = () => {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  }
  return context;
};

export const VoiceAssistantProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = useCallback(() => {
    setIsListening(true);
    // Simulate voice recognition (mock)
    console.log('Voice assistant started');
    // In a real implementation, you'd integrate with the Web Speech API
    return Promise.resolve();
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setTranscript('');
    console.log('Voice assistant stopped');
  }, []);

  const value = {
    isListening,
    transcript,
    startListening,
    stopListening,
  };

  return (
    <VoiceAssistantContext.Provider value={value}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};
