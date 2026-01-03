import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ArrowUpDown, Plus, MapPin, Calendar, TrendingUp, Loader2, Play, Sparkles, Award } from "lucide-react";
import TripCard from "../components/TripCard";
import { useTrips } from "../context/TripsContext";
import { analyticsService } from "../services/analyticsService";
import { tripService } from "../services/tripService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [searchQuery, setSearchQuery] = useState("");
  const [topDestinations, setTopDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch top destinations from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const destinations = await analyticsService.getPopularDestinations(3);
        setTopDestinations(destinations);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        // Fallback to empty array if API fails
        setTopDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get recent trips (completed and upcoming)
  const recentTrips = trips
    .filter((trip) => trip.status === "completed" || trip.status === "upcoming")
    .sort((a, b) => {
      const dateA = new Date(a.date || a.startDate || 0);
      const dateB = new Date(b.date || b.startDate || 0);
      return dateB - dateA;
    })
    .slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cities?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/cities");
    }
  };

  return (
    <div className="space-y-6">
      {/* Professional Hero Section with Video Background */}
      <div className="relative h-[600px] rounded-2xl shadow-2xl overflow-hidden">
        {/* Video/Image Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-700/80 to-purple-800/90 animate-gradient-x"></div>
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='white' stroke-width='1' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
              animation: 'float 20s infinite linear'
            }}></div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 text-7xl opacity-30 animate-bounce" style={{ animationDuration: '3s' }}>✈️</div>
          <div className="absolute top-40 right-20 text-6xl opacity-30 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🗼</div>
          <div className="absolute bottom-32 left-20 text-6xl opacity-30 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '2s' }}>🏛️</div>
          <div className="absolute bottom-20 right-10 text-7xl opacity-30 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>🌍</div>
          
          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white p-8 z-10">
            <div className="text-center max-w-4xl">
              {/* Logo/Brand */}
              <div className="mb-8">
                <h1 className="text-7xl md:text-8xl font-bold mb-4 drop-shadow-2xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  GlobeTrotter
                </h1>
                <p className="text-2xl md:text-3xl text-blue-100 font-light">
                  Travel Planning Made Easy
                </p>
              </div>

              {/* Main Search Bar */}
              <form onSubmit={handleSearch} className="mt-8">
                <div className="relative max-w-3xl mx-auto">
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <input
                          type="text"
                          placeholder="Where do you want to go? Search cities, destinations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-transparent border-none focus:outline-none placeholder-gray-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Search className="w-5 h-5" />
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <button
                  onClick={() => navigate("/trips/create")}
                  className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 hover:scale-105"
                >
                  Plan Your Trip
                </button>
                <button
                  onClick={() => navigate("/cities")}
                  className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 hover:scale-105"
                >
                  Explore Destinations
                </button>
                <button
                  onClick={() => navigate("/activities")}
                  className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 hover:scale-105"
                >
                  Find Activities
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-blue-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="text-sm">AI-Powered Planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm">Smart Budget Tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">10+ Destinations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Play button overlay (optional - for video) */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all border border-white/30">
              <Play className="w-5 h-5 fill-white" />
              <span className="text-sm font-medium">Watch Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Destinations Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
            <p className="text-gray-600 mt-1">Discover amazing places around the world</p>
          </div>
          <button
            onClick={() => navigate("/cities")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All →
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : topDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => navigate(`/cities?search=${encodeURIComponent(dest.name)}`)}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all cursor-pointer border border-gray-200 transform hover:-translate-y-2"
              >
                <div className="relative h-64 bg-gradient-to-br from-indigo-400 to-blue-500 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
                    {dest.name === "Paris" ? "🇫🇷" : dest.name === "Tokyo" ? "🇯🇵" : dest.name === "New York" ? "🇺🇸" : dest.name === "Dubai" ? "🏙️" : "🌍"}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-2xl font-bold text-white">{dest.name}</h3>
                    <p className="text-blue-100">{dest.country}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{dest.country}</span>
                    {dest.trip_count && (
                      <span className="text-sm text-indigo-600 font-medium">{dest.trip_count} trips</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Popular destination</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No popular destinations available</p>
          </div>
        )}
      </div>

      {/* Recent Trips */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Recent Trips</h2>
            <p className="text-gray-600 mt-1">Continue planning your adventures</p>
          </div>
          {recentTrips.length > 0 && (
            <button
              onClick={() => navigate("/trips")}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All →
            </button>
          )}
        </div>
        {recentTrips.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No trips yet</p>
            <p className="text-sm text-gray-500 mb-4">Start planning your first adventure!</p>
            <button
              onClick={() => navigate("/trips/create")}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Trip</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/trips/create")}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all flex items-center justify-center hover:scale-110 z-50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        title="Plan a trip"
        aria-label="Create new trip"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
};

export default Dashboard;
