/**
 * User API service
 */
import api from './api';

export const userService = {
  // Create user
  createUser: (data) => api.post('/users', data),
  
  // Get user by ID
  getUser: (userId) => api.get(`/users/${userId}`),
  
  // Update user
  updateUser: (userId, data) => api.put(`/users/${userId}`, data),
};


