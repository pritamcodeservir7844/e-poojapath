"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { IBooking } from "@/types";

interface UserDashboardClientProps {
  initialBookings: (IBooking & { _id: string })[];
}

export function UserDashboardClient({ initialBookings }: UserDashboardClientProps) {
  const [bookings, setBookings] = useState<(IBooking & { _id: string })[]>(initialBookings);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let active = true;

    const interval = setInterval(async () => {
      try {
        setIsSyncing(true);
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error("Failed to fetch");
        
        const resData = await res.json();
        if (resData.success && active) {
          setBookings(resData.data);
        }
      } catch (err) {
        console.error("Error updating dashboard data:", err);
      } finally {
        setTimeout(() => {
          if (active) setIsSyncing(false);
        }, 800);
      }
    }, 6000); // Poll every 6 seconds to keep dashboard dynamic and fresh

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const paid      = bookings.filter((b) => b.paymentStatus === "paid").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const pending   = bookings.filter((b) => b.status === "pending").length;

  return (
    <>
      {/* Live status synchronization indicator */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 text-xs font-medium bg-saffron/5 text-saffron px-3 py-1.5 rounded-full border border-saffron/10 shadow-sm">
          <span className={`w-2.5 h-2.5 rounded-full ${isSyncing ? "bg-amber-500 animate-spin" : "bg-green-500 animate-pulse"}`} />
          <span>{isSyncing ? "Syncing..." : "Live Connection Active"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📿" label="Total Bookings"    value={bookings.length} />
        <StatCard icon="✅" label="Completed"          value={completed}       accent="border-l-green-500" />
        <StatCard icon="⏳" label="Pending"            value={pending}         accent="border-l-yellow-500" />
        <StatCard icon="💳" label="Paid Bookings"      value={paid}            accent="border-l-lotus-blue" />
      </div>

      <div className="card-devotional">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl text-foreground">Recent Bookings</h2>
          <Link href="/user/bookings" className="text-saffron text-sm hover:underline">View all →</Link>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🛕</p>
            <p className="text-muted-foreground">No bookings yet.</p>
            <Link href="/puja" className="btn-saffron mt-4 inline-block text-sm py-2 px-5">Book a Puja</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <Link key={b._id.toString()} href={`/user/bookings/${b._id}`}
                className="flex items-center justify-between p-3 bg-background hover:bg-saffron/5 rounded-xl border border-deep-gold/10 hover:border-saffron/20 transition-all">
                <div>
                  <p className="font-medium text-foreground text-sm">{b.serviceName}</p>
                  <p className="text-xs text-saffron font-semibold mb-0.5">
                    🛕 {typeof (b as any).temple === "object" ? (b as any).temple.name : "Temple"}
                  </p>
                  {b.selectedPackage && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      📦 Package: {b.selectedPackage}
                    </p>
                  )}
                  {b.selectedChadawa && b.selectedChadawa.length > 0 && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      🌸 Offerings: {b.selectedChadawa.map((c: any) => `${c.name} (x${c.qty})`).join(", ")}
                    </p>
                  )}
                  {b.selectedItems && b.selectedItems.length > 0 && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      🌸 Offerings: {b.selectedItems.map((c: any) => `${c.name} (x${c.qty})`).join(", ")}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{formatDateShort(b.date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-saffron font-medium text-sm">{formatCurrency(b.amount)}</span>
                  <Badge variant={({ pending: "pending", confirmed: "approved", completed: "completed", cancelled: "cancelled" } as any)[b.status] || "pending"}>{b.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
