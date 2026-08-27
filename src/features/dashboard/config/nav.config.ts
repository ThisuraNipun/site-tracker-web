import {
  LayoutDashboard,
  FolderKanban,
  CalendarCheck,
  MapPin,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  permission?: string | null;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
    permission: null,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
    permission: null,
  },
  {
    label: "Attendance",
    href: "/dashboard/attendance",
    icon: CalendarCheck,
    permission: null,
  },
  {
    label: "Sites",
    href: "/dashboard/sites",
    icon: MapPin,
    permission: null,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    permission: "users:view",
  },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    permission: null,
  },
];
