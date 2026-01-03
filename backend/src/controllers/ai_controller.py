"""
AI Controller for handling AI feature requests
"""
from flask import request, jsonify
from src.services.ai_service import AIService

class AIController:
    @staticmethod
    def optimize_itinerary(trip_id):
        """Get AI-optimized itinerary"""
        try:
            result = AIService.optimize_itinerary(trip_id)
            if 'error' in result:
                return jsonify(result), 404
            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def analyze_budget(trip_id):
        """Get AI budget analysis"""
        try:
            result = AIService.analyze_budget(trip_id)
            if 'error' in result:
                return jsonify(result), 404
            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500


