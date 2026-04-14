import React, { useState, useEffect } from 'react';
import { getJobs } from '../../services/jobs';
import { motion } from 'framer-motion';

const Search = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ query: '', minBudget: '', maxBudget: '' });
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs(filters);
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find Work</h1>
      <div className="flex gap-4 mb-6">
        <input placeholder="Search..." value={filters.query} onChange={e => setFilters({...filters, query: e.target.value})}
          className="flex-1 px-4 py-3 border rounded-xl" />
        <button onClick={fetchJobs} className="px-6 py-3 bg-indigo-600 text-white rounded-xl">Search</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <motion.div key={job.id} whileHover={{ scale: 1.01 }} className="widget">
              <h3 className="font-bold text-lg">{job.title}</h3>
              <p className="text-gray-600">{job.description?.substring(0, 150)}...</p>
              <div className="flex justify-between mt-4">
                <span>Budget: ${job.budgetMin} - ${job.budgetMax}</span>
                <button className="text-indigo-600">Apply</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Search;
