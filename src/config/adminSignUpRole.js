import { Shield, MapPin, Users, Hotel, FileText } from "lucide-react";
const adminSignUpRole = [
  {
    value: "super_admin",
    label: "Super Admin",
    icon: Shield,
    color: "bg-red-500",
    description: "Full system access & user management",
    requiresApproval: true,
  },
  {
    value: "admin",
    label: "Admin",
    icon: Users,
    color: "bg-blue-500",
    description: "General administration & oversight",
    requiresApproval: true,
  },
  {
    value: "content_manager",
    label: "Content Manager",
    icon: FileText,
    color: "bg-green-500",
    description: "Content, media & website management",
    requiresApproval: false,
  },
  {
    value: "hotel_manager",
    label: "Hotel Manager",
    icon: Hotel,
    color: "bg-purple-500",
    description: "Hotel & accommodation management",
    requiresApproval: false,
  },
  {
    value: "tour_manager",
    label: "Tour Manager",
    icon: MapPin,
    color: "bg-orange-500",
    description: "Tour packages & bookings management",
    requiresApproval: false,
  },
];

export default adminSignUpRole;
