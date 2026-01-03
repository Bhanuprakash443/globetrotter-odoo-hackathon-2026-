"""
Expense model and data access methods
"""
from src.config.database import get_db

class Expense:
    @staticmethod
    def create(data):
        """Create a new expense"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO expenses (trip_id, itinerary_section_id, activity_id, expense_category, amount, currency, description, expense_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('trip_id'),
            data.get('itinerary_section_id'),
            data.get('activity_id'),
            data.get('expense_category'),
            data.get('amount'),
            data.get('currency', 'USD'),
            data.get('description'),
            data.get('expense_date')
        ))
        conn.commit()
        expense_id = cursor.lastrowid
        conn.close()
        return {'id': expense_id}
    
    @staticmethod
    def get_by_trip(trip_id):
        """Get all expenses for a trip"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                exp.*,
                isec.title as section_title,
                a.name as activity_name
            FROM expenses exp
            LEFT JOIN itinerary_sections isec ON exp.itinerary_section_id = isec.id
            LEFT JOIN activities a ON exp.activity_id = a.id
            WHERE exp.trip_id = ?
            ORDER BY exp.expense_date DESC, exp.created_at DESC
        ''', (trip_id,))
        
        expenses = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return expenses


