"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { devToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";
import { Clock, CheckCircle2, Sparkles } from "lucide-react";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export default function BookPujaPage({ params }: { params: { slug: string; id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [puja, setPuja] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState({ devoteeName: "", gotra: "", sankalp: "", date: "", prasadDelivery: false, prasadAddress: "" });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    fetch(`/api/pujas/${params.id}`).then((r) => r.json()).then((d) => setPuja(d.data));
  }, [params.id]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { router.push("/login"); return; }
    setLoading(true);
    try {
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: puja?.price, notes: { pujaName: puja?.name, templeSlug: params.slug } }),
      });
      const orderData = await orderRes.json();

      new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: (puja?.price as number) * 100,
        currency: "INR",
        name: "ePoojapaath",
        description: puja?.name as string,
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
              body: JSON.stringify({ ...form, temple: puja?.temple, service: params.id, serviceType: "puja", serviceName: puja?.name, serviceNameHi: puja?.nameHi, amount: puja?.price, orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id }),
            });
            setBooked(true);
            devToast.blessing("🙏 Puja Booked! Divine blessings incoming...");
            setTimeout(() => router.push("/user/bookings"), 3000);
          }
        },
      }).open();
    } catch { devToast.error("Booking failed. Please try again."); }
    finally { setLoading(false); }
  }

  if (!puja) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="text-4xl animate-float">🛕</div></div>;

  return (
    <div className="min-h-screen bg-cream pt-20">
      {booked && <ReactConfetti recycle={false} numberOfPieces={400} colors={["#D4820A","#B8860B","#8B6DB5","#C2567A"]} />}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Puja Details */}
          <div>
            <div className="relative h-56 rounded-2xl overflow-hidden mb-6 ring-2 ring-deep-gold/30">
              <Image src={puja.image as string || "/placeholder-puja.jpg"} alt={puja.name as string} fill className="object-cover" />
            </div>
            <h1 className="font-heading text-3xl text-dark mb-1">{puja.name as string}</h1>
            <p className="font-sanskrit text-saffron mb-4">{puja.nameHi as string}</p>
            <p className="text-muted mb-4">{puja.description as string}</p>
            <div className="flex items-center gap-4 text-sm text-muted mb-6">
              <span className="flex items-center gap-1"><Clock size={14} /> {puja.duration as string}</span>
            </div>
            {Array.isArray(puja.benefits) && puja.benefits.length > 0 && (
              <div className="card-devotional mb-4">
                <h3 className="font-heading text-lg text-dark mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {(puja.benefits as string[]).map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-muted">
                      <CheckCircle2 size={14} className="text-saffron shrink-0" />{b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(puja.includes) && puja.includes.length > 0 && (
              <div className="card-devotional">
                <h3 className="font-heading text-lg text-dark mb-3">What&apos;s Included</h3>
                <ul className="space-y-2">
                  {(puja.includes as string[]).map((inc) => (
                    <li key={inc} className="flex items-center gap-2 text-sm text-muted">
                      <Sparkles size={14} className="text-saffron shrink-0" />{inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBook} className="card-devotional h-fit space-y-4">
            <h2 className="font-heading text-2xl text-dark">Book This Puja</h2>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Devotee Name *</label>
              <input required className="input-devotional w-full" placeholder="Name for Sankalp" value={form.devoteeName} onChange={(e) => setForm({ ...form, devoteeName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Gotra (Optional)</label>
              <input className="input-devotional w-full" placeholder="e.g. Kashyap, Bharadwaj" value={form.gotra} onChange={(e) => setForm({ ...form, gotra: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Sankalp / Intention</label>
              <textarea rows={3} className="input-devotional w-full resize-none" placeholder="Your wish or prayer intention..." value={form.sankalp} onChange={(e) => setForm({ ...form, sankalp: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Puja Date *</label>
              <input type="date" required className="input-devotional w-full" min={new Date().toISOString().split("T")[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="prasad" className="w-4 h-4 accent-saffron" checked={form.prasadDelivery} onChange={(e) => setForm({ ...form, prasadDelivery: e.target.checked })} />
              <label htmlFor="prasad" className="text-sm text-dark cursor-pointer">Request Prasad Delivery (+₹99)</label>
            </div>
            {form.prasadDelivery && (
              <textarea rows={2} className="input-devotional w-full resize-none" placeholder="Delivery address..." value={form.prasadAddress} onChange={(e) => setForm({ ...form, prasadAddress: e.target.value })} />
            )}
            <div className="border-t border-deep-gold/20 pt-4">
              <div className="flex justify-between text-sm mb-1"><span className="text-muted">Puja Fee</span><span className="text-dark font-medium">{formatCurrency(puja.price as number)}</span></div>
              {form.prasadDelivery && <div className="flex justify-between text-sm mb-1"><span className="text-muted">Prasad Delivery</span><span className="text-dark">₹99</span></div>}
              <div className="flex justify-between font-heading text-xl mt-2"><span className="text-dark">Total</span><span className="text-saffron">{formatCurrency((puja.price as number) + (form.prasadDelivery ? 99 : 0))}</span></div>
            </div>
            <button type="submit" disabled={loading} className="btn-saffron w-full py-4 text-lg disabled:opacity-60">
              {loading ? "Processing... 🪔" : `Proceed to Pay ${formatCurrency((puja.price as number) + (form.prasadDelivery ? 99 : 0))}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
