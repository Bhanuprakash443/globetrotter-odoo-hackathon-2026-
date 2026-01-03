import { useState, useEffect, useCallback } from "react";
import { Search, Filter, ArrowUpDown, Clock, DollarSign, Star, Loader2 } from "lucide-react";
import { activityService } from "../services/activityService";
import { useDebounce } from "../hooks/useDebounce";

const ActivitySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["all", "Sightseeing", "Adventure", "Food", "Culture", "Nightlife", "Nature", "Shopping", "Other"];

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch activities from API
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await activityService.searchActivities(
        debouncedSearch || undefined,
        selectedCategory !== "all" ? selectedCategory : undefined
      );
      setActivities(results);
    } catch (err) {
      setError(err.message || "Failed to load activities");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GlobeTrotter</h1>
          <p className="text-gray-600 mt-1">Search Activities</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
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
          <span className="ml-3 text-gray-600">Loading activities...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchActivities}
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
            Results {activities.length > 0 && `(${activities.length})`}
          </h2>
          {activities.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
              <p className="text-gray-600 mb-2">No activities found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-gray-200"
                >
                  <div className="h-48 bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-6xl">
                    {activity.activity_type === "Sightseeing" ? "🗼" :
                     activity.activity_type === "Food" ? "🍷" :
                     activity.activity_type === "Adventure" ? "⛰️" :
                     activity.activity_type === "Culture" ? "🎨" :
                     activity.activity_type === "Nightlife" ? "🎭" :
                     activity.activity_type === "Nature" ? "🏖️" : "🌍"}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{activity.name}</h3>
                      {activity.activity_type && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded font-medium whitespace-nowrap ml-2">
                          {activity.activity_type}
                        </span>
                      )}
                    </div>
                    {activity.city_name && (
                      <p className="text-sm text-gray-600 mb-3">{activity.city_name}, {activity.country}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {activity.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{activity.duration}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{activity.cost === 0 || !activity.cost ? "Free" : `₹${activity.cost}`}</span>
                      </div>
                      {activity.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{activity.rating}</span>
                        </div>
                      )}
                    </div>
                    {activity.description && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{activity.description}</p>
                    )}
                    <button className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-md">
                      Add to Itinerary
                    </button>
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

export default ActivitySearch;
