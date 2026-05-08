import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { EmptyState } from "@/components/ui/EmptyState";
import { TempleCard } from "@/components/temple/TempleCard";
import { TempleFilters } from "@/components/temple/TempleFilters";
import { getApprovedTemples } from "@/services/temple.service";
import type { ITemple } from "@/types";

interface PageProps {
  searchParams: { city?: string; deity?: string };
}

export default async function TemplesPage({ searchParams }: PageProps) {
  const temples = await getApprovedTemples({
    city:  searchParams.city  || undefined,
    deity: searchParams.deity || undefined,
  }).catch(() => []) as (ITemple & { _id: string })[];

  return (
    <PublicPage>
      <PageHero
        sanskrit="तीर्थस्थल खोजें"
        title="Explore Temples"
        subtitle="Discover 500+ verified temples across India. Book pujas, offer chadawa, seek divine blessings."
      />
      <TempleFilters city={searchParams.city} deity={searchParams.deity} />
      <MandalaDivider />
      <section className="section-padding max-w-7xl mx-auto">
        {temples.length === 0 ? (
          <EmptyState icon="🛕" title="No temples found" description="Try a different city or deity." />
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6">{temples.length} temple{temples.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {temples.map((t) => <TempleCard key={t._id.toString()} temple={t} />)}
            </div>
          </>
        )}
      </section>
    </PublicPage>
  );
}
