import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, Users, TrendingUp, MapPin, Activity, Loader2 } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { analyticsService } from "../services/analyticsService";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [stats, setStats] = useState(null);
  const [popularActivities, setPopularActivities] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, activitiesData, destinationsData] = await Promise.all([
          analyticsService.getStatistics(),
          analyticsService.getPopularActivities(),
          analyticsService.getPopularDestinations(10)
        ]);
        
        setStats(statsData);
        setPopularActivities(activitiesData);
        setPopularDestinations(destinationsData);
      } catch (err) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Process data for charts
  const processedActivities = popularActivities.map((act, idx) => ({
    name: act.activity_type,
    value: act.count || 0,
    color: ["#818CF8", "#6366F1", "#4F46E5", "#4338CA", "#3730A3"][idx % 5]
  }));

  const tabs = [
    { id: "users", label: "Manage Users", icon: Users },
    { id: "activities", label: "Popular Activity", icon: Activity },
    { id: "destinations", label: "Popular Destination", icon: MapPin },
    { id: "analytics", label: "User Trends and Analytics", icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GlobeTrotter</h1>
          <p className="text-gray-600 mt-1">Admin Panel</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
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

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
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
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading analytics...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <>
              {activeTab === "users" && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Users</h2>
                  <p className="text-gray-600 mb-4">
                    This section allows the admin to manage the users and their roles. You can view, edit, or remove user accounts.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">User management table will be displayed here</p>
                    {stats && (
                      <p className="text-sm text-gray-500 mt-2">Total Users: {stats.total_users || 0}</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "activities" && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Activity</h2>
                  <p className="text-gray-600 mb-4">
                    This section shows the popular activities that users are most interested in.
                  </p>
                  {processedActivities.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={processedActivities}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {processedActivities.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-600">No activity data available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "destinations" && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Destination</h2>
                  <p className="text-gray-600 mb-4">
                    This section shows the popular destinations that users are planning trips to.
                  </p>
                  {popularDestinations.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={popularDestinations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="trip_count" fill="#6366F1" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-600">No destination data available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "analytics" && stats && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">User Trends and Analytics</h2>
                    <p className="text-gray-600 mb-4">
                      This section shows the user trends and analytics with detailed insights into platform usage.
                    </p>
                  </div>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <p className="text-sm text-indigo-600 mb-1">Total Users</p>
                      <p className="text-2xl font-bold text-indigo-900">{stats.total_users || 0}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-600 mb-1">Total Trips</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.total_trips || 0}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-sm text-purple-600 mb-1">Total Activities</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.total_activities || 0}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-600 mb-1">Total Cities</p>
                      <p className="text-2xl font-bold text-green-900">{stats.total_cities || 0}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <p className="text-sm text-yellow-600 mb-1">Total Posts</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.total_posts || 0}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-red-600 mb-1">Total Sections</p>
                      <p className="text-2xl font-bold text-red-900">{stats.total_sections || 0}</p>
                    </div>
                  </div>

                  {/* Charts Grid */}
                  {processedActivities.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Popular Activities Pie */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Popular Activities</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={processedActivities}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label
                            >
                              {processedActivities.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Popular Destinations */}
                      {popularDestinations.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="font-semibold text-gray-900 mb-4">Popular Destinations</h3>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={popularDestinations.slice(0, 5)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="trip_count" fill="#4F46E5" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
