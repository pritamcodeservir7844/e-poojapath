"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import type { ITemple } from "@/types";

export function TempleCard({ temple }: { temple: Partial<ITemple> & { _id: string } }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card-devotional overflow-hidden group cursor-pointer"
    >
      <Link href={`/temples/${temple.slug}`}>
        <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
          <Image
            src={temple.coverImage || "/placeholder-temple.jpg"}
            alt={temple.name || "Temple"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
          {temple.featured && (
            <span className="absolute top-3 right-3 bg-saffron text-white text-xs font-bold px-2.5 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
          <div className="absolute bottom-3 left-3 text-white">
            <p className="font-heading text-lg leading-tight">{temple.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
          <MapPin size={14} className="text-saffron" />
          <span>{temple.location?.city}, {temple.location?.state}</span>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{temple.shortDescription}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-saffron fill-saffron" />
            <span className="text-sm font-medium text-foreground">
              {temple.rating ? temple.rating.toFixed(1) : "New"}
            </span>
            {temple.reviewCount ? (
              <span className="text-xs text-muted-foreground">({temple.reviewCount})</span>
            ) : null}
          </div>
          <span className="text-saffron text-sm font-medium hover:underline">
            View Temple →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
