import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, DollarSign, Star, Clock, Plane, Bus, Train, Car, Hotel, ShoppingBag, UtensilsCrossed, Mountain, Camera, Sparkles, Loader2 } from "lucide-react";
import { cityService } from "../services/cityService";
import { activityService } from "../services/activityService";

const CityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [shopping, setShopping] = useState([]);
  const [travelModes, setTravelModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCityData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Try to get city by ID first
        let cityData;
        try {
          cityData = await cityService.getCity(parseInt(id));
        } catch (err) {
          // If ID not found, try getting by name
          const cityName = decodeURIComponent(id);
          cityData = await cityService.getCityDetails(cityName);
          if (!cityData) {
            throw new Error("City not found");
          }
          // Convert details format to city format
          cityData = {
            id: parseInt(id),
            name: cityData.name,
            country: cityData.country,
            cost_index: cityData.cost_index,
            popularity: cityData.popularity,
            description: cityData.description,
            latitude: cityData.latitude,
            longitude: cityData.longitude
          };
        }

        setCity(cityData);

        // Try to get detailed information (hotels, shopping, etc.)
        try {
          const cityName = cityData.name || id;
          const details = await cityService.getCityDetails(cityName);
          if (details) {
            setHotels(details.hotels || []);
            setShopping(details.shopping || []);
            setTravelModes(generateTravelModes(cityData));
            // Use tourist_places and entertainment as activities
            const allActivities = [
              ...(details.tourist_places || []).map(tp => ({
                ...tp,
                activity_type: tp.type || "Sightseeing",
                name: tp.name,
                description: tp.description,
                cost: tp.cost || 0,
                duration: tp.duration || "1-2 hours"
              })),
              ...(details.entertainment || []).map(ent => ({
                ...ent,
                activity_type: ent.type || "Entertainment",
                name: ent.name,
                description: ent.description,
                cost: ent.cost || 0,
                duration: ent.timing || "2-3 hours"
              }))
            ];
            setActivities(allActivities);
          } else {
            // Fallback: fetch activities and generate data
            try {
              const activitiesData = await activityService.searchActivities(cityData.name);
              setActivities(activitiesData);
            } catch (err) {
              console.error("Failed to fetch activities:", err);
              setActivities([]);
            }
            generateCityData(cityData);
          }
        } catch (err) {
          console.error("Failed to fetch city details:", err);
          // Fallback to generate sample data
          generateCityData(cityData);
        }
      } catch (err) {
        console.error("Failed to load city:", err);
        setError("Failed to load city details");
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, [id]);

  const generateTravelModes = (cityData) => {
    const cityName = cityData.name || "";
    return [
      {
        id: 1,
        mode: "Flight",
        icon: Plane,
        from: "Your Location",
        to: cityName,
        duration: "6-12 hours",
        cost: 400,
        currency: "USD",
        description: "Fastest way to reach",
        pros: ["Fast", "Comfortable", "Direct"],
        cons: ["Expensive", "Airport transfers"]
      },
      {
        id: 2,
        mode: "Bus",
        icon: Bus,
        from: "Your Location",
        to: cityName,
        duration: "8-15 hours",
        cost: 80,
        currency: "USD",
        description: "Economical option",
        pros: ["Cheap", "Scenic route"],
        cons: ["Long journey", "Less comfortable"]
      },
      {
        id: 3,
        mode: "Train",
        icon: Train,
        from: "Your Location",
        to: cityName,
        duration: "5-10 hours",
        cost: 150,
        currency: "USD",
        description: "Balance of speed and comfort",
        pros: ["Comfortable", "Scenic", "City center"],
        cons: ["Limited routes", "May require transfers"]
      },
      {
        id: 4,
        mode: "Car",
        icon: Car,
        from: "Your Location",
        to: cityName,
        duration: "6-14 hours",
        cost: 120,
        currency: "USD",
        description: "Flexible and independent",
        pros: ["Flexible", "Freedom", "Can stop anywhere"],
        cons: ["Tiring", "Parking costs", "Fuel"]
      }
    ];
  };

  const generateCityData = (cityData) => {
    const cityName = cityData.name || "";
    
    // Generate hotels based on city
    const sampleHotels = [
      {
        id: 1,
        name: `${cityName} Luxury Hotel`,
        rating: 4.5,
        price: 150,
        type: "Luxury",
        amenities: ["WiFi", "Pool", "Spa", "Gym"],
        location: "City Center",
        image: "🏨"
      },
      {
        id: 2,
        name: `${cityName} Boutique Hotel`,
        rating: 4.2,
        price: 90,
        type: "Boutique",
        amenities: ["WiFi", "Breakfast", "Parking"],
        location: "Downtown",
        image: "🏩"
      },
      {
        id: 3,
        name: `${cityName} Budget Inn`,
        rating: 3.8,
        price: 50,
        type: "Budget",
        amenities: ["WiFi", "Breakfast"],
        location: "Near Airport",
        image: "🛏️"
      }
    ];
    setHotels(sampleHotels);

    // Generate shopping locations
    const sampleShopping = [
      {
        id: 1,
        name: `${cityName} Shopping Mall`,
        type: "Mall",
        description: "Modern shopping center with international brands",
        priceRange: "$$-$$$",
        image: "🛍️"
      },
      {
        id: 2,
        name: `${cityName} Souk/Market`,
        type: "Market",
        description: "Traditional market for local crafts and souvenirs",
        priceRange: "$-$$",
        image: "🏪"
      },
      {
        id: 3,
        name: `${cityName} Luxury District`,
        type: "Luxury",
        description: "High-end shopping for designer brands",
        priceRange: "$$$-$$$$",
        image: "💎"
      }
    ];
    setShopping(sampleShopping);
    setTravelModes(generateTravelModes(cityData));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading city details...</p>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">City Not Found</h2>
          <p className="text-gray-600 mb-6">The city you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/cities")}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cities
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: MapPin },
    { id: "hotels", label: "Hotels", icon: Hotel },
    { id: "activities", label: "Things to Do", icon: Camera },
    { id: "shopping", label: "Shopping", icon: ShoppingBag },
    { id: "travel", label: "How to Reach", icon: Plane },
    { id: "budget", label: "Budget Planning", icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background */}
      <div className="relative h-96 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='globe' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='white' stroke-width='1'/%3E%3Ccircle cx='20' cy='20' r='2' fill='white'/%3E%3Ccircle cx='80' cy='30' r='2' fill='white'/%3E%3Ccircle cx='70' cy='70' r='2' fill='white'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23globe)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-8">
          <button
            onClick={() => navigate("/cities")}
            className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-6xl mb-4">{city.name === "Dubai" ? "🏙️" : city.name === "Paris" ? "🇫🇷" : city.name === "Tokyo" ? "🇯🇵" : "🌍"}</div>
            <h1 className="text-5xl font-bold text-white mb-2">{city.name}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <MapPin className="w-5 h-5" />
              <span className="text-xl">{city.country}</span>
              {city.cost_index && (
                <>
                  <span className="text-white/50">•</span>
                  <DollarSign className="w-5 h-5" />
                  <span>{city.cost_index} Cost Index</span>
                </>
              )}
              {city.popularity && (
                <>
                  <span className="text-white/50">•</span>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{city.popularity}% Popular</span>
                </>
              )}
            </div>
            {city.description && (
              <p className="text-white/80 mt-4 text-lg max-w-3xl">{city.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg. Daily Budget</p>
                    <p className="text-2xl font-bold text-gray-900">₹{city.cost_index === "Low" ? "2,000" : city.cost_index === "Medium" ? "5,000" : city.cost_index === "High" ? "10,000" : "15,000"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Best Time to Visit</p>
                    <p className="text-2xl font-bold text-gray-900">All Year</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tourist Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{city.popularity || 85}/100</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {city.name}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {city.description || `${city.name} is a vibrant destination offering a perfect blend of culture, adventure, and modern amenities. Whether you're looking for historical sites, breathtaking natural beauty, world-class dining, or exciting nightlife, ${city.name} has something for everyone.`}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Activities</p>
                  <p className="text-xl font-bold text-gray-900">{activities.length || 15}+</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hotels</p>
                  <p className="text-xl font-bold text-gray-900">{hotels.length || 50}+</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Shopping Centers</p>
                  <p className="text-xl font-bold text-gray-900">{shopping.length || 20}+</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Travel Options</p>
                  <p className="text-xl font-bold text-gray-900">{travelModes.length || 4}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hotels Tab */}
        {activeTab === "hotels" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Hotels & Accommodation</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Filter Hotels
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-6xl">
                    {hotel.image}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">{hotel.type}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(hotel.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{hotel.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{hotel.location}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">${hotel.price}</p>
                        <p className="text-sm text-gray-600">per night</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Things to Do in {city.name}</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">All</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Sightseeing</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Adventure</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Culture</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Food</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.length > 0 ? activities.slice(0, 12).map((activity, idx) => (
                <div key={activity.id || idx} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-6xl">
                    {activity.activity_type === "Sightseeing" ? "🗼" : activity.activity_type === "Food" ? "🍷" : activity.activity_type === "Adventure" ? "⛰️" : activity.activity_type === "Culture" ? "🎨" : "🎯"}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{activity.name}</h3>
                      {activity.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">{activity.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">{activity.activity_type}</span>
                      {activity.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activity.duration}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-gray-900">₹{activity.cost || 0}</p>
                        <p className="text-xs text-gray-600">per person</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                        Add to Trip
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No activities found. Check back later!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shopping Tab */}
        {activeTab === "shopping" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping in {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopping.map((shop) => (
                <div key={shop.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-6xl">
                    {shop.image}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{shop.name}</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">{shop.type}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{shop.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Price Range</p>
                        <p className="text-lg font-bold text-gray-900">{shop.priceRange}</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travel Modes Tab */}
        {activeTab === "travel" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Reach {city.name}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {travelModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <div key={mode.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{mode.mode}</h3>
                        <p className="text-gray-600 text-sm">{mode.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-900">{mode.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Cost:</span>
                        <span className="text-xl font-bold text-indigo-600">{mode.cost} {mode.currency}</span>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600 mb-1">Route:</p>
                        <p className="font-medium text-gray-900">{mode.from} → {mode.to}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-green-600 font-medium mb-1">Pros:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {mode.pros.map((pro, idx) => (
                            <li key={idx}>✓ {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-red-600 font-medium mb-1">Cons:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {mode.cons.map((con, idx) => (
                            <li key={idx}>✗ {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                      Book {mode.mode}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Budget Planning Tab */}
        {activeTab === "budget" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget Planning for {city.name}</h2>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Estimated Budget for 5 Days</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Plane className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">Transportation</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">₹{travelModes[0]?.cost * 85 || 34000}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Hotel className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">Accommodation (4 nights)</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">₹{(hotels[0]?.price || 150) * 4 * 85}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UtensilsCrossed className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">Food & Dining</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">₹{city.cost_index === "Low" ? "10000" : city.cost_index === "Medium" ? "25000" : "50000"}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">Activities & Sightseeing</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">₹{city.cost_index === "Low" ? "8000" : city.cost_index === "Medium" ? "20000" : "40000"}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">Shopping</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">₹{city.cost_index === "Low" ? "5000" : city.cost_index === "Medium" ? "15000" : "30000"}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-600">
                  <span className="text-xl font-bold text-gray-900">Total Estimated Budget</span>
                  <span className="text-3xl font-bold text-indigo-600">
                    ₹{(() => {
                      const transport = (travelModes[0]?.cost || 400) * 85;
                      const hotel = (hotels[0]?.price || 150) * 4 * 85;
                      const food = city.cost_index === "Low" ? 10000 : city.cost_index === "Medium" ? 25000 : 50000;
                      const activities = city.cost_index === "Low" ? 8000 : city.cost_index === "Medium" ? 20000 : 40000;
                      const shopping = city.cost_index === "Low" ? 5000 : city.cost_index === "Medium" ? 15000 : 30000;
                      return (transport + hotel + food + activities + shopping).toLocaleString();
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Budget Tips</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Book flights and hotels in advance for better rates</li>
                    <li>• Consider budget accommodation options to save on stay</li>
                    <li>• Try local street food for authentic experience and savings</li>
                    <li>• Look for combo tickets for multiple attractions</li>
                    <li>• Set aside 20% extra for unexpected expenses</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityDetail;

