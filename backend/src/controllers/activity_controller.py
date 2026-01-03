"""
Activity controller for handling activity-related requests
"""
from flask import request, jsonify
from src.models.activity import Activity

class ActivityController:
    @staticmethod
    def search():
        """Search activities"""
        search_query = request.args.get('search', '')
        category = request.args.get('category', '')
        
        activities = Activity.search(
            search_query if search_query else None,
            category if category else None
        )
        return jsonify(activities)
    
    @staticmethod
    def get_by_trip(trip_id):
        """Get all activities for a trip"""
        activities = Activity.get_by_trip(trip_id)
        return jsonify(activities)


