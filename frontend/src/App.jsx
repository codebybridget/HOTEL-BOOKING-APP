import React from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Experience from "./pages/Experience";
import About from "./pages/About";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import HotelDetails from "./pages/HotelDetails";
import MyBookings from "./pages/MyBookings";

import Layout from "./pages/HotelOwner/Layout";
import Dashboard from "./pages/HotelOwner/Dashboard";
import AddRoom from "./pages/HotelOwner/AddRoom";
import ListRoom from "./pages/HotelOwner/ListRoom";

import { useAppContext } from "./context/AppContext";

const App = () => {
  const location = useLocation();

  const isOwnerRoute = location.pathname.startsWith("/owner");

  const { user, isOwner, roleLoaded } = useAppContext();

  const ProtectedOwnerRoute = ({ children }) => {
    if (!roleLoaded) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <p className="text-lg text-gray-500">Loading dashboard...</p>
        </div>
      );
    }

    if (!user || !isOwner) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {!isOwnerRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<AllRooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/owner"
          element={
            <ProtectedOwnerRoute>
              <Layout />
            </ProtectedOwnerRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="list-room" element={<ListRoom />} />
        </Route>

        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-2xl">
              Page Not Found
            </h1>
          }
        />
      </Routes>

      {!isOwnerRoute && <Footer />}
    </div>
  );
};

export default App;