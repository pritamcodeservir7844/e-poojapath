import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Landmark, ScrollText,
  Flower2, BookOpen, FileText, Users, Settings,
} from "lucide-react";
import { TempleLogoutButton } from "@/components/temple/TempleLogoutButton";

const templeNav = [
  { href: "/temple/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/temple/register",  label: "My Temples", icon: Landmark        },
  { href: "/temple/pujas",     label: "Pujas",      icon: ScrollText      },
  { href: "/temple/chadawa",   label: "Chadawa",    icon: Flower2         },
  { href: "/temple/bookings",  label: "Bookings",   icon: BookOpen        },
  { href: "/temple/blog",      label: "Blog",       icon: FileText        },
  { href: "/temple/members",   label: "Members",    icon: Users           },
  { href: "/temple/settings",  label: "Settings",   icon: Settings        },
];

export default function TempleLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-background">
        <aside className="w-64 bg-card-bg border-r border-border flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/epoojalogo.png" alt="ePoojapaath" width={36} height={36} className="object-contain h-9 w-auto" />
              <span className="font-heading text-lg text-saffron leading-none">ePoojapaath</span>
            </Link>
            <p className="text-muted-foreground text-xs mt-2 pl-0.5">Temple Panel</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {templeNav.map(({ href, label, icon: Icon }) => (
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
            <TempleLogoutButton />
            <p className="text-xs text-muted-foreground/40 text-center">© 2025 ePoojapaath</p>
          </div>
        </aside>
        <main className="flex-1 bg-background overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
