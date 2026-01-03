"""
Community controller for handling community-related requests
"""
from flask import request, jsonify
from src.config.database import get_db

class CommunityController:
    @staticmethod
    def get_posts():
        """Get community posts with user and trip info"""
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                cp.*, 
                u.username, 
                u.first_name,
                u.last_name,
                t.title as trip_title
            FROM community_posts cp
            JOIN users u ON cp.user_id = u.id
            LEFT JOIN trips t ON cp.trip_id = t.id
            ORDER BY cp.created_at DESC
            LIMIT 50
        ''')
        
        posts = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(posts)


