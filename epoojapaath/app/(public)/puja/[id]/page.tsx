export const dynamic = "force-dynamic";

import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, MapPin, Clock } from "lucide-react";
import { PublicPage } from "@/components/shared/PublicPage";
import { PujaDetailClient } from "@/components/puja/PujaDetailClient";
import { PujaCountdownTimer } from "@/components/puja/PujaCountdownTimer";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import type { IPuja, ITemple, IChadawa } from "@/types";
import { serialize } from "@/lib/utils";
import Link from "next/link";

type PujaWithTemple = IPuja & { _id: string; temple: ITemple & { _id: string } };
type ChadawaItem = IChadawa & { _id: string };

async function getPujaDetail(id: string): Promise<PujaWithTemple | null> {
  await connectDB();
  const puja = await Puja.findById(id)
    .populate("temple", "name slug coverImage description location rating reviewCount timings images")
    .lean();
  return puja as unknown as PujaWithTemple | null;
}

async function getTempleChadawa(templeId: string): Promise<ChadawaItem[]> {
  await connectDB();
  const items = await Chadawa.find({ temple: templeId, isActive: true, isSpecial: false }).limit(12).lean();
  return items as unknown as ChadawaItem[];
}

const DEFAULT_FAQS = [
  {
    question: "Why choose us for online Puja booking?",
    answer: "We are a trusted platform enabling devotees to book pujas at ancient temples across India. Our experienced pandits perform every puja in Shubh Muhurat with full Vedic rituals.",
  },
  {
    question: "Will I receive a recording of the Puja?",
    answer: "Yes! After the puja, a recorded video is provided. Post-puja, bhakti box and aarti-prasad are delivered to the devotee's doorstep.",
  },
  {
    question: "What should I do if I don't know my Gotra?",
    answer: "You can mention 'Kashyap Gotra' as the universal gotra, or simply leave it blank — the pandit will use the common lineage.",
  },
  {
    question: "What should I do on the day of the Puja?",
    answer: "Observe a simple fast, think of your deity, and watch the puja live if possible. Your presence in intention is what matters.",
  },
  {
    question: "Is online puja equally powerful as in-person puja?",
    answer: "Absolutely. The Vedic tradition recognises Sankalp (intention) as the key — physical presence is not mandatory. Our pandits perform with your name and gotra throughout.",
  },
];

export default async function PujaDetailPage({ params }: { params: { id: string } }) {
  const pujaRaw = await getPujaDetail(params.id).catch(() => null);
  if (!pujaRaw) notFound();
  const puja = serialize(pujaRaw);

  const temple = puja.temple;
  const chadawaItems = serialize(await getTempleChadawa(temple._id).catch(() => []));
  const faqs = puja.faqs && puja.faqs.length > 0 ? puja.faqs : DEFAULT_FAQS;

  const displayRating = puja.rating > 0 ? puja.rating : temple.rating > 0 ? temple.rating : 4.5;
  const displayReviews = puja.reviewCount > 0 ? puja.reviewCount : temple.reviewCount > 0 ? temple.reviewCount : 120;

  return (
    <PublicPage>
      {/* ── Hero Banner ── */}
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={puja.image || (temple.images?.[0] ?? temple.coverImage)}
          alt={puja.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-7xl mx-auto">
          <p className="text-white/80 text-sm font-medium mb-1 flex items-center gap-1.5">
            <span>🛕 Puja Booking at <span className="text-saffron font-semibold">{temple.name}</span></span>
          </p>
          <h1 className="text-white font-heading text-2xl md:text-3xl leading-tight max-w-3xl">
            {puja.name}
          </h1>
          <p className="text-white/70 font-sanskrit text-base mt-1">{puja.nameHi}</p>
        </div>
      </div>

      {/* ── Meta Bar ── */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center gap-4">
          <Link
            href={`/temples/${temple.slug}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-saffron transition-colors"
          >
            <MapPin size={14} />
            <span>{temple.name}, {temple.location?.city}</span>
          </Link>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < Math.round(displayRating) ? "fill-saffron text-saffron" : "text-muted"}
              />
            ))}
            <span className="text-saffron font-semibold ml-1">{displayRating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">Stars</span>
            <span className="text-muted-foreground ml-1">• {displayReviews}+ Reviews</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>{puja.duration}</span>
          </div>
          <span className="text-border">|</span>
          <PujaCountdownTimer scheduledAt={puja.scheduledAt} availableDates={puja.availableDates} />
        </div>
      </div>

      {/* ── All interactive content (shared chadawa state) ── */}
      <PujaDetailClient
        puja={puja as unknown as IPuja & { _id: string }}
        temple={temple as unknown as ITemple & { _id: string }}
        chadawaItems={chadawaItems as unknown as ChadawaItem[]}
        faqs={faqs}
        displayRating={displayRating}
        displayReviews={displayReviews}
      />
    </PublicPage>
  );
}
