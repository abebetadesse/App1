import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { useEnhancedVoiceCommands } from '../../hooks/useEnhancedVoiceCommands';

export default function VoiceCommandInterface() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { startListening } = useEnhancedVoiceCommands();

  const toggleListening = async () => {
    if (listening) {
      setListening(false);
      setTranscript('');
      return;
    }
    setListening(true);
    try {
      const result = await startListening();
      setTranscript(result);
      setTimeout(() => setTranscript(''), 2000);
    } catch (err) {
      setTranscript('Command not recognized');
      setTimeout(() => setTranscript(''), 2000);
    } finally {
      setListening(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={listening ? { scale: [1, 1.2, 1], boxShadow: '0 0 0 4px rgba(100,108,255,0.4)' } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${listening ? 'bg-red-500' : 'bg-primary'} text-white`}
      >
        {listening ? <MicOff size={24} /> : <Mic size={24} />}
      </motion.button>
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-sm rounded-lg px-3 py-1 whitespace-nowrap"
          >
            {transcript}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
