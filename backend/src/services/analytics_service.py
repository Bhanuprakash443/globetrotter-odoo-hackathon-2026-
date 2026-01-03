"""
Analytics and statistics service
"""
from src.config.database import get_db

class AnalyticsService:
    @staticmethod
    def get_popular_destinations(limit=10):
        """Get most popular destinations"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                c.id,
                c.name,
                c.country,
                COUNT(DISTINCT tc.trip_id) as trip_count,
                COUNT(DISTINCT tc.trip_id) * 100.0 / (SELECT COUNT(*) FROM trips) as popularity_percentage
            FROM cities c
            JOIN trip_cities tc ON c.id = tc.city_id
            GROUP BY c.id, c.name, c.country
            ORDER BY trip_count DESC
            LIMIT ?
        ''', (limit,))
        
        destinations = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return destinations
    
    @staticmethod
    def get_popular_activities():
        """Get activity statistics"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                activity_type,
                COUNT(*) as count,
                AVG(cost) as avg_cost,
                SUM(cost) as total_cost
            FROM activities
            WHERE activity_type IS NOT NULL
            GROUP BY activity_type
            ORDER BY count DESC
        ''')
        
        activities = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return activities
    
    @staticmethod
    def get_user_statistics():
        """Get platform statistics"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                COUNT(DISTINCT u.id) as total_users,
                COUNT(DISTINCT t.id) as total_trips,
                COUNT(DISTINCT isec.id) as total_sections,
                COUNT(DISTINCT a.id) as total_activities,
                COUNT(DISTINCT c.id) as total_cities,
                COUNT(DISTINCT cp.id) as total_posts
            FROM users u
            LEFT JOIN trips t ON u.id = t.user_id
            LEFT JOIN itinerary_sections isec ON t.id = isec.trip_id
            LEFT JOIN activities a ON isec.id = a.itinerary_section_id
            LEFT JOIN trip_cities tc ON t.id = tc.trip_id
            LEFT JOIN cities c ON tc.city_id = c.id
            LEFT JOIN community_posts cp ON u.id = cp.user_id
        ''')
        
        stats = dict(cursor.fetchone())
        conn.close()
        return stats


