"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/env";

export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const apiUrl = env.NEXT_PUBLIC_API_URL;

  // Notify backend to invalidate refresh token if it exists
  if (refreshToken) {
    try {
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  }

  // Clear Next.js cookies regardless of backend response
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  // Redirect user back to login
  redirect("/login");
}
