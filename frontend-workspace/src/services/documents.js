import api from './api';
export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append('document', file);
  return api.post('/documents', formData);
};
