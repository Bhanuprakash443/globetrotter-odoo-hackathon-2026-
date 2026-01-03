"""
User controller for handling user-related requests
"""
from flask import request, jsonify
from src.models.user import User

class UserController:
    @staticmethod
    def create():
        """Create a new user"""
        try:
            data = request.json
            
            # Validate required fields
            if not data.get('username'):
                return jsonify({'error': 'Username is required'}), 400
            if not data.get('email'):
                return jsonify({'error': 'Email is required'}), 400
            if not data.get('password'):
                return jsonify({'error': 'Password is required'}), 400
            
            # Check if username or email already exists
            existing_user = User.get_by_username(data.get('username'))
            if existing_user:
                return jsonify({'error': 'Username already exists'}), 400
            
            result = User.create(data)
            return jsonify({'id': result['id'], 'message': 'User created successfully'}), 201
        except Exception as e:
            error_msg = str(e)
            # Handle SQLite unique constraint errors
            if 'UNIQUE constraint failed' in error_msg:
                if 'username' in error_msg.lower():
                    return jsonify({'error': 'Username already exists. Please choose a different username.'}), 400
                elif 'email' in error_msg.lower():
                    return jsonify({'error': 'Email already exists. Please use a different email.'}), 400
            return jsonify({'error': error_msg}), 400
    
    @staticmethod
    def get(user_id):
        """Get user by ID"""
        user = User.get_by_id(user_id)
        if user:
            # Remove password from response
            user.pop('password', None)
            return jsonify(user)
        return jsonify({'error': 'User not found'}), 404
    
    @staticmethod
    def get_trips(user_id):
        """Get all trips for a user"""
        from src.models.trip import Trip
        trips = Trip.get_by_user(user_id)
        return jsonify(trips)
    
    @staticmethod
    def update(user_id):
        """Update user information"""
        try:
            data = request.json
            user = User.update(user_id, data)
            if user:
                user.pop('password', None)
                return jsonify(user)
            return jsonify({'error': 'User not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 400


