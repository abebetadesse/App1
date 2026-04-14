import React, { useState, useEffect } from 'react';
import { getMyCourses } from '../../services/moodle';
import { motion } from 'framer-motion';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => { getMyCourses().then(setCourses); }, []);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses (Moodle)</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {courses.map(c => (
          <motion.div key={c.id} whileHover={{ scale: 1.02 }} className="widget p-6">
            <h3 className="font-bold">{c.fullname}</h3>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-indigo-600 rounded-full" style={{ width: `${c.progress || 0}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Courses;
