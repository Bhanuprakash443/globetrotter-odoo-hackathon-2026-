/**
 * Community API service
 */
import api from './api';

export const communityService = {
  // Get community posts
  getPosts: () => api.get('/community/posts'),
};

