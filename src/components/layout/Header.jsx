import React from "react";
import { useLocation } from "react-router";
import { Bell, User } from "lucide-react";
import { Button } from "../components/ui/button";

const getPageTitle = (pathname) => {
  switch (pathname) {
    case "/":
      return "Dashboard";
    case "/states":
      return "States Management";
    case "/cities":
      return "Cities Management";
    case "/places":
      return "Places Management";
    case "/foods":
      return "Foods Management";
    default:
      return "Tourist CMS";
  }
};

export default function Header() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
