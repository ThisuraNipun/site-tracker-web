"use server";

import { User } from "@/types";
import { fetchWithAuth } from "@/lib/api-client";

export async function getMeAction(): Promise<User | null> {
  try {
    // requireAuth: false prevents throwing a redirect if the user is not logged in.
    // fetchWithAuth will still attempt to refresh the token if one exists and returns 401.
    const response = await fetchWithAuth("/api/auth/me", { requireAuth: false });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    console.log("Raw Backend Response (/api/auth/me):", JSON.stringify(data, null, 2));
    
    // Based on the backend response, the user object is directly in `data.data`
    if (data?.data && typeof data.data === 'object' && 'id' in data.data) {
      return data.data as User;
    }
    
    // Fallbacks just in case
    if (data?.data?.user) {
      return data.data.user as User;
    }

    if (data?.user) {
      return data.user as User;
    }

    return null;
  } catch (error) {
    console.error("Get Me Action Error:", error);
    return null;
  }
}
