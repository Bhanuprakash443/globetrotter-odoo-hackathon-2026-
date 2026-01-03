import { useNavigate } from "react-router-dom";
import { User, LogOut, Bell, Settings } from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <p className="text-sm text-gray-500">Welcome back,</p>
          <p className="font-semibold text-gray-900">Bhanu 👋</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            BP
          </div>
          <span className="hidden md:block font-medium text-gray-700">Bhanu</span>
        </button>
        
        <button
          onClick={() => navigate("/")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
