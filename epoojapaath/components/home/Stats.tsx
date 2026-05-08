"use client";

import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span ref={ref}>{count.toLocaleString("en-IN")}{suffix}</span>;
}

const stats = [
  { label: "Temples Registered",  value: 500,    suffix: "+" },
  { label: "Pujas Performed",      value: 10000,  suffix: "+" },
  { label: "Cities Covered",       value: 50,     suffix: "+" },
  { label: "Happy Devotees",       value: 100000, suffix: "+" },
];

export function Stats() {
  return (
    <section className="py-16 bg-gradient-to-r from-saffron via-deep-gold to-saffron">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ label, value, suffix }) => (
            <div key={label} className="text-center">
              <div className="font-heading text-4xl md:text-5xl text-white mb-2">
                <CountUp end={value} suffix={suffix} />
              </div>
              <p className="text-white/80 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
