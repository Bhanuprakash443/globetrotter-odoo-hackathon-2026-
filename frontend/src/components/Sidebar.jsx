import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass =
    "block px-4 py-2 rounded text-white hover:bg-indigo-500 transition";

  const activeClass = "bg-indigo-700 font-semibold";

  return (
    <div className="w-64 bg-indigo-600 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-white mb-10">
        GlobeTrotter
      </h1>

      <nav className="space-y-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/trips"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Trips
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;


