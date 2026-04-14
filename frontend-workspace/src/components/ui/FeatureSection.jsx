import React from 'react';
import { motion } from 'framer-motion';

const FeatureSection = ({ title, subtitle, features }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="widget text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <f.icon size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
export default FeatureSection;
