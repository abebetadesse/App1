import api from './api';
export const getMyCourses = () => api.get('/moodle/courses').then(res => res.data);
export const syncCourses = () => api.post('/moodle/sync');
