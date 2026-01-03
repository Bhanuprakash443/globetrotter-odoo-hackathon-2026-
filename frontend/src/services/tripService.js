/**
 * Trip API service
 */
import api from './api';

export const tripService = {
  // Get all trips for a user
  getUserTrips: (userId) => api.get(`/users/${userId}/trips`),
  
  // Get all trips (for calendar view)
  getAllTrips: () => api.get('/trips'),
  
  // Get trip by ID
  getTrip: (tripId) => api.get(`/trips/${tripId}`),
  
  // Get complete trip with all related data
  getCompleteTrip: (tripId) => api.get(`/trips/${tripId}/complete`),
  
  // Create trip
  createTrip: (data) => api.post('/trips', data),
  
  // Update trip
  updateTrip: (tripId, data) => api.put(`/trips/${tripId}`, data),
  
  // Delete trip
  deleteTrip: (tripId) => api.delete(`/trips/${tripId}`),
  
  // Get budget breakdown
  getBudget: (tripId) => api.get(`/trips/${tripId}/budget`),
  
  // Get activities for trip
  getTripActivities: (tripId) => api.get(`/trips/${tripId}/activities`),
};


