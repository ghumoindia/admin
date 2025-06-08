import React from "react";

import {
  LayoutDashboard,
  MapPin,
  Building2,
  Camera,
  Utensils,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Link, useLocation } from "react-router";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "States", href: "/states", icon: MapPin },
  { name: "Cities", href: "/cities", icon: Building2 },
  { name: "Places", href: "/places", icon: Camera },
  { name: "Foods", href: "/foods", icon: Utensils },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex flex-shrink-0 items-center px-4 py-4">
        <h1 className="text-xl font-bold text-white">Tourist CMS</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
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
                  "mr-3 h-6 w-6 flex-shrink-0"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
