import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Copy, Check, Globe, Calendar, MapPin, DollarSign, Activity, Loader2, Lock } from "lucide-react";
import { tripService } from "../services/tripService";

const PublicItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const fetchPublicTrip = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const tripData = await tripService.getCompleteTrip(parseInt(id));
        
        // Check if trip is public
        if (!tripData.is_public) {
          setError("This itinerary is private and cannot be viewed.");
          return;
        }

        setTrip(tripData);
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
      } finally {
        setLoading(false);
      }
    };

    fetchPublicTrip();
  }, [id]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: trip.title,
          text: `Check out my trip itinerary: ${trip.title}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  const handleCopyTrip = async () => {
    if (!trip) return;
    
    try {
      const userId = parseInt(localStorage.getItem('userId') || '1');
      const newTrip = await tripService.createTrip({
        user_id: userId,
        title: `${trip.title} (Copy)`,
        destination: trip.destination,
        start_date: trip.start_date,
        end_date: trip.end_date,
        status: "upcoming",
        description: trip.description || null,
        is_public: false, // Copied trips are private by default
      });
      
      alert(`Trip copied successfully! Redirecting to your trip...`);
      navigate(`/trips/${newTrip.id}/itinerary`);
    } catch (err) {
      alert("Failed to copy trip: " + (err.error || err.message));
    }
  };

  const totalExpense = days.reduce(
    (sum, day) => sum + day.activities.reduce((daySum, act) => daySum + (act.expense || 0), 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center border border-gray-200">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-600">Public Itinerary</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
              <button
                onClick={handleCopyTrip}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Copy Trip
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Trip Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {trip.cover_image_url && (
            <div className="h-64 bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center">
              <img
                src={trip.cover_image_url}
                alt={trip.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{trip.title || "Untitled Trip"}</h1>
            {trip.description && (
              <p className="text-gray-600 mb-4">{trip.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {trip.destination && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.destination}</span>
                </div>
              )}
              {trip.start_date && trip.end_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>₹{totalExpense.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

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
            <p className="text-gray-600 mb-2">No activities in this itinerary</p>
          </div>
        ) : (
          <div className="space-y-6">
            {days.map((day) => (
              <div key={day.day} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="bg-indigo-600 text-white px-6 py-4">
                  <h2 className="text-xl font-bold">Day {day.day}</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {day.activities.map((activity, idx) => (
                      <div key={activity.id || idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{activity.name || "Activity"}</h3>
                          <span className="text-sm font-medium text-indigo-600">₹{activity.expense || 0}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded">{activity.type}</span>
                          {activity.time && (
                            <span className="bg-gray-100 px-2 py-1 rounded">{activity.time}</span>
                          )}
                        </div>
                        {activity.description && (
                          <p className="mt-2 text-sm text-gray-600">{activity.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-200">
          <p className="text-gray-600 mb-4">
            Liked this itinerary? Copy it to create your own version!
          </p>
          <button
            onClick={handleCopyTrip}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Copy This Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicItinerary;

