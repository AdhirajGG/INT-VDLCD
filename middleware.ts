// // middleware.ts
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// // Public routes (anyone can hit these)
// const isPublicRoute = createRouteMatcher([
//   "/",              // home
//   "/dashboard(.*)",  // dashboard routes
//   "/sign-in(.*)",   // sign-in
//   "/sign-up(.*)",   // sign-up
//   "/products(.*)",  // product routes
//   "/videos(.*)",    // video routes
//   "/api(.*)",       // all API routes
//   // Only protect blog routes
// ]);

// // // Any routes you explicitly want Clerk to ignore entirely
// // const ignoredRoutes = [
// //   "/api/webhook",   // your stripe webhook endpoint
// // ];

// export default clerkMiddleware(async (auth, req) => {
//   const pathname = req.nextUrl.pathname;
//   // If this is an ignored route, do nothing at all
//   // if (ignoredRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
//   //   return;
//   // }
//  // Bypass authentication for public routes
//   if (isPublicRoute(req)) {
//     return;
//   }
//   // Otherwise, if it’s not in your public list, enforce authentication
//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   // Apply to every non‑static, non‑_next path, plus all /api and /trpc calls
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',        // your API endpoints
//   ],
// };

// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (anyone can access these without authentication)
const isPublicRoute = createRouteMatcher([
  "/",                    // home page
  "/dashboard(.*)",       // dashboard and all dashboard routes
  "/sign-in(.*)",         // sign-in pages
  "/sign-up(.*)",         // sign-up pages
  "/products(.*)",        // all product routes
  "/videos(.*)",          // all video routes
  "/api/blog(.*)",        // blog API routes (for fetching posts)
  "/api/contact(.*)",     // contact API
  "/api/categories(.*)",  // categories API
  "/api/machines(.*)",    // machines API
  "/api/users/active",    // active users count
  "/api/slides(.*)",
  "/api/testimonials(.*)",
  "/contact(.*)"
]);

// Protected routes (require authentication)
const isProtectedRoute = createRouteMatcher([
  "/blog(.*)",            // all blog routes require authentication
  "/blog-management(.*)", // blog management requires authentication
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  // If it's a protected route, enforce authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
    return;
  }
  
  // If it's a public route, allow access without authentication
  if (isPublicRoute(req)) {
    return;
  }
  
  // For any other routes not explicitly defined, protect them
  await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};