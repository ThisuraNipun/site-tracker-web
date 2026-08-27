"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, LoginValues } from "../schemas/auth.schema";
import { ActionResponse } from "@/types";
import { env } from "@/env";

export async function loginAction(values: LoginValues): Promise<ActionResponse> {
  try {
    const validatedFields = loginSchema.safeParse(values);
    
    if (!validatedFields.success) {
      return { success: false, message: "Invalid fields provided" };
    }

    const { email, password } = validatedFields.data;
    const apiUrl = env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || "Invalid email or password" 
      };
    }

    if (data.data?.tokens?.accessToken && data.data?.tokens?.refreshToken) {
      const cookieStore = await cookies();
      
      cookieStore.set("accessToken", data.data.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15, // 15 minutes
      });

      cookieStore.set("refreshToken", data.data.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return { success: true };
    }

    return { success: false, message: "Invalid response format from server" };

  } catch (error) {
    console.error("Login Action Error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
