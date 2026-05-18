import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HotelReg from "./components/HotelReg";

import Home from "./pages/Home";
import Experience from "./pages/Experience";
import About from "./pages/About";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";

import Layout from "./pages/HotelOwner/Layout";
import Dashboard from "./pages/HotelOwner/Dashboard";
import AddRoom from "./pages/HotelOwner/AddRoom";
import ListRoom from "./pages/HotelOwner/ListRoom";

import { useAppContext } from "./context/AppContext";

const App = () => {
  const location = useLocation();

  // Check if user is on owner dashboard
  const isOwnerRoute = location.pathname.startsWith("/owner");

  const { showHotelReg } = useAppContext();

  return (
    <>
      {/* Navbar */}
      {!isOwnerRoute && <Navbar />}

      {/* Hotel Registration Modal */}
      {showHotelReg && <HotelReg />}

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<AllRooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/about" element={<About />} />

        {/* Owner Dashboard */}
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="list-room" element={<ListRoom />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-2xl">
              Page Not Found
            </h1>
          }
        />
      </Routes>

      {/* Footer */}
      {!isOwnerRoute && <Footer />}
    </>
  );
};

export default App;