"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function TempleRegisterCTA() {
  return (
    <section className="section-padding bg-dark relative overflow-hidden">
      {/* Decorative mandalas */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-saffron/10 pointer-events-none" />
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-saffron/5 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-5xl mb-6">🛕</div>
          <h2 className="font-heading text-4xl md:text-5xl text-cream mb-4">
            Register Your Temple
          </h2>
          <p className="font-sanskrit text-cream/40 text-lg mb-6">
            यदि आपके पास एक पवित्र स्थान है, तो इसे लाखों भक्तों तक पहुँचाएं
          </p>
          <p className="text-cream/60 mb-10 leading-relaxed">
            Join 500+ temples on ePoojapaath. Reach thousands of devotees across India, manage puja bookings, accept chadawa offerings, and grow your temple&apos;s divine community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/temple/register" className="btn-saffron text-base px-10 py-4">
              Register Temple for Free
            </Link>
            <Link href="/about" className="btn-outline-gold border-cream/30 text-cream hover:bg-cream hover:text-dark text-base px-10 py-4">
              Learn More
            </Link>
          </div>

          <p className="text-cream/30 text-sm mt-6">
            📞 +91 98765 43210 &nbsp;•&nbsp; 📧 support@epoojapaath.com
          </p>
        </motion.div>
      </div>
    </section>
  );
}
