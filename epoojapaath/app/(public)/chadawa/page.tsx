export const dynamic = "force-dynamic";

import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChadawaCard } from "@/components/temple/ChadawaCard";
import { connectDB } from "@/lib/db";
import Chadawa from "@/models/Chadawa";
import { serialize } from "@/lib/utils";

async function getChadawaItems() {
  await connectDB();
  return Chadawa.find({ isActive: true }).populate("temple", "name slug").lean();
}

export default async function ChadawaPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = serialize(await getChadawaItems().catch(() => [])) as any[];

  return (
    <PublicPage>
      <PageHero
        sanskrit="देवताओं को अर्पण"
        title="Chadawa Offerings"
        subtitle="Offer sacred items to your chosen deity — presented by temple pandits on your behalf."
      />
      <MandalaDivider />
      <section className="section-padding max-w-7xl mx-auto">
        {items.length === 0 ? (
          <EmptyState icon="🌸" title="No offerings available" description="Check back soon for chadawa offerings." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => <ChadawaCard key={item._id.toString()} item={item} />)}
          </div>
        )}
      </section>
    </PublicPage>
  );
}
