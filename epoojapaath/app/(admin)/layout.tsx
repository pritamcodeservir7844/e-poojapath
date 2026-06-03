import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Landmark, Users, BookOpen,
  FileText, Megaphone, Settings, Flower2, ScrollText, ClipboardList, Mail,
} from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const adminNav = [
  { href: "/admin/dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { href: "/admin/temples",         label: "Temples",          icon: Landmark        },
  { href: "/admin/temple-requests", label: "Temple Requests",  icon: ClipboardList   },
  { href: "/admin/pujas",           label: "Puja Manager",     icon: ScrollText      },
  { href: "/admin/chadawa",         label: "Chadawa Manager",  icon: Flower2         },
  { href: "/admin/users",           label: "Users",            icon: Users           },
  { href: "/admin/bookings",        label: "Bookings",         icon: BookOpen        },
  { href: "/admin/blog",            label: "Blog Manager",     icon: FileText        },
  { href: "/admin/ads",             label: "Ads Manager",      icon: Megaphone       },
  { href: "/admin/enquiries",       label: "Enquiries",        icon: Mail            },
  { href: "/admin/settings",        label: "Settings",         icon: Settings        },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <aside className="w-64 bg-card-bg border-r border-border flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/epoojalogo.png" alt="ePoojapaath" width={36} height={36} className="object-contain h-9 w-auto" />
              <span className="font-heading text-lg text-saffron leading-none">ePoojapaath</span>
            </Link>
            <p className="text-muted-foreground text-xs mt-2 pl-0.5">Admin Panel</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {adminNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-saffron/10 hover:text-saffron transition-all duration-200 text-sm"
              >
                <Icon size={17} strokeWidth={1.75} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border space-y-3">
            <AdminLogoutButton />
            <p className="text-xs text-muted-foreground/40 text-center">© 2025 ePoojapaath</p>
          </div>
        </aside>
        {/* Main */}
        <main className="flex-1 bg-background overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
