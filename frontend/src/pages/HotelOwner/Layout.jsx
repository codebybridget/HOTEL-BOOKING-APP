import React from "react";
import { Outlet } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";

import Navbar from "../../components/HotelOwner/Navbar";
import Sidebar from "../../components/HotelOwner/Sidebar";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { navigate } = useAppContext();

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex h-full overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 pt-8 md:px-10 h-full overflow-y-auto">
          <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-xl font-medium transition"
            >
              Go Home
            </button>

            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-medium transition"
              >
                Logout
              </button>
            </SignOutButton>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;