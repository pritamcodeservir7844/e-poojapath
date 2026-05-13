import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, MapPin, Clock, Users, CheckCircle2, ChevronDown, Sparkles, BookOpen } from "lucide-react";
import { PublicPage } from "@/components/shared/PublicPage";
import { PujaBookingClient } from "@/components/puja/PujaBookingClient";
import { PujaCountdownTimer } from "@/components/puja/PujaCountdownTimer";
import { connectDB } from "@/lib/db";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import type { IPuja, ITemple, IChadawa } from "@/types";

type PujaWithTemple = IPuja & { _id: string; temple: ITemple & { _id: string } };
type ChadawaWithTemple = IChadawa & { _id: string };

async function getPujaDetail(id: string): Promise<PujaWithTemple | null> {
  await connectDB();
  const puja = await Puja.findById(id)
    .populate("temple", "name slug coverImage description location rating reviewCount timings images")
    .lean();
  return puja as unknown as PujaWithTemple | null;
}

async function getTempleChadawa(templeId: string): Promise<ChadawaWithTemple[]> {
  await connectDB();
  const items = await Chadawa.find({ temple: templeId, isActive: true }).limit(6).lean();
  return items as unknown as ChadawaWithTemple[];
}

const HOW_IT_WORKS = [
  {
    icon: "📿",
    title: "Select Your Puja",
    description: "Choose the package that suits your family size and devotion.",
  },
  {
    icon: "🙏",
    title: "Offer Dakshina & Sankalp",
    description: "Enter your name, gotra and prayer intention for the ritual.",
  },
  {
    icon: "📺",
    title: "Receive Puja Video",
    description: "Watch the live ritual and receive prasad at your doorstep.",
  },
];

const DEFAULT_FAQS = [
  {
    question: "Why choose us for online Puja booking?",
    answer:
      "We are a trusted platform enabling devotees to book pujas at ancient temples across India. Our experienced pandits perform every puja in Shubh Muhurat with full Vedic rituals.",
  },
  {
    question: "Will I receive a recording of the Puja?",
    answer:
      "Yes! After the puja, a recorded video is provided. Post-puja, bhakti box and aarti-wad are delivered to the devotee's doorstep.",
  },
  {
    question: "What should I do if I don't know my Gotra?",
    answer:
      "You can mention 'Kashyap Gotra' as the universal gotra, or simply leave it blank — the pandit will use the common lineage.",
  },
  {
    question: "What should I do on the day of the Puja?",
    answer:
      "Observe a simple fast, think of your deity, and watch the puja live if possible. Your presence in intention is what matters.",
  },
  {
    question: "Is online puja equally powerful as in-person puja?",
    answer:
      "Absolutely. The Vedic tradition recognises Sankalp (intention) as the key — physical presence is not mandatory. Our pandits perform with your name and gotra throughout.",
  },
];

