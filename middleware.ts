// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isPublicRoute = createRouteMatcher([
//   '/',
//   '/sign-in(.*)',
//   '/sign-up(.*)',
//   '/api/webhook/stripe',
// ]);
// // If you want to declare an array of ignored routes, do it like this:
// const ignoredRoutes = ['/api/webhook/stripe'];
// export default clerkMiddleware(async (auth, req) => {
//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
//   // Do NOT check for admin here unless your whole app is admin-only!
// });

// export const config = {
//   matcher: [
    // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // '/(api|trpc)(.*)',
//   ],
// };


// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (anyone can hit these)
const isPublicRoute = createRouteMatcher([
  "/",              // home
  "/sign-in(.*)",   // sign-in (and any nested paths)
  "/sign-up(.*)",   // sign-up
  "/cart(.*)",     // cart
]);

// Any routes you explicitly want Clerk to ignore entirely
const ignoredRoutes = [
  "/api/webhook",   // your stripe webhook endpoint
];

export default clerkMiddleware(async (auth, req) => {
  // If this is an ignored route, do nothing at all
  if (ignoredRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return;
  }

  // Otherwise, if it’s not in your public list, enforce authentication
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Apply to every non‑static, non‑_next path, plus all /api and /trpc calls
  matcher: [
       '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',        // your API endpoints
  ],
};
