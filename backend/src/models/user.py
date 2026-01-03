"""
User model and data access methods
"""
from src.config.database import get_db

class User:
    @staticmethod
    def create(data):
        """Create a new user"""
        conn = get_db()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO users (username, email, password, first_name, last_name, phone, city, country, bio)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                data.get('username'),
                data.get('email'),
                data.get('password'),
                data.get('first_name'),
                data.get('last_name'),
                data.get('phone'),
                data.get('city'),
                data.get('country'),
                data.get('bio')
            ))
            conn.commit()
            user_id = cursor.lastrowid
            conn.close()
            return {'id': user_id}
        except Exception as e:
            conn.close()
            raise e
    
    @staticmethod
    def get_by_id(user_id):
        """Get user by ID"""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        return dict(user) if user else None
    
    @staticmethod
    def get_by_username(username):
        """Get user by username"""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        conn.close()
        return dict(user) if user else None
    
    @staticmethod
    def update(user_id, data):
        """Update user information"""
        conn = get_db()
        cursor = conn.cursor()
        
        updates = []
        values = []
        
        for key in ['first_name', 'last_name', 'email', 'phone', 'city', 'country', 'bio']:
            if key in data:
                updates.append(f"{key} = ?")
                values.append(data[key])
        
        if updates:
            values.append(user_id)
            cursor.execute(f'''
                UPDATE users SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', values)
            conn.commit()
        
        conn.close()
        return User.get_by_id(user_id)


