import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface FetchOptions extends RequestInit
{
  requireAuth?: boolean;
}

/**
 * A wrapper around the native `fetch` API that automatically injects the access token
 * from Next.js httpOnly cookies into the Authorization header.
 * 
 * If a request returns a 401 Unauthorized, it intercepts the response, attempts to
 * get a new access token using the refresh token, updates the cookies, and retries
 * the original request seamlessly.
 */
export async function fetchWithAuth(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response>
{
  const { requireAuth = true, ...customOptions } = options;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  // Support both absolute URLs and relative endpoints
  const url = endpoint.startsWith("http") ? endpoint : `${apiUrl}${endpoint}`;

  const headers = new Headers(customOptions.headers);

  if (accessToken)
  {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Default to JSON if not specified and not sending FormData
  if (!headers.has("Content-Type") && !(customOptions.body instanceof FormData))
  {
    headers.set("Content-Type", "application/json");
  }

  let response = await fetch(url, {
    ...customOptions,
    headers,
  });

  // If unauthorized, attempt refresh flow
  if (response.status === 401)
  {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken)
    {
      try
      {
        const refreshResponse = await fetch(`${apiUrl}/api/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok)
        {
          const data = await refreshResponse.json();
          // Extract new tokens based on backend response format
          const newAccessToken = data.data?.tokens?.accessToken;
          const newRefreshToken = data.data?.tokens?.refreshToken;

          if (newAccessToken && newRefreshToken)
          {
            // Update cookies inside a try-catch to avoid Server Component render errors
            try
            {
              cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 15, // 15 minutes
              });

              cookieStore.set("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
              });
            } catch (cookieError)
            {
              console.warn("Read-only context: Cannot set new cookies during render phase.");
            }

            // Retry original request with new access token
            headers.set("Authorization", `Bearer ${newAccessToken}`);
            response = await fetch(url, {
              ...customOptions,
              headers,
            });

            return response;
          }
        }
      } catch (error)
      {
        console.error("Failed to refresh token", error);
      }
    }

    // If refresh failed or no refresh token is available, clear cookies
    try
    {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
    } catch (cookieError)
    {
      console.warn("Read-only context: Cannot delete cookies during render phase.");
    }

    if (requireAuth)
    {
      redirect("/login");
    }
  }

  return response;
}