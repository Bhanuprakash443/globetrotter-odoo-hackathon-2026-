"""
City model and data access methods
"""
from src.config.database import get_db

class City:
    @staticmethod
    def search(search_query=None, country=None):
        """Search cities"""
        conn = get_db()
        cursor = conn.cursor()
        
        query = '''
            SELECT c.*, 
                   COUNT(DISTINCT tc.trip_id) as trip_count
            FROM cities c
            LEFT JOIN trip_cities tc ON c.id = tc.city_id
            WHERE 1=1
        '''
        params = []
        
        # Handle search query - if provided and not empty, filter by it
        # SQLite doesn't support LOWER() with LIKE properly, so we'll use case-insensitive search differently
        if search_query and search_query.strip():
            search_term = search_query.strip().lower()
            # Use LIKE with both uppercase and lowercase patterns for case-insensitive search
            query += ' AND (LOWER(c.name) LIKE ? OR LOWER(c.country) LIKE ? OR c.name LIKE ? OR c.country LIKE ?)'
            search_pattern = f'%{search_term}%'
            params.extend([search_pattern, search_pattern, search_pattern, search_pattern])
        # If empty string or None, show all cities
        
        if country:
            query += ' AND c.country = ?'
            params.append(country)
        
        query += ' GROUP BY c.id ORDER BY c.popularity DESC, c.name ASC LIMIT 100'
        
        cursor.execute(query, params)
        cities = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return cities
    
    @staticmethod
    def get_by_id(city_id):
        """Get city by ID"""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM cities WHERE id = ?', (city_id,))
        city = cursor.fetchone()
        conn.close()
        return dict(city) if city else None
    
    @staticmethod
    def add_to_trip(trip_id, city_id, visit_order=0):
        """Add city to trip (many-to-many)"""
        conn = get_db()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO trip_cities (trip_id, city_id, visit_order)
                VALUES (?, ?, ?)
            ''', (trip_id, city_id, visit_order))
            conn.commit()
            conn.close()
            return True
        except Exception:
            conn.close()
            return False


