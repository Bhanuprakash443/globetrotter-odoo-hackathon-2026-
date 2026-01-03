-- GlobeTrotter Database Schema
-- Database: SQLite
-- Version: 1.0

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    city TEXT,
    country TEXT,
    bio TEXT,
    avatar_url TEXT,
    is_admin INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Trips Table
-- ============================================
CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    destination TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    total_budget REAL DEFAULT 0,
    description TEXT,
    cover_image_url TEXT,
    is_public INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================
-- Cities Table (Reference Data)
-- ============================================
CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    cost_index TEXT CHECK(cost_index IN ('Very Low', 'Low', 'Medium', 'High', 'Very High')),
    popularity INTEGER DEFAULT 0,
    description TEXT,
    latitude REAL,
    longitude REAL,
    UNIQUE(name, country)
);

-- ============================================
-- Trip-Cities Junction Table (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS trip_cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    city_id INTEGER NOT NULL,
    visit_order INTEGER DEFAULT 0,
    arrival_date DATE,
    departure_date DATE,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE CASCADE,
    UNIQUE(trip_id, city_id)
);

-- ============================================
-- Itinerary Sections Table
-- ============================================
CREATE TABLE IF NOT EXISTS itinerary_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    section_type TEXT DEFAULT 'general' CHECK(section_type IN ('transport', 'accommodation', 'activity', 'food', 'general')),
    start_date DATE,
    end_date DATE,
    budget REAL DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
);

-- ============================================
-- Activities Table
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    itinerary_section_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    activity_type TEXT CHECK(activity_type IN ('Sightseeing', 'Adventure', 'Food', 'Culture', 'Nightlife', 'Nature', 'Shopping', 'Other')),
    city_id INTEGER,
    cost REAL DEFAULT 0,
    duration TEXT,
    day_number INTEGER,
    time_slot TEXT,
    address TEXT,
    rating REAL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (itinerary_section_id) REFERENCES itinerary_sections (id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE SET NULL
);

-- ============================================
-- Expenses Table
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    itinerary_section_id INTEGER,
    activity_id INTEGER,
    expense_category TEXT NOT NULL CHECK(expense_category IN ('Transport', 'Stay', 'Activities', 'Meals', 'Shopping', 'Misc')),
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    description TEXT,
    expense_date DATE,
    payment_method TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE,
    FOREIGN KEY (itinerary_section_id) REFERENCES itinerary_sections (id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE
);

-- ============================================
-- Community Posts Table
-- ============================================
CREATE TABLE IF NOT EXISTS community_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    trip_id INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE SET NULL
);

-- ============================================
-- Post Likes Table (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS post_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(post_id, user_id)
);

-- ============================================
-- Comments Table
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_itinerary_sections_trip_id ON itinerary_sections(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_sections_order ON itinerary_sections(trip_id, order_index);

CREATE INDEX IF NOT EXISTS idx_activities_section_id ON activities(itinerary_section_id);
CREATE INDEX IF NOT EXISTS idx_activities_city_id ON activities(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);

CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(expense_category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

CREATE INDEX IF NOT EXISTS idx_trip_cities_trip_id ON trip_cities(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_cities_city_id ON trip_cities(city_id);

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_trip_id ON community_posts(trip_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country);
CREATE INDEX IF NOT EXISTS idx_cities_popularity ON cities(popularity DESC);

-- ============================================
-- Triggers for Updated At
-- ============================================
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_trips_timestamp 
    AFTER UPDATE ON trips
    BEGIN
        UPDATE trips SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_itinerary_sections_timestamp 
    AFTER UPDATE ON itinerary_sections
    BEGIN
        UPDATE itinerary_sections SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;


