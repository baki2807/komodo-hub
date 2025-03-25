import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/", "/about", "/api/courses", "/api/courses/(.*)", "/api/test", "/api/test-db", "/api/db-test", "/api/init", "/test-public", "/test-courses"],
  
  // Routes that can be accessed while signed out
  ignoredRoutes: [
    "/api/webhook(.*)",
    "/init",
    "/test-public",
    "/test-courses",
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|init|test-public|test-courses).*)', '/', '/(api|trpc)(.*)'],
}; 