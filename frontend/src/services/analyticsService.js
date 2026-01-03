/**
 * Analytics API service
 */
import api from './api';

export const analyticsService = {
  // Get popular destinations
  getPopularDestinations: (limit = 10) => 
    api.get('/analytics/popular-destinations', { params: { limit } }),
  
  // Get popular activities
  getPopularActivities: () => api.get('/analytics/popular-activities'),
  
  // Get platform statistics
  getStatistics: () => api.get('/analytics/statistics'),
};


