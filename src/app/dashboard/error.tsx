"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js route-segment Error Boundary for the /dashboard route.
 * Renders inside the dashboard layout, preserving the Sidebar and Header.
 * The `reset` function retries rendering the failed segment.
 */
export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 mb-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-2">
        An unexpected error occurred while loading this page. You can try again
        or contact support if the problem persists.
      </p>
      {/* Show error digest in development for easier debugging */}
      {error.digest && (
        <p className="text-xs text-muted-foreground/60 font-mono mb-8">
          Error ID: {error.digest}
        </p>
      )}
      {!error.digest && <div className="mb-8" />}

      {/* Action */}
      <Button onClick={reset} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
