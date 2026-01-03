/**
 * API service configuration
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    
    // Better error handling
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data || {};
      const errorMessage = errorData.error || errorData.message || `Server error: ${error.response.status}`;
      return Promise.reject({ error: errorMessage, status: error.response.status });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({ 
        error: 'Cannot connect to server. Please make sure the backend is running on port 5000.',
        status: 0
      });
    } else {
      // Something else happened
      return Promise.reject({ error: error.message || 'An unexpected error occurred', status: 0 });
    }
  }
);

export default api;


