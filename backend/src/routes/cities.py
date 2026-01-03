"""
City routes
"""
from flask import Blueprint
from src.controllers.city_controller import CityController

bp = Blueprint('cities', __name__)

bp.add_url_rule('/cities', 'search', CityController.search, methods=['GET'])
bp.add_url_rule('/cities/search', 'real_time_search', CityController.real_time_search, methods=['GET'])
bp.add_url_rule('/cities/<int:city_id>', 'get', CityController.get, methods=['GET'])
bp.add_url_rule('/cities/<path:city_name>/details', 'get_details', CityController.get_details, methods=['GET'])
bp.add_url_rule('/trips/<int:trip_id>/cities', 'add_to_trip', CityController.add_to_trip, methods=['POST'])


