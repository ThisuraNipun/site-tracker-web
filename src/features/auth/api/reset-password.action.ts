"use server";

import { ActionResponse } from "@/types";
import { resetPasswordSchema, ResetPasswordValues } from "../schemas/auth.schema";
import { env } from "@/env";

export async function resetPasswordAction(token: string, values: ResetPasswordValues): Promise<ActionResponse> {
  try {
    const validatedFields = resetPasswordSchema.safeParse(values);
    
    if (!validatedFields.success) {
      return { success: false, message: "Invalid fields provided" };
    }

    const { newPassword } = validatedFields.data;
    const apiUrl = env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || "Failed to reset password" 
      };
    }

    return { success: true, message: data.message || "Password reset successfully!" };

  } catch (error) {
    console.error("Reset Password Action Error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
