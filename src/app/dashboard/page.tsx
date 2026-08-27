"use client";

import { useAuthStore } from "@/store/auth.store";
import {
  LayoutDashboard,
  CalendarCheck,
  FolderKanban,
  Users,
  MapPin,
} from "lucide-react";

const stats = [
  { label: "Total Projects", value: "—", icon: FolderKanban, color: "bg-blue-50 text-blue-600" },
  { label: "Attendance Today", value: "—", icon: CalendarCheck, color: "bg-green-50 text-green-600" },
  { label: "Active Sites", value: "—", icon: MapPin, color: "bg-amber-50 text-amber-600" },
  { label: "Total Users", value: "—", icon: Users, color: "bg-purple-50 text-purple-600" },
];

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-border bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Welcome back, {user?.name?.split(" ")[0] ?? "there"} 👋
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.role?.name} &middot; Here&apos;s what&apos;s happening today.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-white p-5 flex items-center gap-4"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder content area */}
      <div className="rounded-xl border border-border border-dashed bg-white p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Dashboard content modules will appear here.
        </p>
      </div>
    </div>
  );
}
