import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  User, 
  Settings, 
  Search,
  Activity,
  DollarSign,
  Globe
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-600 to-blue-600 text-white p-6 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">GlobeTrotter</h1>
        <p className="text-indigo-200 text-sm mt-1">Travel Planning Made Easy</p>
      </div>

      <nav className="space-y-1 flex-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? "bg-white text-indigo-600 font-medium" : "hover:bg-indigo-500 text-white"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/trips"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? "bg-white text-indigo-600 font-medium" : "hover:bg-indigo-500 text-white"
            }`
          }
        >
          <MapPin className="w-5 h-5" />
          <span>My Trips</span>
        </NavLink>

        <NavLink
          to="/cities"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? "bg-white text-indigo-600 font-medium" : "hover:bg-indigo-500 text-white"
            }`
          }
        >
          <Search className="w-5 h-5" />
          <span>Search Cities</span>
        </NavLink>

        <NavLink
          to="/activities"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? "bg-white text-indigo-600 font-medium" : "hover:bg-indigo-500 text-white"
            }`
          }
        >
          <Activity className="w-5 h-5" />
          <span>Search Activities</span>
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? "bg-white text-indigo-600 font-medium" : "hover:bg-indigo-500 text-white"
            }`
          }
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar View</span>
        </NavLink>

        <NavLink
          to="/community"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? "bg-white text-indigo-600 font-medium" : "hover:bg-indigo-500 text-white"
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span>Community</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? "bg-white text-indigo-600 font-medium" : "hover:bg-indigo-500 text-white"
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? "bg-white text-indigo-600 font-medium" : "hover:bg-indigo-500 text-white"
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Admin Panel</span>
        </NavLink>
      </nav>

      <div className="mt-auto pt-4 border-t border-indigo-500">
        <div className="flex items-center gap-2 text-indigo-200 text-sm">
          <Globe className="w-4 h-4" />
          <span>GlobeTrotter v1.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
