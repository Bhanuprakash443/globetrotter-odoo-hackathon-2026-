-- GlobeTrotter Database Seed Data
-- Sample data for hackathon demonstration
-- Note: In production, passwords should be properly hashed
-- These are sample accounts for testing purposes only

-- ============================================
-- Sample Users
-- ============================================
INSERT OR IGNORE INTO users (username, email, password, first_name, last_name, phone, city, country, bio, is_admin) VALUES
('admin', 'admin@globetrotter.com', 'admin123', 'Admin', 'User', '+1234567890', 'San Francisco', 'USA', 'Platform Administrator', 1),
('john_doe', 'john@example.com', 'password123', 'John', 'Doe', '+1234567891', 'New York', 'USA', 'Travel enthusiast and adventure seeker', 0),
('jane_smith', 'jane@example.com', 'password123', 'Jane', 'Smith', '+1234567892', 'London', 'UK', 'Love exploring new cultures', 0),
('travel_lover', 'travel@example.com', 'password123', 'Travel', 'Lover', '+1234567893', 'Tokyo', 'Japan', 'Passionate about travel photography', 0);

-- ============================================
-- Sample Cities - Including Indian Cities
-- ============================================
INSERT OR IGNORE INTO cities (name, country, cost_index, popularity, description, latitude, longitude) VALUES
-- Indian Cities (Major Metros)
('Mumbai', 'India', 'High', 95, 'Financial capital of India, home to Bollywood, Gateway of India, and vibrant street food culture.', 19.0760, 72.8777),
('Delhi', 'India', 'Medium', 94, 'Capital city with rich history, Red Fort, India Gate, bustling markets, and diverse culture.', 28.6139, 77.2090),
('Bangalore', 'India', 'High', 92, 'Silicon Valley of India, IT hub, pleasant weather, beautiful parks, and modern infrastructure.', 12.9716, 77.5946),
('Hyderabad', 'India', 'Medium', 88, 'City of Pearls, Charminar, biryani capital, IT parks, and rich Nizami heritage.', 17.3850, 78.4867),
('Chennai', 'India', 'Medium', 87, 'Cultural capital of South India, Marina Beach, temples, classical music, and filter coffee.', 13.0827, 80.2707),
('Kolkata', 'India', 'Low', 85, 'City of Joy, Howrah Bridge, Victoria Memorial, intellectual hub, and delicious sweets.', 22.5726, 88.3639),
('Pune', 'India', 'Medium', 83, 'Oxford of the East, educational hub, pleasant weather, historical forts, and IT companies.', 18.5204, 73.8567),
('Ahmedabad', 'India', 'Low', 81, 'Manchester of India, Sabarmati Ashram, textiles, Gujarati cuisine, and vibrant festivals.', 23.0225, 72.5714),
('Goa', 'India', 'Medium', 96, 'Beach paradise, nightlife, Portuguese heritage, water sports, and laid-back vibe.', 15.2993, 74.1240),
('Jaipur', 'India', 'Low', 93, 'Pink City, Hawa Mahal, Amer Fort, rich Rajasthani culture, and traditional handicrafts.', 26.9124, 75.7873),
('Udaipur', 'India', 'Low', 91, 'City of Lakes, romantic palaces, Lake Pichola, luxury hotels, and royal heritage.', 24.5854, 73.7125),
('Agra', 'India', 'Low', 98, 'Home to the Taj Mahal, Agra Fort, UNESCO World Heritage sites, and Mughal architecture.', 27.1767, 78.0081),
('Varanasi', 'India', 'Very Low', 89, 'Spiritual capital, Ganga Aarti, ancient temples, ghats, and rich cultural traditions.', 25.3176, 82.9739),
('Kochi', 'India', 'Medium', 86, 'Queen of Arabian Sea, backwaters, Chinese fishing nets, Kerala cuisine, and colonial architecture.', 9.9312, 76.2673),
('Shimla', 'India', 'Medium', 84, 'Queen of Hills, colonial architecture, Mall Road, pleasant weather, and scenic beauty.', 31.1048, 77.1734),
('Darjeeling', 'India', 'Medium', 82, 'Tea capital, toy train, mountain views, monasteries, and cool climate.', 27.0412, 88.2662),
('Gurgaon', 'India', 'High', 80, 'Millennium City, corporate hub, malls, nightlife, and modern infrastructure.', 28.4089, 77.0378),
('Noida', 'India', 'Medium', 78, 'IT hub, planned city, modern amenities, metro connectivity, and business centers.', 28.5355, 77.3910),
('Chandigarh', 'India', 'Medium', 79, 'Planned city by Le Corbusier, beautiful architecture, Sukhna Lake, and clean environment.', 30.7333, 76.7794),
('Manali', 'India', 'Medium', 77, 'Hill station, adventure sports, snow-capped mountains, and scenic beauty.', 32.2432, 77.1892),
('Rishikesh', 'India', 'Low', 75, 'Yoga capital, Ganga river, adventure sports, spiritual retreats, and ashrams.', 30.0869, 78.2676),
('Mysore', 'India', 'Low', 74, 'City of Palaces, Dasara festival, sandalwood, silk, and royal heritage.', 12.2958, 76.6394),
('Ooty', 'India', 'Medium', 76, 'Queen of Hill Stations, tea gardens, botanical gardens, and cool climate.', 11.4102, 76.6950),
('Amritsar', 'India', 'Low', 73, 'Golden Temple, rich Sikh heritage, delicious food, and Wagah Border ceremony.', 31.6340, 74.8723),
('Jodhpur', 'India', 'Low', 72, 'Blue City, Mehrangarh Fort, desert landscape, and traditional handicrafts.', 26.2389, 73.0243),
('Leh', 'India', 'Medium', 71, 'Ladakh capital, high altitude, monasteries, stunning landscapes, and adventure.', 34.1526, 77.5770),
('Pondicherry', 'India', 'Medium', 70, 'French colony, beaches, Auroville, colonial architecture, and peaceful vibe.', 11.9416, 79.8083),
('Kerala Backwaters', 'India', 'Medium', 85, 'Serene backwaters, houseboats, coconut groves, and peaceful relaxation.', 9.4981, 76.3388),
('Rajasthan', 'India', 'Low', 88, 'Land of Kings, palaces, deserts, vibrant culture, and royal heritage.', 26.9124, 75.7873),
('Hampi', 'India', 'Low', 69, 'Ancient ruins, UNESCO World Heritage, boulder landscape, and historical significance.', 15.3350, 76.4600),

