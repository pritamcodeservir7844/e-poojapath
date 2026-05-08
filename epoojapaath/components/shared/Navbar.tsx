"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { label: "Home",    href: "/" },
  { label: "Temples", href: "/temples" },
  { label: "Puja",    href: "/puja" },
  { label: "Chadawa", href: "/chadawa" },
  { label: "Blog",    href: "/blog" },
  { label: "Astro",   href: "/astro" },
];

export function Navbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardHref =
    session?.user?.role === "admin"        ? "/admin/dashboard" :
    session?.user?.role === "temple_owner" ? "/temple/dashboard" :
    "/user/dashboard";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "backdrop-blur-md bg-cream/90 shadow-md border-b border-deep-gold/30" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="ePoojapaath" width={40} height={40} className="rounded-full" />
          <span className="font-heading text-xl text-saffron hidden sm:block">ePoojapaath</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-dark hover:text-saffron font-medium transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-saffron group-hover:w-full transition-all duration-200" />
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-dark hover:text-saffron transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-saffron/20 flex items-center justify-center text-saffron font-bold text-sm">
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
                    <Link href={dashboardHref} className="flex items-center gap-2 px-4 py-2 hover:bg-saffron/10 text-dark transition-colors">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link href="/user/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-saffron/10 text-dark transition-colors">
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-lotus-pink transition-colors"
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

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-dark">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-cream/95 backdrop-blur-md border-t border-deep-gold/20 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="text-dark hover:text-saffron font-medium py-2 border-b border-deep-gold/10">
                  {link.label}
                </Link>
              ))}
              {!session && (
                <div className="flex gap-3 pt-2">
                  <Link href="/login"    className="btn-outline-gold text-sm flex-1 text-center">Login</Link>
                  <Link href="/register" className="btn-saffron    text-sm flex-1 text-center">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
