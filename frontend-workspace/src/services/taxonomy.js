import api from './api';

export const getTaxonomyTree = async () => {
  const response = await api.get('/taxonomy/tree');
  return response.data;
};

export const searchTaxonomy = async (query) => {
  const response = await api.get('/taxonomy/search', { params: { q: query } });
  return response.data;
};