-- International Cities
('Dubai', 'UAE', 'High', 90, 'Ultra-modern city with luxury shopping, skyscrapers, and desert adventures.', 25.2048, 55.2708),
('Paris', 'France', 'High', 95, 'The City of Light, famous for the Eiffel Tower, Louvre Museum, and French cuisine.', 48.8566, 2.3522),
('Tokyo', 'Japan', 'High', 92, 'Modern metropolis with ancient temples, amazing food, and cutting-edge technology.', 35.6762, 139.6503),
('New York', 'USA', 'Very High', 98, 'The Big Apple, iconic skyline, Broadway shows, and diverse culture.', 40.7128, -74.0060),
('London', 'UK', 'High', 94, 'Historic capital with royal palaces, world-class museums, and vibrant nightlife.', 51.5074, -0.1278),
('Barcelona', 'Spain', 'Medium', 88, 'Mediterranean city with stunning architecture by Gaudi and beautiful beaches.', 41.3851, 2.1734),
('Bangkok', 'Thailand', 'Low', 85, 'Bustling capital with ornate temples, floating markets, and delicious street food.', 13.7563, 100.5018),
('Sydney', 'Australia', 'High', 87, 'Harbor city with Opera House, beautiful beaches, and laid-back lifestyle.', -33.8688, 151.2093),
('Rome', 'Italy', 'Medium', 91, 'Eternal City with ancient ruins, Vatican, and incredible Italian cuisine.', 41.9028, 12.4964),
('Amsterdam', 'Netherlands', 'Medium', 86, 'Canals, cycling culture, world-class museums, and vibrant nightlife.', 52.3676, 4.9041),
('Singapore', 'Singapore', 'Very High', 97, 'Garden City, Marina Bay, Sentosa Island, multicultural food, and efficient infrastructure.', 1.3521, 103.8198),
('Bali', 'Indonesia', 'Medium', 91, 'Island paradise with stunning beaches, temples, rice terraces, and spiritual culture.', -8.3405, 115.0920);

-- ============================================
-- Sample Trips
-- ============================================
INSERT OR IGNORE INTO trips (user_id, title, destination, start_date, end_date, status, total_budget, description) VALUES
(2, 'European Adventure', 'Paris, London, Rome', '2024-07-15', '2024-07-30', 'upcoming', 5000.00, 'Two-week journey through Europe''s most iconic cities'),
(2, 'Asian Discovery', 'Tokyo, Bangkok', '2024-09-20', '2024-10-05', 'upcoming', 3500.00, 'Exploring the rich cultures of Japan and Thailand'),
(3, 'Paris Weekend', 'Paris', '2024-03-10', '2024-03-12', 'completed', 1200.00, 'Quick romantic getaway to the City of Light'),
(3, 'Beach Paradise', 'Barcelona', '2024-06-01', '2024-06-10', 'upcoming', 2000.00, 'Relaxing beach vacation with city exploration'),
(4, 'Winter Wonderland', 'Tokyo', '2024-01-15', '2024-01-25', 'completed', 4500.00, 'Experience Tokyo in winter with hot springs and amazing food');

-- ============================================
-- Sample Trip Cities (Many-to-Many)
-- ============================================
INSERT OR IGNORE INTO trip_cities (trip_id, city_id, visit_order, arrival_date, departure_date) VALUES
(1, 1, 1, '2024-07-15', '2024-07-20'),  -- Paris
(1, 4, 2, '2024-07-20', '2024-07-25'),  -- London
(1, 9, 3, '2024-07-25', '2024-07-30'),  -- Rome
(2, 2, 1, '2024-09-20', '2024-09-28'),  -- Tokyo
(2, 6, 2, '2024-09-28', '2024-10-05'),  -- Bangkok
(3, 1, 1, '2024-03-10', '2024-03-12'),  -- Paris
(4, 5, 1, '2024-06-01', '2024-06-10'),  -- Barcelona
(5, 2, 1, '2024-01-15', '2024-01-25');  -- Tokyo

