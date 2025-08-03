import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/layout/Layout,";
import Dashboard from "./view/Dashboard/Dashboard";
import AdminLogin from "./view/auth/adminLogin";
import AdminSignUp from "./view/auth/adminSignUp";
import States from "./view/states/States";
import Cities from "./view/city/Cities";
import Places from "./view/places/Places";
import Foods from "./view/foods/Foods";
import { Toaster } from "react-hot-toast";
import Activity from "./view/activity/Activity";
import Hotels from "./view/hotel/hotels";
import Destination from "./view/destination/Destination";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<AdminSignUp />} />
        {/* All protected routes go here */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="states" element={<States />} />
          <Route path="cities" element={<Cities />} />
          <Route path="places" element={<Places />} />
          <Route path="foods" element={<Foods />} />
          <Route path="activity" element={<Activity />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="destination" element={<Destination />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
