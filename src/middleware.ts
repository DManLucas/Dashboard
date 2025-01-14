import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"; // Import NextResponse for custom redirection

// Matchers for public and protected routes
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isAgencyProtectedRoute = createRouteMatcher(["/agency(.*)"]);
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

  try {
    console.log("Requested Path:", pathname);
    const { sessionClaims } = auth; // Extract session claims
    const userId = sessionClaims?.sub;
    const roles = sessionClaims?.roles || [];

    console.log("User ID:", userId);

    // Check for public routes
    if (
      isPublicRoute(request) ||
      publicRoutes.some((route) => pathname.startsWith(route))
    ) {
      return;
    }

    // Protect route if not public
    await auth.protect();

    // Additional checks for agency and admin routes
    if (isAgencyProtectedRoute(request)) {
      if (!userId) {
        // If user is not logged in, redirect to /agency/sign-up
        console.log("User not logged in. Redirecting to /agency/sign-up.");
        const redirectUrl = new URL("/agency/sign-up", request.url);
        return NextResponse.redirect(redirectUrl, 302); // 302 for redirect
      }

      if (!roles.includes("agency")) {
        // If user doesn't have agency role, redirect to /agency/sign-up
        console.log(
          "Access denied: Insufficient permissions for agency route."
        );
        const redirectUrl = new URL("/agency/sign-up", request.url);
        return NextResponse.redirect(redirectUrl, 302); // 302 for redirect
      }

      console.log("Access granted to agency route:", pathname);
    }

    if (isAdminProtectedRoute(request)) {
      if (!userId) {
        throw new Error("Unauthorized access");
      }

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
    // Skip Next.js internals and static files unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
