import { getFeaturedTemples } from "@/services/temple.service";
import { TempleCard } from "@/components/temple/TempleCard";
import { serialize } from "@/lib/utils";

export async function FeaturedTemples() {
  const temples = serialize(await getFeaturedTemples().catch(() => []));

  return (
    <section className="section-padding max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-saffron font-medium mb-2 font-sanskrit">प्रमुख तीर्थस्थल</p>
        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Featured Temples</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Explore India&apos;s most revered temples — book pujas, offer chadawa, and seek divine blessings.
        </p>
      </div>

      {temples.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <div className="text-5xl mb-4">🛕</div>
          <p className="font-heading text-xl">No temples featured yet</p>
          <p className="text-sm mt-2">Be the first to register your temple!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {temples.map((temple: any) => (
            <TempleCard key={temple._id.toString()} temple={temple} />
          ))}
        </div>
      )}
    </section>
  );
}
