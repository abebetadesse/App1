import React from 'react';
import { useVoiceAssistant } from '../../contexts/VoiceAssistantContext';

export default function VoiceCommandPanel() {
  const { isListening, startListening, stopListening, transcript } = useVoiceAssistant();

  return (
    <div className="voice-command-panel fixed bottom-20 right-4 z-50">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-4 py-2 rounded-full font-semibold transition-all ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
      >
        {isListening ? '🎤 Listening...' : '🎙️ Voice Command'}
      </button>
      {transcript && (
        <div className="mt-2 text-sm bg-gray-800 text-white rounded-lg p-2">
          {transcript}
        </div>
      )}
    </div>
  );
}
