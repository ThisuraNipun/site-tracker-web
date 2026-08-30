"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

/**
 * QueryClient is instantiated inside useState to ensure a NEW instance is
 * created per request/user. This is critical for SSR correctness:
 * a module-level singleton would be shared across all users on the server,
 * causing data leakage between requests.
 *
 * See: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 1 minute — no background refetch during this window.
        staleTime: 60 * 1000,
        // Unused cache entries are garbage collected after 5 minutes.
        gcTime: 5 * 60 * 1000,
        // Retry once before surfacing an error to the UI.
        retry: 1,
        // Do not refetch on tab/window focus — reduces noise on dashboards.
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Mutations also retry once by default.
        retry: 0,
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  /**
   * Use useState (not a module-level variable) so each component tree
   * (each SSR render) gets its own QueryClient instance.
   */
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools only included in development builds */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
