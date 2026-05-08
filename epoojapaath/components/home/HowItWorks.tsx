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
    <section className="section-padding bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-saffron font-medium mb-2 font-sanskrit">यह कैसे काम करता है</p>
          <h2 className="font-heading text-4xl md:text-5xl text-cream mb-4">How It Works</h2>
          <p className="text-cream/50 max-w-xl mx-auto">
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
              <div className="border border-saffron/20 rounded-2xl p-6 bg-cream/5 hover:bg-cream/10 hover:border-saffron/40 transition-all duration-300 h-full">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <div className="font-heading text-5xl text-saffron/15 absolute top-4 right-4 leading-none">
                  {step}
                </div>
                <h3 className="font-heading text-cream text-lg mb-3">{title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 text-saffron/30 text-2xl z-10">→</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
