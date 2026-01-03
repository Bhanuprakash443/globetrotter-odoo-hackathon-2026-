"""
User routes
"""
from flask import Blueprint
from src.controllers.user_controller import UserController

bp = Blueprint('users', __name__)

bp.add_url_rule('/users', 'create', UserController.create, methods=['POST'])
bp.add_url_rule('/users/<int:user_id>', 'get', UserController.get, methods=['GET'])
bp.add_url_rule('/users/<int:user_id>/trips', 'get_trips', UserController.get_trips, methods=['GET'])
bp.add_url_rule('/users/<int:user_id>', 'update', UserController.update, methods=['PUT'])


