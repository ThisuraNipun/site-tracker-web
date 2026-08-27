import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

const protectedRoutes = ["/dashboard", "/users"]
const authRoutes = ["/login", "/register", "/forgot-password"]

export function proxy(request: NextRequest)
{
    const token = request.cookies.get('accessToken')?.value;
    const path = request.nextUrl.pathname;

    const isProtectedRoutes = protectedRoutes.some(route => path.startsWith(route));
    const isAuthRoutes = authRoutes.includes(path);

    if (isProtectedRoutes && !token)
    {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (isAuthRoutes && token)
    {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};