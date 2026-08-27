"use server";

import { ActionResponse } from "@/types";
import { forgotPasswordSchema, ForgotPasswordValues } from "../schemas/auth.schema";
import { env } from "@/env";

export async function forgotPasswordAction(values: ForgotPasswordValues): Promise<ActionResponse> {
  try {
    const validatedFields = forgotPasswordSchema.safeParse(values);
    
    if (!validatedFields.success) {
      return { success: false, message: "Invalid email provided" };
    }

    const { email } = validatedFields.data;
    const apiUrl = env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || "Failed to process request" 
      };
    }

    return { success: true };

  } catch (error) {
    console.error("Forgot Password Action Error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
