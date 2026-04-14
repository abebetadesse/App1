import React, { useState } from 'react';
import { searchProfiles } from '../../services/search';
import { motion } from 'framer-motion';

const AdvancedSearch = () => {
  const [filters, setFilters] = useState({ serviceCategory: '', minExperience: '', maxHourlyRate: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await searchProfiles(filters);
      setResults(res.data.matches);
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Find Top Talent</h1>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <input placeholder="Category" value={filters.serviceCategory} onChange={e => setFilters({...filters, serviceCategory: e.target.value})} className="p-3 border rounded-xl" />
        <input placeholder="Min Experience (years)" type="number" value={filters.minExperience} onChange={e => setFilters({...filters, minExperience: e.target.value})} className="p-3 border rounded-xl" />
        <input placeholder="Max Rate ($/hr)" type="number" value={filters.maxHourlyRate} onChange={e => setFilters({...filters, maxHourlyRate: e.target.value})} className="p-3 border rounded-xl" />
        <button onClick={handleSearch} className="btn-premium">Search</button>
      </div>
      {loading ? <div>Searching...</div> : (
        <div className="grid gap-4">
          {results.map(p => (
            <motion.div key={p.id} whileHover={{ scale: 1.01 }} className="widget p-6">
              <div className="flex justify-between">
                <h3 className="font-bold">{p.User?.email}</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Match: {p.matchScore}%</span>
              </div>
              <p>Category: {p.serviceCategory} | Rate: ${p.hourlyRate}/hr</p>
              <button className="mt-4 text-indigo-600">Connect →</button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AdvancedSearch;
