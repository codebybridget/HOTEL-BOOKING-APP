import React from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import { UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    {
      name: "Dashboard",
      path: "/owner",
    },
    {
      name: "Add Room",
      path: "/owner/add-room",
    },
    {
      name: "Room Listings",
      path: "/owner/list-room",
    },
  ];

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      {/* LOGO */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="Company logo"
          className="h-9 invert opacity-80"
        />
      </Link>

      {/* NAV LINKS */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium transition ${
              location.pathname === link.path
                ? "text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default Navbar;