export default async function PujaDetailPage({ params }: { params: { id: string } }) {
  const puja = await getPujaDetail(params.id).catch(() => null);
  if (!puja) notFound();

  const temple = puja.temple;
  const chadawaItems = await getTempleChadawa(temple._id).catch(() => []);
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
          <p className="text-white/80 text-sm font-medium mb-1 flex items-center gap-1">
            <span>🛕 Puja Booking Process</span>
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
          <PujaCountdownTimer scheduledAt={puja.scheduledAt} />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Detail Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* How It Works */}
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-6">How it works?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {HOW_IT_WORKS.map((step, i) => (
                  <div key={i} className="card-devotional text-center">
                    <div className="text-3xl mb-3">{step.icon}</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-full bg-saffron/10 text-saffron text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <h3 className="font-heading text-base text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* About Temple */}
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-4">About Temple</h2>
              <div className="card-devotional overflow-hidden p-0">
                {temple.coverImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={temple.coverImage}
                      alt={temple.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-heading text-xl text-foreground mb-1">{temple.name}</h3>
                  {temple.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin size={13} /> {temple.location.city}, {temple.location.state}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {temple.description}
                  </p>
                  <Link
                    href={`/temples/${temple.slug}`}
                    className="inline-block mt-3 text-sm text-saffron hover:underline font-medium"
                  >
                    View Temple →
                  </Link>
                </div>
              </div>
            </section>

            {/* About Puja */}
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-3">
                About {puja.name}
              </h2>
              <div className="card-devotional">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {puja.description}
                </p>
                {puja.descriptionHi && (
                  <p className="font-sanskrit text-saffron/80 text-sm mt-4 leading-relaxed">
                    {puja.descriptionHi}
                  </p>
                )}
              </div>
            </section>

            {/* Benefits */}
            {puja.benefits && puja.benefits.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl text-foreground mb-4">Benefits</h2>
                <div className="card-devotional grid grid-cols-1 md:grid-cols-2 gap-3">
                  {puja.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={15} className="text-saffron shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* What's Included */}
            {puja.includes && puja.includes.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl text-foreground mb-4">What&apos;s Included</h2>
                <div className="card-devotional grid grid-cols-1 md:grid-cols-2 gap-3">
                  {puja.includes.map((inc) => (
                    <div key={inc} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Sparkles size={15} className="text-saffron shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Chadawa Section */}
            {chadawaItems.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl text-foreground mb-4">
                  Offer Chadawa at {temple.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {chadawaItems.map((item) => (
                    <div key={item._id} className="card-devotional overflow-hidden p-0 group">
                      <div className="relative h-36">
                        <Image
                          src={item.image || "/placeholder-chadawa.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-3 right-3">
                          <p className="text-white font-heading text-sm leading-tight line-clamp-2">
                            {item.name}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-sanskrit text-saffron text-xs">{item.nameHi}</p>
                          <p className="font-heading text-foreground text-base">₹{item.price}</p>
                        </div>
                        <Link
                          href={`/chadawa/${item._id}`}
                          className="bg-gradient-to-r from-purple-600 to-saffron text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition"
                        >
                          Participate Now →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Divya Reviews */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className={i < Math.round(displayRating) ? "fill-saffron text-saffron" : "fill-muted text-muted"} />
                  ))}
                </div>
                <h2 className="font-heading text-2xl text-foreground">
                  {displayRating} Stories of Blessed Experiences
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Priya S.", comment: "An incredibly spiritual experience. The pandit performed every ritual with deep devotion. I could feel the divine presence during the entire puja.", stars: 5 },
                  { name: "Rajesh K.", comment: "Very authentic puja conducted at the actual temple. Received a beautiful video and prasad delivery was prompt. Highly recommend!", stars: 5 },
                  { name: "Anita M.", comment: "Booked for my family of 4. The whole family felt blessed watching the live puja. Will definitely book again for next occasion.", stars: 4 },
                  { name: "Suresh P.", comment: "The sankalp was taken with our full names and gotra. Everything felt genuine and sacred. Thank you for this divine service.", stars: 5 },
                ].map((review, i) => (
                  <div key={i} className="card-devotional">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={12} className={j < review.stars ? "fill-saffron text-saffron" : "fill-muted text-muted"} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <p className="text-xs font-semibold text-foreground">— {review.name}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Accordion */}
            <section>
              <h2 className="font-heading text-2xl text-foreground mb-6 text-center">
                Know More About Your Puja
              </h2>
              <FaqAccordion faqs={faqs} />
            </section>

            {/* Trust Footer */}
            <section className="text-center py-8 border-t border-border">
              <div className="inline-flex items-center gap-2 bg-saffron/5 border border-saffron/20 rounded-full px-6 py-3 mb-4">
                <Sparkles size={16} className="text-saffron" />
                <span className="text-sm font-medium text-foreground">Authenticity You Can Trust</span>
                <Sparkles size={16} className="text-saffron" />
              </div>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                We ensure every ritual is performed by official temple Pandits, following sacred Vedic traditions — so your faith is always in trusted hands.
              </p>
              <div className="flex items-center justify-center gap-8 mt-6">
                <div className="text-center">
                  <p className="font-heading text-2xl text-saffron">50 Lakh+</p>
                  <p className="text-xs text-muted-foreground">Trusted Bhakts</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-2xl text-saffron">500+</p>
                  <p className="text-xs text-muted-foreground">Verified Temples</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-2xl text-saffron">4.8★</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Booking Sidebar */}
          <div className="lg:col-span-1">
            <PujaBookingClient puja={puja as unknown as IPuja & { _id: string }} />
          </div>
        </div>
      </div>
    </PublicPage>
  );
}

function FaqAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <FaqItem key={i} question={faq.question} answer={faq.answer} defaultOpen={i === 0} />
      ))}
    </div>
  );
}

function FaqItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen?: boolean }) {
  return (
    <details className="card-devotional cursor-pointer group" open={defaultOpen}>
      <summary className="flex items-center justify-between font-medium text-foreground text-sm list-none">
        <span className="flex items-center gap-2">
          <BookOpen size={14} className="text-saffron shrink-0" />
          {question}
        </span>
        <ChevronDown size={16} className="text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
      </summary>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed pl-5">{answer}</p>
    </details>
  );
}
