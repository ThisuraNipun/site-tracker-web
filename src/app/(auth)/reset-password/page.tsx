import { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Reset Password | Site Tracker",
  description: "Enter your new password",
};

export default function ResetPasswordPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
