/**
 * Activity API service
 */
import api from './api';

export const activityService = {
  // Search activities
  searchActivities: (searchQuery, category) => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (category) params.category = category;
    return api.get('/activities', { params });
  },
};


