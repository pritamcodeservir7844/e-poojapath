import { SessionProvider } from "next-auth/react";
import Link from "next/link";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard",     icon: "📊" },
  { href: "/admin/temples",   label: "Temples",        icon: "🛕" },
  { href: "/admin/users",     label: "Users",          icon: "👥" },
  { href: "/admin/bookings",  label: "Bookings",       icon: "📋" },
  { href: "/admin/blog",      label: "Blog Manager",   icon: "📝" },
  { href: "/admin/ads",       label: "Ads Manager",    icon: "📢" },
  { href: "/admin/settings",  label: "Settings",       icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-[#0F0A05]">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1A1208] border-r border-saffron/10 flex flex-col">
          <div className="p-6 border-b border-saffron/10">
            <span className="font-heading text-xl text-saffron">ePoojapaath</span>
            <p className="text-cream/30 text-xs mt-1">Admin Panel</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {adminNav.map(({ href, label, icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/60 hover:bg-saffron/10 hover:text-saffron transition-all duration-200 text-sm">
                <span>{icon}</span> {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-saffron/10 text-xs text-cream/20 text-center">
            © 2025 ePoojapaath
          </div>
        </aside>
        {/* Main */}
        <main className="flex-1 bg-[#F9F5EE] overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
