import { authMiddleware } from "@clerk/nextjs";
import { env } from "@/lib/env";

export default authMiddleware({
  // Use environment keys from our env module
  publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: env.CLERK_SECRET_KEY,
  // Public routes that don't require authentication
  publicRoutes: ["/", "/about", "/api/courses", "/api/courses/(.*)", "/api/test", "/api/test-db", "/api/db-test", "/api/init", "/test-public", "/test-courses", "/api/test-env"],
  
  // Routes that can be accessed while signed out
  ignoredRoutes: [
    "/api/webhook(.*)",
    "/api/dev-webhook(.*)",
    "/api/test-env",
    "/init",
    "/test-public",
    "/test-courses",
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|init|test-public|test-courses).*)', '/', '/(api|trpc)(.*)'],
}; 