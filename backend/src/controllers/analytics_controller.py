"""
Analytics controller for handling analytics requests
"""
from flask import request, jsonify
from src.services.analytics_service import AnalyticsService

class AnalyticsController:
    @staticmethod
    def get_popular_destinations():
        """Get popular destinations"""
        limit = int(request.args.get('limit', 10))
        destinations = AnalyticsService.get_popular_destinations(limit)
        return jsonify(destinations)
    
    @staticmethod
    def get_popular_activities():
        """Get popular activities"""
        activities = AnalyticsService.get_popular_activities()
        return jsonify(activities)
    
    @staticmethod
    def get_statistics():
        """Get platform statistics"""
        stats = AnalyticsService.get_user_statistics()
        return jsonify(stats)

