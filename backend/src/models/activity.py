"""
Activity model and data access methods
"""
from src.config.database import get_db

class Activity:
    @staticmethod
    def search(search_query=None, category=None):
        """Search activities"""
        conn = get_db()
        cursor = conn.cursor()
        
        query = '''
            SELECT a.*, c.name as city_name, c.country, c.cost_index
            FROM activities a
            LEFT JOIN cities c ON a.city_id = c.id
            WHERE 1=1
        '''
        params = []
        
        if search_query:
            query += ' AND (a.name LIKE ? OR a.city LIKE ? OR c.name LIKE ?)'
            params.extend([f'%{search_query}%', f'%{search_query}%', f'%{search_query}%'])
        
        if category:
            query += ' AND a.activity_type = ?'
            params.append(category)
        
        query += ' ORDER BY a.id DESC'
        
        cursor.execute(query, params)
        activities = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return activities
    
    @staticmethod
    def get_by_trip(trip_id):
        """Get all activities for a trip"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT a.*, 
                   isec.title as section_title,
                   c.name as city_name,
                   c.country
            FROM activities a
            JOIN itinerary_sections isec ON a.itinerary_section_id = isec.id
            LEFT JOIN cities c ON a.city_id = c.id
            WHERE isec.trip_id = ?
            ORDER BY isec.order_index ASC, a.day_number ASC, a.time_slot ASC
        ''', (trip_id,))
        
        activities = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return activities


