"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, ArrowLeft, MountainSnow, MailCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, ForgotPasswordValues } from "../schemas/auth.schema";
import { forgotPasswordAction } from "../api/forgot-password.action";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setIsLoading(true);
    
    try {
      const response = await forgotPasswordAction(values);
      
      if (response.success) {
        setSubmittedEmail(values.email);
        setIsSuccess(true);
      } else {
        toast.error(response.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md shadow-lg border-zinc-200 py-10">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <MailCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Check your email
            </CardTitle>
            <CardDescription className="text-zinc-500 text-base">
              We sent a password reset link to <span className="font-medium text-zinc-900">{submittedEmail}</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Button asChild className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary-hover">
            <Link href="/login">
              Back to log in
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-zinc-200 py-10">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 text-white">
          <MountainSnow className="h-6 w-6" /> {/* Logo placeholder */}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Enter your email to receive a password reset link
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button
              type="submit"
              className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary-hover"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <Link
          href="/login"
          className="flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to log in
        </Link>
      </CardFooter>
    </Card>
  );
}
