"""
Expense controller for handling expense-related requests
"""
from flask import request, jsonify
from src.models.expense import Expense

class ExpenseController:
    @staticmethod
    def create(trip_id):
        """Create a new expense"""
        try:
            data = request.json
            data['trip_id'] = trip_id
            result = Expense.create(data)
            return jsonify({'id': result['id'], 'message': 'Expense added successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    
    @staticmethod
    def get_by_trip(trip_id):
        """Get all expenses for a trip"""
        expenses = Expense.get_by_trip(trip_id)
        return jsonify(expenses)


