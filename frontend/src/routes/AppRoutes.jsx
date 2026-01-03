import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Trips from "../pages/Trips";
import AppLayout from "../layout/AppLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;


