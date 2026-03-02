import { NavItem } from "@/types";

export const sellerNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/seller",
    icon: "dashboard",
    isActive: false,
    items: [],
  },
  {
    title: "Layanan",
    url: "/seller/services",
    icon: "store",
    isActive: false,
    items: [],
  },
  {
    title: "Booking",
    url: "/seller/bookings",
    icon: "clipboardList",
    isActive: false,
    items: [],
  },
];
