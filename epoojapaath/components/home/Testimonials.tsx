"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackTestimonials = [
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

const AVATARS = ["🙏", "🕉️", "🌸", "🪔", "🌺", "✨"];

export function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    
    fetch("/api/public/testimonials")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data && resData.data.length > 0) {
          setReviews(resData.data);
        }
      })
      .catch((err) => console.error("Error loading testimonials:", err));

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayList = reviews.length > 0
    ? reviews.map((r, i) => ({
        name: r.reviewerName || r.booking?.devoteeName || r.user?.name || "Devotee",
        city: r.city || r.user?.city || "India",
        avatar: AVATARS[i % AVATARS.length],
        rating: r.rating || 5,
        text: r.comment || "",
        puja: r.temple?.name || "Verified Puja",
      }))
    : fallbackTestimonials;

  // Determine number of visible items based on screen width
  const visibleItems = !mounted ? 3 : windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3;
  const maxIndex = Math.max(0, displayList.length - visibleItems);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="section-padding bg-gradient-to-b from-card-bg to-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-saffron font-medium mb-2 font-sanskrit">भक्तों के अनुभव</p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Devotees Speak</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Real stories from real devotees who found divine connection through ePoojapaath.</p>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative px-2 sm:px-10 md:px-12">
          
          {/* Navigation Arrows */}
          {displayList.length > visibleItems && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-deep-gold/25 text-saffron hover:bg-saffron hover:text-white hover:border-saffron transition-all duration-300 shadow-md flex items-center justify-center focus:outline-none"
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-deep-gold/25 text-saffron hover:bg-saffron hover:text-white hover:border-saffron transition-all duration-300 shadow-md flex items-center justify-center focus:outline-none"
                aria-label="Next testimonials"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Testimonials Track */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(-${currentIndex * (100 / visibleItems)}%, 0, 0)`,
                width: `${(displayList.length / visibleItems) * 100}%`,
              }}
            >
              {displayList.map(({ name, city, avatar, rating, text, puja }, i) => (
                <div
                  key={`${name}-${i}`}
                  style={{ width: `${100 / displayList.length}%` }}
                  className="px-3 flex-shrink-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % visibleItems) * 0.1 }}
                    className="card-devotional h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300 border border-deep-gold/15"
                  >
                    <div>
                      {/* Reviewer Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center text-2xl shrink-0">
                          {avatar}
                        </div>
                        <div>
                          <div className="font-heading text-foreground text-lg font-semibold">{name}</div>
                          <div className="text-muted-foreground text-sm">{city}</div>
                          <div className="flex gap-0.5 mt-1">
                            {"★".repeat(rating).split("").map((s, idx) => (
                              <span key={idx} className="text-saffron text-xs">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Reviewer Comment */}
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                        &ldquo;{text}&rdquo;
                      </p>
                    </div>

                    {/* Puja Tag */}
                    <div className="pt-2">
                      <span className="inline-block bg-saffron/10 text-saffron text-[11px] px-3 py-1 rounded-full font-bold">
                        {puja}
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

      </div>
    </section>
  );
}
