"""
City controller for handling city-related requests
"""
from flask import request, jsonify
from src.models.city import City
from src.services.city_data_service import search_cities, get_all_cities, get_city_details
import os

# Optional import for Geoapify integration
try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False

class CityController:
    @staticmethod
    def search():
        """Search cities - hybrid approach (database + real-time)"""
        search_query = request.args.get('search', '').strip()
        country = request.args.get('country', '').strip()
        
        # If search query provided, use real-time search
        if search_query:
            # Use real-time search service
            cities = search_cities(search_query)
            # Filter by country if specified
            if country and country != 'all':
                cities = [c for c in cities if c.get('country', '').lower() == country.lower()]
            return jsonify(cities)
        else:
            # No search query - get all cities from database first, then supplement with real-time data
            db_cities = City.search(None, country if country and country != 'all' else None)
            real_time_cities = get_all_cities()
            
            # Merge results (avoid duplicates)
            seen = set()
            merged = []
            for city in db_cities + real_time_cities:
                city_key = city.get('name', '').lower()
                if city_key not in seen:
                    seen.add(city_key)
                    merged.append(city)
            
            # Sort by popularity
            merged.sort(key=lambda x: x.get('popularity', 0), reverse=True)
            return jsonify(merged[:100])  # Limit to 100
    
    @staticmethod
    def real_time_search():
        """Real-time city search endpoint with Geoapify integration"""
        query = request.args.get('q', '').strip()
        
        if not query:
            # Return all cities from our database
            cities = get_all_cities()
            return jsonify(cities)
        
        # First try our local comprehensive search
        local_cities = search_cities(query)
        
        # Try Geoapify API for additional real-time results (if API key is set and requests available)
        geoapify_key = os.environ.get('GEOAPIFY_API_KEY', '')
        if geoapify_key and REQUESTS_AVAILABLE:
            try:
                geoapify_results = CityController._search_geoapify(query, geoapify_key)
                # Merge with local results (avoid duplicates)
                seen = set(c['name'].lower() for c in local_cities)
                for city in geoapify_results:
                    if city['name'].lower() not in seen:
                        local_cities.append(city)
                        seen.add(city['name'].lower())
            except Exception as e:
                print(f"Geoapify API error (using local data): {e}")
        
        return jsonify(local_cities[:50])  # Limit to 50 results
    
    @staticmethod
    def _search_geoapify(query, api_key):
        """Search cities using Geoapify API"""
        if not REQUESTS_AVAILABLE:
            return []
        try:
            url = f"https://api.geoapify.com/v1/geocode/autocomplete"
            params = {
                'text': query,
                'type': 'city',
                'limit': 20,
                'apiKey': api_key
            }
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            cities = []
            if 'features' in data:
                for feature in data['features']:
                    props = feature.get('properties', {})
                    # Geoapify returns 'city' field for cities
                    city_name = props.get('city') or props.get('name', '')
                    country = props.get('country', '')
                    state = props.get('state', '')
                    
                    # Only process if it's actually a city (not a postcode or other result)
                    if city_name and props.get('result_type') in ['city', 'town']:
                        # Calculate importance score (0-100)
                        rank = props.get('rank', {})
                        importance = rank.get('importance', 0.5) if isinstance(rank, dict) else 0.5
                        popularity = int(importance * 100) if importance else 70
                        
                        cities.append({
                            'id': len(cities) + 1000,  # Use high ID to avoid conflicts
                            'name': city_name,
                            'country': country,
                            'state': state,
                            'cost_index': 'Medium',  # Default - can be enhanced with cost data
                            'popularity': popularity,
                            'description': f"{city_name}" + (f", {state}" if state else "") + f", {country}",
                            'latitude': props.get('lat'),
                            'longitude': props.get('lon'),
                            'formatted': props.get('formatted', f"{city_name}, {country}"),
                            'has_details': False,
                            'source': 'geoapify'
                        })
            return cities
        except Exception as e:
            print(f"Geoapify search error: {e}")
            return []
    
    @staticmethod
    def get(city_id):
        """Get city by ID"""
        city = City.get_by_id(city_id)
        if city:
            return jsonify(city)
        return jsonify({'error': 'City not found'}), 404
    
    @staticmethod
    def get_details(city_name):
        """Get detailed information about a city (hotels, shopping, tourist places, entertainment)"""
        details = get_city_details(city_name)
        if details:
            return jsonify(details)
        return jsonify({'error': 'City details not found'}), 404
    
    @staticmethod
    def add_to_trip(trip_id):
        """Add city to trip"""
        try:
            data = request.json
            city_id = data.get('city_id')
            visit_order = data.get('visit_order', 0)
            
            if City.add_to_trip(trip_id, city_id, visit_order):
                return jsonify({'message': 'City added to trip successfully'}), 201
            return jsonify({'error': 'City already in trip or invalid IDs'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 400


