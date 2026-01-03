"""
Database configuration and connection management
Using SQLite for the hackathon project
"""
import sqlite3
import os

# Get the backend directory (two levels up from src/config)
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATABASE_PATH = os.path.join(BACKEND_DIR, 'globetrotter.db')

def get_db():
    """Get database connection with row factory"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    # Enable foreign keys
    conn.execute('PRAGMA foreign_keys = ON')
    return conn

def init_database():
    """Initialize database with schema"""
    # Get project root (one level up from backend)
    PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
    schema_path = os.path.join(PROJECT_ROOT, 'database', 'schema.sql')
    
    if os.path.exists(schema_path):
        conn = get_db()
        cursor = conn.cursor()
        
        with open(schema_path, 'r') as f:
            schema_sql = f.read()
            cursor.executescript(schema_sql)
        
        conn.commit()
        conn.close()
        return True
    return False

def seed_database():
    """Seed database with initial data"""
    # Get project root (one level up from backend)
    PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
    seed_path = os.path.join(PROJECT_ROOT, 'database', 'seed.sql')
    
    if os.path.exists(seed_path):
        conn = get_db()
        cursor = conn.cursor()
        
        with open(seed_path, 'r') as f:
            seed_sql = f.read()
            cursor.executescript(seed_sql)
        
        conn.commit()
        conn.close()
        return True
    return False

