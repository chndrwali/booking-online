import { ClipboardList, LayoutDashboard, Store } from "lucide-react";

export type SearchItem = {
  title: string;
  url: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string[];
};

export const searchItems: SearchItem[] = [
  // Pages
  {
    title: "Dashboard",
    url: "/seller",
    group: "Pages",
    icon: LayoutDashboard,
    shortcut: ["d", "d"],
  },
  {
    title: "Layanan",
    url: "/seller/services",
    group: "Pages",
    icon: Store,
    shortcut: ["d", "d"],
  },
  {
    title: "Booking",
    url: "/seller/bookings",
    group: "Pages",
    icon: ClipboardList,
    shortcut: ["d", "d"],
  },
];
