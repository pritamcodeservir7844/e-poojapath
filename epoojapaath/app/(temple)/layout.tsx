import { SessionProvider } from "next-auth/react";
import Link from "next/link";

const templeNav = [
  { href: "/temple/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/temple/register",  label: "My Temples", icon: "🛕" },
  { href: "/temple/pujas",     label: "Pujas",      icon: "📿" },
  { href: "/temple/chadawa",   label: "Chadawa",    icon: "🌸" },
  { href: "/temple/bookings",  label: "Bookings",   icon: "📋" },
  { href: "/temple/blog",      label: "Blog",       icon: "📝" },
  { href: "/temple/members",   label: "Members",    icon: "👥" },
  { href: "/temple/settings",  label: "Settings",   icon: "⚙️" },
];

export default function TempleLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-dark border-r border-saffron/10 flex flex-col">
          <div className="p-6 border-b border-saffron/10">
            <span className="font-heading text-xl text-saffron">ePoojapaath</span>
            <p className="text-cream/30 text-xs mt-1">Temple Panel</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {templeNav.map(({ href, label, icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/60 hover:bg-saffron/10 hover:text-saffron transition-all duration-200 text-sm">
                <span>{icon}</span> {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 bg-cream overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
