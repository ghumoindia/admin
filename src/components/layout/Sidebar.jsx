import React from "react";
import { Link, useLocation } from "react-router";

import { NAV_ITEMS } from "../../config/navigation";
import { cn } from "../lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem("role") || "admin"; // e.g., "admin"

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex items-center justify-center px-4 py-4">
        <h1 className="text-xl font-bold text-white">Tourist CMS</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.filter((item) => item.roles.includes(userRole)).map(
          (item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                )}
              >
                <item.icon
                  className={cn(
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white",
                    "mr-3 h-6 w-6"
                  )}
                />
                {item.name}
              </Link>
            );
          }
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
