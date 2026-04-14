import React from "react";
/* eslint-disable no-unused-vars */
import api from '../services/api';

const EnhancedSearch = () => {
  const [searchFields, setSearchFields] = useState([]);
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSearchableFields();
  }, []);

  const loadSearchableFields = async () => {
    try {
      const response = await api.get('/profile-fields/fields/active');
      const searchableFields = response.data.fields.filter(field => field.isSearchable);
      setSearchFields(searchableFields);
    } catch (error) {
      console.error('Error loading search fields:', error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.post('/search/profiles', {
        filters: filters
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSearchField = (field) => {
    switch (field.fieldType) {
      case 'text':
      case 'textarea':
        return (
          <input
            type="text"
            className="form-control"
            onChange={(e) => setFilters(prev => ({
              ...prev,
              [field.fieldName]: e.target.value
            }))}
            placeholder={`Search ${field.fieldLabel}`}
          />
        );
      
      case 'number':
        return (
          <div className="row">
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Min"
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  [`${field.fieldName}_min`]: e.target.value
                }))}
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Max"
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  [`${field.fieldName}_max`]: e.target.value
                }))}
              />
            </div>
          </div>
        );
      
      case 'select':
        return (
          <select
            className="form-control"
            onChange={(e) => setFilters(prev => ({
              ...prev,
              [field.fieldName]: e.target.value
            }))}
          >
            <option value="">Any {field.fieldLabel}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'boolean':
        return (
          <select
            className="form-control"
            onChange={(e) => setFilters(prev => ({
              ...prev,
              [field.fieldName]: e.target.value
            }))}
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Advanced Search</h4>
            </div>
            <div className="card-body">
              {searchFields.map(field => (
                <div key={field.id} className="mb-3">
                  <label className="form-label">{field.fieldLabel}</label>
                  {renderSearchField(field)}
                </div>
              ))}
              
              <button
                className="btn btn-primary w-100"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>Search Results</h4>
            </div>
            <div className="card-body">
              {results.length === 0 ? (
                <p className="text-muted">No results found. Try adjusting your search criteria.</p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <h5>{result.name}</h5>
                      <p className="text-muted">Match Score: {result.matchScore}%</p>
                      {/* Display custom field values */}
                      {searchFields.map(field => {
                        const value = result[field.fieldName];
                        return value ? (
                          <div key={field.id} className="mb-1">
                            <strong>{field.fieldLabel}:</strong> {value}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearch;