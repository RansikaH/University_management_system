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

// Token management
const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_info';

export const tokenService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenService.clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
  getMyRegistrations: () => api.get('/registrations/my-registrations'),
  create: async (registration) => {
    try {
      console.log('Creating registration with data:', registration);
      const response = await api.post('/registrations', registration);
      console.log('Registration created successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error creating registration:', error.response?.data || error.message);
      if (error.response?.status === 409) {
        throw new Error('You are already enrolled in this course');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid registration data');
      } else if (error.response?.status === 404) {
        throw new Error('Course or student not found');
      }
      throw error;
    }
  },
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
  getMyResults: () => api.get('/results/my-results'),
  getMyGPA: () => api.get('/results/my-gpa'),
  getMyAverage: () => api.get('/results/my-average'),
  create: (result) => api.post('/results', result),
  update: (id, result) => api.put(`/results/${id}`, result),
  delete: (id) => api.delete(`/results/${id}`),
};

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  registerStudent: (studentData) => api.post('/auth/register/student', studentData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  getCurrentUserStudent: () => api.get('/auth/current/student'),
  getRoles: () => api.get('/auth/roles'),
};

// User Management API (Admin only)
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getByRole: (role) => api.get(`/users/role/${role}`),
  search: (name) => api.get('/users/search', { params: { name } }),
  getStats: () => api.get('/users/stats'),
  update: (id, user) => api.put(`/users/${id}`, user),
  toggleStatus: (id) => api.put(`/users/${id}/toggle-status`),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
