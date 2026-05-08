"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Bookmark } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { IPuja, ITemple } from "@/types";

type PujaWithTemple = Omit<IPuja, "temple"> & { _id: string; temple: Partial<ITemple> & { _id: string } };

export function PujaCard({ puja }: { puja: PujaWithTemple }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card-devotional overflow-hidden group"
    >
      <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden">
        <Image
          src={puja.image || "/placeholder-puja.jpg"}
          alt={puja.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
        <div className="absolute top-3 left-3 bg-deep-gold/90 text-white text-xs px-2.5 py-1 rounded-full font-medium">
          🛕 {typeof puja.temple === "object" ? puja.temple.name : "Temple"}
        </div>
      </div>

      <h3 className="font-heading text-foreground text-xl mb-0.5">{puja.name}</h3>
      <p className="font-sanskrit text-saffron text-sm mb-2">{puja.nameHi}</p>
      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{puja.description}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1"><Clock size={12} /> {puja.duration}</span>
        <span className="flex items-center gap-1"><Bookmark size={12} /> {puja.totalBooked}+ booked</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-heading text-2xl text-saffron">{formatCurrency(puja.price)}</span>
        <Link
          href={`/temples/${typeof puja.temple === "object" ? puja.temple.slug : ""}/puja/${puja._id}`}
          className="btn-saffron text-sm py-2 px-5"
        >
          Book Now 🪔
        </Link>
      </div>
    </motion.div>
  );
}
