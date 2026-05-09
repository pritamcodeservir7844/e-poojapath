"use client";

import { motion } from "framer-motion";

const steps = [
  {
    icon: "🛕",
    title: "Choose Your Temple",
    desc: "Browse 500+ verified temples across India. Filter by deity, city, or puja type.",
    step: "01",
  },
  {
    icon: "📿",
    title: "Select Puja or Chadawa",
    desc: "Pick from curated rituals — Rudrabhishek, Satyanarayan, Navgrah, or custom offerings.",
    step: "02",
  },
  {
    icon: "🪔",
    title: "Book & Pay Securely",
    desc: "Fill your Sankalp, choose date, and pay via Razorpay. 100% secure, instant confirmation.",
    step: "03",
  },
  {
    icon: "🌸",
    title: "Receive Blessings",
    desc: "Puja performed by temple pandits. Get live stream link, prasad delivery & photo/video proof.",
    step: "04",
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Lotus-tinted bg blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #EC9DD4, transparent 70%)" }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #94AAEE, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="font-medium mb-2 font-sanskrit text-sm tracking-widest uppercase"
            style={{ background: "linear-gradient(135deg, #EC9DD4, #C4AAEE, #94AAEE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            यह कैसे काम करता है
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">How It Works</h2>
          <div className="h-0.5 w-16 rounded-full mx-auto mb-4"
            style={{ background: "linear-gradient(90deg, #EC9DD4, #C4AAEE, #94AAEE)" }} />
          <p className="text-muted-foreground max-w-xl mx-auto">
            From selection to blessings — our seamless process ensures your devotion reaches the divine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon, title, desc, step }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative group"
            >
              <div
                className="rounded-2xl p-6 h-full transition-all duration-300 bg-card-bg"
                style={{
                  border: "1px solid rgba(196,170,238,0.25)",
                  boxShadow: "0 4px 20px rgba(196,170,238,0.08)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(148,170,238,0.18)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(148,170,238,0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(196,170,238,0.08)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(196,170,238,0.25)";
                }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <div className="font-heading text-5xl absolute top-4 right-4 leading-none opacity-10"
                  style={{ background: "linear-gradient(135deg, #EC9DD4, #94AAEE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {step}
                </div>
                <h3 className="font-heading text-foreground text-lg mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 text-2xl z-10 opacity-40"
                  style={{ color: "#C4AAEE" }}>→</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
