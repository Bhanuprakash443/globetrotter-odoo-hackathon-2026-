/**
 * City API service
 */
import api from './api';

export const cityService = {
  // Search cities - uses real-time search
  searchCities: (searchQuery, country) => {
    const params = {};
    // Always use real-time search endpoint
    if (searchQuery && searchQuery.trim()) {
      params.q = searchQuery.trim();
      return api.get('/cities/search', { params });
    }
    // If no search query, get all cities
    if (country && country !== 'all') {
      params.country = country;
    }
    return api.get('/cities', { params });
  },
  
  // Get city by ID
  getCity: (cityId) => api.get(`/cities/${cityId}`),
  
  // Get city details (hotels, shopping, etc.)
  getCityDetails: (cityName) => api.get(`/cities/${encodeURIComponent(cityName)}/details`),
  
  // Add city to trip
  addCityToTrip: (tripId, cityId, visitOrder = 0) => 
    api.post(`/trips/${tripId}/cities`, { city_id: cityId, visit_order: visitOrder }),
};


