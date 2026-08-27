"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, RotateCcw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-6">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-8">
        The page you&apos;re looking for doesn&apos;t exist yet or has been
        moved. Try going back to the dashboard.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button asChild className="gap-2">
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => router.refresh()}
        >
          <RotateCcw className="h-4 w-4" />
          Reload
        </Button>
      </div>
    </div>
  );
}
