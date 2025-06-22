import {
  LayoutDashboard,
  MapPin,
  Building2,
  Camera,
  Utensils,
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
];
