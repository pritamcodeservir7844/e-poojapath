import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/shared/Footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="bg-white border-b border-deep-gold/20 px-6 py-3 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition duration-200">
            <Image src="/epoojalogo.png" alt="ePoojapaath" width={56} height={56} className="object-contain h-12 w-auto" priority />
            <span className="font-heading text-xl md:text-2xl text-saffron leading-none">ePoojapaath</span>
          </Link>
          <div className="flex gap-4 ml-auto">
            {[
              { href: "/",               label: "Home"        },
              { href: "/user/dashboard", label: "Dashboard"   },
              { href: "/user/bookings",  label: "My Bookings" },
              { href: "/user/profile",   label: "Profile"     },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm text-foreground hover:text-saffron transition-colors">{label}</Link>
            ))}
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8 flex-grow w-full">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
