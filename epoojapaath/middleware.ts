import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Blocked users
  if (user?.isBlocked) {
    return NextResponse.redirect(new URL("/login?reason=blocked", req.url));
  }

  // Admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!user || user.role !== "admin") {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Temple panel
  if (pathname.startsWith("/temple")) {
    if (!user || (user.role !== "temple_owner" && user.role !== "admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // User dashboard
  if (pathname.startsWith("/user")) {
    if (!user) return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/temple/:path*", "/user/:path*", "/api/admin/:path*"],
};
