"""
AI routes
"""
from flask import Blueprint
from src.controllers.ai_controller import AIController

bp = Blueprint('ai', __name__)

bp.add_url_rule('/trips/<int:trip_id>/ai/optimize', 'optimize_itinerary', AIController.optimize_itinerary, methods=['GET'])
bp.add_url_rule('/trips/<int:trip_id>/ai/budget-analysis', 'analyze_budget', AIController.analyze_budget, methods=['GET'])


