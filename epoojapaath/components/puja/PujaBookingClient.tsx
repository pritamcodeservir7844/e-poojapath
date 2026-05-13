"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { PujaPackageModal } from "./PujaPackageModal";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";
import type { IPuja, IPujaPackage } from "@/types";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

interface Props {
  puja: IPuja & { _id: string };
}

export function PujaBookingClient({ puja }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showPackages, setShowPackages] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<IPujaPackage | null>(
    puja.packages?.[0] ?? null
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    devoteeName: "",
    gotra: "",
    sankalp: "",
    date: "",
    prasadDelivery: false,
    prasadAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const effectivePrice = selectedPkg
    ? selectedPkg.price
    : puja.price;

  function handleParticipate() {
    if (puja.packages && puja.packages.length > 0) {
      setShowPackages(true);
    } else {
      setShowForm(true);
    }
  }

  function handlePackageSelect(pkg: IPujaPackage) {
    setSelectedPkg(pkg);
    setShowPackages(false);
    setShowForm(true);
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { router.push("/login"); return; }
    setLoading(true);
    try {
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectivePrice + (form.prasadDelivery ? 99 : 0),
          notes: { pujaName: puja.name },
        }),
      });
      const orderData = await orderRes.json();

      new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: (effectivePrice + (form.prasadDelivery ? 99 : 0)) * 100,
        currency: "INR",
        name: "ePoojapaath",
        description: puja.name,
        order_id: orderData.data.id,
        theme: { color: "#D4820A" },
        prefill: { name: session.user?.name, email: session.user?.email },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            await fetch("/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...form,
                temple: typeof puja.temple === "object" ? puja.temple._id : puja.temple,
                service: puja._id,
                serviceType: "puja",
                serviceName: puja.name,
                serviceNameHi: puja.nameHi,
                amount: effectivePrice + (form.prasadDelivery ? 99 : 0),
                selectedPackage: selectedPkg?.label,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              }),
            });
            setBooked(true);
            devToast.blessing("🙏 Puja Booked! Divine blessings incoming...");
            setTimeout(() => router.push("/user/bookings"), 3000);
          }
        },
      }).open();
    } catch {
      devToast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {booked && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={400}
          colors={["#D4820A", "#B8860B", "#8B6DB5", "#C2567A"]}
        />
      )}

      {showPackages && puja.packages && (
        <PujaPackageModal
          packages={puja.packages}
          pujaName={puja.name}
          onSelect={handlePackageSelect}
          onClose={() => setShowPackages(false)}
        />
      )}

      {/* CTA sticky section */}
      <div className="sticky bottom-0 z-30 bg-background/95 backdrop-blur border-t border-border px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {selectedPkg ? selectedPkg.persons : "Starting from"}
            </p>
            <p className="font-heading text-xl text-saffron">
              {formatCurrency(effectivePrice)}
            </p>
          </div>
          <button
            onClick={handleParticipate}
            className="btn-saffron flex-1 py-3 text-sm font-semibold"
          >
            Participate Now 🪔
          </button>
        </div>
      </div>

      {/* Desktop sidebar booking card */}
      {!showForm ? (
        <div className="hidden md:block card-devotional sticky top-24">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">
              {selectedPkg ? selectedPkg.persons : "Starting from"}
            </p>
            <p className="font-heading text-3xl text-saffron">
              {formatCurrency(effectivePrice)}
            </p>
          </div>

          {puja.packages && puja.packages.length > 0 && (
            <div className="space-y-2 mb-4">
              {puja.packages.map((pkg) => (
                <button
                  key={pkg.label}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all ${
                    selectedPkg?.label === pkg.label
                      ? "border-saffron bg-saffron/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-saffron/40"
                  }`}
                >
                  <span className="font-medium">{pkg.label}</span>
                  <span className="text-xs text-muted-foreground">{pkg.persons}</span>
                  <span className="font-heading text-saffron">{formatCurrency(pkg.price)}</span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowForm(true)}
            className="btn-saffron w-full py-3 text-base font-semibold"
          >
            Participate Now 🪔
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleBook}
          className="hidden md:block card-devotional sticky top-24 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading text-lg text-foreground">Book This Puja</h3>
            {selectedPkg && (
              <span className="text-xs bg-saffron/10 text-saffron px-2 py-1 rounded-full">
                {selectedPkg.label} — {formatCurrency(selectedPkg.price)}
              </span>
            )}
          </div>
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
            label="Sankalp / Intention"
            rows={2}
            placeholder="Your wish or prayer..."
            value={form.sankalp}
            onChange={(e) => setForm({ ...form, sankalp: e.target.value })}
          />
          <Input
            label="Puja Date"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="prasad-d"
              className="w-4 h-4 accent-saffron"
              checked={form.prasadDelivery}
              onChange={(e) => setForm({ ...form, prasadDelivery: e.target.checked })}
            />
            <label htmlFor="prasad-d" className="text-sm text-foreground cursor-pointer">
              Prasad Delivery (+₹99)
            </label>
          </div>
          {form.prasadDelivery && (
            <Textarea
              rows={2}
              placeholder="Delivery address..."
              value={form.prasadAddress}
              onChange={(e) => setForm({ ...form, prasadAddress: e.target.value })}
            />
          )}
          <div className="border-t border-deep-gold/20 pt-3">
            <div className="flex justify-between font-heading text-lg">
              <span className="text-foreground">Total</span>
              <span className="text-saffron">
                {formatCurrency(effectivePrice + (form.prasadDelivery ? 99 : 0))}
              </span>
            </div>
          </div>
          <Button type="submit" loading={loading} fullWidth size="lg">
            {loading ? "Processing... 🪔" : "Confirm & Pay"}
          </Button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="w-full text-xs text-muted-foreground hover:text-foreground text-center mt-1"
          >
            ← Change package
          </button>
        </form>
      )}
    </>
  );
}
