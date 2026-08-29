"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, MountainSnow, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import
{
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import
{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginValues } from "../schemas/auth.schema";
import { loginAction } from "../api/login.action";

export function LoginForm()
{
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Show a one-time warning toast when the user was auto-logged out due to session expiry
  useEffect(() => {
    if (searchParams.get("reason") === "session_expired") {
      toast.warning("Your session has expired. Please log in again.", {
        id: "session-expired", // Prevents duplicate toasts (e.g. React Strict Mode)
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues)
  {
    setIsLoading(true);
    
    try {
      const response = await loginAction(values);
      
      if (response.success) {
        toast.success("Successfully logged in!");
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Failed to log in");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-zinc-200 py-10">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 text-white">
          <MountainSnow className="h-6 w-6" /> {/* Logo placeholder */}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Site Tracker
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Log in to manage your projects
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                      <Input
                        placeholder="name@example.com"
                        className="h-11 pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline hover:text-primary-hover"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 h-4 w-4 text-zinc-500 hover:text-zinc-900 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary-hover"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Log In
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-sm text-zinc-500">Powered by Nipun</p>
      </CardFooter>
    </Card>
  );
}
