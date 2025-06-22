import { Shield, MapPin, Users, Hotel, FileText } from "lucide-react";

const adminRoles = [
  {
    value: "super_admin",
    label: "Super Admin",
    icon: Shield,
    color: "bg-red-500",
    description: "Full system access",
  },
  {
    value: "admin",
    label: "Admin",
    icon: Users,
    color: "bg-blue-500",
    description: "General administration",
  },
  {
    value: "content_manager",
    label: "Content Manager",
    icon: FileText,
    color: "bg-green-500",
    description: "Content & media management",
  },
  {
    value: "hotel_manager",
    label: "Hotel Manager",
    icon: Hotel,
    color: "bg-purple-500",
    description: "Hotel & accommodation management",
  },
  {
    value: "tour_manager",
    label: "Tour Manager",
    icon: MapPin,
    color: "bg-orange-500",
    description: "Tour packages & bookings",
  },
];

export default adminRoles;
