"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function TempleRegisterCTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Lotus gradient background */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #F0ECFF 0%, #FFF0F8 50%, #EEF2FF 100%)" }} />
      <div className="dark:absolute dark:inset-0"
        style={{ background: "linear-gradient(135deg, #150B28 0%, #20101C 50%, #0E1430 100%)" }} />

      {/* Decorative circles */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(196,170,238,0.2)" }} />
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(148,170,238,0.12)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, #C4AAEE, transparent 60%)" }} />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-5xl mb-6">🛕</div>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            Register Your Temple
          </h2>
          <div className="h-0.5 w-16 rounded-full mx-auto mb-5"
            style={{ background: "linear-gradient(90deg, #EC9DD4, #C4AAEE, #94AAEE)" }} />
          <p className="font-sanskrit text-muted-foreground text-lg mb-4">
            यदि आपके पास एक पवित्र स्थान है, तो इसे लाखों भक्तों तक पहुँचाएं
          </p>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Join 500+ temples on ePoojapaath. Reach thousands of devotees across India, manage puja bookings,
            accept chadawa offerings, and grow your temple&apos;s divine community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/temple/register" className="btn-saffron text-base px-10 py-4">
              Register Temple for Free
            </Link>
            <Link href="/about" className="btn-outline-lotus text-base px-10 py-4">
              Learn More
            </Link>
          </div>

          <p className="text-muted-foreground/60 text-sm mt-6">
            📞 +91 98765 43210 &nbsp;•&nbsp; 📧 support@epoojapaath.com
          </p>
        </motion.div>
      </div>
    </section>
  );
}