-- ============================================
-- Sample Itinerary Sections
-- ============================================
INSERT OR IGNORE INTO itinerary_sections (trip_id, title, description, section_type, start_date, end_date, budget, order_index) VALUES
(1, 'Travel to Paris', 'Flight and airport transfer', 'transport', '2024-07-15', '2024-07-15', 800.00, 1),
(1, 'Paris Accommodation', 'Hotel stay in central Paris', 'accommodation', '2024-07-15', '2024-07-20', 1500.00, 2),
(1, 'Paris Activities', 'Sightseeing and cultural experiences', 'activity', '2024-07-16', '2024-07-19', 600.00, 3),
(3, 'Paris Hotel', 'Boutique hotel near Eiffel Tower', 'accommodation', '2024-03-10', '2024-03-12', 400.00, 1),
(3, 'Paris Sightseeing', 'Tour of major attractions', 'activity', '2024-03-10', '2024-03-12', 300.00, 2);

-- ============================================
-- Sample Activities
-- ============================================
INSERT OR IGNORE INTO activities (itinerary_section_id, name, description, activity_type, city_id, cost, duration, day_number, time_slot, rating) VALUES
(3, 'Eiffel Tower Visit', 'Visit the iconic Eiffel Tower and enjoy panoramic views', 'Sightseeing', 1, 25.00, '2-3 hours', 1, '2:00 PM', 4.8),
(3, 'Louvre Museum Tour', 'Explore world-famous art collections', 'Culture', 1, 17.00, '3-4 hours', 1, '10:00 AM', 4.7),
(3, 'Seine River Cruise', 'Scenic boat cruise along the Seine', 'Sightseeing', 1, 15.00, '1 hour', 2, '3:00 PM', 4.6),
(5, 'Notre-Dame Visit', 'Visit the historic cathedral', 'Sightseeing', 1, 0.00, '1 hour', 1, '11:00 AM', 4.5),
(5, 'French Cuisine Tour', 'Food tour of Parisian neighborhoods', 'Food', 1, 85.00, '3 hours', 1, '6:00 PM', 4.9);

-- ============================================
-- Sample Expenses
-- ============================================
INSERT OR IGNORE INTO expenses (trip_id, itinerary_section_id, activity_id, expense_category, amount, currency, description, expense_date) VALUES
(1, 1, NULL, 'Transport', 800.00, 'USD', 'Flight to Paris', '2024-07-15'),
(1, 2, NULL, 'Stay', 1500.00, 'USD', 'Hotel booking', '2024-07-15'),
(1, 3, 1, 'Activities', 25.00, 'USD', 'Eiffel Tower tickets', '2024-07-16'),
(1, 3, 2, 'Activities', 17.00, 'USD', 'Louvre Museum tickets', '2024-07-16'),
(1, NULL, NULL, 'Meals', 150.00, 'USD', 'Dinner at restaurant', '2024-07-16'),
(3, 4, NULL, 'Stay', 400.00, 'USD', 'Hotel booking', '2024-03-10'),
(3, 5, 4, 'Activities', 0.00, 'USD', 'Notre-Dame visit', '2024-03-10'),
(3, 5, 5, 'Activities', 85.00, 'USD', 'Food tour', '2024-03-10');

-- ============================================
-- Sample Community Posts
-- ============================================
INSERT OR IGNORE INTO community_posts (user_id, trip_id, title, content, likes, views) VALUES
(3, 3, 'Amazing Paris Weekend', 'Just returned from an incredible weekend in Paris! The food, the culture, the architecture - everything was beyond expectations. Here''s my complete itinerary with budget breakdown...', 45, 230),
(4, 5, 'Tokyo Winter Magic', 'Completed my first winter trip to Tokyo! The views were absolutely breathtaking. The hot springs, the food, the snow-covered temples - pure magic!', 32, 180),
(2, NULL, 'Travel Tips for Europe', 'Pro tip: Start early in the morning to avoid crowds at major attractions. Also, book accommodations in advance during peak season!', 67, 450),
(3, 4, 'Barcelona Beach Vibes', 'Can''t wait for my Barcelona trip! Planning to explore Gaudi architecture and relax on the beautiful beaches. Any recommendations?', 23, 120);

-- ============================================
-- Sample Comments
-- ============================================
INSERT OR IGNORE INTO comments (post_id, user_id, content) VALUES
(1, 2, 'Great tips! Will definitely try the food tour.'),
(1, 4, 'Paris is amazing! Your photos are beautiful.'),
(2, 3, 'Tokyo in winter is on my bucket list!'),
(3, 2, 'Thanks for sharing these valuable tips!');


