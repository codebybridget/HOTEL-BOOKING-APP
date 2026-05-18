import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-3 bg-white border-b border-gray-200 shadow-sm">
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="Company logo"
          className="h-9 invert opacity-80"
        />
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default Navbar;