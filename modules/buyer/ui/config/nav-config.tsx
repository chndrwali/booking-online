import { NavItem } from "@/types";

export const buyerNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/buyer",
    icon: "dashboard",
    isActive: false,
    items: [],
  },
  {
    title: "Riwayat Booking",
    url: "/buyer/bookings",
    icon: "clipboardList",
    isActive: false,
    items: [],
  },
  {
    title: "Profil Saya",
    url: "/buyer/profile",
    icon: "user",
    isActive: false,
    items: [],
  },
];
