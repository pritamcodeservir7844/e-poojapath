import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Instagram, Twitter, Youtube, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark text-cream/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="ePoojapaath" width={48} height={48} className="rounded-full ring-2 ring-saffron/30" />
              <span className="font-heading text-2xl text-saffron">ePoojapaath</span>
            </div>
            <p className="font-sanskrit text-sm text-cream/60 mb-4">ॐ सर्वे भवन्तु सुखिनः</p>
            <p className="text-sm leading-relaxed text-cream/60">
              India&apos;s trusted platform for online Puja booking, Chadawa offerings, and temple discovery. Connecting devotees with divine grace.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: Facebook, href: "#", label: "Facebook" },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-full border border-deep-gold/30 flex items-center justify-center hover:bg-saffron hover:border-saffron transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-saffron text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Temples", href: "/temples" },
                { label: "Book Puja", href: "/puja" },
                { label: "Chadawa", href: "/chadawa" },
                { label: "Blog", href: "/blog" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Astrology", href: "/astro" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-saffron transition-colors duration-200">
                    🪷 {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-saffron text-lg mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-saffron cursor-pointer transition-colors">🛕 Online Puja Booking</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">🌸 Chadawa Offerings</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">🗺️ Temple Discovery</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">🔮 Vedic Astrology Tools</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">📿 Rashifal & Panchang</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">📦 Prasad Delivery</li>
              <li className="hover:text-saffron cursor-pointer transition-colors">📹 Live Puja Streaming</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-saffron text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-saffron mt-0.5 shrink-0" />
                <span>12, Assi Ghat Road, Varanasi, Uttar Pradesh – 221005</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-saffron shrink-0" />
                <a href="tel:+919876543210" className="hover:text-saffron transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-saffron shrink-0" />
                <a href="mailto:support@epoojapaath.com" className="hover:text-saffron transition-colors">
                  support@epoojapaath.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-saffron shrink-0" />
                <span>Mon–Sat, 9 AM – 6 PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/40">
          <p>© 2025 ePoojapaath. Made with 🙏 in India.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-saffron transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-saffron transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-saffron transition-colors">Sitemap</Link>
          </div>
          <p>
            <span className="text-cream/20">|</span>{" "}
            <Link href="/register-temple" className="hover:text-saffron transition-colors">Register Your Temple</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
