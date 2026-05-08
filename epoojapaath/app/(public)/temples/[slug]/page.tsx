import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { getTempleBySlug } from "@/services/temple.service";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import Review from "@/models/Review";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Phone, Mail, Globe, Clock, Star } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const temple = await getTempleBySlug(params.slug).catch(() => null);
  if (!temple) return { title: "Temple Not Found" };
  return { title: `${temple.name} | ePoojapaath`, description: temple.shortDescription };
}

export default async function TempleDetailPage({ params }: { params: { slug: string } }) {
  const temple = await getTempleBySlug(params.slug).catch(() => null);
  if (!temple) notFound();

  await connectDB();
  const [pujas, chadawaItems, reviews] = await Promise.all([
    Puja.find({ temple: temple._id, isActive: true }).lean(),
    Chadawa.find({ temple: temple._id, isActive: true }).lean(),
    Review.find({ temple: temple._id }).populate("user", "name").sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <div className="relative h-72 md:h-96 w-full">
          <Image src={temple.coverImage || "/placeholder-temple.jpg"} alt={temple.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-sanskrit text-saffron mb-1">{temple.deity}</p>
            <h1 className="font-heading text-4xl md:text-5xl text-cream">{temple.name}</h1>
            <div className="flex items-center gap-2 text-cream/70 mt-2">
              <MapPin size={16} className="text-saffron" />
              <span>{temple.location.city}, {temple.location.state}</span>
              {temple.rating > 0 && (
                <span className="flex items-center gap-1 ml-4">
                  <Star size={14} className="text-saffron fill-saffron" />
                  {temple.rating.toFixed(1)} ({temple.reviewCount} reviews)
                </span>
              )}
            </div>
          </div>
        </div>

        <MandalaDivider />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <section className="card-devotional">
                <h2 className="font-heading text-2xl text-dark mb-4">About This Temple</h2>
                <p className="text-muted leading-relaxed mb-4">{temple.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium text-dark">Deity:</span> <span className="text-muted">{temple.deity}</span></div>
                  <div><span className="font-medium text-dark">Established:</span> <span className="text-muted">{temple.established || "Ancient"}</span></div>
                  <div className="col-span-2"><span className="font-medium text-dark">Timings:</span> <span className="text-muted">{temple.timings}</span></div>
                  <div className="col-span-2"><span className="font-medium text-dark">Address:</span> <span className="text-muted">{temple.location.address}, {temple.location.city}, {temple.location.state} – {temple.location.pincode}</span></div>
                </div>
                {temple.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {temple.tags.map((tag: string) => (
                      <span key={tag} className="bg-saffron/10 text-saffron text-xs px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </section>

              {/* Pujas */}
              {pujas.length > 0 && (
                <section>
                  <h2 className="font-heading text-2xl text-dark mb-6">Available Pujas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {pujas.map((puja: any) => (
                      <div key={puja._id.toString()} className="card-devotional">
                        <h3 className="font-heading text-lg text-dark">{puja.name}</h3>
                        <p className="font-sanskrit text-saffron text-sm mb-2">{puja.nameHi}</p>
                        <p className="text-muted text-sm mb-3 line-clamp-2">{puja.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-xl text-saffron">{formatCurrency(puja.price)}</span>
                          <Link href={`/temples/${temple.slug}/puja/${puja._id}`} className="btn-saffron text-sm py-1.5 px-4">Book 🪔</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Chadawa */}
              {chadawaItems.length > 0 && (
                <section>
                  <h2 className="font-heading text-2xl text-dark mb-6">Chadawa Offerings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {chadawaItems.map((item: any) => (
                      <div key={item._id.toString()} className="card-devotional">
                        <h3 className="font-heading text-lg text-dark">{item.name}</h3>
                        <p className="text-muted text-sm mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-xl text-saffron">{formatCurrency(item.price)}</span>
                          <Link href={`/chadawa/${item._id}`} className="btn-outline-gold text-sm py-1.5 px-4">Offer 🌸</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews */}
              <section>
                <h2 className="font-heading text-2xl text-dark mb-6">Devotee Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-muted text-center py-8">No reviews yet. Be the first to review! 🙏</p>
                ) : (
                  <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {reviews.map((r: any) => (
                      <div key={r._id.toString()} className="card-devotional">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-saffron/10 flex items-center justify-center text-saffron font-bold text-sm">
                            {r.user?.name?.[0] || "D"}
                          </div>
                          <div>
                            <p className="font-medium text-dark text-sm">{r.user?.name || "Devotee"}</p>
                            <div className="flex gap-0.5">{"★".repeat(r.rating).split("").map((_: string, i: number) => <span key={i} className="text-saffron text-xs">★</span>)}</div>
                          </div>
                        </div>
                        <p className="text-muted text-sm">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card-devotional">
                <h3 className="font-heading text-lg text-dark mb-4">Contact Temple</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm">
                    <Phone size={15} className="text-saffron shrink-0" />
                    <a href={`tel:${temple.contactPhone}`} className="text-saffron hover:underline">{temple.contactPhone}</a>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Mail size={15} className="text-saffron shrink-0" />
                    <a href={`mailto:${temple.contactEmail}`} className="text-saffron hover:underline">{temple.contactEmail}</a>
                  </li>
                  {temple.website && (
                    <li className="flex items-center gap-3 text-sm">
                      <Globe size={15} className="text-saffron shrink-0" />
                      <a href={temple.website} target="_blank" rel="noopener noreferrer" className="text-saffron hover:underline">Website</a>
                    </li>
                  )}
                  <li className="flex items-start gap-3 text-sm">
                    <Clock size={15} className="text-saffron shrink-0 mt-0.5" />
                    <span className="text-muted">{temple.timings}</span>
                  </li>
                </ul>
              </div>

              {/* Map placeholder */}
              <div className="card-devotional">
                <h3 className="font-heading text-lg text-dark mb-3">Location</h3>
                <div className="h-36 bg-cream rounded-xl border border-deep-gold/20 flex items-center justify-center mb-3">
                  <div className="text-center text-muted">
                    <MapPin className="mx-auto mb-1 text-saffron" size={24} />
                    <p className="text-xs">{temple.location.city}</p>
                  </div>
                </div>
                {temple.googleMapsUrl && (
                  <a href={temple.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                    className="text-saffron text-sm hover:underline block text-center">
                    View on Google Maps →
                  </a>
                )}
              </div>

              {/* Share */}
              <div className="card-devotional">
                <h3 className="font-heading text-lg text-dark mb-3">Share Temple</h3>
                <div className="flex gap-2">
                  <a href={`https://wa.me/?text=Check out ${temple.name} on ePoojapaath!`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-green-50 border border-green-200 text-green-700 text-xs text-center py-2 rounded-lg hover:bg-green-100 transition-colors">
                    WhatsApp
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=Discover ${temple.name} on ePoojapaath!`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs text-center py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
