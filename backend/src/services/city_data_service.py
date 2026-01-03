"""
Comprehensive city data service
Contains detailed information about cities including hotels, shopping, tourist places, and entertainment
This simulates real-time data for hackathon demonstration
"""

CITY_DATA = {
    "dubai": {
        "name": "Dubai",
        "country": "UAE",
        "cost_index": "High",
        "popularity": 95,
        "description": "Ultra-modern city with luxury shopping, skyscrapers, desert adventures, and world-class attractions.",
        "latitude": 25.2048,
        "longitude": 55.2708,
        "hotels": [
            {"name": "Burj Al Arab", "rating": 5, "price": 800, "type": "Luxury", "location": "Jumeirah Beach"},
            {"name": "Atlantis The Palm", "rating": 5, "price": 400, "type": "Resort", "location": "Palm Jumeirah"},
            {"name": "Dubai Marina Hotel", "rating": 4, "price": 150, "type": "Business", "location": "Dubai Marina"}
        ],
        "shopping": [
            {"name": "Dubai Mall", "type": "Mall", "description": "World's largest shopping mall with 1200+ stores", "highlights": "Fashion, Electronics, Gold Souk"},
            {"name": "Gold Souk", "type": "Market", "description": "Traditional gold market with best prices", "highlights": "Gold, Jewelry, Traditional Crafts"},
            {"name": "Mall of the Emirates", "type": "Mall", "description": "Premium shopping with Ski Dubai", "highlights": "Luxury Brands, Entertainment, Dining"}
        ],
        "tourist_places": [
            {"name": "Burj Khalifa", "type": "Landmark", "description": "World's tallest building", "cost": 150, "duration": "2-3 hours"},
            {"name": "Palm Jumeirah", "type": "Landmark", "description": "Artificial palm-shaped island", "cost": 0, "duration": "1-2 hours"},
            {"name": "Dubai Desert Safari", "type": "Adventure", "description": "Desert dune bashing and camel rides", "cost": 80, "duration": "4-6 hours"},
            {"name": "Dubai Aquarium", "type": "Entertainment", "description": "Underwater tunnel aquarium", "cost": 40, "duration": "1-2 hours"}
        ],
        "entertainment": [
            {"name": "Dubai Fountain Show", "type": "Show", "description": "World's largest choreographed fountain", "cost": 0, "timing": "Evening"},
            {"name": "Dubai Opera", "type": "Cultural", "description": "World-class performances", "cost": 100, "timing": "Evening"},
            {"name": "IMG Worlds of Adventure", "type": "Theme Park", "description": "Largest indoor theme park", "cost": 85, "timing": "Full Day"}
        ]
    },
    "mumbai": {
        "name": "Mumbai",
        "country": "India",
        "cost_index": "High",
        "popularity": 95,
        "description": "Financial capital of India, home to Bollywood, Gateway of India, and vibrant street food culture.",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "hotels": [
            {"name": "Taj Mahal Palace", "rating": 5, "price": 200, "type": "Luxury", "location": "Colaba"},
            {"name": "The Oberoi Mumbai", "rating": 5, "price": 180, "type": "Luxury", "location": "Nariman Point"},
            {"name": "ITC Maratha", "rating": 5, "price": 150, "type": "Business", "location": "Andheri"}
        ],
        "shopping": [
            {"name": "Colaba Causeway", "type": "Street Market", "description": "Best for souvenirs, clothes, and accessories", "highlights": "Budget Shopping, Street Food"},
            {"name": "Phoenix Marketcity", "type": "Mall", "description": "One of India's largest malls", "highlights": "International Brands, Entertainment, Dining"},
            {"name": "Crawford Market", "type": "Market", "description": "Wholesale market for everything", "highlights": "Fruits, Spices, Household Items"}
        ],
        "tourist_places": [
            {"name": "Gateway of India", "type": "Landmark", "description": "Iconic arch monument", "cost": 0, "duration": "30 mins"},
            {"name": "Elephanta Caves", "type": "Heritage", "description": "Ancient rock-cut caves", "cost": 10, "duration": "3-4 hours"},
            {"name": "Marine Drive", "type": "Landmark", "description": "Famous sea-facing promenade", "cost": 0, "duration": "1 hour"},
            {"name": "Siddhivinayak Temple", "type": "Religious", "description": "Famous Ganesha temple", "cost": 0, "duration": "1 hour"}
        ],
        "entertainment": [
            {"name": "Bollywood Studio Tour", "type": "Tour", "description": "Visit film studios", "cost": 50, "timing": "Day"},
            {"name": "Sunset at Marine Drive", "type": "Experience", "description": "Beautiful sunset views", "cost": 0, "timing": "Evening"},
            {"name": "Street Food Tour", "type": "Food", "description": "Explore Mumbai's street food", "cost": 20, "timing": "Evening"}
        ]
    },
    "goa": {
        "name": "Goa",
        "country": "India",
        "cost_index": "Medium",
        "popularity": 96,
        "description": "Beach paradise, nightlife, Portuguese heritage, water sports, and laid-back vibe.",
        "latitude": 15.2993,
        "longitude": 74.1240,
        "hotels": [
            {"name": "Taj Exotica Goa", "rating": 5, "price": 120, "type": "Resort", "location": "Benaulim"},
            {"name": "Park Hyatt Goa", "rating": 5, "price": 100, "type": "Resort", "location": "Arossim"},
            {"name": "Sea Shell Beach Resort", "rating": 4, "price": 60, "type": "Beach", "location": "Calangute"}
        ],
        "shopping": [
            {"name": "Anjuna Flea Market", "type": "Market", "description": "Famous Wednesday flea market", "highlights": "Handicrafts, Clothes, Accessories"},
            {"name": "Mapusa Market", "type": "Market", "description": "Local market for spices and souvenirs", "highlights": "Spices, Cashews, Local Products"},
            {"name": "Goa Mall", "type": "Mall", "description": "Modern shopping center", "highlights": "Brands, Electronics, Entertainment"}
        ],
        "tourist_places": [
            {"name": "Baga Beach", "type": "Beach", "description": "Most popular beach with water sports", "cost": 0, "duration": "Full Day"},
            {"name": "Fort Aguada", "type": "Heritage", "description": "17th century Portuguese fort", "cost": 0, "duration": "1-2 hours"},
            {"name": "Basilica of Bom Jesus", "type": "Religious", "description": "UNESCO World Heritage site", "cost": 0, "duration": "1 hour"},
            {"name": "Dudhsagar Falls", "type": "Nature", "description": "Majestic 4-tiered waterfall", "cost": 20, "duration": "Half Day"}
        ],
        "entertainment": [
            {"name": "Water Sports", "type": "Adventure", "description": "Parasailing, jet skiing, banana boat", "cost": 50, "timing": "Day"},
            {"name": "Nightlife at Tito's", "type": "Nightlife", "description": "Famous beach club", "cost": 30, "timing": "Night"},
            {"name": "Sunset Cruise", "type": "Experience", "description": "Cruise along Mandovi River", "cost": 25, "timing": "Evening"}
        ]
    },
    "delhi": {
        "name": "Delhi",
        "country": "India",
        "cost_index": "Medium",
        "popularity": 94,
        "description": "Capital city with rich history, Red Fort, India Gate, bustling markets, and diverse culture.",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "hotels": [
            {"name": "The Taj Palace", "rating": 5, "price": 180, "type": "Luxury", "location": "Chanakyapuri"},
            {"name": "The Leela Palace", "rating": 5, "price": 200, "type": "Luxury", "location": "Chanakyapuri"},
            {"name": "Hotel Surya", "rating": 4, "price": 70, "type": "Business", "location": "New Friends Colony"}
        ],
        "shopping": [
            {"name": "Connaught Place", "type": "Market", "description": "Historic circular market", "highlights": "Brands, Restaurants, Entertainment"},
            {"name": "Chandni Chowk", "type": "Market", "description": "Old Delhi's famous market", "highlights": "Traditional Items, Street Food, Electronics"},
            {"name": "DLF Emporio", "type": "Mall", "description": "Luxury shopping destination", "highlights": "Designer Brands, High Fashion"}
        ],
        "tourist_places": [
            {"name": "Red Fort", "type": "Heritage", "description": "UNESCO World Heritage monument", "cost": 5, "duration": "2-3 hours"},
            {"name": "India Gate", "type": "Landmark", "description": "War memorial arch", "cost": 0, "duration": "1 hour"},
            {"name": "Qutub Minar", "type": "Heritage", "description": "Tallest brick minaret", "cost": 3, "duration": "1-2 hours"},
            {"name": "Lotus Temple", "type": "Religious", "description": "Baháʼí House of Worship", "cost": 0, "duration": "1 hour"}
        ],
        "entertainment": [
            {"name": "Akshardham Temple", "type": "Cultural", "description": "Grand Hindu temple complex", "cost": 3, "timing": "Day"},
            {"name": "Dilli Haat", "type": "Cultural", "description": "Cultural market and food court", "cost": 1, "timing": "Day"},
            {"name": "Kingdom of Dreams", "type": "Entertainment", "description": "Live entertainment venue", "cost": 50, "timing": "Evening"}
        ]
    },
    "bangalore": {
        "name": "Bangalore",
        "country": "India",
        "cost_index": "High",
        "popularity": 92,
        "description": "Silicon Valley of India, IT hub, pleasant weather, beautiful parks, and modern infrastructure.",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "hotels": [
            {"name": "The Leela Palace", "rating": 5, "price": 150, "type": "Luxury", "location": "Old Airport Road"},
            {"name": "ITC Gardenia", "rating": 5, "price": 130, "type": "Business", "location": "Residency Road"},
            {"name": "Taj West End", "rating": 5, "price": 140, "type": "Heritage", "location": "Race Course Road"}
        ],
        "shopping": [
            {"name": "UB City", "type": "Mall", "description": "Ultra-luxury shopping destination", "highlights": "Designer Brands, Fine Dining"},
            {"name": "Commercial Street", "type": "Market", "description": "Famous shopping street", "highlights": "Fashion, Accessories, Budget Shopping"},
            {"name": "Orion Mall", "type": "Mall", "description": "Large shopping and entertainment complex", "highlights": "Brands, Food Court, Multiplex"}
        ],
        "tourist_places": [
            {"name": "Lalbagh Botanical Garden", "type": "Park", "description": "Famous botanical garden", "cost": 2, "duration": "2-3 hours"},
            {"name": "Cubbon Park", "type": "Park", "description": "Large urban park", "cost": 0, "duration": "1-2 hours"},
            {"name": "Tipu Sultan's Summer Palace", "type": "Heritage", "description": "Historic palace", "cost": 1, "duration": "1 hour"},
            {"name": "ISKCON Temple", "type": "Religious", "description": "Beautiful Krishna temple", "cost": 0, "duration": "1 hour"}
        ],
        "entertainment": [
            {"name": "Nightlife at MG Road", "type": "Nightlife", "description": "Pubs and bars", "cost": 30, "timing": "Night"},
            {"name": "Wonderla Amusement Park", "type": "Theme Park", "description": "Water and theme park", "cost": 40, "timing": "Full Day"},
            {"name": "Nandi Hills", "type": "Nature", "description": "Sunrise viewpoint", "cost": 5, "timing": "Early Morning"}
        ]
    },
    "jaipur": {
        "name": "Jaipur",
        "country": "India",
        "cost_index": "Low",
        "popularity": 93,
        "description": "Pink City, Hawa Mahal, Amer Fort, rich Rajasthani culture, and traditional handicrafts.",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "hotels": [
            {"name": "Rambagh Palace", "rating": 5, "price": 250, "type": "Palace", "location": "Bani Park"},
            {"name": "Samode Haveli", "rating": 4, "price": 80, "type": "Heritage", "location": "Old City"},
            {"name": "Treebo Trend Hotel", "rating": 3, "price": 30, "type": "Budget", "location": "MI Road"}
        ],
        "shopping": [
            {"name": "Johari Bazaar", "type": "Market", "description": "Famous for jewelry and gems", "highlights": "Jewelry, Gems, Traditional Items"},
            {"name": "Bapu Bazaar", "type": "Market", "description": "Best for handicrafts and textiles", "highlights": "Textiles, Handicrafts, Rajasthani Items"},
            {"name": "World Trade Park", "type": "Mall", "description": "Modern shopping mall", "highlights": "Brands, Entertainment, Dining"}
        ],
        "tourist_places": [
            {"name": "Amer Fort", "type": "Heritage", "description": "Magnificent hill fort", "cost": 5, "duration": "2-3 hours"},
            {"name": "Hawa Mahal", "type": "Landmark", "description": "Palace of Winds", "cost": 2, "duration": "30 mins"},
            {"name": "City Palace", "type": "Heritage", "description": "Royal palace complex", "cost": 7, "duration": "2 hours"},
            {"name": "Jantar Mantar", "type": "Heritage", "description": "Astronomical observatory", "cost": 2, "duration": "1 hour"}
        ],
        "entertainment": [
            {"name": "Elephant Ride at Amer Fort", "type": "Experience", "description": "Traditional elephant ride", "cost": 15, "timing": "Day"},
            {"name": "Chokhi Dhani", "type": "Cultural", "description": "Rajasthani cultural village", "cost": 20, "timing": "Evening"},
            {"name": "Sound & Light Show at Amer Fort", "type": "Show", "description": "Historical light show", "cost": 5, "timing": "Evening"}
        ]
    }
}

