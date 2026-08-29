import { useAuthStore } from "@/store/auth.store";

/**
 * Returns true if the currently logged-in user has the given permission.
 *
 * Usage:
 *   const canViewUsers = useHasPermission("users:view");
 *
 * NOTE: Do NOT call this hook inside a .map() or .filter() loop.
 * React Rules of Hooks require hooks to be called at the top level of a component.
 * For filtering arrays (e.g. NAV_ITEMS), use direct checks:
 *   navItems.filter(item => !item.permission || user?.permissions?.includes(item.permission))
 */
export function useHasPermission(permission: string): boolean {
  const user = useAuthStore((state) => state.user);

  if (!user || !user.permissions) return false;

  return user.permissions.includes(permission);
}
