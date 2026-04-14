import React, { useState } from 'react';
import AdvancedSearchFilters from '../../components/search/AdvancedSearchFilters';
const AdvancedSearch = forwardRef((props, ref) {
  const [results, setResults] = useState([
    { id:1, name:'Alice Johnson', skill:'React Developer', rating:4.9, location:'Remote', rate:75 },
    { id:2, name:'Bob Smith', skill:'AI Engineer', rating:4.8, location:'New York', rate:120 }
  ]);
  const handleSearch = (filters) => {
    let filtered = [...results];
    if (filters.keyword) filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.keyword.toLowerCase()));
    if (filters.skill) filtered = filtered.filter(p => p.skill.toLowerCase().includes(filters.skill.toLowerCase()));
    if (filters.minRating) filtered = filtered.filter(p => p.rating >= parseFloat(filters.minRating));
    setResults(filtered);
  };
  return (
    <div className="container mt-4">
      <h1>Advanced Search</h1>
      <AdvancedSearchFilters onSearch={handleSearch} />
      <div className="list-group">
        {results.map(p => (<div key={p.id} className="list-group-item d-flex justify-content-between"><div><h5>{p.name}</h5><p>{p.skill} • ⭐{p.rating} • {p.location} • ${p.rate}/hr</p></div><button className="btn btn-sm btn-success">Connect</button></div>))}
      </div>
    </div>
  );
}
AdvancedSearch.displayName = 'AdvancedSearch';