# Indian Cities Database (Comprehensive - 50+ cities)
INDIAN_CITIES = [
    # Major Metros (Tier 1)
    {"name": "Mumbai", "country": "India", "cost_index": "High", "popularity": 95, "state": "Maharashtra"},
    {"name": "Delhi", "country": "India", "cost_index": "Medium", "popularity": 94, "state": "Delhi"},
    {"name": "Bangalore", "country": "India", "cost_index": "High", "popularity": 92, "state": "Karnataka"},
    {"name": "Hyderabad", "country": "India", "cost_index": "Medium", "popularity": 88, "state": "Telangana"},
    {"name": "Chennai", "country": "India", "cost_index": "Medium", "popularity": 87, "state": "Tamil Nadu"},
    {"name": "Kolkata", "country": "India", "cost_index": "Low", "popularity": 85, "state": "West Bengal"},
    {"name": "Pune", "country": "India", "cost_index": "Medium", "popularity": 83, "state": "Maharashtra"},
    {"name": "Ahmedabad", "country": "India", "cost_index": "Low", "popularity": 81, "state": "Gujarat"},
    
    # Tourist Destinations
    {"name": "Goa", "country": "India", "cost_index": "Medium", "popularity": 96, "state": "Goa"},
    {"name": "Jaipur", "country": "India", "cost_index": "Low", "popularity": 93, "state": "Rajasthan"},
    {"name": "Udaipur", "country": "India", "cost_index": "Low", "popularity": 91, "state": "Rajasthan"},
    {"name": "Agra", "country": "India", "cost_index": "Low", "popularity": 98, "state": "Uttar Pradesh"},
    {"name": "Varanasi", "country": "India", "cost_index": "Very Low", "popularity": 89, "state": "Uttar Pradesh"},
    {"name": "Kochi", "country": "India", "cost_index": "Medium", "popularity": 86, "state": "Kerala"},
    {"name": "Shimla", "country": "India", "cost_index": "Medium", "popularity": 84, "state": "Himachal Pradesh"},
    {"name": "Darjeeling", "country": "India", "cost_index": "Medium", "popularity": 82, "state": "West Bengal"},
    {"name": "Manali", "country": "India", "cost_index": "Medium", "popularity": 77, "state": "Himachal Pradesh"},
    {"name": "Rishikesh", "country": "India", "cost_index": "Low", "popularity": 75, "state": "Uttarakhand"},
    {"name": "Mysore", "country": "India", "cost_index": "Low", "popularity": 74, "state": "Karnataka"},
    {"name": "Ooty", "country": "India", "cost_index": "Medium", "popularity": 76, "state": "Tamil Nadu"},
    {"name": "Amritsar", "country": "India", "cost_index": "Low", "popularity": 73, "state": "Punjab"},
    {"name": "Jodhpur", "country": "India", "cost_index": "Low", "popularity": 72, "state": "Rajasthan"},
    {"name": "Leh", "country": "India", "cost_index": "Medium", "popularity": 71, "state": "Ladakh"},
    {"name": "Pondicherry", "country": "India", "cost_index": "Medium", "popularity": 70, "state": "Puducherry"},
    
    # Smaller Cities (Tier 2 & 3)
    {"name": "Surat", "country": "India", "cost_index": "Medium", "popularity": 75, "state": "Gujarat"},
    {"name": "Indore", "country": "India", "cost_index": "Low", "popularity": 68, "state": "Madhya Pradesh"},
    {"name": "Bhopal", "country": "India", "cost_index": "Low", "popularity": 67, "state": "Madhya Pradesh"},
    {"name": "Vadodara", "country": "India", "cost_index": "Low", "popularity": 66, "state": "Gujarat"},
    {"name": "Nagpur", "country": "India", "cost_index": "Low", "popularity": 65, "state": "Maharashtra"},
    {"name": "Coimbatore", "country": "India", "cost_index": "Low", "popularity": 64, "state": "Tamil Nadu"},
    {"name": "Lucknow", "country": "India", "cost_index": "Low", "popularity": 69, "state": "Uttar Pradesh"},
    {"name": "Kanpur", "country": "India", "cost_index": "Low", "popularity": 63, "state": "Uttar Pradesh"},
    {"name": "Patna", "country": "India", "cost_index": "Low", "popularity": 62, "state": "Bihar"},
    {"name": "Bhubaneswar", "country": "India", "cost_index": "Low", "popularity": 61, "state": "Odisha"},
    {"name": "Chandigarh", "country": "India", "cost_index": "Medium", "popularity": 79, "state": "Chandigarh"},
    {"name": "Gurgaon", "country": "India", "cost_index": "High", "popularity": 80, "state": "Haryana"},
    {"name": "Noida", "country": "India", "cost_index": "Medium", "popularity": 78, "state": "Uttar Pradesh"},
    {"name": "Thiruvananthapuram", "country": "India", "cost_index": "Medium", "popularity": 60, "state": "Kerala"},
    {"name": "Visakhapatnam", "country": "India", "cost_index": "Low", "popularity": 59, "state": "Andhra Pradesh"},
    {"name": "Ludhiana", "country": "India", "cost_index": "Low", "popularity": 58, "state": "Punjab"},
    {"name": "Agra", "country": "India", "cost_index": "Low", "popularity": 98, "state": "Uttar Pradesh"},
    {"name": "Nashik", "country": "India", "cost_index": "Low", "popularity": 57, "state": "Maharashtra"},
    {"name": "Faridabad", "country": "India", "cost_index": "Low", "popularity": 56, "state": "Haryana"},
    {"name": "Meerut", "country": "India", "cost_index": "Low", "popularity": 55, "state": "Uttar Pradesh"},
    {"name": "Rajkot", "country": "India", "cost_index": "Low", "popularity": 54, "state": "Gujarat"},
    {"name": "Varanasi", "country": "India", "cost_index": "Very Low", "popularity": 89, "state": "Uttar Pradesh"},
    {"name": "Srinagar", "country": "India", "cost_index": "Medium", "popularity": 53, "state": "Jammu and Kashmir"},
    {"name": "Aurangabad", "country": "India", "cost_index": "Low", "popularity": 52, "state": "Maharashtra"},
    {"name": "Dhanbad", "country": "India", "cost_index": "Low", "popularity": 51, "state": "Jharkhand"},
]

