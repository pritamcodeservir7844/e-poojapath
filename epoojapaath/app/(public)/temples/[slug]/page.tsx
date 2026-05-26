export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PublicPage } from "@/components/shared/PublicPage";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { getTempleBySlug } from "@/services/temple.service";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import Review from "@/models/Review";
import User from "@/models/User";
import { formatCurrency, serialize } from "@/lib/utils";
import { MapPin, Phone, Mail, Globe, Clock, Star } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const temple = serialize(await getTempleBySlug(params.slug).catch(() => null)) as any;
  if (!temple) return { title: "Temple Not Found" };
  return { title: `${temple.name} | ePoojapaath`, description: temple.shortDescription };
}

export default async function TempleDetailPage({ params }: { params: { slug: string } }) {
  const templeRaw = await getTempleBySlug(params.slug).catch(() => null);
  if (!templeRaw) notFound();
  const temple = serialize(templeRaw) as any;

  await connectDB();
  const [pujasRaw, chadawaItemsRaw, reviewsRaw] = await Promise.all([
    Puja.find({ temple: temple._id, isActive: true, status: "approved" }).lean(),
    Chadawa.find({ temple: temple._id, isActive: true, status: "approved" }).lean(),
    Review.find({ temple: temple._id }).populate("user", "name").sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  const pujas = serialize(pujasRaw);
  const chadawaItems = serialize(chadawaItemsRaw);
  const reviews = serialize(reviewsRaw);

  return (
    <PublicPage showAIChat>
      {/* Hero */}
        <div className="relative h-72 md:h-96 w-full">
          <Image src={temple.coverImage || "/placeholder-temple.jpg"} alt={temple.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-sanskrit text-saffron mb-1">{temple.deity}</p>
              <h1 className="font-heading text-4xl md:text-5xl text-white">{temple.name}</h1>
              <div className="flex items-center gap-2 text-white/70 mt-2">
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
            <div className="shrink-0">
              <Link
                href={pujas.length > 0 ? "#pujas-section" : `/puja?temple=${temple.slug}`}
                className="btn-saffron text-sm md:text-base py-2.5 px-6 shadow-lg inline-flex items-center gap-2 font-medium hover:scale-105 transition-all"
              >
                <span>Book a Puja 🪔</span>
              </Link>
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
                <h2 className="font-heading text-2xl text-foreground mb-4">About This Temple</h2>
                <div className="mb-6">
                  {renderDescription(temple.description)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium text-foreground">Deity:</span> <span className="text-muted-foreground">{temple.deity}</span></div>
                  <div><span className="font-medium text-foreground">Established:</span> <span className="text-muted-foreground">{temple.established || "Ancient"}</span></div>
                  <div className="col-span-2"><span className="font-medium text-foreground">Timings:</span> <span className="text-muted-foreground">{temple.timings}</span></div>
                  <div className="col-span-2"><span className="font-medium text-foreground">Address:</span> <span className="text-muted-foreground">{temple.location.address}, {temple.location.city}, {temple.location.state} – {temple.location.pincode}</span></div>
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
                <section id="pujas-section">
                  <h2 className="font-heading text-2xl text-foreground mb-6">Available Pujas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {pujas.map((puja: any) => (
                      <div key={puja._id.toString()} className="card-devotional">
                        <div className="text-xs text-saffron font-semibold mb-1 flex items-center gap-1">
                          🛕 {temple.name}
                        </div>
                        <h3 className="font-heading text-lg text-foreground">{puja.name}</h3>
                        <p className="font-sanskrit text-saffron text-sm mb-2">{puja.nameHi}</p>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{puja.description}</p>
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
                  <h2 className="font-heading text-2xl text-foreground mb-6">Chadawa Offerings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {chadawaItems.map((item: any) => (
                      <div key={item._id.toString()} className="card-devotional">
                        <div className="text-xs text-saffron font-semibold mb-1 flex items-center gap-1">
                          🛕 {temple.name}
                        </div>
                        <h3 className="font-heading text-lg text-foreground">{item.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
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
                <h2 className="font-heading text-2xl text-foreground mb-6">Devotee Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review! 🙏</p>
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
                            <p className="font-medium text-foreground text-sm">{r.user?.name || "Devotee"}</p>
                            <div className="flex gap-0.5">{"★".repeat(r.rating).split("").map((_: string, i: number) => <span key={i} className="text-saffron text-xs">★</span>)}</div>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card-devotional bg-gradient-to-br from-saffron/10 to-amber-500/10 border border-saffron/30 shadow-md">
                <h3 className="font-heading text-lg text-foreground mb-2 flex items-center gap-2">
                  🪔 Online Puja Booking
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Book sacred Vedic rituals and pujas performed by experienced pandits in your name at verified temples.
                </p>
                <Link
                  href={pujas.length > 0 ? "#pujas-section" : `/puja?temple=${temple.slug}`}
                  className="btn-saffron w-full text-center block text-sm font-semibold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Book a Puja Now 🎴
                </Link>
              </div>

              <div className="card-devotional">
                <h3 className="font-heading text-lg text-foreground mb-4">Contact Temple</h3>
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
                    <span className="text-muted-foreground">{temple.timings}</span>
                  </li>
                </ul>
              </div>

              {/* Map placeholder */}
              <div className="card-devotional">
                <h3 className="font-heading text-lg text-foreground mb-3">Location</h3>
                <div className="h-36 bg-background rounded-xl border border-deep-gold/20 flex items-center justify-center mb-3">
                  <div className="text-center text-muted-foreground">
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
                <h3 className="font-heading text-lg text-foreground mb-3">Share Temple</h3>
                <div className="flex gap-2">
                  <a href={`https://wa.me/?text=Check out ${temple.name} on ePoojapaath!`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-green-50 border border-green-200 text-green-700 text-xs text-center py-2 rounded-lg hover:bg-green-100 transition-colors">
                    WhatsApp
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent((process.env.NEXT_PUBLIC_APP_URL ?? "https://e-poojapath.vercel.app") + "/temples/" + temple.slug)}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs text-center py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </PublicPage>
  );
}

function renderDescription(description: string) {
  if (!description) return null;

  const lines = description.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const renderInlineText = (text: string) => {
    // Matches **bold text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 space-y-1 mb-4 text-muted-foreground text-sm">
          {...currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(index);
      return;
    }

    // Check if it's a bullet point (starts with •, *, ⦁, or -)
    if (/^[•*⦁-]\s*/.test(trimmed)) {
      const cleanLine = trimmed.replace(/^[•*⦁-]\s*/, '');
      currentList.push(<li key={`li-${index}`}>{renderInlineText(cleanLine)}</li>);
      return;
    }

    // Since this line is not a bullet, flush any existing list items
    flushList(index);

    // Check if it's a markdown heading
    if (trimmed.startsWith("### ")) {
      renderedElements.push(
        <h4 key={`h4-${index}`} className="font-body text-sm text-foreground font-semibold mt-4 mb-1">
          {renderInlineText(trimmed.slice(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      renderedElements.push(
        <h3 key={`h3-${index}`} className="font-body text-base text-foreground font-semibold mt-5 mb-2">
          {renderInlineText(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    // Auto-detect headings: if it's short, doesn't end with sentence ending punctuation,
    // and matches common heading words.
    const isHeading = 
      trimmed.length < 65 && 
      !/[.,;.?!]/.test(trimmed.slice(-1)) &&
      (trimmed.includes("History") || 
       trimmed.includes("Significance") || 
       trimmed.includes("Why") || 
       trimmed.includes("Timings") || 
       trimmed.includes("Ritual") || 
       trimmed.includes("Offerings") ||
       trimmed.includes("Schedule") ||
       trimmed.startsWith("Experience"));

    if (isHeading) {
      renderedElements.push(
        <h3 key={`h3-auto-${index}`} className="font-body text-base text-foreground font-semibold mt-4 mb-1.5">
          {renderInlineText(trimmed)}
        </h3>
      );
      return;
    }

    // Default paragraph
    renderedElements.push(
      <p key={`p-${index}`} className="text-muted-foreground text-sm leading-relaxed mb-3">
        {renderInlineText(trimmed)}
      </p>
    );
  });

  // Flush any final list
  flushList(lines.length);

  return renderedElements;
}

