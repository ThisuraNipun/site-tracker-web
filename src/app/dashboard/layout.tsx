"use client";

import { Sidebar } from "@/features/dashboard/components/sidebar";
import { Header } from "@/features/dashboard/components/header";
import { useUIStore } from "@/store/ui.store";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

function DashboardShell({ children }: { children: ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      {/* Desktop: inline, shifts content. Mobile: overlay drawer (fixed position). */}
      <div
        className={cn(
          // Mobile: slide-in drawer over content
          "fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto",
          // On mobile, hide sidebar when closed; show when open
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar />
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header />
        <main id="main-content" aria-label="Main content" className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
