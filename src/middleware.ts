import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
        throw new Error("Unauthorized access");
      }

      if (!roles.includes("agency")) {
        console.log("Access denied: Insufficient permissions.");
        throw new Error("Forbidden access");
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
