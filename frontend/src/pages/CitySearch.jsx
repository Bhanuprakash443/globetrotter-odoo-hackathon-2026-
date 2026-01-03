import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Filter, ArrowUpDown, MapPin, Plus, Globe, Loader2 } from "lucide-react";
import { cityService } from "../services/cityService";
import { formatUtils } from "../utils/formatUtils";
import { useDebounce } from "../hooks/useDebounce";

const CitySearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch cities from API - Real-time search
  const fetchCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use real-time search - works instantly!
      const results = await cityService.searchCities(
        debouncedSearch || "",
        selectedCountry !== "all" ? selectedCountry : undefined
      );
      
      // Handle both array and object responses
      const citiesArray = Array.isArray(results) ? results : (results?.cities || []);
      setCities(citiesArray);
    } catch (err) {
      console.error("Search error:", err);
      setError(err?.error || err?.message || "Failed to load cities. Please try again.");
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCountry]);

  // Handle URL search params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Fetch cities when search or filters change
  useEffect(() => {
    // Don't fetch if still debouncing
    if (searchQuery !== debouncedSearch) {
      return;
    }
    fetchCities();
  }, [debouncedSearch, selectedCountry, fetchCities]);

  // Also fetch on initial mount with URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    } else if (!urlSearch) {
      // Load all cities on initial mount
      fetchCities();
    }
  }, []);

  // Get unique countries from cities
  const countries = ["all", ...new Set(cities.map((c) => c.country).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Search Section */}
      <div className="relative h-80 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl shadow-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='white' stroke-width='1'/%3E%3Ccircle cx='20' cy='20' r='2' fill='white'/%3E%3Ccircle cx='80' cy='30' r='2' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}></div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center p-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Search Cities & Destinations</h1>
          <p className="text-blue-100 text-lg mb-8">Discover amazing places around the world</p>
          
          {/* Search Bar */}
          <div className="w-full max-w-3xl">
            <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/cities?search=${encodeURIComponent(searchQuery.trim())}`); }} className="relative">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-2xl blur-xl"></div>
              <div className="relative bg-white rounded-xl p-2 shadow-2xl">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Search for Dubai, Paris, Tokyo, New York..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-transparent border-none focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="all">All Countries</option>
            {countries.filter((c) => c !== "all").map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Sort by</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading cities...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchCities}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Results {cities.length > 0 && `(${cities.length})`}
          </h2>
          {cities.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No cities found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-5xl cursor-pointer" onClick={() => navigate(`/cities/${city.id}`)}>
                        {city.name === "Paris" ? "🇫🇷" : city.name === "Tokyo" ? "🇯🇵" : 
                         city.name === "New York" ? "🇺🇸" : city.name === "London" ? "🇬🇧" :
                         city.name === "Barcelona" ? "🇪🇸" : city.name === "Dubai" ? "🏙️" : "🌍"}
                      </div>
                      <div className="flex-1 cursor-pointer" onClick={() => navigate(`/cities/${city.id}`)}>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">{city.name}</h3>
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{city.country}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <span>Cost Index: {city.cost_index || "N/A"}</span>
                          </div>
                          {city.popularity && (
                            <div>
                              <span>Popularity: {city.popularity}%</span>
                            </div>
                          )}
                          {city.trip_count !== undefined && (
                            <div>
                              <span>{city.trip_count} trips planned</span>
                            </div>
                          )}
                        </div>
                        {city.description && (
                          <p className="text-gray-500 text-sm mt-2">{city.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/cities/${city.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium"
                      >
                        <span>View Details</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                        <Plus className="w-4 h-4" />
                        <span>Add to Trip</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
