import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Login - Site Tracker",
  description: "Log in to manage your projects",
};

export default function LoginPage()
{
  return (
    <div className="flex w-full items-center justify-center">
      <LoginForm />
    </div>
  );
}
