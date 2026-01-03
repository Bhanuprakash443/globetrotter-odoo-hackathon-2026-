"""
Activity routes
"""
from flask import Blueprint
from src.controllers.activity_controller import ActivityController

bp = Blueprint('activities', __name__)

bp.add_url_rule('/activities', 'search', ActivityController.search, methods=['GET'])
bp.add_url_rule('/trips/<int:trip_id>/activities', 'get_by_trip', ActivityController.get_by_trip, methods=['GET'])


