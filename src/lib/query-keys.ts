/**
 * Centralized, type-safe query key factory for TanStack Query.
 *
 * Why a factory?
 * - Prevents typo bugs from raw string arrays scattered across the codebase.
 * - Enables precise cache invalidation:
 *     queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
 *   → invalidates ALL user-related queries (list, detail, etc.)
 *
 * Convention: every entity has an `all` key that is the common prefix for
 * all its sub-keys. TanStack Query matches keys by prefix.
 */
export const queryKeys = {
  users: {
    /** Matches all user queries (list + details) */
    all: ["users"] as const,
    /** Matches paginated/filtered user lists */
    list: (filters?: Record<string, unknown>) =>
      ["users", "list", filters] as const,
    /** Matches a single user by ID */
    detail: (id: number) => ["users", "detail", id] as const,
  },
  projects: {
    all: ["projects"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["projects", "list", filters] as const,
    detail: (id: number) => ["projects", "detail", id] as const,
  },
  attendance: {
    all: ["attendance"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["attendance", "list", filters] as const,
  },
  sites: {
    all: ["sites"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["sites", "list", filters] as const,
    detail: (id: number) => ["sites", "detail", id] as const,
  },
} as const;
