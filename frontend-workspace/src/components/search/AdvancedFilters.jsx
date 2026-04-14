import React, { useState } from 'react';

const AdvancedFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    minBudget: '',
    maxBudget: '',
    rating: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    onFilterChange?.({ ...filters, [name]: value });
  };

  return (
    <div className="filter-widget">
      <h3 className="font-semibold mb-4 text-lg">Advanced Filters</h3>
      
      <div className="filter-section">
        <label className="filter-title">Category</label>
        <select name="category" value={filters.category} onChange={handleChange} className="form-select">
          <option value="">All Categories</option>
          <option>Development</option>
          <option>Design</option>
          <option>Writing</option>
          <option>Marketing</option>
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-title">Budget Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" name="minBudget" placeholder="Min" value={filters.minBudget} onChange={handleChange} className="form-input" />
          <input type="number" name="maxBudget" placeholder="Max" value={filters.maxBudget} onChange={handleChange} className="form-input" />
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-title">Minimum Rating</label>
        <select name="rating" value={filters.rating} onChange={handleChange} className="form-select">
          <option value="">Any Rating</option>
          <option>4.5+</option>
          <option>4.0+</option>
          <option>3.5+</option>
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-title">Location</label>
        <input type="text" name="location" placeholder="City or country" value={filters.location} onChange={handleChange} className="form-input" />
      </div>

      <button onClick={() => { setFilters({ category: '', minBudget: '', maxBudget: '', rating: '', location: '' }); onFilterChange?.({}); }}
        className="btn-outline w-full mt-2">Clear Filters</button>
    </div>
  );
};

export default AdvancedFilters;
