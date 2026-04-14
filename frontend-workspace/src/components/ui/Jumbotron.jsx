import React from 'react';
import { motion } from 'framer-motion';

const Jumbotron = ({ title, subtitle, cta, onCtaClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="jumbotron"
  >
    <div className="jumbotron-content text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
      <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">{subtitle}</p>
      {cta && (
        <button onClick={onCtaClick} className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full text-lg shadow-lg transition">
          {cta}
        </button>
      )}
    </div>
  </motion.div>
);
export default Jumbotron;
