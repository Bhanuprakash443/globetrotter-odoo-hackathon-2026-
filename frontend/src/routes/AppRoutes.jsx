import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import PublicItinerary from "../pages/PublicItinerary";
import Dashboard from "../pages/Dashboard";
import Trips from "../pages/Trips";
import CreateTrip from "../pages/CreateTrip";
import BuildItinerary from "../pages/BuildItinerary";
import ItineraryView from "../pages/ItineraryView";
import CitySearch from "../pages/CitySearch";
import CityDetail from "../pages/CityDetail";
import ActivitySearch from "../pages/ActivitySearch";
import BudgetBreakdown from "../pages/BudgetBreakdown";
import CalendarView from "../pages/CalendarView";
import Community from "../pages/Community";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import AppLayout from "../layout/AppLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/public/trips/:id" element={<PublicItinerary />} />

        {/* Protected layout */}
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="trips" element={<Trips />} />
          <Route path="trips/create" element={<CreateTrip />} />
          <Route path="trips/:id" element={<ItineraryView />} />
          <Route path="trips/:id/itinerary" element={<BuildItinerary />} />
          <Route path="trips/:id/budget" element={<BudgetBreakdown />} />
          <Route path="cities" element={<CitySearch />} />
          <Route path="cities/:id" element={<CityDetail />} />
          <Route path="activities" element={<ActivitySearch />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="community" element={<Community />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
