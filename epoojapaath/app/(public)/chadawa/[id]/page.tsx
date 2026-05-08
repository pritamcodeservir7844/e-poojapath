"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { PublicPage } from "@/components/shared/PublicPage";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";
import { Flower2, CheckCircle2 } from "lucide-react";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export default function ChadawaDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [item, setItem] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState({ devoteeName: "", gotra: "", sankalp: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [offered, setOffered] = useState(false);

  useEffect(() => {
    fetch(`/api/chadawa/${params.id}`).then((r) => r.json()).then((d) => setItem(d.data));
  }, [params.id]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  async function handleOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { router.push("/login"); return; }
    setLoading(true);
    try {
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: item?.price, notes: { chadawaName: item?.name } }),
      });
      const orderData = await orderRes.json();

      new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: (item?.price as number) * 100,
        currency: "INR",
        name: "ePoojapaath",
        description: item?.name as string,
        order_id: orderData.data.id,
        theme: { color: "#D4820A" },
        prefill: { name: session.user?.name, email: session.user?.email },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            await fetch("/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...form, temple: item?.temple, service: params.id, serviceType: "chadawa", serviceName: item?.name, serviceNameHi: item?.nameHi, amount: item?.price, orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id }),
            });
            setOffered(true);
            devToast.blessing("🌸 Chadawa Offered! May the divine bless you...");
            setTimeout(() => router.push("/user/bookings"), 3000);
          }
        },
      }).open();
    } catch { devToast.error("Offering failed. Please try again."); }
    finally { setLoading(false); }
  }

  if (!item) {
    return (
      <PublicPage>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-4xl animate-float">🌸</div>
        </div>
      </PublicPage>
    );
  }

  return (
    <PublicPage>
      {offered && <ReactConfetti recycle={false} numberOfPieces={400} colors={["#D4820A", "#B8860B", "#8B6DB5", "#C2567A"]} />}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Chadawa Details */}
          <div>
            <div className="relative h-56 rounded-2xl overflow-hidden mb-6 ring-2 ring-deep-gold/30">
              <Image src={item.image as string || "/placeholder-chadawa.jpg"} alt={item.name as string} fill className="object-cover" />
            </div>
            <h1 className="font-heading text-3xl text-foreground mb-1">{item.name as string}</h1>
            <p className="font-sanskrit text-saffron mb-4">{item.nameHi as string}</p>
            <p className="text-muted-foreground mb-6">{item.description as string}</p>

            {Array.isArray(item.items) && item.items.length > 0 && (
              <div className="card-devotional">
                <h3 className="font-heading text-lg text-foreground mb-3">Offering Includes</h3>
                <ul className="space-y-2">
                  {(item.items as string[]).map((inc) => (
                    <li key={inc} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={14} className="text-saffron shrink-0" />{inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
              <Flower2 size={16} className="text-lotus-pink" />
              <span>Deity: <span className="font-medium text-foreground">{item.deity as string}</span></span>
            </div>
          </div>

          {/* Offering Form */}
          <form onSubmit={handleOffer} className="card-devotional h-fit space-y-4">
            <h2 className="font-heading text-2xl text-foreground">Make an Offering</h2>
            <Input
              label="Devotee Name"
              required
              placeholder="Name for Sankalp"
              value={form.devoteeName}
              onChange={(e) => setForm({ ...form, devoteeName: e.target.value })}
            />
            <Input
              label="Gotra (Optional)"
              placeholder="e.g. Kashyap, Bharadwaj"
              value={form.gotra}
              onChange={(e) => setForm({ ...form, gotra: e.target.value })}
            />
            <Textarea
              label="Sankalp / Wish"
              rows={3}
              placeholder="Your prayer or intention..."
              value={form.sankalp}
              onChange={(e) => setForm({ ...form, sankalp: e.target.value })}
            />
            <Input
              label="Offering Date"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <div className="border-t border-deep-gold/20 pt-4">
              <div className="flex justify-between font-heading text-xl">
                <span className="text-foreground">Total</span>
                <span className="text-saffron">{formatCurrency(item.price as number)}</span>
              </div>
            </div>
            <Button type="submit" loading={loading} fullWidth size="lg">
              {loading ? "Processing... 🌸" : `Offer Now ${formatCurrency(item.price as number)}`}
            </Button>
          </form>
        </div>
      </div>
    </PublicPage>
  );
}
