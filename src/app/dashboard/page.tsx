"use client";

import { useAuthStore } from "@/store/auth.store";
import { logoutAction } from "@/features/auth/api/logout.action";
import { Button } from "@/components/ui/button";

export default function DashboardPage()
{
    const user = useAuthStore((state) => state.user);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <div className="bg-zinc-100 p-4 rounded-lg">
                {user ? (
                    <div>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role?.name}</p>
                        
                        <Button className="mt-4" onClick={() => logoutAction()}>Log Out</Button>
                    </div>
                ) : (
                    <div>
                        <p className="text-red-600 mb-4">You are not authenticated or your session expired.</p>
                        <Button variant="destructive" onClick={() => logoutAction()}>Clear Cookies & Log In</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
