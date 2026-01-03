import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, ArrowUpDown, DollarSign, Activity, Loader2, Calendar, List, Share2, Globe, Lock } from "lucide-react";
import { useTrips } from "../context/TripsContext";
import AIOptimizationPanel from "../components/AIOptimizationPanel";
import { tripService } from "../services/tripService";

const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Fetch complete trip data from API
  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const tripData = await tripService.getCompleteTrip(parseInt(id));
        setTrip(tripData);
        
        // Set public status and share URL
        setIsPublic(tripData.is_public || false);
        setShareUrl(`${window.location.origin}/public/trips/${id}`);

        // Organize activities by day
        if (tripData.sections && tripData.sections.length > 0) {
          const organizedDays = [];
          tripData.sections.forEach((section) => {
            if (section.activities && section.activities.length > 0) {
              section.activities.forEach((activity) => {
                const dayNum = activity.day_number || 1;
                if (!organizedDays[dayNum - 1]) {
                  organizedDays[dayNum - 1] = {
                    day: dayNum,
                    activities: [],
                  };
                }
                organizedDays[dayNum - 1].activities.push({
                  ...activity,
                  expense: activity.cost || 0,
                  type: activity.activity_type || "Activity",
                  time: activity.time_slot || "TBD",
                });
              });
            }
          });
          setDays(organizedDays.filter(Boolean));
        }
      } catch (err) {
        setError(err.message || "Failed to load itinerary");
        // Fallback to context
        const fallbackTrip = trips.find((t) => t.id === parseInt(id));
        setTrip(fallbackTrip);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, trips]);

  const totalExpense = days.reduce(
    (sum, day) => sum + day.activities.reduce((daySum, act) => daySum + (act.expense || 0), 0),
    0
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading itinerary...</span>
        </div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate("/trips")}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/trips")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GlobeTrotter</h1>
            <p className="text-gray-600 mt-1">
              Itinerary for: {trip?.title || "Selected Trip"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4 inline mr-1" />
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "calendar"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Calendar
            </button>
          </div>

          {/* Share/Public Toggle */}
          <button
            onClick={async () => {
              try {
                const updated = await tripService.updateTrip(parseInt(id), {
                  is_public: !isPublic
                });
                setIsPublic(!isPublic);
                if (!isPublic) {
                  alert(`Your trip is now public! Share it using: ${shareUrl}`);
                }
              } catch (err) {
                alert("Failed to update sharing settings: " + (err.error || err.message));
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md font-medium ${
              isPublic
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
            title={isPublic ? "Click to make private" : "Click to make public"}
          >
            {isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            <span>{isPublic ? "Public" : "Private"}</span>
          </button>

          <button
            onClick={() => navigate(`/trips/${id}/budget`)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md font-medium"
          >
            <DollarSign className="w-5 h-5" />
            <span>View Budget</span>
          </button>
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Group by</span>
          </button>
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

      {/* AI Optimization Panel */}
      <AIOptimizationPanel tripId={parseInt(id)} />

      {/* Budget Summary */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Total Estimated Budget</p>
            <p className="text-4xl font-bold">₹{totalExpense.toFixed(0)}</p>
          </div>
          <DollarSign className="w-16 h-16 text-white opacity-30" />
        </div>
      </div>

      {/* Day-wise Itinerary */}
      {days.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No activities planned yet</p>
          <p className="text-sm text-gray-500">Start building your itinerary</p>
          <button
            onClick={() => navigate(`/trips/${id}/itinerary`)}
            className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Build Itinerary
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {days.map((day) => (
            <div key={day.day} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="bg-indigo-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Day {day.day}</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Physical Activity Column */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-indigo-600" />
                      Physical Activity
                    </h3>
                    <div className="space-y-3">
                      {day.activities.map((activity, idx) => (
                        <div key={activity.id || idx} className="relative">
                          {idx < day.activities.length - 1 && (
                            <div className="absolute left-4 top-12 w-0.5 h-8 bg-gray-300"></div>
                          )}
                          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{activity.name}</h4>
                              <p className="text-sm text-gray-600">{activity.time}</p>
                              {activity.type && (
                                <span className="inline-block mt-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                                  {activity.type}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense Column */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Expense
                    </h3>
                    <div className="space-y-3">
                      {day.activities.map((activity, idx) => (
                        <div key={activity.id || idx} className="relative">
                          {idx < day.activities.length - 1 && (
                            <div className="absolute left-4 top-12 w-0.5 h-8 bg-gray-300"></div>
                          )}
                          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                              ₹{activity.expense || 0}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{activity.name}</h4>
                              <p className="text-sm text-gray-600">{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Day Total</span>
                  <span className="font-bold text-lg text-indigo-600">
                    ₹{day.activities.reduce((sum, act) => sum + (act.expense || 0), 0).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryView;
