import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";
import { PujaCard } from "@/components/temple/PujaCard";
import { serialize } from "@/lib/utils";

async function getPopularPujas() {
  await connectDB();
  return Puja.find({ isActive: true })
    .populate("temple", "name slug coverImage")
    .sort({ totalBooked: -1 })
    .limit(6)
    .lean();
}

export async function PopularPujas() {
  const pujas = serialize(await getPopularPujas().catch(() => []));

  return (
    <section className="section-padding bg-gradient-to-b from-cream to-card-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-saffron font-medium mb-2 font-sanskrit">लोकप्रिय पूजाएँ</p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Popular Pujas</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From Rudrabhishek to Satyanarayan Katha — book sacred rituals performed by learned pandits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {pujas.map((puja: any) => <PujaCard key={puja._id.toString()} puja={puja} />)}
        </div>
      </div>
    </section>
  );
}
