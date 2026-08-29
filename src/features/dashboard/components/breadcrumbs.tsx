"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

// Maps known URL segments to human-readable labels.
// Add entries here as new routes are built.
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  attendance: "Attendance",
  sites: "Sites",
  users: "Users",
  settings: "Settings",
  edit: "Edit",
  create: "Create",
  new: "New",
};

/** Detects if a segment is a UUID or a numeric ID (e.g. "123", "a1b2-c3d4-...") */
function isIdSegment(segment: string): boolean {
  // Numeric IDs
  if (/^\d+$/.test(segment)) return true;
  // UUIDs (e.g. a1b2c3d4-e5f6-...)
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment))
    return true;
  return false;
}

/** Converts a URL segment to a human-readable label */
function segmentToLabel(segment: string): string {
  // Check known labels first
  if (SEGMENT_LABELS[segment.toLowerCase()]) {
    return SEGMENT_LABELS[segment.toLowerCase()];
  }
  // Graceful fallback for numeric IDs / UUIDs
  if (isIdSegment(segment)) {
    return "Details";
  }
  // Generic: capitalize and replace hyphens with spaces
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname();

  // Split path and remove empty strings
  const segments = pathname.split("/").filter(Boolean);

  // Build cumulative hrefs: ["dashboard", "dashboard/users", ...]
  const crumbs = segments.map((segment, index) => ({
    label: segmentToLabel(segment),
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isLast ? (
                // Current page — plain text, not a link
                <BreadcrumbPage className="font-medium text-foreground">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.isLast && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
