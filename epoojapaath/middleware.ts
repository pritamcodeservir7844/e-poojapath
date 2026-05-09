import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.avatar = (user as { avatar?: string }).avatar;
        token.isBlocked = (user as { isBlocked?: boolean }).isBlocked;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
        session.user.isBlocked = token.isBlocked as boolean;
      }
      return session;
    },
  },
  providers: [],
};

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