def search_cities(query):
    """Search cities by name - real-time search"""
    if not query:
        return []
    
    query_lower = query.lower().strip()
    results = []
    
    # Search in detailed city data
    for key, city_info in CITY_DATA.items():
        if query_lower in key or query_lower in city_info["name"].lower():
            results.append({
                "id": len(results) + 1,
                "name": city_info["name"],
                "country": city_info["country"],
                "cost_index": city_info["cost_index"],
                "popularity": city_info["popularity"],
                "description": city_info["description"],
                "latitude": city_info["latitude"],
                "longitude": city_info["longitude"],
                "has_details": True,
                "hotels": city_info.get("hotels", []),
                "shopping": city_info.get("shopping", []),
                "tourist_places": city_info.get("tourist_places", []),
                "entertainment": city_info.get("entertainment", [])
            })
    
    # Search in Indian cities list
    for city in INDIAN_CITIES:
        if query_lower in city["name"].lower() or query_lower in city["country"].lower():
            # Avoid duplicates
            if not any(r["name"] == city["name"] for r in results):
                results.append({
                    "id": len(results) + 1,
                    "name": city["name"],
                    "country": city["country"],
                    "cost_index": city["cost_index"],
                    "popularity": city["popularity"],
                    "description": f"Beautiful city in {city.get('state', 'India')}",
                    "has_details": False
                })
    
    return results[:50]  # Limit to 50 results

def get_all_cities():
    """Get all cities for initial load"""
    results = []
    
    # Add detailed cities
    for key, city_info in CITY_DATA.items():
        results.append({
            "id": len(results) + 1,
            "name": city_info["name"],
            "country": city_info["country"],
            "cost_index": city_info["cost_index"],
            "popularity": city_info["popularity"],
            "description": city_info["description"],
            "latitude": city_info["latitude"],
            "longitude": city_info["longitude"],
            "has_details": True
        })
    
    # Add Indian cities
    for city in INDIAN_CITIES:
        if not any(r["name"] == city["name"] for r in results):
            results.append({
                "id": len(results) + 1,
                "name": city["name"],
                "country": city["country"],
                "cost_index": city["cost_index"],
                "popularity": city["popularity"],
                "description": f"Beautiful city in {city.get('state', 'India')}",
                "has_details": False
            })
    
    # Sort by popularity
    results.sort(key=lambda x: x["popularity"], reverse=True)
    return results

def get_city_details(city_name):
    """Get detailed information about a city"""
    city_key = city_name.lower().replace(" ", "")
    if city_key in CITY_DATA:
        return CITY_DATA[city_key]
    return None

