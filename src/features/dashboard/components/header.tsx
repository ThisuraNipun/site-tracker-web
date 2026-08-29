"use client";

import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { logoutAction } from "@/features/auth/api/logout.action";
import { Breadcrumbs } from "./breadcrumbs";
import { Bell, Menu, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Header() {
  const user = useAuthStore((state) => state.user);
  const { toggleSidebar, sidebarOpen } = useUIStore();

  return (
    <header role="banner" className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-white px-4 sm:px-6">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground md:hidden"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={sidebarOpen}
        aria-controls="sidebar-nav"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      {/* Breadcrumbs */}
      <div className="flex-1 min-w-0">
        <Breadcrumbs />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notifications bell */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-8 px-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              {/* Avatar */}
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {user ? getInitials(user.name) : "?"}
              </div>
              <span className="hidden sm:block max-w-[120px] truncate">
                {user?.name ?? "User"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
                {user?.role && (
                  <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {user.role.name}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              onClick={() => logoutAction()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
