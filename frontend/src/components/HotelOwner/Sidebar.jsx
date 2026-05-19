import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/owner",
      icon: assets.dashboardIcon,
    },
    {
      name: "Add Room",
      path: "/owner/add-room",
      icon: assets.addIcon,
    },
    {
      name: "Room Listings",
      path: "/owner/list-room",
      icon: assets.listIcon,
    },
  ];

  return (
    <aside className="h-screen sticky top-0 w-16 md:w-64 border-r border-gray-200 bg-white flex flex-col transition-all duration-300">
      {/* TITLE */}
      <div className="hidden md:flex items-center px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Hotel Owner
        </h2>
      </div>

      {/* LINKS */}
      <div className="flex flex-col pt-4">
        {sidebarLinks.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/owner"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 md:px-6 transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/10 text-blue-600 border-r-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-5 h-5"
            />

            <span className="hidden md:block text-sm font-medium">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;