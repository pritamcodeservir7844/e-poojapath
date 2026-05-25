"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";

type ChadawaItem = {
  _id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  image: string;
  temple?: { _id: string; name: string; slug: string };
};

export function ChadawaSectionClient({ items }: { items: ChadawaItem[] }) {
  const { lang, t } = useLang();

  return (
    <section className="section-padding max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-saffron font-medium mb-2 font-sanskrit">देवताओं को अर्पण</p>
        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
          {t("Chadawa Offerings", "चढ़ावा अर्पण")}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t(
            "Offer flowers, sweets, and sacred items to your chosen deity — delivered by temple pandits on your behalf.",
            "अपने देवता को फूल, मिठाई और पवित्र वस्तुएं अर्पण करें — मंदिर के पंडितों द्वारा आपकी ओर से।"
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => {
          const name = lang === "hi" && item.nameHi ? item.nameHi : item.name;
          const desc = lang === "hi" && item.descriptionHi ? item.descriptionHi : item.description;
          return (
            <div key={item._id} className="card-devotional group cursor-pointer">
              <div className="relative h-40 mb-4 overflow-hidden rounded-xl">
                <Image
                  src={item.image || "/placeholder-puja.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
                {item.temple && (
                  <div className="absolute top-2 left-2 bg-deep-gold/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">
                    🛕 {item.temple.name}
                  </div>
                )}
              </div>
              <h3 className="font-heading text-foreground text-lg mb-1">{name}</h3>
              <p className="text-xs text-muted-foreground mb-1 font-sanskrit">{item.nameHi}</p>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-saffron text-lg">{formatCurrency(item.price)}</span>
                <Link href={`/chadawa/${item._id}`} className="btn-saffron text-sm py-1.5 px-4">
                  {t("Offer 🌸", "अर्पण करें 🌸")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link href="/chadawa" className="btn-outline-gold">
          {t("View All Offerings", "सभी अर्पण देखें")}
        </Link>
      </div>
    </section>
  );
}
