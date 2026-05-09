"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Temples", href: "/temples" },
  { label: "Puja", href: "/puja" },
  { label: "Chadawa", href: "/chadawa" },
  { label: "Blog", href: "/blog" },
  { label: "Astro", href: "/astro" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardHref =
    session?.user?.role === "admin" ? "/admin/dashboard" :
      session?.user?.role === "temple_owner" ? "/temple/dashboard" :
        "/user/dashboard";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      (scrolled || mobileOpen) ? "backdrop-blur-md bg-background/95 shadow-sm border-b border-border" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="bg-white dark:bg-white/8 rounded-xl px-2 py-1 shadow-sm shadow-lotus-purple/10 dark:shadow-lotus-purple/5">
            <Image
              src="/epoojalogo.png"
              alt="ePoojapaath"
              width={130}
              height={44}
              className="object-contain h-10 w-auto"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-saffron font-medium transition-colors duration-200 relative group text-sm"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-saffron group-hover:w-full transition-all duration-200" />
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-foreground hover:text-saffron transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-saffron/15 dark:bg-saffron/25 flex items-center justify-center text-saffron font-bold text-sm border border-saffron/30">
                  {session.user?.name?.[0]?.toUpperCase()}
                </div>
                <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-12 w-48 card-devotional rounded-xl shadow-xl py-2"
                  >
                    <Link href={dashboardHref} className="flex items-center gap-2 px-4 py-2 hover:bg-saffron/10 text-foreground transition-colors text-sm">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link href="/user/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-saffron/10 text-foreground transition-colors text-sm">
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-lotus-red transition-colors text-sm"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-outline-gold py-2 px-4 text-sm">Login</Link>
              <Link href="/register" className="btn-saffron py-2 px-4 text-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile — theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground p-1"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background/96 backdrop-blur-md border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {session && (
                <div className="mb-4 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-3 px-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-saffron/15 flex items-center justify-center text-saffron font-bold border border-saffron/30">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground font-semibold truncate">{session.user?.name}</p>
                      <p className="text-muted-foreground text-xs truncate">{session.user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href={dashboardHref}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 text-foreground hover:text-saffron py-2 px-3 rounded-lg hover:bg-saffron/8 transition-colors text-sm"
                    >
                      <LayoutDashboard size={18} className="text-saffron" /> Dashboard
                    </Link>
                    <Link
                      href="/user/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 text-foreground hover:text-saffron py-2 px-3 rounded-lg hover:bg-saffron/8 transition-colors text-sm"
                    >
                      <User size={18} className="text-saffron" /> Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 text-lotus-red py-2 px-3 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-left"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground hover:text-saffron font-medium py-2.5 px-3 rounded-lg hover:bg-saffron/8 border-b border-border/50 last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!session && (
                <div className="flex gap-3 pt-3">
                  <Link href="/login" className="btn-outline-gold text-sm flex-1 text-center">Login</Link>
                  <Link href="/register" className="btn-saffron text-sm flex-1 text-center">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
