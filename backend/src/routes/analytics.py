"""
Analytics routes
"""
from flask import Blueprint
from src.controllers.analytics_controller import AnalyticsController

bp = Blueprint('analytics', __name__)

bp.add_url_rule('/analytics/popular-destinations', 'popular_destinations', AnalyticsController.get_popular_destinations, methods=['GET'])
bp.add_url_rule('/analytics/popular-activities', 'popular_activities', AnalyticsController.get_popular_activities, methods=['GET'])
bp.add_url_rule('/analytics/statistics', 'statistics', AnalyticsController.get_statistics, methods=['GET'])


