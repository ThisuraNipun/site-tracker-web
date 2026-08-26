"use client";

import { useRef, useEffect } from "react";
import { User } from "@/types";
import { useAuthStore } from "@/store/auth.store";

interface AuthProviderProps
{
  user: User | null;
  children: React.ReactNode;
}

export function AuthProvider({ user, children }: AuthProviderProps)
{
  // Use a ref to ensure we only hydrate the store once on the initial render
  const initialized = useRef(false);

  // Hydrate the store immediately during SSR/initial render to prevent layout shifts
  if (!initialized.current)
  {
    useAuthStore.setState({ user });
    initialized.current = true;
  }

  // Ensure store stays in sync if Next.js performs soft navigation
  // and the layout receives a new user object
  useEffect(() =>
  {
    useAuthStore.setState({ user });
  }, [user]);

  return <>{children}</>;
}
