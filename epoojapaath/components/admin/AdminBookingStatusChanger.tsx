"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { devToast } from "@/lib/toast";

interface AdminBookingStatusChangerProps {
  bookingId: string;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function AdminBookingStatusChanger({ bookingId, currentStatus }: AdminBookingStatusChangerProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStatusChange(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(newStatus);
        devToast.success(`Status updated to ${newStatus} ✓`);
        router.refresh();
      } else {
        devToast.error(data.error || "Failed to update status");
      }
    } catch {
      devToast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs text-muted-foreground font-medium">Change Status:</span>
      <select
        value={status}
        disabled={loading}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="bg-background border border-deep-gold/20 text-foreground rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-saffron transition cursor-pointer font-medium"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
