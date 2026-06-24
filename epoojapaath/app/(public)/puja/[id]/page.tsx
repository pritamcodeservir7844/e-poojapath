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
