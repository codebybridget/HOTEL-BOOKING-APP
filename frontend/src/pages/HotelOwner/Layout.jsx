import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../../components/HotelOwner/Navbar";
import Sidebar from "../../components/HotelOwner/Sidebar";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex h-full overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 pt-10 md:px-10 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;