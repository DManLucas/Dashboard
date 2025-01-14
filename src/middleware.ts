import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Matchers for public and protected routes
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isAdminProtectedRoute = createRouteMatcher(["/admin(.*)"]);
const publicRoutes = [
  "/site",
  "/api/uploadthing",
  "/agency/auth/sign-in",
  "/agency/auth/sign-up",
];

// Middleware
export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const signInUrl =
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/agency/sign-in";
  const fallbackRedirectUrl =
    process.env.NEXT_PUBLIC_CLERK_FALLBACK_REDIRECT_URL || "/site";

  try {
    console.log("Requested Path:", pathname);
    const { sessionClaims } = auth; // Extract session claims
    const userId = sessionClaims?.sub;

    console.log("User ID:", userId);

    // Check for public routes
    if (
      isPublicRoute(request) ||
      publicRoutes.some((route) => pathname.startsWith(route))
    ) {
      return;
    }

    // Handle redirection for /agency
    if (pathname === "/agency" && !userId) {
      // Redirect to sign-in if user is not logged in
      console.log("User not logged in. Redirecting to", signInUrl);
      const redirectUrl = new URL(signInUrl, request.url);
      return NextResponse.redirect(redirectUrl, 302);
    }

    // Protect route if not public
    await auth.protect();

    // Admin route check (unchanged)
    if (isAdminProtectedRoute(request)) {
      if (!userId) {
        // If user is not logged in, redirect to the fallback redirect URL
        console.log("User not logged in. Redirecting to", fallbackRedirectUrl);
        const redirectUrl = new URL(fallbackRedirectUrl, request.url);
        return NextResponse.redirect(redirectUrl, 302);
      }

      const roles = sessionClaims?.roles || [];
      if (!roles.includes("admin")) {
        console.log("Access denied: Insufficient admin permissions.");
        throw new Error("Forbidden access");
      }

      console.log("Access granted to admin route:", pathname);
    }
  } catch (error) {
    console.error(
      "Middleware Error:",
      error instanceof Error ? error.message : error
    );
  }
});

// Configuration
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
