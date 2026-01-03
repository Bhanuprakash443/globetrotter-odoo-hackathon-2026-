"""
Trip routes
"""
from flask import Blueprint
from src.controllers.trip_controller import TripController

bp = Blueprint('trips', __name__)

bp.add_url_rule('/trips', 'list_all', TripController.list_all, methods=['GET'])
bp.add_url_rule('/trips', 'create', TripController.create, methods=['POST'])
bp.add_url_rule('/trips/<int:trip_id>', 'get', TripController.get, methods=['GET'])
bp.add_url_rule('/trips/<int:trip_id>/complete', 'get_complete', TripController.get_complete, methods=['GET'])
bp.add_url_rule('/trips/<int:trip_id>/budget', 'get_budget', TripController.get_budget, methods=['GET'])
bp.add_url_rule('/trips/<int:trip_id>', 'update', TripController.update, methods=['PUT'])
bp.add_url_rule('/trips/<int:trip_id>', 'delete', TripController.delete, methods=['DELETE'])


