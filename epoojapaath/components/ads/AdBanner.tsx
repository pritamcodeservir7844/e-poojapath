"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { IAd } from "@/types";

interface AdBannerProps {
  ads: (Partial<IAd> & { _id: string })[];
}

export function AdBanner({ ads }: AdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeAds = useMemo(() => ads || [], [ads]);

  // Track impression for the current active ad
  useEffect(() => {
    if (activeAds.length === 0) return;
    const currentAd = activeAds[currentIndex];
    if (currentAd?._id) {
      fetch(`/api/admin/ads/${currentAd._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "impression" }),
      }).catch((err) => console.error("Failed to track ad impression:", err));
    }
  }, [currentIndex, activeAds]);

  // Auto-slide every 5 seconds if there are multiple ads
  useEffect(() => {
    if (activeAds.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeAds.length]);

  if (activeAds.length === 0) return null;

  const currentAd = activeAds[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeAds.length);
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const handleClick = () => {
    if (currentAd?._id) {
      fetch(`/api/admin/ads/${currentAd._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "click" }),
      }).catch((err) => console.error("Failed to track ad click:", err));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
      <a
        href={currentAd.linkUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block relative rounded-2xl overflow-hidden ring-1 ring-deep-gold/20 hover:ring-saffron/40 transition-all duration-300 shadow-md group"
      >
        <div className="relative h-32 md:h-48 w-full overflow-hidden">
          {/* Active Ad Banner Image */}
          <div className="relative w-full h-full transition-opacity duration-500 ease-in-out">
            <Image
              src={currentAd.imageUrl || "/placeholder-ad.jpg"}
              alt={currentAd.title || "Ad"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/20 to-transparent pointer-events-none" />
            <span className="absolute top-2 right-2 bg-black/40 text-white/60 text-xs px-2 py-0.5 rounded pointer-events-none">Ad</span>
          </div>

          {/* Navigation Arrows for Multiple Ads */}
          {activeAds.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight size={18} />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {activeAds.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleDotClick(e, idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? "bg-saffron w-3" : "bg-white/50 hover:bg-white"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </a>
    </div>
  );
}
