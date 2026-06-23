"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

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

interface TempleGroup {
  templeId: string;
  templeName: string;
  templeSlug: string;
  templeCoverImage?: string;
  templeLocation?: { city: string; state: string };
  templeDescription?: string;
  items: SpecialChadawaItem[];
}

interface SpecialChadawaListProps {
  groups: TempleGroup[];
}

export function SpecialChadawaList({ groups }: SpecialChadawaListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {groups.map((group) => {
        return (
          <div
            key={group.templeId}
            className="card-devotional overflow-hidden p-0 flex flex-col h-full hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-deep-gold/15"
          >
            {/* Temple Cover Image */}
            <div className="relative h-52 w-full overflow-hidden">
              <Image
                src={group.templeCoverImage || "/placeholder-puja.jpg"}
                alt={group.templeName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              
              {/* Offering count badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-saffron to-deep-gold text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  ✨ {group.items.length} Offerings Available
                </span>
              </div>
              
              {/* Location inside overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-heading text-xl leading-tight text-white drop-shadow-md">
                  {group.templeName}
                </h3>
                {group.templeLocation && (
                  <p className="text-xs text-white/90 flex items-center gap-1 mt-1 drop-shadow-sm">
                    <MapPin size={12} className="text-saffron shrink-0" />
                    {group.templeLocation.city}, {group.templeLocation.state}
                  </p>
                )}
              </div>
            </div>

            {/* Temple Description & CTA */}
            <div className="p-5 flex flex-col flex-1">
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                {group.templeDescription || "Book special sacred offerings independently at this temple, performed with full Vedic rituals by authorized pandits on your behalf."}
              </p>
              
              <div className="border-t border-border pt-4">
                <Link
                  href={`/temples/${group.templeSlug}/special-chadawa`}
                  className="w-full bg-gradient-to-r from-saffron to-deep-gold hover:from-deep-gold hover:to-saffron text-white text-sm font-semibold py-3 px-5 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all duration-300"
                >
                  Show All Special Chadawa →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
