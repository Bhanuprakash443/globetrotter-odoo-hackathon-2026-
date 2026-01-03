"""
Expense routes
"""
from flask import Blueprint
from src.controllers.expense_controller import ExpenseController

bp = Blueprint('expenses', __name__)

bp.add_url_rule('/trips/<int:trip_id>/expenses', 'create', ExpenseController.create, methods=['POST'])
bp.add_url_rule('/trips/<int:trip_id>/expenses', 'get_by_trip', ExpenseController.get_by_trip, methods=['GET'])


