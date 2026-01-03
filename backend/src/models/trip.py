"""
Trip model and data access methods
"""
from src.config.database import get_db

class Trip:
    @staticmethod
    def create(data):
        """Create a new trip"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO trips (user_id, title, destination, start_date, end_date, status, total_budget, description, cover_image_url, is_public)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('user_id'),
            data.get('title'),
            data.get('destination'),
            data.get('start_date'),
            data.get('end_date'),
            data.get('status', 'upcoming'),
            data.get('total_budget', 0),
            data.get('description'),
            data.get('cover_image_url'),
            data.get('is_public', 0)
        ))
        conn.commit()
        trip_id = cursor.lastrowid
        conn.close()
        return {'id': trip_id}
    
    @staticmethod
    def get_by_id(trip_id):
        """Get trip by ID with user info"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT t.*, u.username, u.first_name, u.last_name, u.email
            FROM trips t
            JOIN users u ON t.user_id = u.id
            WHERE t.id = ?
        ''', (trip_id,))
        
        trip = cursor.fetchone()
        conn.close()
        return dict(trip) if trip else None
    
    @staticmethod
    def get_all():
        """Get all trips"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT t.*, 
                   u.username, u.first_name, u.last_name,
                   COUNT(DISTINCT isec.id) as section_count,
                   COUNT(DISTINCT a.id) as activity_count
            FROM trips t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN itinerary_sections isec ON t.id = isec.trip_id
            LEFT JOIN activities a ON isec.id = a.itinerary_section_id
            GROUP BY t.id
            ORDER BY t.created_at DESC
        ''')
        
        trips = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return trips
    
    @staticmethod
    def get_by_user(user_id):
        """Get all trips for a user"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT t.*, 
                   COUNT(DISTINCT isec.id) as section_count,
                   COUNT(DISTINCT a.id) as activity_count
            FROM trips t
            LEFT JOIN itinerary_sections isec ON t.id = isec.trip_id
            LEFT JOIN activities a ON isec.id = a.itinerary_section_id
            WHERE t.user_id = ?
            GROUP BY t.id
            ORDER BY t.created_at DESC
        ''', (user_id,))
        
        trips = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return trips
    
    @staticmethod
    def get_complete(trip_id):
        """Get complete trip with all related data"""
        conn = get_db()
        cursor = conn.cursor()
        
        # Get trip info
        trip = Trip.get_by_id(trip_id)
        if not trip:
            conn.close()
            return None
        
        # Get cities
        cursor.execute('''
            SELECT c.*, tc.visit_order, tc.arrival_date, tc.departure_date
            FROM cities c
            JOIN trip_cities tc ON c.id = tc.city_id
            WHERE tc.trip_id = ?
            ORDER BY tc.visit_order ASC
        ''', (trip_id,))
        trip['cities'] = [dict(row) for row in cursor.fetchall()]
        
        # Get sections
        cursor.execute('''
            SELECT * FROM itinerary_sections
            WHERE trip_id = ?
            ORDER BY order_index ASC
        ''', (trip_id,))
        sections = [dict(row) for row in cursor.fetchall()]
        
        # Get activities for each section
        for section in sections:
            cursor.execute('''
                SELECT a.*, c.name as city_name, c.country
                FROM activities a
                LEFT JOIN cities c ON a.city_id = c.id
                WHERE a.itinerary_section_id = ?
                ORDER BY a.day_number ASC, a.time_slot ASC
            ''', (section['id'],))
            section['activities'] = [dict(row) for row in cursor.fetchall()]
        
        trip['sections'] = sections
        
        # Get budget summary
        from src.services.budget_service import BudgetService
        trip['budget'] = BudgetService.get_budget_summary(trip_id)
        
        # Get expenses by category
        cursor.execute('''
            SELECT expense_category, SUM(amount) as total_amount, COUNT(*) as count
            FROM expenses
            WHERE trip_id = ?
            GROUP BY expense_category
            ORDER BY total_amount DESC
        ''', (trip_id,))
        trip['expenses_by_category'] = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        return trip
    
    @staticmethod
    def update(trip_id, data):
        """Update trip information"""
        conn = get_db()
        cursor = conn.cursor()
        
        updates = []
        values = []
        
        for key in ['title', 'destination', 'start_date', 'end_date', 'status', 'total_budget', 'description', 'cover_image_url', 'is_public']:
            if key in data:
                updates.append(f"{key} = ?")
                values.append(data[key])
        
        if updates:
            values.append(trip_id)
            cursor.execute(f'''
                UPDATE trips SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', values)
            conn.commit()
        
        conn.close()
        return Trip.get_by_id(trip_id)
    
    @staticmethod
    def delete(trip_id):
        """Delete a trip (cascades to related data)"""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM trips WHERE id = ?', (trip_id,))
        conn.commit()
        conn.close()
        return True


