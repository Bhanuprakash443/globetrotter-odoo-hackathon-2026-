import { useState } from "react";
import { Edit, Save, Camera, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { validation } from "../utils/validation";
import InputField from "../components/InputField";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Bhanu",
    lastName: "Prakash",
    email: "bhanu@example.com",
    phone: "+1 234 567 8900",
    city: "Coimbatore",
    country: "India",
    bio: "Travel enthusiast and adventure seeker. Love exploring new cultures and destinations!",
    avatar: "👤"
  });
  const [errors, setErrors] = useState({});

  // Sample trips - would come from API
  const preplannedTrips = [
    { id: 1, title: "Summer Europe Tour", destination: "Paris, Rome, Barcelona", date: "2024-07-15", status: "upcoming" },
    { id: 2, title: "Asian Discovery", destination: "Tokyo, Seoul", date: "2024-09-20", status: "upcoming" },
  ];

  const previousTrips = [
    { id: 3, title: "Winter Wonderland", destination: "Switzerland", date: "2024-01-10", status: "completed" },
    { id: 4, title: "Beach Paradise", destination: "Maldives", date: "2023-12-05", status: "completed" },
    { id: 5, title: "City Break", destination: "Dubai", date: "2023-11-15", status: "completed" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailError = validation.validateEmail(profileData.email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validation.validatePhone(profileData.phone);
    if (phoneError) newErrors.phone = phoneError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Get user ID from auth context or session
      const userId = parseInt(localStorage.getItem('userId') || '1');
      await userService.updateUser(userId, profileData);
      setIsEditing(false);
    } catch (error) {
      setErrors({ submit: error.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GlobeTrotter</h1>
          <p className="text-gray-600 mt-1">User Profile</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-5xl text-white mb-4">
                {profileData.avatar}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? "Saving..." : "Save"}</span>
                </button>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                disabled={!isEditing}
              />

              <InputField
                label="Last Name"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                disabled={!isEditing}
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={!isEditing}
              />

              <InputField
                label="Phone"
                name="phone"
                type="tel"
                value={profileData.phone}
                onChange={handleChange}
                error={errors.phone}
                disabled={!isEditing}
              />

              <InputField
                label="City"
                name="city"
                value={profileData.city}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <InputField
                label="Country"
                name="country"
                value={profileData.country}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preplanned Trips */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Preplanned Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {preplannedTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{trip.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{trip.destination}</p>
              <p className="text-xs text-gray-500 mb-4">{trip.date}</p>
              <button
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Trips */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Previous Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previousTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{trip.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{trip.destination}</p>
              <p className="text-xs text-gray-500 mb-4">{trip.date}</p>
              <button
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
