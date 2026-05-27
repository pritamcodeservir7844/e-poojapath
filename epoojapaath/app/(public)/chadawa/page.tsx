export const dynamic = "force-dynamic";

import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { EmptyState } from "@/components/ui/EmptyState";
import { connectDB } from "@/lib/db";
import Chadawa from "@/models/Chadawa";
import { serialize } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { TempleChadawaGroup } from "@/components/shared/TempleChadawaGroup";

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
            <TempleChadawaGroup
              key={tId}
              templeName={group.templeName}
              templeSlug={group.templeSlug}
              items={group.items}
            />
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

