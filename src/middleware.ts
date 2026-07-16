import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  // In edge context, role is on the JWT token root (set by jwt callback in auth.ts)
  const userRole = (req.auth as any)?.role || req.auth?.user?.role;

  const isOnAuth = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isOnAdmin = pathname.startsWith("/admin");
  const isOnProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/contests");

  // Redirect unauthenticated users from protected routes to login
  if (isOnProtected && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect unauthenticated users from admin routes to login
  if (isOnAdmin && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect non-admin users from admin routes to dashboard
  if (isOnAdmin && isLoggedIn && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Redirect authenticated users from auth pages to dashboard
  if (isOnAuth && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
