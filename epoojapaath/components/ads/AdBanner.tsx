"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { IAd } from "@/types";

export function AdBanner({ ad }: { ad: Partial<IAd> & { _id: string } }) {
  useEffect(() => {
    fetch(`/api/admin/ads/${ad._id}`, { method: "PATCH", body: JSON.stringify({ action: "impression" }) });
  }, [ad._id]);

  const handleClick = () => {
    fetch(`/api/admin/ads/${ad._id}`, { method: "PATCH", body: JSON.stringify({ action: "click" }) });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
      <a href={ad.linkUrl || "#"} target="_blank" rel="noopener noreferrer" onClick={handleClick}
        className="block relative rounded-2xl overflow-hidden ring-1 ring-deep-gold/20 hover:ring-saffron/40 transition-all duration-300 shadow-md">
        <div className="relative h-24 md:h-32">
          <Image src={ad.imageUrl || "/placeholder-ad.jpg"} alt={ad.title || "Ad"} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/20 to-transparent" />
          <span className="absolute top-2 right-2 bg-black/40 text-white/60 text-xs px-2 py-0.5 rounded">Ad</span>
        </div>
      </a>
    </div>
  );
}
