import {
  LayoutDashboard,
  MapPin,
  Building2,
  Camera,
  Utensils,
  SquareActivity,
  HotelIcon,
  Building2Icon,
  MapPlusIcon,
  Calendar,
  VideoIcon,
  Cone,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["admin", "editor", "viewer"],
  },
  {
    name: "States",
    href: "/states",
    icon: MapPin,
    roles: ["admin", "editor"],
  },
  {
    name: "Cities",
    href: "/cities",
    icon: Building2,
    roles: ["admin", "editor"],
  },
  {
    name: "Places",
    href: "/places",
    icon: Camera,
    roles: ["admin"],
  },
  {
    name: "Foods",
    href: "/foods",
    icon: Utensils,
    roles: ["admin", "editor"],
  },
  {
    name: "Activity",
    href: "/activity",
    icon: SquareActivity,
    roles: ["admin", "editor"],
  },
  {
    name: "Hotels",
    href: "/hotels",
    icon: HotelIcon,
    roles: ["admin", "editor"],
  },
  {
    name: "Destination",
    href: "/destination",
    icon: MapPlusIcon,
    roles: ["admin", "editor"],
  },
  {
    name: "Calender",
    href: "/calender",
    icon: Calendar,
    roles: ["admin", "editor"],
  },
  {
    name: "Experience",
    href: "/experience",
    icon: Building2Icon,
    roles: ["admin", "editor"],
  },
  {
    name: "Video",
    href: "/video",
    icon: VideoIcon,
    roles: ["admin", "editor"],
  },
  {
    name: "Wonders",
    href: "/wonders",
    icon: Cone,
    roles: ["admin", "editor"],
  },
];
