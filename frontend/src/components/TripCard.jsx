import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, Edit, Trash2 } from "lucide-react";
import { tripService } from "../services/tripService";
import { useTrips } from "../context/TripsContext";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const { deleteTrip } = useTrips();

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
      {/* Trip Image/Header */}
      <div className="h-32 bg-gradient-to-r from-indigo-500 to-blue-600 relative">
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          🌍
        </div>
        {trip.status && (
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
            {trip.status}
          </span>
        )}
      </div>

      {/* Trip Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{trip.title || "Untitled Trip"}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{trip.destination || "No destination"}</span>
          </div>
          {trip.date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(trip.date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/trips/${trip.id}`)}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
                tripService.deleteTrip(trip.id)
                  .then(() => {
                    deleteTrip(trip.id);
                  })
                  .catch(err => {
                    alert("Failed to delete trip: " + (err?.error || err?.message || "Unknown error"));
                  });
              }
            }}
            className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
