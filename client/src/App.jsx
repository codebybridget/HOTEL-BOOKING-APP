import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Experience from "./pages/Experience";
import About from "./pages/About";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import HotelReg from "./components/HotelReg";
import Layout from "./pages/HotelOwner/Layout";
import Dashboard from "./pages/HotelOwner/Dashboard";
import AddRoom from "./pages/HotelOwner/AddRoom";
import ListRoom from "./pages/HotelOwner/ListRoom";

const App = () => {
  const isOwnerpath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerpath && <Navbar />}
      {false && <HotelReg />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<AllRooms />} />
         <Route path="/rooms/:id" element={<RoomDetails/>} />
        <Route path="/my-bookings" element={< MyBookings/>} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/about" element={<About />} />
        <Route path="/owner" element={<Layout/>}>
           <Route index element={<Dashboard/>}/>
           <Route path="add-room" element={<AddRoom />} />
           <Route path="list-room" element={<ListRoom />} />
        </Route>
      </Routes>

      {!isOwnerpath && <Footer />}
    </div>
  );
};

export default App;
