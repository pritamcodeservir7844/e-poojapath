import { SessionProvider } from "next-auth/react";
import Link from "next/link";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-cream">
        <nav className="bg-white border-b border-deep-gold/20 px-6 py-3 flex items-center gap-6">
          <Link href="/" className="font-heading text-saffron text-lg">ePoojapaath</Link>
          <div className="flex gap-4 ml-auto">
            {[
              { href: "/user/dashboard", label: "Dashboard" },
              { href: "/user/bookings",  label: "My Bookings" },
              { href: "/user/profile",   label: "Profile"     },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm text-dark hover:text-saffron transition-colors">{label}</Link>
            ))}
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </div>
    </SessionProvider>
  );
}
