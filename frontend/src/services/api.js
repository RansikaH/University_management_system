import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Course API
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getByCode: (code) => api.get(`/courses/code/${code}`),
  search: (params) => api.get('/courses/search', { params }),
  getAvailable: () => api.get('/courses/available'),
  create: (course) => api.post('/courses', course),
  update: (id, course) => api.put(`/courses/${id}`, course),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Student API
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  getByStudentId: (studentId) => api.get(`/students/student-id/${studentId}`),
  search: (name) => api.get('/students/search', { params: { name } }),
  create: (student) => api.post('/students', student),
  update: (id, student) => api.put(`/students/${id}`, student),
  delete: (id) => api.delete(`/students/${id}`),
};

// Registration API
export const registrationAPI = {
  getAll: () => api.get('/registrations'),
  getByStudent: (studentId) => api.get(`/registrations/student/${studentId}`),
  getByCourse: (courseId) => api.get(`/registrations/course/${courseId}`),
  create: (registration) => api.post('/registrations', registration),
  update: (id, registration) => api.put(`/registrations/${id}`, registration),
  delete: (id) => api.delete(`/registrations/${id}`),
};

// Results API
export const resultAPI = {
  getAll: () => api.get('/results'),
  getById: (id) => api.get(`/results/${id}`),
  getByStudent: (studentId) => api.get(`/results/student/${studentId}`),
  getByCourse: (courseId) => api.get(`/results/course/${courseId}`),
  getByStudentAndCourse: (studentId, courseId) => api.get(`/results/student/${studentId}/course/${courseId}`),
  getStudentGPA: (studentId) => api.get(`/results/student/${studentId}/gpa`),
  getStudentAverage: (studentId) => api.get(`/results/student/${studentId}/average`),
  getCourseAverage: (courseId) => api.get(`/results/course/${courseId}/average`),
  create: (result) => api.post('/results', result),
  update: (id, result) => api.put(`/results/${id}`, result),
  delete: (id) => api.delete(`/results/${id}`),
};

export default api;
