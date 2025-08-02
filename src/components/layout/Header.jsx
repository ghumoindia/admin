import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Bell } from "lucide-react";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { logout, logoutAdmin } from "../../hooks/slice/authSlice";

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
    case "/activity":
      return "Activity Management";
    case "/hotels":
      return "Hotels Management";
    default:
      return "Tourist CMS";
  }
};

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const pageTitle = getPageTitle(location.pathname);
  const user = useSelector((state) => state?.auth?.login?.data);
  const adminDetails = localStorage.getItem("adminData");
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const adminData = JSON.parse(adminDetails);

  const handleUnderConstruction = (feature) => {
    toast(`${feature} is under construction 🚧`);
  };

  const handleLogout = async () => {
    const adminId = adminData?.id;
    console.log(adminData?.id, "adminId in Header");
    if (!adminId) {
      toast.error("Admin ID not found for logout.");
      return;
    }

    const result = await dispatch(logoutAdmin(adminId));

    const response = result?.payload;

    if (response?.success) {
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    } else {
      toast.error(response?.error || "Logout failed. Please try again.");
    }

    setLogoutDialogOpen(false);
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profileImage}
                    alt={adminData?.firstName}
                  />
                  <AvatarFallback>
                    {adminData?.firstName
                      ? adminData?.firstName.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium truncate">
                    {adminData?.firstName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {adminData?.email}
                  </p>
                </div>

                <DropdownMenuItem
                // onClick={() => handleUnderConstruction("Profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUnderConstruction("Settings")}
                >
                  Settings
                </DropdownMenuItem>

                {/* Logout AlertDialog */}
                <AlertDialog
                  open={logoutDialogOpen}
                  onOpenChange={setLogoutDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to logout?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You will be logged out of your admin account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
