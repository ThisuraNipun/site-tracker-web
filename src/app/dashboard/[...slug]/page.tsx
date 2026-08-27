import { notFound } from "next/navigation";

/**
 * Catch-all route for unimplemented dashboard pages.
 * Calling notFound() triggers the nearest not-found.tsx (src/app/dashboard/not-found.tsx),
 * which renders inside the dashboard layout — preserving the Sidebar and Header.
 */
export default function DashboardCatchAll() {
  notFound();
}
