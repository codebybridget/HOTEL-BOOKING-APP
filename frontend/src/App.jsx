import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HotelReg from "./components/HotelReg";
import RoleSelect from "./components/RoleSelect";

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
  const isOwnerRoute = location.pathname.startsWith("/owner");

  const {
    user,
    axios,
    navigate,
    showHotelReg,
    isOwner,
    roleLoaded,
  } = useAppContext();

  const shouldShowRoleSelect = user && roleLoaded && !isOwner;

  const handleRoleSelect = async (role) => {
    try {
      const { data } = await axios.post("/api/user/set-role", { role });

      if (data.success) {
        toast.success("Account type selected");

        if (role === "hotelOwner") {
          navigate("/owner");
        } else {
          navigate("/");
        }

        window.location.reload();
      } else {
        toast.error(data.message || "Failed to select role");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to select account type");
    }
  };

  return (
    <>
      {!isOwnerRoute && <Navbar />}

      {showHotelReg && <HotelReg />}

      {shouldShowRoleSelect && <RoleSelect onSelect={handleRoleSelect} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<AllRooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/about" element={<About />} />

        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="list-room" element={<ListRoom />} />
        </Route>

        <Route
          path="*"
          element={<h1 className="text-center mt-20 text-2xl">Page Not Found</h1>}
        />
      </Routes>

      {!isOwnerRoute && <Footer />}
    </>
  );
};

export default App;