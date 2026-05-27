"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SpecialChadawaItem {
  _id: string;
  name: string;
  nameHi?: string;
  description: string;
  image?: string;
  price: number;
  items?: string[];
  temple: string | { _id: string; name: string; slug: string };
}

interface TempleChadawaGroupProps {
  templeName: string;
  templeSlug: string;
  items: SpecialChadawaItem[];
}

export function TempleChadawaGroup({ templeName, templeSlug, items }: TempleChadawaGroupProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <div className="mb-12">
      {/* Group Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-deep-gold flex items-center justify-center text-white text-lg flex-shrink-0">
          🛕
        </div>
        <div>
          <h3 className="font-heading text-xl text-foreground">{templeName}</h3>
          <p className="text-xs text-muted-foreground">Special Chadawa</p>
        </div>
        {templeSlug && (
          <Link
            href={`/temples/${templeSlug}`}
            className="ml-auto text-xs text-saffron hover:underline font-medium"
          >
            View Temple →
          </Link>
        )}
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleItems.map((item) => (
          <SpecialChadawaCard key={item._id} item={item} />
        ))}
      </div>

      {/* Show All / Show Less Toggle Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setExpanded(!expanded)}
            className="group btn-outline-gold px-6 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:scale-105 transition-all shadow-sm duration-300"
          >
            {expanded ? (
              <>
                <span>Show Less</span>
                <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                <span>Show All ({items.length})</span>
                <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Special Chadawa Card ──────────────────────────────────────────────────────
function SpecialChadawaCard({ item }: { item: SpecialChadawaItem }) {
  return (
    <div className="card-devotional group overflow-hidden p-0 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={item.image || "/placeholder-puja.jpg"}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Special badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-gradient-to-r from-saffron to-deep-gold text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            ✨ Special
          </span>
        </div>
        {/* Temple badge */}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
          🛕 {typeof item.temple === "object" ? item.temple.name : "Temple"}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-heading text-base leading-tight line-clamp-2">{item.name}</p>
          {item.nameHi && <p className="text-white/70 font-sanskrit text-xs mt-0.5">{item.nameHi}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-3 flex-1">
          {item.description}
        </p>
        {item.items && item.items.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.items.slice(0, 3).map((i: string) => (
              <span key={i} className="bg-saffron/10 text-saffron text-xs px-2 py-0.5 rounded-full border border-saffron/20">
                {i}
              </span>
            ))}
            {item.items.length > 3 && (
              <span className="text-xs text-muted-foreground px-1">+{item.items.length - 3} more</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div>
            <p className="font-heading text-xl text-saffron">₹{item.price}</p>
            <p className="text-xs text-muted-foreground">Special Offering</p>
          </div>
          <Link
            href={`/chadawa/${item._id}`}
            className="bg-gradient-to-r from-saffron to-deep-gold text-white text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition shadow"
          >
            Book Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
