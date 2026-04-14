import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useEnhancedVoiceCommands = () => {
  const navigate = useNavigate();

  const commands = {
    'go to home': () => navigate('/'),
    'go to dashboard': () => navigate('/dashboard'),
    'go to search': () => navigate('/client/search'),
    'go to notifications': () => navigate('/notifications'),
    'go to settings': () => navigate('/settings'),
    'go to profile': () => navigate('/profile'),
    'show features': () => navigate('/features'),
    'show pricing': () => navigate('/pricing'),
    'help': () => alert('Available commands: go to home, dashboard, search, notifications, settings, profile, features, pricing, help')
  };

  const startListening = useCallback(() => {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Voice commands not supported in this browser');
        reject(new Error('Speech recognition not supported'));
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const command = commands[transcript];
        if (command) {
          command();
          resolve();
        } else {
          alert(`Command "${transcript}" not recognized. Say "help" for options.`);
          reject(new Error('Command not recognized'));
        }
      };
      recognition.onerror = (event) => {
        reject(event.error);
      };
      recognition.start();
    });
  }, [commands]);

  return { startListening };
};
