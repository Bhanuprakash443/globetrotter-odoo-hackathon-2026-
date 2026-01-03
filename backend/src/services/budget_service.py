"""
Budget calculation and analysis service
"""
from src.config.database import get_db

class BudgetService:
    @staticmethod
    def get_budget_summary(trip_id):
        """Calculate budget summary for a trip"""
        conn = get_db()
        cursor = conn.cursor()
        
        # Get budget from sections
        cursor.execute('''
            SELECT COALESCE(SUM(budget), 0) as total_budget
            FROM itinerary_sections
            WHERE trip_id = ?
        ''', (trip_id,))
        section_budget = cursor.fetchone()['total_budget']
        
        # Get actual expenses
        cursor.execute('''
            SELECT COALESCE(SUM(amount), 0) as total_spent
            FROM expenses
            WHERE trip_id = ?
        ''', (trip_id,))
        total_spent = cursor.fetchone()['total_spent']
        
        conn.close()
        return {
            'budgeted': section_budget,
            'spent': total_spent,
            'remaining': section_budget - total_spent
        }
    
    @staticmethod
    def get_detailed_breakdown(trip_id):
        """Get detailed budget breakdown"""
        conn = get_db()
        cursor = conn.cursor()
        
        # Budget summary
        budget_summary = BudgetService.get_budget_summary(trip_id)
        
        # Expenses by section
        cursor.execute('''
            SELECT 
                isec.id,
                isec.title,
                isec.budget as budgeted,
                COALESCE(SUM(exp.amount), 0) as spent,
                (isec.budget - COALESCE(SUM(exp.amount), 0)) as remaining
            FROM itinerary_sections isec
            LEFT JOIN expenses exp ON isec.id = exp.itinerary_section_id
            WHERE isec.trip_id = ?
            GROUP BY isec.id, isec.title, isec.budget
        ''', (trip_id,))
        sections = [dict(row) for row in cursor.fetchall()]
        
        # Expenses by category
        cursor.execute('''
            SELECT 
                expense_category,
                SUM(amount) as total,
                COUNT(*) as transaction_count
            FROM expenses
            WHERE trip_id = ?
            GROUP BY expense_category
            ORDER BY total DESC
        ''', (trip_id,))
        expenses_by_category = [dict(row) for row in cursor.fetchall()]
        
        # Daily expenses
        cursor.execute('''
            SELECT 
                expense_date,
                SUM(amount) as daily_total,
                COUNT(*) as transaction_count
            FROM expenses
            WHERE trip_id = ? AND expense_date IS NOT NULL
            GROUP BY expense_date
            ORDER BY expense_date ASC
        ''', (trip_id,))
        daily_expenses = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            **budget_summary,
            'sections': sections,
            'expenses_by_category': expenses_by_category,
            'daily_expenses': daily_expenses
        }


