import { SessionProvider } from "next-auth/react";
import Link from "next/link";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard",   icon: "📊" },
  { href: "/admin/temples",   label: "Temples",      icon: "🛕" },
  { href: "/admin/users",     label: "Users",        icon: "👥" },
  { href: "/admin/bookings",  label: "Bookings",     icon: "📋" },
  { href: "/admin/blog",      label: "Blog Manager", icon: "📝" },
  { href: "/admin/ads",       label: "Ads Manager",  icon: "📢" },
  { href: "/admin/settings",  label: "Settings",     icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <aside className="w-64 bg-card-bg border-r border-border flex flex-col">
          <div className="p-6 border-b border-border">
            <span className="font-heading text-xl text-saffron">ePoojapaath</span>
            <p className="text-muted-foreground text-xs mt-1">Admin Panel</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {adminNav.map(({ href, label, icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-saffron/10 hover:text-saffron transition-all duration-200 text-sm">
                <span>{icon}</span> {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border text-xs text-muted-foreground/50 text-center">
            © 2025 ePoojapaath
          </div>
        </aside>
        {/* Main */}
        <main className="flex-1 bg-background overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
