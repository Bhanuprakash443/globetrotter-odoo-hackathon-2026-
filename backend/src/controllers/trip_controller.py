"""
Trip controller for handling trip-related requests
"""
from flask import request, jsonify
from src.models.trip import Trip

class TripController:
    @staticmethod
    def list_all():
        """Get all trips"""
        try:
            trips = Trip.get_all()
            return jsonify(trips), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def create():
        """Create a new trip"""
        try:
            data = request.json
            result = Trip.create(data)
            return jsonify({'id': result['id'], 'message': 'Trip created successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    
    @staticmethod
    def get(trip_id):
        """Get trip by ID"""
        trip = Trip.get_by_id(trip_id)
        if trip:
            return jsonify(trip)
        return jsonify({'error': 'Trip not found'}), 404
    
    @staticmethod
    def get_complete(trip_id):
        """Get complete trip with all related data"""
        trip = Trip.get_complete(trip_id)
        if trip:
            return jsonify(trip)
        return jsonify({'error': 'Trip not found'}), 404
    
    @staticmethod
    def get_budget(trip_id):
        """Get budget breakdown for trip"""
        from src.services.budget_service import BudgetService
        try:
            budget = BudgetService.get_detailed_breakdown(trip_id)
            return jsonify(budget)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def update(trip_id):
        """Update trip"""
        try:
            data = request.json
            trip = Trip.update(trip_id, data)
            if trip:
                return jsonify(trip)
            return jsonify({'error': 'Trip not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    
    @staticmethod
    def delete(trip_id):
        """Delete trip"""
        try:
            Trip.delete(trip_id)
            return jsonify({'message': 'Trip deleted successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400


