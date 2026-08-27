"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { logoutAction } from "@/features/auth/api/logout.action";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, type NavItem } from "../config/nav.config";
import {
  LogOut,
  MountainSnow,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  const linkEl = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150",
        active
          ? "bg-primary/10 text-primary"
          : "text-secondary hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-0 py-2.5 w-full"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-primary" : "text-muted-foreground"
        )}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return linkEl;
}

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const collapsed = !sidebarOpen;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.permission || user?.permissions?.includes(item.permission)
  );

  const visibleBottomItems = BOTTOM_NAV_ITEMS.filter(
    (item) => !item.permission || user?.permissions?.includes(item.permission)
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex flex-col h-full bg-white border-r border-border transition-all duration-300 ease-in-out shrink-0",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* Collapse / Expand Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Brand */}
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-5 border-b border-border",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <MountainSnow className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate leading-tight">
                Site Tracker
              </p>
              <p className="text-xs text-muted-foreground truncate leading-tight">
                Labor Management
              </p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={isActive(item.href, item.exact)}
            />
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-border px-2 py-3 space-y-0.5">
          {visibleBottomItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={isActive(item.href)}
            />
          ))}

          {/* User Info + Logout */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 mt-1",
              collapsed && "justify-center px-0"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              {user ? getInitials(user.name) : "?"}
            </div>
            {!collapsed && user && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate leading-tight">
                  {user.role?.name}
                </p>
              </div>
            )}
            {!collapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => logoutAction()}
                    aria-label="Log out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Log out</TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Collapsed logout button */}
          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => logoutAction()}
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
