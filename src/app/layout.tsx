import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { getMeAction } from "@/features/auth/api/get-me.action";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Site Tracker",
  description: "Labor and Attendance Management System",
};

export default async function RootLayout({ children }: { children: React.ReactNode })
{
  const user = await getMeAction();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider user={user}>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
