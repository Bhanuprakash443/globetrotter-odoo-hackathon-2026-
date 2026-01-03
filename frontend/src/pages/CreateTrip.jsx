import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Sparkles, ArrowLeft, Loader2, Camera } from "lucide-react";
import { useTrips } from "../context/TripsContext";
import { tripService } from "../services/tripService";
import { activityService } from "../services/activityService";
import { validation } from "../utils/validation";
import InputField from "../components/InputField";

const CreateTrip = () => {
  const navigate = useNavigate();
  const { addTrip } = useTrips();
  const [formData, setFormData] = useState({
    tripName: "",
    startDate: "",
    endDate: "",
    selectedPlace: "",
    description: "",
    coverImage: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  // Fetch activity suggestions based on selected place
  useEffect(() => {
    if (formData.selectedPlace && formData.selectedPlace.length > 2) {
      setSuggestionsLoading(true);
      activityService
        .searchActivities(formData.selectedPlace)
        .then((results) => {
          setSuggestions(results.slice(0, 6));
        })
        .catch(() => {
          setSuggestions([]);
        })
        .finally(() => {
          setSuggestionsLoading(false);
        });
    } else {
      setSuggestions([]);
    }
  }, [formData.selectedPlace]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const titleError = validation.validateTripTitle(formData.tripName);
    if (titleError) newErrors.tripName = titleError;

    const startDateError = validation.validateDate(formData.startDate, "Start Date");
    if (startDateError) newErrors.startDate = startDateError;

    const endDateError = validation.validateDate(formData.endDate, "End Date");
    if (endDateError) newErrors.endDate = endDateError;

    const placeError = validation.validateRequired(formData.selectedPlace, "Destination");
    if (placeError) newErrors.selectedPlace = placeError;

    const dateRangeError = validation.validateDateRange(formData.startDate, formData.endDate);
    if (dateRangeError) newErrors.endDate = dateRangeError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Get current user ID from auth context or session
      // For hackathon: Get from localStorage or context
      const userId = parseInt(localStorage.getItem('userId') || '1');
      
      const tripData = {
        user_id: userId,
        title: formData.tripName,
        destination: formData.selectedPlace,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: "upcoming",
        description: formData.description || null,
      };

      // If cover image is uploaded, create FormData for file upload
      if (formData.coverImage) {
        const formDataObj = new FormData();
        Object.keys(tripData).forEach(key => {
          formDataObj.append(key, tripData[key]);
        });
        formDataObj.append('cover_image', formData.coverImage);
        // For now, just store filename - in production, upload to cloud storage
        tripData.cover_image_url = formData.coverImage.name;
      }

      const newTrip = await tripService.createTrip(tripData);

      // Add to local context
      addTrip({
        id: newTrip.id,
        title: formData.tripName,
        destination: formData.selectedPlace,
        startDate: formData.startDate,
        endDate: formData.endDate,
        date: formData.startDate,
        status: "upcoming",
      });

      navigate(`/trips/${newTrip.id}/itinerary`);
    } catch (error) {
      setErrors({ submit: error.message || "Failed to create trip. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/trips")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GlobeTrotter</h1>
          <p className="text-gray-600 mt-1">Plan a new trip</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
          {/* Trip Name */}
          <InputField
            label="Trip Name"
            name="tripName"
            type="text"
            value={formData.tripName}
            onChange={handleChange}
            placeholder="e.g., Summer Europe Adventure"
            error={errors.tripName}
            required
          />

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
              icon={Calendar}
            />

            <InputField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
              required
              icon={Calendar}
            />
          </div>

          {/* Select Place */}
          <InputField
            label="Select a Place"
            name="selectedPlace"
            type="text"
            value={formData.selectedPlace}
            onChange={handleChange}
            placeholder="Search for a city or destination..."
            error={errors.selectedPlace}
            required
            icon={MapPin}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trip Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your trip plans..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Cover Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, coverImage: file });
                  }
                }}
                className="hidden"
                id="coverPhoto"
              />
              <label
                htmlFor="coverPhoto"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {formData.coverImage ? formData.coverImage.name : "Choose Image"}
                </span>
              </label>
              {formData.coverImage && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, coverImage: null })}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Upload a cover image for your trip (max 5MB)</p>
          </div>
        </div>

        {/* Suggestions */}
        {(suggestions.length > 0 || suggestionsLoading) && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Suggestions for Places to Visit / Activities to Perform
              </h2>
            </div>
            {suggestionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                <span className="ml-3 text-gray-600">Loading suggestions...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!formData.selectedPlace) {
                        setFormData({ ...formData, selectedPlace: item.city_name || item.city || "" });
                      }
                    }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-indigo-500"
                  >
                    <div className="text-4xl mb-2">
                      {item.activity_type === "Sightseeing" ? "🗼" :
                       item.activity_type === "Food" ? "🍷" :
                       item.activity_type === "Adventure" ? "⛰️" :
                       item.activity_type === "Culture" ? "🎨" : "🌍"}
                    </div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.activity_type || item.name}</p>
                    <p className="text-sm font-medium text-indigo-600 mt-2">
                      {item.cost === 0 || !item.cost ? "Free" : `₹${item.cost}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Continue to Itinerary"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;
