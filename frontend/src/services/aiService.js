/**
 * AI Service for Itinerary Optimization and Budget Intelligence
 */
import api from './api';

const aiService = {
  // Optimize itinerary using AI
  optimizeItinerary: (tripId) => 
    api.get(`/trips/${tripId}/ai/optimize`),
  
  // Analyze budget using AI
  analyzeBudget: (tripId) => 
    api.get(`/trips/${tripId}/ai/budget-analysis`),
};

export default aiService;
export { aiService };


