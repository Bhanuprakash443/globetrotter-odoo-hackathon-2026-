import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import CreateTripModal from "../components/CreateTripModal";
import TripCard from "../components/TripCard";
import { useTrips } from "../context/TripsContext";

const Trips = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { trips } = useTrips();

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tripsByStatus = {
    ongoing: filteredTrips.filter((t) => t.status === "ongoing"),
    upcoming: filteredTrips.filter((t) => t.status === "upcoming"),
    completed: filteredTrips.filter((t) => t.status === "completed"),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GlobeTrotter</h1>
          <p className="text-gray-600 mt-1">Your Trips</p>
        </div>
        <button
          onClick={() => navigate("/trips/create")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Create Trip</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Group by</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Sort by...</span>
          </button>
        </div>
      </div>

      {/* Trips by Status */}
      {statusFilter === "all" ? (
        <div className="space-y-6">
          {/* Ongoing Trips */}
          {tripsByStatus.ongoing.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ongoing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tripsByStatus.ongoing.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Trips */}
          {tripsByStatus.upcoming.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Up-coming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tripsByStatus.upcoming.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Trips */}
          {tripsByStatus.completed.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tripsByStatus.completed.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          )}

          {filteredTrips.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600 mb-4">No trips found</p>
              <button
                onClick={() => navigate("/trips/create")}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Trip</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
          {filteredTrips.length === 0 && (
            <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600">No trips found with this status</p>
            </div>
          )}
        </div>
      )}

      {open && <CreateTripModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Trips;
