"""
Flask application configuration
"""
from flask import Flask
from flask_cors import CORS
import os

def create_app():
    """Create and configure Flask application"""
    app = Flask(__name__)
    
    # Enable CORS for frontend - Allow all origins for development
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",  # Allow all origins in development
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Global CORS headers for all routes
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['DATABASE'] = 'globetrotter.db'
    app.config['JSON_SORT_KEYS'] = False
    
    # Initialize database
    from src.config.database import init_database, seed_database
    init_database()
    
    # Seed database if enabled in environment
    if os.environ.get('SEED_DATABASE', 'false').lower() == 'true':
        seed_database()
    
    # Register blueprints
    from src.routes import trips, users, cities, activities, expenses, community, analytics, ai
    app.register_blueprint(users.bp, url_prefix='/api')
    app.register_blueprint(trips.bp, url_prefix='/api')
    app.register_blueprint(cities.bp, url_prefix='/api')
    app.register_blueprint(activities.bp, url_prefix='/api')
    app.register_blueprint(expenses.bp, url_prefix='/api')
    app.register_blueprint(community.bp, url_prefix='/api')
    app.register_blueprint(analytics.bp, url_prefix='/api')
    app.register_blueprint(ai.bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health():
        return {'status': 'ok', 'database': 'connected'}
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return {
            'message': 'GlobeTrotter API',
            'version': '1.0',
            'endpoints': {
                'health': '/api/health',
                'users': '/api/users',
                'trips': '/api/trips',
                'cities': '/api/cities',
                'activities': '/api/activities',
                'expenses': '/api/expenses',
                'community': '/api/community',
                'analytics': '/api/analytics',
                'ai': '/api/trips/<id>/ai/optimize, /api/trips/<id>/ai/budget-analysis'
            },
            'frontend': 'Access the frontend at http://localhost:5173'
        }
    
    return app

