"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Phone, Mail, Globe, Star, ArrowLeft,
  BookOpen, Flower2, IndianRupee, Users, Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateShort } from "@/lib/utils";

type Temple = {
  _id: string; name: string; slug: string; description: string;
  deity: string; coverImage: string; images: string[];
  location: { address: string; city: string; state: string; pincode: string };
  status: "pending" | "approved" | "rejected";
  featured: boolean; rating: number; reviewCount: number;
  totalBookings: number; timings: string;
  contactPhone: string; contactEmail: string; website?: string;
  owner: { name: string; email: string; phone?: string };
  createdAt: string;
};
type Puja    = { _id: string; name: string; nameHi: string; price: number; duration: string; isActive: boolean; totalBooked: number; rating: number };
type Chadawa = { _id: string; name: string; nameHi: string; price: number; isActive: boolean; offeringItems: unknown[] };
type Booking = {
  _id: string; serviceName: string; serviceType: string; amount: number;
  status: string; paymentStatus: string; devoteeName: string;
  createdAt: string; date: string;
  user: { name: string; email: string };
};

type Detail = { temple: Temple; pujas: Puja[]; chadawas: Chadawa[]; bookings: Booking[]; revenue: number };

const TABS = ["Overview", "Pujas", "Chadawa", "History"] as const;
type Tab = typeof TABS[number];

export default function AdminTempleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [data,    setData]    = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<Tab>("Overview");

  useEffect(() => {
    fetch(`/api/admin/temples/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-4xl animate-bounce">🛕</div>
    </div>
  );
  if (!data) return <div className="p-8 text-muted-foreground">Temple not found.</div>;

  const { temple, pujas, chadawas, bookings, revenue } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-heading text-xl text-foreground">{temple.name}</h1>
          <p className="text-xs text-muted-foreground">{temple.location.city}, {temple.location.state}</p>
        </div>
        <Badge variant={temple.status}>{temple.status}</Badge>
        {temple.featured && <Badge variant="saffron">⭐ Featured</Badge>}
      </div>

      {/* Hero */}
      {temple.coverImage && (
        <div className="relative h-48 w-full">
          <Image src={temple.coverImage} alt={temple.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        {[
          { icon: <IndianRupee size={16} />, label: "Revenue",  value: formatCurrency(revenue) },
          { icon: <BookOpen    size={16} />, label: "Bookings", value: bookings.length },
          { icon: <Star        size={16} />, label: "Rating",   value: `${temple.rating || "—"} ★` },
          { icon: <Users       size={16} />, label: "Reviews",  value: temple.reviewCount || 0 },
        ].map((s) => (
          <div key={s.label} className="bg-card px-5 py-4 flex items-center gap-3">
            <span className="text-saffron">{s.icon}</span>
            <div>
              <p className="font-heading text-lg text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-6 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-saffron text-saffron"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
            {t === "Pujas"    && <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5">{pujas.length}</span>}
            {t === "Chadawa"  && <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5">{chadawas.length}</span>}
            {t === "History"  && <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5">{bookings.length}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 max-w-5xl space-y-6">

        {/* ── Overview ── */}
        {tab === "Overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-heading text-base text-foreground">Temple Details</h3>
              <dl className="space-y-2 text-sm">
                <Row label="Deity"    value={temple.deity} />
                <Row label="Timings"  value={temple.timings} />
                <Row label="Address"  value={`${temple.location.address}, ${temple.location.city}, ${temple.location.state} – ${temple.location.pincode}`} />
                <Row label="Registered" value={formatDateShort(temple.createdAt)} />
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-heading text-base text-foreground">Owner / Contact</h3>
              <dl className="space-y-2 text-sm">
                <Row label="Owner" value={temple.owner?.name || "—"} />
                <Row label="Email" value={temple.owner?.email || "—"} icon={<Mail size={13} />} />
                {temple.owner?.phone  && <Row label="Phone"   value={temple.owner.phone}   icon={<Phone  size={13} />} />}
                {temple.contactPhone  && <Row label="Contact" value={temple.contactPhone}   icon={<Phone  size={13} />} />}
                {temple.contactEmail  && <Row label="Contact" value={temple.contactEmail}   icon={<Mail   size={13} />} />}
                {temple.website       && <Row label="Website" value={temple.website}        icon={<Globe  size={13} />} />}
              </dl>
            </div>

            {temple.description && (
              <div className="md:col-span-2 rounded-2xl border border-border bg-card p-5">
                <h3 className="font-heading text-base text-foreground mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{temple.description}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Pujas ── */}
        {tab === "Pujas" && (
          <div className="space-y-3">
            {pujas.length === 0 && <p className="text-muted-foreground text-sm">No pujas added yet.</p>}
            {pujas.map((p) => (
              <div key={p._id} className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{p.name}</p>
                    <span className="font-sanskrit text-saffron text-xs">{p.nameHi}</span>
                    {!p.isActive && <Badge variant="rejected">Inactive</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    <Clock size={11} /> {p.duration}
                    <span className="text-border">•</span>
                    <Star size={11} /> {p.rating || "—"}
                    <span className="text-border">•</span>
                    {p.totalBooked} booked
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading text-saffron text-base">{formatCurrency(p.price)}</p>
                  <Link href={`/puja/${p._id}`} target="_blank" className="text-xs text-muted-foreground hover:text-saffron">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Chadawa ── */}
        {tab === "Chadawa" && (
          <div className="space-y-3">
            {chadawas.length === 0 && <p className="text-muted-foreground text-sm">No chadawa offerings yet.</p>}
            {chadawas.map((c) => (
              <div key={c._id} className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{c.name}</p>
                    <span className="font-sanskrit text-saffron text-xs">{c.nameHi}</span>
                    {!c.isActive && <Badge variant="rejected">Inactive</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Flower2 size={11} /> {c.offeringItems?.length ?? 0} offering items
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading text-saffron text-base">{formatCurrency(c.price)}</p>
                  <Link href={`/chadawa/${c._id}`} target="_blank" className="text-xs text-muted-foreground hover:text-saffron">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── History ── */}
        {tab === "History" && (
          <div className="space-y-3">
            {bookings.length === 0 && <p className="text-muted-foreground text-sm">No bookings yet.</p>}
            {bookings.map((b) => (
              <div key={b._id} className="rounded-2xl border border-border bg-card px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground text-sm">{b.serviceName}</p>
                      <Badge variant={b.serviceType === "puja" ? "saffron" : "pink"}>
                        {b.serviceType}
                      </Badge>
                      <Badge variant={b.status as any}>{b.status}</Badge>
                      <Badge variant={b.paymentStatus === "paid" ? "approved" : "pending"}>
                        {b.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">{b.devoteeName}</span>
                      {b.user?.name && b.user.name !== b.devoteeName && ` (${b.user.name})`}
                      {b.user?.email && <span className="ml-1 opacity-70">• {b.user.email}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Booked {formatDateShort(b.createdAt)} • Puja date: {formatDateShort(b.date)}
                    </p>
                  </div>
                  <p className="font-heading text-saffron text-base shrink-0">{formatCurrency(b.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted-foreground w-20 shrink-0">{label}</dt>
      <dd className="text-foreground flex items-center gap-1 break-all">
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        {value}
      </dd>
    </div>
  );
}
