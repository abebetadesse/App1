/* eslint-disable no-unused-vars */
import { useCallback } from 'react';
import { useSearch } from '../contexts/SearchContext';

export const useSearchOperations = () => {
  const { performSearch, setQuery, setFilters, setSort } = useSearch();

  const searchByCategory = useCallback((category) => {
    setQuery('');
    setFilters({ serviceCategory: category });
    return performSearch({ filters: { serviceCategory: category } });
  }, [setQuery, setFilters, performSearch]);

  const searchBySkill = useCallback((skill) => {
    setQuery('');
    setFilters(prev => ({ 
      ...prev, 
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
    return performSearch();
  }, [setQuery, setFilters, performSearch]);

  const searchNearby = useCallback((radius = 50) => {
    setFilters({ distance: radius });
    return performSearch();
  }, [setFilters, performSearch]);

  const searchByAvailability = useCallback((availability) => {
    setFilters({ availability });
    return performSearch();
  }, [setFilters, performSearch]);

  const searchByPriceRange = useCallback((min, max) => {
    setFilters({ minHourlyRate: min, maxHourlyRate: max });
    return performSearch();
  }, [setFilters, performSearch]);

  return {
    searchByCategory,
    searchBySkill,
    searchNearby,
    searchByAvailability,
    searchByPriceRange
  };
};

export default useSearchOperations;