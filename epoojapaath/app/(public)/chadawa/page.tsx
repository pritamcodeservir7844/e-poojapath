export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { EmptyState } from "@/components/ui/EmptyState";
import { connectDB } from "@/lib/db";
import Chadawa from "@/models/Chadawa";
import { serialize } from "@/lib/utils";
import { Sparkles } from "lucide-react";

async function getSpecialChadawa() {
  await connectDB();
  return Chadawa.find({ isActive: true, isSpecial: true })
    .populate("temple", "name slug")
    .lean();
}

export default async function ChadawaPage() {
  const specialRaw = await getSpecialChadawa().catch(() => []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const specialItems = serialize(specialRaw) as any[];

  return (
    <PublicPage>
      <PageHero
        sanskrit="देवताओं को अर्पण"
        title="Chadawa Offerings"
        subtitle="Offer sacred items to your chosen deity — presented by temple pandits on your behalf. Book special chadawa independently."
        className="pt-16 pb-10"
      />
      <MandalaDivider className="!py-1" />

      {/* ── Special Chadawa Section ── */}
      {specialItems.length > 0 ? (
        <section className="pt-4 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron/10 to-purple-500/10 border border-saffron/30 rounded-full px-5 py-2 mb-4">
              <Sparkles size={16} className="text-saffron" />
              <span className="text-sm font-semibold text-saffron tracking-wide uppercase">Special Chadawa</span>
              <Sparkles size={16} className="text-saffron" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3">
              Special Chadawa Offerings
            </h2>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              Book these special sacred offerings independently — no puja booking required. Each offering is performed with full devotion by experienced temple pandits.
            </p>
          </div>

          {/* Group special chadawa by temple */}
          {Object.entries(
            specialItems.reduce((acc: Record<string, { templeName: string; templeSlug: string; items: typeof specialItems }>, item) => {
              const tId = typeof item.temple === "object" ? item.temple._id?.toString() : item.temple;
              const tName = typeof item.temple === "object" ? item.temple.name : "Temple";
              const tSlug = typeof item.temple === "object" ? item.temple.slug : "";
              if (!acc[tId]) acc[tId] = { templeName: tName, templeSlug: tSlug, items: [] };
              acc[tId].items.push(item);
              return acc;
            }, {})
          ).map(([tId, group]) => (
            <div key={tId} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-deep-gold flex items-center justify-center text-white text-lg flex-shrink-0">
                  🛕
                </div>
                <div>
                  <h3 className="font-heading text-xl text-foreground">{group.templeName}</h3>
                  <p className="text-xs text-muted-foreground">Special Chadawa</p>
                </div>
                {group.templeSlug && (
                  <Link
                    href={`/temples/${group.templeSlug}`}
                    className="ml-auto text-xs text-saffron hover:underline font-medium"
                  >
                    View Temple →
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.items.map((item) => (
                  <SpecialChadawaCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="section-padding max-w-7xl mx-auto py-16">
          <EmptyState icon="🌸" title="No offerings available" description="Check back soon for special chadawa offerings." />
        </section>
      )}
    </PublicPage>
  );
}

// ── Special Chadawa Card ──────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SpecialChadawaCard({ item }: { item: any }) {
  return (
    <div className="card-devotional group overflow-hidden p-0 flex flex-col">
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
          <p className="text-white/70 font-sanskrit text-xs mt-0.5">{item.nameHi}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-3 flex-1">
          {item.description}
        </p>
        {item.items?.length > 0 && (
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

