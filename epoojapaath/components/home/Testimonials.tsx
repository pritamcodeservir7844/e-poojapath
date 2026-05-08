"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Priya Sharma",
    city: "Delhi",
    avatar: "🙏",
    rating: 5,
    text: "I booked a Rudrabhishek at Kashi Vishwanath through ePoojapaath. The pandit performed it beautifully and I received a video within hours. Feeling truly blessed!",
    puja: "Rudrabhishek",
  },
  {
    name: "Ramesh Patel",
    city: "Ahmedabad",
    avatar: "🕉️",
    rating: 5,
    text: "Offered Chadawa to Mata Vaishno Devi on my mother's birthday from Ahmedabad. The process was seamless, prasad arrived in 3 days. Thank you ePoojapaath!",
    puja: "Chadawa Offering",
  },
  {
    name: "Ananya Gupta",
    city: "Mumbai",
    avatar: "🌸",
    rating: 5,
    text: "Used the Muhurat Finder for my new business launch. The auspicious timing was perfect — business is booming! The astrology tools are incredibly accurate.",
    puja: "Muhurat Finder",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-gradient-to-b from-card-bg to-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-saffron font-medium mb-2 font-sanskrit">भक्तों के अनुभव</p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Devotees Speak</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Real stories from real devotees who found divine connection through ePoojapaath.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, city, avatar, rating, text, puja }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card-devotional"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center text-2xl shrink-0">
                  {avatar}
                </div>
                <div>
                  <div className="font-heading text-foreground text-lg">{name}</div>
                  <div className="text-muted-foreground text-sm">{city}</div>
                  <div className="flex gap-0.5 mt-1">
                    {"★".repeat(rating).split("").map((s, idx) => (
                      <span key={idx} className="text-saffron text-sm">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">&ldquo;{text}&rdquo;</p>
              <span className="inline-block bg-saffron/10 text-saffron text-xs px-3 py-1 rounded-full font-medium">
                {puja}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
