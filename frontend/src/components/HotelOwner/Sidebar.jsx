import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
    { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
    { name: "List Room", path: "/owner/list-room", icon: assets.listIcon },
  ];

  return (
    <aside className="h-full w-16 md:w-64 border-r border-gray-200 pt-4 flex flex-col transition-all duration-300">
      {sidebarLinks.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/owner"}
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 md:px-8 transition ${
              isActive
                ? "bg-blue-600/10 text-blue-600 border-r-4 md:border-r-[6px] border-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <img
            src={item.icon}
            alt={item.name}
            className="w-5 h-5"
          />

          <span className="hidden md:block">{item.name}</span>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;