"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { IChadawa, ITemple } from "@/types";

type ChadawaWithTemple = Omit<IChadawa, "temple"> & {
  _id: string;
  temple: (Partial<ITemple> & { _id: string }) | string;
};

export function ChadawaCard({ item }: { item: ChadawaWithTemple }) {
  const templeName = typeof item.temple === "object" ? item.temple.name : "";

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="card-devotional group overflow-hidden">
      <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
        <Image
          src={item.image || "/placeholder-puja.jpg"}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
        {templeName && (
          <div className="absolute top-3 left-3 bg-deep-gold/90 text-white text-xs px-2.5 py-1 rounded-full font-medium">
            🛕 {templeName}
          </div>
        )}
        <span className="absolute top-3 right-3 bg-saffron/90 text-white text-xs px-2.5 py-1 rounded-full">
          {item.deity}
        </span>
      </div>

      <h3 className="font-heading text-xl text-foreground mb-0.5">{item.name}</h3>
      <p className="font-sanskrit text-saffron text-sm mb-2">{item.nameHi}</p>
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>

      {item.items.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {item.items.slice(0, 3).map((i) => (
            <span key={i} className="bg-background text-muted-foreground text-xs px-2 py-0.5 rounded-full border border-deep-gold/20">{i}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <span className="font-heading text-2xl text-saffron">{formatCurrency(item.price)}</span>
          {templeName && <p className="text-xs text-muted-foreground mt-0.5">at {templeName}</p>}
        </div>
        <Link href={`/chadawa/${item._id}`} className="btn-saffron text-sm py-2 px-5">Offer 🌸</Link>
      </div>
    </motion.div>
  );
}
