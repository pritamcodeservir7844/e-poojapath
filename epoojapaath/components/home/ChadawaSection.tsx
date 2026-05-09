import { connectDB } from "@/lib/db";
import Chadawa from "@/models/Chadawa";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, serialize } from "@/lib/utils";

async function getChadawaItems() {
  await connectDB();
  return Chadawa.find({ isActive: true })
    .populate("temple", "name slug")
    .limit(4)
    .lean();
}

export async function ChadawaSection() {
  const items = serialize(await getChadawaItems().catch(() => []));

  return (
    <section className="section-padding max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-saffron font-medium mb-2 font-sanskrit">देवताओं को अर्पण</p>
        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Chadawa Offerings</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Offer flowers, sweets, and sacred items to your chosen deity — delivered by temple pandits on your behalf.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {items.map((item: any) => (
          <div key={item._id.toString()} className="card-devotional group cursor-pointer">
            <div className="relative h-40 mb-4 overflow-hidden rounded-xl">
              <Image
                src={item.image || "/placeholder-puja.jpg"}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
            </div>
            <h3 className="font-heading text-foreground text-lg mb-1">{item.name}</h3>
            <p className="text-xs text-muted-foreground mb-1 font-sanskrit">{item.nameHi}</p>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-saffron text-lg">{formatCurrency(item.price)}</span>
              <Link
                href={`/chadawa/${item._id}`}
                className="btn-saffron text-sm py-1.5 px-4"
              >
                Offer 🌸
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/chadawa" className="btn-outline-gold">View All Offerings</Link>
      </div>
    </section>
  );
}
