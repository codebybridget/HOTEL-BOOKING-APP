import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import RoleSelect from "./RoleSelect";

// Navigation links
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Hotels", path: "/rooms" },
  { name: "Experience", path: "/experience" },
  { name: "About", path: "/about" },
];

// Icon
const BookIcon = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    />
  </svg>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  const { openSignIn } = useClerk();
  const location = useLocation();
  const { user, navigate, isOwner } = useAppContext();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== "/") {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 10);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Lock scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  // Handle role selection
  const handleRoleSelect = async (role) => {
    try {
      await axios.post("/api/user/set-role", { role });

      setShowRoleSelect(false);

      if (role === "hotelOwner") {
        navigate("/owner");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const textColor = isScrolled ? "text-gray-700" : "text-white";
  const bgStyle = isScrolled
    ? "bg-white/80 shadow-md backdrop-blur-lg py-3 md:py-4"
    : "bg-indigo-500 py-4 md:py-6";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${bgStyle}`}
      >
        {/* Logo */}
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className={`h-9 ${isScrolled ? "invert opacity-80" : ""}`}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`group flex flex-col gap-0.5 ${textColor}`}
            >
              {link.name}
              <div
                className={`${
                  isScrolled ? "bg-gray-700" : "bg-white"
                } h-0.5 w-0 group-hover:w-full transition-all`}
              />
            </Link>
          ))}

          {/* Role button */}
          {user && (
            <button
              onClick={() => {
                if (isOwner) {
                  navigate("/owner");
                } else {
                  setShowRoleSelect(true);
                }
              }}
              className={`border px-4 py-1 text-sm rounded-full ${textColor}`}
            >
              {isOwner ? "Dashboard" : "List your Hotel"}
            </button>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <img
            src={assets.searchIcon}
            alt="search"
            className={`h-7 ${isScrolled ? "invert" : ""}`}
          />

          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<BookIcon />}
                  onClick={() => navigate("/my-bookings")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={openSignIn}
              className={`px-8 py-2.5 rounded-full ${
                isScrolled ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          {user && <UserButton />}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img
              src={assets.menuIcon}
              alt="menu"
              className={`h-4 ${isScrolled ? "invert" : ""}`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-6 transition-transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            ✕
          </button>

          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              {link.name}
            </Link>
          ))}

          {user && (
            <button
              onClick={() => {
                if (isOwner) {
                  navigate("/owner");
                } else {
                  setShowRoleSelect(true);
                }
              }}
              className="border px-4 py-1 rounded-full"
            >
              {isOwner ? "Dashboard" : "List your Hotel"}
            </button>
          )}
        </div>
      </nav>

      {/* Role Modal */}
      {showRoleSelect && (
        <RoleSelect onSelect={handleRoleSelect} />
      )}
    </>
  );
};

export default Navbar;